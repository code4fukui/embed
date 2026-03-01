import { getEmbed } from "./getEmbed.js";

const s = "あいうえ";
const res = await getEmbed(s);
console.log(res, res.length);
