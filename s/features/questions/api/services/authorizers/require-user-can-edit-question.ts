
import {QuestionPostRow} from "../../tables/types/questions-tables.js"
import {PrivilegeChecker} from "../../../../auth/tools/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../../assembly/backend/permissions2/standard-permissions.js"

export function requireUserCanEditQuestion({userId, questionPost, checker}: {
		userId: string
		questionPost: QuestionPostRow
		checker: PrivilegeChecker<typeof appPermissions["privileges"]>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = questionPost.authorUserId === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
