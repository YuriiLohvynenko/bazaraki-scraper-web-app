import React from 'react';
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import ReportPage from "./pages/ReportPage";
import LogPage from "./pages/LogPage";
import StaffLogin from "./pages/StaffLogin";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminLogin from "./pages/AdminLogin";
import ListStaff from "./pages/ListStaff";
import StaffLoginList from "./pages/StaffLoginList";
import StaffPerformance from "./pages/StaffPerformance";
import ListingReport from "./pages/ListingReport";
import PhoneNumberListing from "./pages/PhoneNumberListing";
import StaffAccount from "./pages/StaffAccount";

export default function App() {
    let BASE_URL = "/r/";

    if(process.env.REACT_APP_DEV == 1) {
        BASE_URL = "/r2/";
    }

    let userId = localStorage.getItem('userId');
    if (!userId && (window.location.pathname !== BASE_URL+"stafflogin" && window.location.pathname !== BASE_URL+"adminLogin")) {
        window.location.href = BASE_URL+"stafflogin";
    }
    document.title = "HeroLeads";

    return (
        <div>
            <Router>
                <Header />
                <Switch>
                    <Route exact path={BASE_URL+"stafflist"} component={ListStaff}/>
                    <Route exact path={BASE_URL+"staffaccount"} component={StaffAccount}/>
                    <Route exact path={[BASE_URL+"staffloginlist",BASE_URL+"staffloginlist/:page"]} component={StaffLoginList}/>
                    <Route exact path={BASE_URL+"staffperformance"} component={StaffPerformance}/>
                    <Route exact path={[BASE_URL+"listingreport",BASE_URL+"listingreport/:page"]} component={ListingReport}/>
                    <Route exact path={[BASE_URL+"listingphone",BASE_URL+"listingphone/:page"]} component={PhoneNumberListing}/>
                    <Route exact path={BASE_URL+"stafflogin"} component={StaffLogin}/>
                    <Route exact path={BASE_URL+"adminlogin"} component={AdminLogin}/>
                    <Route exact path={[BASE_URL,BASE_URL+"page/:page"]} component={Homepage} />
                    <Route path={BASE_URL+"reports"}>
                        <ReportPage />
                    </Route>
                    <Route path={[BASE_URL+"logs/:page",BASE_URL+"logs/"]} component={LogPage}>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}