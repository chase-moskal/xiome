
import json5 from "json5"
import {getRando} from "dbmage"
import {deathWithDignity} from "renraku"
import {default as express} from "express"

import {SecretConfig} from "../../../../../assembly/backend/types/secret-config.js"
import {configureMongo} from "../../../../../assembly/backend/configurators/configure-mongo.js"
import {configureStripe} from "../../../../../assembly/backend/configurators/configure-stripe.js"
import {assimilateStripe} from "../../../../../assembly/backend/assimilators/assimilate-stripe.js"
import {assimilateDatabase} from "../../../../../assembly/backend/assimilators/assimilate-database.js"
import {configureMockFileStorage} from "../../../../../assembly/backend/configurators/configure-mock-file-storage.js"

deathWithDignity()
const config = json5.parse<SecretConfig>(process.env.XIOME_CONFIG)

if (typeof config.stripe === "string")
	throw new Error("stripe webhooks server doesn't operate in mock mode")

const {stripe, stripeWebhooks} = await (async() => {
	const rando = await getRando()
	const {databaseRaw, mockStorage} = await assimilateDatabase({
		config,
		configureMongo,
		configureMockStorage: () => configureMockFileStorage("./mock-database.json"),
	})
	return assimilateStripe({
		databaseRaw, mockStorage, config, rando, configureStripe,
	})
})()

const app = express()

app.get("/health", async(request, response) => {
	console.log(`⚕️ health check`)
	response.setHeader("Content-Type", "text/plain; charset=utf-8")
	response.statusCode = 200
	response.end(Date.now().toString())
})

app.post("/", express.raw({type: "application/json"}), async(request, response) => {
	let event = request.body

	if (typeof config.stripe === "object" && config.stripe.keys.webhookEndpointSecret) {
		const signature = request.headers["stripe-signature"]
		try {
			event = stripe.webhooks.constructEvent(
				request.body,
				signature,
				config.stripe.keys.webhookEndpointSecret,
			)
		}
		catch (error) {
			console.log("stripe webhook signature verification failed.", error.message)
			return response.sendStatus(400)
		}
	}

	const webhook = stripeWebhooks[event.type]

	if (webhook) {
		try {
			await webhook(event)
			response.json({received: true})
		}
		catch (error) {
			console.error("webhook error:", error.message)
			response.status(500).send("internal server error while executing webhook")
		}
	}
	else {
		response.json({received: true})
	}
})

const {port} = config.stripe.webhookServer

app.listen(
	port,
	() => console.log(
		`🚀 listening for stripe webhooks on port ${port}`
	)
)
