
import {Question} from "../types/question.js"
import {questionsPrivileges} from "../../api/questions-privileges.js"
import {PrivilegeChecker} from "../../../auth/tools/permissions/types/privilege-checker.js"

export function requireUserCanEditQuestion({userId, question, checker}: {
		userId: string
		question: Question
		checker: PrivilegeChecker<typeof questionsPrivileges>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = question.authorUserId === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
