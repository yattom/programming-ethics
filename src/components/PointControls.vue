<template>
  <div class="controls">
    <div class="share-section">
      <input
        data-testid="user-name"
        type="text"
        :value="userName"
        @input="$emit('update:userName', $event.target.value)"
        placeholder="あなたの名前"
      />
      <button data-testid="copy-url" @click="onCopyUrl">{{ copyLabel }}</button>
    </div>

    <template v-if="!distributing">
      <button data-testid="start-distribution" @click="$emit('start')">配布開始</button>
    </template>

    <template v-else>
      <button data-testid="add-point-to-p" @click="$emit('add-to-p')">ポイント追加 (+5)</button>
      <button data-testid="reset" @click="showConfirm = true">リセット</button>
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
  distributing: { type: Boolean, required: true },
  userName: { type: String, default: '' },
})

const emit = defineEmits(['start', 'add-to-p', 'reset', 'copy-url', 'update:userName'])
const showConfirm = ref(false)
const copyLabel = ref('URLをコピー')

function onConfirmReset() {
  showConfirm.value = false
  emit('reset')
}

function onCopyUrl() {
  emit('copy-url')
  copyLabel.value = 'コピーしました！'
  setTimeout(() => { copyLabel.value = 'URLをコピー' }, 2000)
}
</script>
