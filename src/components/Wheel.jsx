import { useEffect, useRef, useState } from 'react'
import './Wheel.css'

const LABEL_FONT_STACK = "'Source Serif 4', system-ui, 'Segoe UI', serif"

let measureCtx = null
function measureTextWidth(text, fontSize, fontWeight) {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d')
  measureCtx.font = `${fontWeight} ${fontSize}px ${LABEL_FONT_STACK}`
  return measureCtx.measureText(text).width
}

const WEDGE_RADIUS = 248
const RIM_RADIUS = 258
const OUTLINE_RADIUS = 256
const CENTER_RADIUS = 86
const SPIN_TURNS = 5
const SPIN_DURATION = 4200

// "Seguí participando" pesa más que cada premio individual; los premios
// reales siempre pesan lo mismo entre sí, sin importar cuántos gajos haya.
const LOSE_WEIGHT = 2
const WIN_WEIGHT = 1

function normalizeLabel(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function isLosePrize(prize) {
  return normalizeLabel(prize.label) === 'segui participando'
}

function pickWeightedIndex(prizes) {
  const weights = prizes.map((prize) => (isLosePrize(prize) ? LOSE_WEIGHT : WIN_WEIGHT))
  const total = weights.reduce((sum, w) => sum + w, 0)
  let roll = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return i
  }
  return weights.length - 1
}

function polarPoint(angleDeg, radius, cx = 260, cy = 260) {
  const rad = (angleDeg * Math.PI) / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
}

// Gajo 0 queda centrado arriba (bajo el puntero) en reposo, igual al diseño original.
function wedgeStart(index, segmentAngle) {
  return -90 - segmentAngle / 2 + index * segmentAngle
}

