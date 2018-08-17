/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
const IntentsTools = {
  generateFirstIntentName() {
    return "First Intent";
  },

  generateFirstIntent() {
    return {
      name: this.generateFirstIntentName(),
      input: ["Hello"],
      output: ["The response"],
      notSaved: true,
    };
  },
};
export default IntentsTools;
