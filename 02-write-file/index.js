const { join } = require('path');
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');

let outputpath = join(__dirname, 'output.txt');
const wrst = createWriteStream(outputpath, { flags: 'a' });

const input = process.stdin;
const rdln = createInterface({ input, output: wrst });

console.log('это приветвие');
console.log('ожидаю ввода текста:');

rdln.on('line', (line) => {
  if (line.toString() == 'exit') { process.exit(); }
  wrst.write(line + '\n');
});

process.on('exit', () => process.stdout.write('это прощальное сообщение'));
process.on('SIGINT', process.exit);