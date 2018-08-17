/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const DrawerFooter = (props) => (
  <React.Fragment>
    <a
      href="https://github.com/Opla/community-edition/issues"
      target="_blank"
      rel="noreferrer noopener"
    >
      Report an issue
    </a>
    <br />
    <a href="https://gitter.im/Opla" target="_blank" rel="noreferrer noopener">
      Open community chat
    </a>
    <p>
      {props.name}
      <br />
      v{props.version}
    </p>
  </React.Fragment>
);

DrawerFooter.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    name: app.name,
    version: app.version,
  };
};

// prettier-ignore
export default connect(
  mapStateToProps,
  null,
)(DrawerFooter);
