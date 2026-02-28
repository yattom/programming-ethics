<template>
  <div class="controls">
    <div class="p-node-info">
      <span>P ポイント: </span>
      <span data-testid="p-points">{{ pPoints }}</span>
    </div>

    <template v-if="!distributing">
      <button data-testid="start-distribution" @click="$emit('start')">配布開始</button>
    </template>

    <template v-else>
      <button data-testid="add-point-to-p" @click="$emit('add-to-p')">ポイント追加 (+5)</button>
      <button
        v-if="selectedNodeId && selectedNodeId !== 'P'"
        data-testid="add-point"
        @click="$emit('add-point', selectedNodeId)"
      >
        {{ selectedNodeId }} に +1
      </button>
      <button
        v-if="selectedNodeId && selectedNodeId !== 'P'"
        data-testid="remove-point"
        @click="$emit('remove-point', selectedNodeId)"
      >
        {{ selectedNodeId }} に -1
      </button>
      <button data-testid="reset" @click="showConfirm = true">リセット</button>

      <div class="share-section">
        <input
          data-testid="user-name"
          type="text"
          v-model="userName"
          placeholder="あなたの名前"
        />
        <button data-testid="copy-url" @click="onCopyUrl">{{ copyLabel }}</button>
      </div>
    </template>

    <div v-if="showConfirm" class="confirm-dialog">
      <p>全ポイントを0にリセットしますか？</p>
      <button data-testid="confirm-reset" @click="onConfirmReset">はい</button>
      <button @click="showConfirm = false">キャンセル</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  pPoints: { type: Number, required: true },
  distributing: { type: Boolean, required: true },
  selectedNodeId: { type: String, default: null },
})

const emit = defineEmits(['start', 'add-to-p', 'add-point', 'remove-point', 'reset', 'copy-url'])
const showConfirm = ref(false)
const userName = ref('')
const copyLabel = ref('URLをコピー')

function onConfirmReset() {
  showConfirm.value = false
  emit('reset')
}

function onCopyUrl() {
  emit('copy-url', userName.value)
  copyLabel.value = 'コピーしました！'
  setTimeout(() => { copyLabel.value = 'URLをコピー' }, 2000)
}
</script>
