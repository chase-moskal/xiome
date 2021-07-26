
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {SimpleVoteTable} from "../../tables/types/questions-tables.js"

export async function makeVotingBooth({userId, itemIds, likesTable, reportsTable}: {
		userId?: DamnId
		itemIds: DamnId[]
		likesTable: SimpleVoteTable
		reportsTable: SimpleVoteTable
	}) {
	const likes = await makeVoteCounter({itemIds, voteTable: likesTable})
	const reports = await makeVoteCounter({itemIds, voteTable: reportsTable})
	return {
		getVotingDetails(itemId: DamnId) {
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
		itemIds: DamnId[]
		voteTable: SimpleVoteTable
	}) {
	const votes = itemIds.length
		? await voteTable.read(findAll(itemIds, itemId => ({itemId})))
		: []
	return {
		countVotes(itemId: DamnId) {
			return votes
				.filter(vote => vote.itemId.toString() === itemId.toString())
				.length
		},
		voteStatus({userId, itemId}: {
				userId: DamnId
				itemId: DamnId
			}) {
			const votesByUser = votes
				.filter(vote => vote.userId.toString() === userId.toString())
			const userVotedForItem = !!votes
				.find(vote => vote.itemId.toString() === itemId.toString())
			return userVotedForItem
		},
	}
}
