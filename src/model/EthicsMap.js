export class EthicsMap {
  constructor() {
    this.nodes = [
      { id: 'P',    parentId: null, points: 0 },
      { id: 'N0',   parentId: null, points: 0 },
      { id: 'N1-1', parentId: 'N0', points: 0 },
      { id: 'N1-2', parentId: 'N0', points: 0 },
      { id: 'N1-3', parentId: 'N0', points: 0 },
      { id: 'N2-1', parentId: 'N1-1', points: 0 },
      { id: 'N2-2', parentId: 'N1-1', points: 0 },
      { id: 'N2-3', parentId: 'N1-2', points: 0 },
      { id: 'N2-4', parentId: 'N1-2', points: 0 },
      { id: 'N2-5', parentId: 'N1-3', points: 0 },
      { id: 'N2-6', parentId: 'N1-3', points: 0 },
    ]
  }

  #node(id) {
    return this.nodes.find(n => n.id === id)
  }

  removePoint(nodeId) {
    const node = this.#node(nodeId)
    if (node.points === 0) return false
    const children = this.nodes.filter(n => n.parentId === nodeId)
    if (children.some(c => c.points >= node.points)) return false
    if (nodeId === 'P') {
      node.points--
      return true
    }
    node.points--
    this.#node('P').points++
    return true
  }

  addPoint(nodeId) {
    const node = this.#node(nodeId)
    if (nodeId === 'P') {
      node.points++
      return true
    }
    const p = this.#node('P')
    if (p.points === 0) return false
    if (node.parentId !== null) {
      const parent = this.#node(node.parentId)
      if (node.points >= parent.points) return false
    }
    node.points++
    p.points--
    return true
  }
}
