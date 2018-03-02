/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemMeta, Icon, Switch } from "zrmc";

const MessagingsList = (props) => {
  const { name, items, onSelect } = props;

  return (
    <div className="mrb-sublist">
      <div className="mrb-subheader">
        <h4>{name}</h4>
      </div>
      <List>
        {items.map((item, index) => {
          let icon = null;
          if (item.icon) {
            let { color } = item;
            if (!item.enabled) {
              color = "#ddd";
            } else if (!color) {
              color = "gray";
            }
            const style = {
              backgroundColor: color,
              color: "white",
              padding: "8px",
            };
            if (item.icon.endsWith(".svg")) {
              icon = (
                <div style={style}>
                  <img
                    style={{ verticalAlign: "top" }}
                    src={item.icon}
                    alt={item.name}
                  />
                </div>
              );
            } else {
              icon = (
                <div style={style}>
                  <Icon style={{ verticalAlign: "top" }} name={item.icon} />
                </div>
              );
            }
          }
          const key = `li_${index}`;
          return (
            <ListItem
              key={key}
              className="selectableListItem switchListItem"
              style={{ height: "40px" }}
              avatar={icon}
              secondaryText="click to setup"
              onClick={(e) => {
                // console.log("e.target", e.target.className);
                if (onSelect && e.target.className.indexOf("mdl-switch") < 0) {
                  e.preventDefault();
                  onSelect({
                    name,
                    state: "select",
                    index,
                    item,
                  });
                }
              }}
            >
              {item.name}
              <ListItemMeta>
                <Switch
                  checked={item.enabled}
                  onChange={(e) => {
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({
                        name,
                        state: "enable",
                        index,
                        item,
                      });
                    }
                  }}
                />
              </ListItemMeta>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

MessagingsList.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MessagingsList;
