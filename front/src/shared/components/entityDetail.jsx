import React from "react";
import PropTypes from "prop-types";
import { Button, Dialog, DialogFooter, FormField, TextField } from "zrmc";

class EntityDetail extends React.Component {
  constructor(props) {
    super(props);
    const { entity } = props;
    entity.values = (props.entity.values || []).join(",");

    this.state = {
      edited: false,
      updatedEntity: entity,
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
    this.setState({
      edited: true,
      updatedEntity: {
        ...this.state.updatedEntity,
        [name]: v,
      },
    });
  };

  render = () => {
    const { onSubmit, onClose, header } = this.props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { updatedEntity } = this.state;
          updatedEntity.values = updatedEntity.values
            .replace(/ , |, | ,/g, ",")
            .split(",");
          onSubmit(updatedEntity);
        }}
      >
        <Dialog id="team-dialog" onClose={onClose} header={header}>
          <FormField key="entity-form-name" style={{ display: "block" }}>
            <TextField
              id="entity-tf-name"
              defaultValue={this.state.updatedEntity.name}
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
              defaultValue={this.state.updatedEntity.values}
              onChange={this.onChangeHandler("values")}
              label="Values"
              dense
              style={{ width: "100%" }}
              required
              disabled={false}
            />
          </FormField>
          <FormField key="entity-form-description" style={{ display: "block" }}>
            <TextField
              id="entity-tf-description"
              defaultValue={this.state.updatedEntity.description}
              onChange={this.onChangeHandler("description")}
              label="Description"
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
