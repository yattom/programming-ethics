# ADR-0001: Vue 3 Composition API を採用する

## ステータス

採用

## 背景

Vue 3 では Options API と Composition API の2つのスタイルが使える。

## 決定

Composition API を採用する。

## 理由

- Vue 3 の推奨スタイルであり、公式ドキュメントでも主に紹介されている
- ロジックの再利用 (Composables) がしやすい
- TypeScript との親和性が高い (将来の移行を考慮)

## 影響

すべての Vue コンポーネントは `<script setup>` 構文を使って記述する。
