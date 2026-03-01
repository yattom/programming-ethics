<template>
  <div class="ethics-code" data-testid="ethics-code">
    <h3>あなたの倫理綱領</h3>
    <p v-if="loading" class="loading">生成中...</p>
    <p v-else-if="text" class="text">{{ text }}</p>
    <p v-else class="placeholder">ポイントを配布すると、あなたの倫理綱領が生成されます。</p>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  loading: Boolean,
})
</script>

<style scoped>
.ethics-code {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}
h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #374151;
}
.loading {
  color: #6b7280;
  font-style: italic;
  margin: 0;
}
.placeholder {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0;
}
.text {
  line-height: 1.6;
  margin: 0;
}
</style>
