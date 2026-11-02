import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const file = join(process.cwd(), 'static/css/ticket-tokens.scss')
const required = [
  '--ticket-paper: #F3E6C8',
  '--ticket-face: #FFF8E7',
  '--ink-black: #1C1917',
  '--stamp-red: #B42318',
  '--ink-green: #1F6B4A',
  '--perf-line: #C4B8A1',
  '--ink-muted: #6B6258',
  '--ticket-edge: rgba(28, 25, 23, 0.38)',
]

if (!existsSync(file)) {
  console.error('FAIL: missing static/css/ticket-tokens.scss')
  process.exit(1)
}

const css = readFileSync(file, 'utf8')
const missing = required.filter((token) => !css.includes(token))
if (missing.length) {
  console.error('FAIL: missing tokens:\n' + missing.join('\n'))
  process.exit(1)
}

console.log('ok')
