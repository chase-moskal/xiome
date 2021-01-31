
import {TokenDepot} from "../types/token-depot.js"
import {html} from "../../../../../../framework/component.js"
import {AppDisplay} from "../../../../types/apps/app-display.js"
import {parseOrigins} from "../../../../topics/apps/parse-origins.js"
import {appTokenDraftValidators} from "../../../../topics/apps/app-token-draft-validators.js"

export function makeTokenManagerRenderer({tokenDepotForApp}: {
		tokenDepotForApp: (app: AppDisplay) => TokenDepot
	}) {

	function renderTokenCreator(depot: TokenDepot) {
		const {state, handleFormChange, handleSubmitClick} = depot
		const {formDisabled, draft, problems} = state.form
		return html`
			<xio-text-input
				class=token-label
				placeholder="token label"
				.validator=${appTokenDraftValidators.label}
				@valuechange=${handleFormChange}
			></xio-text-input>

			<xio-text-input
				textarea
				class=token-origins
				placeholder="origins"
				?disabled=${formDisabled}
				.parser=${parseOrigins}
				.validator=${appTokenDraftValidators.origins}
				@valuechange=${handleFormChange}
			></xio-text-input>

			<button
				class=create-token-button
				?disabled=${formDisabled || !draft || problems.length > 0}
				@click=${handleSubmitClick}>
					create token
			</button>
		`
	}

	return function render(app: AppDisplay) {
		const depot = tokenDepotForApp(app)
		return html`
			<div class=tokenmanager>
				<ul>
					${app.tokens.map(token => html`
						<li>
							<p>token-heading</p>
							<p class=token-label>${token.label}</p>
							<p class=token-id>${token.appTokenId}</p>
							<p class=token-itself>${token.appToken}</p>
							<p class=token-expiry>${token.expiry}</p>
							<p class=token-origins>${token.origins.join("<br/>")}</p>
						</li>
					`)}
				</ul>
				${renderTokenCreator(depot)}
			</div>
		`
	}
}
