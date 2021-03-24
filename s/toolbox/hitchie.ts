
export function hitchie<xFunc extends (...args: any[]) => any>(
		func: xFunc,
		process: (f: xFunc, ...args: Parameters<xFunc>) => ReturnType<xFunc>,
	) {
	return <xFunc>((...args: Parameters<xFunc>) => process(func, ...args))
}
