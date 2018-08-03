/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListDragComponent, SubToolbar } from "zoapp-ui";

class Explorer extends Component {
  onDropItem = (dragIndex, dropIndex) => {
    const item = this.props.items[dragIndex];
    const itemId = item.id;

    this.props.onMoveItem(
      this.props.selectedBotId,
      itemId,
      dragIndex,
      dropIndex,
    );
  };

  onSelectItem = (selected) => {
    this.props.onSelectItem(this.props.selectedBotId, selected);
  };

  render() {
    const selected = this.props.selectedItemIndex;
    const { name, icon } = this.props;
    const items = [];
    if (this.props.items) {
      this.props.items.forEach((it) => {
        const { id } = it;
        const style = it.notSaved
          ? {
              marginRight: "4px",
              width: "8px",
              height: "8px",
              marginBottom: "2px",
            }
          : { display: "none", marginRight: "2px" };
        const marginLeft = it.notSaved ? "-14px" : "0px";
        const n = (
          <span
            style={{
              marginLeft,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span className="red_bar" style={style} />
            <span style={{ color: "#bbb" }}>{icon}</span>
            {it.name}
          </span>
        );
        items.push({ id, name: n });
      });
    }
    return (
      <div
        style={{
          backgroundColor: "rgb(252, 252, 252)",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <SubToolbar
          className=""
          style={{ backgroundColor: "rgb(252, 252, 252)", margin: "0" }}
          titleName={
            <div style={{ display: "flex", marginLeft: "-8px" }}>
              <div style={{ marginRight: "16px", fontSize: "24px" }}>
                {icon}
              </div>
              {name}
            </div>
          }
          menu={{
            items: this.props.menu,
          }}
        />
        <div className="list-box" style={{ margin: "0" }}>
          <ListDragComponent
            style={{ backgroundColor: "rgb(252, 252, 252)" }}
            className="list-content"
            items={items}
            selectedItem={selected}
            onSelect={this.onSelectItem}
            onDrop={this.onDropItem}
          />
        </div>
      </div>
    );
  }
}

Explorer.defaultProps = {
  menu: [],
  selectedItemIndex: 0,
  selectedBotId: null,
};

Explorer.propTypes = {
  selectedBotId: PropTypes.string,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape({})),
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedItemIndex: PropTypes.number,
  onMoveItem: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
};

export default Explorer;
