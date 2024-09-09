import React from 'react';
import Listing from "./Listing";

export default function ListingTable({ listings, saveHandler, history, groupByPhone, groupByOwners, staffUsers, scrollTo, groupByListingPhone }) {
    return (
        <table>
            <tbody>
                {listings.map(listing => <Listing key={listing.id} groupByListingPhone={groupByListingPhone} scrollTo={scrollTo} staffUsers={staffUsers} groupByPhone={groupByPhone} groupByOwners={groupByOwners} listing={listing} history={history} saveHandler={saveHandler} />)}
            </tbody>
        </table>
    )
}