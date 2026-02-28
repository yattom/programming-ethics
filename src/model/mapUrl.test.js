import { describe, it, expect } from 'vitest'
import { encodeMapState, decodeMapState } from './mapUrl.js'

describe('mapUrl', () => {
  const sampleNodes = [
    { id: 'P', points: 8 },
    { id: 'N0', points: 2 },
    { id: 'N1-1', points: 1 },
    { id: 'N1-2', points: 0 },
    { id: 'N1-3', points: 0 },
    { id: 'N2-1', points: 0 },
    { id: 'N2-2', points: 0 },
    { id: 'N2-3', points: 0 },
    { id: 'N2-4', points: 0 },
    { id: 'N2-5', points: 0 },
    { id: 'N2-6', points: 0 },
  ]

  it('マップ状態をクエリ文字列にエンコードできる', () => {
    const qs = encodeMapState('やっとむ', sampleNodes)
    expect(qs).toContain('name=')
    expect(qs).toContain('pts=')
    expect(qs).toContain('p=')
  })

  it('クエリ文字列からマップ状態を復元できる', () => {
    const qs = encodeMapState('やっとむ', sampleNodes)
    const { name, pPoints, nodePoints } = decodeMapState(qs)
    expect(name).toBe('やっとむ')
    expect(pPoints).toBe(8)
    expect(nodePoints['N0']).toBe(2)
    expect(nodePoints['N1-1']).toBe(1)
    expect(nodePoints['N1-2']).toBe(0)
  })
})
