import React from "react";
import { Card, CardTitle, CardText, CardActions } from "react-mdl";

const Loading = () => (
  <Card shadow={0} style={{ width: "512px", margin: "auto" }}>
    <CardTitle>Processing</CardTitle>
    <CardText>
              Please wait ...
    </CardText>
    <CardActions />
  </Card>);

Loading.propTypes = {
};

export default Loading;
