import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

const normalizeVector = (v) => {
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    s += v[i] * v[i];
  }
  const n = Math.sqrt(s)
  for (let i = 0; i < v.length; i++) {
    v[i] /= n;
  }
  return v;
};

const retrieveTopK = (qvec, entries, k = 8) => {
  const scored = entries.map(e => ({
    ...e,
    score: dot(qvec, e.vec),
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
    entries.forEach(i => normalizeVector(i.vec));
    this.entries = entries;
  }
  async getSimilar(s, topk = 6) {
    const qvec = await getEmbed(s);
    normalizeVector(qvec);
    const top = retrieveTopK(qvec, this.entries, topk);
    top.forEach(i => delete i.vec);
    return top;
  }
}
