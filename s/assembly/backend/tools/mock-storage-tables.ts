
import {dbbyX} from "../../../toolbox/dbby/dbby-x.js"
import {objectMap} from "../../../toolbox/object-map.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {BlueprintForTables} from "../types/blueprint-for-tables.js"
import {DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStorageTables<xTables extends {[key: string]: DbbyTable<DbbyRow>}>(
		flexStorage: FlexStorage,
		blueprint: BlueprintForTables<xTables>,
	): Promise<xTables> {

	return <xTables><any>await concurrent(
		objectMap(
			blueprint,
			async(value, key) => await dbbyX(flexStorage, key),
		)
	)
}
