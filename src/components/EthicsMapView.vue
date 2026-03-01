<template>
  <div data-testid="ethics-map">
    <svg :width="svgWidth" :height="svgHeight" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
      <defs>
        <radialGradient id="heart-gradient" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stop-color="#ffcce0"/>
          <stop offset="45%" stop-color="#e82563"/>
          <stop offset="100%" stop-color="#8b0e35"/>
        </radialGradient>
        <filter id="heart-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" flood-color="#00000050"/>
        </filter>
      </defs>
      <!-- ポイントに応じた色の濃淡 (ノードの背後) -->
      <!-- N0: 中央円を塗りつぶし -->
      <circle
        :cx="cx" :cy="cy" :r="r0"
        :fill="NODE_COLORS['N0']"
        :fill-opacity="pointOpacity(n0Node.points)"
      />
      <!-- N1, N2: 扇形セクター -->
      <path
        v-for="arc in arcFills"
        :key="arc.id"
        :d="arc.path"
        :fill="arc.color"
        :fill-opacity="pointOpacity(arc.points)"
      />

      <!-- 同心円の境界線 -->
      <circle :cx="cx" :cy="cy" :r="r0" fill="none" stroke="#bbb" stroke-width="1" />
      <circle :cx="cx" :cy="cy" :r="r1" fill="none" stroke="#bbb" stroke-width="1" />
      <circle :cx="cx" :cy="cy" :r="r2" fill="none" stroke="#bbb" stroke-width="1" />

      <!-- 進化リンク (親から子への接続線) -->
      <line
        v-for="link in EVOLUTION_LINKS"
        :key="`${link.from}-${link.to}`"
        :x1="NODE_POSITIONS[link.from].x"
        :y1="NODE_POSITIONS[link.from].y"
        :x2="NODE_POSITIONS[link.to].x"
        :y2="NODE_POSITIONS[link.to].y"
        stroke="#bbb"
        stroke-width="1.5"
      />

      <!-- ノード -->
      <g
        v-for="node in mapNodes"
        :key="node.id"
        :data-testid="`node-${node.id}`"
        :transform="`translate(${node.x}, ${node.y})`"
        class="node"
        :class="{ selected: selectedNodeId === node.id }"
        @click="$emit('node-selected', node.id)"
        style="cursor: pointer"
      >
        <circle r="18" :fill="node.color" stroke="#999" stroke-width="1.5" />
        <text
          v-if="node.points > 0"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="11"
          fill="#333"
        >{{ node.points }}</text>
        <g
          v-for="i in node.points"
          :key="i"
          :data-testid="`token-${node.id}-${i}`"
          :transform="`translate(${tokenX(i, node.points)}, -28)`"
          style="cursor: pointer"
          @click.stop="$emit('remove-point', node.id)"
        >
          <path
            d="M 0,4 C -1.5,2.5 -6,2 -6,-1 C -6,-4 -3.5,-5.5 -1.5,-4.5 C -0.8,-4 0,-3 0,-2.5 C 0,-3 0.8,-4 1.5,-4.5 C 3.5,-5.5 6,-4 6,-1 C 6,2 1.5,2.5 0,4 Z"
            fill="url(#heart-gradient)"
            stroke="#8b0e35"
            stroke-width="0.5"
            filter="url(#heart-shadow)"
          />
          <ellipse cx="-1.8" cy="-2.8" rx="1.6" ry="0.9" fill="white" fill-opacity="0.45" transform="rotate(-25,-1.8,-2.8)"/>
        </g>
      </g>

      <!-- 選択ノード近くのポイント操作ボタン -->
      <foreignObject
        v-if="distributing && selectedMapNode"
        :x="selectedMapNode.x - 35"
        :y="selectedMapNode.y + 22"
        width="72"
        height="30"
      >
        <div style="display:flex;gap:4px;">
          <button
            data-testid="add-point"
            style="font-size:12px;padding:2px 6px;cursor:pointer;"
            @click.stop="$emit('add-point', selectedNodeId)"
          >+1</button>
          <button
            data-testid="remove-point"
            style="font-size:12px;padding:2px 6px;cursor:pointer;"
            @click.stop="$emit('remove-point', selectedNodeId)"
          >-1</button>
        </div>
      </foreignObject>

      <!-- Pノード (左側) -->
      <g
        :data-testid="`node-P`"
        :transform="`translate(${pNode.x}, ${pNode.y})`"
        class="p-node"
        :class="{ selected: selectedNodeId === 'P' }"
        style="cursor: pointer"
        @click="$emit('node-selected', 'P')"
      >
        <rect x="-45" y="-100" width="90" height="200" rx="12" :fill="pNode.color" stroke="#999" stroke-width="1.5" />
        <template v-if="distributing">
          <g
            v-for="i in Math.min(pNode.points, 10)"
            :key="i"
            :transform="`translate(0, ${-80 + (i - 1) * 17})`"
          >
            <path
              d="M 0,4 C -1.5,2.5 -6,2 -6,-1 C -6,-4 -3.5,-5.5 -1.5,-4.5 C -0.8,-4 0,-3 0,-2.5 C 0,-3 0.8,-4 1.5,-4.5 C 3.5,-5.5 6,-4 6,-1 C 6,2 1.5,2.5 0,4 Z"
              fill="url(#heart-gradient)"
              stroke="#8b0e35"
              stroke-width="0.5"
              filter="url(#heart-shadow)"
            />
            <ellipse cx="-1.8" cy="-2.8" rx="1.6" ry="0.9" fill="white" fill-opacity="0.45" transform="rotate(-25,-1.8,-2.8)"/>
          </g>
          <text
            data-testid="p-points"
            x="0"
            y="90"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="14"
            fill="white"
            stroke="#333"
            stroke-width="0.5"
            paint-order="stroke"
          >{{ pNode.points }}</text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nodes: { type: Array, required: true },
  selectedNodeId: { type: String, default: null },
  distributing: { type: Boolean, default: false },
})

