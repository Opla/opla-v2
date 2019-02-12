/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
// import React, { Component } from "react";
import { Button } from "zrmc";
import PropTypes from "prop-types";
import StringTools from "../../utils/stringTools";

const MessengerBoxMessageContent = (props) => {
  const { message } = props;
  let html = null;
  if (message.body && message.body.indexOf("<b") >= 0) {
    /* eslint-disable no-restricted-syntax */
    const elements = [];
    let tag = false;
    let end = false;
    let buf = "";
    let element = {};
    for (const ch of message.body) {
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
    }
    if (buf.length > 0) {
      elements.push({ value: buf, type: "text" });
    }
    html = (
      <span>
        {elements.map((el, i) => {
          // button and br
          // TODO link / img
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
          } else if (el.type === "a" || el.type === "img") {
            let href = el.value;
            let text = href;
            const s = href.indexOf("|");
            if (s > 0) {
              text = href.substring(s + 1);
              href = href.substring(0, s);
            }
            const h = href.toLowerCase();
            if (
              h.indexOf(".png") > 0 ||
              h.indexOf(".gif") > 0 ||
              h.indexOf(".jpg") > 0 ||
              h.indexOf(".jpeg") > 0
            ) {
              return <img key={i} src={href} alt={text} />;
            }
            return (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            );
          }
          const body = StringTools.htmlLink(el.value);
          if (body.indexOf("<a") >= 0 || body.indexOf("<img") >= 0) {
            return <span key={i} dangerouslySetInnerHTML={{ __html: body }} />;
          }
          return body;
        })}
      </span>
    );
    /* eslint-enable no-restricted-syntax */
  } else {
    html = StringTools.htmlLink(message.body);
    if (html.indexOf("<a") >= 0 || html.indexOf("<img") >= 0) {
      html = <span dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
  return html;
};

MessengerBoxMessageContent.propTypes = {
  message: PropTypes.shape({}),
  onSendMessage: PropTypes.func.isRequired,
};

export default MessengerBoxMessageContent;
