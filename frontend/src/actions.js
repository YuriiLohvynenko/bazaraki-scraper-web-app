export const PAGE_LOADED = Symbol("PAGE_LOADED");
export const PAGE_LOADING = Symbol("PAGE_LOADING");
export const AREA_LOADED = Symbol("AREA_LOADED");
export const AREA_LOADING = Symbol("AREA_LOADING");
export const LOAD_PAGE_FAILED = Symbol("LOAD_PAGE_FAILED");
export const SAVE_LISTING = Symbol("SAVE_LISTING");
export const LISTING_SAVED = Symbol("LISTING_SAVED");
export const SET_FILTER = Symbol("SET_FILTER");
export const REPORT_OWNERSHIP_LOADED = Symbol("REPORT_OWNERSHIP_LOADED");
export const REPORT_PRICE_LOADED = Symbol("REPORT_PRICE_LOADED");
export const REPORT_PRICE_GRAPH_LOADED = Symbol("REPORT_PRICE_GRAPH_LOADED");
export const LOGS_LOADING = Symbol("LOGS_LOADING");
export const LOGS_LOADED = Symbol("LOGS_LOADED");
export const REPORT_LISTING_GRAPH_LOADED = Symbol("REPORT_LISTING_GRAPH_LOADED");
export const LOGIN_LOADING = Symbol("LOGIN_LOADING");
export const LOGIN_LOADED = Symbol("LOGIN_LOADED");
export const LOGIN_FAILED = Symbol("LOGIN_FAILED");
export const ADMIN_LOGIN_LOADING = Symbol("ADMIN_LOGIN_LOADING");
export const ADMIN_LOGIN_LOADED = Symbol("ADMIN_LOGIN_LOADED");
export const ADMIN_LOGIN_FAILED = Symbol("ADMIN_LOGIN_FAILED");
export const GET_STAFF_LIST = Symbol("GET_STAFF_LIST");
export const GOT_STAFF_LIST = Symbol("GOT_STAFF_LIST");
export const ADD_STAFF = Symbol("ADD_STAFF");
export const ADDING_STAFF = Symbol("ADDING_STAFF");

export const CHANGE_PASSWORD = Symbol("CHANGE_PASSWORD");
export const CHANGING_PASSWORD = Symbol("CHANGING_PASSWORD");
export const STAFF_LOGIN_HISTORY_LOADING = Symbol("STAFF_LOGIN_HISTORY_LOADING");
export const STAFF_LOGIN_HISTORY_LOADED = Symbol("STAFF_LOGIN_HISTORY_LOADED");
export const GOT_STAFF_STATUS_LIST = Symbol("GOT_STAFF_STATUS_LIST");
export const GET_LISTING_REPORT = Symbol("GET_LISTING_REPORT");
export const GOT_LISTING_REPORT = Symbol("GOT_LISTING_REPORT");

export const GET_LISTING_PHONE= Symbol("GET_LISTING_PHONE");
export const GOT_LISTING_PHONE = Symbol("GOT_LISTING_PHONE");


export function setFilter(newFilter) {
    return {
        type: SET_FILTER,
        payload: newFilter,
    }
}

let API_BASE_URL = "http://localhost:8000";

if(process.env.NODE_ENV === 'production') {
    API_BASE_URL = "https://polypropylene.website/r/api";
}

if(process.env.REACT_APP_DEV == 1) {
    API_BASE_URL = "https://polypropylene.website/r2/api";
}

let getHeaders = () => {
    let userId = localStorage.getItem('userId');

    let isAdmin = localStorage.getItem('isAdmin');
    let headers = new Headers({
        "Accept": "*/*",
        "Content-Type": "Application/Json"
    });
    if (userId) {
        headers = new Headers({
            "Accept": "*/*",
            "Content-Type": "application/json",
            'Authorization': (isAdmin ? "Admin ": "") +userId
        });
    }
    return headers;
};
export function loadLogs(pageNum = 1, perPage = 25) {
    const start = (pageNum*perPage) - perPage;
    pageNum = parseInt(pageNum);
    return (dispatch, getState) => {
        fetch(`${API_BASE_URL}/logs?start=${start}&limit=${perPage}`, {
            method: "POST",
            //mode:'no-cors',
            headers: getHeaders()
        })
            .then(res => res.json())
            .then(result => {

                dispatch({
                    type: LOGS_LOADED,
                    payload: {
                        pageNum: pageNum,
                        perPage: perPage,
                        logs: result.logs,
                        totalCount: result.totalCount
                    }
                })
            })
            .catch(err => {

            })
    }
}

