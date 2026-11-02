import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(process.cwd(), 'pages')

const skip = new Set(['报工详情v1版本.vue'])
const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p)
    else if (name.endsWith('.vue') && !skip.has(name)) files.push(p)
  }
}
walk(root)

const lift = '4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08)'
let changed = 0
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const parts = src.split(/(<style[\s\S]*?<\/style>)/g)
  let out = ''
  for (const part of parts) {
    if (part.startsWith('<style')) {
      let s = part
      s = s.replace(/color:\s*#333333/gi, 'color: var(--ink-black)')
      s = s.replace(/color:\s*#333(?![0-9A-Fa-f])/g, 'color: var(--ink-black)')
      s = s.replace(/color:\s*#1D2129/gi, 'color: var(--ink-black)')
      s = s.replace(/color:\s*#808080/gi, 'color: var(--ink-muted)')
      s = s.replace(/color:\s*#999999/gi, 'color: var(--ink-muted)')
      s = s.replace(/color:\s*#999(?![0-9A-Fa-f])/g, 'color: var(--ink-muted)')
      s = s.replace(/background:\s*#FFFFFF/gi, 'background: var(--ticket-face)')
      s = s.replace(/background-color:\s*#FFFFFF/gi, 'background-color: var(--ticket-face)')
      s = s.replace(/background-color:\s*#ccc/gi, 'background-color: var(--perf-line)')
      s = s.replace(/border:\s*2rpx solid var\(--ink-black\)/g, 'border: 2rpx solid var(--ticket-edge)')
      s = s.replace(/border:\s*2rpx solid #1C1917/gi, 'border: 2rpx solid var(--ticket-edge)')
      s = s.replace(/box-shadow:\s*8rpx 8rpx 0 var\(--ink-black\)/g, `box-shadow: ${lift}`)
      s = s.replace(/box-shadow:\s*8rpx 8rpx 0 #1C1917/gi, `box-shadow: ${lift}`)
      s = s.replace(/box-shadow:\s*8rpx 8rpx 46rpx 0rpx rgba\(160,\s*164,\s*180,\s*0\.8\)/g, `box-shadow: ${lift}`)
      out += s
    } else {
      let t = part
      t = t.replace(/style="color: #333333;"/g, 'style="color: var(--ink-black);"')
      t = t.replace(/style="color: #1D2129;"/g, 'style="color: var(--ink-black);"')
      t = t.replace(/color="#808080"/g, 'color="#6B6258"')
      t = t.replace(/label-color="#808080"/g, 'label-color="#6B6258"')
      out += t
    }
  }
  if (out !== src) {
    writeFileSync(file, out)
    changed += 1
    console.log('updated', file)
  }
}
console.log('files_changed', changed)
