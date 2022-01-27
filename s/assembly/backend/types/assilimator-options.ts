
import {Rando} from "dbmage"
import {SecretConfig} from "./secret-config.js"
import {Configurators} from "./configurators.js"

export interface AssimilatorOptions extends Configurators {
	rando: Rando
	config: SecretConfig
}
