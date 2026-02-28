export class EthicsMap {
  constructor() {
    this.nodes = [
      {
        id: 'P', parentId: null, points: 0,
        title: '利益優先',
        description: '個人、組織、あるいは顧客の利益がすべてに優先する。',
      },
      {
        id: 'N0', parentId: null, points: 0,
        title: '倫理的考慮',
        description: '個人、組織、あるいは顧客の利益に優先するものごとがある。',
      },
      {
        id: 'N1-1', parentId: 'N0', points: 0,
        title: 'Safety & Reliability',
        description: 'システムが誤作動せず、ユーザーのデータや資産を壊さないこと。',
      },
      {
        id: 'N1-2', parentId: 'N0', points: 0,
        title: 'Agency & Usability',
        description: 'ユーザーが迷わず、騙されず（ダークパターンなし）、自分の意思で操作できること。',
      },
      {
        id: 'N1-3', parentId: 'N0', points: 0,
        title: 'Privacy & Security',
        description: '預かったデータを漏らさない、盗み見ない。CIAの3要素（機密性・完全性・可用性）。',
      },
      {
        id: 'N2-1', parentId: 'N1-1', points: 0,
        title: 'Fairness',
        description: 'その「安全性」が、特定の属性の人だけでなく、全員に対してバグなく動作すること。バイアスの除去。',
      },
      {
        id: 'N2-2', parentId: 'N1-1', points: 0,
        title: 'Public Good',
        description: '社会全体や環境に対しても害を与えないこと。',
      },
      {
        id: 'N2-3', parentId: 'N1-2', points: 0,
        title: 'Inclusion & Accessibility',
        description: '障害を持つ人や高齢者など、多様な身体的条件を持つ人が操作権を行使できること。',
      },
      {
        id: 'N2-4', parentId: 'N1-2', points: 0,
        title: 'Human Rights',
        description: 'デジタル空間へのアクセスを権利として保障すること。',
      },
      {
        id: 'N2-5', parentId: 'N1-3', points: 0,
        title: 'Transparency & Explainability',
        description: 'データをどう使っているか正直に開示する。ブラックボックス化しない。',
      },
      {
        id: 'N2-6', parentId: 'N1-3', points: 0,
        title: 'Democracy & Rule of Law',
        description: '情報操作や監視によって、社会の意思決定プロセス（選挙など）を歪めないこと。',
      },
    ]
  }

  node(id) {
    return this.nodes.find(n => n.id === id)
  }

  removePoint(nodeId) {
    const node = this.node(nodeId)
    if (node.points === 0) return false
    const children = this.nodes.filter(n => n.parentId === nodeId)
    if (children.some(c => c.points >= node.points)) return false
    if (nodeId === 'P') {
      node.points--
      return true
    }
    node.points--
    this.node('P').points++
    return true
  }

  addPoint(nodeId) {
    const node = this.node(nodeId)
    if (nodeId === 'P') {
      node.points++
      return true
    }
    const p = this.node('P')
    if (p.points === 0) return false
    if (node.parentId !== null) {
      const parent = this.node(node.parentId)
      if (node.points >= parent.points) return false
    }
    node.points++
    p.points--
    return true
  }
}
