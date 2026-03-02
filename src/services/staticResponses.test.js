import { describe, test, expect } from 'vitest'
import { buildFallbackKey, getFallbackResponse } from './staticResponses.js'

describe('getFallbackResponse', () => {
  function makeNodes({ P = 0, N0 = 0, N11 = 0, N12 = 0, N13 = 0, N21 = 0, N22 = 0, N23 = 0, N24 = 0, N25 = 0, N26 = 0 } = {}) {
    return [
      { id: 'P', points: P }, { id: 'N0', points: N0 },
      { id: 'N1-1', points: N11 }, { id: 'N1-2', points: N12 }, { id: 'N1-3', points: N13 },
      { id: 'N2-1', points: N21 }, { id: 'N2-2', points: N22 },
      { id: 'N2-3', points: N23 }, { id: 'N2-4', points: N24 },
      { id: 'N2-5', points: N25 }, { id: 'N2-6', points: N26 },
    ]
  }

  test('全ノード0ポイント (配布前) のとき null を返す', () => {
    expect(getFallbackResponse(makeNodes())).toBeNull()
  })

  test.each([
    // P=0（全配分）、N2なし
    { P: 0, N0: 10, N11: 0, N12: 0, N13: 0 },
    { P: 0, N0: 5,  N11: 3, N12: 0, N13: 0 },
    { P: 0, N0: 4,  N11: 2, N12: 1, N13: 1 },
    // P=0、N2あり
    { P: 0, N0: 5, N11: 3, N12: 0, N13: 0, N21: 2 },
    { P: 0, N0: 5, N11: 3, N12: 0, N13: 0, N22: 2 },
    { P: 0, N0: 5, N11: 3, N12: 0, N13: 0, N21: 1, N22: 1 },
    // P=1（Pにポイント残る）
    { P: 10, N0: 0, N11: 0, N12: 0, N13: 0 },
    { P: 8,  N0: 2, N11: 0, N12: 0, N13: 0 },
    { P: 2,  N0: 3, N11: 2, N12: 1, N13: 1 },
    // P=1、N2あり
    { P: 4, N0: 3, N11: 2, N12: 0, N13: 0, N21: 1 },
    { P: 4, N0: 3, N11: 2, N12: 0, N13: 0, N21: 1, N22: 1 },
    { P: 2, N0: 3, N11: 2, N12: 1, N13: 1, N21: 1, N23: 1, N25: 1 },
  ])('key=$P,$N0,$N11,$N12,$N13,$N21,$N22,$N23,$N24,$N25,$N26 のときテキストを返す', (pts) => {
    const result = getFallbackResponse(makeNodes(pts))
    expect(result).toBeTypeOf('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('buildFallbackKey', () => {
  test('全ノード0ポイントのとき "0_0_0_0_0_0_0_0_0_0_0" を返す', () => {
    const nodes = [
      { id: 'P', points: 0 }, { id: 'N0', points: 0 },
      { id: 'N1-1', points: 0 }, { id: 'N1-2', points: 0 }, { id: 'N1-3', points: 0 },
      { id: 'N2-1', points: 0 }, { id: 'N2-2', points: 0 },
      { id: 'N2-3', points: 0 }, { id: 'N2-4', points: 0 },
      { id: 'N2-5', points: 0 }, { id: 'N2-6', points: 0 },
    ]
    expect(buildFallbackKey(nodes)).toBe('0_0_0_0_0_0_0_0_0_0_0')
  })

  test('P のみポイントあり "1_0_0_0_0_0_0_0_0_0_0" を返す', () => {
    const nodes = [
      { id: 'P', points: 10 }, { id: 'N0', points: 0 },
      { id: 'N1-1', points: 0 }, { id: 'N1-2', points: 0 }, { id: 'N1-3', points: 0 },
      { id: 'N2-1', points: 0 }, { id: 'N2-2', points: 0 },
      { id: 'N2-3', points: 0 }, { id: 'N2-4', points: 0 },
      { id: 'N2-5', points: 0 }, { id: 'N2-6', points: 0 },
    ]
    expect(buildFallbackKey(nodes)).toBe('1_0_0_0_0_0_0_0_0_0_0')
  })

  test('P=0, N0 のみポイントあり "0_1_0_0_0_0_0_0_0_0_0" を返す', () => {
    const nodes = [
      { id: 'P', points: 0 }, { id: 'N0', points: 10 },
      { id: 'N1-1', points: 0 }, { id: 'N1-2', points: 0 }, { id: 'N1-3', points: 0 },
      { id: 'N2-1', points: 0 }, { id: 'N2-2', points: 0 },
      { id: 'N2-3', points: 0 }, { id: 'N2-4', points: 0 },
      { id: 'N2-5', points: 0 }, { id: 'N2-6', points: 0 },
    ]
    expect(buildFallbackKey(nodes)).toBe('0_1_0_0_0_0_0_0_0_0_0')
  })

  test('各 N1・N2 の有無を正しく反映する', () => {
    const nodes = [
      { id: 'P', points: 1 }, { id: 'N0', points: 5 },
      { id: 'N1-1', points: 3 }, { id: 'N1-2', points: 0 }, { id: 'N1-3', points: 1 },
      { id: 'N2-1', points: 2 }, { id: 'N2-2', points: 0 },
      { id: 'N2-3', points: 0 }, { id: 'N2-4', points: 0 },
      { id: 'N2-5', points: 0 }, { id: 'N2-6', points: 1 },
    ]
    expect(buildFallbackKey(nodes)).toBe('1_1_1_0_1_1_0_0_0_0_1')
  })
})
