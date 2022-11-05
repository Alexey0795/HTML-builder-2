const { join } = require('path');
const { copyDir, resetFolder } = require('..\\lib\\common.js');

async function main() {
  const flag = process.argv[2];
  if (flag === '-r') {
    resetFolder(join(__dirname, 'files-copy'));
    return;
  }

  const targetPath = join(__dirname, 'files-copy');
  await resetFolder(targetPath);

  const sourcePath = join(__dirname, 'files');
  await copyDir(sourcePath, targetPath);

  console.log(`Folder ${targetPath} has been copied.`);
}

main();