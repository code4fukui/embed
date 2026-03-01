import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a));
const cosine = (a, b) => dot(a, b) / (norm(a) * norm(b) + 1e-12);

const retrieveTopK = (qvec, entries, k = 8) => {
  const scored = entries.map(e => ({
    ...e,
    score: cosine(qvec, e.vec),
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, k);
};

export class Embed {
  static async create(fncsv) {
    const entries = await CSV.fetchJSON("./data.csv");
    entries.map(i => i.vec = JSON.parse(`[${i.vec}]`));
    return new Embed(entries);
  }
  constructor(entries) {
    if (!entries) throw new Error("no entries, use Embed.create()");
    this.entries = entries;
  }
  async getSimilar(s, topk = 6) {
    const qvec = await getEmbed(s);
    const top = retrieveTopK(qvec, this.entries, topk);
    top.forEach(i => delete i.vec);
    return top;
  }
}
