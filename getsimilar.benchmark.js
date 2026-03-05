import { Embed } from "./Embed.js";

const embed = await Embed.create("./data.csv");

const q = "文字列の引き算";
const t0 = performance.now();
const top = await embed.getSimilar(q);
console.log(performance.now() - t0);
console.log(top);
