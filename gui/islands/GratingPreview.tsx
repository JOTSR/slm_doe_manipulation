import { useRef } from 'preact/hooks'
import type { JSX } from 'preact'
import { type Signal, useSignalEffect } from '@preact/signals'
import type { Grating } from '@-/core'

export type CanvasPreviewProps = {
	grating: Signal<Grating<number, number>>
} & JSX.HTMLAttributes<HTMLCanvasElement>

export default function GratingPreview(
	{ grating, ...props }: CanvasPreviewProps,
) {
	const canvas = props.ref ?? useRef<HTMLCanvasElement>(null)

	useSignalEffect(() => {
		if (!('current' in canvas) || !canvas.current) return
		const ctx = canvas.current.getContext('2d')
		if (!ctx) return
		canvas.current.width = grating.value.size.width
		canvas.current.height = grating.value.size.height
		ctx.putImageData(grating.value.image, 0, 0)
	})

	return <canvas {...props} ref={canvas}></canvas>
}
