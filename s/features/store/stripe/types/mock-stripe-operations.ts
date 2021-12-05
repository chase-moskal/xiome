
import {Await} from "../../../../types/await.js"
import {mockStripeCircuit} from "../mock-stripe-circuit.js"

export type MockStripeOperations =
	Await<ReturnType<typeof mockStripeCircuit>>["mockStripeOperations"]
