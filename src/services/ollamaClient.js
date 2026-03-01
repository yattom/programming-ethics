const BASE_URL = 'http://localhost:11434'
const MODEL = 'gemma3:27b'

export async function checkConnection() {
  try {
    const response = await fetch(`${BASE_URL}/api/tags`)
    return response.ok
  } catch {
    return false
  }
}

export async function generateEthicsCode(nodes, onChunk, signal) {
  const prompt = buildPrompt(nodes)
  const response = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: true }),
    signal,
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()
      for (const line of lines) {
        if (!line.trim()) continue
        const data = JSON.parse(line)
        if (data.response) onChunk(data.response)
        if (data.done) return
      }
    }
  } finally {
    reader.cancel()
  }
}

function buildPrompt(nodes) {
  const activeNodes = nodes
    .filter((n) => n.id !== 'P' && n.points > 0)
    .map((n) => `- ${n.title}: ${n.points}ポイント`)
    .join('\n')

  return `以下はプログラマーの倫理マップにおける私のポイント配分です：
${activeNodes || '(ポイントが割り振られていません)'}

このポイント配分をもとに、私（プログラマー）が大切にしている価値観を表現した倫理綱領テキストを日本語で200字程度で生成してください。「私は〜」という一人称で書いてください。`
}
