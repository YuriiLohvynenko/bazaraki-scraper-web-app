import * as React from 'react';
import {loadLogs} from "../actions";
import { connect } from 'react-redux'
import Pagination from "../components/Pagination";

class LogPage extends React.Component {
	componentDidMount() {
		const { page } = this.props.match.params;
		this.props.loadPage(page, 20)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { page } = this.props.match.params;

		if (prevProps.match.params.page != page) {

			this.props.loadPage(page, 20);
		}
	}

	renderChanges = (changes, changedBy) => {
		if (!changes) return;
		let changeTxt = '';
		changes = JSON.parse(changes);
		for (let change in changes) {
			if (changes[change] && changes[change]['old']) {
				changeTxt += "<br/>"
				changeTxt += change;
				changeTxt += ": "+changes[change]['old'];
				changeTxt += " > "+changes[change]['new'];
			}
			else if(changes[change]['old'] == null){
				changeTxt = "status: none > "+changedBy;
			}
		}

		
		return changeTxt;
	}

	renderLogs = () => {
		if (!this.props.logs || Object.keys(this.props.logs).length === 0) {
			return ;
		}

		return this.props.logs.map((log, i) => {
			if (!log || (typeof log === 'object' && Object.keys(log).length === 0)) {
				return ;
			}
			return (
				<tr key={i}>
					<td>{log.listingId}</td>
					<td>{log.changedBy}</td>
					<td>{log.createdAt}</td>
					<td dangerouslySetInnerHTML={{__html: this.renderChanges(log.changes, log.changedBy)}}>{}</td>
				</tr>
			)
		})
	}

	render() {
		return (
			<div className="logPage">
				<br/>
				<br/>
				<br/>
				<table>
						<th>LISTING ID</th>
						<th>CHANGED BY</th>
						<th>CHANGED AT</th>
						<th>LOGS</th>
					<tbody>
					{this.renderLogs()}
					</tbody>
				</table>
				<Pagination
					page={'logs'}
					perPage={this.props.perPage}
					totalCount={this.props.totalCount}
					currentPage={this.props.currentPage}
					history={this.props.history}
					changePage={this.props.loadPage} />
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		logs: state.logs,
		perPage: state.perPage,
		totalCount: state.totalCount,
		currentPage: state.currentPage,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		loadPage: (pageNum, size) => dispatch(loadLogs(pageNum), size)
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LogPage)