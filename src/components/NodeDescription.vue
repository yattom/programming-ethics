<template>
  <div data-testid="node-description" class="description-panel">
    <p v-if="error" class="error">{{ error }}</p>
    <template v-if="node">
      <h2>{{ node.title }}</h2>
      <p>{{ node.description }}</p>
      <template v-if="node.examples && node.examples.length > 0">
        <p><strong>例</strong></p>
        <ul>
          <li v-for="(ex, i) in node.examples" :key="i">{{ ex }}</li>
        </ul>
      </template>
    </template>
    <template v-else>
      <p>ノードをクリックすると説明が表示されます。</p>
    </template>
  </div>
</template>

<script setup>
defineProps({
  node: { type: Object, default: null },
  error: { type: String, default: null },
})
</script>

<style scoped>
.description-panel {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 120px;
}
</style>
