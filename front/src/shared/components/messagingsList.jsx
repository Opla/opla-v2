/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemMeta, Switch } from "zrmc";

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
    <List className="opla-messaging_list">
      {items.map((item, index) => {
        let imgSrc;
        let { icon } = item;
        if (icon) {
          if (icon.endsWith(".svg") || icon.endsWith(".png")) {
            imgSrc = icon;
            icon = null;
          }
        }

        return (
          <ListItem
            key={item.name}
            className="selectableListItem switchListItem"
            icon={icon}
            imgSrc={imgSrc}
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
  );
};

MessagingsList.propTypes = {
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MessagingsList;
