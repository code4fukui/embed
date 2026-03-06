import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { normalizeVector } from "./normalizeVector.js";
import { DotScores } from "https://code4fukui.github.io/dotscores-simd/DotScores.js";

export class Embed {
  static async create(fncsv) {
    const entries = await CSV.fetchJSON(fncsv);
    const vec = entries.map(i => JSON.parse(`[${i.vec}]`));
    const dots = await DotScores.create(vec);
    return new Embed(dots, entries);
  }
  constructor(dots, entries) {
    this.dots = dots;
    this.entries = entries;
  }
  async getSimilar(s, topk = 6) {
    const qvec = await getEmbed(s);
    normalizeVector(qvec);
    const res = this.dots.search(qvec, topk);
    for (let i = 0; i < res.length; i++) {
      res[i].text = this.entries[res[i].idx].text;
      delete res[i].idx;
    }
    return res;
  }
}
