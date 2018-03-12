/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";

import { CreateAssistantBase } from "shared/containers/createAssistant";

describe("containers/CreateAssistant", () => {
  it("renders correctly", () => {
    const appSetTitleSpy = jest.fn();
    const createBotSpy = jest.fn();
    const historySpy = { length: 0, push: jest.fn() };

    const component = renderer.create(
      <CreateAssistantBase
        isLoading={false}
        createBot={createBotSpy}
        appSetTitle={appSetTitleSpy}
        history={historySpy}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(appSetTitleSpy).toHaveBeenCalled();
    expect(createBotSpy).not.toHaveBeenCalled();
    expect(historySpy.push).not.toHaveBeenCalled();
  });
});
