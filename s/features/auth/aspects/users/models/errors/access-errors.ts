
export class AccessError extends Error {}

export class AccessLoginInvalidError extends AccessError {
	constructor() {
		super("login token is invalid")
	}
}

export class AccessLoginExpiredError extends AccessError {
	constructor() {
		super("login token has expired")
	}
}
