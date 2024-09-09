import * as React from 'react';
import {getStaffUsers} from "../actions";
import { connect } from 'react-redux'
import {Row, Col} from "react-bootstrap";
import AddStaff from "../components/AddStaff";
import {Link} from "react-router-dom";


class ListStaff extends React.Component {
	constructor(props) {
		super(props);
		this.isAdmin = localStorage.getItem('isAdmin');

		this.state = {
			openAddNewStaff: false
		};
	}


	renderDate = (date) => {
		date = new Date(date)
		let formattedDate = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) +'/'+(date.getMonth() < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+'/'+date.getFullYear().toString().substr(2,2);
		formattedDate += ' ' + date.toLocaleTimeString('en-GB', { hour12: false,  timeStyle: 'short' });

		return formattedDate
	}


	renderStaffList = () => {
		if(!this.props.staffUsers || this.props.staffUsers.length === 0) {
			return;
		}

		return this.props.staffUsers.map((staff, i) => {
			return (
				<tr key={i}>
					<td>{staff.id}</td>
					<td>{staff.name}</td>
					<td>{staff.email}</td>
					<td>{staff.allowedCities}</td>
					<td>{this.renderDate(staff.created_at.date)}</td>
					<td><Link onClick={() => this.editStaff(staff)}>Edit</Link></td>
				</tr>
			)
		})
	};

	editStaff = (staff) => {
		this.setState({
			editStaff: true,
			editData: staff
		}, ()=>{
		})
	};

	openAddNewStaff = () => {
		this.setState({
			openAddNewStaff: true
		})
	};

	closeAddNewStaff = (newCall) => {
		this.setState({
			openAddNewStaff: false,
			editStaff: false,
			editData:{}
		},()=> {
			if (newCall) {
				this.props.getStaffUsers();
			}
		})
	};


	render() {
		return (
			<React.Fragment>
				{this.state.openAddNewStaff && <AddStaff closeAddNewStaff={this.closeAddNewStaff}/>}
				{this.state.editStaff && <AddStaff isEdit={true} staffData={this.state.editData} closeAddNewStaff={this.closeAddNewStaff}/>}
				<Row className="justify-content-center text-center">
					<Col lg={"8"}>
						<Row>
							<Col lg="12">
								<div>Staff list</div>
								<table>
									<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Email</th>
										<th>Cities</th>
										<th>Created At</th>
									</tr>
									</thead>
									<tbody>
									{this.renderStaffList()}
									</tbody>
								</table>
							</Col>
							&nbsp;
							<Col lg="12" className="mt-2">
								<button className="btn btn-secondary" onClick={this.openAddNewStaff}>Add new user</button>
							</Col>
						</Row>

					</Col>
				</Row>

			</React.Fragment>

		)
	}

	componentDidMount() {
		if(this.isAdmin) this.props.getStaffUsers();
	}
}

const mapStateToProps = state => {
	return {
		staffUsers:state.staffUsers
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getStaffUsers: () => dispatch(getStaffUsers())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ListStaff)