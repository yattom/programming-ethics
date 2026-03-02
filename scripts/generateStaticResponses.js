#!/usr/bin/env node
// 静的フォールバックレスポンスを生成するスクリプト
// 実行: node scripts/generateStaticResponses.js
// 前提: Ollama が http://localhost:11434 で動作していること

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '../src/services/staticResponses.js')
const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'gemma3:27b'

const NODE_INFO = {
  'P':    { title: '利益優先', desc: '個人・組織の利益を最優先する' },
  'N0':   { title: '倫理的考慮', desc: '利益よりも優先するものがあると考える' },
  'N1-1': { title: '安全性', desc: 'システムが誤作動せず、ユーザーのデータや資産を壊さないこと' },
  'N1-2': { title: 'ユーザー尊重', desc: 'ユーザーが自分の意思で操作できること、ダークパターンを避けること' },
  'N1-3': { title: 'データ保護', desc: 'ユーザーのデータを外部に漏らさず、機密性・完全性・可用性を守ること' },
  'N2-1': { title: '公平', desc: '特定の属性に偏らず全員に対してバグなく動作すること（バイアス除去）' },
  'N2-2': { title: '公益', desc: '社会全体や環境に害を与えないこと、将来世代も考慮すること' },
  'N2-3': { title: '多様性', desc: '障害者や高齢者など多様な人が操作できること（アクセシビリティ）' },
  'N2-4': { title: '基本的人権', desc: 'デジタル空間へのアクセスを権利として保障すること' },
  'N2-5': { title: '透明性', desc: 'データの使い方を正直に開示し、ブラックボックス化しないこと' },
  'N2-6': { title: '民主主義', desc: '情報操作や監視によって社会の意思決定プロセスを歪めないこと' },
}

// 11ビットキー: P_N0_N1-1_N1-2_N1-3_N2-1_N2-2_N2-3_N2-4_N2-5_N2-6
function buildKey(p) {
  return [p.P, p.N0, p.N11, p.N12, p.N13, p.N21, p.N22, p.N23, p.N24, p.N25, p.N26].join('_')
}

// 有効なパターンを全て列挙する（全ノード0の状態を除く）
function generateAllPatterns() {
  const patterns = []
  for (const P of [0, 1]) {
    for (const N0 of [0, 1]) {
      const n0Children = N0 === 0 ? [[0, 0, 0, 0, 0, 0, 0, 0, 0]] : null
      const n1n2Combos = n0Children ?? generateN1N2Combos()
      for (const [N11, N12, N13, N21, N22, N23, N24, N25, N26] of n1n2Combos) {
        const pattern = { P, N0, N11, N12, N13, N21, N22, N23, N24, N25, N26 }
        if (buildKey(pattern) !== '0_0_0_0_0_0_0_0_0_0_0') {
          patterns.push(pattern)
        }
      }
    }
  }
  return patterns
}

function generateN1N2Combos() {
  const combos = []
  for (const N11 of [0, 1]) {
    for (const N21 of (N11 ? [0, 1] : [0])) {
      for (const N22 of (N11 ? [0, 1] : [0])) {
        for (const N12 of [0, 1]) {
          for (const N23 of (N12 ? [0, 1] : [0])) {
            for (const N24 of (N12 ? [0, 1] : [0])) {
              for (const N13 of [0, 1]) {
                for (const N25 of (N13 ? [0, 1] : [0])) {
                  for (const N26 of (N13 ? [0, 1] : [0])) {
                    combos.push([N11, N12, N13, N21, N22, N23, N24, N25, N26])
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return combos
}

function buildPrompt(p) {
  const hasP = p.P === 1
  const activeNodes = []
  if (p.N0)  activeNodes.push('N0')
  if (p.N11) activeNodes.push('N1-1')
  if (p.N12) activeNodes.push('N1-2')
  if (p.N13) activeNodes.push('N1-3')
  if (p.N21) activeNodes.push('N2-1')
  if (p.N22) activeNodes.push('N2-2')
  if (p.N23) activeNodes.push('N2-3')
  if (p.N24) activeNodes.push('N2-4')
  if (p.N25) activeNodes.push('N2-5')
  if (p.N26) activeNodes.push('N2-6')

  const nodeLines = activeNodes.map(id => `- ${NODE_INFO[id].title}: ${NODE_INFO[id].desc}`).join('\n')
  const profitLine = hasP
    ? `- ${NODE_INFO['P'].title}: ${NODE_INFO['P'].desc}`
    : `利益優先ノードにはポイントがなく、全ポイントを倫理的価値観に配分している`

  return `あなたはプログラマーです。以下の倫理マップのポイント配分に基づいて、自分の価値観を表現した倫理綱領を日本語200字程度で書いてください。「私は〜」という一人称で書き、実際の行動や姿勢を具体的に表現してください。

【ポイント配分】
${hasP ? `利益優先ノード: ポイントあり（${NODE_INFO['P'].desc}）` : `利益優先ノード: ポイントなし（利益より倫理を優先）`}
${activeNodes.length > 0 ? `倫理的価値観:\n${nodeLines}` : '倫理的価値観: なし（まだ配分していない）'}

【条件】
- 必ず「私は」で始めること
- 200字程度（150〜250字）
- 上記のポイント配分を正確に反映した内容にすること
- 自然な日本語で、箇条書きや見出しなしの連続した文章で書くこと
- 余計な説明やコメントなしで、倫理綱領テキストのみを出力すること`
}

async function callOllama(prompt) {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  })
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
  const data = await res.json()
  return data.response.trim()
}

async function main() {
  console.log('静的レスポンスの生成を開始します...')

  // Ollama 接続確認
  try {
    await fetch('http://localhost:11434/api/tags')
  } catch {
    console.error('エラー: Ollama に接続できません。http://localhost:11434 が起動していることを確認してください。')
    process.exit(1)
  }

  const patterns = generateAllPatterns()
  console.log(`生成するパターン数: ${patterns.length}`)

  const responses = {}
  for (let i = 0; i < patterns.length; i++) {
    const p = patterns[i]
    const key = buildKey(p)
    console.log(`[${i + 1}/${patterns.length}] ${key}`)
    try {
      responses[key] = await callOllama(buildPrompt(p))
    } catch (e) {
      console.error(`  失敗: ${e.message}`)
      responses[key] = ''
    }
  }

  const code = `// このファイルは scripts/generateStaticResponses.js によって自動生成されます
// 再生成: node scripts/generateStaticResponses.js

const FALLBACK_RESPONSES = ${JSON.stringify(responses, null, 2)}

// キー形式: P_N0_N1-1_N1-2_N1-3_N2-1_N2-2_N2-3_N2-4_N2-5_N2-6 (各ノードのポイントあり=1/なし=0)
export function buildFallbackKey(nodes) {
  const has = (id) => (nodes.find(n => n.id === id)?.points ?? 0) > 0 ? '1' : '0'
  return [
    has('P'), has('N0'),
    has('N1-1'), has('N1-2'), has('N1-3'),
    has('N2-1'), has('N2-2'),
    has('N2-3'), has('N2-4'),
    has('N2-5'), has('N2-6'),
  ].join('_')
}

export function getFallbackResponse(nodes) {
  const key = buildFallbackKey(nodes)
  return FALLBACK_RESPONSES[key] ?? null
}
`

  writeFileSync(OUTPUT_PATH, code, 'utf8')
  console.log(`\n完了: ${OUTPUT_PATH} に ${patterns.length} パターンを書き込みました`)
}

main().catch(e => { console.error(e); process.exit(1) })
