import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { normalizeVector } from "./normalizeVector.js";
import { DotScores } from "https://code4fukui.github.io/dotscores-simd/DotScores.js";
import { IEEE32 } from "https://code4fukui.github.io/IEEE754/IEEE32.js";
import { Base64URL } from "https://code4fukui.github.io/Base64URL/Base64URL.js";

const decode = (vec) => {
  if (vec.indexOf(",") >= 0) {
    return JSON.parse(`[${vec}]`);
  }
  return IEEE32.decode(Base64URL.decode(vec));
};

export class Embed {
  static async create(fncsv) {
    const entries = await CSV.fetchJSON(fncsv);
    if (!entries.length) throw new Error("no entries");
    const vec = entries.map(i => decode(i.vec));
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
    if (this.entries[0].text) {
      for (let i = 0; i < res.length; i++) {
        res[i].text = this.entries[res[i].idx].text;
        delete res[i].idx;
      }
    }
    return res;
  }
}
