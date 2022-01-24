
import {rowVersusConditional} from "./memory-conditionals.js"
import {AmbiguousUpdate, Operation, Row} from "../../types.js"

export function applyOperation({rows, operation}: {
		rows: Row[]
		operation: Operation.Any
	}): Row[] {

	switch (operation.type) {
	
		case Operation.Type.Create: {
			return [...rows, ...operation.rows]
		}

		case Operation.Type.Update: {
			let rowsToUpdate: Row[] = []
			let otherRows: Row[] = []
			for (const row of rows) {
				if (rowVersusConditional(row, operation.update))
					rowsToUpdate.push(row)
				else
					otherRows.push(row)
			}
			const {write, whole, upsert} =
				<AmbiguousUpdate<Row>>operation.update
			if (write && rowsToUpdate.length) {
				rowsToUpdate = rowsToUpdate.map(row => ({...row, ...write}))
			}
			else if (upsert) {
				if (rowsToUpdate.length)
					rowsToUpdate = rowsToUpdate.map(row => ({...row, ...upsert}))
				else
					rowsToUpdate.push({...upsert})
			}
			else if (whole) {
				rowsToUpdate = []
				rowsToUpdate = [whole]
			}
			else throw new Error("invalid update")
			return [...rowsToUpdate, ...otherRows]
		}

		case Operation.Type.Delete: {
			return rows.filter(
				row => !rowVersusConditional(row, operation.conditional)
			)
		}

		default:
			throw new Error("invalid operation")
	}
}
