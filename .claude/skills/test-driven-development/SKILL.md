---
name: test-driven-development
description: Write product code and test code simultaneously to write conscise and simple code.
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

# Workflow

あなたはプログラミングをするとき、Kent BeckのTest-Driven Development (TDD) を進めます。TDDでは以下の進め方を守ります。
またユーザーが指示したときは、ユーザーとのペアプログラミングで進めます。

1. ゴールに到達するための一歩ずつをテストリストにする。テストリストはdocs/plan.mdに記載する
2. docs/plan.mdのTODOを整理しながら、次のステップを1つ選ぶ
3. ステップを失敗するテストコードで表現する。このテストコードは、必ず実行すると失敗するように書く
    - ペアプロ時: ユーザーの確認を待つ
4. テストを成功させる最小限のプロダクトコードを書く。テストが成功するためのことだけを書き、他の必要なコードがあっても書かない
    - ペアプロ時: ユーザーの確認を待つ
5. テストが成功したら、リファクタリングをする
    - ペアプロ時: ユーザー主導でリファクタリングする
6. ステップを達成したら、plan.mdのテストリストを更新する。完了したステップをマークし、作業中に発見した新たな項目をテストリストに追加する
7. 2.に戻って次のステップを進める。テストリストがすべて完了になるまで続ける

# Tests

- Write unit tests for TDD.
- Avoid using mocks as much as possible.
- Readability is more important in test code so avoid dependencies and over reuse and make every single test cases easy to understand just by themselves.
- Order test files and test cases so that the organized tests represents the structure of the specification.
- Make sure that unit tests does not use actual external resources like DynamoDB and also does not use mocks.  The very interface with external resources should not be tested in unit tests.  When we want to test logic we wrote, refactor them out into a separate method/function/class/module and then write unit test for them.


# Refactoring

- Names are very important.  Look for a name which express exactly what it is.  If you cannot find a good name, think about refactoring options to find a simple and obvious consept.
- Use names represent users' vocabulary and concept rather than technical elements.
- Prefer shorter methods over well-commented long one.
- Test code also should be refactored.

# Code

- Strive for simplicity.  Always write minimum code satifies the current step.
- Choose next steps which reveals unproved assumptions or unknown cases.  Easy steps can wait.
- Consider code as a proof that related tests are valuable.
