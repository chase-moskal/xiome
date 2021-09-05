
import theme from "../../../framework/theme.css.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"
import {themeComponents} from "../../../framework/component/component.js"

import {integrateAuthComponents} from "../../../features/auth/aspects/xiome-auth-components.js"
import {integrateXioComponents} from "../../../features/xio-components/integrate-xio-components.js"
import {integrateExampleComponents} from "../../../features/example/components/integrate-example-components.js"
import {integrateLivestreamComponents} from "../../../features/livestream/components/integrate-livestream-components.js"

import {integrateQuestionsComponents} from "../../../features/questions/components/integrate-questions-components.js"
import {integrateAdministrativeComponents} from "../../../features/administrative/components/integrate-administrative-components.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...integrateXioComponents(),
		...integrateExampleComponents(options),
		...integrateAuthComponents(options),
		...integrateLivestreamComponents(options),
		...integrateQuestionsComponents(options),
		...integrateAdministrativeComponents(options),

		// // TODO reactivate store
		// ...xiomeStoreComponents(options),
	})
}
