
export function assignClickHandlers(handlers: {[key: string]: () => any}){
	for (const [key, fun] of Object.entries(handlers))
		document.querySelector<HTMLElement>(key).onclick = fun
}
