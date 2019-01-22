/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { Cell, Icon } from "zrmc";
import FileInput from "zoapp-front/dist/components/fileInput";
import { robotsColors } from "../utils/robotsColors";

const AssistantCard = ({
  item,
  index,
  onSelect,
  acceptImport,
  onImport,
  selectedIndex,
}) => {
  const className =
    selectedIndex === index ? "selectedListItem" : "selectableListItem";

  const moduledIndex = index % robotsColors.length;

  let icon;
  if (item.icon) {
    icon = <Icon className="opla_assistant_card-img">{item.icon}</Icon>;
  } else if (index > -1) {
    icon = (
      <img
        src={`./images/robots/robot-${moduledIndex}.svg`}
        className="opla_assistant_card-img"
        alt={item.name}
      />
    );
  }

  let color;
  if (index > -1) {
    color = robotsColors[moduledIndex].mainColor;
  }

  return (
    <Cell
      className="opla_assistant_card-box"
      spanDevice={{ desktop: 3, tablet: 4, phone: 6 }}
      order={item.name === "Empty" ? 1 : 2}
    >
      <div
        role="presentation"
        style={{ width: "100%" }}
        onClick={() => {
          if (onSelect) {
            onSelect(index, item.name);
          }
        }}
      >
        <div className={`opla_assistant_card-container ${className}`}>
          <div className="opla_assistant_card-imgContainer">
            {item.name === "Import" ? (
              <form>
                <FileInput onLoad={onImport} accept={acceptImport} />
              </form>
            ) : (
              <div
                className="opla_assistant_card-background"
                style={{ backgroundColor: color }}
              >
                <div className="opla_assistant_card-imgMask">{icon}</div>
              </div>
            )}
          </div>
          <div className="opla_assistant_card-text">
            <b>{item.name}</b>
          </div>
        </div>
      </div>
    </Cell>
  );
};

AssistantCard.defautProps = {
  index: -1,
};

AssistantCard.propTypes = {
  item: PropTypes.shape({}).isRequired,
  index: PropTypes.number,
  selectedIndex: PropTypes.number,
  onSelect: PropTypes.func,
  acceptImport: PropTypes.string,
  onImport: PropTypes.func,
};

export default AssistantCard;
