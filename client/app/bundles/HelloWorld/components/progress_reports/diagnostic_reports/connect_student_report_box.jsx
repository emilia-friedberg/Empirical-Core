import React from 'react'
import ScoreColor from '../../modules/score_color.js'
import ConceptResultTableRow from './concept_result_table_row.jsx'
import StudentReportHeader from './student_report_header.jsx'
	import NumberSuffix from '../../modules/numberSuffixBuilder.js'

export default React.createClass({

	groupByAttempt: function(){
		return _.groupBy(this.props.questionData.concepts,
			(conc)=>conc.attempt
		);
	},

	feedbackOrDirections: (feedbackOrDirections, classNameAndText ) => {
		if (feedbackOrDirections) {
			return (<tr className={classNameAndText}>
				<td>{classNameAndText}</td>
				<td />
				<td><span>{feedbackOrDirections}</span></td>
			</tr>)
		}
	},

	conceptsByAttempt: function() {
		const conceptsByAttempt = this.groupByAttempt();
		let attemptNum = 1;
		let results = [];
		let feedback;
		let currAttempt = conceptsByAttempt[attemptNum]
		while (conceptsByAttempt[attemptNum]) {
			let nextAttempt = conceptsByAttempt[attemptNum + 1]
			console.log(nextAttempt);
			if (nextAttempt) {
				let index = 0;
				while (!feedback && nextAttempt[index]) {
					feedback = nextAttempt[index].directions
					index++
				}
				if (feedback) {
					feedback = this.feedbackOrDirections(feedback, 'Feedback')
				}
			}
			let score = 0;
			let concepts = currAttempt.map((concept)=>{
				concept.correct ? score++ : null;
				return [<ConceptResultTableRow key={concept.id} concept={concept}/>]
			});
			let averageScore = (score/currAttempt.length * 100) || 0;
			let scoreRow = this.scoreRow(currAttempt[0].answer, attemptNum, averageScore)
			feedback ? results.push(feedback, scoreRow, concepts) : results.push(scoreRow, concepts)
			if (conceptsByAttempt[attemptNum + 1]) {
				results.push(<tr/>)
			}
			attemptNum ++;
		}
		return results;
	},

	scoreRow: function(answer, attemptNum, averageScore) {
		return (
			<tr className={ScoreColor(averageScore)}>
				<td>{`${NumberSuffix(attemptNum)} Response`}</td>
				<td />
				<td>{answer}</td>
			</tr>
		)
	},

	questionScore: function() {
		if (this.props.questionData.questionScore) {
			return (
						<tr>
							<td>Score</td>
							<td/>
							<td>{this.props.questionData.questionScore * 100}%</td>
						</tr>
			);
		}
	},

	render: function() {
		const data = this.props.questionData;
		const header = this.props.boxNumber === 1 ? <StudentReportHeader boxNumber={this.props.boxNumber}/> : null;
		return (
			<div className='individual-activity-report'>
				<div className="student-report-box">
					<div className='student-report-table-and-index'>
							<div className='question-index'>{this.props.boxNumber}</div>
								<table>
									<tbody>
										{header}
										{this.feedbackOrDirections(data.directions, 'Directions')}
										<tr>
											<td>Prompt</td>
											<td/>
											<td>{data.prompt}</td>
										</tr>
										{this.questionScore()}
										<tr/>
										{this.conceptsByAttempt()}
	        				</tbody>
								</table>
				</div>
				</div>
			</div>
		);
	}

})
