import * as React from 'react';
import {getStaffStatusCount, getStaffUsers} from "../actions";
import { connect } from 'react-redux'
import {Row, Col} from "react-bootstrap";
import AddStaff from "../components/AddStaff";
import {Link} from "react-router-dom";
import MultiSelect from "react-multi-select-component";


class StaffPerformance extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddNewStaff: false,
			assignedTo:[],
			staffStatusUserCount: {}
		}
		this.successStatus = [
			"Answered, agent split commission",
			"Answered, listing added",
			"Answered, already rented, listing added for future"
		];
		this.failureStatus = [
			"No answer, try again later",
			"Answered, agent",
			"Answered, not interested",
			"Failed multiple times, or phone number incorrect"

		];
		this.assignedTo = [{label:"test", value:"test"}];
		this.staffCount = {};
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.staffUsers !== this.props.staffUsers) {
			if (this.props.staffUsers && this.props.staffUsers.length > 0) {
				let assignedTo = {
					assignedTo : []
				}, assignedToState = [];
				this.assignedTo = this.props.staffUsers.map((user, i) => {
					//if (i<= 5) {
						assignedToState.push({label: user.name, value: user.name});
						assignedTo.assignedTo.push(user.name)
					//}
					return {label: user.name, value: user.name}
				})

				this.setState({
					assignedTo: assignedToState
				})

				this.props.getStaffStatusCount(assignedTo);

				this.forceUpdate()
			}
		}
		if (prevProps.staffStatusCount !== this.props.staffStatusCount) {
			if (this.props.staffStatusCount && this.props.staffStatusCount.length > 0) {
				let staffCount = {};
				let successCount = 0 ;
				let failureCount = 0 ;
				let totalCount = 0;
				let totalStatusCount = {
					success:0,
					failure:0,
					pending:0,
					total:0
				};
				this.successStatus.map(status => {
					staffCount[status] = {};
					this.props.totalStatusCount.map(data => {
						if (status === data.status) {
							totalStatusCount.total = totalStatusCount.total+parseInt(data.statusCount);
							totalStatusCount.success = totalStatusCount.success+parseInt(data.statusCount);
						}
					})
					this.props.staffStatusCount.map(data => {
						if (status === data.status) {
							staffCount[status][data.assignedTo] = data.statusCount;
						}
					})
					this.setState({
						staffCount: staffCount,
						totalStatusCountValue:totalStatusCount
					})
				})
				this.failureStatus.map(status => {
					staffCount[status] = {};
					this.props.totalStatusCount.map(data => {
						if (status === data.status) {
							totalStatusCount.total = totalStatusCount.total+parseInt(data.statusCount);
							totalStatusCount.failure = totalStatusCount.failure+parseInt(data.statusCount);
						}
					})
					this.props.staffStatusCount.map(data => {
						if (status === data.status) {
							staffCount[status][data.assignedTo] = data.statusCount;
						}
					})
					this.setState({
						staffCount: staffCount,
						totalStatusCountValue:totalStatusCount
					})
				})
			}
		}

		if (prevState.staffCount !== this.state.staffCount) {
			let statuses = this.successStatus.concat(this.failureStatus);
			let staffCount = {};

			statuses.map(status => {

				this.state.assignedTo.map((user, i) => {
					if (!staffCount[user.value]){
						staffCount[user.value] = {
							success: 0,
							failure: 0,
							total: 0,
							pending:0
						};
					}
					if (this.state.staffCount[status][user.value]) {
						staffCount[user.value].total = staffCount[user.value].total  + parseInt(this.state.staffCount[status][user.value]);
						//staffCount['total'].total = staffCount[user.value].total  + parseInt(this.state.staffCount[status][user.value]);
						if (status === "Answered, agent split commission"
							|| status === "Answered, listing added"
							|| status === "Answered, already rented, listing added for future"){
							//staffCount['total'].success = staffCount[user.value].success + parseInt(this.state.staffCount[status][user.value]);
							staffCount[user.value].success = staffCount[user.value].success + parseInt(this.state.staffCount[status][user.value]);
						}
						else if(
							status === "No answer, try again later"
							|| status === "Answered, not interested"
							|| status === "Failed multiple times, or phone number incorrect"){
							staffCount[user.value].failure = staffCount[user.value].failure + parseInt(this.state.staffCount[status][user.value]);
							//staffCount['total'].failure = staffCount[user.value].failure + parseInt(this.state.staffCount[status][user.value]);

						}
						else {
							staffCount[user.value].pending = staffCount[user.value].pending + parseInt(this.state.staffCount[status][user.value]);
							//staffCount['total'].pending = staffCount[user.value].pending + parseInt(this.state.staffCount[status][user.value]);
						}
						staffCount[user.value].successPercent = parseFloat((staffCount[user.value].success / staffCount[user.value].total) * 100).toFixed(2);
						//staffCount['total'].successPercent = parseFloat((staffCount[user.value].success / staffCount[user.value].total) * 100).toFixed(2);
						staffCount[user.value].failurePercent = parseFloat((staffCount[user.value].failure / staffCount[user.value].total) * 100).toFixed(2);
						//staffCount['total'].failurePercent = parseFloat((staffCount[user.value].failure / staffCount[user.value].total) * 100).toFixed(2);
					}
				})

			})
			this.setState({
				staffStatusCount: staffCount
			}, () => {
			})
		}
	}
	renderEachStatusCount = (status) =>{
		let assignedTo = [...this.state.assignedTo]
		return assignedTo.map((user, i) => {
			let percent = '';
			if (this.state.staffStatusCount && this.state.staffStatusCount[user.value] && this.state.staffStatusCount[user.value].total && this.state.staffCount[status][user.value]) {
				percent =  (parseInt(this.state.staffCount[status][user.value])/parseInt(this.state.staffStatusCount[user.value].total))*100;
			}
			return <td key={i}>{this.state.staffCount[status][user.value] || 0} {percent && ' ('+parseFloat(percent).toFixed(2) + '%)'}</td>
		})
	};

	renderEachSuccessCount = () => {
		if (!this.state.staffStatusCount || !this.state.staffStatusCount) return
		let assignedTo = [...this.state.assignedTo]

		return assignedTo.map((user,i)=>{
			if (!this.state.staffStatusCount[user.value]) return
			return (
				<td>{this.state.staffStatusCount[user.value]['success'] } ({this.state.staffStatusCount[user.value]['successPercent']? this.state.staffStatusCount[user.value]['successPercent'] : 0}%)</td>
			)
		})
	}
	renderEachFailureCount = () => {
		if (!this.state.staffStatusCount) return
		let assignedTo = [...this.state.assignedTo]

		return assignedTo.map((user,i)=>{
			if (!this.state.staffStatusCount[user.value]) return
			return (
				<td>{this.state.staffStatusCount[user.value]['failure']} ({this.state.staffStatusCount[user.value]['failurePercent']? this.state.staffStatusCount[user.value]['failurePercent'] : 0}%)</td>
			)
		})
	}
	renderEachTotalCount = () => {
		if (!this.state.staffCount || !this.state.assignedTo) return ;
		let assignedTo = [...this.state.assignedTo]

		return assignedTo.map((user,i)=>{
			if (!this.state.staffStatusCount[user.value]) return

			return (
				<td>{this.state.staffStatusCount[user.value]['total']} ({this.state.staffStatusCount[user.value]['total']? 100 : 0}%) </td>
			)
		})
	}

	renderStatusTotalCount = (status) => {
		let hasArrayValue = false;
		let data = this.props.totalStatusCount.map(data => {
			if (data.status === status) {
				let percent = '';
				if (this.state.totalStatusCountValue && this.state.totalStatusCountValue['total'] && data.statusCount) {
					percent =  (parseInt(data.statusCount)/parseInt(this.state.totalStatusCountValue['total']))*100;
				}
				return (<td>{data.statusCount} {percent && ' ('+parseFloat(percent).toFixed(2) + '%)'}</td>)
			}
		})

		data.map(d => {
			if(d) {
				hasArrayValue = true;
			}
		});

		if (hasArrayValue) {
			return data;
		}
		return  (<td>0</td>)
	}

	renderStaffStaus = () => {
		if (!this.state.staffCount) return ;
		this.staffCount = {};
		return this.successStatus.map((status, i) => {
			return (
				<React.Fragment>
					<tr key={i}>
						<td>{status}</td>
						{this.renderStatusTotalCount(status)}
						{this.renderEachStatusCount(status)}
					</tr>

				</React.Fragment>

			)
		})
	};

	renderStaffFailureStaus = () => {
		if (!this.state.staffCount) return ;
		//this.staffCount = {};
		return this.failureStatus.map((status, i) => {
			return (
				<React.Fragment>
					<tr key={i}>
						<td>{status}</td>
						{this.renderStatusTotalCount(status)}

						{this.renderEachStatusCount(status)}
					</tr>

				</React.Fragment>

			)
		})
	};
	AssignedToMultiSelect = (selectedList, selectedItem) => {
		this.setState({
			assignedTo: selectedList
		}, () => {
			let selectedUser = {
				assignedTo: selectedList.map(user => user.value)
			};
			this.props.getStaffStatusCount(selectedUser);
		})
	};

	renderUserHeader = () => {
		let assignedTo = [{value:"total"},...this.state.assignedTo];
		return assignedTo.map(user => <th>{user.value} (%)</th>)
	};

	renderSuccessCount = () => {
		if(this.state.staffStatusCount && Object.keys(this.state.staffStatusCount).length !== 0) {

			return (<React.Fragment>
				<tr className="bg-success text-white">
					<td>Success Count</td>
					<td>{this.state.totalStatusCountValue['success']} ({this.state.totalStatusCountValue['total']? (parseFloat((this.state.totalStatusCountValue['success'] / this.state.totalStatusCountValue['total']) * 100).toFixed(2)) : 0}%)</td>
					{this.renderEachSuccessCount()}
				</tr>

			</React.Fragment>	)
		}

	}

	renderFailureCount = () => {
		if(this.state.staffStatusCount && Object.keys(this.state.staffStatusCount).length !== 0) {
			return (<React.Fragment>

				<tr className="bg-danger text-white">
					<td>Unconverted Count</td>
					<td>{this.state.totalStatusCountValue['failure']} ({this.state.totalStatusCountValue['total']? (parseFloat((this.state.totalStatusCountValue['failure'] / this.state.totalStatusCountValue['total']) * 100).toFixed(2)) : 0}%)</td>

					{this.renderEachFailureCount()}
				</tr>

			</React.Fragment>	)
		}

	}

	renderTotalCount = () => {
		if(this.state.staffStatusCount && Object.keys(this.state.staffStatusCount).length !== 0) {
			return (<React.Fragment>

				<tr className="bg-info text-white">
					<td>Total Count</td>
					<td>{this.state.totalStatusCountValue['total']} ({this.state.totalStatusCountValue['total']? 100 : 0}%)</td>
					{this.renderEachTotalCount()}
				</tr>
			</React.Fragment>	)
		}

	}
	render() {
		return (
			<React.Fragment>
				<Row className="justify-content-center text-center">
					<Col lg={"8"}>
						<Row>
							<Col lg="12">
								<div>Staff list</div>
								<div className="filter-card">
									<p>Assigned to</p>
									<MultiSelect options={this.assignedTo} onChange={this.AssignedToMultiSelect} value={this.state.assignedTo} labelledBy={'select'}/>
								</div>
								<table className="table-bordered table-striped">
									<thead>
									{this.state.staffCount &&
										<React.Fragment>
										<th>Status</th>
											{this.renderUserHeader()}
										</React.Fragment>
									}
									</thead>
									<tbody>
									{this.renderStaffStaus()}
									{this.renderSuccessCount()}
									{this.renderStaffFailureStaus()}
									{this.renderFailureCount()}
									{this.renderTotalCount()}
									</tbody>
								</table>
							</Col>
						</Row>
					</Col>
				</Row>

			</React.Fragment>

		)
	}

	componentDidMount() {
		this.props.getStaffUsers();
		setInterval(() => {
			//this.forceUpdate();
		}, 2000)
	}
}

const mapStateToProps = state => {
	return {
		staffStatusCount:state.staffStatusCount && state.staffStatusCount.staff,
		totalStatusCount: state.staffStatusCount && state.staffStatusCount.total,
		staffUsers:state.staffUsers,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getStaffUsers: () => dispatch(getStaffUsers()),
		getStaffStatusCount: (assignedTo) => dispatch(getStaffStatusCount(assignedTo))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffPerformance)