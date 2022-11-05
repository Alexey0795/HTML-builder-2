const { join, extname } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { rm, mkdir, readdir } = require('fs/promises');

async function copyDir(sourcePath, targetPath) {
  await mkdir(targetPath, { recursive: true });
  console.log(`folder was created ${targetPath}`);
  try {
    const elements = await readdir(sourcePath, { withFileTypes: true });
    for (const dirent of elements) {
      const oldPath = join(sourcePath, dirent.name);
      const newPath = join(targetPath, dirent.name);
      if (dirent.isFile()) {
        copyTheFile(oldPath, newPath,
          err => err ? console.error(err) : console.log(`file been copied ${dirent.name}`));
        console.log(`file to copy ${dirent.name}`);
      } else if (dirent.isDirectory()) {
        copyDir(oldPath, newPath);
        console.log(`folder to scan ${dirent.name}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function resetFolder(targetPath) {
  await rm(targetPath, { force: true, recursive: true });
  await mkdir(targetPath, { recursive: true });
  console.log(`folder been reset ${targetPath}`);
}

async function mergeStyles(sourceFolderPath, outputFilePath) {
  try {
    const elements = await readdir(sourceFolderPath, { withFileTypes: true });
    for (const dirent of elements) {
      if (!dirent.isFile()) continue;
      const ext = extname(dirent.name);
      if (ext != '.css') continue;

      const curFilePath = join(sourceFolderPath, dirent.name);
      const input = createReadStream(curFilePath);
      const output = createWriteStream(outputFilePath, { flags: 'a' });
      await input.pipe(output);
      output.on('finish', () => console.log(`been merged ${dirent.name}`));
    }
  } catch (err) {
    console.error(err);
  }
}

function copyTheFile(source, target, cb) {
  let cbCalled = false;

  let rs = createReadStream(source);
  let ws = createWriteStream(target);

  rs.on('error', err => done(err));
  ws.on('error', err => done(err));
  ws.on('close', () => done());
  rs.pipe(ws);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

module.exports = {
  copyDir: copyDir,
  resetFolder: resetFolder,
  mergeStyles: mergeStyles,
  copyTheFile: copyTheFile
};