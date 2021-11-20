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
	return html`
		<li data-post="${post.postId}">
			<header>
				<span class=nickname>${post.nickname}</span>
				<span class=userid>${post.userId}</span>
			</header>
			<p class=content>${post.content}</p>
			<footer>
				<span class=time>${formatDate(post.time).full}</span>
				${isModerator
					? html`
						<span>
							<xio-button @press=${mute}> ${muteIcon} mute</xio-button>
							<xio-button @press=${remove}> ${deleteIcon} delete</xio-button>
						</span>
					`
					: null}
			</footer>
		</li>
	`
}
