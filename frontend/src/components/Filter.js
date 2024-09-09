import React from 'react';
import MultiSelect from "react-multi-select-component";

export default class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.isAdmin = localStorage.getItem('isAdmin');
        this.userName = localStorage.getItem('userName');
        this.state = {
            id:'',
            bid:'',
            listingType: [],
            listSize: 25,
            listedByType: [],
            propertyType: [],
            cities: [],
            phoneNumber: '',
            minPrice: '',
            maxPrice: '',
            status: [],
            assignedTo: [],
            allowDuplicates: 1,
            bedrooms: [],
            bathrooms: [],
            areas:[],
            sortBy:'Listing date',
            sortType: 'descending'
        };
        if (!this.props.history.location.search && !this.isAdmin) {
            this.state.assignedTo = [{label: this.userName, value: this.userName}, {
                    label: 'Unassigned',
                    value: 'Unassigned'
                }];
            this.state.listingType = [{
                label:"Rental",
                value:"rental"
            }];
            this.state.listedByType = [{
                label: "Owner",
                value: "Owner"
            }];
        }
        this.listingType = [
            {
                label:"Rental",
                value:"rental"
            },
            {
                label:"Sale",
                value:"sale"
            },
            {
                label:"Commercial Rental",
                value:"commercial_rental"
            },
            {
                label:"Commercial Sale",
                value:"commercial_sale"
            },
            {
                label:"Plot",
                value:"plot"
            },
            {
                label:"Building",
                value:"building"
            }
        ];

        this.ownership = [
            {
                label: "Owner",
                value: "Owner"
            },
            {
                label: "Agent",
                value: "Agent"
            },
            {
                label: "Developer",
                value: "Developer"
            }
        ];

        this.status = [
            {
                label: "Pending: Follow up (72hr limit)",
                value:"Follow up"
            },
            {
                label: "Pending: No answer, try again later (72hr limit)",
                value:"No answer, try again later"
            },
            {
                label: "Success: Answered, listing added",
                value:"Answered, listing added"
            },
            {
                label: "Success: Answered, already rented, listing added for future",
                value:"Answered, already rented, listing added for future"
            },
            {
                label: "Success: Answered, agent split commission",
                value:"Answered, agent split commission"
            },
            {
                label: "Failed: Answered, not interested",
                value:"Answered, not interested"
            },
            {
                label: "Failed: Answered, agent",
                value:"Answered, agent"
            },
            {
                label: "Failed: Called multiple times, or phone number incorrect",
                value:"Failed multiple times, or phone number incorrect"
            },
            {
                label: "Deleted",
                value:"Deleted"
            }
        ];
        this.assignedTo = [
            {
                label:"Solonas",
                value: "Solonas"
            },
            {
                label:"Jack",
                value: "Jack"
            },
            {
                label:"Ruben",
                value: "Ruben"
            }
        ];
        if (this.props.allowedCities) {
            this.cities = this.props.allowedCities.split(',').map(city => {
                return {
                    label: city,
                    value: city
                }
            })
        }
        else {
            this.cities = [{
                label:"Famagusta district",
                value:"Famagusta district"
            },
                {
                    label:"Larnaca district",
                    value:"Larnaca district"
                },
                {
                    label:"Lefkosia (Nicosia) district",
                    value:"Lefkosia (Nicosia) district"
                },
                {
                    label:"Limassol district",
                    value:"Limassol district"
                },
                {
                    label:"Paphos district",
                    value:"Paphos district"
                }];

        }
        this.propertyTypes = [
            {
                label:"Apartment",
                value:"Apartment"
            },
            {
                label:"Detached house",
                value:"Detached house"
            },
            {
                label:"Semi-detached",
                value:"Semi-detached"
            },
            {
                label:"Ground floor apartment",
                value:"Ground floor apartment"
            },
            {
                label:"Town house",
                value:"Town house"
            },
            {
                label:"Penthouse",
                value:"Penthouse"
            },
            {
                label:"Bungalow",
                value:"Bungalow"
            },
            {
                label:"Villa",
                value:"Villa"
            },
            {
                label: "House Share",
                value: "House Share"
            }
        ];
        this.bedrooms = [];
        for (let i = 1;i<=10;i++) {
            this.bedrooms.push({label:i, value:i});
        }
        this.bathrooms = [];
        for (let i = 1;i<=10;i++) {
            this.bathrooms.push({label:i, value:i});
        }
        if (this.props.staffUsers && this.props.staffUsers.length > 0 ) {
            this.assignedTo = this.props.staffUsers.map(user => { return {label: user, value: user}})
        }

        let searchParam = decodeURI(this.props.history.location.search).replace('?','');

        searchParam = searchParam.split("&");
        let splitAndMerge = (str) => {
            let arr = str.split('$');
            return arr.map(data => {
                return {label: data, value: data}
            })
        }
        searchParam.map(param => {
            let searchData = param.split("=")
            if ((searchData[0] === 'cities'
                || searchData[0] === 'assignedTo'
                || searchData[0] === 'propertyType'
                || searchData[0] === 'listingType'
                || searchData[0] === 'listedByType'
                || searchData[0] === 'bedrooms'
                || searchData[0] === 'bathrooms'
                || searchData[0] === 'status'|| searchData[0] === 'areas') && searchData[1].length > 0) {
                this.state[searchData[0]] =splitAndMerge(searchData[1]);

            }else {
                this.state[searchData[0]] = searchData[1];
            }
        })
    }

    handleEnter = e => {
        if (e && e.charCode === 13) {
            this.handleSearchClick(true);
        }
    };


    handleListedByTypeChange = (e) => this.setState({
        listedByType: e.target.value
    });

    handleListSize = (e) => this.setState({
        listSize: e.target.value
    });

    handleSortBy = (e) => this.setState({
        sortBy: e.target.value
    });
    handleSortType = (e) => this.setState({
        sortType: e.target.value
    });
    handleBathrooms = (e) => this.setState({
        bathrooms: e.target.value
    });


    handlePropertyTypeChange = (e) => this.setState({
        propertyType: e.target.value
    });

    handleCityChange = (e) => this.setState({
        city: e.target.value
    });

    handlePhoneNumberChange = (e) => this.setState({
        phoneNumber: e.target.value
    });

    handleMinPriceChange = (e) => this.setState({
        minPrice: e.target.value
    });

    handleMaxPriceChange = (e) => this.setState({
        maxPrice: e.target.value
    });

    handleStatusChange = (e) => this.setState({
        status: e.target.value
    });

    handleAssignedToChange = (e) => this.setState({
        assignedTo: e.target.value
    });

    handleAllowDuplicatesChange = (e) => this.setState({
        allowDuplicates: parseInt(e.target.value)
    });
    handleListingTypeChange = (e) => this.setState({
        listingType: e.target.value
    });

    handleBedroomsChange = (e) => this.setState({
        bedrooms: e.target.value
    });

    handleSearchClick = (fromFilter) => {
        let covertToSingleArray = (arr) => {
            return arr.map(data => data.value);
        }
        let obj = {
            ...this.state
        };
        for (let keys in obj) {
            if (keys && obj[keys] !== ''){
                let filterValue = obj[keys];
                if (typeof filterValue === 'object') {
                    obj[keys] = covertToSingleArray(filterValue);
                }
            }
        }
        if (obj.cities){
            this.props.loadAreas({cities:obj.cities.map(data => data.value? data.value : data)});
        }
        else {
            this.props.loadAreas();
        }

        this.props.setFilter(obj, this.props.history, fromFilter);
    }

    cityMultiSelect = (selectedList, selectedItem) => {
        this.props.loadAreas({cities:selectedList.map(data => data.value)});
        this.setState({
            cities: selectedList
        })
    };

    bedroomsMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            bedrooms: selectedList
        })
    };

    bathroomsMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            bathrooms: selectedList
        })
    };

    AssignedToMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            assignedTo: selectedList
        })
    };
    statusMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            status: selectedList
        })
    };
    areaMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            areas: selectedList
        })
    };
    propertyTypeMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            propertyType: selectedList
        })
    };
    listingTypeMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            listingType: selectedList
        })
    };
    ownershipMultiSelect = (selectedList, selectedItem) => {
        this.setState({
            listedByType: selectedList
        })
    };
    render() {
        return (
            <div id="filter-cont">

                <div className="filter">

                    <div className="filter-card">
                        <p>Listing type</p>

                        <MultiSelect options={this.listingType} onChange={this.listingTypeMultiSelect} value={this.state.listingType} labelledBy={'select'}/>
                    </div>

                    <div className="filter-card">
                        <p>Ownership</p>
                        <MultiSelect options={this.ownership} onChange={this.ownershipMultiSelect} value={this.state.listedByType} labelledBy={'select'}/>

                    </div>

                    <div className="filter-card">
                        <p>Property type</p>
                        <MultiSelect options={this.propertyTypes} onChange={this.propertyTypeMultiSelect} value={this.state.propertyType} labelledBy={'select'}/>

                    </div>

                    <div className="filter-card">
                        <p>City</p>
                        <MultiSelect options={this.cities} onChange={this.cityMultiSelect} value={this.state.cities} labelledBy={'select'}
                      />
                    </div>

                    {this.props.areas && <div className="filter-card">
                        <p>Area</p>
                        <MultiSelect options={this.props.areas} onChange={this.areaMultiSelect} value={this.state.areas} labelledBy={'select'}
                        />
                    </div>}
                    <div className="filter-card">
                        <p>Bedrooms</p>
                        <MultiSelect options={this.bedrooms} onChange={this.bedroomsMultiSelect} value={this.state.bedrooms} labelledBy={'select'}
                        />
                    </div>
                    <div className="filter-card">
                        <p>Bathrooms</p>
                        <MultiSelect options={this.bathrooms} onChange={this.bathroomsMultiSelect} value={this.state.bathrooms} labelledBy={'select'}
                        />
                    </div>
                    <div className="filter-card">
                        <p>Min price (€)</p>
                        <input type="text" id="minprice" onKeyPress={this.handleEnter} value={this.state.minPrice} placeholder="No limit" onChange={this.handleMinPriceChange} />
                    </div>
                    <div className="filter-card">
                        <p>Max price (€)</p>
                        <input type="text" id="maxprice" onKeyPress={this.handleEnter} value={this.state.maxPrice} placeholder="No limit" onChange={this.handleMaxPriceChange} />
                    </div>
                    <div className="filter-card">
                        <p>Phone</p>
                        <input type="text" id="fphone" value={this.state.phoneNumber} onKeyPress={this.handleEnter} placeholder="-" onChange={this.handlePhoneNumberChange} />
                    </div>
                    <div className="filter-card filterStatus">
                        <p>Status</p>
                        <MultiSelect options={this.status} onChange={this.statusMultiSelect} value={this.state.status} labelledBy={'select'} />
                    </div>

                    <div className="filter-card">
                        <p>Assigned to</p>
                        <MultiSelect options={this.assignedTo} onChange={this.AssignedToMultiSelect} value={this.state.assignedTo} labelledBy={'select'}/>
                    </div>
                    <div className="filter-card">
                        <p>Sort by</p>
                        <select value={this.state.sortBy} onChange={this.handleSortBy}>
                            <option value="Listing date">Listing date</option>
                            <option value="Price">Price</option>
                            {/*                            <option value="Last re-listing date">Last re-listing date</option>
                            <option value="Last staff update">Last staff update</option>
                            <option value="Listings per phone number">Listings per phone number</option>*/}
                        </select>
                    </div>
                    <div className="filter-card">
                        <p>Sort type</p>
                        <select value={this.state.sortType} onChange={this.handleSortType}>
                            <option value="descending">descending</option>
                            <option value="ascending">ascending</option>
                        </select>
                    </div>

                    <div className="filter-card">
                        <p>Per page</p>
                        <select value={this.state.listSize} onChange={this.handleListSize}>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>


                    <div className="filter-card">
                        <div className="btn-filter text-center" onClick={() => this.handleSearchClick(true)}>SEARCH</div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.staffUsers !== this.props.staffUsers) {
            if(this.props.staffUsers && this.props.staffUsers.length > 0) {
                this.assignedTo = this.props.staffUsers.map(user => { if(user.name !== 'Jackc' && user.name !== 'Daniel') { return {label: user.name, value: user.name}}})
                this.assignedTo.unshift({label:'Unassigned', value: 'Unassigned'})
                 if (!this.props.history.location.search && !this.isAdmin) {
                     this.setState({
                         assignedTo: [{label: this.userName, value: this.userName}, {
                             label: 'Unassigned',
                             value: 'Unassigned'
                         }]
                     });
                 }
                this.forceUpdate();
            }
        }
        if (prevProps.allowedCities !== this.props.allowedCities && this.props.allowedCities) {
            this.cities = this.props.allowedCities.split(',').map(city => {
                return {
                    label: city,
                    value: city
                }
            })
            this.forceUpdate();
        }
    }

    componentDidMount() {
        this.handleSearchClick(false);
    }
}