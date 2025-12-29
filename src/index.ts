import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import TextToSVG from "text-to-svg";

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_PATH = path.join(__dirname, "templates");
const TEXT_PROPERTIES_PATH = path.join(
  __dirname,
  "templates",
  "textProperties.json"
);

const OUTPUT_PATH =
  os.platform() === "darwin"
    ? path.join(os.homedir(), process.env.MACOS_OUTPUT_PATH || "")
    : path.join(os.homedir(), process.env.LINUX_OUTPUT_PATH || "");

function getDateString() {
  // Get Date in format - dd.mm.yyyy
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day.toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.${year}`;

  return formattedDate;
}

async function main() {
  // Read from templates folder
  const templates = await readdir(TEMPLATES_PATH);

  const textProperties: any[] = JSON.parse(
    await readFile(TEXT_PROPERTIES_PATH, "utf-8")
  );

  // For each template, generate a new image with the current date
  for (const template of templates) {
    if (!template.endsWith(".png")) {
      continue;
    }

    const templatePath = path.join(TEMPLATES_PATH, template);
    const templateData = await readFile(templatePath);

    // Load with font
    const textToSVG = TextToSVG.loadSync(
      __dirname + "/fonts/LoveYaLikeASister-Regular.ttf"
    );

    // Get text properties
    const textProperty = textProperties.find(
      (textProperty) => textProperty.name === template
    );

    const text = getDateString();

    const svgLeft = textToSVG.getSVG(text, {
      fontSize: textProperty.fontSize,
      anchor: textProperty.anchor,
      attributes: {
        fill: textProperty.attributes.fill,
      },
    });

    const svgRight = textToSVG.getSVG(text, {
      fontSize: textProperty.fontSize,
      anchor: textProperty.anchor,
      attributes: {
        fill: textProperty.attributes.fill,
      },
    });

    const image = sharp(templateData).composite([
      {
        input: Buffer.from(svgLeft),
        top: textProperty.positions[0].top,
        left: textProperty.positions[0].left,
      },
      {
        input: Buffer.from(svgRight),
        top: textProperty.positions[1].top,
        left: textProperty.positions[1].left,
      },
    ]);

    const outputPath = path.join(OUTPUT_PATH, `${template}`);

    await image.toFile(outputPath);
  }
}

main();
