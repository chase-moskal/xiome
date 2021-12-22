
import muteIcon from "../../../../../framework/icons/mute.svg.js"
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
	const postTime = formatDate(post.time)
	const userIsMuted = mutedIds.includes(post.userId)
	return html`
		<li data-post="${post.postId}">
			<header>
				<span class=nickname>${post.nickname}</span>
				${isModerator
					? html`
						<span class=moderation>
							<xio-button
								title="mute user"
								@press=${mute}
								?disabled=${userIsMuted}>
									${muteIcon}
							</xio-button>
							<xio-button
								title="delete post"
								@press=${remove}>
									${deleteIcon}
							</xio-button>
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
