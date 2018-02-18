import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Textfield } from "zoapp-materialcomponents";

export default class FBContainer extends Component {
  constructor() {
    super();
    this.state = {
      /* pages: null, */
      fbInit: false,
      isStarted: false,
      isConnected: false,
      message: "You need to connect your Facebook account. Or you could set a manual connection.",
    };
  }

  componentDidMount() {
    window.fbAsyncInit = (() => {
      window.FB.init({
        appId: this.props.appId,
        cookie: true,
        xfbml: true,
        version: "v2.8",
      });
      window.FB.AppEvents.logPageView();

      window.FB.Event.subscribe("auth.logout", this.onLogout.bind(this));
      window.FB.Event.subscribe("auth.statusChange", this.onStatusChange.bind(this));
      this.setState({ fbInit: true });
      this.start();
    });

    // Load the SDK asynchronously
    (((d, s, id) => {
      let js = null;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        this.start();
        this.setState({ fbInit: true });
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk"));
  }

  onStatusChange(response) {
    console.log(response);
    if (response.status === "connected") {
      this.connected();
    }
  }

  onLogout() {
    this.setState({ message: "" });
  }

  onButtonAction(action) {
    console.log("buttonAction=", action);
    if (action === "Login") {
      this.login();
    } else if (action === "Manual") {
      this.manualConnection();
    } else if (action === "Logout") {
      this.logout();
    }
  }

  getPages() {
    const that = this;
    // https://developers.facebook.com/docs/graph-api/reference/user/accounts/
    window.FB.api("/me/accounts", (response) => {
      console.log("getPages =", response);
      if (response && response.data) {
        that.setState({ pages: response.data });
      } else {
        const message = "Error can't get pages ";
        that.setState({ message });
      }
    });
  }

  start() {
    if (this.state.isStarted) return;

    console.log("started");
    this.setState({ isStarted: true });
    window.FB.getLoginStatus((response) => {
      console.log("start=", response);
      if (response.status === "connected") {
        this.connected();
      }
    });
  }

  connected() {
    if (this.state.isConnected) return;

    console.log("connected");
    this.setState({ isConnected: true });
    const that = this;
    window.FB.api("/me", (response) => {
      const message = `Welcome ${response.name}`;
      that.setState({ message });
      that.getPages();
    });
  }

  login() {
    const that = this;
    window.FB.login((response) => {
      if (response.authResponse) {
        console.log("Welcome! Fetching your information.... ");
        that.connected();
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    }, { scope: "public_profile,manage_pages" });
  }

  logout() {
    window.FB.logout(() => {
      console.log("Logout");
      this.setState({ isConnected: false });
    });
  }

  manualConnection() {
    // TODO
    this.props.onAction("Manual");
  }

  renderLogin(visibility) {
    const action = this.state.isConnected ? "Logout" : "Login";
    return (
      <div style={{
        visibility,
        width: "320px",
        height: "128px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >
        <div
          style={{
            width: "94px",
            height: "28px",
            backgroundColor: "rgb(57, 92, 169)",
            color: "#fff",
            textAlign: "center",
            fontSize: "13px",
            borderRadius: "3px",
            cursor: "pointer",
            margin: "auto",
          }}
          role="presentation"
          onKeyUp={() => {}}
          onClick={(event) => {
            event.stopPropagation();
            this.onButtonAction(action);
          }}
        >
          <div style={{
            width: "16px", height: "16px", paddingTop: "3px", paddingLeft: "6px", float: "left",
          }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" color="#ffffff">
              <path
                fill="#ffffff"
                d="M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
                11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
                11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
                15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
                11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"
              />
            </svg>
          </div>
          <div style={{ paddingTop: "4px", float: "center" }}>{action}</div>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px", textAlign: "center" }}>{this.state.message}</div>
        <Button
          style={{
            width: "200px",
            marginLeft: "60px",
          }}
          onClick={(event) => {
            event.stopPropagation();
            this.onButtonAction("Manual");
          }}
        >Manual connection
        </Button>
      </div>);
  }

  renderConnect(visibility) {
    return (
      <div style={{
        visibility,
        width: "320px",
        height: "128px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >
        <Textfield
          defaultValue=""
          pattern=""
          label="Page Token"
          floatingLabel
          error=""
          style={{ width: "320px" }}
          ref={(input) => { this.textField1 = input; }}
        />
        <Textfield
          defaultValue=""
          pattern=""
          label="Verify Token"
          floatingLabel
          error=""
          style={{ width: "320px" }}
          ref={(input) => { this.textField2 = input; }}
        />
      </div>);
  }

  render() {
    const visibility = this.state.fbInit ? "visible" : "hidden";
    const { selectedStep } = this.props;
    if (selectedStep === 0) {
      return this.renderLogin(visibility);
    } else if (selectedStep === 1) {
      return this.renderConnect(visibility);
    }
    return (
      <div style={{
        visibility,
        width: "320px",
        height: "128px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >{selectedStep} TODO
      </div>);
  }
}

FBContainer.propTypes = {
  appId: PropTypes.string.isRequired,
  selectedStep: PropTypes.number.isRequired,
  onAction: PropTypes.func.isRequired,
};
