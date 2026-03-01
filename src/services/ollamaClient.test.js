import { describe, it, expect, vi, afterEach } from 'vitest'
import { checkConnection, generateEthicsCode } from './ollamaClient.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('checkConnection', () => {
  it('returns true when ollama responds with 200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const result = await checkConnection()
    expect(result).toBe(true)
    expect(fetch).toHaveBeenCalledWith('http://localhost:11434/api/tags')
  })

  it('returns false when ollama is not running', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection refused')))
    const result = await checkConnection()
    expect(result).toBe(false)
  })

  it('returns false when ollama responds with error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await checkConnection()
    expect(result).toBe(false)
  })
})

describe('generateEthicsCode', () => {
  it('calls onChunk for each streamed response part', async () => {
    const lines = [
      JSON.stringify({ response: 'プログラマーとして、', done: false }),
      JSON.stringify({ response: '安全を最優先します。', done: true }),
    ].join('\n') + '\n'

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(lines))
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, body: mockStream }))

    const chunks = []
    const nodes = [
      { id: 'P', title: '利益優先', points: 10 },
      { id: 'N1-1', title: '安全性', points: 3 },
    ]
    await generateEthicsCode(nodes, (chunk) => chunks.push(chunk))

    expect(chunks).toEqual(['プログラマーとして、', '安全を最優先します。'])
  })

  it('stops reading when done flag is true', async () => {
    const lines = [
      JSON.stringify({ response: '最初のチャンク', done: true }),
      JSON.stringify({ response: '無視されるチャンク', done: false }),
    ].join('\n') + '\n'

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(lines))
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, body: mockStream }))

    const chunks = []
    await generateEthicsCode([], (chunk) => chunks.push(chunk))

    expect(chunks).toEqual(['最初のチャンク'])
  })
})
