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
});
