<template>
  <main class="app">
    <div class="app-header">
      <h1>プログラマー{{ userName }}の倫理</h1>
      <OllamaStatus :connected="ollamaConnected" />
    </div>
    <div class="layout">
      <EthicsMapView
        :nodes="map.nodes"
        :selected-node-id="selectedNodeId"
        :distributing="distributing"
        @node-selected="onNodeSelected"
        @add-point="addPoint"
        @remove-point="removePoint"
      />
      <div class="sidebar">
        <NodeDescription :node="selectedNode" :error="errorMessage" />
        <PointControls
          :distributing="distributing"
          v-model:user-name="userName"
          @start="startDistribution"
          @add-to-p="addToP"
          @reset="reset"
          @copy-url="copyUrl"
        />
        <EthicsCodeView
          v-if="ollamaConnected"
          :text="ethicsCode"
          :loading="ethicsCodeLoading"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { EthicsMap } from './model/EthicsMap.js'
import { encodeMapState, decodeMapState } from './model/mapUrl.js'
import { checkConnection, generateEthicsCode } from './services/ollamaClient.js'
import EthicsMapView from './components/EthicsMapView.vue'
import NodeDescription from './components/NodeDescription.vue'
import PointControls from './components/PointControls.vue'
import OllamaStatus from './components/OllamaStatus.vue'
import EthicsCodeView from './components/EthicsCodeView.vue'

const map = reactive(new EthicsMap())
const selectedNodeId = ref(null)
const distributing = ref(false)
const errorMessage = ref(null)
const userName = ref('')
const ollamaConnected = ref(false)
const ethicsCode = ref('')
const ethicsCodeLoading = ref(false)

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

function removePoint(nodeId) {
  const ok = map.removePoint(nodeId)
  if (!ok) {
    errorMessage.value = 'ポイントを減らせません。子ノードのポイントが残っているか、ポイントが0です。'
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

function copyUrl() {
  const qs = encodeMapState(userName.value, map.nodes)
  const url = `${location.origin}${location.pathname}?${qs}`
  navigator.clipboard.writeText(url)
}

watch(
  () => encodeMapState(userName.value, map.nodes),
  (qs) => {
    history.replaceState(null, '', `?${qs}`)
  }
)

let debounceTimer = null
let abortController = null
watch(
  () => map.nodes.map((n) => n.points).join(','),
  () => {
    if (!ollamaConnected.value) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      if (abortController) abortController.abort()
      abortController = new AbortController()
      const signal = abortController.signal
      ethicsCodeLoading.value = true
      ethicsCode.value = ''
      try {
        await generateEthicsCode(map.nodes, (chunk) => {
          ethicsCode.value += chunk
        }, signal)
        ethicsCodeLoading.value = false
      } catch (e) {
        if (e.name !== 'AbortError') ethicsCodeLoading.value = false
      }
    }, 1000)
  }
)

onMounted(async () => {
  ollamaConnected.value = await checkConnection()

  const qs = location.search.slice(1)
  if (!qs) return
  const { name, pPoints, nodePoints } = decodeMapState(qs)
  userName.value = name
  map.nodes.find((n) => n.id === 'P').points = pPoints
  for (const [id, pts] of Object.entries(nodePoints)) {
    map.nodes.find((n) => n.id === id).points = pts
  }
  distributing.value = true
})
</script>

<style scoped>
.app {
  padding: 1rem;
}
.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.app-header h1 {
  margin: 0;
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
