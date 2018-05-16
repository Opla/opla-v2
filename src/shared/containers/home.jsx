/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardTitle,
  CardText,
  CardMedia,
  CardActions,
  Button,
} from "zrmc";
import { connect } from "react-redux";
import Dashboard from "./dashboard";

const titleStyle = {
  textAlign: "center",
  padding: "15px 10px 0px 10px",
  fontWeight: "300",
};

const Home = ({ isSignedIn }) => {
  if (isSignedIn) {
    return <Dashboard />;
  }

  return (
    <div className="mdl-layout__content mdl-color--grey-100">
      <section className="text-section" style={{ margin: "40px" }}>
        <Card shadow={0} style={{ width: "512px", margin: "auto" }}>
          <CardTitle>
            <h1 style={titleStyle}>Your open conversational robot</h1>
          </CardTitle>
          <CardMedia src="images/bg.jpg" style={{ height: "240px" }} />
          <CardText style={{ paddingTop: "20px" }}>
            It is easy and fast. In less than 5 min, your bot will be ready!
          </CardText>
          <CardActions>
            <Button link="/create">Create it</Button>
          </CardActions>
        </Card>
      </section>
    </div>
  );
};

Home.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  return { admin, isLoading, isSignedIn };
};

export default connect(mapStateToProps)(Home);
