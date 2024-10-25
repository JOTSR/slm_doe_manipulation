import { Command } from '@cliffy/command'
import { mainCommand } from './src/main_command.ts'

const cmd = new Command()
	.name('cli')
	.arguments('<width:number> <height:number> <output:file>')
	.option('-i, --image <images:file[]>', 'add image to grating')
	.option('-d, --doe <does:string[]>', 'add a doe to grating')
	.option('-p, --pattern <pattern:string[]>', 'add a pattern to grating')
	.option('-b, --blaze <blazes:string[]>', 'add a blaze to grating')
	.example(
		'Example usage 1',
		'cli width height ./output.bmp -d ./doe.bmp -i ./signal.png -p "$common:rect(10, 10, 20, 20)"',
	)
	.example(
		'Example usage 2',
		'cli width height ./output.png  --blaze "25, 255" -p "(x, y) => x + y"',
	)
	.action(mainCommand)

if (import.meta.main) {
	await cmd.parse(Deno.args)
}
