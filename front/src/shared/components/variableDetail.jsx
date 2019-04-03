import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogFooter,
  FormField,
  LinearProgress,
  MenuItem,
  TextField,
  Select,
} from "zrmc";

const OPEN_NLX_TYPES = [
  {
    id: "email",
    name: "@Email",
  },
  {
    id: "date",
    name: "@Date",
  },
];

const VARIABLES_ACCESS = ["Read", "Write"];

class VariableDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      edited: false,
      updatedVariable: {},
    };
  }

  canCreateOrEdit = () => {
    const v = this.props.variable;
    if (v && Object.keys(v).length > 0) {
      // Then we are in edit mode
      return this.state.edited;
    }
    // Else we are in create mode
    const currentVariable = this.state.updatedVariable;
    return (
      currentVariable &&
      currentVariable.name &&
      currentVariable.value &&
      currentVariable.type &&
      currentVariable.access &&
      currentVariable.description
    );
  };

  onChangeHandler = (name) => (e) => {
    let v = e;
    if (e.target && e.target.value) {
      v = e.target.value;
    }
    const previousVariable = {
      ...this.state.updatedVariable,
      ...this.props.variable,
    };
    this.setState({
      edited: true,
      updatedVariable: {
        ...previousVariable,
        [name]: v,
      },
    });
  };

  render = () => {
    const {
      onSubmit,
      onClose,
      header,
      width,
      isLoading,
      error,
      variable,
    } = this.props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { updatedVariable } = this.state;
          onSubmit({
            name: updatedVariable.name,
            value: updatedVariable.value,
            type: updatedVariable.type,
            access: updatedVariable.access,
            description: updatedVariable.description,
            scope: this.props.variableScope,
          });
        }}
      >
        <Dialog
          id="team-dialog"
          onClose={onClose}
          header={header}
          width={width}
        >
          <FormField key="variable-form-name" style={{ display: "block" }}>
            <TextField
              id="variable-tf-name"
              defaultValue={variable.name}
              onChange={this.onChangeHandler("name")}
              label="Name"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
          <FormField key="variable-form-value" style={{ display: "block" }}>
            <TextField
              id="variable-tf-value"
              defaultValue={variable.value}
              onChange={this.onChangeHandler("value")}
              label="Value"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
          <FormField key="variable-form-type" style={{ display: "block" }}>
            <Select
              label="Type"
              style={{ width: "100%" }}
              onSelected={this.onChangeHandler("type")}
              selectedIndex={OPEN_NLX_TYPES.findIndex(
                (t) => t.id === variable.type,
              )}
            >
              {OPEN_NLX_TYPES.map((t) => (
                <MenuItem
                  key={t.id}
                  value={t.id}
                  selected={t.id === variable.type}
                >
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormField>
          <FormField key="variable-form-access" style={{ display: "block" }}>
            <Select
              label="Access"
              style={{ width: "100%" }}
              onSelected={this.onChangeHandler("access")}
              selectedIndex={VARIABLES_ACCESS.findIndex(
                (t) => t === variable.access,
              )}
            >
              {VARIABLES_ACCESS.map((a) => (
                <MenuItem key={a} value={a} selected={a === variable.access}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormField>
          <FormField
            key="variable-form-description"
            style={{ display: "block" }}
          >
            <TextField
              id="variable-tf-description"
              defaultValue={variable.description}
              onChange={this.onChangeHandler("description")}
              label="Description"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
          {isLoading ? (
            <LinearProgress buffer={0} indeterminate />
          ) : (
            <div className="authenticate_error">{error}</div>
          )}
          <DialogFooter>
            <Button
              key="btn-cancel"
              className="authenticate_submit"
              dense
              onClick={this.props.onClose}
            >
              Cancel
            </Button>,
            <Button
              key="btn-create-user"
              type="submit"
              className="authenticate_submit"
              disabled={!this.canCreateOrEdit()}
              dense
            >
              {Object.keys(this.props.variable).length ? "Edit" : "Create"}
            </Button>
          </DialogFooter>
        </Dialog>
      </form>
    );
  };
}

VariableDetail.defaultProps = {
  variable: {},
};

VariableDetail.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  footer: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  variableScope: PropTypes.string.isRequired,
  error: PropTypes.string,
  variable: PropTypes.object,
};

export default VariableDetail;
