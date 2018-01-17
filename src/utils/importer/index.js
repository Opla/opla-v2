import CSVImporter from "./csv";

const Importer = {

  async import(rawData, options, botId, controller) {
    let result = null;
    let data = null;
    if (options) {
      if (options.deletePrevious) {
        await controller.removeAllIntents(botId);
      }
    }
    if (typeof rawData === "string") {
      let str = rawData.trim();
      logger.info("detect data");
      if (options.filetype === "application/json" || str.startsWith("{") || str.startsWith("[")) {
        str = rawData.replace(/\u00A0/, "");
        // logger.info("parse JSON", str);
        data = JSON.parse(str);
      } else if (options.filetype === "text/csv" || options.filetype === ".csv") {
        const array = CSVImporter.import(rawData);
        let intent = null;
        data = { intents: [] };
        array.forEach((item) => {
          if (item.name) {
            if ((!intent) || intent.name) {
              intent = { input: [], output: [] };
              data.intents.push(intent);
            }
            intent.name = item.name;
          }
          if (item.input) {
            intent.input.push(item.input);
          }
          if (item.output) {
            intent.output.push(item.output);
          }
          intent.topic = intent.topic;
          intent.previous = intent.previous; // TODO link
        });
      } else {
        // TODO handle other format
        data = {};
      }
    } else {
      data = rawData;
    }
    logger.info("data.intents", data);
    if (data.intents) {
      const intents = await controller.duplicateIntents(botId, data.intents);
      result = { intents };
    }
    return result;
  },


};

export default Importer;
