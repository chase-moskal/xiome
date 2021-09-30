
import {Op, ops} from "../../../../../../framework/ops.js"
import {VideoHosting} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component/component.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {PrivilegeDisplay} from "../../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"

export function renderViewCreator({
		privilegesOp, catalogOp, isCreateButtonDisabled,
		queryAll, onCatalogSelect, onPrivilegesSelect, onCreateClick,
	}: {
		isCreateButtonDisabled: boolean
		privilegesOp: Op<PrivilegeDisplay[]>
		catalogOp: Op<VideoHosting.AnyContent[]>
		queryAll: <E extends HTMLElement>(selector: string) => E[]
		onCreateClick: () => void
		onCatalogSelect: (index: number) => void
		onPrivilegesSelect: (privileges: string[]) => void
	}) {

	const onCatalogSelectChange = (event: InputEvent) => {
		const target = event.target as HTMLSelectElement
		onCatalogSelect(parseInt(target.value))
	}

	const onPrivilegesSelectChange = () => {
		onPrivilegesSelect(
			queryAll<HTMLOptionElement>(".create-privileges select option") 
				.filter(option => option.selected)
				.map(option => option.value)
		)
	}

	return html`
		<p>create view</p>
		<div class=create-content>
			<p>select content for this view</p>
			${renderOp(catalogOp, catalog => html`
				<select @change=${onCatalogSelectChange}>
					${catalog.map(({provider, type, title}, index) => html`
						<option value=${index}>
							${`${provider} ${type} ${title}`}
						</option>
					`)}
				</select>
			`)}
		</div>
		<div class=create-privileges>
			<p>select which privileges have access</p>
			${renderOp(privilegesOp, privileges => html`
				<select multiple @change=${onPrivilegesSelectChange}>
					${privileges.map(privilege => html`
						<option value="${privilege.privilegeId}">${privilege.label}</option>
					`)}
				</select>
			`)}
		</div>
		${renderOp(ops.combine(catalogOp, privilegesOp), () => html`
			<xio-button
				class=create-button
				?disabled=${isCreateButtonDisabled}
				@press=${onCreateClick}>
					create view
			</xio-button>
		`)}
	`
}
