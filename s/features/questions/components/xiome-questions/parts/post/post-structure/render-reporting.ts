
import warningSvg from "../../../../../../../framework/icons/warning.svg.js"
import warningFillSvg from "../../../../../../../framework/icons/warning-fill.svg.js"

import {Reporting} from "../types/post-options.js"
import {renderVotingUnit} from "../voting-unit/render-voting-unit.js"

export function renderReporting(reporting: Reporting) {
	return renderVotingUnit({
		dataVote: "report",
		icon: reporting.reported
			? warningFillSvg
			: warningSvg,
		title: reporting.reported
			? "unreport this post"
			: "report this post",
		voteCount: reporting.reports,
		voteCasted: reporting.reported,
		castVote: reporting.castReportVote
			? status => reporting.castReportVote(status)
			: undefined,
	})
}
