
import {Op, ops} from "../../../../../../framework/ops.js"
import {VideoHosting} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {PrivilegeDisplay} from "../../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"

export function renderViewCreator({
		isContentSelected, isCreateButtonDisabled, privilegesOp,catalogOp,
		selectedContent,
		queryAll, onCatalogSelect, onPrivilegesSelect, onCreateClick,
		isPrivilegeSelected,
}: {
		selectedContent: number
		isContentSelected: boolean
		isCreateButtonDisabled: boolean
		privilegesOp: Op<PrivilegeDisplay[]>
		catalogOp: Op<VideoHosting.AnyContent[]>
		queryAll: <E extends HTMLElement>(selector: string) => E[]
		onCreateClick: () => void
		onCatalogSelect: (index: number) => void
		isPrivilegeSelected: (id: string) => boolean
		onPrivilegesSelect: (privileges: string[]) => void
	}) {

	const onCatalogSelectChange = (event: InputEvent) => {
		const target = event.target as HTMLSelectElement
		onCatalogSelect(parseInt(target.value))
	}

	const onPrivilegesSelectChange = () => {
		onPrivilegesSelect(
			queryAll<HTMLOptionElement>(".create-privileges select option") 
				.filter(option => option.selected).map(option => option.value)
		)
	}

	function renderContentSelector() {
		const catalog = ops.value(catalogOp)
		return html`
			<div class=create-content>
				${catalog.length ? html`
					<h5>Select content for this view</h5>
					<select @change=${onCatalogSelectChange}>
						${isContentSelected
							? null
							: html`
								<option disabled selected>
									(select video content)
								</option>
							`}
						${catalog.map(({provider, type, title}, index) => html`
							<option value=${index} ?selected=${index === selectedContent}>
								${`${provider} ${type} ${title}`}
							</option>
						`)}
					</select>
				` : html`
					<p>no available video content (are your video accounts linked?)</p>
				`}
			</div>
		`
	}

	function renderPrivilegeSelector() {
		const privileges = ops.value(privilegesOp)
		return html`
			<div class="create-privileges" ?data-visible=${isContentSelected}>
				<h5>Select which privileges have access</h5>
				<select multiple @change=${onPrivilegesSelectChange}>
					${privileges.map(privilege => html`
						<option
							?selected=${isPrivilegeSelected(privilege.privilegeId)}
							value="${privilege.privilegeId}">
								${privilege.label}
						</option>
					`)}
				</select>
			</div>
		`
	}

	return renderOp(ops.combine(catalogOp, privilegesOp), () => html`
		<div class=viewcreator>
			<h4>Assign Video Content</h4>
			<div class=selectionarea>
				${renderContentSelector()}
				${renderPrivilegeSelector()}
			</div>
			<div class=buttonbar>
				<xio-button
					class=create-button
					?disabled=${isCreateButtonDisabled}
					@press=${onCreateClick}>
						Assign To This Video
				</xio-button>
			</div>
		</div>
	`)
}
