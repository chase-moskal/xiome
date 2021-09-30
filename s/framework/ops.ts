
export namespace Ops {
	export enum Mode {
		None,
		Loading,
		Error,
		Ready,
	}

	export interface None {
		mode: Ops.Mode.None
	}

	export interface Loading {
		mode: Ops.Mode.Loading
	}

	export interface Error {
		mode: Ops.Mode.Error
		reason: string
	}

	export interface Ready<xValue> {
		mode: Ops.Mode.Ready
		value: xValue
	}
}

export type Op<xValue> =
	| Ops.None
	| Ops.Loading
	| Ops.Error
	| Ops.Ready<xValue>

export const ops = {
	none: (): Ops.None => ({
		mode: Ops.Mode.None,
	}),
	loading: (): Ops.Loading => ({
		mode: Ops.Mode.Loading,
	}),
	error: (reason: string): Ops.Error => ({
		mode: Ops.Mode.Error,
		reason,
	}),
	ready: <xValue>(value: xValue): Ops.Ready<xValue> => ({
		mode: Ops.Mode.Ready,
		value,
	}),
	replaceValue<xValue>(op: Op<any>, value: xValue): Op<xValue> {
		return op.mode === Ops.Mode.Ready
			? {...op, value}
			: op
	},

	isNone: <xValue>(op: Op<xValue>) => op.mode === Ops.Mode.Ready,
	isLoading: <xValue>(op: Op<xValue>) => op.mode === Ops.Mode.Loading,
	isError: <xValue>(op: Op<xValue>) => op.mode === Ops.Mode.Error,
	isReady: <xValue>(op: Op<xValue>) => op.mode === Ops.Mode.Ready,

	value<xValue>(op: Op<xValue>) {
		return op.mode === Ops.Mode.Ready
			? op.value
			: undefined
	},
	select<xValue, xResult = any>(op: Op<xValue>, options: {
			none: () => xResult
			loading: () => xResult
			error: (reason: string) => xResult
			ready: (value: xValue) => xResult
		}) {
		switch (op.mode) {
			case Ops.Mode.None: return options.none()
			case Ops.Mode.Loading: return options.loading()
			case Ops.Mode.Error: return options.error(op.reason)
			case Ops.Mode.Ready: return options.ready(op.value)
		}
	},
	async operation<xValue>({
			promise,
			errorReason = "an error occurred",
			setOp,
		}: {
			errorReason?: string
			promise: Promise<xValue>
			setOp: (op: Op<xValue>) => void
		}) {

		setOp(ops.loading())

		try {
			const value = await promise
			setOp(ops.ready(value))
			return value
		}
		catch(error) {
			setOp(ops.error(errorReason))
			throw error
		}
	},
	mode(op: Op<any>) {
		return ops.select(op, {
			none: () => "none",
			loading: () => "loading",
			error: () => "error",
			ready: () => "ready",
		})
	},
	combine(...ops: Op<any>[]): Op<void> {
		const isAnyError = !!ops.find(op => op.mode === Ops.Mode.Error)
		const isAnyLoading = !!ops.find(op => op.mode === Ops.Mode.Loading)
		const isAnyNotReady = !!ops.find(op => op.mode !== Ops.Mode.Ready)
		return isAnyError
			? {mode: Ops.Mode.Error, reason: "error"}
			: isAnyLoading
				? {mode: Ops.Mode.Loading}
				: isAnyNotReady
					? {mode: Ops.Mode.None}
					: {mode: Ops.Mode.Ready, value: undefined}
	},
	debug(op: Op<any>) {
		return ops.select(op, {
			none: () => [`<op {mode: None}>`],
			loading: () => [`<op {mode: Loading}>`],
			error: reason => [`<op {mode: Error, reason: "${reason}"}>`],
			ready: value => [`<op {mode: Ready, value: `, value, `}>`],
		})
	},
}
