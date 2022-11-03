
import * as dbmage from "dbmage"

export function dedupe<T>(arr: T[]): T[] {
	return [...new Set(arr)]
}

export function dedupeIds(ids: dbmage.Id[]) {
	const idStrings = ids.map(id => id.string)
	const dedupedStrings = dedupe(idStrings)
	return dedupedStrings.map(id => dbmage.Id.fromString(id))
}
