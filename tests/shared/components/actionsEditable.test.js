/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import ActionsEditable from "shared/components/actionsEditable";

describe("components/actionsEditable", () => {
  const defaultProps = {
    id: "action-editor-content",
    editable: true,
    content: "* bons gestes composteur *",
    onChange: () => {},
    onSelected: () => {},
    style: {
      overflow: "hidden",
      fontSize: "16px",
      letterSpacing: "0.04em",
      lineHeight: "1",
      color: "#757575",
      margin: "16px",
    },
    selectedItem: -1,
    onFocus: () => {},
    onAction: () => {},
    // placeholder: null,
    // caretPosition: 0
  };

  it("renders correctly", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_content")).toHaveLength(1);
    expect(wrapper.find("#ae_1")).toHaveLength(1);
    expect(wrapper.find("#ae_1").text()).toEqual(" bons gestes composteur ");
  });

  it("should insert an item", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_1")).toHaveLength(1);
    expect(wrapper.find("#ae_1").text()).toEqual(" bons gestes composteur ");

    const focusElement = {
      id: "ae_1",
      innerHTML: " bons gestes composteur ",
      tabindex: 3,
      contenteditable: true,
    };
    wrapper.instance().focusElement = focusElement;
    wrapper.instance().insertItem({ text: "*", type: "any" }, 2);
    wrapper.update();
    expect(wrapper.state("items")).toHaveLength(4);
    expect(wrapper.find("#ae_2")).toHaveLength(1);
    expect(wrapper.find("#ae_2").text()).toEqual("any");
    expect(wrapper.find("#ae_3")).toHaveLength(1);
    expect(wrapper.find("#ae_3").text()).toEqual("any");
  });

  it("should insert an item at end", () => {
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} content="* bons gestes composteur " />,
    );
    expect(wrapper.state("items")).toHaveLength(2);
    expect(wrapper.find("#ae_0")).toHaveLength(1);
    expect(wrapper.find("#ae_0").text()).toEqual("any");
    expect(wrapper.find("#ae_1")).toHaveLength(1);
    expect(wrapper.find("#ae_1").text()).toEqual(" bons gestes composteur ");

    const focusElement = {
      id: "ae_end",
      innerHTML: "",
      tabindex: 7,
      contenteditable: true,
    };
    wrapper.instance().focusElement = focusElement;
    wrapper.instance().insertItem({ text: "*", type: "any" }, 0);
    wrapper.update();
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_0")).toHaveLength(1);
    expect(wrapper.find("#ae_0").text()).toEqual("any");
    expect(wrapper.find("#ae_1")).toHaveLength(1);
    expect(wrapper.find("#ae_1").text()).toEqual(" bons gestes composteur ");
    expect(wrapper.find("#ae_2")).toHaveLength(1);
    expect(wrapper.find("#ae_2").text()).toEqual("any");
    expect(wrapper.find("#ae_3")).toHaveLength(0);
  });

  it("should delete an item", () => {
    const wrapper = shallow(
      <ActionsEditable
        {...defaultProps}
        content="* bons gestes composteur **"
      />,
    );
    expect(wrapper.state("items")).toHaveLength(4);
    expect(wrapper.find("#ae_1")).toHaveLength(1);
    expect(wrapper.find("#ae_1").text()).toEqual(" bons gestes composteur ");
    expect(wrapper.find("#ae_2")).toHaveLength(1);
    expect(wrapper.find("#ae_2").text()).toEqual("any");
    expect(wrapper.find("#ae_3")).toHaveLength(1);
    expect(wrapper.find("#ae_3").text()).toEqual("any");

    const focusElement = {
      id: "ae_2",
      tabindex: 3,
      contenteditable: true,
    };
    wrapper.instance().focusElement = focusElement;
    wrapper.instance().deleteItem(2);
    wrapper.update();
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_2")).toHaveLength(1);
    expect(wrapper.find("#ae_2").text()).toEqual("any");
    expect(wrapper.find("#ae_3")).toHaveLength(0);
  });
});
