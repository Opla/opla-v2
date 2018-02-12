import React from "react";
import PropTypes from "prop-types";
import { Card, CardTitle, CardText, CardActions, Button, Content } from "react-mdl";
import { connect } from "react-redux";
import Dashboard from "./dashboard";

const Home = ({ isSignedIn }) => {
  if (isSignedIn) {
    return (<Dashboard />);
  }
  return (
    <Content className="mdl-color--grey-100">
      <section className="text-section" style={{ margin: "40px" }}>
        <Card shadow={0} style={{ width: "512px", margin: "auto" }}>
          <CardTitle style={{
            color: "#fff", height: "376px", background: "url(images/bg.jpg) top / cover", padding: "0px",
          }}
          >
            <h2
              className="mdl-card__title-text"
              style={{
                background: "rgba(0, 0, 0, 0.4)", width: "100%", padding: "16px",
              }}
            >Create your own virtual assistant
            </h2>
          </CardTitle>
          <CardText>
          It is easy and fast. In less than 5 min, your bot will be ready!
          </CardText>
          <CardActions border>
            <a href="/create"><Button colored>Create it</Button></a>
          </CardActions>
        </Card>
      </section>
    </Content>
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
