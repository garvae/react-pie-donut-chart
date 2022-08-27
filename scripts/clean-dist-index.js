const fs = require('fs');
const { resolve } = require('path');

const commentMicrosoftRegExp = /^\/\*{5}[\S\s]+Microsoft[\S\s]+\*\s\*\/$/gm;

try {
  const dist = resolve(__dirname, '../', 'dist/index.js');
  const raw = fs.readFileSync(dist);
  const rawStr = raw.toString();
  const newData = rawStr.replaceAll(commentMicrosoftRegExp, '');

  if (fs.existsSync(dist)) {
    fs.unlinkSync(dist);
  }

  fs.writeFileSync(dist,newData);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('clean-dist-index.js error: ', err);
}
