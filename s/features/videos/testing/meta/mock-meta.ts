
import {VideoMeta} from "../../types/video-auth.js"
import {mockMeta} from "../../../../common/testing/mock-meta.js"

export async function mockVideoMeta({appId, userId, origins, privileges}: {
		appId: string
		userId: string
		origins: string[]
		privileges: string[]
	}) {
	return mockMeta<VideoMeta>({
		access: {
			appId,
			origins,
			permit: {privileges},
			scope: {core: true},
			user: {
				userId,
				profile: {
					avatar: undefined,
					nickname: "Steven Seagal",
					tagline: "totally ripped and sweet",
				},
				roles: [],
				stats: {joined: Date.now()},
			},
		},
	})
}
