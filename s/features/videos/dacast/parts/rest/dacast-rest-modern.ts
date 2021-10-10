
import {Dacast} from "../../types/dacast-types.js"
import {RestClient} from "typed-rest-client/RestClient.js"
import {makeQueryString, QueryData} from "../../../../../toolbox/make-query-string.js"

const dacastApiUrl = "https://developer.dacast.com"

export function dacastRestModern({apiKey, headers: moreHeaders}: {
		apiKey: string,
		headers: Partial<Dacast.Headers>
	}) {

	const headers = {
		"X-Api-Key": apiKey,
		"X-Format": "default",
		...moreHeaders,
	}

	const rest = new RestClient("xiome", dacastApiUrl, undefined, {headers})

	function get<xResult, xQuery extends QueryData = QueryData>(
			url: string,
			queryDefaults: QueryData = {}
		) {
		return async function(queryAdditions: xQuery = {} as xQuery) {
			const query: xQuery = {...queryDefaults, ...queryAdditions}
			const urlWithQuery = url + makeQueryString(query)
			return (await rest.get<xResult>(urlWithQuery)).result
		}
	}

	return {get}
}
