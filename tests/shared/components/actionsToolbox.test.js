/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import ActionsToolbox from "shared/components/actionsToolbox";

describe("components/actionsToolbox", () => {
  const defaultProps = {
    onChange: () => {},
    type: null,
    isInput: false,
    disable: false,
  };

  const isInputActionIds = [
    "#atb_text",
    "#atb_any",
    "#atb_output_var",
    "#atb_trash",
  ];

  const allActionIds = [
    "#atb_text",
    "#atb_any",
    "#atb_output_var",
    "#atb_variable",
    "#atb_br",
    "#atb_button",
    "#atb_trash",
  ];

  it("should render all actions", () => {
    const wrapper = shallow(<ActionsToolbox {...defaultProps} />);

    expect(wrapper.find("Tooltip")).toHaveLength(7);

    allActionIds.forEach((actionId, index) => {
      try {
        expect(
          wrapper
            .find("Tooltip")
            .at(index)
            .dive()
            .find(actionId),
        ).toHaveLength(1);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("at index", index, "cant find actionId", actionId);
        throw e;
      }
    });
  });

  it("can be typed", () => {
    const types = "any";
    const component = renderer.create(<ActionsToolbox type={types} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be an input", () => {
    const component = renderer.create(<ActionsToolbox isInput />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should render isInput actions", () => {
    const wrapper = shallow(<ActionsToolbox {...defaultProps} isInput />);

    expect(wrapper.find("Tooltip")).toHaveLength(4);

    isInputActionIds.forEach((actionId, index) => {
      try {
        expect(
          wrapper
            .find("Tooltip")
            .at(index)
            .dive()
            .find(actionId),
        ).toHaveLength(1);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("at index", index, "cant find actionId", actionId);
        throw e;
      }
    });
  });

  it("can be disabled", () => {
    const component = renderer.create(<ActionsToolbox disable />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
