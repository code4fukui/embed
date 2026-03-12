import { getEmbed } from "./getEmbed.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { IEEE32 } from "https://code4fukui.github.io/IEEE754/IEEE32.js";
import { Base64URL } from "https://code4fukui.github.io/Base64URL/Base64URL.js";

const fn = Deno.args[0] || "./data.txt";
const data = (await Deno.readTextFile(fn)).split("\n");

const format = Deno.args[1] || "base64"; // "json";

const convert = (format, array) => {
  if (format == "json") {
    return array.join(",");
  } else if (format == "base64") {
    return Base64URL.encode(IEEE32.encode(array));
  } else {
    throw new Error("unknown format: " + format);
  }
};

const list = [];
for (const item of data) {
  if (!item) continue;
  const res = await getEmbed(item);
  console.log(item, res);
  list.push({ text: item, vec: convert(format, res) });
  await Deno.writeTextFile("data.csv", CSV.stringify(list));
}
