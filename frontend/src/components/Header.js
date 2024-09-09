import React from 'react';
import {connect} from "react-redux";
import {Dropdown} from 'react-bootstrap';
import {
    Link
} from "react-router-dom";


function Header({ lastScrapeDate }) {

    let BASE_URL = "/r/";

    if(process.env.REACT_APP_DEV == 1) {
        BASE_URL = "/r2/";
    }

    let userId = localStorage.getItem('userId');
    let userName = localStorage.getItem('userName')
    let isAdmin = localStorage.getItem('isAdmin');
    let logOut = () => {
        localStorage.clear();
        window.location.href = BASE_URL+"stafflogin";
    }
    let renderDate = (date) => {
        date = new Date(date);
        date  = date.setHours(date.getHours() + 7);
        date = new Date(date);
        let formattedDate = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) +'/'+((date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+'/'+date.getFullYear().toString().substr(2,2);
        formattedDate += ' ' + date.toLocaleTimeString('en-GB', { hour12: false,  timeStyle: 'short' });

        return formattedDate
    }
    return (
        <div className="header">
            <h1 className="pointer-event" onClick={() => window.location.href = BASE_URL}>BAZARAKI REPORT</h1>
            {userId && <React.Fragment><span className={"reports "}>
            <Link onClick={() => window.location.href = BASE_URL}>Listings</Link>
                &nbsp;&nbsp;&nbsp;
                {!isAdmin &&
                (<React.Fragment><Link onClick={() => window.location.href = BASE_URL+"?assignedTo="+userName}>My Leads</Link> &nbsp;&nbsp;&nbsp;</React.Fragment>)}
                {!isAdmin && (<React.Fragment><Link onClick={() => window.location.href = BASE_URL+"staffaccount"}>My Account</Link> &nbsp;&nbsp;&nbsp;</React.Fragment>)}
                </span>
                <span>
                {isAdmin && <React.Fragment>
                    <Dropdown className="d-inline-block mr-2">
                        <Dropdown.Toggle  id="dropdown-custom-components">
                            <b>Reports</b>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href={BASE_URL+"reports"}>Market data</Dropdown.Item>
                            {/* <Dropdown.Item href={BASE_URL+"listingphone"}>Phone report</Dropdown.Item> */}
                            <Dropdown.Item href={BASE_URL+"logs"}>Logs</Dropdown.Item>
                            <Dropdown.Item href={BASE_URL+"listingreport"}>Listing report</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                   </React.Fragment>}
                {isAdmin && <React.Fragment>
                    <Dropdown className="d-inline-block">
                        <Dropdown.Toggle  id="dropdown-custom-components">
                            <b>Staff</b>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href={BASE_URL+"stafflist"}>Staff List</Dropdown.Item>
                            <Dropdown.Item href={BASE_URL+"staffloginlist"}>Staff Login History</Dropdown.Item>
                            <Dropdown.Item href={BASE_URL+"staffperformance"}>Staff performance</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                   </React.Fragment>}
                   </span>
            <span className={"ml-auto headerRight" }>
                <Link to="" onClick={logOut}>LOGOUT ({userName}{isAdmin ? ' - Admin' : ''})</Link>
                &nbsp;&middot;&nbsp;
                {lastScrapeDate !== null && <span>DB updated: {renderDate(lastScrapeDate)}</span>}
            </span>
            </React.Fragment> }
            {!userId && <span className="reports">
                <Link to={BASE_URL+"adminlogin"}>Admin Login</Link>
                &nbsp;&middot;&nbsp;
                <Link to={BASE_URL+"stafflogin"}>Staff Login</Link>
                &nbsp;&middot;&nbsp;</span>}

        </div>
    )
}

const mapStateToProps = state => {
    return {
        lastScrapeDate: state.lastScrapeDate,
    }
};

export default connect(mapStateToProps)(Header)