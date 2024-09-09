import {
    PAGE_LOADED,
    PAGE_LOADING,
    SET_FILTER,
    REPORT_OWNERSHIP_LOADED,
    REPORT_PRICE_LOADED,
    REPORT_PRICE_GRAPH_LOADED,
    AREA_LOADED,
    AREA_LOADING,
    LOGS_LOADING,
    LOGS_LOADED,
    REPORT_LISTING_GRAPH_LOADED,
    LOGIN_LOADING,
    LOGIN_LOADED,
    LOGIN_FAILED,
    ADMIN_LOGIN_LOADING,
    ADMIN_LOGIN_LOADED,
    ADMIN_LOGIN_FAILED,
    GET_STAFF_LIST,
    GOT_STAFF_LIST,
    ADD_STAFF,
    ADDING_STAFF,
    LISTING_SAVED,
    STAFF_LOGIN_HISTORY_LOADING,
    STAFF_LOGIN_HISTORY_LOADED,
    GOT_STAFF_STATUS_LIST,
    GET_LISTING_REPORT,
    GOT_LISTING_REPORT,
    GOT_LISTING_PHONE,
    CHANGING_PASSWORD, CHANGE_PASSWORD
} from "./actions";

const defaultState = {
    lastScrapeDate: null,
    totalListings: 0,
    currentPage: 1,
    perPage: 25,
    listingsLoading: false,
    listings: [],
    savedListingId:'',
    groupByPhone: [],
    currentFilter: {},
    logs: {},
    message:"",
    reporting: {
        ownership: {
            isLoading: true,
            data: {}
        },
        listing:{
            rental:{
                isLoading: true,
                data:{}
            } ,
            sale:{
                isLoading: true,
                data:{}
            }
        },
        price: {
            rental:{
                isLoading: true,
                data: {},
            },
            sale: {
                isLoading: true,
                data: {},
            }
        },
        graph: {
            rental:{
                isLoading: true,
                data: {},
            },
            sale: {
                isLoading: true,
                data: {},
            }
        }
    }
};

