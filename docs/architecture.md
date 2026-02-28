# アーキテクチャ設計書

## 概要

プログラマーの倫理アプリは、Vue.js で構築された静的 Web アプリケーション。バックエンドは持たず、ユーザーのブラウザのみで動作する。

## 技術スタック

| 項目 | 選択 |
|------|------|
| UI フレームワーク | Vue 3 (Composition API) |
| ビルドツール | Vite |
| パッケージマネージャ | pnpm |
| Node バージョン | v22 |
| ユニットテスト | vitest |
| E2E テスト | playwright |
| (オプション) AI | ollama (ローカル LLM) |

## モジュール構成

```
src/
  model/
    EthicsMap.js        # マップのロジック (ノード構造、ポイント割り振りルール)
  components/
    EthicsMapView.vue   # マップ全体の描画 (同心円、ノード配置)
    NodeView.vue        # 個々のノードの描画とインタラクション
    NodeDescription.vue # 選択中ノードの説明表示
    PNodeView.vue       # Pノードの描画
    PointControls.vue   # ポイント配布開始、リセット、Pノード追加ボタン
  App.vue               # ルートコンポーネント
  main.js
```

## レイヤー構成

```
[View Layer]
  EthicsMapView.vue, NodeView.vue, PNodeView.vue, NodeDescription.vue, PointControls.vue
    ↕ (Vue リアクティブ)
[Application State]
  App.vue (EthicsMap モデルを保持し、子コンポーネントへ渡す)
    ↕ (メソッド呼び出し)
[Model Layer]
  EthicsMap.js (純粋な JS クラス / ロジック)
```

## モデル (EthicsMap) の責務

- ノード定義 (P, N0, N1-1〜N1-3, N2-1〜N2-6) の保持
- 親子関係 (進化ライン) の定義
- ポイント割り振りルールの実装
  - 上限: 親ノードのポイント以下
  - 総量: Pノードのポイントを消費
- ポイントを増減するメソッド
- バリデーション (増減が不可能な場合の判定)

## AI 連携 (オプション)

- ollama の REST API をブラウザから直接呼び出す
- ユーザーのポイント配分を入力として倫理綱領テキストを生成
- AI が利用不可の場合は UI 上で非表示 or 無効化

## URL 共有

- マップの状態 (ユーザー名 + 全ノードのポイント) を URL クエリパラメータに encode する
- バックエンドなしで共有・復元が可能
