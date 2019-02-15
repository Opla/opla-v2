/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

import { Button } from "zrmc";

import StringTools from "../../utils/stringTools";

const parseElementsFromMessage = (message) => {
  const elements = [];
  let tag = false;
  let end = false;
  let buf = "";
  let element = {};
  Array.from(message).forEach((ch) => {
    if (ch === "<") {
      if (tag) {
        element.value = buf;
        buf = "";
      } else {
        if (buf.length > 0) {
          elements.push({ value: buf, type: "text" });
        }
        buf = "";
        tag = true;
        end = false;
        element = {};
      }
    } else if (ch === "/" && tag) {
      end = true;
    } else if (end && ch === ">") {
      // <tag /> or </tag>
      element.type = buf.trim();
      elements.push(element);
      element = {};
      tag = false;
      buf = "";
    } else if (tag && ch === ">") {
      element.type = buf.trim();
      buf = "";
    } else {
      buf += ch;
    }
  });
  if (buf.length > 0) {
    elements.push({ value: buf, type: "text" });
  }
  return elements;
};

const MessengerBoxMessageContent = (props) => {
  const { message } = props;
  const elements = parseElementsFromMessage(message.body);
  return (
    <span>
      {elements.map((el, i) => {
        if (el.type === "button") {
          return (
            <Button
              key={i}
              style={{ margin: " 0 8px" }}
              dense
              outlined
              onClick={(e) => {
                e.preventDefault();
                if (el.value) {
                  props.onSendMessage(el.value);
                }
              }}
            >
              {el.value}
            </Button>
          );
        } else if (el.type === "br") {
          return <br key={i} />;
        }
        const body = StringTools.htmlLink(el.value);
        if (body.indexOf("<a") >= 0 || body.indexOf("<img") >= 0) {
          return <span key={i} dangerouslySetInnerHTML={{ __html: body }} />;
        }
        return body;
      })}
    </span>
  );
};

MessengerBoxMessageContent.propTypes = {
  message: PropTypes.shape({}),
  onSendMessage: PropTypes.func.isRequired,
};

export default MessengerBoxMessageContent;
