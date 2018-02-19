const FileManager = {
  download(data, filename, filetype, callback = null) {
    /* eslint-disable no-undef */
    const element = document.createElement("a");
    const file = new Blob([data], { type: filetype });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    element.click();
    if (callback) {
      callback();
    }
    /* eslint-enable no-undef */
  },

  upload(selectorFiles, callback) {
    const file = selectorFiles[0];
    // console.log("FileManager file=", file);
    /* eslint-disable no-undef */
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      if (callback) {
        let { type } = file;
        if (type !== "application/json" && type !== "text/csv") {
          if (file.name.indexOf(".json") > 0) {
            type = "application/json";
          } else if (file.name.indexOf(".csv") > 0) {
            type = "text/csv";
          } else if (file.name.indexOf(".txt") > 0) {
            type = "text/csv";
          }
        }
        callback(data, type);
      }
    };
    /* eslint-enable no-undef */
    reader.readAsText(file);
  },
};

export default FileManager;
