import React from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "react-mdl";
import HeaderIcon from "./headerIcon";

const SubToolbar = ({
  titleIcon,
  titleName,
  icons,
  menu,
}) => {
  const menuRender = () => {
    if (menu) {
      const id = `${titleName}-menu`;
      const align = menu.align ? menu.align : "left";
      const { items } = menu;
      return (
        <div>
          <IconButton name="more_vert" id={id} className="mrb-subheader-menu" />
          <Menu target={id} align={align}>
            {items.map((m, index) => {
              const key = `m_${index}`;
              if (m.disabled) {
                return (<MenuItem key={key} disabled>{m.name}</MenuItem>);
              }
              return (
                <MenuItem
                  key={key}
                  onClick={(e) => { e.preventDefault(); if (m.onSelect) m.onSelect(m.name); }}
                >
                  {m.name}
                </MenuItem>);
            })}
          </Menu>
        </div>);
    }
    return (<div />);
  };

  const iconsRender = () => {
    if (icons) {
      return (
        <div>
          {icons.map((icon, index) => {
            const key = `m_${index}`;
            return (
              <IconButton
                key={key}
                name={icon.name}
                onClick={(e) => {
                  e.preventDefault(); if (icon.onClick) icon.onClick();
                }}
              />
            );
          })}
        </div>);
    }
    return (<div />);
  };
  let headerIcon = null;
  let style = {};
  if (titleIcon) {
    headerIcon = <HeaderIcon name={titleIcon} />;
  } else {
    style = { marginLeft: "16px" };
  }
  return (
    <div className="mrb-panel-header">
      {headerIcon}
      <div style={style} className="mrb-panel-header-title">{titleName}</div>
      <div className="mrb-panel-header__actions">
        {iconsRender()}
        {menuRender()}
      </div>
    </div>
  );
};
SubToolbar.defaultProps = {
  titleIcon: null,
  icons: null,
  menu: null,
};

SubToolbar.propTypes = {
  titleName: PropTypes.oneOfType([
    PropTypes.string, PropTypes.element]).isRequired,
  titleIcon: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.shape({})),
  menu: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

export default SubToolbar;
