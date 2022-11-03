
export function centeredPopupFeatures(width: number, height: number) {
	const {outerWidth, outerHeight, screenY, screenX} = window.top
	const top = ((outerHeight / 2) + screenY - (height / 2)) / 2
	const left = (outerWidth / 2) + screenX - (width / 2)
	return `
		popup,
		width=${width},
		height=${height},
		top=${top},
		left=${left},
		toolbar=no,
		location=no,
		status=no,
		menubar=no,
		scrollbars=yes,
		resizable=yes
	`
}
