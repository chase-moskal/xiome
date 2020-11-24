
// import {action, computed, observable} from "mobx"
// import {MetalUser, PremiumPachydermTopic, CardClues, PremiumInfo, TriggerCheckoutPopup, AuthPayload} from "../auth-types.js"

// import {AuthModel} from "./auth-model.js"
// export class PaywallModel {
// 	private readonly auth: AuthModel<MetalUser>
// 	private readonly checkoutPopupUrl: string
// 	private readonly operations = makeOperationsCenter()
// 	private readonly premiumPachyderm: PremiumPachydermTopic
// 	private readonly triggerCheckoutPopup: TriggerCheckoutPopup

// 	 @observable
// 	premiumInfoLoad: loading.Load<{cardClues: CardClues}> = loading.loading()

// 	 @computed
// 	get premium(): boolean {
// 		return isPremium(this.auth.user)
// 	}

// 	 @computed
// 	get premiumUntil(): number {
// 		return this.auth.user?.claims.premiumUntil
// 	}

// 	constructor(options: {
// 			auth: AuthModel<MetalUser>
// 			checkoutPopupUrl: string
// 			premiumPachyderm: PremiumPachydermTopic
// 			triggerCheckoutPopup: TriggerCheckoutPopup
// 		}) {
// 		Object.assign(this, options)
// 	}

// 	async handleAuthLoad(authLoad: loading.Load<AuthPayload<MetalUser>>) {
// 		this.setPremiumInfoLoad(
// 			loading.select<AuthPayload<MetalUser>, loading.Load<PremiumInfo>>(
// 				authLoad,
// 				{
// 					none: () => loading.none(),
// 					loading: () => loading.loading(),
// 					error: reason => loading.error(reason),
// 					ready: ({user}) => !!user
// 						? loading.loading()
// 						: loading.none(),
// 				}
// 			)
// 		)
// 		// this.setPremiumInfoLoad(loading.loading())
// 		const {getAuthContext} = loading.payload(authLoad) || {}
// 		if (getAuthContext) {
// 			const {accessToken} = await getAuthContext()
// 			try {
// 				const info = await this.operations.run(
// 					this.premiumPachyderm.getPremiumDetails({accessToken})
// 				)
// 				this.setPremiumInfoLoad(loading.ready(info))
// 			}
// 			catch (error) {
// 				this.setPremiumInfoLoad(loading.error("unable to load premium info"))
// 				console.error(error)
// 			}
// 		}
// 	}

// 	 @action.bound
// 	async checkoutPremium() {
// 		const {accessToken} = await this.auth.getAuthContext()
// 		const {stripeSessionId} = await this.premiumPachyderm.checkoutPremium({
// 			accessToken,
// 			popupUrl: this.checkoutPopupUrl,
// 		})
// 		await this.triggerCheckoutPopup({stripeSessionId})
// 		await this.auth.reauthorize()
// 	}

// 	 @action.bound
// 	async updatePremium() {
// 		const {accessToken} = await this.auth.getAuthContext()
// 		const {stripeSessionId} = await this.premiumPachyderm.updatePremium({
// 			accessToken,
// 			popupUrl: this.checkoutPopupUrl,
// 		})
// 		await this.triggerCheckoutPopup({stripeSessionId})
// 		await this.auth.reauthorize()
// 	}

// 	 @action.bound
// 	async cancelPremium() {
// 		const {accessToken} = await this.auth.getAuthContext()
// 		await this.premiumPachyderm.cancelPremium({accessToken})
// 		await this.auth.reauthorize()
// 	}

// 	 @action.bound
// 	private setPremiumInfoLoad(info: loading.Load<PremiumInfo>) {
// 		this.premiumInfoLoad = info
// 	}
// }
