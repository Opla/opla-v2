export default class GetDate {
  constructor(controllers) {
    this.name = "getDate";
    this.description = "This function return the localized bot date";
    this.parameters = [];
    this.controllers = controllers;
  }

  async call(params, botId) {
    const bot = await this.controllers.getBot(botId);
    return new Date().toLocaleString(bot.language, {
      timeZone: bot.timezone,
    });
  }

  getName() {
    return this.name;
  }
}
