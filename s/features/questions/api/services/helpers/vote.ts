
import {SimpleVoteTable} from "../../types/questions-schema.js"
import {Id, find} from "dbmage"

export async function vote({status, userId, itemId, voteTable}: {
		userId: Id
		itemId: Id
		status: boolean
		voteTable: SimpleVoteTable
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
