import deleteIcon from "../../../../../framework/icons/delete.svg.js"
import muteIcon from "../../../../../framework/icons/mute.svg.js"

import {html} from "../../../../../framework/component.js"
import {ChatPost} from "../../../common/types/chat-concepts.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"

export function renderChatPost({
		post, isModerator, mute, remove,
		}: {
		post: ChatPost
		isModerator: boolean
		mute: () => void
		remove: () => void
	}) {
	let postTime = formatDate(post.time)
	return html`
		<li data-post="${post.postId}">
			<header>
				<span>
				<span class=nickname>${post.nickname}</span>
				<span class=userid>${post.userId}</span>
				</span>
				${isModerator
					? html`
						<span>
							<xio-button style="border: none;" title="Mute" @press=${mute}>${muteIcon}</xio-button>
							<xio-button title="Delete" @press=${remove}>${deleteIcon}</xio-button>
						</span>
					`
					: null}
			</header>
			<p class=content>${post.content}</p>
			<footer>
				<span title=${postTime.zone} class=time>${postTime.date} ${postTime.time}</span>
			</footer>
		</li>
	`
}
//${formatDate(post.time).date}
