import * as React from 'react';
import {listingPhone} from "../actions";
import { connect } from 'react-redux'
import {Row, Col, Button} from "react-bootstrap";
import AddStaff from "../components/AddStaff";
import {Link} from "react-router-dom";
import Pagination from "../components/Pagination";


class PhoneNumberListing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orderBy: 'ascending'
		};
		let searchParam = decodeURI(this.props.history.location.search).replace('?','');

		searchParam = searchParam.split("&");
		let splitAndMerge = (str) => {
			let arr = str.split(',');
			return arr.map(data => {
				return {label: data, value: data}
			})
		}
		searchParam.map(param => {
			let searchData = param.split("=")
			if ((searchData[0] === 'cities'
				|| searchData[0] === 'assignedTo'
				|| searchData[0] === 'propertyType'
				|| searchData[0] === 'bedrooms'
				|| searchData[0] === 'bathrooms'
				|| searchData[0] === 'status'|| searchData[0] === 'areas') && searchData[1].length > 0) {
				this.state[searchData[0]] =splitAndMerge(searchData[1]);

			}else {
				this.state[searchData[0]] = searchData[1];
			}
		})
	}



	renderStaffList = () => {
		if(!this.props.listings || this.props.listings.length === 0) {
			return;
		}

		return this.props.listings.map((staff, i) => {
			return (
				<tr key={i}>
					<td><Link target={'_blank'} to={'/r/?listedByType=&phoneNumber='+staff.phoneNumber} >{staff.phoneNumber}</Link></td>
					<td>{staff.name}</td>
					<td>{staff.count}</td>
				</tr>
			)
		})
	};

	redirectBySort = () => {
		let BASE_URL = "/r/listingphone";

		if(process.env.REACT_APP_DEV == 1) {
			BASE_URL = "/r2/listingphone";
		}

		let	queryString = "?orderBy=decending";
		if (this.state.orderBy === 'decending') {
			queryString = "?orderBy=ascending";
		}
		window.location.href  = BASE_URL+queryString;

	}

	render() {
		return (
			<React.Fragment>
				<Row className="justify-content-center text-center">
					<Col lg={"8"}>
						<Row>
							<Col lg="12" ><Button className="float-right" onClick={this.redirectBySort}>{this.state.orderBy}</Button></Col>
							<Col lg="12">
								<div>Staff list</div>
								<table>
									<thead>
									<tr>
										<th>Phone Number</th>
										<th>Name</th>
										<th>Count</th>
									</tr>
									</thead>
									<tbody>
									{this.renderStaffList()}
									</tbody>
								</table>
							</Col>

						</Row>

					</Col>
				</Row>
				<Pagination
					page={'listingphone'}
					perPage={this.props.perPage}
					totalCount={this.props.total}
					currentPage={this.props.currentPage}
					showStatusTable={true}
					history={this.props.history}
					changePage={this.props.listingPhone} />

			</React.Fragment>

		)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { page } = this.props.match.params;

		if (prevProps.match.params.page != page) {
			let postData = {
				sortType: this.state.orderBy
			}
			this.props.listingPhone(page, 20, postData);
		}
	}

	componentDidMount() {
		const { page } = this.props.match.params;

		let postData = {
			sortType: this.state.orderBy
		}
		this.props.listingPhone(page, 20, postData);

	}
}

const mapStateToProps = state => {
	return {
		listings:state.listingsGroup,
		total: state.totalCountGroup,
		perPage: state.perPage,
		currentPage: state.currentPage
	}
};

const mapDispatchToProps = dispatch => {
	return {
		listingPhone: (perPage, pageNum, postData) => dispatch(listingPhone(perPage, pageNum, postData))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberListing)