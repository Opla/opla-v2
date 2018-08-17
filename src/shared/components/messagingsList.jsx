/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemMeta, Icon, Switch } from "zrmc";

const MessagingsList = ({ name, items, onSelect }) => {
  const handleOnItemClick = (e, index, item) => {
    if (onSelect && e.target.className.indexOf("mdc-switch") < 0) {
      e.preventDefault();

      onSelect({
        name,
        state: "select",
        index,
        item,
      });
    }
  };

  const handleOnSwitchClick = (e, index, item) => {
    if (onSelect) {
      onSelect({
        name,
        state: "enable",
        index,
        item,
      });
    }
  };

  return (
    <div className="zui-sublist">
      <div className="zui-subheader">
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

          return (
            <ListItem
              key={item.name}
              className="selectableListItem switchListItem"
              style={{ height: "40px" }}
              avatar={icon}
              secondaryText="click to setup"
              onClick={(e) => handleOnItemClick(e, index, item)}
            >
              {item.name}

              <ListItemMeta>
                <Switch
                  id="unique-component-id"
                  checked={item.enabled}
                  onChange={(e) => handleOnSwitchClick(e, index, item)}
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
