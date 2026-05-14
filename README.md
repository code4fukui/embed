# embed

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple, local-first text similarity search API using [ollama](https://ollama.com/) and [Deno](https://deno.com/).

This project provides tools to convert a text file into a searchable embedding database and query it for similar entries.

## Features

-   **Local & Private**: All processing happens on your machine via Ollama.
-   **Simple CLI**: Easy-to-use scripts for generating embeddings and performing searches.
-   **Efficient**: Uses `dotscores-simd` for fast similarity calculations and Base64URL for compact vector storage.
-   **Flexible**: Works with any embedding model supported by Ollama.

## Setup

1.  **Install Dependencies**:
    -   [Deno](https://deno.com/)
    -   [Ollama](https://ollama.com/download)

2.  **Pull an Embedding Model**:
    This project defaults to `nomic-embed-text`. Pull it using the Ollama CLI:
    ```sh
    ollama run nomic-embed-text:latest
    ```
    Ensure Ollama is running in the background.

## Usage

### 1. Prepare Your Data

Create a text file named `data.txt` with one piece of text per line.

**Example `data.txt`:**
```txt
Wirthはヴィルトと発音します。
Wirthは、教育用構造化プログラミング言語「Pascal」の開発者であるニクラウス・ヴィルト氏に敬意を表し、その名を冠した2025年生まれの新しいプログラミング言語です。
ブラウザで動作する実行環境に、Wirth Playground [https://code4fukui.github.io/Wirth/) があります。
```

### 2. Generate Embeddings

Run `addembed.js` to process your text file. This script will contact your local Ollama instance to generate an embedding for each line and save the results to `data.csv`.

```sh
deno run --allow-read --allow-net --allow-write addembed.js data.txt
```

This creates a `data.csv` file with `text` and `vec` (vector) columns. By default, vectors are stored in a compact Base64URL format.

### 3. Find Similar Text

Use `getsimilar.js` to query your newly created database. Pass the query string as an argument.

```sh
deno run --allow-read --allow-net getsimilar.js "What is Wirth?"
```

**Output:**
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

## Using as a Library

You can integrate the core similarity search logic into your own Deno projects by using the `Embed` class.

```javascript
// your_script.js
import { Embed } from "./Embed.js";

// Load the embedding data
const embed = await Embed.create("./data.csv");

// Define a query and find the top 3 most similar results
const query = "a new programming language";
const topResults = await embed.getSimilar(query, 3);

console.log(topResults);
```

## Core Library

-   [dotscores-simd](https://github.com/code4fukui/dotscores-simd): A high-performance library for dot score calculation using SIMD, used for the core similarity search.

## License

MIT License — see [LICENSE](LICENSE).