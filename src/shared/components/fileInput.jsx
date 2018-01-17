import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FileInput extends Component {
  handleFileChange = (selectorFiles) => {
    const file = selectorFiles[0];
    console.log("handleFileChange file=", file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      if (this.props.onLoad) {
        this.props.onLoad(data, file.type);
      }
    };
    reader.readAsText(file);
  }

  render() {
    const { accept } = this.props;
    return (
      <div className="fileInput" >
        <i className="material-icons">cloud_upload</i>
        <input type="file" accept={accept} onChange={e => this.handleFileChange(e.target.files)} />
      </div>);
  }
}
FileInput.defaultProps = {
  onLoad: null,
  accept: null,
};

FileInput.propTypes = {
  onLoad: PropTypes.func,
  accept: PropTypes.string,
};
