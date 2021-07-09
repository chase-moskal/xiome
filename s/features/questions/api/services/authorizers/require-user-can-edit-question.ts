
import {QuestionPostRow} from "../../tables/types/questions-tables.js"
import {PrivilegeChecker} from "../../../../auth/tools/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../../assembly/backend/permissions2/standard-permissions.js"

export function requireUserCanEditQuestion({id_user, questionPost, checker}: {
		id_user: string
		questionPost: QuestionPostRow
		checker: PrivilegeChecker<typeof appPermissions["privileges"]>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = questionPost.authorUserId === id_user
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
