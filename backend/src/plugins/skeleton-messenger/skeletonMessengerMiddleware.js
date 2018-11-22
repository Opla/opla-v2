/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line
export async function onDispatch(className, data) {
  logger.debug("[+] skeletonMessengerMiddleware onDispatch");
  logger.debug("  [-] className:", className);
  if (className === "sandbox") {
    if (data.action === "newMessages") {
      data.messages.forEach((message) => {
        logger.debug("  [-] from", message.from);
        logger.debug("  [-] ", message.body);
      });
    }
  }
}