export default function globalState(state = defaultState, action) {
    switch(action.type) {
        case SET_FILTER:
            return Object.assign({}, state, {
                currentFilter: action.payload,
            });
        case AREA_LOADED:
            return Object.assign({}, state, {
                areaLoading: true,
                areas: action.payload.areas,
            });
        case AREA_LOADING:
            return Object.assign({}, state, {
                areaLoading: true,
                listings: [],
            });
        case LOGS_LOADED:
            return Object.assign({}, state, {
                areaLoading: false,
                logs: action.payload.logs,
                totalCount: action.payload.totalCount,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
            });
        case LOGS_LOADING:
            return Object.assign({}, state, {
                logsLoading: true,
                logs: {},
            });

        case PAGE_LOADING:
            return Object.assign({}, state, {
                listingsLoading: true,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
                groupByStatus: [],
                groupByPhone: [],
                totalListings: state.totalListings,
                listings: [],
            });

        case PAGE_LOADED:
            return Object.assign({}, state, {
                listingsLoading: false,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
                totalListings: action.payload.total,
                listings: action.payload.listings,
                groupByStatus: action.payload.groupByStatus,
                allowedCities: action.payload.allowedCities,
                groupByPhone: action.payload.groupByPhone,
                groupByListingPhone: action.payload.groupByListingPhone,
                groupByOwners: action.payload.groupByOwners,
                lastScrapeDate: action.payload.lastScrapeDate,
            });
        case STAFF_LOGIN_HISTORY_LOADING:
            return Object.assign({}, state, {
                staffLoginHistoryLoading: true,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
                totalStaffLoginCount: '',
                staffLoginHistory: [],
            });

        case STAFF_LOGIN_HISTORY_LOADED:
            return Object.assign({}, state, {
                staffLoginHistoryLoading: false,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
                totalStaffLoginCount: action.payload.total,
                staffLoginHistory: action.payload.results,
            });
        case REPORT_OWNERSHIP_LOADED:
            return Object.assign({}, state, {
                reporting: Object.assign({}, state.reporting, {
                    ownership: {
                        isLoading: false,
                        data: action.payload.data,
                    }
                }),
            });
        case REPORT_PRICE_LOADED:
            return Object.assign({}, state, {
                reporting: Object.assign({}, state.reporting, {
                    price: Object.assign({}, state.reporting.price, {
                        [action.payload.type]: {
                            isLoading: false,
                            data: action.payload.data
                        }
                    }),
                }),
            });
        case REPORT_PRICE_GRAPH_LOADED:
            return Object.assign({}, state, {
                reporting: Object.assign({}, state.reporting, {
                    graph: Object.assign({}, state.reporting.graph, {
                        [action.payload.type]: {
                            isLoading: false,
                            data: action.payload.data
                        }
                    }),
                }),
            });
        case REPORT_LISTING_GRAPH_LOADED:
            return Object.assign({}, state, {
                reporting: Object.assign({}, state.reporting, {
                    listing: Object.assign({}, state.reporting.listing, {
                        [action.payload.type]: {
                            isLoading: false,
                            data: action.payload.data
                        }
                    }),
                }),
            });
        case LOGIN_LOADED:
            return Object.assign({}, state, {
                loginLoading: false,
                message: action.payload.message,
                userId: action.payload.userId,
                email: action.payload.email
            });
        case LOGIN_LOADING:
            return Object.assign({}, state, {
                loginLoading: true,
                isAdmin:false,
                message: '',
                userId: '',
                email: ''
            });
        case ADMIN_LOGIN_LOADED:
            return Object.assign({}, state, {
                loginLoading: false,
                message: action.payload.message,
                isAdmin:action.payload.isAdmin,
                userId: action.payload.userId,
                email: action.payload.email
            });
        case ADMIN_LOGIN_LOADING:
            return Object.assign({}, state, {
                loginLoading: true,
                message: '',
                userId: '',
                email: ''
            });
        case GET_STAFF_LIST:
            return Object.assign({}, state, {
                isLoading: true,
                staffUsers: ''
            });
        case GOT_STAFF_LIST:
            return Object.assign({}, state, {
                isLoading: false,
                staffUsers: action.payload.staffUsers
            });
        case ADDING_STAFF:
            return Object.assign({}, state, {
                isLoading: true,
                message: ''
            });
        case ADD_STAFF:
            return Object.assign({}, state, {
                isLoading: false,
                message: action.payload.message
            });
        case CHANGING_PASSWORD:
            return Object.assign({}, state, {
                isLoading: true,
                message: ''
            });
        case CHANGE_PASSWORD:
            return Object.assign({}, state, {
                isLoading: false,
                message: action.payload.message
            });
        case LISTING_SAVED:
            return Object.assign({}, state, {
                isLoading: false,
                savedListingId: action.payload.id,
                savedListingData: action.payload.data
            });
        case GOT_STAFF_STATUS_LIST:
            return Object.assign({}, state, {
                isLoading: false,
                staffStatusCount: action.payload.staffStatusCount
            });
        case GET_LISTING_REPORT:
            return Object.assign({}, state, {
                isLoading: true,
                staffStatusCount: []
            });
        case GOT_LISTING_REPORT:
            return Object.assign({}, state, {
                isLoading: false,
                listingsGroup: action.payload.listingsGroup,
                totalCountGroup: action.payload.totalCountGroup,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
            });
        case GOT_LISTING_PHONE:
            return Object.assign({}, state, {
                isLoading: false,
                listingsGroup: action.payload.listingsGroup,
                totalCountGroup: action.payload.totalCountGroup,
                currentPage: action.payload.pageNum,
                perPage: action.payload.perPage,
            });
        default:
            return state;
    }
}