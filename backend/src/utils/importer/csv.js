/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CSVImporter = {
  import(data, options = {}) {
    const lines = data.split(/\r\n|\n/);
    const separator = options.separator || ",";
    const headers = lines.shift().split(separator);
    const items = [];
    lines.forEach((line) => {
      let open = true;
      let buf = "";
      let i = 0;
      const item = {};
      /* eslint-disable no-restricted-syntax */
      for (const ch of line) {
        if (open && ch === separator) {
          const name = headers[i];
          if (buf.length > 0) {
            item[name] = buf;
            buf = "";
          }
          i += 1;
          // eslint-disable-next-line quotes
        } else if (ch === '"') {
          open = !open;
        } else {
          buf += ch;
        }
      }
      /* eslint-enable no-restricted-syntax */
      items.push(item);
    });
    return items;
  },
};

export default CSVImporter;
