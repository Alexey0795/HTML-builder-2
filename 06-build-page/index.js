const { join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { copyDir, resetFolder, mergeStyles } = require('..\\lib\\common.js');

async function main() {
  const flag = process.argv[2];
  if (flag === '-r') {
    await resetFolder(join(__dirname, 'project-dist'));
    return;
  }

  try {
    await resetFolder(join(__dirname, 'project-dist'));
    console.log('Result folder been reset.');

    const sourceStylesFolderPath = join(__dirname, 'styles');
    const outputFilePath = join(__dirname, 'project-dist', 'style.css');
    console.log('Styles start merging.');
    mergeStyles(sourceStylesFolderPath, outputFilePath,
      {
        sortingArr:
          ["header.css",
            "main.css",
            "footer.css"]
      });

    const sourceAssetsFolderPath = join(__dirname, 'assets');
    const outputAssetsFolderPath = join(__dirname, 'project-dist', 'assets');
    console.log('Assets start copying.');
    copyDir(sourceAssetsFolderPath, outputAssetsFolderPath);

    const theTemplateFilePath = join(__dirname, 'template.html');
    const outpuTempaltePath = join(__dirname, 'project-dist', 'index.html');
    console.log('Prepare for merging  html components.');

    const readableStream = createReadStream(theTemplateFilePath);
    const writeableStream = createWriteStream(outpuTempaltePath, { flags: 'a' });

    const tryInjectContent = async (name) => {
      name = name.replace('{{', '');
      name = name.replace('}}', '');
      const filePath = join(__dirname, 'components', `${name}.html`);
      const rs = createReadStream(filePath);
      await rs.pipe(writeableStream);
    };

    const useChunk = async (chunk) => {
      let flag;
      let isSearchForInnerSegment;

      let text = chunk.toString();

      let startindex = 0;
      let endindex;

      const processNextSegment = async () => {
        endindex = text.indexOf(isSearchForInnerSegment ? '}}' : '{{', startindex);
        if (endindex === -1) {
          endindex = text.length;
        }

        if (isSearchForInnerSegment) endindex += 2;
        let lookAtSegment = text.slice(startindex, endindex);
        startindex = endindex;

        if (isSearchForInnerSegment) {
          tryInjectContent(lookAtSegment);
          isSearchForInnerSegment = false;
        } else {
          writeableStream.write(lookAtSegment);
          isSearchForInnerSegment = true;
        }

        if (endindex >= text.length) {
          flag = true;
          return;
        }
      }

      while (!flag) {
        processNextSegment();
      }
    }

    for await (const chunk of readableStream) {
      useChunk(chunk);
    }

    writeableStream.on('finish', () => console.log(`html been injected.`));

  } catch (err) {
    console.error(err);
  }
}

main();