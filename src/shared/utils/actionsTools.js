const ActionsTools = {
  parse(actionText) {
    const actions = [];
    const chrs = Array.from(actionText);
    let buf = "";
    for (let i = 0; i < chrs.length; i += 1) {
      const c = chrs[i];
      if (c === "*") {
        if (buf.length > 0) {
          actions.push({ type: "text", text: buf });
          buf = "";
        }
        actions.push({ type: "any", text: "*" });
      } else if (c === "{" && chrs[i + 1] === "{") {
        if (buf.length > 0) {
          actions.push({ type: "text", text: buf });
          buf = "";
        }
        let j = i + 2;
        for (; j < chrs.length; j += 1) {
          if (chrs[j] === "}" && chrs[j + 1] === "}") {
            break;
          } else {
            buf += chrs[j];
          }
        }
        i = j + 1;
        // TODO syntax error checking
        actions.push({ type: "output_var", text: buf });
        buf = "";
      } else if (c === "<" && chrs[i + 1] === "<") {
        if (buf.length > 0) {
          actions.push({ type: "text", text: buf });
          buf = "";
        }
        let j = i + 2;
        for (; j < chrs.length; j += 1) {
          if (chrs[j] === ">" && chrs[j + 1] === ">") {
            break;
          } else {
            buf += chrs[j];
          }
        }
        i = j + 1;
        // TODO syntax error checking
        actions.push({ type: "variable", text: buf });
        buf = "";
      } else if (c === "<") {
        // HTML parsing, very simple doesn't accept inner tags
        let j = i + 1;
        let tagStart = false;
        let tagEnd = false;
        let tag = "";
        for (; j < chrs.length; j += 1) {
          if (chrs[j] === ">") {
            tagStart = true;
            break;
          } else if (chrs[j] === "/" && chrs[j + 1] === ">") {
            tagStart = true;
            tagEnd = true;
            j += 1;
            break;
          } else {
            tag += chrs[j];
          }
        }
        if (tagStart) {
          if (buf.length > 0) {
            actions.push({ type: "text", text: buf });
            buf = "";
          }
          if (tag === "br") {
            // Force tagEnd
            tagEnd = true;
          }
          // Search TagEnd
          let t = tag;
          let l = j;
          if (!tagEnd) {
            let k = j + 1;
            for (; k < chrs.length; k += 1) {
              if (chrs[k] === "<" && chrs[k + 1] === "/") {
                tagEnd = true;
                break;
              } else {
                buf += chrs[k];
              }
            }
            if (tagEnd) {
              l = k + 2;
              t = "";
              for (; l < chrs.length; l += 1) {
                if (chrs[l] === ">") {
                  break;
                } else {
                  t += chrs[l];
                }
              }
            }
          }
          // console.log("parse HTML", tag, t, buf, actionText.substring(l + 1));
          if (t === tag) {
            i = l;
            actions.push({ type: tag, text: buf });
            buf = "";
          } else {
            // console.log("actionTools.parse HTML Error");
          }
        } else {
          buf += c;
        }
      } else {
        buf += c;
      }
    }
    if (buf.length > 0) {
      actions.push({ type: "text", text: buf });
      buf = "";
    }
    return actions;
  },
};

export default ActionsTools;
