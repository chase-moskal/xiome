
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {SimpleVoteRow} from "../../tables/types/questions-tables.js"

export async function vote({status, userId, itemId, voteTable}: {
		userId: DamnId
		itemId: DamnId
		status: boolean
		voteTable: DbbyTable<SimpleVoteRow>
	}) {

	const previousVote = await voteTable.count(find({userId, itemId}))
		> 0

	const addVote = () => voteTable.create({userId, itemId})
	const removeVote = () => voteTable.delete(find({userId, itemId}))

	if (!previousVote && status)
		await addVote()
	else if (previousVote && !status)
		await removeVote()
}
