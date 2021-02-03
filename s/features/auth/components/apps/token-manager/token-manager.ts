
import {TokenDepot} from "./types/token-depot.js"
import {dedupe} from "../../../../../toolbox/dedupe.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {html, maybe} from "../../../../../framework/component.js"
import {prepareTokenDepots} from "./depot/prepare-token-depots.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {TokenManagerOptions} from "./types/token-manager-options.js"
import {AppTokenDisplay} from "../../../types/apps/app-token-display.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"
import {appTokenDraftValidators} from "../../../topics/apps/app-token-draft-validators.js"

const xiomeConfig = (tokenActual: string) => {
	const h = (syntax: string, s: string) => html`<span data-syntax=${syntax}>${s}</span>`
	const tag = (s: string) => h("tag", s)
	const attr = (s: string) => h("attr", s)
	const data = (s: string) => h("data", s)
	const glue = (s: string) => h("glue", s)
	return html`
		${glue(`<`)}${tag(`xiome-config`)}
			<div data-syntax=indent>
				${attr(`token`)}${glue(`="`)}${data(tokenActual)}${glue(`"`)}${glue(`>`)}
			</div>
		${glue(`</`)}${tag(`xiome-config`)}${glue(`>`)}
	`
}

export function makeTokenManager(options: TokenManagerOptions) {
	const {getTokenDepotForApp} = prepareTokenDepots(options)

	function renderTokenList(tokens: AppTokenDisplay[]) {
		return maybe(tokens.length > 0, html`
			<ul class="token-list">
					${tokens.map(token => html`
						<li>
							<p class=token-label>
								<span>🎟️</span>
								<span>${token.label}</span>
							</p>
							<p class=token-id>
								<span>token id:</span>
								<code>${token.appTokenId}</code>
							</p>
							<p class=token-expiry>
								<span>expiry</span>
								${formatDate(token.expiry).full}
							</p>
							<p>
								<span>allowed origins</span>
							</p>
							<ul class=token-origins>
								${token.origins.map(origin => html`
									<li>${origin}</li>
								`)}
							</ul>
							<p class=token-code>
								<span>copy-paste the config into your webpage html:</span>
								<code class="codeblock xiome-config">
									${xiomeConfig(token.appToken)}
								</code>
							</p>
							<button
								class=delete-token-button
								@click=${() => options.deleteToken(token.appTokenId)}>
									delete token
							</button>
						</li>
					`)}
			</ul>
		`)
	}

	function renderTokenCreator(app: AppDisplay, depot: TokenDepot) {
		const {state, handleFormChange, handleSubmitClick} = depot
		const {formDisabled, draft, problems} = state.form
		function parseOriginsIncludingHome(text: string) {
			const homeOrigin = new URL(app.home).origin
			return dedupe(parseOrigins(`${homeOrigin}\n${text}`))
		}
		return html`
			<div class=token-creator>
				<h4>create a new app token</h4>

				<xio-text-input
					class=token-label
					placeholder="token label"
					.validator=${appTokenDraftValidators.label}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<xio-text-input
					textarea
					class=token-origins
					placeholder="additional origins"
					?disabled=${formDisabled}
					show-validation-when-empty
					.parser=${parseOriginsIncludingHome}
					.validator=${appTokenDraftValidators.origins}
					@valuechange=${handleFormChange}
				></xio-text-input>

				<button
					class=create-token-button
					?disabled=${formDisabled || !draft || problems.length > 0}
					@click=${handleSubmitClick}>
						create token
				</button>
			</div>
		`
	}

	function render(app: AppDisplay) {
		const depot = getTokenDepotForApp(app)
		return html`
			<div class=token-manager>
				${renderTokenList(app.tokens)}
				${renderTokenCreator(app, depot)}
			</div>
		`
	}

	return {render}
}
