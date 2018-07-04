/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import MessengerBox from "shared/components/messengerBox";
import { Button } from "zrmc";

describe("components/messengerBox", () => {
  const defaultProps = {
    messages: [
      {
        body: "msg1",
        conversationId: "convId00",
        created_time: 1528986206304,
        from: "b8",
        id: "id00",
        timestamp: 1528986207,
      },
      {
        body: "rep1",
        conversationId: "convId00",
        created_time: 1528986206964,
        from: "bot_garbot8",
        id: "id01",
        response_speed: 9,
        timestamp: 1528986208,
      },
      {
        body: "msg2",
        conversationId: "convId00",
        created_time: 1528986208390,
        from: "b8",
        id: "id00",
        timestamp: 1528986209,
      },
      {
        body: "rep2",
        conversationId: "convId00",
        created_time: 1528986208403,
        from: "bot_garbot8",
        id: "id03",
        timestamp: 1528986208,
      },
    ],
    users: {
      b8: {},
      bot_garbot8: {},
      opla: {},
    },
    onSendMessage: () => {},
    onAction: () => {},
  };

  it("should render messages in right order", () => {
    const wrapper = shallow(<MessengerBox {...defaultProps} />);

    expect(wrapper.find(".message")).toHaveLength(4);
    const content = wrapper.find(".message").map((node) => node.text());
    expect(content).toEqual([
      "msg1<Icon />#NotFoundIntent..output",
      "rep1<Icon />#NotFoundIntent..output",
      "msg2<Icon />#NotFoundIntent..output",
      "rep2<Icon />#NotFoundIntent..output",
    ]);
  });

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
      <MessengerBox {...defaultProps} messages={[message]} />,
    );
    expect(wrapper.find(".message")).toHaveLength(1);
    expect(wrapper.find(".message").text()).toEqual(
      "12/09/2018<Icon />#NotFoundIntent..output",
    );
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
      <MessengerBox {...defaultProps} messages={[message]} />,
    );
    expect(wrapper.find(".text-wrapper")).toHaveLength(1);
    expect(wrapper.find(".text-wrapper").text()).toMatch(
      "12/09/2018 <Button /> ou  <Button />  <Icon />#NotFoundIntent..output",
    );
    expect(wrapper.find(Button)).toHaveLength(2);
  });
});
