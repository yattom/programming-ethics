import { describe, it, expect } from 'vitest'
import { EthicsMap } from './EthicsMap.js'

describe('EthicsMap', () => {
  describe('ポイント操作', () => {
    it('N1ノードにポイントを割り振れる (上限は親N0のポイント)', () => {
      const map = new EthicsMap()
      for (let i = 0; i < 5; i++) map.addPoint('P')
      map.addPoint('N0')
      map.addPoint('N0')  // N0 = 2, P残 = 3

      map.addPoint('N1-1')
      map.addPoint('N1-1')
      expect(map.nodes.find(n => n.id === 'N1-1').points).toBe(2)

      // N0=2なので3点目は親の上限で割り振れない
      const result = map.addPoint('N1-1')
      expect(result).toBe(false)
      expect(map.nodes.find(n => n.id === 'N1-1').points).toBe(2)
    })

    it('N2ノードにポイントを割り振れる (上限は親N1のポイント)', () => {
      const map = new EthicsMap()
      for (let i = 0; i < 5; i++) map.addPoint('P')
      map.addPoint('N0')
      map.addPoint('N0')
      map.addPoint('N1-1')  // N1-1 = 1, P残 = 2

      map.addPoint('N2-1')
      expect(map.nodes.find(n => n.id === 'N2-1').points).toBe(1)

      // N1-1=1なので2点目は親の上限で割り振れない
      const result = map.addPoint('N2-1')
      expect(result).toBe(false)
      expect(map.nodes.find(n => n.id === 'N2-1').points).toBe(1)
    })

    it('ポイントを増やすとPのポイントが減り、減らすと戻る', () => {
      const map = new EthicsMap()
      for (let i = 0; i < 5; i++) map.addPoint('P')
      expect(map.nodes.find(n => n.id === 'P').points).toBe(5)

      map.addPoint('N0')
      map.addPoint('N0')
      expect(map.nodes.find(n => n.id === 'P').points).toBe(3)

      map.removePoint('N0')
      expect(map.nodes.find(n => n.id === 'P').points).toBe(4)
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(1)
    })

    it('Pのポイントが0のとき他のノードのポイントを増やせない', () => {
      const map = new EthicsMap()
      map.addPoint('P')
      map.addPoint('N0')
      expect(map.nodes.find(n => n.id === 'P').points).toBe(0)

      const result = map.addPoint('N0')
      expect(result).toBe(false)
    })

    it('子ノードのポイントを超える親の減少はできない', () => {
      const map = new EthicsMap()
      for (let i = 0; i < 5; i++) map.addPoint('P')
      map.addPoint('N0')
      map.addPoint('N0')  // N0 = 2
      map.addPoint('N1-1')  // N1-1 = 1

      // N0を1にするとN1-1=1=N0なので問題なし
      map.removePoint('N0')
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(1)

      // N0を0にするとN1-1=1>N0=0になるので失敗
      const result = map.removePoint('N0')
      expect(result).toBe(false)
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(1)
    })

    it('N0にポイントを割り振れる (上限はPのポイント)', () => {
      const map = new EthicsMap()
      map.addPoint('P')
      map.addPoint('P')
      map.addPoint('P')

      map.addPoint('N0')
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(1)

      map.addPoint('N0')
      map.addPoint('N0')
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(3)

      // Pのポイントが上限なので4点目は割り振れない
      const result = map.addPoint('N0')
      expect(result).toBe(false)
      expect(map.nodes.find(n => n.id === 'N0').points).toBe(3)
    })
  })

  describe('ノード構造', () => {
    it('全ノードが存在する', () => {
      const map = new EthicsMap()
      const nodeIds = map.nodes.map(n => n.id)
      expect(nodeIds).toContain('P')
      expect(nodeIds).toContain('N0')
      expect(nodeIds).toContain('N1-1')
      expect(nodeIds).toContain('N1-2')
      expect(nodeIds).toContain('N1-3')
      expect(nodeIds).toContain('N2-1')
      expect(nodeIds).toContain('N2-2')
      expect(nodeIds).toContain('N2-3')
      expect(nodeIds).toContain('N2-4')
      expect(nodeIds).toContain('N2-5')
      expect(nodeIds).toContain('N2-6')
    })

    it('進化ライン (親子関係) が正しく定義されている', () => {
      const map = new EthicsMap()
      const parentOf = (id) => map.nodes.find(n => n.id === id).parentId
      expect(parentOf('P')).toBeNull()
      expect(parentOf('N0')).toBeNull()  // N0は進化ラインの根、Pは予算ノードで別物
      expect(parentOf('N1-1')).toBe('N0')
      expect(parentOf('N1-2')).toBe('N0')
      expect(parentOf('N1-3')).toBe('N0')
      expect(parentOf('N2-1')).toBe('N1-1')
      expect(parentOf('N2-2')).toBe('N1-1')
      expect(parentOf('N2-3')).toBe('N1-2')
      expect(parentOf('N2-4')).toBe('N1-2')
      expect(parentOf('N2-5')).toBe('N1-3')
      expect(parentOf('N2-6')).toBe('N1-3')
    })
  })
})
