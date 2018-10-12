/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { Grid, Inner } from "zrmc";
import AssistantCard from "../components/assistantCard";

const TemplatesList = ({
  items,
  selectedItem,
  onSelect,
  onImport,
  acceptImport,
}) => (
  <Grid>
    <Inner>
      {items.map((item, index) => {
        const key = item.id ? item.id : `${index}${item.name}`;
        return (
          <AssistantCard
            key={key}
            item={item}
            index={index}
            selectedIndex={selectedItem}
            onSelect={onSelect}
            onImport={onImport}
            acceptImport={acceptImport}
          />
        );
      })}
    </Inner>
  </Grid>
);

TemplatesList.defaultProps = {
  onImport: null,
  acceptImport: null,
};

TemplatesList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  selectedItem: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onImport: PropTypes.func,
  acceptImport: PropTypes.string,
};

export default TemplatesList;
