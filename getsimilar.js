import { Embed } from "./Embed.js";

const embed = await Embed.create("./data.csv");

const q = Deno.args[0];
const top = await embed.getSimilar(q);
console.log(top);
