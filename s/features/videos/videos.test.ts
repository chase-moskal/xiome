
import {Suite} from "cynic"

export default <Suite>{
	"dacast integration": {
		async "admin can connect and disconnect a dacast account via api key"() {return false},
	},
	"xiome-live": {
		async "admin can select a dacast livestream and viewership privilege"() {return false},
		async "privileged users can view the playlist"() {return false},
		async "unprivileged users are forbidden to view the playlist"() {return false},
	},
	"xiome-vods": {
		async "admin can select a dacast playlist and viewership privilege"() {return false},
		async "privileged users can view the playlist"() {return false},
		async "unprivileged users are forbidden to view the playlist"() {return false},
	},
}
