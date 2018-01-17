import React, { Component, Children, cloneElement } from "react";
import PropTypes from "prop-types";
import { DragSource, DropTarget } from "react-dnd";
import { ListItemContent } from "react-mdl";

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const itemTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const dropIndex = props.index;
    console.log("WIP", `ListDragItem.drop ${dragIndex} / ${dropIndex}`);
    if (dragIndex !== dropIndex && props.onDrop) {
      props.onDrop(dragIndex, dropIndex);
    }
  },
  hover(props, monitor, component) {
    const item = monitor.getItem();
    const dragIndex = item.index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex || (!component) || (!component.ref)) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = component.ref.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    if (props.onMove) {
      if (props.onMove(dragIndex, hoverIndex)) {
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      }
    }
  },
};

@DropTarget("item", itemTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource("item", itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class ListDragItem extends Component {
  static defaultProps = {
    children: null,
    className: null,
    twoLine: false,
    threeLine: false,
    onMove: null,
    onDrop: null,
  };

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    twoLine: PropTypes.bool,
    threeLine: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onMove: PropTypes.func,
    onDrop: PropTypes.func,
  };

  render() {
    const {
      connectDragSource, connectDropTarget, className, twoLine, threeLine, ...otherProps
    } = this.props;
    delete otherProps.index;
    delete otherProps.onMove;
    delete otherProps.onDrop;
    delete otherProps.isDragging;

    /* const opacity = isDragging ? 0 : 1; */

    let classes = "mdl-list__item";
    if (twoLine && !threeLine) {
      classes += " mdl-list__item--two-line";
    } else if (!twoLine && threeLine) {
      classes += " mdl-list__item--two-line";
    }
    if (className) {
      classes += ` ${className}`;
    }

    const children = Children.map(otherProps.children, (child) => {
      if (typeof child === "string") {
        return <ListItemContent>{child}</ListItemContent>;
      }
      if (child.type === ListItemContent) {
        return cloneElement(child, {
          useBodyClass: !!threeLine,
        });
      }
      return child;
    });
    return connectDragSource(connectDropTarget((
      <li className={classes} {...otherProps} ref={(r) => { this.ref = r; }}>
        {children}
      </li>)));
  }
}
