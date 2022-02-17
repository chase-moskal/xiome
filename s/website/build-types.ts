
export interface BuildOptions {
	base: string
}

export interface CommonBuildOptions extends BuildOptions {
	mode: "mock" | "local" | "production"
}
