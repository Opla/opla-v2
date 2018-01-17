import React from "react";
import PropTypes from "prop-types";
import { Icon } from "react-mdl";

// Inspired from https://raw.githubusercontent.com/react-mdl/react-mdl/master/src/List/ListItemContent.js
const createIcon = (type, icon) => {
  if (typeof icon === "string") {
    return <Icon className={`mdl-list__item-${type}`} name={icon} />;
  }
  const { className } = icon.props;
  const classes = `mdl-list__item-${type} ${className}`;
  return React.cloneElement(icon, { className: classes });
};

const ListItemContentEx = (props) => {
  const {
    avatar, children, className, icon,
    subtitle, useBodyClass, ...otherProps
  } = props;

  const classes = `mdl-list__item-primary-content ${className}`;
  const subtitleClassName = useBodyClass ? "mdl-list__item-text-body" : "mdl-list__item-sub-title";

  let iconElement = null;
  if (icon) {
    iconElement = createIcon("icon", icon);
  } else if (avatar) {
    iconElement = createIcon("avatar", avatar);
  }

  return (
    <span className={classes} {...otherProps}>
      {iconElement}
      <span>{children}</span>
      {subtitle && <span className={subtitleClassName}>{subtitle}</span>}
    </span>
  );
};

ListItemContentEx.defaultProps = {
  avatar: null,
  children: null,
  className: "",
  icon: "default",
  subtitle: null,
  useBodyClass: false,
};

ListItemContentEx.propTypes = {
  avatar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  subtitle: PropTypes.node,
  useBodyClass: PropTypes.bool,
};

export default ListItemContentEx;
