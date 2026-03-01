# embed

embed (embedding) by ollama API with [ollama](https://ollama.com/) and [Deno](https://deno.com/).

## Setup

setup [ollama](https://ollama.com/download)

```sh
ollama run nomic-embed-text:latest
```

## Usage

1. make [data.txt](data.txt)

2. add embeding
```sh
deno --allow-read --allow-net --allow-import --allow-write addembed.js data.txt
```

3. getsimilar
```sh
deno --allow-read --allow-net --allow-import getsimilar.js Wirthとは？
```
