/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Select, MenuItem, Button, TextField } from "zrmc";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ProcessingDialog from "zoapp-front/dist/containers/processingDialog";
import { appSetTitleName } from "zoapp-front/dist/actions/app";
import { addMessage } from "zoapp-front/dist/actions/message";

import TemplatesList from "../components/templatesList";
import { apiCreateBot } from "../actions/bot";
import { apiGetTemplatesRequest, apiGetLanguagesRequest } from "../actions/api";

const boxStyle = {
  margin: "16px",
};

const headerStyle = {
  padding: "16px",
};

const h4 = {
  marginTop: "0px",
  marginBottom: "16px",
  fontSize: "16px",
  color: "rgba(0, 0, 0, 0.87)",
};
const secText = {
  color: "rgba(0, 0, 0, 0.54)",
};

export class CreateAssistantBase extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "",
      language: null,
      loading: false,
      selectedTemplate: null,
      template: null,
    };
    props.appSetTitleName("Create an assistant", "Create");
  }

  componentDidMount() {
    this.props.apiGetTemplates();
    this.props.apiGetLanguages();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.templates !== this.props.templates &&
      this.state.selectedTemplate === null
    ) {
      const selectedTemplate = this.props.templates.findIndex(
        (template) => template.name === "Empty",
      );

      this.onSelectTemplate(
        selectedTemplate,
        this.props.templates[selectedTemplate],
      );
    }
    if (this.state.loading && this.props.isLoading === false) {
      this.handleCloseCreateDialog();
    }
  }

  onImportTemplate = (data) => {
    try {
      const json = JSON.parse(data);
      this.onSelectTemplate(3, json);
    } catch (e) {
      this.props.addMessage("imported template is not a valid JSON document");
    }
  };

  onSelectTemplate = (selected, data) => {
    let template = data;
    if (!template) {
      template = this.props.templates[selected];
    }
    this.setState({ selectedTemplate: selected, template });
  };

  handleCloseCreateDialog = () => {
    this.setState({ loading: false });
    Zrmc.closeDialog();
    if (!this.props.error) {
      // TODO select Bot created
      this.props.history.push("/factory");
    }
  };

  handleCreate = (e) => {
    e.preventDefault();

    const { name, email, language, template, loading } = this.state;

    if (template === null) {
      this.props.addMessage("please select a template");
      return;
    }

    if (loading === false) {
      const botParams = {
        name,
        email,
        template,
        language,
      };

      this.setState({ loading: true });

      Zrmc.showDialog(
        <ProcessingDialog open onClosed={this.handleCloseDialog} />,
      );

      this.props.createBot(botParams);
    } else {
      // TODO display errors in dialogs
    }
  };

  handleLanguageChange = (language) => {
    this.setState({ language });
  };

  createChangeHandler = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  render() {
    const { name, email, selectedTemplate: selected } = this.state;

    let selectedLanguageIndex = 0;
    const languagesItems = this.props.languages.map((language, index) => {
      if (language.default === true) {
        selectedLanguageIndex = index;
      }
      return (
        <MenuItem
          key={language.id}
          selected={language.default}
          value={language.id}
        >
          {language.name}
        </MenuItem>
      );
    });

    // TODO json only for instance
    const acceptImport = "application/json";
    return (
      <div className="zui-layout__content zui-color--grey-100">
        <section className="zui-color--white zui-shadow--2dp" style={boxStyle}>
          <div style={headerStyle}>
            <h4 style={h4}>Welcome</h4>
            <div style={secText}>
              Create your open conversational robot at the speed of light. Just
              follow the instructions, no coding required !
            </div>
          </div>
        </section>
        <section className="zui-color--white zui-shadow--2dp" style={boxStyle}>
          <div style={headerStyle}>
            <h4 style={h4}>Templates</h4>
            <div style={secText}>
              Choose a prebuild asssistant, import one or select an empty model.
            </div>
          </div>
          {this.props.templates &&
            this.props.templates.length > 0 && (
              <TemplatesList
                items={this.props.templates}
                selectedItem={selected}
                onSelect={this.onSelectTemplate}
                onImport={this.onImportTemplate}
                acceptImport={acceptImport}
              />
            )}
        </section>
        <form
          id="create-assistant-form"
          autoComplete="new-password"
          onSubmit={this.handleCreate}
        >
          <section
            className="zui-color--white zui-shadow--2dp"
            style={boxStyle}
          >
            <div style={headerStyle}>
              <h4 style={h4}>Informations needed</h4>
              <div style={secText}>
                Please provide the following information. Don&apos;t worry. You
                can always change them later.
              </div>
              <div>
                <TextField
                  id="create-assistant-name"
                  onChange={this.createChangeHandler("name")}
                  defaultValue={name}
                  label="Assistant name"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <TextField
                  id="create-assistant-email"
                  type="email"
                  onChange={this.createChangeHandler("email")}
                  defaultValue={email}
                  label="Contact email"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <Select
                  id="create-assistant-language"
                  label="Choose language"
                  onSelected={this.handleLanguageChange}
                  style={{ width: "400px" }}
                  selectedIndex={selectedLanguageIndex}
                  required
                >
                  {languagesItems}
                </Select>
              </div>
            </div>
          </section>
          <section style={boxStyle}>
            <div style={headerStyle}>
              <Button type="submit" raised>
                Create
              </Button>
            </div>
          </section>
        </form>
      </div>
    );
  }
}

CreateAssistantBase.defaultProps = {
  error: null,
};

CreateAssistantBase.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  createBot: PropTypes.func.isRequired,
  appSetTitleName: PropTypes.func.isRequired,
  apiGetTemplates: PropTypes.func.isRequired,
  apiGetLanguages: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  history: PropTypes.shape({ length: PropTypes.number, push: PropTypes.func })
    .isRequired,
  templates: PropTypes.array,
  languages: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { admin, error, templates, languages } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app.loading || false;
  return {
    admin,
    isLoading,
    isSignedIn,
    error,
    templates,
    languages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createBot: (botParams) => {
    dispatch(apiCreateBot(botParams));
  },
  appSetTitleName: (titleName) => {
    dispatch(appSetTitleName(titleName));
  },
  addMessage: (message) => {
    dispatch(addMessage(message));
  },
  apiGetTemplates: () => {
    dispatch(apiGetTemplatesRequest());
  },
  apiGetLanguages: () => {
    dispatch(apiGetLanguagesRequest());
  },
});

// prettier-ignore
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CreateAssistantBase),
);
