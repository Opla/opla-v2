/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import IntentDetail from "shared/components/intentDetail";
import displayActionEditor from "shared/components/intentDetail";

describe("components/intentDetail", () => {
  it("renders correctly", () => {
    const intent = { topic: "some intent" };
    const component = renderer.create(<IntentDetail 
    	intent={intent}
    	onSelect={jest.fn()}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can render intent with special characters correctly", () => {
    const intentcontent = [
      `{{${encodeURIComponent("{{text}}")}}}`,
      `<<${encodeURIComponent("<<var>>")}>>`,
    ].join("");
    const intent = { topic: intentcontent };
    const component = renderer.create(<IntentDetail 
    	intent={intent}
    	onSelect={jest.fn()} 
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

 	describe("displayActionEditor()", () => {
    it("should escape special characters like `{`, `}`, `<` and `>`", () => {
    	const title = "foobar";
  		const type = "condition";
  		const action = "foo";
	  	const actionDef = "Topic";//["Topic","Previous"];
	  	const parameters = {name:"foo",value:"foobar",text:"bar"};
 			const isInput = true;
    });
  });
});
