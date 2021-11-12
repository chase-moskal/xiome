
import {html} from "../../../../../framework/component.js"
import {ChatPost} from "../../../common/types/chat-concepts.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"

export function renderChatPost(post: ChatPost) {
	return html`
		<li data-post="${post.postId}">
			<p class=nickname>${post.nickname}</p>
			<p class=userid>${post.userId}</p>
			<p class=content>${post.content}</p>
			<p class=time>${formatDate(post.time).full}</p>
		</li>
	`
}
