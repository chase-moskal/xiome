
export type DbbyValue =
	| undefined
	| boolean
	| number
	| string
	| bigint

export type DbbyRow = {[key: string]: DbbyValue}
export type AsDbbyRow<T extends DbbyRow> = T
export const asDbbyValue = <Value extends DbbyValue>(value: Value) => value
export const asDbbyRow = <Row extends DbbyRow>(row: Row) => row

export type ToDbbyRow<Row extends DbbyRow> = {
	[P in keyof Row]:
		Row[P] extends DbbyValue
			? Row[P]
			: never
}

export const toDbbyRow = <Row extends {}>(row: ToDbbyRow<Row>) => row

//
//
//

export interface DbbyCondition<Row extends DbbyRow> {
	set?: Partial<{[P in keyof Row]: true}>
	equal?: Partial<Row>
	less?: Partial<Row>
	lessy?: Partial<Row>
	greater?: Partial<Row>
	greatery?: Partial<Row>
	listed?: Partial<Row>
	search?: Partial<{[P in keyof Row]: string | RegExp}>

	notSet?: Partial<{[P in keyof Row]: true}>
	notEqual?: Partial<Row>
	notLess?: Partial<Row>
	notLessy?: Partial<Row>
	notGreater?: Partial<Row>
	notGreatery?: Partial<Row>
	notListed?: Partial<Row>
	notSearch?: Partial<{[P in keyof Row]: string | RegExp}>
}

export type DbbyConditionOperation = "and" | "or"
export type DbbyConditionLeaf<Row extends DbbyRow> = DbbyCondition<Row> | DbbyConditionTree<Row>
export type DbbyConditionBranch<Op extends DbbyConditionOperation, Row extends DbbyRow> =
	[Op, ...DbbyConditionLeaf<Row>[]]

export type DbbyConditionTree<Row extends DbbyRow> =
	DbbyConditionBranch<"and", Row>
	| DbbyConditionBranch<"or", Row>

//
//
//

export type DbbyConditions<Row extends DbbyRow> = false | DbbyConditionTree<Row>

export interface DbbyConditional<Row extends DbbyRow> {
	conditions: DbbyConditions<Row>
}

export type DbbyOrder<Row extends DbbyRow> = Partial<{
	[P in keyof Row]: "ascend" | "descend" | undefined
}>

export type DbbyPaginated<Row extends DbbyRow> = DbbyConditional<Row> & {
	limit?: number
	offset?: number
	order?: DbbyOrder<Row>
}
export type DbbyUpsert<Row extends DbbyRow> = DbbyConditional<Row> & {upsert: Row}
export type DbbyWrite<Row extends DbbyRow> = DbbyConditional<Row> & {write: Partial<Row>}
export type DbbyWhole<Row extends DbbyRow> = DbbyConditional<Row> & {whole: Row}
export type DbbyUpdate<Row extends DbbyRow> = DbbyWrite<Row> | DbbyWhole<Row> | DbbyUpsert<Row>
export type DbbyUpdateAmbiguated<Row extends DbbyRow> = DbbyWrite<Row> & DbbyWhole<Row> & DbbyUpsert<Row>
export type DbbyAssertion<Row extends DbbyRow> = DbbyConditional<Row> & {
	make: () => Promise<Row>
}

//
//
//

export type DbbyConditionHelper<
	Op extends DbbyConditionOperation,
	Row extends DbbyRow,
	C extends DbbyConditionLeaf<Row>[] = DbbyConditionLeaf<Row>[],
> = (
	...conditions: C
) => DbbyConditionBranch<Op, Row>

export interface DbbyTable<Row extends DbbyRow> {
	create(...rows: Row[]): Promise<void>
	read(options: DbbyPaginated<Row>): Promise<Row[]>
	one(options: DbbyConditional<Row>): Promise<Row>
	assert(options: DbbyAssertion<Row>): Promise<Row>
	update(options: DbbyUpdate<Row>): Promise<void>
	delete(options: DbbyConditional<Row>): Promise<void>
	count(options: DbbyConditional<Row>): Promise<number>
}

export interface DbbyStorage<Row extends DbbyRow> {
	save(table: Row[]): void
	load(): Row[]
}

//
//
//

export type GetDbbyTable = <Row extends DbbyRow>(
		collectionName: string
	) => DbbyTable<Row>