export function loadAreas(cities) {
    return (dispatch, getState) => {
        fetch(`${API_BASE_URL}/area`, {
            method: "POST",
            body: JSON.stringify(cities),
            //mode:'no-cors',

            headers: getHeaders()
        })
            .then(res => res.json())
            .then(result => {
                let areas = result.areas.map(area => {
                    return {label:area.area, value: area.area}
                });
                dispatch({
                    type: AREA_LOADED,
                    payload: {
                        areas: areas
                    }
                })
            })
            .catch(err => {

            })
    }
}
export function loadPage(pageNum = 1, perPage = 25) {
    const start = (pageNum*perPage) - perPage;
    pageNum = parseInt(pageNum);

    return (dispatch, getState) => {
        const {currentFilter} = getState();

        dispatch({
            type: PAGE_LOADING,
            payload: {
                perPage: perPage,
                pageNum: pageNum,
            }
        });
        fetch(`${API_BASE_URL}/listings?start=${start}&limit=${perPage}`, {
            method: "POST",
            headers: getHeaders(),
            //mode: 'no-cors',
            body: JSON.stringify(currentFilter)
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: PAGE_LOADED,
                payload: {
                    pageNum: pageNum,
                    perPage: perPage,
                    listings: result.listings,
                    groupByStatus: result.groupByStatus,
                    groupByPhone: result.groupByPhoneNumber,
                    groupByListingPhone: result.groupByListingPhone,
                    allowedCities: result.allowedCities,
                    groupByOwners: result.groupByOwners,
                    total: result.total,
                    lastScrapeDate: result.lastScrapeDate,
                }
            }), error => dispatch({
                type: LOAD_PAGE_FAILED
            }))
            .catch(err => {
                console.log(err);
            })
    }
}

export function loadStaffLoginHistory(pageNum = 1, perPage = 25) {
    const start = (pageNum*perPage) - perPage;
    pageNum = parseInt(pageNum);

    return (dispatch, getState) => {
        const {currentFilter} = getState();

        dispatch({
            type: STAFF_LOGIN_HISTORY_LOADING,
            payload: {
                perPage: perPage,
                pageNum: pageNum,
            }
        });
        fetch(`${API_BASE_URL}/admin/staff/history?start=${start}&limit=${perPage}`, {
            method: "POST",
            headers: getHeaders(),
            //mode:'no-cors',

            body: JSON.stringify(currentFilter)
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: STAFF_LOGIN_HISTORY_LOADED,
                payload: {
                    pageNum: pageNum,
                    perPage: perPage,
                    results: result.results,
                    total: result.totalCount,
                }
            }), error => dispatch({
                type: STAFF_LOGIN_HISTORY_LOADED
            }))
    }
}

export function saveListing(listingId, listingData, editedBy, isAssingnee) {
    return dispatch => {
        dispatch({
            type: SAVE_LISTING,
            payload: {
                id: listingId
            }
        });

        listingData['changedBy'] = editedBy;

        fetch(`${API_BASE_URL}/listing/${listingId}`, {
            method: "POST",
            body: JSON.stringify(listingData),
            //mode:'no-cors',

            headers: getHeaders()
        })
            .then(res => res.json())
            .then(result => {
                if (result && result.message) {
                    window.confirm(result.message);
                }
                else {
                    dispatch({
                        type: LISTING_SAVED,
                        payload: {
                            id: isAssingnee ? listingId : '',
                            data: listingData
                        }
                    })
                }

            })
    }
}

export function loadReportOwnership() {
    return dispatch => {
        fetch(`${API_BASE_URL}/reporting/ownership`, {
            headers: getHeaders(),
            //mode:'no-cors'
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: REPORT_OWNERSHIP_LOADED,
                payload: {
                    data: result
                }
            }))
    }
}

export function loadReportPrice(type) {
    return dispatch => {
        fetch(`${API_BASE_URL}/reporting/price/${type}`, {
            headers: getHeaders(),
            //mode:'no-cors'
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: REPORT_PRICE_LOADED,
                payload: {
                    data: result,
                    type,
                }
            }))
    }
}

export function loadReportPriceGraph(type) {
    return dispatch => {
        fetch(`${API_BASE_URL}/reporting/price/graph/${type}`, {
            headers: getHeaders(),
            //mode:'no-cors'
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: REPORT_PRICE_GRAPH_LOADED,
                payload: {
                    data: result,
                    type,
                }
            }))
    }
}

export function loadReportListingGraph(type) {
    return dispatch => {
        fetch(`${API_BASE_URL}/reporting/listing/graph/${type}`, {
            //mode:'no-cors',
            headers: getHeaders()
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: REPORT_LISTING_GRAPH_LOADED,
                payload: {
                    data: result,
                    type,
                }
            }))
    }
}

export function login(userData) {
    return (dispatch, getState) => {
        dispatch({
            type: LOGIN_LOADING,
            payload: userData
        });
        fetch(`${API_BASE_URL}/staff/user/validate`, {
            //mode:'no-cors',
            method: "POST",
            body: JSON.stringify(userData)
        })
            .then(res => res.json())
            .then(result => {
                if(result.id) localStorage.setItem('userId', result.id);
                if(result.name) localStorage.setItem('userName', result.name);
                dispatch({
                    type: LOGIN_LOADED,
                    payload: {
                        loggedIn: true,
                        userId: result.id,
                        email: result.email,
                        message: result.message
                    }
                })
            }, error => dispatch({
                type: LOGIN_FAILED,
                message: error.message
            }))
    }
}

