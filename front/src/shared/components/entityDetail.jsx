import React from "react";
import PropTypes from "prop-types";
import { Button, Dialog, DialogFooter, FormField, TextField } from "zrmc";

class EntityDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      edited: false,
      updatedEntity: {},
    };
  }

  canCreateOrEdit = () => {
    const v = this.props.entity;
    if (v && Object.keys(v).length > 0) {
      // Then we are in edit mode
      return this.state.edited;
    }
    // Else we are in create mode
    const currentEntity = this.state.updatedEntity;
    return currentEntity && currentEntity.name && currentEntity.values;
  };

  onChangeHandler = (name) => (e) => {
    let v = e;
    if (e.target && e.target.value) {
      v = e.target.value;
    }
    const previousEntity = {
      ...this.state.updatedEntity,
      ...this.props.entity,
    };
    this.setState({
      edited: true,
      updatedEntity: {
        ...previousEntity,
        [name]: v,
      },
    });
  };

  render = () => {
    const { onSubmit, onClose, header, entity } = this.props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { updatedEntity } = this.state;
          onSubmit({
            name: updatedEntity.name,
            values: updatedEntity.values.replace(/ , |, | ,/g, ",").split(","),
          });
        }}
      >
        <Dialog id="team-dialog" onClose={onClose} header={header}>
          <FormField key="entity-form-name" style={{ display: "block" }}>
            <TextField
              id="entity-tf-name"
              defaultValue={entity.name}
              onChange={this.onChangeHandler("name")}
              label="Name"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
          <FormField key="entity-form-value" style={{ display: "block" }}>
            <TextField
              id="entity-tf-value"
              defaultValue={(entity.values || []).join(",")}
              onChange={this.onChangeHandler("values")}
              label="Values"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
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
              {Object.keys(this.props.entity).length ? "Edit" : "Create"}
            </Button>
          </DialogFooter>
        </Dialog>
      </form>
    );
  };
}

EntityDetail.defaultProps = {
  entity: {},
};

EntityDetail.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  footer: PropTypes.arrayOf(PropTypes.object),
  entityScope: PropTypes.string.isRequired,
  entity: PropTypes.object,
};

export default EntityDetail;
