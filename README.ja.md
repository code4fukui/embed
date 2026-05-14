# embed

[ollama](https://ollama.com/)と[Deno](https://deno.com/)を使用した、シンプルでローカルファーストなテキスト類似度検索APIです。

このプロジェクトは、テキストファイルを検索可能なエンベディングデータベースに変換し、類似するエントリを検索するためのツールを提供します。

## 特徴

-   **ローカル & プライベート**: すべての処理はOllamaを通じてローカルマシン上で完結します。
-   **シンプルなCLI**: エンベディングの生成と検索を行うための使いやすいスクリプト。
-   **効率的**: `dotscores-simd`を使用した高速な類似度計算と、Base64URLによるコンパクトなベクトル保存。
-   **柔軟性**: Ollamaがサポートする任意のエンベディングモデルで動作します。

## セットアップ

1.  **依存関係のインストール**:
    -   [Deno](https://deno.com/)
    -   [Ollama](https://ollama.com/download)

2.  **エンベディングモデルの取得**:
    このプロジェクトではデフォルトで`nomic-embed-text`を使用します。Ollama CLIを使用して取得します:
    ```sh
    ollama run nomic-embed-text:latest
    ```
    Ollamaがバックグラウンドで実行されていることを確認してください。

## 使い方

### 1. データの準備

1行に1つのテキストを含む`data.txt`という名前のテキストファイルを作成します。

**`data.txt`の例:**
```txt
Wirthはヴィルトと発音します。
Wirthは、教育用構造化プログラミング言語「Pascal」の開発者であるニクラウス・ヴィルト氏に敬意を表し、その名を冠した2025年生まれの新しいプログラミング言語です。
ブラウザで動作する実行環境に、Wirth Playground [https://code4fukui.github.io/Wirth/) があります。
```

### 2. エンベディングの生成

`addembed.js`を実行してテキストファイルを処理します。このスクリプトはローカルのOllamaインスタンスと通信して各行のエンベディングを生成し、結果を`data.csv`に保存します。

```sh
deno run --allow-read --allow-net --allow-write addembed.js data.txt
```

これにより、`text`と`vec`（ベクトル）の列を持つ`data.csv`ファイルが作成されます。デフォルトでは、ベクトルはコンパクトなBase64URL形式で保存されます。

### 3. 類似するテキストの検索

`getsimilar.js`を使用して、新しく作成したデータベースを検索します。検索したい文字列を引数として渡します。

```sh
deno run --allow-read --allow-net getsimilar.js "What is Wirth?"
```

**出力:**
```json
[
  {
    "score": 0.731450617313385,
    "text": "Wirthは、教育用構造化プログラミング言語「Pascal」の開発者であるニクラウス・ヴィルト氏に敬意を表し、その名を冠した2025年生まれの新しいプログラミング言語です。"
  },
  {
    "score": 0.5888360142707825,
    "text": "Wirthはヴィルトと発音します。"
  },
  ...
]
```

## ライブラリとしての利用

`Embed`クラスを使用することで、コアとなる類似度検索ロジックを独自のDenoプロジェクトに組み込むことができます。

```javascript
// your_script.js
import { Embed } from "./Embed.js";

// エンベディングデータを読み込む
const embed = await Embed.create("./data.csv");

// クエリを定義し、最も類似する上位3つの結果を取得する
const query = "a new programming language";
const topResults = await embed.getSimilar(query, 3);

console.log(topResults);
```

## コアライブラリ

-   [dotscores-simd](https://github.com/code4fukui/dotscores-simd): SIMDを使用したドットスコア計算用の高性能ライブラリ。コアの類似度検索に使用されています。

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
