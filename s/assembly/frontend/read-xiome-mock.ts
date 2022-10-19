
import {configReading} from "./tools/config-reading.js"
import {XiomeMockConfig} from "./types/xiome-config-mock.js"

export function readXiomeMock(): XiomeMockConfig {
	const {attr} = configReading("xiome-mock")
	const rawMode = attr("mode")
	return {
		root: attr("root") ?? "",
		mode: (
			rawMode === undefined
				? undefined
				: rawMode === "platform"
					? "platform"
					: "app"
		)
	}
}
