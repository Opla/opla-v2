/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { createFakeEvent } from "tests/helpers";
import { CreateAssistantBase } from "shared/containers/createAssistant";
import { defaultTemplates, defaultLanguages } from "shared/reducers/app";
import Zrmc from "zrmc";

beforeAll(() => {
  Zrmc.showDialog = jest.fn();
  Zrmc.closeDialog = jest.fn();
  // Zrmc.renderModal = jest.fn();
});

describe("containers/CreateAssistant", () => {
  it("renders correctly", () => {
    const appSetTitleNameSpy = jest.fn();
    const addMessage = jest.fn();
    const createBotSpy = jest.fn();
    const apiGetTemplatesSpy = jest.fn();
    const apiGetLanguagesSpy = jest.fn();
    const historySpy = { length: 0, push: jest.fn() };

    const component = renderer.create(
      <CreateAssistantBase
        isLoading={false}
        createBot={createBotSpy}
        appSetTitleName={appSetTitleNameSpy}
        apiGetTemplates={apiGetTemplatesSpy}
        apiGetLanguages={apiGetLanguagesSpy}
        templates={defaultTemplates}
        languages={defaultLanguages}
        history={historySpy}
        addMessage={addMessage}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(appSetTitleNameSpy).toHaveBeenCalled();
    expect(apiGetTemplatesSpy).toHaveBeenCalled();
    expect(apiGetLanguagesSpy).toHaveBeenCalled();
    expect(createBotSpy).not.toHaveBeenCalled();
    expect(historySpy.push).not.toHaveBeenCalled();
    expect(addMessage).not.toHaveBeenCalled();
  });

  it("should update template selected when props change", () => {
    const onSelectTemplateSpy = jest.fn();
    const newPropsTemplates = [
      { id: "abcdefgh", name: "Foo" },
      { id: "abcdefgh-251a-4e11-a907-b1f3bcc20283", name: "Empty" },
    ];
    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={jest.fn}
        appSetTitleName={jest.fn()}
        apiGetTemplates={jest.fn()}
        apiGetLanguages={jest.fn()}
        templates={defaultTemplates}
        languages={defaultLanguages}
        addMessage={jest.fn()}
        history={{ length: 0, push: jest.fn() }}
      />,
    );
    wrapper.instance().onSelectTemplate = onSelectTemplateSpy;
    wrapper.setProps({ templates: newPropsTemplates });
    expect(onSelectTemplateSpy).toHaveBeenCalledWith(1, newPropsTemplates[1]);
  });

  it("sets a message if uploaded template is not a valid json", () => {
    const addMessage = jest.fn();

    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={jest.fn}
        appSetTitleName={jest.fn()}
        apiGetTemplates={jest.fn()}
        apiGetLanguages={jest.fn()}
        templates={defaultTemplates}
        languages={defaultLanguages}
        addMessage={addMessage}
        history={{ length: 0, push: jest.fn() }}
      />,
    );

    wrapper.instance().onImportTemplate("this is not a json obviously");

    expect(addMessage).toHaveBeenCalledWith(
      "imported template is not a valid JSON document",
    );
  });

  it("selects empty template once complete template list loaded", () => {
    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={jest.fn}
        appSetTitleName={jest.fn()}
        apiGetTemplates={jest.fn()}
        apiGetLanguages={jest.fn()}
        templates={defaultTemplates}
        languages={defaultLanguages}
        addMessage={jest.fn()}
        history={{ length: 0, push: jest.fn() }}
      />,
    );

    const templates = defaultTemplates.slice();
    templates.push({
      id: "foo",
      name: "loaded template",
    });

    wrapper.setProps({ templates });

    expect(wrapper.state("template")).not.toBeNull();
    expect(wrapper.state("selectedTemplate")).not.toBeNull();
  });

  it("creates a bot with fullfilled form", () => {
    const createBotSpy = jest.fn();

    const wrapper = shallow(
      <CreateAssistantBase
        isLoading={false}
        createBot={createBotSpy}
        appSetTitleName={jest.fn()}
        addMessage={jest.fn()}
        apiGetTemplates={jest.fn()}
        apiGetLanguages={jest.fn()}
        templates={defaultTemplates}
        languages={defaultLanguages}
        history={{ length: 0, push: jest.fn() }}
      />,
    );

    expect(wrapper.state("loading")).toEqual(false);
    wrapper
      .find("#create-assistant-name")
      .simulate("change", { target: { value: "assistant-name" } });
    expect(wrapper.state("name")).toEqual("assistant-name");

    wrapper
      .find("#create-assistant-email")
      .simulate("change", { target: { value: "fake-email@opla.ai" } });
    expect(wrapper.state("email")).toEqual("fake-email@opla.ai");

    wrapper.find("#create-assistant-language").simulate("selected", "fr");
    expect(wrapper.state("language")).toEqual("fr");

    wrapper.instance().onSelectTemplate(0);

    wrapper.instance().handleCloseCreateDialog = jest.fn();
    expect(createBotSpy).not.toHaveBeenCalled();
    expect(wrapper.state("loading")).toEqual(false);

    wrapper
      .find("#create-assistant-form")
      .simulate("submit", createFakeEvent());

    expect(wrapper.state("loading")).toEqual(true);
    expect(createBotSpy).toHaveBeenCalled();
  });
});
