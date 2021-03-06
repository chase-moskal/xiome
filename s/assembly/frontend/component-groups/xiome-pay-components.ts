
import {share2} from "../../../framework/component.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {XiomeBankConnect} from "../../../features/pay/components/bank-connect/xiome-bank-connect.js"

export function xiomePayComponents({models, modals}: XiomeComponentOptions) {
	const {authModel, bankModel} = models
	return {
		XiomeBankConnect: share2(XiomeBankConnect, {modals, authModel, bankModel}),
	}
}
