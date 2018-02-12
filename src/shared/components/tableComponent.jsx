import React from "react";
import PropTypes from "prop-types";
import { Icon } from "react-mdl";

const TableComponent = ({
  title, headers, items, selectedItem, onSelect, className, style,
}) => {
  const s = style || {};
  if (!s.width) {
    s.width = "100%";
  }
  s.borderSpacing = "0";
  return (
    <div>
      <div style={{ minHeight: "400px" }}>{title}
        <table className={className} style={s}>
          <thead>
            <tr
              style={{
                color: "rgba(0, 0, 0, 0.26)",
                fontSize: "13px",
                height: "56px",
                padding: "0 56px 0 0",
                verticalAlign: "middle",
                textAlign: "left",
              }}
            >
              {headers.map((h, index) => {
                const st = {
                  textAlign: "left",
                  paddingLeft: "24px",
                };
                const key = `h_${index}`;
                return (
                  <th key={key} style={st}>{h}</th>);
              })}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              let icon = "";
              if (item.icon) {
                let { color } = item;
                if (!color) {
                  color = "transparent";
                }
                const stl = {
                  backgroundColor: color,
                  padding: "8px",
                };
                if (item.icon.endsWith(".svg")) {
                  icon = (
                    <div style={stl}>
                      <img style={{}} src={item.icon} alt={item.name} />
                    </div>);
                } else if (item.icon.endsWith(".png")) {
                  icon = (
                    <div style={style}>
                      <img style={{ width: "40px" }} src={item.icon} alt={item.name} />
                    </div>);
                } else {
                  icon = <div style={style}><Icon style={{}} name={item.icon} /></div>;
                }
              }
              const { values } = item;
              let cn = "selectableListItem";
              if (selectedItem === index) {
                cn = "selectedListItem";
              }
              const st = {
                textAlign: "left",
                paddingLeft: "24px",
                height: "48px",
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
              };
              return (
                <tr
                  key={item.id}
                  onClick={(e) => { e.preventDefault(); onSelect(index); }}
                  className={cn}
                  style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "13px" }}
                >
                  <td style={{
                    width: "48px", verticalAlign: "middle", height: "48px", borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  >{icon}
                  </td>{values.map((value, i) => {
                    const k = `c_${i}`;
                    return (<td key={k} style={st}>{value}</td>);
                  })}
                </tr>);
            })}
          </tbody>
        </table>
      </div>
      <div style={{ width: "100%", height: "56px", borderTop: "1px solid rgba(0, 0, 0, 0.12)" }} />
    </div>
  );
};

TableComponent.defaultProps = {
  className: null,
  style: null,
};

TableComponent.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.element]).isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedItem: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TableComponent;
