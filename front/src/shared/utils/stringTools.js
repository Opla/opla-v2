/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
const StringTools = {
  htmlLink(text) {
    return (text || "").replace(
      /([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi,
      (match, space, url) => {
        let href = url;
        let txt = href;
        const s = href.indexOf("|");
        if (s > 0) {
          href = href.substring(0, s);
          txt = url.substring(s + 1);
        }
        if (!href.match("^https?://")) {
          href = `http://${href}`;
        }
        const h = href.toLowerCase();
        if (
          h.indexOf(".png") > 0 ||
          h.indexOf(".gif") > 0 ||
          h.indexOf(".jpg") > 0 ||
          h.indexOf(".jpeg") > 0
        ) {
          return `${space}<img src="${href}" alt="${txt}" />`;
        }
        return `${space}<a href="${href}" target="_blank" rel="noopener noreferrer">${txt}</a>`;
      },
    );
  },
};

export default StringTools;
