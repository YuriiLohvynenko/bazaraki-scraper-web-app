import React from 'react';
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import ListingTable from "../components/ListingTable";
import LoadingIcon from "../components/LoadingIcon";
import { connect } from 'react-redux'
import StatusGroup from '../components/StatusGroup';
import {loadStaffLoginHistory} from "../actions";
import {Col, Modal, Row} from "react-bootstrap";

class StaffLoginList extends React.Component {
	componentDidMount() {
		const { page } = this.props.match.params;

		this.props.loadStaffLoginHistory(page, 20);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { page } = this.props.match.params;

		if (prevProps.match.params.page !== page) {

			this.props.loadStaffLoginHistory(page, this.listSize);
		}
	}
	renderDate = (date) => {
		date = new Date(date)
		let formattedDate = date.toLocaleDateString('en-GB');
		formattedDate += ' ' + date.toLocaleTimeString('en-GB', { hour12: false,  timeStyle: 'short' });

		return formattedDate
	}

	renderStaffList = () => {
		if (this.props.staffLoginHistory && this.props.staffLoginHistory.length > 0) {
			return this.props.staffLoginHistory.map(data => {
				return (
					<tr>
						<td>{data.id}</td>
						<td>{data.name}</td>
						<td>{this.renderDate(data.loggedInAt.date)}</td>
						<td>{data.ip}</td>
					</tr>
				)
			})
		}

	}

	render() {
		return (

					<Row className="justify-content-center text-center">
						<Col lg={"8"}>
							<Row>
								<Col lg="12">
									<div>Staff list</div>
									<table>
										<thead>
										<tr>
											<th>ID</th>
											<th>Staff name</th>
											<th>Logged in Time</th>
											<th>IP Address</th>
										</tr>
										</thead>
										<tbody>
										{this.renderStaffList()}
										</tbody>
									</table>
								</Col>
							</Row>
							<Pagination
								page={'staffloginlist'}
								perPage={this.props.perPage}
								history={this.props.history}
								totalCount={this.props.totalCount}
								currentPage={this.props.currentPage}
								changePage={this.props.loadStaffLoginHistory} />
						</Col>

					</Row>

		)
	}
}

const mapStateToProps = state => {
	return {
		staffLoginHistory: state.staffLoginHistory,
		totalCount: state.totalStaffLoginCount,
		perPage: state.perPage,
		currentPage: state.currentPage
	}
};

const mapDispatchToProps = dispatch => {
	return {

		loadStaffLoginHistory: (pageNum, size) => dispatch(loadStaffLoginHistory(pageNum, size)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLoginList)
