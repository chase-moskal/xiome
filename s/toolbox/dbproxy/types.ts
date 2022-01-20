
import {Id} from "./id.js"

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

export interface Schema {
	[key: string]: Row | Schema
}

export type AsSchema<xSchema extends Schema> = xSchema

export interface Shape {
	[key: string]: boolean | Shape
}

export type SchemaToShape<xSchema extends Schema> = {
	[P in keyof xSchema]: xSchema[P] extends Row
		? boolean
		: xSchema[P] extends Schema
			? SchemaToShape<xSchema[P]>
			: never
}

export interface Table<xRow extends Row> {
	create(...rows: xRow[]): Promise<void>
	read(o: PaginatedConditional<xRow>): Promise<xRow[]>
	update(o: Update<xRow>): Promise<void>
	delete(o: Conditional<Row>): Promise<void>

	readOne(o: Conditional<Row>): Promise<Row>
	count(o: Conditional<Row>): Promise<number>
	assert(o: Assertion<Row>): Promise<Row>

	// TODO implement helpers like find, findAll, and, or
}

export interface Tables {
	[key: string]: Tables | Table<Row>
}

export type SchemaToTables<xSchema extends Schema> = Tables & {
	[P in keyof xSchema]: xSchema[P] extends Row
		? Table<xSchema[P]>
		: xSchema[P] extends Schema
			? xSchema[P]
			: never
}

export interface Rows {
	[key: string]: Rows | Row[]
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
	transaction<Result>(action: Action<SchemaToTables<xSchema>, Result>): Promise<Result>
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
