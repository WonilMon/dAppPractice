# 🧾 プロジェクト概要 - DeFiステーキングDApp（投票 + KYC + 自動報酬付き）

---

## 🔨 プロジェクト名

**Decentralized Bank**（分散型ステーキングプラットフォーム）

## 🎯 目的

ユーザーがUSDTを預けて報酬（RWD）を得ると同時に、ガバナンス投票やKYC認証の流れも体験できる、DeFiの一連の要素を統合したDAppを開発。

* **開発期間：** 約2週間
* **想定ユーザー：** ブロックチェーン業界への転職を目指す開発者、自主学習目的の個人開発者

---

## 🛠 使用技術 / ツール

| 区分         | ツール / 技術            | 説明                                  |
| ---------- | ------------------- | ----------------------------------- |
| スマートコントラクト | Solidity v0.5.0     | ERC-20トークン + ステーキング + 投票 + KYC機能を実装 |
| 開発フレームワーク  | Truffle v5.11.5     | コントラクトのビルド、デプロイ、テスト                 |
| フロントエンド    | React (CRA)         | Web3と連携したUI構築、状態管理                  |
| スタイリング     | TailwindCSS         | シンプルでレスポンシブなUI構成                    |
| 自動化        | Node.js + node-cron | 報酬自動配布処理をcronで実行（オフチェーン）            |
| 開発ネットワーク   | Ganache（ローカル）       | テスト用ブロックチェーン環境                      |
| ウォレット連携    | MetaMask            | トランザクション署名とアカウント接続                  |

---

## 🧩 機能一覧

### ✅ 1. ステーキング（USDT → RWD報酬）

* USDTを預けると、RWDトークンが報酬として付与
* approve → deposit → unstake の流れで操作
* フロントでリアルタイムに残高を反映

### ✅ 2. ガバナンス投票機能（Ballot）

* ユーザーは4つの提案から1つに投票可能（1人1回）
* winningName() で1位提案を表示

### ✅ 3. KYC認証フロー

* 50USDT以上の預け入れでフォームが表示
* 氏名・生年月日を入力し、管理者が承認 / 拒否
* ステータス：未申請 → 審査中 → 承認済み / 拒否

### ✅ 4. Airdrop演出（UX効果）

* 50USDT以上預けると20秒カウントダウン
* "🎁報酬到着！" 表示とCSSアニメーション発動

### ✅ 5. 自動報酬支払い（Node.js + cron）

* cron.js が1分ごとに issueTokens() を実行
* .envに必要情報（PRIVATE\_KEY等）を設定しローカル動作

---

## 🧪 テスト

* Truffle testによるユニットテスト実行（Mocha + Chai）
* ステーキング、KYC承認など一連の流れをカバー

---

## 📁 ディレクトリ構成

```bash
├── contracts
│   ├── Tether.sol
│   ├── RWD.sol
│   ├── DecentralBank.sol
│   ├── Ballot.sol
│   └── KYC.sol
├── migrations
│   └── 2_deploy_contracts.js
├── src/components
│   ├── App.js
│   ├── Main.js
│   ├── BallotView.js
│   ├── KYCView.js
│   └── Airdrop.js
├── reward-cron
│   ├── cron.js
│   └── abi/DecentralBank.json
```

---

## 🪄 学び・振り返り

### 👍 得られたこと

* Web3.jsとReactの統合構成の理解
* Node.jsによるスマートコントラクトの自動化
* approve → transferFrom → reward のDeFi基本フローを実装
* 保守性を意識したコンポーネント設計

### 👎 課題

* Solidityの古いバージョンのためOwnableを自作
* Airdropは演出のみ、本物の報酬ではない
* Ganacheローカル環境のみ、本番デプロイ未経験
* multisig機能はアイデアにとどまり、未実装

---

## 💬 最後に

このプロジェクトは、自らの手でDeFiの要素を総合的に学ぶことを目的にしました。
単なる成果物ではなく「なぜこの構成にしたのか」を語れる構造です。

今後はテストネット展開、マルチシグ対応、L2への拡張も検討しています。
