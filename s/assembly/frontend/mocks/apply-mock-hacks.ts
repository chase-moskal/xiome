
import {Id} from "dbmage"

import {nap} from "../../../toolbox/nap.js"
import {Await} from "../../../types/await.js"
import {hitchie} from "../../../toolbox/hitchie.js"
import {mockConnect} from "../connect/mock/mock-connect.js"
import {DraftForNote, Notes} from "../../../features/notes/types/notes-concepts.js"
import {assembleAndInitializeFrontend} from "../assemble-and-initialize-frontend.js"

export function applyMockHacks({connection, frontend}: {
		connection: Await<ReturnType<typeof mockConnect>>
		frontend: Await<ReturnType<typeof assembleAndInitializeFrontend>>
	}) {

	const {loginService} = connection.remote.auth.users

	loginService.sendLoginLink = hitchie(
		loginService.sendLoginLink,
		async(func, ...args) => {
			await func(...args)
			const details = connection.backend.emails.recallLatestLoginEmail()
			console.log("mock: logging in...")
			await nap(1000)
			await frontend.models.accessModel.login(details.loginToken)
			console.log(`mock: logged in as ${details.to}`)
		},
	)

	connection.popups.triggerStripeConnectPopup = hitchie(
		connection.popups.triggerStripeConnectPopup,
		async(...args) => {
			console.log("mock: bank popup", args)
		},
	)

	const notesDepositBox = connection.backend.prepareNotesDepositBox(
		Id.fromString(frontend.appId)
	)

	window["fakeNote"] = async(draft: Partial<DraftForNote<Notes.Any>>) => {
		const userId = frontend.models.accessModel.getAccess()?.user?.userId
		const augmentedDraft = {
			from: undefined,
			details: {},
			text: "this is a message note "
				+ connection.backend.rando.randomId().toString().slice(0, 8),
			title: "this is a message title "
				+ connection.backend.rando.randomId().toString().slice(0, 8),
			type: "message" as const,
			to: userId,
			...draft,
		}
		if (!augmentedDraft.to)
			console.warn("who do you want to send this note to?\n('to' user id was not provided)")
		else {
			const {noteId} = await notesDepositBox.sendNote(augmentedDraft)
			console.log(`note sent! ${noteId}`)
		}
	}
}
