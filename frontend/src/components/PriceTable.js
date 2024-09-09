import React, { useState } from 'react';
import LoadingIcon from "./LoadingIcon";

export default function PriceTable({ data, isLoading }) {
    const [selectedType, setSelectedType] = useState('Apartment');

    return (
        <React.Fragment>
            {isLoading && <LoadingIcon />}
            {!isLoading && <table>
                <tbody>
                <tr>
                    <td>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            {Object.keys(data).map(k => <option value={k}>{k}</option>)}
                        </select>
                    </td>
                    <td>All {selectedType}</td>
                    {Object.keys(data[selectedType]['totals'])
                        .filter(k => k !== 'all')
                        .map(k => <td>{k} bedroom</td>)}
                </tr>
                <tr>
                    <td>Totals</td>
                    <td>&euro;{data[selectedType]['totals']['all']['avg']}</td>
                    {Object.keys(data[selectedType]['totals'])
                        .filter(k => k !== 'all')
                        .map(k => <td>&euro;{data[selectedType]['totals'][k]['avg']}</td>)}
                </tr>
                {Object.keys(data[selectedType])
                    .filter(k => k !== 'totals')
                    .map(city => <tr>
                        <td>{city}</td>
                        <td>&euro;{data[selectedType][city]['all']['avg']}</td>
                        {Object.keys(data[selectedType]['totals'])
                                .filter(k => k !== 'all')
                                .map(price => <td>
                                    {data[selectedType][city][price] && "€" + data[selectedType][city][price]}
                                    {!data[selectedType][city][price] && "-"}
                                    </td>
                                )}
                    </tr>)}
                </tbody>
            </table>}
        </React.Fragment>

    )
}