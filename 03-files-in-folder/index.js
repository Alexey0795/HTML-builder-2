const { readdir, stat } = require('fs/promises');
const { join, parse, extname } = require('path');

async function main(folderPath) {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const dirent of files) {
      if (!dirent.isFile()) continue;

      const name = parse(dirent.name).name;
      let ext = extname(dirent.name);
      if (ext[0] === '.') { ext = ext.slice(1); }
      const stats = await stat(join(folderPath, dirent.name));
      console.log(`${name} - ${ext} - ${stats.size}`);
    }
  } catch (err) {
    console.error(err);
  }
}

main(join(__dirname, 'secret-folder'));