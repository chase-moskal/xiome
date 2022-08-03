
import {prepareMockStripeOperations} from "./prepare-mock-stripe-operations.js"

export function prepareNoopStripeOperations(): ReturnType<typeof prepareMockStripeOperations> {
	return <any>new Proxy({}, {
		get(t, key: string) {
			return async() => {
				throw new Error(`no-op stripe operation for "${key}"`)
			}
		},
	})
}
