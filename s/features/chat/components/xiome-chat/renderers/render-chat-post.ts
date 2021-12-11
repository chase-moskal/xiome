
import muteIcon from "../../../../../framework/icons/mute.svg.js"
import unmuteIcon from "../../../../../framework/icons/unmute.svg.js"
import deleteIcon from "../../../../../framework/icons/delete.svg.js"

import {html} from "../../../../../framework/component.js"
import {ChatPost} from "../../../common/types/chat-concepts.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"

export function renderChatPost({
		post, isModerator, mute, remove, mutedIds,
		}: {
		post: ChatPost
		isModerator: boolean
		mute: () => void
		remove: () => void
		mutedIds: string[]
	}) {
	let postTime = formatDate(post.time)
	return html`
		<li data-post="${post.postId}">
			<header>
				<span class=nickname>${post.nickname}</span>
				${isModerator
					? html`
						<span class=moderation>
							<xio-button title="mute" @press=${mute}>${mutedIds.includes(post.userId) === true ? unmuteIcon : muteIcon}</xio-button>
							<xio-button title="delete" @press=${remove}>${deleteIcon}</xio-button>
						</span>
					`
					: null}
				<xio-id class=userid title="copy user id" id="${post.userId}"></xio-id>
			</header>
			<div>
				<p class=content>
					${post.content}
					<span class=time title="${postTime.date} ${postTime.zone}">
						${postTime.time}
					</span>
				</p>
			</div>
		</li>
	`
}
