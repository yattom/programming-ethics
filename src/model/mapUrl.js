const NODE_IDS = ['N0', 'N1-1', 'N1-2', 'N1-3', 'N2-1', 'N2-2', 'N2-3', 'N2-4', 'N2-5', 'N2-6']

export function encodeMapState(userName, nodes) {
  const points = NODE_IDS.map(id => nodes.find(n => n.id === id)?.points ?? 0).join(',')
  const pPoints = nodes.find(n => n.id === 'P')?.points ?? 0
  const params = new URLSearchParams({ name: userName, p: pPoints, pts: points })
  return params.toString()
}

export function decodeMapState(queryString) {
  const params = new URLSearchParams(queryString)
  const name = params.get('name') ?? ''
  const pPoints = parseInt(params.get('p') ?? '0', 10)
  const pts = (params.get('pts') ?? '').split(',').map(Number)
  const nodePoints = {}
  NODE_IDS.forEach((id, i) => { nodePoints[id] = pts[i] ?? 0 })
  return { name, pPoints, nodePoints }
}
