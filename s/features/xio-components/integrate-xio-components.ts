
import {XioId} from "./id/xio-id.js"
import {XioOp} from "./op/xio-op.js"
import {XioMenu} from "./menu/xio-menu.js"
import {XioAvatar} from "./avatar/xio-avatar.js"
import {XioButton} from "./button/xio-button.js"
import {XioExample} from "./example/xio-example.js"
import {XioMenuItem} from "./menu/xio-menu-item.js"
import {XioCheckbox} from "./checkbox/xio-checkbox.js"
import {XioTextInput} from "./inputs/xio-text-input.js"
import {XioNightlight} from "./nightlight/xio-nightlight.js"
import {XioProfileCard} from "./profile-card/xio-profile-card.js"

export function integrateXioComponents() {
	return {
		XioId,
		XioOp,
		XioMenu,
		XioAvatar,
		XioButton,
		XioExample,
		XioCheckbox,
		XioMenuItem,
		XioTextInput,
		XioNightlight,
		XioProfileCard,
	}
}
