import React from 'react';
import {
    Link
} from "react-router-dom";

export default function Pagination({ totalCount, currentPage, changePage, perPage, history, page, showStatusTable, groupByStatus, onClickHandler }) {

    const pageCount = Math.ceil(totalCount / perPage);

    let BASE_URL = "/r/";

    if(process.env.REACT_APP_DEV == 1) {
        BASE_URL = "/r2/";
    }

    return (
        <div className="pagination1 justify-content-center align-self-center align-items-center">
            <h2 id="res-count">Results: {totalCount}
                {showStatusTable && <a href="#" className="pointer-event help-link" onClick={onClickHandler}> <u>(Status stats)</u> </a>}
            </h2>
            {currentPage !== 1 && <Link className="p-first" to={BASE_URL+page+"/" + 1+history.location.search}>FIRST</Link> }
            {currentPage !== 1 && <Link className="p-prev" to={BASE_URL+page+"/" + (currentPage-1)+history.location.search}>PREV</Link>}

            <span className="p-current">Page {currentPage}/{pageCount}</span>
            {currentPage !== pageCount && <Link className="p-next" to={BASE_URL+page+"/" + (currentPage+1)+history.location.search}>NEXT</Link>}
            {currentPage !== pageCount && <Link className="p-last" to={BASE_URL+page+"/" + pageCount+history.location.search}>LAST</Link>}
        </div>
    )
}