
import {Id} from "./id.js"
import type {TransactionOptions} from "mongodb"

export type Value =
	| undefined
	| boolean
	| number
	| string
	| bigint
	| Id

export interface Row {
	[column: string]: Value
}

export type Schema = Row | {
	[key: string]: Schema
}

export type Shape = boolean | {
	[key: string]: Shape
}

export type AsRow<xRow extends Row> = xRow
export type AsSchema<xSchema extends Schema> = xSchema
export type AsShape<xShape extends Shape> = xShape

export type SchemaToShape<xSchema extends Schema> = {
	[P in keyof xSchema]: xSchema[P] extends Row
		? boolean
		: xSchema[P] extends Schema
			? SchemaToShape<xSchema[P]>
			: never
}

export const tableSymbol = Symbol("table")

export interface Table<xRow extends Row> {
	[tableSymbol]: boolean

	create(...rows: xRow[]): Promise<void>
	read(o: PaginatedConditional<xRow>): Promise<xRow[]>
	update(o: Update<xRow>): Promise<void>
	delete(o: Conditional<xRow>): Promise<void>

	readOne(o: Conditional<xRow>): Promise<xRow>
	count(o: Conditional<xRow>): Promise<number>
	assert(o: Assertion<xRow>): Promise<xRow>
}

export type Tables = Table<Row> | {
	[key: string]: Tables
}

export type SchemaToTables<xSchema extends Schema> = Tables & {
	[P in keyof xSchema]: xSchema[P] extends Row
		? Table<xSchema[P]>
		: xSchema[P] extends Schema
			? xSchema[P]
			: never
}

export type Rows = Row[] | {
	[key: string]: Rows
}

export type SchemaToRows<xSchema extends Schema> = Rows & {
	[P in keyof xSchema]: xSchema[P] extends Row
		? xSchema[P][]
		: xSchema[P] extends Schema
			? xSchema[P]
			: never
}

export type Action<xTables extends Tables, Result> = ({}: {
	tables: xTables
	abort(): Promise<void>
}) => Promise<Result>

export interface Database<xSchema extends Schema> {
	tables: SchemaToTables<xSchema>
	transaction<xResult>(action: Action<SchemaToTables<xSchema>, xResult>): Promise<xResult>
}

export interface MongoDatabase<xSchema extends Schema> extends Database<xSchema> {
	transaction<xResult>(action: Action<SchemaToTables<xSchema>, xResult>, options?: TransactionOptions): Promise<xResult>
}

/////////

export interface Condition<xRow extends Row> {
	set?: Partial<{[P in keyof xRow]: true}>
	equal?: Partial<xRow>
	less?: Partial<xRow>
	lessy?: Partial<xRow>
	greater?: Partial<xRow>
	greatery?: Partial<xRow>
	listed?: Partial<xRow>
	search?: Partial<{[P in keyof xRow]: string | RegExp}>

	notSet?: Partial<{[P in keyof xRow]: true}>
	notEqual?: Partial<xRow>
	notLess?: Partial<xRow>
	notLessy?: Partial<xRow>
	notGreater?: Partial<xRow>
	notGreatery?: Partial<xRow>
	notListed?: Partial<xRow>
	notSearch?: Partial<{[P in keyof xRow]: string | RegExp}>
}

export type Conditions<xRow extends Row> = false | ConditionTree<xRow>

export type ConditionOperation = "and" | "or"
export type ConditionLeaf<xRow extends Row> = Condition<xRow> | Conditions<xRow>
export type ConditionBranch<Op extends ConditionOperation, xRow extends Row> =
	[Op, ...ConditionLeaf<xRow>[]]

export type ConditionTree<xRow extends Row> =
	| ConditionBranch<"and", xRow>
	| ConditionBranch<"or", xRow>

export interface Conditional<xRow extends Row> {
	conditions: Conditions<xRow>
}

////////

export type Order<xRow extends Row> = Partial<{
	[P in keyof xRow]: "ascend" | "descend" | undefined
}>

export type Pagination<xRow extends Row> = {
	limit?: number
	offset?: number
	order?: Order<xRow>
}

export type PaginatedConditional<xRow extends Row> = Conditional<xRow> & Pagination<xRow>
export type Upsert<xRow extends Row> = Conditional<xRow> & {upsert: xRow}
export type Write<xRow extends Row> = Conditional<xRow> & {write: Partial<xRow>}
export type Whole<xRow extends Row> = Conditional<xRow> & {whole: xRow}
export type Update<xRow extends Row> = Write<xRow> | Whole<xRow> | Upsert<xRow>
export type AmbiguousUpdate<xRow extends Row> = Write<xRow> & Whole<xRow> & Upsert<xRow>
export type Assertion<xRow extends Row> = Conditional<xRow> & {
	make: () => Promise<xRow>
}

////////

export namespace Operation {
	export enum Type {
		Create,
		Update,
		Delete,
	}
	export interface OpBase {
		type: Type
		path: string[]
	}
	export interface OpCreate extends OpBase {
		type: Type.Create
		rows: Row[]
	}
	export interface OpUpdate extends OpBase {
		type: Type.Update
		update: Update<Row>
	}
	export interface OpDelete extends OpBase {
		type: Type.Delete
		conditional: Conditional<Row>
	}
	export type Any =
		| OpCreate
		| OpUpdate
		| OpDelete
}

////////

export const serializationKey = "__serialized_type__"

export interface SerializedValue {
	[serializationKey]: string
	value: any
}

export interface SerializedRow {
	[key: string]: any | SerializedValue
}

////////


// constraints for row

export type UnconstrainRow<xNamespace extends Row, xRow extends Row> =
	xNamespace & xRow

export type ConstrainRow<xNamespace extends Row, xRow extends Row> =
	Omit<xRow, keyof xNamespace>

// constraints for table

export type UnconstrainTable<xNamespace extends Row, xTable extends Table<Row>> =
	xTable extends Table<infer xRow>
		? Table<UnconstrainRow<xNamespace, xRow>>
		: never

export type ConstrainTable<xNamespace extends Row, xTable extends Table<Row>> =
	xTable extends Table<infer xRow>
		? Table<ConstrainRow<xNamespace, xRow>>
		: never

// constraints for tables

export type UnconstrainTables<xNamespace extends Row, xTables extends Tables> = {
	[P in keyof xTables]: xTables[P] extends Table<Row>
		? UnconstrainTable<xNamespace, xTables[P]>
		: xTables[P] extends Tables
			? UnconstrainTables<xNamespace, xTables[P]>
			: never
}

export type ConstrainTables<xNamespace extends Row, xTables extends Tables> = {
	[P in keyof xTables]: xTables[P] extends Table<Row>
		? ConstrainTable<xNamespace, xTables[P]>
		: xTables[P] extends Tables
			? ConstrainTables<xNamespace, xTables[P]>
			: never
}
