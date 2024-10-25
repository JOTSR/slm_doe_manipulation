import { useSignal } from '@preact/signals'
import GratingPreview from './GratingPreview.tsx'
import GratingView from './GratingView.tsx'
import { blazeGrating, Grating } from '@-/core'
import { hermiteGaussKinoform, PatternTransformer } from '@-/core/patterns'

const screenSize = { width: 1024, height: 1024 }

const bg = blazeGrating(screenSize.width, screenSize.height, {
	count: 800,
	max: 255,
	tilt: Math.PI * 50 / 180,
})

const waist = 41 // beam size on camera !IN PIXELS
const hgPattern = hermiteGaussKinoform(4, 4, waist)
const translated = new PatternTransformer()
	// .rotate(0.2)
	// .scale(30, 30)
	.translate(-(screenSize.width / 2), -(screenSize.height / 2))
	.transform(hgPattern)

const hgGrating = Grating.fromPattern(
	screenSize.width,
	screenSize.height,
	translated,
) //.add(bg)
// const hgGrating = bg

export default function UI() {
	const slmGrating = useSignal(hgGrating)

	return (
		<>
			<main>
				<div class={'camera-preview'}>camera - TODO</div>
				<GratingPreview grating={slmGrating} class={'grating-preview'} />
				<GratingView grating={slmGrating} class={'grating-view'} />
			</main>
			<aside>
				<button class={'button button-primary'}>Add layer</button>
				<div class={'toolbox-layer'}>Layer 0 (img) [✏️❌]</div>
				<div class={'toolbox-layer'}>Layer 1 (com) [✏️❌]</div>
				<div class={'toolbox-layer'}>Layer 2 (fx) [✏️❌]</div>
				<div class={'toolbox-layer'}>Layer 3 (fx) [✏️❌]</div>
			</aside>
		</>
	)
}
