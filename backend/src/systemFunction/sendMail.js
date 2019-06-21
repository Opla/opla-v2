/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default class SendMail {
  constructor(service) {
    this.service = service;
    this.name = "sendMail";
    this.description =
      "This function send mail to `sendTo` with `subject` and `message` passed in parameters";
    this.parameters = ["sendTo", "subject", "message"];
  }

  // Parameters get from OpenNLX
  // [ to, subject, message ]
  async call([to, subject, text] = []) {
    const mail = {
      to,
      subject,
      text,
      html: text,
    };
    return this.service.sendMessage(mail);
  }

  getName() {
    return this.name;
  }
}
