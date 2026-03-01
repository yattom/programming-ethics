<template>
  <div class="ollama-status" data-testid="ollama-status">
    <span class="dot" :class="connected ? 'connected' : 'disconnected'"></span>
    <span>{{ connected ? 'AI: 接続中' : 'AI: 未接続' }}</span>
  </div>
</template>

<script setup>
defineProps({
  connected: Boolean,
})
</script>

<style scoped>
.ollama-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #666;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot.connected {
  background: #22c55e;
}
.dot.disconnected {
  background: #9ca3af;
}
</style>
