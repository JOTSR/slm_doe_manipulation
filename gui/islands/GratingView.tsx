import { useRef } from 'preact/hooks'
import { type Signal, useSignalEffect } from '@preact/signals'
import type { JSX, RefObject } from 'preact'
import '../screen_managment_api_patch.ts'
import type { Grating } from '@-/core'

export type CanvasViewProps = {
	grating: Signal<Grating<number, number>>
} & JSX.HTMLAttributes<HTMLButtonElement>

export default function GratingView({ grating, ...props }: CanvasViewProps) {
	const canvas = useRef<HTMLCanvasElement>(null)

	useSignalEffect(() => {
		if (canvas.current === null) return
		const ctx = canvas.current.getContext('2d')
		if (!ctx) return
		canvas.current.width = grating.value.size.width
		canvas.current.height = grating.value.size.height
		ctx.putImageData(grating.value.image, 0, 0)
	})

	return (
		<>
			<button {...props} onClick={() => openView(canvas)}>Open view</button>
			<canvas
				ref={canvas}
				class={'c__inner__grating-display'}
			>
			</canvas>
			<style>
				{`
					.c__inner__grating-display {
						display: none;
						border: none;
						border-radius: 0;
					}
					.c__inner__grating-display:fullscreen {
						display: block;
						background-color: black;
					}
			`}
			</style>
		</>
	)
}

async function openView(ref: RefObject<HTMLCanvasElement>): Promise<void> {
	if (ref.current === null) return
	if (!('isExtended' in screen) || !screen.isExtended) {
		// alert('no SLM found')
		// return
	}

	const details = await getScreenDetails()

	const slmScreen = details
		.screens
		.find((detail) => true) ///*!detail.isInternal && */ !detail.isPrimary)

	if (slmScreen === undefined) {
		alert('no SLM screen available')
		return
	}

	ref.current.style.visibility = 'visible'
	return ref.current?.requestFullscreen({ screen: slmScreen })
}
