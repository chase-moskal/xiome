
import {makeAuthModel2} from "../../features/auth/models/auth-model2.js"

export async function loginWithTokenFromLink({link, authModel}: {
		link: string
		authModel: ReturnType<typeof makeAuthModel2>
	}) {
	const {searchParams} = new URL(link)
	const loginToken = searchParams.get("login")
	if (loginToken) await authModel.login(loginToken)
}
