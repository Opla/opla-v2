/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import MessengerBox from "shared/components/messengerBox";

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
    expect(content).toEqual(["msg1", "rep1", "msg2", "rep2"]);
  });
});
