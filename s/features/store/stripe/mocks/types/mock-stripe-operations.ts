import {Await} from "../../../../../types/await.js"
import {mockStripeLiaison} from "../mock-stripe-liaison.js"

export type MockStripeOperations =
	Await<ReturnType<typeof mockStripeLiaison>>["mockStripeOperations"]
