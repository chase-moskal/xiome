
import {Suite} from "cynic"

import chat from "./features/chat/chat.test.js"
import store from "./features/store/store.test.js"
import notes from "./features/notes/notes.test.js"
import videos from "./features/videos/videos.test.js"
import debounce from "./toolbox/debounce/debounce.test.js"
import sequencer from "./toolbox/sequencer/sequencer.test.js"
import snapstate from "./toolbox/snapstate/snapstate.test.js"
import autowatcher from "./toolbox/autowatcher/autowatcher.test.js"
import rateLimiter from "./toolbox/rate-limiter/rate-limiter.test.js"
import sortQuestions from "./features/questions/components/xiome-questions/helpers/sort-questions.test.js"

export default <Suite>{
	"toolbox": {
		sequencer,
		snapstate,
		debounce,
		autowatcher,
		rateLimiter,
	},
	"features": {
		// auth,
		videos,
		questions: {
			sortQuestions,
		},
		chat,
		notes,
		store,
	},
}