export function adminLogin(userData) {
    return (dispatch, getState) => {
        dispatch({
            type: ADMIN_LOGIN_LOADING,
            payload: userData
        });
        fetch(`${API_BASE_URL}/admin/user`, {
            //mode:'no-cors',
            method: "POST",
            body: JSON.stringify(userData)
        })
            .then(res => res.json())
            .then(result => {
                if(result.id) localStorage.setItem('userId', result.id);
                if(result.isAdmin) localStorage.setItem('isAdmin', result.id);
                if(result.name) localStorage.setItem('userName', result.name);

                dispatch({
                    type: ADMIN_LOGIN_LOADED,
                    payload: {
                        loggedIn: true,
                        userId: result.id,
                        email: result.email,
                        message: result.message
                    }
                })
            }, error => dispatch({
                type: ADMIN_LOGIN_FAILED,
                message: error.message
            }))
    }
}

export function addStaffUser(userData, isEdit) {
    return (dispatch, getState) => {
        dispatch({
            type: ADDING_STAFF,
            payload: userData
        });
        let url = `${API_BASE_URL}/staff/user/add`;
        if (isEdit) {
            url = `${API_BASE_URL}/staff/user/update`
        }
        fetch(url, {
            //mode:'no-cors',
            method: "POST",
            body: JSON.stringify(userData)
        })
            .then(res => res.json())
            .then(result => {
                if(result.id) localStorage.setItem('userId', result.id);
                if(result.isAdmin) localStorage.setItem('isAdmin', result.id);
                dispatch({
                    type: ADD_STAFF,
                    payload: {
                        isLoading: false,
                        message: result.message
                    }
                })
            }, error => dispatch({
                type: ADMIN_LOGIN_FAILED,
                message: error.message
            }))
    }
}

export function changeStaffPassword(userData, isEdit) {
    return (dispatch, getState) => {
        dispatch({
            type: CHANGING_PASSWORD,
            payload: userData
        });
        let url = `${API_BASE_URL}/staff/user/password/update`;

        fetch(url, {
            //mode:'no-cors',
            method: "POST",
            body: JSON.stringify(userData),
            headers: getHeaders()
        })
            .then(res => res.json())
            .then(result => {
                dispatch({
                    type: CHANGE_PASSWORD,
                    payload: {
                        isLoading: false,
                        message: result.message
                    }
                })
            }, error => dispatch({

            }))
    }
}

export function getStaffUsers(type) {
    return dispatch => {
        fetch(`${API_BASE_URL}/staff/users`, {
            headers: getHeaders(),
            //mode: 'no-cors'
        })
            .then(res => {

                return res.json();
            })
            .then(result => {
                result = JSON.parse(atob(result.users));

                console.log(result);
                dispatch({
                    type: GOT_STAFF_LIST,
                    payload: {
                        staffUsers: result
                    }
                })
            })
    }
}

export function getStaffStatusCount(assignedTo) {
    return dispatch => {
        fetch(`${API_BASE_URL}/listing/staff/status`, {
            //mode:'no-cors',
            headers: getHeaders(),
            method: "POST",
            body: JSON.stringify(assignedTo)
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: GOT_STAFF_STATUS_LIST,
                payload: {
                    staffStatusCount: result
                }
            }))
    }
}
export function listingReport(pageNum = 1, perPage = 25, postData) {
    const start = (pageNum*perPage) - perPage;
    pageNum = parseInt(pageNum);

    return (dispatch, getState) => {

        fetch(`${API_BASE_URL}/listing/group?start=${start}&limit=${perPage}`, {
            method: "POST",
            //mode:'no-cors',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: GOT_LISTING_REPORT,
                payload: {
                    pageNum: pageNum,
                    perPage: perPage,
                    listingsGroup: result.listings,
                    totalCountGroup: result.total
                }
            }), error => dispatch({
                type: LOAD_PAGE_FAILED
            }))
    }
}

export function listingPhone(pageNum = 1, perPage = 25, postData) {
    const start = (pageNum*perPage) - perPage;
    pageNum = parseInt(pageNum);

    return (dispatch, getState) => {

        fetch(`${API_BASE_URL}/listing/phone?start=${start}&limit=${perPage}`, {
            method: "POST",
            //mode:'no-cors',
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then(result => dispatch({
                type: GOT_LISTING_PHONE,
                payload: {
                    pageNum: pageNum,
                    perPage: perPage,
                    listingsGroup: result.phone,
                    totalCountGroup: result.total
                }
            }), error => dispatch({
                type: LOAD_PAGE_FAILED
            }))
    }
}
