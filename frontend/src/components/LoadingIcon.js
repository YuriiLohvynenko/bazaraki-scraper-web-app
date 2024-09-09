import * as React from 'react';
import loader from '../images/ajax-loader.gif';

export default function LoadingIcon() {
    return (
        <div className="loading">
            <img src={loader} alt="" />
        </div>

    )
}