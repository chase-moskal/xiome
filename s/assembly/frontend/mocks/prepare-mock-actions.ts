
import {Await} from "../../../types/await.js"
import {mockConnectApp} from "../connect/mock/mock-connect-app.js"

type Connection = Await<ReturnType<typeof mockConnectApp>>
type MockBrowser = Await<ReturnType<Connection["backend"]["mockBrowser"]>>
type MockTab = Await<ReturnType<MockBrowser["mockAppWindow"]>>

export async function prepareMockActions({
		appOrigin,
		connection: {appId, backend: {emails, mockBrowser}},
	}: {
		appOrigin: string
		connection: Await<ReturnType<typeof mockConnectApp>>
	}) {

	return {
		async asMockPerson(
				email: string,
				action: (tab: MockTab) => Promise<void>
			) {
			const browser = await mockBrowser({appOrigin})
			const tab = await browser.mockAppWindow({appId})
			const {accessModel} = tab.models
			const {loginService} = tab.remote.auth.users

			emails.disableEmails()
			await loginService.sendLoginLink({email})
			const {loginToken} = emails.recallLatestLoginEmail()
			await accessModel.login(loginToken)

			await action(tab)

			await accessModel.logout()
			emails.enableEmails()
		},
	}
}
