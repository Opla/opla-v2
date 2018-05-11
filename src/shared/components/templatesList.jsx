/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { Grid, Inner, Cell } from "zrmc";
import makeClassName from "classnames";
import FileInput from "zoapp-front/components/fileInput";
import { robotsColors } from "../utils/robotsColors";

const TemplatesList = ({
  items,
  selectedItem,
  onSelect,
  onImport,
  acceptImport,
}) => (
  <Grid>
    <Inner>
      {items.map((item, index) => {
        const key = item.id ? item.id : `${index}${item.name}`;
        const isSelectedItem = selectedItem === index;
        const className = makeClassName({
          selectableListItem: !isSelectedItem,
          selectedListItem: isSelectedItem,
        });

        return (
          <Cell
            key={key}
            className="opla_template-templateBox"
            spanDevice={{ desktop: 2, tablet: 4, phone: 6 }}
            order={item.name === "Empty" ? 1 : 2}
          >
            <div
              role="presentation"
              style={{ width: "100%" }}
              onClick={() => {
                onSelect(index);
              }}
            >
              <div className={`opla_template-infoC ${className}`}>
                <div className="opla_template-imgCell">
                  {item.name === "Import" ? (
                    <form>
                      <FileInput onLoad={onImport} accept={acceptImport} />
                    </form>
                  ) : (
                    <div
                      className="opla_template-backgroundCell"
                      style={{
                        backgroundColor:
                          robotsColors[`robot-${index}`].mainColor,
                      }}
                    >
                      <div className="opla_template-imgMask">
                        <img
                          src={`./images/robots/robot-${index}.svg`}
                          className="opla_template-img"
                          alt={item.name}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="opla_template-textCell">
                  <b>{item.name}</b>
                </div>
              </div>
            </div>
          </Cell>
        );
      })}
    </Inner>
  </Grid>
);

TemplatesList.defaultProps = {
  onImport: null,
  acceptImport: null,
};

TemplatesList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  selectedItem: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onImport: PropTypes.func,
  acceptImport: PropTypes.string,
};

export default TemplatesList;
