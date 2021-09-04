
export class MadstateError extends Error {
	name = this.constructor.name
}

export class MadstateReadonlyError extends MadstateError {}
export class MadstateCircularError extends MadstateError {}
