<template>
  <div data-testid="ethics-map">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
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
        <circle
          v-for="i in node.points"
          :key="i"
          :data-testid="`token-${node.id}-${i}`"
          :cx="tokenX(i, node.points)"
          cy="-28"
          r="4"
          fill="#555"
          style="cursor: pointer"
          @click.stop="$emit('remove-point', node.id)"
        />
      </g>

      <!-- Pノード (左側) -->
      <g
        :data-testid="`node-P`"
        :transform="`translate(${pNode.x}, ${pNode.y})`"
        style="cursor: default"
      >
        <rect x="-18" y="-40" width="36" height="80" rx="6" :fill="pNode.color" stroke="#999" stroke-width="1.5" />
        <text text-anchor="middle" y="55" font-size="10" fill="#555">P</text>
        <circle
          v-for="i in Math.min(pNode.points, 10)"
          :key="i"
          :cx="0"
          :cy="-50 - (i - 1) * 10"
          r="4"
          fill="#555"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nodes: { type: Array, required: true },
  selectedNodeId: { type: String, default: null },
})

defineEmits(['node-selected', 'remove-point'])

const size = 440
const cx = 220
const cy = 220
const r0 = 55
const r1 = 125
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

const NODE_POSITIONS = {
  'N0':   { x: cx, y: cy },
  'N1-1': clockPos(12, r1),
  'N1-2': clockPos(4,  r1),
  'N1-3': clockPos(8,  r1),
  'N2-1': clockPos(11, r2),
  'N2-2': clockPos(1,  r2),
  'N2-3': clockPos(3,  r2),
  'N2-4': clockPos(5,  r2),
  'N2-5': clockPos(7,  r2),
  'N2-6': clockPos(9,  r2),
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
  return { ...p, x: 30, y: cy, color: '#d1d5db' }
})

function tokenX(i, total) {
  return (i - (total + 1) / 2) * 10
}
</script>

<style scoped>
.node.selected circle:first-child {
  stroke: #1d4ed8;
  stroke-width: 3;
}
</style>
