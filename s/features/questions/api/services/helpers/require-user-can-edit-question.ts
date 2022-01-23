
import {QuestionPostRow} from "../../types/questions-schema.js"
import {PrivilegeChecker} from "../../../../auth/aspects/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

export function requireUserCanEditQuestion({userId, questionPost, checker}: {
		userId: string
		questionPost: QuestionPostRow
		checker: PrivilegeChecker<typeof appPermissions["privileges"]>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = questionPost.authorUserId.toString() === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit question`)
}
