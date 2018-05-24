/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { mount } from "enzyme";

import { IntentContainerBase } from "shared/containers/intentContainer";
import ActionsEditable from "shared/components/actionsEditable";

describe("containers/IntentContainerBase", () => {
  const defaultProps = {
    appUpdateIntent: () => {},
    appSetIntentAction: () => {},
    appDeleteIntentAction: () => {},
    apiSendIntentRequest: () => {},
    selectedIntent: {
      id: "Nq421",
      botId: "HZAw",
      name: "Emballages produits ménagers",
      input: [
        "* Produits ménagers ",
        "* Produits ménagers *",
        "Produits ménagers *",
        "*Liquide vaisselle",
        "* Nettoyant*",
      ],
      output: ["La plupart des emballages de produits ménagers se placent..."],
      order: 10,
    },
  };

  const newSelectedIntent = {
    id: "a34Dg",
    botId: "Wc34w",
    name: "Carton",
    input: ["* carton", "* Emballages carton*"],
    output: ["Les emballages carton..."],
    order: 3,
  };

  it("should render", () => {
    const wrapper = mount(<IntentContainerBase {...defaultProps} />);
    wrapper.update();
    expect(wrapper.find(ActionsEditable)).toHaveLength(8);
    expect(
      wrapper
        .find(ActionsEditable)
        .at(0)
        .props().content,
    ).toEqual(defaultProps.selectedIntent.input[0]);
  });

  it("should reset when props.selectedIntent change", () => {
    const resetSpy = jest.fn();
    const wrapper = mount(<IntentContainerBase {...defaultProps} />);
    wrapper.instance().reset = resetSpy;
    wrapper.update();
    wrapper.setProps({
      selectedIntent: newSelectedIntent,
    });
    expect(resetSpy).toHaveBeenCalled();
  });

  describe("handleChangeAction", () => {
    it("should not call appSetIntentAction when new intent action doesnt have a value", () => {
      const appSetIntentActionSpy = jest.fn();
      const wrapper = mount(
        <IntentContainerBase
          {...defaultProps}
          appSetIntentAction={appSetIntentActionSpy}
        />,
      );

      // TODO refactor method to use params with default value instead of this.variable
      wrapper.instance().actionContainer = "input";
      wrapper.instance().selectedAction = undefined;

      const text = undefined;
      const name = undefined;
      const value = undefined;
      wrapper.instance().handleChangeAction(text, name, value);

      expect(appSetIntentActionSpy).not.toHaveBeenCalled();
    });

    it("sould call appSetIntentAction when intent action is edited", () => {
      const appSetIntentActionSpy = jest.fn();
      const wrapper = mount(
        <IntentContainerBase
          {...defaultProps}
          appSetIntentAction={appSetIntentActionSpy}
        />,
      );

      // TODO refactor method to use params with default value instead of this.variable
      wrapper.instance().actionContainer = "input";
      wrapper.instance().selectedAction = 1;

      const text = "* ménagers *";
      const name = null;
      const value = null;
      wrapper.instance().handleChangeAction(text, name, value);

      expect(appSetIntentActionSpy).toHaveBeenCalled();
      expect(appSetIntentActionSpy.mock.calls[0][0]).toEqual("input");
      expect(appSetIntentActionSpy.mock.calls[0][1]).toEqual(undefined);
      expect(appSetIntentActionSpy.mock.calls[0][2]).toEqual(text);
      expect(appSetIntentActionSpy.mock.calls[0][3]).toBe(1);
    });

    it("should call appSetIntentAction when new intent action saved", () => {
      const appSetIntentActionSpy = jest.fn();
      const wrapper = mount(
        <IntentContainerBase
          {...defaultProps}
          appSetIntentAction={appSetIntentActionSpy}
        />,
      );

      // TODO refactor method to use params with default value instead of this.variable
      wrapper.instance().actionContainer = "input";
      wrapper.instance().selectedAction = undefined;

      const text = "* new action *";
      const name = undefined;
      const value = undefined;
      wrapper.instance().handleChangeAction(text, name, value);

      expect(appSetIntentActionSpy).toHaveBeenCalled();
      expect(appSetIntentActionSpy.mock.calls[0][0]).toEqual("input");
      expect(appSetIntentActionSpy.mock.calls[0][1]).toEqual(undefined);
      expect(appSetIntentActionSpy.mock.calls[0][2]).toEqual(text);
      expect(appSetIntentActionSpy.mock.calls[0][3]).toBe(undefined);
    });

    // TODO find the case where this.actionType === "condition" and test it
  });
});
