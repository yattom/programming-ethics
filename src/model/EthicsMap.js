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
        title: '安全性',
        description: 'システムが誤作動せず、ユーザーのデータや資産を壊さないこと。例: テスト不足でバグが発生し、顧客企業の決済データが消失する。',
      },
      {
        id: 'N1-2', parentId: 'N0', points: 0,
        title: 'ユーザー尊重',
        description: 'ユーザーが迷ったり間違えたりせず、自分の意思で操作できること。ユーザーを意図的に騙したりもしないこと (ダークパターンを避ける)。例: B2B向けSaaSで、意図的に解約画面を隠し、自動更新を強制するUI。',
      },
      {
        id: 'N1-3', parentId: 'N0', points: 0,
        title: 'データ保護',
        description: 'ユーザーから預かったデータを外部に漏らしたり、内部で盗み見たりしない。情報セキュリティの3要素 (CIA＝機密性・完全性・可用性) を守る。例: 顧客の個人情報を暗号化せずにデータベースに保存する。',
      },
      {
        id: 'N2-1', parentId: 'N1-1', points: 0,
        title: '公平',
        description: 'その「安全性」が、特定の属性の人だけでなく、全員に対してバグなく、偏りなく動作すること。バイアスの除去。例: AI採用システムが「女性」のスコアを一律下げる、顔認証が「特定の人種」だけ誤認識する。',
      },
      {
        id: 'N2-2', parentId: 'N1-1', points: 0,
        title: '公益',
        description: '社会全体や環境に対しても害を与えないこと。世界中のすべての人々、将来の世代のことまで考慮すること。例: ユーザーが他の人を攻撃できるような機能を提供してしまう、水資源や電力を無計画に地域から奪っているデータセンターを利用する。',
      },
      {
        id: 'N2-3', parentId: 'N1-2', points: 0,
        title: '多様性',
        description: '障害を持つ人や高齢者など、多様な身体的条件を持つ人が操作権を行使できること。アクセシビリティを提供する。例: スクリーンリーダーに非対応で、視覚障害のある従業員が利用できない社内経費精算システム。',
      },
      {
        id: 'N2-4', parentId: 'N1-2', points: 0,
        title: '基本的人権',
        description: 'デジタル空間へのアクセスを権利として保障すること。例: 行政のシステムが古いPCからのアクセスを切り捨てる、組織にとって都合の悪い情報サイトをブロックする内部ネットワーク。',
      },
      {
        id: 'N2-5', parentId: 'N1-3', points: 0,
        title: '透明性',
        description: 'データをどう使っているか正直に開示する。ブラックボックス化しない。例: 顧客のローン審査が否決された際、アルゴリズムのどの変数が影響したのか担当者すら説明できない与信システム。',
      },
      {
        id: 'N2-6', parentId: 'N1-3', points: 0,
        title: '民主主義',
        description: '情報操作や監視によって、社会の意思決定プロセスを歪めないこと。法を犯して不当な利益を得ないこと。例: 選挙を操作したり妨害したりする偽情報を作る・配付するソフトウェア、特許や著作権で保護された知識を権利者を無視して利用する。',
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
