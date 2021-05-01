
import {questionsPrivileges} from "../../api/questions-privileges.js"
import {QuestionPostRow} from "../../api/tables/types/questions-tables.js"
import {PrivilegeChecker} from "../../../auth/tools/permissions/types/privilege-checker.js"

export function requireUserCanEditQuestion({userId, questionPost, checker}: {
		userId: string
		questionPost: QuestionPostRow
		checker: PrivilegeChecker<typeof questionsPrivileges>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = questionPost.authorUserId === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
