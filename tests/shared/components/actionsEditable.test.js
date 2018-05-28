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

  const testActionIdAndContent = (wrapper, id, length, text) => {
    const selector = `ActionEditable[actionId="${id}"]`;
    expect(wrapper.find(selector)).toHaveLength(length);
    if (text) {
      expect(wrapper.find(selector).props().text).toEqual(text);
    }
  };

  it("renders correctly", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_content")).toHaveLength(1);
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 0);
  });

  it("should insert an item", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(3);
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 0);

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
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 0);
  });

  it("should request to move focus after item inserted", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(3);

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
    expect(wrapper.state("itemToFocus")).toEqual(2);
    wrapper.update();
  });

  it("should insert an item at end", () => {
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} content="* bons gestes composteur " />,
    );

    expect(wrapper.state("items")).toHaveLength(2);
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 0);

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
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 0);
  });

  it("should delete an item", () => {
    const wrapper = shallow(
      <ActionsEditable
        {...defaultProps}
        content="* bons gestes composteur **"
      />,
    );
    expect(wrapper.state("items")).toHaveLength(4);
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 0);

    const focusElement = {
      id: "ae_2",
      tabindex: 3,
      contenteditable: true,
    };
    wrapper.instance().focusElement = focusElement;
    wrapper.instance().deleteItem(2);
    wrapper.update();
    expect(wrapper.state("items")).toHaveLength(3);
    testActionIdAndContent(wrapper, "ae_0", 1, "*");
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");
    testActionIdAndContent(wrapper, "ae_2", 1, "*");
    testActionIdAndContent(wrapper, "ae_3", 0);
  });

  it("should call clear() on Enter key pressed", () => {
    const clearSpy = jest.fn();
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} content={null} isNew />,
    );
    wrapper.instance().clear = clearSpy;
    wrapper.instance().handleKeyPress({ which: 13, preventDefault: () => {} });
    expect(clearSpy).toHaveBeenCalled();
  });

  it("should clear state content on clear()", () => {
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} content={null} isNew />,
    );

    // no content rendered
    expect(wrapper.state("items")).toHaveLength(0);

    // set state to simulate actionsEditable updates
    const state = {
      content: "* bons gestes composteur *",
      items: [
        { type: "any", text: "*" },
        { type: "text", text: " bons gestes composteur " },
        { type: "any", text: "*" },
      ],
      selectedItem: 1,
      caretPosition: 3,
      noUpdate: false,
      startSpan: null,
      endSpan: null,
      itemToFocus: null,
    };
    wrapper.setState(state);

    // after state update, 3 items are rendered
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_content")).toHaveLength(1);
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");

    wrapper.instance().clear();
    // after clear no content rendered
    expect(wrapper.state("items")).toHaveLength(0);
  });
});