defineEmits(['node-selected', 'remove-point', 'add-point'])

const svgWidth = 600
const svgHeight = 440
// 中央をやや右にずらして左側にPノード領域を確保するオフセット
const CENTER_X_OFFSET = 30
const cx = svgWidth / 2 + CENTER_X_OFFSET
const cy = svgHeight / 2
const r0 = 55
const r1 = 110
const r2 = 185

function clockPos(hours, radius) {
  const angle = (hours / 12) * 2 * Math.PI - Math.PI / 2
  return {
    x: Math.round(cx + radius * Math.cos(angle)),
    y: Math.round(cy + radius * Math.sin(angle)),
  }
}

function clockAngle(hours) {
  return (hours / 12) * 2 * Math.PI - Math.PI / 2
}

function annularSectorPath(innerR, outerR, startH, endH) {
  const sa = clockAngle(startH)
  const ea = clockAngle(endH)
  const cos = Math.cos, sin = Math.sin

  const ix1 = cx + innerR * cos(sa), iy1 = cy + innerR * sin(sa)
  const ix2 = cx + innerR * cos(ea), iy2 = cy + innerR * sin(ea)
  const ox1 = cx + outerR * cos(sa), oy1 = cy + outerR * sin(sa)
  const ox2 = cx + outerR * cos(ea), oy2 = cy + outerR * sin(ea)

  const large = (endH - startH) > 6 ? 1 : 0

  if (innerR === 0) {
    return `M ${cx} ${cy} L ${ox1.toFixed(1)} ${oy1.toFixed(1)} A ${outerR} ${outerR} 0 ${large} 1 ${ox2.toFixed(1)} ${oy2.toFixed(1)} Z`
  }
  return `M ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${innerR} ${innerR} 0 ${large} 1 ${ix2.toFixed(1)} ${iy2.toFixed(1)} L ${ox2.toFixed(1)} ${oy2.toFixed(1)} A ${outerR} ${outerR} 0 ${large} 0 ${ox1.toFixed(1)} ${oy1.toFixed(1)} Z`
}

