import React, { Component } from "react";
import PropTypes from "prop-types";
import { List } from "react-mdl";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ListDragItem from "./listDragItem";

@DragDropContext(HTML5Backend)
class ListDragComponent extends Component {
  render() {
    const {
      items, selectedItem, onSelect, onMove, onDrop, className,
    } = this.props;
    return (
      <List className={className}>
        {items.map((item, index) => {
          if (selectedItem === index) {
            return (
              <ListDragItem
                index={index}
                id={item.id}
                key={item.id}
                onMove={onMove}
                onDrop={onDrop}
                onClick={
                  (e) => { e.preventDefault(); onSelect(index); }}
                className="selectedListItem"
              >{item.name}
              </ListDragItem>);
          }
          return (
            <ListDragItem
              index={index}
              id={item.id}
              key={item.id}
              onMove={onMove}
              onDrop={onDrop}
              onClick={
                (e) => { e.preventDefault(); onSelect(index); }}
              className="selectableListItem"
            >{item.name}
            </ListDragItem>);
        })}
      </List>
    );
  }
}

ListDragComponent.defaultProps = {
  className: null,
  onMove: null,
  onDrop: null,
};

ListDragComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedItem: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  onMove: PropTypes.func,
  onDrop: PropTypes.func,
};

export default ListDragComponent;
