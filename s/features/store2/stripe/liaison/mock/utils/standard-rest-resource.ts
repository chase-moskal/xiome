
import {find} from "dbmage"
import * as dbmage from "dbmage"
import {stripeResponse} from "./stripe-response.js"

function ignoreUndefined<X extends {}>(input: X): X {
	const output = {}
	for (const [key, value] of Object.entries(input)) {
		if (value !== undefined)
			output[key] = value
	}
	return <X>output
}

export function prepareStandardRestResource({generateId}: {
		generateId: () => string
	}) {

	return function makeStandardRestResource<xResource>() {
		const throwAnError = () => { throw new Error("not implemented") }
		return function<xCreateParams, xUpdateParams>({
				table,
				handleCreate = throwAnError,
				handleUpdate = throwAnError,
			}: {
				table: dbmage.Table<any>
				handleCreate?: (params: xCreateParams) => Promise<Partial<xResource>>
				handleUpdate?: (id: string, params: xUpdateParams) => Promise<Partial<xResource>>
			}) {
			return {
				async create(params: xCreateParams) {
					const resource = <Partial<xResource>>{
						id: generateId().toString(),
						...await handleCreate(params),
					}
					await table.create(resource)
					return stripeResponse(<xResource>resource)
				},
				async update(id: string, params: xUpdateParams) {
					await table.update({
						...find({id}),
						write: ignoreUndefined(handleUpdate(id, params)),
					})
					const resource = await table.readOne(find({id}))
					return stripeResponse(<xResource>resource)
				},
				async retrieve(id: string) {
					const resource = await table.readOne(find({id}))
					return stripeResponse<xResource>(resource)
				},
				async delete(id: string) {
					await table.delete(find({id}))
					return stripeResponse({})
				},
			}
		}
	}
}
