# TODOリスト

NOTICE: TODOリストはフラットな箇条書きで、着手順に上から並べること。新しい項目もフラットに、実施順になるよう途中に挿入する。セクションを分けたり階層化するのは禁止。

- [x] README.md作成
- [x] docs/spec.md作成
- [x] アーキテクチャ設計書を作成 (docs/architecture.md)
- [x] 必要に応じてADRを作成 (docs/adr/*.md)
- [x] UI設計書を作成 (docs/ui.md)
- [x] 機能一覧を作成 (docs/feature-list.md)
- [x] テスト方針ドキュメントを作成 (docs/test-design.md)
- [x] 必要なモジュールをインストール
- [x] 本TODOリストに項目を加えながら全体の実装計画を作る
- [ ] EthicsMap モデルを実装する (src/model/EthicsMap.js) + vitest ユニットテスト
- [ ] E2E テスト: UC001 トップページでマップが表示される (e2e/ethics-map.spec.js)
- [ ] EthicsMapView コンポーネントを実装する (同心円レイアウト、ノード配置)
- [ ] E2E テスト: UC002 ノード選択で説明が表示される
- [ ] NodeDescription コンポーネントを実装する (ノード説明の表示)
- [ ] E2E テスト: UC003 ポイントを配布してマップを作る
- [ ] PointControls コンポーネントを実装する (配布開始・追加・リセット)
- [ ] ノードへのポイント割り振り UI を実装する (トークン表示、クリック操作)
- [ ] ポイントに応じた色の濃淡表現を実装する
- [ ] E2E テスト: UC004 マップ状態を URL で保存・共有できる
- [ ] URL エンコード/デコードによるマップ保存・共有を実装する
