import React from 'react';
import AreaSelector from "./AreaSelector";
import PropertyTypeSelector from "./PropertyTypeSelector";
import Thumbnails from "./Thumbnails";
import {OverlayTrigger, Tooltip, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.userName = localStorage.getItem('userName');
        this.isAdmin = localStorage.getItem('isAdmin');
        this.state = {
            isEditing: false,
            obj: props.listing,
            editedBy: "",
            copySuccess:'',
            applyToAllListing: false,
            notesSelect: "Apply for all listing for this lister"
        };

        // if (this.state.obj.notes) {
        //     let notes = this.parseNotes(this.state.obj.notes);
        //     if (notes && notes.all) {
        //         let all = notes.all.split("<br/>");
        //         let newAll = "";
        //         all.map(a => {
        //             if (a & a.indexOf('undefined') === -1) {
        //                 newAll = a+"<br/>";
        //             }
        //         })
        //         notes.all = newAll;
        //         this.state.obj.notes = JSON.stringify(notes);
        //     }
        // }
    }

    componentDidMount() {
        let scrollInterval = setInterval(() => {
            if (document.getElementById(this.props.scrollTo)){
                document.getElementById(this.props.scrollTo).scrollIntoView();
                const queryParams = new URLSearchParams(window.location.search)
                if (queryParams.has('scrollTo')) {
                    queryParams.delete('scrollTo')
                    this.props.history.replace({
                        search: queryParams.toString(),
                    })
                }
                    clearInterval(scrollInterval);
            }
        }, 10)
    }

    handleEditClick = (e) => this.setState({
        isEditing: true
    });


    copyToClipboard = (url) => {
        var fullLink = document.createElement('input');
        document.body.appendChild(fullLink);
        fullLink.value = url;
        fullLink.select();
        document.execCommand("copy", false);
        fullLink.remove();
        this.setState({
            copySuccess: true
        })
    };

    handleSaveClick = (e) => {
        if (this.state.obj.status === "Duplicate" && (this.state.obj.duplicateExternalId === null || this.state.obj.duplicateExternalId === "")) {
            alert("Please fill in the ID of which listing this one duplicates");
            return;
        }

        if (this.state.obj.status !== "Duplicate") {
            this.setState({
                obj: Object.assign({}, this.state.obj,{
                    duplicateExternalId: null,
                })
            });

            this.state.obj.duplicateExternalId = null;
        }

        if (this.state.obj.status !== 'Follow up' && (this.state.obj.assignedTo === null || this.state.obj.assignedTo === "")) {
            //alert("Please select who is assigned to");
            //return;
        }
        if ((!this.state.obj.qlRef) && (this.state.obj.status === "Answered, listing added" || this.state.obj.status === "Answered, already rented, listing added for future" || this.state.obj.status === "Answered, agent split commission")) {
            alert("Please enter QL ref");
            return;
        }
        else if (this.state.obj.qlRef && (this.state.obj.qlRef.length < 4 )) {
            alert("QL ref must be 4 digits");
            return;
        }
        let notes = this.props.listing.notes;

        let userName = this.userName;
        let date = new Date();
        //date = date.toDateString();
        if (this.state.obj.notesNew) {
            if (!notes) {
                notes = {
                    all:'',
                    single:''
                };
            }else {
                notes = JSON.parse(notes);
            }
            if (this.state.notesSelect === "Apply for all listing for this lister") {
                notes.all = date.getDate()+'/'+(parseInt(date.getMonth()) + 1)+'/'+date.getFullYear() +" - "+userName+ " : "+this.state.obj.notesNew+"<br/>" + notes.all;
            }
            else {
                notes.single = date.getDate()+'/'+(parseInt(date.getMonth()) + 1)+'/'+date.getFullYear() +" - "+userName+ " : "+this.state.obj.notesNew+"<br/>" + notes.single;
            }
            notes = JSON.stringify(notes);
        }


        let obj = {
            ...this.state.obj,
            notesSelect: this.state.notesSelect,
            applyToAllListing: this.state.applyToAllListing,
            notes: notes
        }
        if (this.state.obj.status === 'Answered, agent split commission') {
            obj.lister.type = 'Agent';
        }
        this.props.saveHandler(this.props.listing.id, obj, this.state.editedBy);
        let scrollInterval = setInterval(() => {
            if (document.getElementById(this.state.obj.id)){
                document.getElementById(this.state.obj.id).scrollIntoView();
                clearInterval(scrollInterval);
            }
        }, 10)
        this.setState({
            isEditing: false,
            obj: {
                ...obj
            }
        });
    };

    handleDeleteClick = (e) => {
        window.confirm("Are you sure you want to delete this listing?");
       let obj = {
           ...this.state.obj
       };

       obj.status = "Deleted";

        this.props.saveHandler(this.props.listing.id, obj, this.state.editedBy);
        this.setState({
            isEditing: false,
            obj: {
                ...obj
            }
        });
    };

    handleCancelClick = (e) => this.setState({
        isEditing: false,
        obj: this.props.listing,
    });

    handlePropertyTypeEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            propertyType: e.target.value
        })
    });

    handleAreaEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            area: e.target.value
        })
    });

    handlePriceEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            price: e.target.value
        })
    });

    handleBedroomEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            amountBedrooms: e.target.value
        })
    });
    handleBathroomEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            amountBathrooms: e.target.value
        })
    });


    handlePhoneNumberEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            phoneNumber: e.target.value
        })
    });
    handleNotesEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            notesNew: e.target.value
        })
    });


    handleListedByTypeEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            lister: Object.assign({}, this.state.obj.lister, {
                type: e.target.value
            })
        })
    });

    handleAssignedToEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            assignedTo: e.target.value
        })
    });

    handleStatusEdit = (e) =>{
        if ((!this.state.obj.phoneNumber || this.state.obj.phoneNumber=== 'None' || this.state.obj.phoneNumber === '') && e.target.value !== "Follow up") {
            alert("Please add phone number to listing");
            e.preventDefault();
            return;
        }
        this.setState({
            obj: Object.assign({}, this.state.obj,{
                status: e.target.value,

            })
        });
    }
    handleNotesSelectEdit = (e) => this.setState({
            notesSelect: e.target.value
    });


    handleEditorEdit = (e) => this.setState({
        editedBy: e.target.value
    });

    handleDuplicateExternalIdEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            duplicateExternalId: e.target.value
        })
    });

    handleSuccessIdEdit = (e) =>{
        if (e.target.value && e.target.value.length > 4) {
            alert("Value should not be more than 4 characters");
            return;
        }
        this.setState({
            obj: Object.assign({}, this.state.obj,{
                qlRef: e.target.value
            })
        });
    }

    handleListingTypeEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            listingType: e.target.value
        })
    });
    handleCityEdit = (e) => this.setState({
        obj: Object.assign({}, this.state.obj,{
            city: e.target.value
        })
    });


    redirectToTelephoneFilter = (phoneNumber, assignedTo, assign = false) => {
        let BASE_URL = "/r/";

        if(process.env.REACT_APP_DEV == 1) {
            BASE_URL = "/r2/";
        }


        if (assign || assignedTo === this.userName) {
            let queryString = "";

            queryString += "?phoneNumber="+phoneNumber;
            window.location.href = BASE_URL+queryString;
        }
        else if (assignedTo !== 'Unassigned' && assignedTo !== null) {
            alert("Listing already assigned to someone else");
        }
        else {
            let obj = {
                ...this.state.obj
            };
            obj.assignedTo = this.userName;
            this.props.saveHandler(this.props.listing.id, obj, this.state.editedBy, true);

        }

    }

    renderCurrency = (amount) => {
        return (parseInt(amount)).toLocaleString('en-GB', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
    }

    renderDate = (date) => {
        date = new Date(date);
        date  = date.setHours(date.getHours() + 7);
        date = new Date(date);
        let formattedDate = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) +'/'+((date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+'/'+date.getFullYear().toString().substr(2,2);
            formattedDate += ' ' + date.toLocaleTimeString('en-GB', { hour12: false,  timeStyle: 'short' });

        return formattedDate
    }

    renderColoredStatus = (status) => {
        if (status === "Follow up" || status === "No answer, try again later") {
            return (
                <mark style={{"background-color":"#fff69b"}}><strong style={{color: 'black'}}>{status}</strong></mark>
            )
        }
        if (status === "Duplicate" || status === "Deleted" || status === "Answered, not interested" || status === "Failed multiple times, or phone number incorrect") {
            return (
                <mark style={{"background-color":"#ffbebc"}}><strong style={{color: 'black'}}>{status}</strong></mark>
            )
        }
        if (status === "Answered, agent split commission" || status === "Answered, agent" || status === "Answered, listing added" || status === "Answered, already rented, listing added for future") {
            return (
                <mark style={{"background-color":"#9ffcc1"}}><strong style={{color: 'black'}}>{status}</strong></mark>
            )
        }
        return <strong>{status}</strong>
    }

    renderPhoneNumber = (assignedTo, phone, renderTotal = false) => {
        let count;
        if (this.props.groupByPhone && this.props.groupByPhone.length > 0){
            this.props.groupByPhone.map(data => {
                if (data.phoneNumber === phone) {
                    count = data.num;
                }
            })
        }


        if (( assignedTo && assignedTo === this.userName) || this.isAdmin ) {
            return (
                <OverlayTrigger
                key={'right'}
                placement={'right'}
                overlay={
                    <Tooltip id={`tooltip-right`} >
                        <span className="tooltip-right">{phone} </span>
                    </Tooltip>
                }
            >
                <span onClick={() => this.redirectToTelephoneFilter(phone, assignedTo, true)}>{phone.replace("+357", "")} ({count}) </span>
            </OverlayTrigger>)
        }
        else if (renderTotal) {
            return(
                <span onClick={() => this.redirectToTelephoneFilter(phone, assignedTo, true)}>Total Listing({count})</span>
            )
        }
        return (
            <span>
                <span onClick={() => this.redirectToTelephoneFilter(phone, assignedTo, false)}>{phone.replace(/.{2}$/g, "**").replace("+357", "")}</span>
                <span  onClick={() => this.redirectToTelephoneFilter(phone, assignedTo, false)}>(<u>ASSIGN LISTING</u>)</span>
                <div className="mt-3" onClick={() => this.redirectToTelephoneFilter(phone, assignedTo, true)}>Total Listing: (<u>{count}</u>)</div>
            </span>
        )
    };

    setSelectAllListing = (e) => {
        this.setState({
            applyToAllListing: !this.state.applyToAllListing
        })
    }

    renderSelectAllListingCheckBox = (phoneNumber, status) => {
        let count = 0;
        if (this.props.groupByPhone && this.props.groupByPhone.length > 0){
            this.props.groupByPhone.map(data => {
                if (data.phoneNumber === phoneNumber) {
                    count = data.num;
                }
            })
        }
        if (status === "Answered, not interested"
                || status === "Failed multiple times, or phone number incorrect") {
            return (
                <div className="d-inline-flex align-items-center">

                    <input id="applyToAllListing" type="checkbox" onClick={this.setSelectAllListing}
                           selected={this.state.applyToAllListing}/>
                    <label htmlFor="applyToAllListing"> Apply to all {count} listing </label>
                </div>
            )
        }
    };

    renderListerNotes = (status, owner) => {
        if (this.props.groupByOwners && (status === "Follow up" || status === "No answer, try again later")) {
            let notes = '';

            let duplicateCheck = [];
            this.props.groupByOwners.map(data => {
                if (owner === data.id) {
                    let changeJson = JSON.parse(data[0].changes);
                    if (changeJson.status) {
                        if ((changeJson.status.new === "Answered, listing added"
                            ||changeJson.status.new === "Answered, agent split commission"
                            || changeJson.status.new === "Answered, already rented, listing added for future") && !duplicateCheck.includes("Working with us (other listings added)")) {
                            notes += "<p class='m-1 statusgood'> Working with us (other listings added)</p>"
                            duplicateCheck.push("Working with us (other listings added)");
                        }
                        else if (changeJson.status.new === "Answered, not interested" && !duplicateCheck.includes("Not interested in working with us")){
                            notes += "<p class='m-1 statusbad' >Not interested in working with us</p>"
                            duplicateCheck.push("Not interested in working with us");
                        }
                        else if (changeJson.status.new === "Failed multiple times, or phone number incorrect" && !duplicateCheck.includes("Does not pickup the phone, or phone number incorrect")) {
                            notes += "<p class='m-1 statusbad' >Does not pickup the phone, or phone number incorrect</p>"
                            duplicateCheck.push("Does not pickup the phone, or phone number incorrect");
                        }
                    }
                }
            })
            if (notes) {
                return (<div className="mt-2"><h6><b>The lister has history of</b></h6><p dangerouslySetInnerHTML={{__html:notes}}/> </div>)
            }
            else {
                return  '';
            }
        }
    };

    renderPhoneNumberNotes = (status, phoneNumber) => {
        if (phoneNumber === 'None' || phoneNumber === ''){
            return;
        }
        else {
            if (this.props.groupByListingPhone && (status === "Follow up" || status === "No answer, try again later")) {
                let notes = '';
    
                let duplicateCheck = [];
                this.props.groupByListingPhone.map(data => {
                    if (phoneNumber === data.phoneNumber) {
                        let changeJson = JSON.parse(data[0].changes);
                        if (data.type === 'Agent' && !duplicateCheck.includes("Being associated with an agent")) {
                            notes += "<p class='m-1 statusbad'> Being associated with an agent</p>"
                            duplicateCheck.push("Being associated with an agent");
                        }
                        if (changeJson.status) {
                            if ((changeJson.status.new === "Answered, listing added"
                                ||changeJson.status.new === "Answered, agent split commission"
                                || changeJson.status.new === "Answered, already rented, listing added for future") && !duplicateCheck.includes("Working with us (other listings added)")) {
                                notes += "<p class='m-1 statusgood'> Working with us (other listings added)</p>"
                                duplicateCheck.push("Working with us (other listings added)");
                            }
                            else if (changeJson.status.new === "Answered, not interested" && !duplicateCheck.includes("Not interested in working with us")){
                                notes += "<p class='m-1 statusbad' >Not interested in working with us</p>"
                                duplicateCheck.push("Not interested in working with us");
                            }
                            else if (changeJson.status.new === "Failed multiple times, or phone number incorrect" && !duplicateCheck.includes("Does not pickup the phone, or phone number incorrect")) {
                                notes += "<p class='m-1 statusbad' >Does not pickup the phone, or phone number incorrect</p>"
                                duplicateCheck.push("Does not pickup the phone, or phone number incorrect");
                            }
                        }
                    }
                })
                if (notes) {
                    return (<div className="mt-2"><h6><b>This Phone number has a history of</b></h6><p dangerouslySetInnerHTML={{__html:notes}}/> </div>)
                }
                else {
                    return  '';
                }
            }
        }
        
    };
    renderRemainingTime = (date, status) =>{
        if (status !== "Follow up" && status !== "No answer, try again later") return ;
        if (!date) return;
        let newDate = new Date(date)
        newDate.setHours(newDate.getHours() + 120);
        newDate = new Date(newDate);
        let currentDate = new Date();


        let seconds = Math.floor((newDate - currentDate)/1000),
            minutes = Math.floor(seconds/60),
            hours = Math.floor(minutes/60),
            days = Math.floor(hours/24);
        let delta = hours-(days*24);
        minutes = minutes-(days*24*60)-(delta*60);
        if (hours < 0) {
            return ;
        }

        return "("+hours+" hours " + minutes + " minutes remaining"+")";
    }

    renderChanges = (changes) => {
        if (!changes) return;
        let changeTxt = '';
        changes = JSON.parse(changes);
        for (let change in changes) {
            if (changes[change] && (changes[change]['old'] || changes[change]['new'])) {
                changeTxt += "&nbsp;&nbsp;&nbsp"
                changeTxt += change;
                changeTxt += ": "+changes[change]['old'];
                changeTxt += " > "+changes[change]['new'];
            }
        }
        return changeTxt;
    }
    renderStaffHistory = listing => {
        if (!listing.changeLogs) return;
        if (listing.changeLogs == []) return;
        let history = "";
        for (let i = listing.changeLogs.length - 1; i >= 0; i--) {
            if (listing.changeLogs[i].changes == [] || listing.changeLogs[i].changes == "[]" || !listing.changeLogs[i].changes) continue;
            history += "<div>"+this.renderDate(listing.changeLogs[i].createdAt) +":"+ listing.changeLogs[i].changedBy +"<span > "+this.renderChanges(listing.changeLogs[i].changes)+"</span></div>";
        }
        if (history) {
            history = "<div class='listernotes'><h6><b>The Listing change history</b></h6>"+history+"</div>";
        }
        return history;
    }

    parseNotes = (notes) => {
        if (notes) {
            notes = JSON.parse(notes);
            if (typeof notes === "object") {

                return notes
            }
            else {
                return this.parseNotes(notes);
            }
        }
    }

    renderDuplicateInput = () =>{
        if (this.state.obj.status === "Duplicate") {
            return (

                <div className="d-inline-flex ">
                    <span className="my-auto">Duplicate listing ID: </span>
                    <input type="text" placeholder="ID of original" value={this.state.obj.duplicateExternalId} onChange={this.handleDuplicateExternalIdEdit} />
                </div>
            )
        }
    }

    renderSuccessInput = () =>{
        if (this.state.obj.status === "Answered, listing added"
            || this.state.obj.status === "Answered, already rented, listing added for future"
            || this.state.obj.status === "Answered, agent split commission"
        ) {
            return (

                <div className="d-inline-flex ">
                    <span className="my-auto">Enter QL ref#: </span>
                    <input type="number" value={this.state.obj.qlRef} onChange={this.handleSuccessIdEdit} />
                </div>
            )
        }
    }
    render() {
        let BASE_URL = "/r/";

        if(process.env.REACT_APP_DEV == 1) {
            BASE_URL = "/r2/";
        }
        const listing = this.state.obj;
        let notes = this.state.obj.notes;

        if (notes) {
            notes = this.parseNotes(notes);
        }
        return (
            <tr id={listing.id}>
                <td className="name">
                    <p className="name">{listing.title}</p>

                    <p className="city">{listing.city} - {!this.state.isEditing && <span className="district">{(listing.area)}</span>}
                    </p>

                    { (listing.zipCode && listing.zipCode !== 0 ) ? <p className="postcode">ZIP: {listing.zipCode}</p> : ''}
                    <p className="dateadded">Added: {this.renderDate(listing.dateAdded)}</p>
                    <p className="item-id pointer-event" >

                        <span onClick={() => window.location.href = BASE_URL+"?&bid="+listing.externalId} >{listing.externalId.toString()} </span>(<u onClick={() => this.copyToClipboard(listing.bazarakiUrl)}>copy URL</u>)</p>
                        <p className=" pointer-event" ><a className="listing-id" target="_blank" href={BASE_URL+"?id="+listing.id}> {listing.id}</a> </p>

                    <p className="text-success">{this.state.copySuccess && "Copied bazaraki url"}</p>
                    <br />
                    {( !this.state.isEditing) && <button onClick={this.handleEditClick}>Edit {(listing.notes) && ' + read notes'}</button> }

                </td>
                <td className="owner" colSpan={this.state.isEditing && "2"}>
                    {/* {!this.state.isEditing && this.renderListerNotes(listing.status, listing.lister.id)} */}
                    {!this.state.isEditing && this.renderPhoneNumberNotes(listing.status, listing.phoneNumber)}
                    {!this.state.isEditing && <p className={"price" + (
                        ((listing.listingType === 'sale' && (parseInt(listing.price) < 500 || parseInt(listing.price) > 1000000)) || (listing.listingType === 'rental' && (parseInt(listing.price) < 200 || parseInt(listing.price) > 20000))) ? " text-danger" : "") }>{this.renderCurrency(listing.price)} {(
                        ((listing.listingType === 'sale' && (parseInt(listing.price) < 500 || parseInt(listing.price) > 1000000)) || (listing.listingType === 'rental' && (parseInt(listing.price) < 200 || parseInt(listing.price) > 20000))) ? " text-danger" : "") ? "(Check)" : ''}</p>}
                    <br/>
                    {!this.state.isEditing && <p className="sub">{listing.lister.type}</p>}
                    <p className="owner-name">{listing.lister.name}</p>
                    {(!this.state.isEditing && (listing.phoneNumber !== 'None' && listing.phoneNumber !== '')) && <p className="owner-phone pointer-event" ><span>{this.renderPhoneNumber(listing.assignedTo, listing.phoneNumber)}</span> </p>}
                    {(!this.state.isEditing && (listing.phoneNumber === 'None' || listing.phoneNumber === '')) && <p className="owner-phone " >NO PHONE NUMBER <Link onClick={this.handleEditClick}>(Add phone number)</Link></p>}
                    {}
                    {(this.state.isEditing && listing.changeLogs !== []) && <div className="">
                        <span dangerouslySetInnerHTML={{__html: this.renderStaffHistory(listing)}} /></div>}
                    {this.state.isEditing && <div className="listernotes">
                        {notes && notes.all ? <React.Fragment>
                            <h6><b>Notes about this lister</b></h6>
                            <p className="notes" dangerouslySetInnerHTML={{__html:notes.all}}></p>
                        </React.Fragment> :''}
                        {notes && notes.single ? <React.Fragment>
                            <h6><b>Notes about this listing</b></h6>
                            <p className="notes" dangerouslySetInnerHTML={{__html:notes.single}}></p>
                        </React.Fragment> :''}


                   <React.Fragment>
                        <p>Notes:</p>
                        <textarea rows="2" placeholder={""} value={listing.notesNew} onChange={this.handleNotesEdit} className="w-100" />
                        <div className="d-inline-flex align-items-center">

                            <select onChange={this.handleNotesSelectEdit}>
                                <option value="Apply for all listing for this lister" selected={this.state.notesSelect === "Apply for all listing for this lister"}>Apply for all listing for this lister</option>
                                <option value="Apply only for this listing" selected={this.state.notesSelect === "Apply only for this listing"}>Apply only for this listing</option>
                            </select>
                        </div>
                        <br />
                    </React.Fragment>
                    </div>}

                    {(this.state.isEditing && ((this.userName === listing.assignedTo || this.isAdmin))) && <React.Fragment><div className="followup"> <p>Status:   {this.renderRemainingTime(listing.assignedAt, listing.status)}</p><select onChange={this.handleStatusEdit}>
                        <option value="Follow up" selected={listing.status === "Follow up"}>Pending: Follow up (120hr limit)</option>
                        <option value="No answer, try again later" selected={listing.status === "No answer, try again later"}>Pending: No answer, try again later (120hr limit)</option>
                        <option value="Answered, listing added" selected={listing.status === "Answered, listing added"}>Success: Answered, listing added</option>
                        <option value="Answered, already rented, listing added for future" selected={listing.status === "Answered, already rented, listing added for future"}>Success: Answered, already rented, listing added for future</option>
                        <option value="Answered, agent split commission" selected={listing.status === "Answered, agent split commission"}>Success: Answered, agent split commission</option>
                        <option value="Answered, not interested" selected={listing.status === "Answered, not interested"}>Failed: Answered, not interested</option>
                        <option value="Answered, agent" selected={listing.status === "Answered, agent"}>Failed: Answered, agent</option>
                        <option value="Failed multiple times, or phone number incorrect" selected={listing.status === "Failed multiple times, or phone number incorrect"}>Failed: Called multiple times, or phone number incorrect</option>
                        <option value="Duplicate" selected={listing.status === "Duplicate"}>Duplicate listing</option>
                    </select>
                        {this.renderDuplicateInput()}
                        {this.renderSuccessInput()}
                        {this.renderSelectAllListingCheckBox(listing.phoneNumber, listing.status)}
                    </div></React.Fragment>}
                    {(this.state.isEditing && (this.isAdmin)) && <React.Fragment><div className="followup"> <p>Assigned To:   </p>
                        <select onChange={this.handleAssignedToEdit}>
                            <option selected={listing.assignedTo === "Unassigned"} value="Unassigned">Unassigned</option>
                            {this.props.staffUsers.map(((user, i) => {return (<option key={i} selected={listing.assignedTo === user.name} value={user.name}>{user.name}</option> )}))}
                    </select>
                        {this.renderSelectAllListingCheckBox(listing.phoneNumber, listing.status)}
                    </div></React.Fragment>}

                    {this.state.isEditing &&<React.Fragment> <p>Ownership</p><select onChange={this.handleListedByTypeEdit}>
                        <option selected={listing.lister.type === "Owner"} value="Owner">Owner</option>
                        <option selected={listing.lister.type === "Agent"} value="Agent">Agent</option>
                        <option selected={listing.lister.type === "Developer"} value="Developer">Developer</option>
                    </select></React.Fragment>}
                    {this.state.isEditing &&<React.Fragment> <p>Type:</p> <select onChange={this.handleListingTypeEdit}>
                        <option value="rental" selected={listing.listingType === 'rental'}>Rental</option>
                        <option value="sale" selected={listing.listingType === 'sale'}>Sale</option>
                        <option value="commercial_sale" selected={listing.listingType === 'commercial_sale'}>Commercial Sale</option>
                        <option value="plot" selected={listing.listingType === 'plot'}>Plot Sale</option>
                        <option value="building" selected={listing.listingType === 'building'}>Building</option>
                    </select></React.Fragment>}
                    {this.state.isEditing &&<React.Fragment> <p>City:</p> <select onChange={this.handleCityEdit}>
                        <option value="Famagusta district" selected={listing.listingType === 'Famagusta district'}>Famagusta district</option>
                        <option value="Larnaca district" selected={listing.listingType === 'Larnaca district'}>Larnaca district</option>
                        <option value="Lefkosia (Nicosia) district" selected={listing.listingType === 'Lefkosia (Nicosia) district'}>Lefkosia (Nicosia) district</option>
                        <option value="Limassol district" selected={listing.listingType === 'Limassol district'}>Limassol district</option>
                        <option value="Paphos district" selected={listing.listingType === 'Paphos district'}>Paphos district</option>
                    </select></React.Fragment>}
                    {this.state.isEditing && <React.Fragment> <p>Area:</p> <AreaSelector
                        current={listing.area}
                        changeHandler={this.handleAreaEdit} /></React.Fragment>}
                    {this.state.isEditing && <React.Fragment>
                        <p>Price:</p>
                        <input type="text" value={listing.price} onChange={this.handlePriceEdit} />
                        <br />
                    </React.Fragment>}
                    { (listing.listingType === 'rental' || listing.listingType === 'sale') && <React.Fragment>
                        {this.state.isEditing &&<React.Fragment><p>Property Type:</p><PropertyTypeSelector
                            current={listing.propertyType}
                            changeHandler={this.handlePropertyTypeEdit} /></React.Fragment> }
                        {this.state.isEditing && <React.Fragment>
                            <p>Bedrooms:</p>
                            <input type="text" value={listing.amountBedrooms} onChange={this.handleBedroomEdit} />
                            <br />
                        </React.Fragment>}
                        {this.state.isEditing && <React.Fragment>
                            <p>Bathrooms:</p>
                            <input type="text" value={listing.amountBathrooms} onChange={this.handleBathroomEdit} />
                            <br />
                        </React.Fragment>}
                    </React.Fragment>}
                    {this.state.isEditing &&<React.Fragment><p>Phone number:</p> <input type="text" value={listing.phoneNumber} onChange={this.handlePhoneNumberEdit} /></React.Fragment>}

                    <br />

                    {listing.listingType === 'commercial_sale' && <p className="type">{listing.commercialPropertyType}</p> }
                    {listing.listingType === 'building' && <p className="type">Building</p> }
                    {listing.listingType === 'plot' && <p className="type">Plot</p> }


                    <br/>
                    {!this.state.isEditing && <p className="sub">Status: {this.renderColoredStatus(listing.status)}</p>}

                    {!this.state.isEditing && listing.status === "Duplicate" && <p className="sub">Duplicate of: <strong>{listing.duplicateExternalId}</strong></p> }

                    {this.state.isEditing && (
                        <React.Fragment>
                            <button className="savebtn" onClick={this.handleSaveClick}>Update Listing</button>
                            <button className="cancelbtn" onClick={this.handleCancelClick}>Cancel update</button>
                            <button className="delbtn" onClick={this.handleDeleteClick}>Delete Listing</button>
                            {/*{(!this.state.isEditing && listing.status !== 'Deleted') && <button onClick={this.handleDeleteClick}>Delete</button> }*/}

                        </React.Fragment>
                    )}
                    {!this.state.isEditing && (listing.assignedTo !== "" && listing.assignedTo !== null) &&<p className="dateAdded">Assigned to: <strong>{listing.assignedTo}</strong></p>}
                    {!this.state.isEditing && (listing.assignedTo === "" || listing.assignedTo === null) && <p className="dateAdded">Assigned to: <strong>Unassigned</strong></p>}
                    {!this.state.isEditing &&  <p>{this.renderRemainingTime(listing.assignedAt, listing.status)}</p>}
                </td>
                {!this.state.isEditing && <td className="specs">
                    { (listing.listingType === 'rental' || listing.listingType === 'sale') && <React.Fragment>
                        {!this.state.isEditing && <p className="type">{listing.propertyType}</p>}
                        {!this.state.isEditing && <p className="bedrooms">{listing.amountBedrooms} bedrooms</p>}
                        {!this.state.isEditing && <p className="bathrooms">{listing.amountBathrooms} bathrooms</p>}
                    </React.Fragment>}
                </td>}
                <td className="descr">
                    <div className="td-content d-descr" id="descr2829842"><p className="description" dangerouslySetInnerHTML={{__html: listing.description.replace(/agency/g,"<mark>agency</mark>").replace(/agencies/g,"<mark>agencies</mark>").replace(/agents/g,"<mark>agents</mark>").replace(/AGENTS/g,"<mark>AGENTS</mark>").replace(/AGENCY/g,"<mark>AGENCY</mark>").replace(/AGENCIES/g,"<mark>AGENCIES</mark>")}}>{}</p></div>
                </td>
                <td className="images">
                    <div className="td-content d-images">
                        <Thumbnails thumbnails={listing.thumbnails} />
                    </div>
                </td>
            </tr>
        )
    }
}