import * as React from 'react';
import {changeStaffPassword} from "../actions";
import { connect } from 'react-redux'
import {Row, Col} from "react-bootstrap";

let BASE_URL = "/r/";

if(process.env.REACT_APP_DEV == 1) {
	BASE_URL = "/r2/";
}

class StaffAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: "",
			newPassword: "",
			confirmPassword:""
		}
	}

	login = (e) => {
		e.preventDefault();
		if (!this.state.oldPassword || !this.state.newPassword || !this.state.confirmPassword) {
			return;
		}

		if (this.state.newPassword !== this.state.confirmPassword) {
			alert("New password and confirm password not matching");
			return;
		}
		let userData = {
			newPassword: this.state.newPassword,
			password: this.state.oldPassword,
			userId: localStorage.getItem('userId')
		}

		this.props.changeStaffPassword(userData);
	}

	formChange = event => {
		let inputObj = {
			[event.target.name]: event.target.value
		};
		this.setState(prevState => ({
			...prevState,
			...inputObj
		}));
	};


	handleEnter = e => {
		if (e && e.charCode === 13) {
			this.changeStaffPassword(e);
		}
	};

	componentDidUpdate(prevProps, prevState, snapshot) {

	}

	render() {
		return (
			<React.Fragment>
				<Row className="justify-content-center">
					<Col lg={"4"}>
						<div>Change Password</div>
						{this.props.message && <p className={this.props.message === "Successfully changed password" ? "text-success": "text-danger"}>{this.props.message}</p>}
						<div className="form-group">
							<label>Old Password</label>
							<input type="password" name={"oldPassword"} className="form-control" onChange={(e) => this.formChange(e)} placeholder="Enter old password" />
						</div>

						<div className="form-group">
							<label>New Password</label>
							<input type="password" name={"newPassword"} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter new password" />
						</div>

						<div className="form-group">
							<label>Confirm Password</label>
							<input type="password" name={"confirmPassword"} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter confirm password" />
						</div>

						<button type="submit" className="btn btn-dark btn-lg btn-block" onClick={(e) => this.login(e)}>Change Password</button>

					</Col>
				</Row>

			</React.Fragment>

		)
	}
}

const mapStateToProps = state => {
	return {
		message: state.message
	}
};

const mapDispatchToProps = dispatch => {
	return {
		changeStaffPassword: (userData) => dispatch(changeStaffPassword(userData))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffAccount)