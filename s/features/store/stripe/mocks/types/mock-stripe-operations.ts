
import {Await} from "../../../../../types/await.js"
import {mockStripeComplex} from "../../mock-stripe-complex.js"

export type MockStripeOperations =
	Await<ReturnType<typeof mockStripeComplex>>["mockStripeOperations"]
