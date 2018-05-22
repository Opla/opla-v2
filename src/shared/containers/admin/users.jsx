/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Inner, Cell, Button } from "zrmc";
import { connect } from "react-redux";
import { TableComponent } from "zoapp-ui";
import { infoStyleD } from "./styles";

class Users extends Component {
  render() {
    const items = [];
    const status = "you";
    const { user, profile } = this.props;

    const values = [];
    values.push(profile.username);
    values.push(profile.email);
    values.push(user.attributes.scope);
    values.push(status);

    items.push({ id: 1, values, icon: `../images/${profile.avatar}.png` });

    const headers = ["", "username", "email", "role", "status"];
    const title = (
      <div style={infoStyleD}>
        You could give an access to your collaborators here.
        <Button raised style={{ float: "right", marginBottom: "24px" }}>
          ADD
        </Button>
      </div>
    );

    return (
      <Grid>
        <Inner>
          <Cell className="mdl-color--white" span={12}>
            <div>
              <TableComponent
                title={title}
                headers={headers}
                items={items}
                selectedItem={-1}
                onSelect={() => {}}
              />
            </div>
          </Cell>
        </Inner>
      </Grid>
    );
  }
}

Users.defaultProps = {
  profile: {},
  user: null,
};

Users.propTypes = {
  profile: PropTypes.shape({}),
  user: PropTypes.shape({}),
};

const mapStateToProps = (state) => {
  const { user } = state;
  const profile = user ? user.profile : null;

  return {
    user,
    profile,
  };
};

export default connect(mapStateToProps, null)(Users);
