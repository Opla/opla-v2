import React from "react";
import PropTypes from "prop-types";
import { Grid, Cell } from "react-mdl";
import FileInput from "./fileInput";

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
  // backgroundColor: "white"
};

/* const templateSelectedBoxStyle = {
  height: "168px",
  backgroundColor: "#E0E0E0",
}; */

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
      let cn = "mdl-shadow--2dp selectableListItem";
      if (selectedItem === index) {
        cn = "mdl-shadow--2dp selectedListItem";
      }
      const i = `./images/robots/robot-${index}.svg`;
      let b = <img src={i} style={{ width: "40%", margin: "30px" }} alt={item.name} />;
      if (item.name === "Import") {
        b = <form style={{ width: "100%" }}><FileInput onLoad={onImport} accept={acceptImport} /></form>;
      }
      return (
        <Cell key={item.id} style={templateBoxStyle} className={cn} col={2}>
          <div
            onKeyUp={() => { }}
            role="presentation"
            style={anchorStyle}
            onClick={() => { /* e.preventDefault(); */ onSelect(index); }}
          >
            <div style={infoStyleC}><div style={cellStyle}>{item.name}</div>
              <div style={cellStyle}>{b}</div>
            </div>
          </div>
        </Cell>);
    })}
  </Grid>
);

TemplatesList.defaultProps = {
  onImport: null,
  acceptImport: null,
};

TemplatesList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedItem: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onImport: PropTypes.func,
  acceptImport: PropTypes.string,
};

export default TemplatesList;
