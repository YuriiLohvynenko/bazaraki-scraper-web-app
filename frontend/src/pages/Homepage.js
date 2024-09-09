import React from 'react';
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import ListingTable from "../components/ListingTable";
import LoadingIcon from "../components/LoadingIcon";
import { connect } from 'react-redux'
import StatusGroup from '../components/StatusGroup';
import {getStaffUsers, loadAreas, loadPage, saveListing, setFilter} from "../actions";
import {Modal} from "react-bootstrap";
import gif1 from "../images/assigned-gif1.gif";
import gif2 from "../images/assigned-gif2.gif";
import gif3 from "../images/assigned-gif3.gif";
import gif5 from "../images/assigned-gif5.gif";
import gif6 from "../images/assigned-gif6.gif";
import gif7 from "../images/assigned-gif7.gif";
import gif8 from "../images/assigned-gif8.gif";

let BASE_URL = "/r/";

if(process.env.REACT_APP_DEV == 1) {
    BASE_URL = "/r2/";
}

class HomePage extends React.Component {
    constructor() {
        super();
        this.state = {
            showStats: false
        }
    }
    componentDidMount() {

        this.props.getStaffUsers();
        this.scrollTo = '';
        const { page } = this.props.match.params;
        let list = this.props.location.search;
        list = list.replace('?',"");
        this.listSize = 25;
        if (list) {
            list = list.split("&");
            list.map(data => {
                let query = data.split("=");
                if (query[0] === 'listSize') {
                    this.listSize = query[1];
                }
                if (query[0] === 'scrollTo') {
                    this.scrollTo = query[1];
                }
            })
        }

        //this.props.loadPage(page, list);
        //updated by daniel
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { page } = this.props.match.params;

        if (prevProps.match.params.page != page) {

            let list = this.props.location.search;
            list = list.replace('?',"");
            if (list) {
                list = list.split("&");
                list.map(data => {
                    let query = data.split("=");
                    if (query[0] === 'listSize') {
                        this.listSize = query[1];
                    }
                })
            }
            this.props.loadPage(page, this.listSize);
        }
    }

    closeModal = () => {
        window.location.href = window.location.href+"&scrollTo="+this.props.savedListingId;
    }


    openStatusTable = () =>{
        this.setState({
            showStats: !this.state.showStats
        })
    }

    renderGifImage = () => {
        let gifs = [gif1, gif2, gif3, gif5, gif6, gif7, gif8];

        let gif = gifs[Math.floor(Math.random() * gifs.length)];

        return <img src={gif} />

    };

    render() {
        return (
            <React.Fragment>
                {this.props.savedListingId && <Modal show={true} onHide={this.closeModal}>
                    <Modal.Header closeButton>

                    </Modal.Header>
                    <Modal.Body>
                        <p>Listing {this.props.savedListingId} is assigned to you. If no action is taken in 72hrs, it will be unassigned.</p>

                        <h3>Please note the phone number <span className="phoneNumberSpace h3">{this.props.savedListingData.phoneNumber.replace('+357','')}</span></h3>
                        {this.renderGifImage()}
                    </Modal.Body>
                </Modal>}
                <Filter staffUsers={this.props.staffUsers} allowedCities={this.props.allowedCities} setFilter={this.props.setFilter} loadAreas={this.props.loadAreas} areas={this.props.areas}  history={this.props.history} />

                <Pagination
                    page={'page'}
                    perPage={this.props.perPage}
                    totalCount={this.props.totalCount}
                    currentPage={this.props.currentPage}
                    showStatusTable={true}
                    onClickHandler={this.openStatusTable}
                    history={this.props.history}
                    changePage={this.props.loadPage} />
                {this.props.groupByStatus && this.state.showStats ? <StatusGroup
                    groupByStatus={this.props.groupByStatus}
                    totalCount={this.props.totalCount}
                /> : ''}
                {this.props.listingsLoading && <LoadingIcon />}

                <ListingTable
                    listings={this.props.listings}
                    history={this.props.history}
                    staffUsers={this.props.staffUsers}
                    allowedCities={this.props.allowedCities}
                    groupByPhone={this.props.groupByPhone}
                    groupByListingPhone={this.props.groupByListingPhone}
                    scrollTo={this.scrollTo}
                    groupByOwners={this.props.groupByOwners}
                    saveHandler={this.props.saveListing}/>
                <Pagination
                    page={'page'}
                    perPage={this.props.perPage}
                    history={this.props.history}
                    totalCount={this.props.totalCount}
                    currentPage={this.props.currentPage}
                    changePage={this.props.loadPage} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        listings: state.listings,
        perPage: state.perPage,
        groupByStatus: state.groupByStatus,
        groupByPhone: state.groupByPhone,
        groupByOwners: state.groupByOwners,
        totalCount: state.totalListings,
        allowedCities: state.allowedCities,
        areas: state.areas,
        savedListingId:state.savedListingId,
        savedListingData:state.savedListingData,
        staffUsers:state.staffUsers,
        groupByListingPhone: state.groupByListingPhone,
        currentPage: state.currentPage,
        listingsLoading: state.listingsLoading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setFilter: (filterData, history, fromFilter) => {
            let searchQuery = "?";
            let covertToCommaSeperated = (dataArr) => {
                return dataArr.join('$');
            };

            for (let keys in filterData) {
                if (keys && filterData[keys] !== ''){
                    let filterValue = filterData[keys];
                    if (typeof filterValue === 'object') {
                        filterValue = covertToCommaSeperated(filterValue);
                    }
                    if (searchQuery === "?"){
                        searchQuery += keys+"="+filterValue;
                    }else {
                        searchQuery += "&" + keys + "=" + filterValue
                    }
                }
            }
            let pageNum = history.location.pathname;

            pageNum = pageNum.split('/').pop();
            if (!pageNum || fromFilter || pageNum === 'r') {
                pageNum = 1;
            }
            dispatch(setFilter(filterData));
            dispatch(loadPage(pageNum, filterData['listSize']));

            if(fromFilter) {
                history.push({
                    pathname:BASE_URL,
                    search: searchQuery
                });
            }
            else {
                history.push({
                    location:BASE_URL,
                    search: searchQuery
                });
            }

        },
        loadAreas:(cities) => dispatch(loadAreas(cities)),
        getStaffUsers: () => dispatch(getStaffUsers()),
        loadPage: (pageNum, size) => dispatch(loadPage(pageNum, size)),
        saveListing: (listingId, listingData, editedBy, isAssingnee) => dispatch(saveListing(listingId, listingData, editedBy, isAssingnee)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
