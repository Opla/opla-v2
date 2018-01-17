import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Cell } from "react-mdl";
import List from "../components/listComponent";
import ServicesList from "../components/servicesList";
import displayWebServiceEditor from "../components/serviceEditor";
import displayProviderEditor from "../components/providerEditor";
import { apiGetMiddlewaresRequest, apiSetMiddlewareRequest, apiDeleteMiddlewareRequest } from "../actions/api";
import DialogManager from "../utils/dialogManager";

const divCellStyle = {
  width: "100%",
};

class ServicesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { needUpdate: true };
  }

  componentDidMount() {
    this.updateServices();
  }

  componentDidUpdate() {
    this.updateServices();
  }

  onEditAction = (dialog, editAction) => {
    const { name, index } = this.currentSelected;

    if (editAction === "Change" || editAction === "Add") {
      // WIP
      const params = {};
      Object.keys(this.paramFields).forEach((inputName) => {
        const value = this.paramFields[inputName].inputRef.value.trim();
        if (value && value.length > 0) {
          params[inputName] = value;
        }
      }, this);
      if (name === "Web services") {
        if (editAction === "Change") {
          const webservices = this.getMiddlewares("WebService");
          const wh = webservices[index];
          params.id = wh.id;
          params.status = wh.status;
        }
        const botId = this.props.selectedBotId;
        params.origin = botId;
        if (params.classes) {
          params.classes = params.classes.split(",");
        }
        if (!params.path) {
          params.path = "/";
        }
        if (!params.status) {
          params.status = "start";
        }
        params.remote = true;
        params.type = "WebService";
        this.props.apiSetMiddlewareRequest(botId, params);
        this.setState({ needUpdate: true });
      }
    } else if (editAction === "Delete") {
      // WIP
      if (name === "Web services") {
        const webservices = this.getMiddlewares("WebService");
        const wh = webservices[index];
        const botId = this.props.selectedBotId;
        this.props.apiDeleteMiddlewareRequest(botId, wh.id);
        this.setState({ needUpdate: true });
      }
    }
    console.log("TODO", `ServicesContainer.onEditAction : ${editAction}`);

    this.currentSelected = null;
    this.paramFields = null;
    return true;
  }

  onSelect = (selected) => {
    // WIP
    if (this.currentSelected) {
      return;
    }
    const {
      name, state, index, item,
    } = selected;

    let title = name;
    let parameters = {};
    let action = null;
    let actionDef;
    let editor = null;
    let services = null;
    let content = null;
    let couldDelete = true;
    let className = null;
    this.currentSelected = { ...selected };
    console.log("test");
    if (name === "Web services") {
      services = this.getMiddlewares("WebService");
      editor = displayProviderEditor;
      couldDelete = false;
      console.log("ws");
      if ((state === "select" || state === "create")) {
        if (item.provider) {
          className = "mdl-dialog-extended";
          title = item.name;
          content = item.provider.renderSettings();
          action = "next";
        } else {
          console.log("demo");
          editor = displayWebServiceEditor;
          if (state === "create") {
            title = `Add ${title} entry`;
            action = "Add";
          }
        }
      } else if (state === "add") {
        className = "mdl-dialog-list";
        title = "Add a WebService";
        const items = this.getWebServices(true);
        items.push({
          id: items.length + 1, name: "Add plugin", icon: "add", color: "gray",
        });
        const that = this;
        content = (
          <div style={{ height: "280px" }}><List
            className="list-content"
            style={{ padding: "0px" }}
            items={items}
            selectedItem={-1}
            onSelect={(i) => {
              const it = items[i];
              const n = it.name;
              console.log("WIP select Web services =", n);
              setTimeout(() => {
                DialogManager.closeCurrentDialog();
                that.onSelect({
                  name: "Web services", index: i, item: it, state: "create",
                });
              }, 50);
            }}
          />
          </div>);
      }
    } else if (name === "AI/NLU providers") {
      // WIP
      title = null;
      editor = displayProviderEditor;
      couldDelete = false;
      if ((state === "select" || state === "create") && item.provider) {
        className = "mdl-dialog-extended";
        title = item.name;
        content = item.provider.renderSettings();
        action = "next";
      } else if (state === "add") {
        className = "mdl-dialog-list";
        title = "Add an AI/NLU provider";
        const items = this.getAIProviders(true);
        items.push({
          id: items.length + 1, name: "Add plugin", icon: "add", color: "gray",
        });
        const that = this;
        content = (
          <div style={{ height: "280px" }}><List
            className="list-content"
            style={{ padding: "0px" }}
            items={items}
            selectedItem={-1}
            onSelect={(i) => {
              const it = items[i];
              const n = it.name;
              console.log("WIP select AI/NLU providers =", n);
              setTimeout(() => {
                DialogManager.closeCurrentDialog();
                that.onSelect({
                  name: "AI/NLU providers", index: i, item: it, state: "create",
                });
              }, 50);
            }}
          />
          </div>);
      } else {
        this.currentSelected = null;
      }
    } else if (name === "Messaging platforms") {
      // WIP
      title = null;
      editor = displayProviderEditor;
      couldDelete = false;
      if ((state === "select" || state === "create") && item.provider) {
        className = "mdl-dialog-extended";
        title = item.name;
        content = item.provider.renderSettings();
        action = "next";
      } else if (state === "add") {
        className = "mdl-dialog-list";
        title = "Add a messaging platform";
        const items = this.getMessagingProviders(true);
        items.push({
          id: items.length + 1, name: "Add plugin", icon: "add", color: "gray",
        });
        const that = this;
        content = (
          <div style={{ height: "280px" }}><List
            className="list-content"
            style={{ padding: "0px" }}
            items={items}
            selectedItem={-1}
            onSelect={(i) => {
              const it = items[i];
              const n = it.name;
              console.log("WIP select messaging platform =", n);
              setTimeout(() => {
                DialogManager.closeCurrentDialog();
                that.onSelect({
                  name: "Messaging platforms", index: i, item: it, state: "create",
                });
              }, 50);
            }}
          />
          </div>);
      } else {
        this.currentSelected = null;
      }
    } else {
      this.currentSelected = null;
    }

    if (this.currentSelected) {
      if (state === "add" && state === "create" && (!className)) {
        if (title) {
          title = `Add ${title} entry`;
          action = "Add";
        }
      } else if (state === "select" && (!className)) {
        if (services) {
          parameters = services[index];
          title = `Edit ${title} entry`;
        }
        if (!action) {
          action = "Change";
        }
      } else if (state === "delete") {
        editor = null;
        title = `Remove ${title} entry`;
        action = "Delete";
      }
      if (!actionDef) {
        actionDef = action;
      }
      if (editor) {
        this.paramFields = {};
        editor(title, action, actionDef, parameters, (input, ref) => {
          if (this.paramFields) {
            this.paramFields[ref] = input;
          }
        }, this.onEditAction, content, className);
      } else if (state === "delete" && couldDelete) {
        DialogManager.open({
          title,
          content: "Do you want to delete it ?",
          actions: ["Delete", "Cancel"],
          onAction: this.onEditAction,
          className,
        });
      }
      console.log("WIP WebServicesContainer.onSelect", selected);
    }
  }

  getWebServices(all = false) {
    const providers = this.props.pluginsManager.getPlugins({ type: "WebServices" });
    const services = [];
    services.push({
      id: 1, name: "JSON WebService", icon: "images/robot2.svg", color: "green",
    });
    let id = 2;
    providers.forEach((p) => {
      if (all || p.isActive()) {
        services.push({
          id, name: p.getTitle(), icon: p.getIcon(), color: p.getColor(), provider: p,
        });
      }
      id += 1;
    });
    return services;
  }

  getMessagingProviders(all = false) {
    const providers = this.props.pluginsManager.getPlugins({ type: "MessengerConnector" });
    const messagings = [];
    let id = 1;
    providers.forEach((p) => {
      if (all || p.isActive()) {
        messagings.push({
          id, name: p.getTitle(), icon: p.getIcon(), color: p.getColor(), provider: p,
        });
      }
      id += 1;
    });
    return messagings;
  }

  getAIProviders(all = false) {
    const providers = this.props.pluginsManager.getPlugins({ type: "AIProvider" });
    const ais = [];
    let id = 1;
    providers.forEach((p) => {
      if (all || p.isActive()) {
        ais.push({
          id, name: p.getTitle(), icon: p.getIcon(), status: "start", provider: p,
        });
      }
      id += 1;
    });
    return ais;
  }

  getMiddlewares(type) {
    const list = [];
    if (this.props.middlewares) {
      // TODO
      this.props.middlewares.forEach((m) => {
        if (m.type === type) {
          list.push({ ...m });
        }
      });
    }
    return list;
  }

  updateServices() {
    if (!this.props.isSignedIn) {
      if (!this.state.needUpdate) {
        this.setState({ needUpdate: true });
      }
      return;
    }
    if (this.props.selectedBotId && this.state.needUpdate) {
      this.setState({ needUpdate: false });
      this.props.apiGetMiddlewaresRequest(this.props.selectedBotId);
    }
  }

  render() {
    const webservices = this.getMiddlewares("WebService");
    // WIP : need to get from backend which provider is activated/running
    const messagings = this.getMiddlewares("MessengerConnector"); // this.getMessagingProviders();
    const ais = this.getMiddlewares("AIProvider"); // this.getAIProviders();

    return (
      <div style={divCellStyle}>
        <Cell className="mdl-color--white" col={12}>
          <ServicesList name="Messaging platforms" items={messagings} onSelect={this.onSelect} />
        </Cell>
        <Cell className="mdl-color--white" col={12}>
          <ServicesList name="AI/NLU providers" items={ais} onSelect={this.onSelect} />
        </Cell>
        <Cell className="mdl-color--white" col={12}>
          <ServicesList name="Web services" items={webservices} onSelect={this.onSelect} />
        </Cell>
      </div>
    );
  }
}

ServicesContainer.defaultProps = {
  isSignedIn: true,
  selectedBotId: null,
  middlewares: null,
};

ServicesContainer.propTypes = {
  isSignedIn: PropTypes.bool,
  selectedBotId: PropTypes.string,
  middlewares: PropTypes.arrayOf(PropTypes.shape({})),
  apiGetMiddlewaresRequest: PropTypes.func.isRequired,
  apiSetMiddlewareRequest: PropTypes.func.isRequired,
  apiDeleteMiddlewareRequest: PropTypes.func.isRequired,
  pluginsManager: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => {
  const middlewares = state.app ? state.app.middlewares : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  return { middlewares, selectedBotId, isSignedIn };
};

const mapDispatchToProps = dispatch => ({
  apiGetMiddlewaresRequest: (botId) => {
    dispatch(apiGetMiddlewaresRequest(botId));
  },
  apiSetMiddlewareRequest: (botId, middleware) => {
    dispatch(apiSetMiddlewareRequest(botId, middleware));
  },
  apiDeleteMiddlewareRequest: (botId, middleware) => {
    dispatch(apiDeleteMiddlewareRequest(botId, middleware.id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServicesContainer);
