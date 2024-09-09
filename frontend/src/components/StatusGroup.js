import React from 'react';
import {
	Link
} from "react-router-dom";

export default function StatusGroup({ groupByStatus, totalCount }) {

	let renderTable = () => {
		return groupByStatus.map((data, index) => {
			return (
				<tr key={index}>
					<td>{data.status}</td>
					<td>{data.num}</td>
					<td>{parseFloat((data.num/totalCount)*100).toFixed(2)} %</td>
				</tr>
			)
		})
	}
	return (
		<div className="status-section">
			<table width="50%">
				<thead>
				<th>STATUS</th>
				<th>COUNT</th>
				<th>RATIO</th>
				</thead>
				<tbody>
				{renderTable()}
				</tbody>
			</table>
		</div>
	)
}