import React, { useState } from 'react';
import {LineChart , BarChart, Bar, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip} from 'recharts';
const data = [
    {name: 'Page A', uv: 200, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 100, pv: 2300, amt: 2400},
    {name: 'Page C', uv: 150, pv: 2200, amt: 2400},
    {name: 'Page D', uv: 400, pv: 2100, amt: 2400},
];

const colors = {
    'Limassol district': '#c4040d',
    'Lefkosia (Nicosia) district': '#1d1ed6',
    'Paphos district': '#24ca4c',
    'Larnaca district': '#d819d5',
    'Famagusta district': '#e7e627',
};

export function PriceChart({ data }) {
    const [propertyType, setPropertyType] = useState('All');
    const [amountBedrooms, setAmountBedrooms] = useState('all');
    console.log(data[propertyType].data[amountBedrooms]);
    return (
        <React.Fragment>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                {Object.keys(data).map((k,i) => <option key={i} value={k}>{k}</option> )}
            </select>&nbsp;&nbsp;&nbsp;
            <select value={amountBedrooms} onChange={(e) => setAmountBedrooms(e.target.value)}>
                <option value="all">All</option>
                {Object.keys(data[propertyType]['data']).filter(k => k !== 'all').map(k => <option value={k}>{k}</option> )}
            </select>

            <LineChart width={1200} height={300} data={Object.values(data[propertyType].data[amountBedrooms])} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                {data.Apartment.cities.sort().map(c =>
                    <Line connectNulls type="monotone" dataKey={c} stroke={colors[c]} />)}
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart>
        </React.Fragment>
    );
}

export function ListingChart({ data }) {
    const [propertyType, setPropertyType] = useState('All');
    let maxPrice = 0;
    if (data && data[propertyType]) {
        let propertyArr = Object.values(data[propertyType].data);
        propertyArr.map(data => {
            console.log(data);
            for (let city in data) {
                if (city !== 'name' && parseInt(data[city]) > maxPrice) maxPrice = parseInt(data[city]);
            }
        });
    }
    else {
        return <div></div>;
    }

    maxPrice = parseInt(maxPrice) + 50;
    console.log('--------------------------')
    console.log(data)
    console.log('--------------------------')
    return (
        <React.Fragment>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                {Object.keys(data).map((k,i) => <option key={i} value={k}>{k}</option> )}
            </select>&nbsp;&nbsp;&nbsp;

            <BarChart width={1200} height={400} data={Object.values(data[propertyType].data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip itemSorter={() => 1} />
                <Legend verticalAlign="top" height={36}/>
                {data.Apartment.cities.sort((a,b) => (a + b)).map(c =>
                    <Bar stackId="a" type="monotone" dataKey={c} fill={colors[c]} label={c} />)}

                <XAxis dataKey="name"  />
                <YAxis type="number" domain={[0,maxPrice]}/>

            </BarChart>
        </React.Fragment>
    );
}