
import {AnswerPostRow} from "../../types/questions-schema.js"
import {PrivilegeChecker} from "../../../../auth/aspects/permissions/types/privilege-checker.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

export function requireUserCanEditAnswer({userId, answerPost, checker}: {
		userId: string
		answerPost: AnswerPostRow
		checker: PrivilegeChecker<typeof appPermissions["privileges"]>
	}) {
	const userIsModerator = checker.hasPrivilege("moderate questions")
	const userIsOwner = answerPost.authorUserId.toString() === userId
	const isAllowed = userIsModerator || userIsOwner
	if (!isAllowed)
		throw new Error(`user is not authorized to edit answer`)
}