function wedgePath(index, segmentAngle) {
  const start = wedgeStart(index, segmentAngle)
  const end = start + segmentAngle
  const [x1, y1] = polarPoint(start, WEDGE_RADIUS)
  const [x2, y2] = polarPoint(end, WEDGE_RADIUS)
  const largeArc = segmentAngle > 180 ? 1 : 0
  return `M 260 260 L ${x1} ${y1} A ${WEDGE_RADIUS} ${WEDGE_RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function wedgeCenterAngle(index, segmentAngle) {
  return wedgeStart(index, segmentAngle) + segmentAngle / 2
}

function labelFontSize(count) {
  if (count <= 6) return 20
  if (count <= 8) return 14
  if (count <= 10) return 12.5
  return 11
}

// Ancho disponible (en unidades del viewBox) para el texto de un gajo,
// medido como la cuerda del arco en el radio de la etiqueta. Se usa solo
// como estimación inicial para decidir el salto de línea.
function wedgeAvailableWidth(segmentAngle, labelRadius) {
  return 2 * labelRadius * Math.sin((segmentAngle * Math.PI) / 360) * 0.86
}

// Rotación del bloque de texto para que quede alineado tangencialmente al
// gajo (como en una ruleta real: el texto "sigue" la curva). Con el texto
// alineado así, el ancho de cuerda (wedgeAvailableWidth) es exacto — ya no
// hay descalce entre el texto horizontal y los bordes en diagonal del gajo.
// Se normaliza a (-90°, 90°] para que el texto nunca quede cabeza abajo.
function wedgeTextRotation(mid) {
  let r = mid + 90
  r = ((r + 180) % 360 + 360) % 360 - 180
  if (r > 90) r -= 180
  else if (r <= -90) r += 180
  return r
}

// Detecta un "XX% OFF" al inicio del texto para resaltarlo aparte del resto.
const HIGHLIGHT_RE = /^(\d+%\s*(?:off|OFF|Off)?)\s*(.*)$/

function splitHighlight(text) {
  const match = text.match(HIGHLIGHT_RE)
  if (!match || !match[1]) return { highlight: null, rest: text }
  const highlight = match[1].trim()
  const rest = match[2].trim()
  return { highlight, rest: rest || null }
}

// Corta una palabra que sola ya excede el ancho disponible, letra a letra,
// usando el ancho real medido (no una estimación).
function breakWord(word, maxWidth, fontSize, fontWeight) {
  let cut = word.length
  while (cut > 1 && measureTextWidth(word.slice(0, cut), fontSize, fontWeight) > maxWidth) cut--
  return [word.slice(0, cut), word.slice(cut)]
}

function wrapLabel(text, maxWidth, fontSize, fontWeight) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  const pushCurrent = () => {
    if (current) {
      lines.push(current)
      current = ''
    }
  }
  for (let word of words) {
    while (measureTextWidth(word, fontSize, fontWeight) > maxWidth && word.length > 1) {
      pushCurrent()
      const [head, tail] = breakWord(word, maxWidth, fontSize, fontWeight)
      lines.push(head)
      word = tail
    }
    const candidate = current ? `${current} ${word}` : word
    if (current && measureTextWidth(candidate, fontSize, fontWeight) > maxWidth) {
      pushCurrent()
      current = word
    } else {
      current = candidate
    }
  }
  pushCurrent()
  if (lines.length > 3) {
    const kept = lines.slice(0, 3)
    let last = kept[2]
    while (last.length > 1 && measureTextWidth(`${last}…`, fontSize, fontWeight) > maxWidth) {
      last = last.slice(0, -1)
    }
    kept[2] = `${last}…`
    return kept
  }
  return lines.length ? lines : ['']
}

// Arma las líneas a dibujar en un gajo: si el texto arranca con "XX% OFF" esa
// parte se dibuja más grande y en negrita, y el resto (si hay) debajo, más chico.
function buildLabelLines(label, segmentAngle, labelRadius, baseFontSize) {
  const { highlight, rest } = splitHighlight(label)
  const maxWidth = wedgeAvailableWidth(segmentAngle, labelRadius)

  if (!highlight) {
    return wrapLabel(label, maxWidth, baseFontSize, 600).map((text) => ({
      text,
      fontSize: baseFontSize,
      fontWeight: 600,
    }))
  }

  const highlightFontSize = baseFontSize * 1.3
  const restFontSize = baseFontSize * 0.82

  const lines = wrapLabel(highlight, maxWidth, highlightFontSize, 800).map((text) => ({
    text,
    fontSize: highlightFontSize,
    fontWeight: 800,
  }))

  if (rest) {
    wrapLabel(rest, maxWidth, restFontSize, 500).forEach((text) => {
      lines.push({ text, fontSize: restFontSize, fontWeight: 500 })
    })
  }

  return lines
}

export default function Wheel({ company, onSpinEnd }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [, forceRerender] = useState(0)
  const rotationRef = useRef(0)

  // Las medidas de texto dependen de la tipografía real; si carga después
  // del primer render, recalculamos el wrap una vez que esté lista.
  useEffect(() => {
    document.fonts?.ready.then(() => forceRerender((n) => n + 1))
  }, [])

  const prizes = company.prizes
  const segmentAngle = 360 / prizes.length
  const fontSize = labelFontSize(prizes.length)

  function spin() {
    if (spinning) return
    setWinner(null)
    setSpinning(true)

    const targetIndex = pickWeightedIndex(prizes)
    const targetCenter = wedgeCenterAngle(targetIndex, segmentAngle) + 90 // relativo al puntero (arriba = 0)
    const jitter = (Math.random() - 0.5) * (segmentAngle * 0.6)
    const currentBase = rotationRef.current - (rotationRef.current % 360)
    const alignment = (360 - targetCenter + jitter + 360) % 360
    let nextRotation = currentBase + SPIN_TURNS * 360 + alignment
    if (nextRotation <= rotationRef.current) nextRotation += 360

    rotationRef.current = nextRotation
    setRotation(nextRotation)

    setTimeout(() => {
      setSpinning(false)
      setWinner(prizes[targetIndex])
      onSpinEnd?.(prizes[targetIndex], targetIndex)
    }, SPIN_DURATION)
  }

  return (
    <div className="wheel-block">
      <div className="wheel-frame">
        <div className="wheel-pointer" style={{ borderTopColor: company.ink }} />
        <svg
          className="wheel-svg"
          viewBox="0 0 520 520"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? `${SPIN_DURATION}ms` : '0ms',
          }}
        >
          <circle cx="260" cy="260" r={RIM_RADIUS} fill="var(--paper)" />

          {prizes.map((prize, index) => {
            const isAccent = index % 2 === 0
            const fill = isAccent ? company.accent : company.secondary
            const textColor = isAccent ? company.accentText : company.secondaryText
            const mid = wedgeCenterAngle(index, segmentAngle)
            const labelRadius = 188
            const [labelX, labelY] = polarPoint(mid, labelRadius)
            const maxWidth = wedgeAvailableWidth(segmentAngle, labelRadius)
            const lines = buildLabelLines(prize.label.toUpperCase(), segmentAngle, labelRadius, fontSize)
            const heights = lines.map((line) => line.fontSize * 1.15)
            const totalHeight = heights.reduce((sum, h) => sum + h, 0)
            let cursorY = labelY - totalHeight / 2
            const textRotation = wedgeTextRotation(mid)

            return (
              <g key={index}>
                <path d={wedgePath(index, segmentAngle)} fill={fill} stroke={company.ink} strokeWidth="1.5" />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="wheel-label"
                  fill={textColor}
                  transform={`rotate(${textRotation} ${labelX} ${labelY})`}
                >
                  {lines.map((line, li) => {
                    cursorY += heights[li] / 2
                    const y = cursorY
                    cursorY += heights[li] / 2
                    // Red de seguridad: si por lo que sea la medida real excede lo
                    // calculado, se fuerza el ancho exacto (nunca se estira, solo achica).
                    const measured = measureTextWidth(line.text, line.fontSize, line.fontWeight)
                    const fitsProps =
                      measured > maxWidth ? { textLength: maxWidth, lengthAdjust: 'spacingAndGlyphs' } : {}
                    return (
                      <tspan
                        key={li}
                        x={labelX}
                        y={y}
                        style={{ fontSize: `${line.fontSize}px`, fontWeight: line.fontWeight }}
                        {...fitsProps}
                      >
                        {line.text}
                      </tspan>
                    )
                  })}
                </text>
              </g>
            )
          })}

          <circle cx="260" cy="260" r={OUTLINE_RADIUS} fill="none" stroke={company.ink} strokeWidth="1.5" />
          <circle cx="260" cy="260" r={CENTER_RADIUS} fill="var(--paper)" stroke={company.ink} strokeWidth="1.5" />
        </svg>
        <div className="wheel-center" style={company.logo ? { background: company.accent } : undefined}>
          {company.logo ? (
            <img src={company.logo} alt={`Logo ${company.name}`} />
          ) : (
            <span>{company.name}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="wheel-spin"
        onClick={spin}
        disabled={spinning}
        style={{ background: company.accent, color: company.accentText }}
      >
        {spinning ? 'GIRANDO…' : 'GIRAR'}
      </button>

      <div className={`wheel-winner${winner && !spinning ? ' is-visible' : ''}`}>
        <span
          className={`wheel-winner-logo${winner?.logo ? ' has-logo' : ''}`}
          style={{ background: winner?.logo ? winner.logoBg || '#fff' : 'transparent' }}
        >
          {winner?.logo && <img src={winner.logo} alt="" />}
        </span>
        <span className="wheel-winner-label">{winner?.label || ' '}</span>
      </div>
    </div>
  )
}
