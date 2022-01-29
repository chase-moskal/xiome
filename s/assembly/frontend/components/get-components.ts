
import theme from "../../../framework/theme.css.js"
import {themeComponents} from "../../../framework/component.js"
import {XiomeComponentOptions} from "./types/xiome-component-options.js"

import {integrateXioComponents} from "../../../features/xio-components/integrate-xio-components.js"
import {integrateAuthComponents} from "../../../features/auth/aspects/integrate-auth-components.js"
import {integrateChatComponents} from "../../../features/chat/components/integrate-chat-components.js"
import {integrateNotesComponents} from "../../../features/notes/components/integrate-notes-components.js"
import {integrateVideoComponents} from "../../../features/videos/components/integrate-video-components.js"
import {integrateExampleComponents} from "../../../features/example/components/integrate-example-components.js"
import {integrateQuestionsComponents} from "../../../features/questions/components/integrate-questions-components.js"
import {integrateAdministrativeComponents} from "../../../features/administrative/components/integrate-administrative-components.js"

export function getComponents(options: XiomeComponentOptions) {
	return themeComponents(theme, {
		...integrateXioComponents(),
		...integrateExampleComponents(options),
		...integrateAuthComponents(options),
		...integrateQuestionsComponents(options),
		...integrateAdministrativeComponents(options),
		...integrateVideoComponents(options),
		...integrateChatComponents(options),
		...integrateNotesComponents(options),

		// // TODO reactivate store
		// ...xiomeStoreComponents(options),
	})
}
