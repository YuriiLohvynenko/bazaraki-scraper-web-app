import * as React from 'react';
import {adminLogin, login} from "../actions";
import { connect } from 'react-redux'
import {Row, Col} from "react-bootstrap";

let BASE_URL = "/r/";

if(process.env.REACT_APP_DEV == 1) {
	BASE_URL = "/r2/";
}

class StaffLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: ""
		}
		let userId = localStorage.getItem('userId');
		console.log(userId);
		if(userId) {
			window.location.href = BASE_URL;
		}
	}

	login = (e) => {
		e.preventDefault();
		if (!this.state.email || !this.state.password) {
			return;
		}
		let userData = {
			email: this.state.email,
			password: this.state.password
		}

		this.props.adminLogin(userData);
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
			this.login(e);
		}
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log(this.props);
		if (prevProps.userId != this.props.userId && this.props.userId) {
			window.location.href = BASE_URL;
		}
	}

	render() {
		return (
			<React.Fragment>
				<Row className="justify-content-center">
					<Col lg={"4"}>
						<div>Admin Login</div>
						{this.props.message && <p className="text-danger">{this.props.message}</p>}
						<div className="form-group">
							<label>Email</label>
							<input type="email" name={"email"} onKeyPress={this.handleEnter} className="form-control" onChange={(e) => this.formChange(e)} placeholder="Enter email" />
						</div>

						<div className="form-group">
							<label>Password</label>
							<input type="password" onKeyPress={this.handleEnter} name={"password"} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter password" />
						</div>

						<button type="submit" className="btn btn-dark btn-lg btn-block" onClick={(e) => this.login(e)}>Sign in</button>

					</Col>
				</Row>

			</React.Fragment>

		)
	}
}

const mapStateToProps = state => {
	return {
		loggedIn:state.loggedIn,
		loginLoading: state.loginLoading,
		message: state.message,
		userId: state.userId,
		email: state.email
	}
};

const mapDispatchToProps = dispatch => {
	return {
		adminLogin: (userData) => dispatch(adminLogin(userData))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLogin)