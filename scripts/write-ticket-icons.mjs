import fs from 'fs'
import path from 'path'

const root = path.resolve('static/images')

const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke-linecap="round" stroke-linejoin="round">
  ${inner}
</svg>
`

const ink = '#1C1917'
const red = '#B42318'
const mute = '#6B6258'
const green = '#1F6B4A'

const icons = {
  'tabbar/home.svg': wrap(
    `<path d="M5 15 L16 6 L27 15" stroke="${mute}" stroke-width="2"/>
     <path d="M8 14 V26 H24 V14" stroke="${mute}" stroke-width="2"/>
     <path d="M13 26 V19 H19 V26" stroke="${mute}" stroke-width="2"/>`
  ),
  'tabbar/home_active.svg': wrap(
    `<path d="M5 15 L16 6 L27 15" stroke="${red}" stroke-width="2"/>
     <path d="M8 14 V26 H24 V14" stroke="${red}" stroke-width="2"/>
     <path d="M13 26 V19 H19 V26" stroke="${red}" stroke-width="2"/>`
  ),
  'tabbar/mine.svg': wrap(
    `<circle cx="16" cy="11" r="4.5" stroke="${mute}" stroke-width="2"/>
     <path d="M6.5 26 C8 19.5 11.5 17 16 17 C20.5 17 24 19.5 25.5 26" stroke="${mute}" stroke-width="2"/>`
  ),
  'tabbar/mine_active.svg': wrap(
    `<circle cx="16" cy="11" r="4.5" stroke="${red}" stroke-width="2"/>
     <path d="M6.5 26 C8 19.5 11.5 17 16 17 C20.5 17 24 19.5 25.5 26" stroke="${red}" stroke-width="2"/>`
  ),
  'tabbar/gain.svg': wrap(
    `<path d="M8 22 V13 M13 22 V8 M18 22 V11 M23 22 V16" stroke="${ink}" stroke-width="2.4"/>
     <path d="M6 24 H26" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'ticket/gain.svg': null,
  'ticket/stats.svg': wrap(
    `<path d="M8 24 V14 M14 24 V8 M20 24 V12 M26 24 V17" stroke="${ink}" stroke-width="2.4"/>`
  ),
  'ticket/check.svg': wrap(
    `<circle cx="16" cy="16" r="10" stroke="${ink}" stroke-width="2"/>
     <path d="M16 10 V16.5 L21 19" stroke="${ink}" stroke-width="2"/>`
  ),
  'ticket/report.svg': wrap(
    `<path d="M10 7 H18 L24 13 V25 H10 Z" stroke="${ink}" stroke-width="2"/>
     <path d="M18 7 V13 H24" stroke="${ink}" stroke-width="2"/>
     <path d="M13 17 H21 M13 21 H18" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'ticket/delivery.svg': wrap(
    `<path d="M5 12 H19 V22 H5 Z" stroke="${ink}" stroke-width="2"/>
     <path d="M19 15 H26 L28 18 V22 H19" stroke="${ink}" stroke-width="2"/>
     <circle cx="10" cy="24" r="2.4" stroke="${ink}" stroke-width="1.8"/>
     <circle cx="23" cy="24" r="2.4" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'ticket/logistics.svg': wrap(
    `<path d="M7 22 L16 7 L25 22 Z" stroke="${ink}" stroke-width="2"/>
     <path d="M16 12 V19" stroke="${ink}" stroke-width="2"/>
     <circle cx="16" cy="22.5" r="1.4" fill="${ink}" stroke="none"/>`
  ),
  'ticket/return.svg': wrap(
    `<path d="M10 9 H20 C24 9 24 16 20 16 H9" stroke="${ink}" stroke-width="2"/>
     <path d="M13 6 L9 9 L13 12" stroke="${ink}" stroke-width="2"/>
     <path d="M22 23 H12 C8 23 8 16 12 16 H23" stroke="${ink}" stroke-width="2"/>
     <path d="M19 20 L23 23 L19 26" stroke="${ink}" stroke-width="2"/>`
  ),
  'ticket/daily.svg': wrap(
    `<rect x="6" y="8" width="20" height="18" rx="1.5" stroke="${ink}" stroke-width="2"/>
     <path d="M6 13 H26 M11 8 V5 M21 8 V5" stroke="${ink}" stroke-width="2"/>
     <path d="M11 18 H13.5 M16 18 H18.5 M21 18 H23.5" stroke="${ink}" stroke-width="2"/>`
  ),
  'ticket/scan.svg': wrap(
    `<path d="M7 13 V7 H13 M25 13 V7 H19 M7 19 V25 H13 M25 19 V25 H19" stroke="${ink}" stroke-width="2.2"/>
     <path d="M11 16 H21" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'ticket/ai.svg': wrap(
    `<path d="M10 24 L16 7 L22 24 M12 18 H20" stroke="${red}" stroke-width="2"/>`
  ),
  'ticket/chevron.svg': wrap(
    `<path d="M12 8 L21 16 L12 24" stroke="${ink}" stroke-width="2.2"/>`
  ),
  'ticket/search.svg': wrap(
    `<circle cx="14" cy="14" r="7" stroke="${ink}" stroke-width="2"/>
     <path d="M19 19 L26 26" stroke="${ink}" stroke-width="2.2"/>`
  ),
  'ticket/clock.svg': wrap(
    `<circle cx="16" cy="16" r="10" stroke="${ink}" stroke-width="2"/>
     <path d="M16 9 V16.5 L22 19" stroke="${ink}" stroke-width="2"/>`
  ),
  'ticket/reason.svg': wrap(
    `<path d="M8 6 H24 V22 L16 26 L8 22 Z" stroke="${ink}" stroke-width="2"/>
     <path d="M12 12 H20 M12 16 H18" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'ticket/pencil.svg': wrap(
    `<path d="M19 7 L25 13 L12 26 L6 26 L6 20 Z" stroke="${ink}" stroke-width="2"/>
     <path d="M17 9 L23 15" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'tabbar/edit.svg': null,
  'tabbar/bindEquipment.svg': wrap(
    `<rect x="8" y="10" width="16" height="12" stroke="${ink}" stroke-width="1.7"/>
     <path d="M8 14 H24 M12 10 V8 M20 10 V8 M14 18 H18" stroke="${ink}" stroke-width="1.5"/>`
  ),
  'tabbar/exit-icon.svg': wrap(
    `<path d="M8 8 H16 V24 H8 Z" stroke="${ink}" stroke-width="1.7"/>
     <path d="M14 16 H25 M21 12 L25 16 L21 20" stroke="${red}" stroke-width="1.8"/>`
  ),
  'tabbar/detail-arrow.svg': wrap(
    `<path d="M12 8 L20 16 L12 24" stroke="${red}" stroke-width="1.8"/>`,
    red
  ),
  'tabbar/locked.svg': wrap(
    `<rect x="9" y="14" width="14" height="11" stroke="${ink}" stroke-width="1.7"/>
     <path d="M12 14 V11 C12 8 20 8 20 11 V14" stroke="${ink}" stroke-width="1.7"/>`
  ),
  'tabbar/unlocked.svg': wrap(
    `<rect x="9" y="14" width="14" height="11" stroke="${ink}" stroke-width="1.7"/>
     <path d="M12 14 V11 C12 8 20 8 20 11" stroke="${ink}" stroke-width="1.7"/>`
  ),
  'tabbar/down-arrow.svg': wrap(
    `<path d="M8 12 L16 22 L24 12" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'tabbar/up-arrow.svg': wrap(
    `<path d="M8 20 L16 10 L24 20" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'tabbar/arrow-tabs.svg': wrap(
    `<path d="M10 12 L16 20 L22 12" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'tabbar/扫一扫.svg': null,
  'tabbar/返单.svg': null,
  'tabbar/dailyReport.svg': null,
  'check/finish.svg': wrap(
    `<path d="M8 17 L13 22 L24 10" stroke="${green}" stroke-width="2.2"/>`,
    green
  ),
  'check/unfinish.svg': wrap(
    `<circle cx="16" cy="16" r="8" stroke="${mute}" stroke-width="1.7" stroke-dasharray="3 3"/>`,
    mute
  ),
  'productionReport/clockIn.svg': null,
  'productionReport/batchReport.svg': wrap(
    `<rect x="7" y="8" width="10" height="13" stroke="${ink}" stroke-width="1.6"/>
     <rect x="12" y="11" width="10" height="13" stroke="${ink}" stroke-width="1.6"/>
     <path d="M15 16 H21 M15 19 H20" stroke="${ink}" stroke-width="1.4"/>`
  ),
  'productionReport/multiReport.svg': wrap(
    `<circle cx="11" cy="12" r="3" stroke="${ink}" stroke-width="1.6"/>
     <circle cx="21" cy="12" r="3" stroke="${ink}" stroke-width="1.6"/>
     <path d="M6 23 C7 18 10 17 11 17 C13 17 16 18 16 23 M16 23 C17 18 20 17 21 17 C23 17 26 18 26 23" stroke="${ink}" stroke-width="1.6"/>`
  ),
  'productionReport/orderInfo.svg': wrap(
    `<rect x="8" y="7" width="16" height="18" stroke="${ink}" stroke-width="1.7"/>
     <path d="M11 12 H21 M11 16 H21 M11 20 H17" stroke="${ink}" stroke-width="1.5"/>`
  ),
  'productionReport/rightArrow.svg': wrap(
    `<path d="M11 8 L21 16 L11 24" stroke="${ink}" stroke-width="1.8"/>`
  ),
  'logistics/电话.svg': wrap(
    `<rect x="11" y="6" width="10" height="20" rx="1" stroke="${ink}" stroke-width="1.7"/>
     <circle cx="16" cy="22" r="1.2" fill="${ink}" stroke="none"/>`
  ),
  'logistics/导航.svg': wrap(
    `<path d="M16 6 L24 24 L16 20 L8 24 Z" stroke="${ink}" stroke-width="1.7"/>`
  ),
  'logistics/Scan-code.svg': null,
}

icons['ticket/gain.svg'] = icons['tabbar/gain.svg']
icons['tabbar/edit.svg'] = icons['ticket/pencil.svg']
icons['tabbar/扫一扫.svg'] = icons['ticket/scan.svg']
icons['tabbar/返单.svg'] = icons['ticket/return.svg']
icons['tabbar/dailyReport.svg'] = icons['ticket/daily.svg']
icons['productionReport/clockIn.svg'] = icons['ticket/check.svg']
icons['logistics/Scan-code.svg'] = icons['ticket/scan.svg']
icons['ticket/empty.svg'] = wrap(
  `<rect x="8" y="10" width="16" height="12" stroke="${mute}" stroke-width="1.6" stroke-dasharray="2 2"/>
   <path d="M12 16 H20" stroke="${mute}" stroke-width="1.5"/>`,
  mute
)
icons['logistics/开始配送.svg'] = wrap(
  `<path d="M6 16 H22 M18 12 L22 16 L18 20" stroke="${red}" stroke-width="1.8"/>`,
  red
)
icons['logistics/开始取送.svg'] = wrap(
  `<path d="M6 16 H22 M18 12 L22 16 L18 20" stroke="${ink}" stroke-width="1.8"/>`
)
icons['logistics/完成.svg'] = wrap(
  `<path d="M8 17 L13 22 L24 10" stroke="${green}" stroke-width="2.2"/>`,
  green
)
icons['logistics/selected.svg'] = wrap(
  `<rect x="7" y="7" width="18" height="18" stroke="${red}" stroke-width="1.7"/>
   <path d="M11 16 L15 20 L22 11" stroke="${red}" stroke-width="1.8"/>`,
  red
)
icons['logistics/unselected.svg'] = wrap(
  `<rect x="7" y="7" width="18" height="18" stroke="${mute}" stroke-width="1.7"/>`,
  mute
)
icons['returnOrder/scan.svg'] = icons['ticket/scan.svg']
icons['returnOrder/search.svg'] = icons['ticket/search.svg']
icons['ticket/check-punch.svg'] = icons['ticket/check.svg']

for (const [rel, svg] of Object.entries(icons)) {
  if (!svg) continue
  const file = path.join(root, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, svg)
  console.log('wrote', rel)
}
console.log('done', Object.keys(icons).filter(k => icons[k]).length)
