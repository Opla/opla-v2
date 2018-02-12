import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemContent, ListItemAction, Button, IconButton } from "react-mdl";

const ServicesList = ({
  name,
  items,
  onSelect,
  addDisabled,
}) => (
  <div className="mrb-sublist">
    <div className="mrb-subheader">
      <Button
        raised
        colored
        className="mrb-subheader-right"
        disabled={!!addDisabled}
        onClick={(e) => { e.preventDefault(); if (onSelect) { onSelect({ name, state: "add" }); } }}
      >Add
      </Button>
      <h4>{name}</h4>
    </div>
    <List>{
      items.map((item, index) => {
        const icon = item.status === "start" ? "play_circle_filled" : "play_circle_outline";
        const color = item.status === "start" ? "service_start" : "service_stop";
        const key = `sl_${index}`;
        return (
          <ListItem
            key={key}
            className="selectableListItem"
            onClick={(e) => {
              e.preventDefault(); if (onSelect) {
                onSelect({
                  name, state: "select", index, item,
                });
              }
            }}
          >
            <ListItemContent icon={icon} className={color}>{item.name}</ListItemContent>
            <ListItemAction>
              <IconButton
                name="close"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelect) {
                    onSelect({ name, state: "delete", index });
                  }
                }}
              />
            </ListItemAction>
          </ListItem>
        );
      })
    }
    </List>
  </div>
);

ServicesList.defaultProps = {
  addDisabled: false,
};

ServicesList.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func.isRequired,
  addDisabled: PropTypes.bool,
};

export default ServicesList;
