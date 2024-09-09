import * as React from 'react';
import {loadReportOwnership, loadReportPrice, loadReportPriceGraph, loadReportListingGraph} from "../actions";
import { connect } from 'react-redux'
import LoadingIcon from "../components/LoadingIcon";
import PriceTable from "../components/PriceTable";
import {PriceChart, ListingChart} from "../components/Chart";

class ReportPage extends React.Component {
    componentDidMount() {
        this.props.loadOwnershipData();
        this.props.loadPriceData('rental');
        this.props.loadPriceData('sale');
        this.props.loadPriceGraphData('rental');
        this.props.loadPriceGraphData('sale');
        this.props.loadListingGraphData('rental');
        this.props.loadListingGraphData('sale');
    }

    render() {
        return (
            <div>
                {this.props.ownership.isLoading && <LoadingIcon />}
                {!this.props.ownership.isLoading && <table>
                    <tbody>
                    <tr>
                        <td><strong>Ownership</strong></td>
                        <td>Residential sales</td>
                        <td>Residential rentals</td>
                        <td>Commercial sales</td>
                        <td>Commercial rentals</td>
                        <td>Building sales</td>
                    </tr>
                    {Object.entries(this.props.ownership.data).map(([k, v]) => <tr>
                        <td>{k === 'totals'
                            ? <p>Totals ({v.total.num} {v.total.ownerPct}/{v.total.agentPct}/{v.total.developerPct})</p>
                            : k}</td>
                        <td>{v.sale.num} ({v.sale.ownerPct}/{v.sale.agentPct}/{v.sale.developerPct})</td>
                        <td>{v.rental.num} ({v.rental.ownerPct}/{v.rental.agentPct}/{v.rental.developerPct})</td>
                        <td>{v.commercial_sale.num} ({v.commercial_sale.ownerPct}/{v.commercial_sale.agentPct}/{v.commercial_sale.developerPct})</td>
                        {v.commercial_rental && <td>{v.commercial_rental.num} ({v.commercial_rental.ownerPct}/{v.commercial_rental.agentPct}/{v.commercial_rental.developerPct})</td>}
                        {!v.commercial_rental && <td>0</td>}
                        <td>{v.building.num} ({v.building.ownerPct}/{v.building.agentPct}/{v.building.developerPct})</td>
                    </tr>)}
                    </tbody>
                </table>}
                <br />
                <h2>Residential rentals</h2><br />
                <PriceTable data={this.props.rentalPrice.data} isLoading={this.props.rentalPrice.isLoading} />
                <br />
                <h2>Residential Sales</h2><br />
                <PriceTable data={this.props.salesPrice.data} isLoading={this.props.salesPrice.isLoading} />
                <br />
                <table>
                    <tr>
                        <td>
                            <h2>Listing Monthly Rentals</h2><br />
                            {this.props.rentalListingGraph.isLoading && <LoadingIcon />}
                            {!this.props.rentalListingGraph.isLoading && <ListingChart data={this.props.rentalListingGraph.data} />}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Listing Monthly Sales</h2><br />
                            {this.props.salesListingGraph.isLoading && <LoadingIcon />}
                            {!this.props.salesListingGraph.isLoading && <ListingChart data={this.props.salesListingGraph.data} />}
                        </td>
                    </tr>

                </table>
                <table>
                    <tr>
                        <td>
                            <h2>Rentals</h2><br />
                            {this.props.rentalPriceGraph.isLoading && <LoadingIcon />}
                            {!this.props.rentalPriceGraph.isLoading && <PriceChart data={this.props.rentalPriceGraph.data} />}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Sales</h2><br />
                            {this.props.salesPriceGraph.isLoading && <LoadingIcon />}
                            {!this.props.salesPriceGraph.isLoading && <PriceChart data={this.props.salesPriceGraph.data} />}
                        </td>
                    </tr>
                </table>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ownership: state.reporting.ownership,
        rentalPrice: state.reporting.price.rental,
        salesPrice: state.reporting.price.sale,
        rentalPriceGraph: state.reporting.graph.rental,
        rentalListingGraph: state.reporting.listing.rental,
        salesListingGraph: state.reporting.listing.sale,
        salesPriceGraph: state.reporting.graph.sale,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadOwnershipData: () => dispatch(loadReportOwnership()),
        loadPriceData: (type) => dispatch(loadReportPrice(type)),
        loadPriceGraphData: (type) => dispatch(loadReportPriceGraph(type)),
        loadListingGraphData: (type) => dispatch(loadReportListingGraph(type))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage)