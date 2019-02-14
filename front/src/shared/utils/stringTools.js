/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
const StringTools = {
  htmlLink(text) {
    return (text || "").replace(
      // the regex can capture link like [complexLabel](complexUrl) or simple url
      // https?:\/\/\S* capture simple url on http(s) and return to match argument
      // \[(.*?)\]\((.*?)\) capture markdown style link and return complexLabel & complexUrl argument
      /https?:\/\/\S*|\[(.*?)\]\((.*?)\)/gi,
      (match, complexLabel, complexUrl) => {
        let url = match;
        let label = url;
        if (complexLabel) {
          label = complexLabel;
          url = complexUrl;
        }
        if (url.match(/\.(jpg|jpeg|gif|png)$/gi)) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${url}" alt="${label}" /></a>`;
        }
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      },
    );
  },
};

export default StringTools;
