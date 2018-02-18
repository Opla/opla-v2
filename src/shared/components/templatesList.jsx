import React from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "zoapp-materialcomponents";
import makeClassName from "classnames";
import FileInput from "zoapp-front/components/fileInput";

const infoStyleC = {
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  lineHeight: "1.1",
  padding: "16px",
  height: "87%",
};

const templateBoxStyle = {
  height: "168px",
};

const anchorStyle = {
  textDecoration: "none",
  width: "100%",
};

const cellStyle = {
  display: "table-row",
  textAlign: "center",
  width: "100%",
};

const TemplatesList = ({
  items, selectedItem, onSelect, onImport, acceptImport,
}) => (
  <Grid>
    {items.map((item, index) => {
      const isSelectedItem = selectedItem === index;
      const className = makeClassName("mdl-shadow--2dp", {
        selectableListItem: !isSelectedItem,
        selectedListItem: isSelectedItem,
      });

      return (
        <Cell
          key={item.id}
          style={templateBoxStyle}
          className={className}
          col={2}
        >
          <div
            role="presentation"
            style={anchorStyle}
            onClick={() => { onSelect(index); }}
          >
            <div style={infoStyleC}>
              <div style={cellStyle}>
                {item.name}
              </div>
              <div style={cellStyle}>
                {item.name === "Import" ? (
                  <form style={{ width: "100%" }}>
                    <FileInput onLoad={onImport} accept={acceptImport} />
                  </form>
                ) : (
                  <img
                    src={`./images/robots/robot-${index}.svg`}
                    style={{ width: "40%", margin: "30px" }}
                    alt={item.name}
                  />
                )}
              </div>
            </div>
          </div>
        </Cell>
      );
    })}
  </Grid>
);

TemplatesList.defaultProps = {
  onImport: null,
  acceptImport: null,
};

TemplatesList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  selectedItem: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onImport: PropTypes.func,
  acceptImport: PropTypes.string,
};

export default TemplatesList;
