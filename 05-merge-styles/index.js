const { join } = require('path');
const { rm } = require('fs/promises');
const { mergeStyles } = require('..\\lib\\common.js');

async function main() {
  const flag = process.argv[2];
  if (flag === '-r') {
    await rm(join(__dirname, 'project-dist', 'bundle.css'));
    return;
  }

  const sourceFolderPath = join(__dirname, 'styles');
  const outputFilePath = join(__dirname, 'project-dist', 'bundle.css');
  await mergeStyles(sourceFolderPath, outputFilePath);
  console.log(`${outputFilePath} has been merged.`);
}

main();