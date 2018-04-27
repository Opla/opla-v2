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

const infoStyleC = {
  position: "relative",
  fontSize: "16px",
  fontWeight: "300",
  color: "#FFF",
  lineHeight: "1.6",
  height: "180px",
};

const templateBoxStyle = {
  position: "relative",
  height: "250px",
};

const anchorStyle = {
  textDecoration: "none",
  width: "100%",
};

const imgStyle = {
  position: "absolute",
  margin: "0",
  top: "50%",
  left: "50%",
  "-ms-transform": "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
  width: "80px",
};

const imgCellStyle = {
  textAlign: "center",
  width: "100%",
  height: "180px",
  "padding-top": "30px",
  "background-color": "#f5f5f5",
};

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
        const className = makeClassName("mdl-shadow--2dp", {
          selectableListItem: !isSelectedItem,
          selectedListItem: isSelectedItem,
        });

        return (
          <Cell
            key={key}
            style={templateBoxStyle}
            className={className}
            span={2}
          >
            <div
              role="presentation"
              style={anchorStyle}
              onClick={() => {
                onSelect(index);
              }}
            >
              <div style={infoStyleC}>
                <div style={imgCellStyle}>
                  {item.name === "Import" ? (
                    <form>
                      <FileInput
                        onLoad={onImport}
                        accept={acceptImport}
                        style={{ margin: "0px !important" }}
                      />
                    </form>
                  ) : (
                    <img
                      src={`./images/robots/robot-${index}.svg`}
                      style={imgStyle}
                      alt={item.name}
                    />
                  )}
                </div>
                <div style={{ padding: "16px", "background-color": "#455a64" }}>
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