const NODE_COLORS = {
  'N0':   '#fde68a',
  'N1-1': '#fed7aa', 'N2-1': '#f97316', 'N2-2': '#fb923c',
  'N1-2': '#bbf7d0', 'N2-3': '#22c55e', 'N2-4': '#4ade80',
  'N1-3': '#e9d5ff', 'N2-5': '#a855f7', 'N2-6': '#c084fc',
}

const r01 = Math.round((r0 + r1) / 2)
const r12 = Math.round((r1 + r2) / 2)

const NODE_POSITIONS = {
  'N0':   { x: cx, y: cy },
  'N1-1': clockPos(12, r01),
  'N1-2': clockPos(4,  r01),
  'N1-3': clockPos(8,  r01),
  'N2-1': clockPos(11.4, r12),
  'N2-2': clockPos(0.6,  r12),
  'N2-3': clockPos(3.4,  r12),
  'N2-4': clockPos(4.6,  r12),
  'N2-5': clockPos(7.4,  r12),
  'N2-6': clockPos(8.6,  r12),
}

const NODE_ARCS = {
  'N1-1': { innerR: r0, outerR: r1, startH: 10, endH: 14 },
  'N1-2': { innerR: r0, outerR: r1, startH: 2,  endH: 6  },
  'N1-3': { innerR: r0, outerR: r1, startH: 6,  endH: 10 },
  'N2-1': { innerR: r1, outerR: r2, startH: 10, endH: 12 },
  'N2-2': { innerR: r1, outerR: r2, startH: 12, endH: 14 },
  'N2-3': { innerR: r1, outerR: r2, startH: 2,  endH: 4  },
  'N2-4': { innerR: r1, outerR: r2, startH: 4,  endH: 6  },
  'N2-5': { innerR: r1, outerR: r2, startH: 6,  endH: 8  },
  'N2-6': { innerR: r1, outerR: r2, startH: 8,  endH: 10 },
}

const EVOLUTION_LINKS = [
  { from: 'N0', to: 'N1-1' },
  { from: 'N0', to: 'N1-2' },
  { from: 'N0', to: 'N1-3' },
  { from: 'N1-1', to: 'N2-1' },
  { from: 'N1-1', to: 'N2-2' },
  { from: 'N1-2', to: 'N2-3' },
  { from: 'N1-2', to: 'N2-4' },
  { from: 'N1-3', to: 'N2-5' },
  { from: 'N1-3', to: 'N2-6' },
]

function pointOpacity(points) {
  return Math.min(points / 5, 1) * 0.75
}

const n0Node = computed(() => props.nodes.find(n => n.id === 'N0'))

const arcFills = computed(() =>
  Object.entries(NODE_ARCS).map(([id, arc]) => {
    const node = props.nodes.find(n => n.id === id)
    return {
      id,
      path: annularSectorPath(arc.innerR, arc.outerR, arc.startH, arc.endH),
      color: NODE_COLORS[id],
      points: node?.points ?? 0,
    }
  })
)

const mapNodes = computed(() =>
  props.nodes
    .filter(n => n.id !== 'P')
    .map(n => ({
      ...n,
      ...NODE_POSITIONS[n.id],
      color: NODE_COLORS[n.id] ?? '#e5e7eb',
    }))
)

const pNode = computed(() => {
  const p = props.nodes.find(n => n.id === 'P')
  const maxPoints = 10
  const ratio = Math.min(p.points / maxPoints, 1)
  const gray = Math.round(192 * (1 - ratio))
  const hex = gray.toString(16).padStart(2, '0')
  return { ...p, x: 65, y: cy, color: `#${hex}${hex}${hex}` }
})

function tokenX(i, total) {
  return (i - (total + 1) / 2) * 10
}

const selectedMapNode = computed(() =>
  mapNodes.value.find(n => n.id === props.selectedNodeId)
)
</script>

<style scoped>
.node.selected circle:first-child {
  stroke: #1d4ed8;
  stroke-width: 3;
}
.p-node.selected rect {
  stroke: #1d4ed8;
  stroke-width: 3;
}
</style>
