
import pageHtml from "./partials/page.html.js"
import {XiomeWebsiteContext} from "../build-types.js"
import {html} from "../../toolbox/hamster-html/html.js"

export default ({mode, base, ...options}: XiomeWebsiteContext) =>

pageHtml({
...options,
mode,
base,
pageName: "learn",
mainHtml: html`

<div class="page content">
	<div class="segment twoside introblock">
		<div class="text">
			<h2>
				<span>build a community on your website</span>
				<span> with open source web components</span>
			</h2>
			<ul>
				<li>
					<p>📝 comments, forums, questions, and more</p>
					<p>so your users can engage and interact</p>
				</li>
				<li>
					<p>💰 premium memberships for your audience</p>
					<p>monetize your audience's support</p>
				</li>
				<li>
					<p>📺 offer private livestreams and video content</p>
					<p>reward your premium members with locked content</p>
				</li>
			</ul>
		</div>
		<div class="art">
			<!-- tabler icons "social" -->
			<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-social" width="44" height="44" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<circle cx="12" cy="5" r="2" />
				<circle cx="5" cy="19" r="2" />
				<circle cx="19" cy="19" r="2" />
				<circle cx="12" cy="14" r="3" />
				<line x1="12" y1="7" x2="12" y2="11" />
				<line x1="6.7" y1="17.8" x2="9.5" y2="15.8" />
				<line x1="17.3" y1="17.8" x2="14.5" y2="15.8" />
			</svg>
		</div>
	</div>
	<div class="segment twoside">
		<div class="text">
			<h2>just copy-and-paste html to install</h2>
			<ul>
				<li>xiome components are compatible with nearly any website, and customizable</li>
			</ul>
			<ol>
				<li>create your community on the <a href="${base}/setup">setup page</a> and connect your website</li>
				<li>browse for plugins on the <a href="${base}/components">components page</a> to copy-paste</li>
			</ol>
		</div>
		<div class="art">
			<!-- akar icons "copy" -->
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
				<g fill="none">
					<path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
					<path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
				</g>
			</svg>
		</div>
	</div>
	<div class="segment twoside">
		<div class="text">
			<h2>sell memberships to your audience</h2>
			<ul>
				<li>xiome cloud charges a 9% fee to facilitate payments</li>
				<li>but you don't have to use xiome cloud payments, it's just a convenience</li>
				<li>you can host your own payment system, or simply go without payments and use xiome for free communities</li>
			</ul>
		</div>
		<div class="art">
			<!-- tabler icons "businessplan" -->
			<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-businessplan" width="44" height="44" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<ellipse cx="16" cy="6" rx="5" ry="3" />
				<path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
				<path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
				<path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
				<path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
				<path d="M5 15v1m0 -8v1" />
			</svg>
		</div>
	</div>
	<div class="segment twoside">
		<div class="text">
			<h2>xiome is 100% open source 💖</h2>
			<ul>
				<li>if you're a developer, xiome's login system and components can jumpstart your websites and apps</li>
				<li>collaborate with us to make xiome a better open source platform for everybody to share</li>
			</ul>
		</div>
		<div class="art">
			<!-- tabler icons "brand-open-source" -->
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
				<path d="M12 3a9 9 0 0 1 3.618 17.243l-2.193-5.602a3 3 0 1 0-2.849 0l-2.193 5.603A9 9 0 0 1 12 3z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
	</div>
	<div class="segment twoside">
		<div class="text">
			<h2>xiome is currently in alpha</h2>
			<ul>
				<li>this experimental prerelease is missing features and is rough around the edges</li>
				<li>we might have to wipe the database before the real release</li>
				<li>if you'd like to become an early adopter, let's stay in touch so we can tailor xiome to your needs</li>
			</ul>
		</div>
		<div class="art">
			<!-- grommet icons "configure" -->
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
				<path fill="none" stroke="currentColor" stroke-width="1" d="M16 15c4.009-.065 7-3.033 7-7c0-3.012-.997-2.015-2-1c-.991.98-3 3-3 3l-4-4s2.02-2.009 3-3c1.015-1.003 1.015-2-1-2c-3.967 0-6.947 2.991-7 7c.042.976 0 3 0 3c-1.885 1.897-4.34 4.353-6 6c-2.932 2.944 1.056 6.932 4 4c1.65-1.662 4.113-4.125 6-6c0 0 2.024-.042 3 0z" />
			</svg>
		</div>
	</div>
</div>

`})
