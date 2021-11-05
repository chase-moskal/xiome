
import {Suite} from "cynic"

import dbby from "./toolbox/dbby/dbby.test.js"
import chat from "./features/chat/chat.test.js"
import videos from "./features/videos/videos.test.js"
import damnId from "./toolbox/damnedb/damn-id.test.js"
import debounce from "./toolbox/debounce/debounce.test.js"
import snapstate from "./toolbox/snapstate/snapstate.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"
import sortQuestions from "./features/questions/components/xiome-questions/helpers/sort-questions.test.js"

export default <Suite>{
	// "toolbox": {
	// 	snapstate,
	// 	dbby,
	// 	damnId,
	// 	debounce,
	// 	autowatcher,
	// },
	"features": {
		// // auth,
		// videos,
		// questions: {
		// 	sortQuestions,
		// },
		chat,
	},
}
