
import heartSvg from "../../../../../../../framework/icons/heart.svg.js"
import heartFillSvg from "../../../../../../../framework/icons/heart-fill.svg.js"

import {Liking} from "../types/post-options.js"
import {renderVotingUnit} from "../voting-unit/render-voting-unit.js"

export function renderLiking(liking: Liking) {
	return renderVotingUnit({
		dataVote: "like",
		icon: liking.liked
			? heartFillSvg
			: heartSvg,
		title: liking.liked
			? "unlike this post"
			: "like this post",
		voteCount: liking.likes,
		voteCasted: liking.liked,
		castVote: liking.castLikeVote
			? status => liking.castLikeVote(status)
			: undefined,
	})
}
