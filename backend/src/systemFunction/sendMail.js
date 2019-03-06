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
    };
    return this.service.sendMessage(mail);
  }

  getName() {
    return this.name;
  }
}
