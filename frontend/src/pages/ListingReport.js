import * as React from 'react';
import {listingReport} from "../actions";
import { connect } from 'react-redux'
import {Row, Col} from "react-bootstrap";
import AddStaff from "../components/AddStaff";
import {Link} from "react-router-dom";
import Pagination from "../components/Pagination";


class ListingReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filterBy: ''
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
		console.log(this.props.listings)
		if(!this.props.listings || this.props.listings.length === 0) {
			return;
		}
		let BASE_URL = "/r/";

		if(process.env.REACT_APP_DEV == 1) {
			BASE_URL = "/r2/";
		}
		return this.props.listings.map((staff, i) => {
			return (
				<tr key={i}>
					<td>{staff.name}</td>
					<td><Link target={'_blank'} to={BASE_URL+'?listedByType=&phoneNumber='+staff.phoneNumber} >{staff.phoneNumber}</Link></td>
					<td>{staff.type}</td>
					<td>{staff.listCount}</td>
				</tr>
			)
		})
	};

	handleTypeChange = (e) => {
		const { page } = this.props.match.params;
		this.setState({
			filterBy: e.target.value
		});
			let postData = {
				filterBy: e.target.value
			}
			this.props.listingReport(page, 20, postData);

	};



	render() {
		return (
			<React.Fragment>
				<Row className="justify-content-center text-center">
					<Col xs="12">
						<select onChange={this.handleTypeChange}>
							<option value='' selected={this.state.filterBy === ''}>Both</option>
							<option value="owner" selected={this.state.filterBy === 'owner'}>Owner</option>
							<option value="agent" selected={this.state.filterBy === 'agent'}>Agent</option>
						</select>
					</Col>
					<Col lg={"8"}>
						<Row>
							<Col lg="12">
								<table>
									<thead>
									<tr>
										<th>Name</th>
										<th>Phone Number</th>
										<th>Type</th>
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
					page={'listingreport'}
					perPage={this.props.perPage}
					totalCount={this.props.total}
					currentPage={this.props.currentPage}
					showStatusTable={true}
					history={this.props.history}
					changePage={this.props.listingReport} />

			</React.Fragment>

		)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { page } = this.props.match.params;

		if (prevProps.match.params.page != page) {
			let postData = {
				filterBy: this.state.filterBy
			}
			this.props.listingReport(page, 20, postData);
		}
	}

	componentDidMount() {
		const { page } = this.props.match.params;
		let postData = {
			filterBy: this.state.filterBy
		}
		this.props.listingReport(page,20, postData);
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
		listingReport: (perPage, pageNum, postData) => dispatch(listingReport(perPage, pageNum, postData))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingReport)