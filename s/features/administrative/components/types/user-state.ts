
import {EditWidget} from "./edit-widget.js"

export interface UserState {
	editWidget: false | EditWidget
	toggleEditWidget: () => void
}
