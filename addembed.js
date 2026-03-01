import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const fn = Deno.args[0] || "./data.txt";
const data = (await Deno.readTextFile(fn)).split("\n");

const list = [];
for (const item of data) {
  if (!item) continue;
  const res = await getEmbed(item);
  console.log(item, res);
  list.push({ text: item, vec: res.join(",") });
  await Deno.writeTextFile("data.csv", CSV.stringify(list));
}
