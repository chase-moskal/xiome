
import {Dacast} from "../../types/dacast-types.js"
import {RestClient} from "typed-rest-client/RestClient.js"
import {makeQueryString, QueryData} from "../../../../../toolbox/make-query-string.js"

const dacastApiUrl = "https://api.dacast.com"

export function dacastRestLegacy({apiKey, headers: moreHeaders}: {
		apiKey: string,
		headers: Partial<Dacast.Headers>
	}) {

	const headers: Omit<Dacast.Headers, "X-Api-Key"> = {
		"X-Format": "default",
		...moreHeaders,
	}

	const rest = new RestClient("xiome", dacastApiUrl, undefined, {headers})

	function get<xResult, xQuery extends QueryData = QueryData>(
			url: string,
			queryDefaults: QueryData = {}
		) {
		return async function(queryAdditions: xQuery = {} as xQuery) {
			const augmentedQueryDefaults = {"apikey": apiKey, ...queryDefaults}
			const query = {...augmentedQueryDefaults, ...queryAdditions}
			const urlWithQuery = url + makeQueryString(query)
			return (await rest.get<xResult>(urlWithQuery)).result
		}
	}

	return {get}
}
