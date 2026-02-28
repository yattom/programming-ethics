<template>
  <main class="app">
    <h1>プログラマーの倫理</h1>
    <div class="layout">
      <EthicsMapView
        :nodes="map.nodes"
        :selected-node-id="selectedNodeId"
        @node-selected="onNodeSelected"
      />
      <div class="sidebar">
        <NodeDescription :node="selectedNode" :error="errorMessage" />
        <PointControls
          :p-points="pNode.points"
          :distributing="distributing"
          :selected-node-id="selectedNodeId"
          @start="startDistribution"
          @add-to-p="addToP"
          @add-point="addPoint"
          @reset="reset"
          @copy-url="copyUrl"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { EthicsMap } from './model/EthicsMap.js'
import { encodeMapState, decodeMapState } from './model/mapUrl.js'
import EthicsMapView from './components/EthicsMapView.vue'
import NodeDescription from './components/NodeDescription.vue'
import PointControls from './components/PointControls.vue'

const map = reactive(new EthicsMap())
const selectedNodeId = ref(null)
const distributing = ref(false)
const errorMessage = ref(null)

const pNode = computed(() => map.nodes.find(n => n.id === 'P'))
const selectedNode = computed(() =>
  selectedNodeId.value ? map.nodes.find(n => n.id === selectedNodeId.value) : null
)

function onNodeSelected(nodeId) {
  selectedNodeId.value = nodeId
  errorMessage.value = null
}

function startDistribution() {
  for (let i = 0; i < 10; i++) map.addPoint('P')
  distributing.value = true
}

function addToP() {
  for (let i = 0; i < 5; i++) map.addPoint('P')
}

function addPoint(nodeId) {
  const ok = map.addPoint(nodeId)
  if (!ok) {
    errorMessage.value = 'ポイントを追加できません。親ノードのポイントが不足しているか、Pのポイントが0です。'
  } else {
    errorMessage.value = null
  }
}

function reset() {
  const fresh = new EthicsMap()
  map.nodes.forEach((node, i) => { node.points = fresh.nodes[i].points })
  selectedNodeId.value = null
  distributing.value = false
  errorMessage.value = null
}

function copyUrl(userName) {
  const qs = encodeMapState(userName, map.nodes)
  const url = `${location.origin}${location.pathname}?${qs}`
  navigator.clipboard.writeText(url)
}

onMounted(() => {
  const qs = location.search.slice(1)
  if (!qs) return
  const { pPoints, nodePoints } = decodeMapState(qs)
  map.nodes.find(n => n.id === 'P').points = pPoints
  for (const [id, pts] of Object.entries(nodePoints)) {
    map.nodes.find(n => n.id === id).points = pts
  }
  distributing.value = true
})
</script>

<style scoped>
.app {
  padding: 1rem;
}
.layout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
}
</style>
