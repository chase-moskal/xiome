
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
	read(): Promise<xRow[]>
	update(): Promise<void>
	delete(): Promise<void>
}

export type SchemaToTables<xSchema extends Schema> = {
	[P in keyof xSchema]: xSchema[P] extends Row
		? Table<xSchema[P]>
		: xSchema[P] extends Schema
			? xSchema[P]
			: never
}

export type Action<xSchema extends Schema, Result> = ({}: {
	tables: SchemaToTables<xSchema>
	abort(): void
}) => Promise<Result>

export interface Database<xSchema extends Schema> {
	tables: SchemaToTables<xSchema>
	transaction<Result>(action: Action<xSchema, Result>): Promise<Result>
}
