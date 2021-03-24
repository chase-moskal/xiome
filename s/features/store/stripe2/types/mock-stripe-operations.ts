
import {Await} from "../../../../types/await.js"
import {mockStripeCircuit} from "../mocks/mock-stripe-circuit.js"

export type MockStripeOperations =
	Await<ReturnType<typeof mockStripeCircuit>>["mockStripeOperations"]
