import React from "react";
import {Modal, Button, Col, Form} from "react-bootstrap";
import {addStaffUser} from "../actions";
import {connect} from "react-redux";
import { Multiselect } from 'multiselect-react-dropdown';


class AddStaff extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true
		};
		if (this.props.isEdit) {
			this.state = {
				...this.state,
				...this.props.staffData,
				selectedCities: props.staffData.allowedCities.split(',').map(city => {return {name: city, id:city}})
			}
		}
		this.cities = [{
			name:"Famagusta district",
			id:"Famagusta district"
		},
			{
				name:"Larnaca district",
				id:"Larnaca district"
			},
			{
				name:"Lefkosia (Nicosia) district",
				id:"Lefkosia (Nicosia) district"
			},
			{
				name:"Limassol district",
				id:"Limassol district"
			},
			{
				name:"Paphos district",
				id:"Paphos district"
			}];
	}
	handleClose = ()=>{
		this.setState({
			show: false
		})
		this.props.closeAddNewStaff();
	}

	addStaff = (e) => {
		e.preventDefault();
		if (!this.state.email || !this.state.password) {
			return;
		}
		let userData = {
			...this.state,
			status: 1,
			adminId: parseInt(localStorage.getItem('userId'))
		}
		this.props.addStaffUser(userData, this.props.isEdit);
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
	onSelect = (selectedList, selectedItem) =>{
		this.setState({
			allowedCities: selectedList.map(data => data.id)
		});
	}
	onRemove = (selectedList, selectedItem) =>{
		this.setState({
			allowedCities: selectedList.map(data => data.id)
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.isLoading !== this.props.isLoading) {
			if (!this.props.isLoading && !this.props.message) {
				this.props.closeAddNewStaff(true);
			}
		}
	}

	setStatus = (e) => {
		this.setState({
			status: e.target.value
		})
	};

	render() {
		return (
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.isEdit ? "Edit Staff" : "Add Staff"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.props.message && <p className="text-danger">{this.props.message}</p>}

						<div className="form-group">
							<label>Email</label>
							<input type="email" name={"email"} value={this.state.email} className="form-control" onChange={(e) => this.formChange(e)} placeholder="Enter email" />
						</div>

						<div className="form-group">
							<label>name</label>
							<input type="text" name={"name"} value={this.state.name} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter name" />
						</div>
						<div className="form-group">
							<label>Password</label>
							<input type="password" name={"password"} value={this.state.password} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter password" />
						</div>

						<div className="form-group">
							<label>Phone Number</label>
							<input type="text" name={"phoneNumber"} value={this.state.phoneNumber} onChange={(e) => this.formChange(e)} className="form-control" placeholder="Enter phonenumber" />
						</div>
						<div className="form-group">
							<label>Allowed Cities</label>
							<Multiselect
								options={this.cities} // Options to display in the dropdown
								selectedValues={this.state.selectedCities} // Preselected value to persist in dropdown
								onSelect={this.onSelect} // Function will trigger on select event
								onRemove={this.onRemove} // Function will trigger on remove event
								showCheckbox={true}
								displayValue="name" // Property name to display in the dropdown options
							/>
						</div>
						<div className="form-group">
							<label>Status</label>
							<Form.Control as="select" value={this.state.status} onChange={(e) => this.setStatus(e)}>
								<option value={1}>Active</option>
								<option value={0}>In-Active</option>
							</Form.Control>
						</div>


					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.addStaff}>
							{this.props.isEdit ? "Edit" : "Add"}
						</Button>
					</Modal.Footer>
				</Modal>
		);
	}

}


const mapStateToProps = state => {
	return {
		isLoading:state.isLoading,
		message: state.message
	}
};

const mapDispatchToProps = dispatch => {
	return {
		addStaffUser: (userData, isEdit) => dispatch(addStaffUser(userData, isEdit))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AddStaff)