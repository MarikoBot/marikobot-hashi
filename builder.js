const { rmSync, mkdirSync} = require('fs');

/**
 * @param dir {string} The directory name to recreate.
 * @returns {*}
 */
const reset = (dir) => void [rmSync(`./${dir}`, { recursive: true }), mkdirSync(`./${dir}`)];
['lib', 'types'].forEach(reset);
