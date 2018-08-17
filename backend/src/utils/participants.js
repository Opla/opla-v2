/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default (participants) => {
  const formatted = [];
  participants.forEach((p) => {
    if (p.type === "bot") {
      formatted.push(`bot_${p.name.toLowerCase()}_${p.id}`);
    } else {
      formatted.push(p.username);
    }
  });
  return formatted;
};
