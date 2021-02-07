
import {TokenDepot} from "./types/token-depot.js"
import {dedupe} from "../../../../../toolbox/dedupe.js"
import {AppDisplay} from "../../../types/apps/app-display.js"
import {html, maybe} from "../../../../../framework/component.js"
import {prepareTokenDepots} from "./depot/prepare-token-depots.js"
import {parseOrigins} from "../../../topics/apps/parse-origins.js"
import {TokenManagerOptions} from "./types/token-manager-options.js"
import {AppTokenDisplay} from "../../../types/apps/app-token-display.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"
import {formatDuration} from "../../../../../toolbox/goodtimes/format-duration.js"
import {appTokenDraftValidators} from "../../../topics/apps/app-token-draft-validators.js"

export function makeTokenManager(options: TokenManagerOptions) {
	const {getTokenDepotForApp} = prepareTokenDepots(options)

	const renderXiomeConfig = (tokenActual: string) => {
		const h = (syntax: string, s: string) => html`<span data-syntax=${syntax}>${s}</span>`
		const tag = (s: string) => h("tag", s)
		const attr = (s: string) => h("attr", s)
		const data = (s: string) => h("data", s)
		const glue = (s: string) => h("glue", s)
		return html`
			${glue(`<`)}${tag(`xiome-config`)}
				<div data-syntax=indent>
					${attr(`app-token`)}${glue(`="`)}${data(tokenActual)}${glue(`"`)}${glue(`>`)}
				</div>
			${glue(`</`)}${tag(`xiome-config`)}${glue(`>`)}
		`
	}

	function renderTokenExpiry(expiry: number) {
		const now = Date.now()
		const isExpired = now > expiry

		function renderExpiryCountdown() {
			const {days, hours, minutes} = formatDuration(expiry - now)
			return `in ${days}, ${hours}, ${minutes}`
		}

		return html`
			<p ?data-is-expired=${isExpired}>
				${isExpired ? "expired!" : "expiry:"}
			</p>
			${isExpired
				? null
				: html`<p>${renderExpiryCountdown()}</p>`}
			<p class=expiry-date>${formatDate(expiry).full}</p>
		`
	}

	function renderTokenList(tokens: AppTokenDisplay[]) {
		return maybe(tokens.length > 0, html`
			<ul class="token-list">
				${tokens.map(token => html`
					<li>
						<p class=token-label>
							<span>⚡</span>
							<strong>${token.label}</strong>
							<code class=id>${token.appTokenId}</code>
						</p>
						<ul class=token-details>
							<li class=token-code>
								<p>copy-paste the config into your webpage html:</p>
								<code class="codeblock htmlcode">
									${renderXiomeConfig(token.appToken)}
								</code>
							</li>
							<li class=token-expiry>
								${renderTokenExpiry(token.expiry)}
							</li>
							<li class="token-origins">
								<p>allowed origins:</p>
								<ul>
									${token.origins.map(origin => html`
										<li>${origin}</li>
									`)}
								</ul>
							</li>
							<button
								class=delete-token-button
								@click=${() => options.deleteToken(token.appTokenId)}>
									delete connection
							</button>
						</ul>
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
				<h3>create a new connection</h3>

				<xio-text-input
					class=token-label
					placeholder="connection label"
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
