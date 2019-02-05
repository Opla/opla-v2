/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow, render } from "enzyme";
import MessengerBoxMessageContent from "shared/components/messengerBox/messengerBoxMessageContent";
import { Button } from "zrmc";

describe("components/messengerBox", () => {
  it("sould render messages with slash", () => {
    const message = {
      body: "12/09/2018",
      conversationId: "convId00",
      created_time: 1528986208403,
      from: "bot_garbot8",
      id: "id03",
      timestamp: 1528986208,
    };
    const wrapper = shallow(
      <MessengerBoxMessageContent message={message} onSendMessage={() => {}} />,
    );
    // expect(wrapper.find(".message")).toHaveLength(1);
    expect(wrapper.text()).toEqual("12/09/2018");
  });

  it("sould render messages with slash and button", () => {
    const message = {
      body: "12/09/2018 <button>OK</button> ou  <button>NON OK</button>  ",
      conversationId: "convId00",
      created_time: 1528986208403,
      from: "bot_garbot8",
      id: "id03",
      timestamp: 1528986208,
    };
    const wrapper = shallow(
      <MessengerBoxMessageContent message={message} onSendMessage={() => {}} />,
    );
    // expect(wrapper.find(".text-wrapper")).toHaveLength(1);
    expect(wrapper.text()).toMatch("12/09/2018 <Button /> ou  <Button /> ");
    expect(wrapper.find(Button)).toHaveLength(2);
  });
  it("should render an image", () => {
    const message = {
      body: "https://via.placeholder.com/150.jpg",
      conversationId: "convId00",
      created_time: 1528986208403,
      from: "bot_garbot8",
      id: "id03",
      timestamp: 1528986208,
    };
    // Render is used here to enforce render the full dangerouslySetInnerHTML stuff
    const wrapper = render(
      <MessengerBoxMessageContent message={message} onSendMessage={() => {}} />,
    );
    expect(wrapper.text()).toMatch("");
    // expect to find a a href for clickable feature
    expect(wrapper.find("a").prop("href")).toEqual(message.body);
    // expect to find an img src, for basic inchat render
    expect(wrapper.find("img").prop("src")).toEqual(message.body);
  });
});
