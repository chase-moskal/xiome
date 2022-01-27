
import {SimpleVoteTable} from "../../types/questions-schema.js"
import {Id, findAll} from "dbmage"

export async function makeVotingBooth({userId, itemIds, likesTable, reportsTable}: {
		userId?: Id
		itemIds: Id[]
		likesTable: SimpleVoteTable
		reportsTable: SimpleVoteTable
	}) {
	const likes = await makeVoteCounter({itemIds, voteTable: likesTable})
	const reports = await makeVoteCounter({itemIds, voteTable: reportsTable})
	return {
		getVotingDetails(itemId: Id) {
			return {
				likes: likes.countVotes(itemId),
				reports: reports.countVotes(itemId),
				liked: userId
					? likes.voteStatus({userId, itemId})
					: false,
				reported: userId
					? reports.voteStatus({userId, itemId})
					: false,
			}
		}
	}
}

async function makeVoteCounter({itemIds, voteTable}: {
		itemIds: Id[]
		voteTable: SimpleVoteTable
	}) {
	const votes = itemIds.length
		? await voteTable.read(findAll(itemIds, itemId => ({itemId})))
		: []
	return {
		countVotes(itemId: Id) {
			return votes
				.filter(vote => vote.itemId.toString() === itemId.toString())
				.length
		},
		voteStatus({userId, itemId}: {
				userId: Id
				itemId: Id
			}) {
			const votesByUser = votes
				.filter(vote => vote.userId.toString() === userId.toString())
			const userVotedForItem = !!votesByUser
				.find(vote => vote.itemId.toString() === itemId.toString())
			return userVotedForItem
		},
	}
}
