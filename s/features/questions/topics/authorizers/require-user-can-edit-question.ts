
import {QuestionPostRow} from "../../api/tables/types/questions-tables.js"
import {PrivilegeChecker} from "../../../auth/tools/permissions/types/privilege-checker.js"
import {appPrivileges} from "../../../../assembly/backend/permissions/standard/app/app-privileges.js"

export function requireUserCanEditQuestion({userId, questionPost, checker}: {
		userId: string
		questionPost: QuestionPostRow
		checker: PrivilegeChecker<typeof appPrivileges>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = questionPost.authorUserId === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
