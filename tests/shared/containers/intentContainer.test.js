/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { mount, shallow } from "enzyme";

import { IntentContainerBase } from "shared/containers/intentContainer";
import ActionsEditable from "shared/components/actionsEditable";
import * as intentDetail from "shared/components/intentDetail";
import Zrmc from "zrmc";

beforeAll(() => {
  Zrmc.showDialog = jest.fn();
});

jest.useFakeTimers();

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
    const wrapper = shallow(<IntentContainerBase {...defaultProps} />);
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
      const wrapper = shallow(
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
      const wrapper = shallow(
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
      const wrapper = shallow(
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

  describe("handleEdit", () => {
    describe("on intentDetail new/add item selected", () => {
      const args = {
        editing: true,
        actionsComponent: {
          props: {
            name: "input",
          },
        },
      };

      it("should set component fields and state", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        expect(wrapper.state().editing).toBe(false);
        wrapper.instance().handleEdit(args.editing, args.actionsComponent);

        // should set this.actionsComponent
        expect(wrapper.instance().actionsComponent).toEqual(
          args.actionsComponent,
        );

        // should set editing state
        expect(wrapper.state().editing).toBe(false);
        jest.runAllTimers();
        wrapper.update();
        expect(wrapper.state().editing).toBe(true);
      });

      // TODO move to general render test drived by state and props only
      it("should display limited Toolbox", () => {
        const wrapper = mount(<IntentContainerBase {...defaultProps} />);
        wrapper.update();
        expect(wrapper.find(ActionsEditable)).toHaveLength(8);

        expect(wrapper.state().editing).toBe(false);
        wrapper.instance().handleEdit(args.editing, args.actionsComponent);
        jest.runAllTimers();
        wrapper.update();

        expect(wrapper.find("Tooltip")).toHaveLength(4);
        const isInputActionIds = [
          "#atb_text",
          "#atb_any",
          "#atb_output_var",
          "#atb_trash",
        ];

        isInputActionIds.forEach((actionId, index) => {
          try {
            expect(
              wrapper
                .find("Tooltip")
                .at(index)
                .find(`Icon${actionId}`),
            ).toHaveLength(1);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("at index", index, "cant find actionId", actionId);
            throw e;
          }
        });
      });
    });

    describe("on intentDetail first item selected", () => {
      const args = {
        editing: false,
        actionsComponent: {
          props: {
            name: "input",
          },
        },
      };

      it("should set component fields and state editing", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        expect(wrapper.state().editing).toBe(false);
        wrapper.instance().handleEdit(args.editing, args.actionsComponent);

        // should NOT set this.actionsComponent
        expect(wrapper.instance().actionsComponent).not.toEqual(
          args.actionsComponent,
        );

        // should set editing state
        jest.runAllTimers();
        wrapper.update();
        expect(wrapper.state().editing).toBe(false);
      });

      // TODO move to general render test drived by state and props only
      it("should not display Toolbox", () => {
        const wrapper = mount(<IntentContainerBase {...defaultProps} />);
        wrapper.update();
        expect(wrapper.find(ActionsEditable)).toHaveLength(8);

        expect(wrapper.state().editing).toBe(false);
        wrapper.instance().handleEdit(args.editing, args.actionsComponent);
        jest.runAllTimers();
        wrapper.update();

        expect(wrapper.find("Tooltip")).toHaveLength(0);
      });
    });
  });

  describe("handleActions", () => {
    describe("on intentDetail item selected", () => {
      const args = {
        name: "input",
        type: undefined,
        state: "select",
        index: 1,
      };

      it("should set component fields and state", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        // should set this.actionContainer
        // should set this.actionType
        // should set this.selectedAction
        expect(wrapper.instance().actionContainer).toEqual(args.name);
        expect(wrapper.instance().actionType).toEqual(args.type);
        expect(wrapper.instance().selectedAction).toEqual(args.index);

        // can have diff parameters if type === 'condition'

        // should set editing state
        expect(wrapper.state().editing).toBe(true);
      });

      it("should call displayActionEditor", () => {
        // mock displayActionEditor function
        const displayActionEditorSpy = jest.fn();
        // eslint-disable-next-line import/namespace
        intentDetail.displayActionEditor = displayActionEditorSpy;
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        expect(displayActionEditorSpy).toHaveBeenCalled();
        const expectedActionEditorArgs = {
          title: "Edit input item",
          type: undefined,
          action: "Change",
          actionDef: "Change",
          parameters: "* Produits ménagers *",
          function: () => {},
          handleEditAction: () => {},
          handleChangeAction: () => {},
          isInput: true,
        };
        expect(displayActionEditorSpy.mock.calls[0][0]).toEqual(
          expectedActionEditorArgs.title,
        );
        expect(displayActionEditorSpy.mock.calls[0][1]).toEqual(
          expectedActionEditorArgs.type,
        );
        expect(displayActionEditorSpy.mock.calls[0][2]).toEqual(
          expectedActionEditorArgs.action,
        );
        expect(displayActionEditorSpy.mock.calls[0][3]).toEqual(
          expectedActionEditorArgs.actionDef,
        );
        expect(displayActionEditorSpy.mock.calls[0][4]).toEqual(
          expectedActionEditorArgs.parameters,
        );
        expect(displayActionEditorSpy.mock.calls[0][8]).toEqual(
          expectedActionEditorArgs.isInput,
        );
      });
    });

    describe("on intentDetail item delete", () => {
      const args = {
        name: "input",
        type: undefined,
        state: "delete",
        index: 2,
      };

      it("should set component fields and state", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        // should set this.actionContainer
        // should set this.actionType
        // should set this.selectedAction
        expect(wrapper.instance().actionContainer).toEqual(args.name);
        expect(wrapper.instance().actionType).toEqual(args.type);
        expect(wrapper.instance().selectedAction).toEqual(args.index);

        // can have diff parameters if type === 'condition'

        // should set editing state
        expect(wrapper.state().editing).toBe(false);
      });

      it("should call Zrmc.showDialog", () => {
        const showDialogSpy = jest.fn();
        Zrmc.showDialog = showDialogSpy;
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        expect(showDialogSpy).toHaveBeenCalled();
        expect(showDialogSpy.mock.calls[0][0].actions[1].name).toEqual(
          "Delete",
        );
      });
    });

    describe("on intentDetail parameters topic selected", () => {
      const args = {
        // name: "Emballages produits ménagers",
        name: defaultProps.selectedIntent.name,
        type: undefined,
        state: "topic",
        index: undefined,
      };

      it("should set component fields and state", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        // should set this.actionContainer
        // should set this.actionType
        // should set this.selectedAction
        expect(wrapper.instance().actionContainer).toEqual(args.name);
        expect(wrapper.instance().actionType).toEqual(args.type);
        expect(wrapper.instance().selectedAction).toEqual(args.index);

        // can have diff parameters if type === 'condition'

        // should set editing state
        expect(wrapper.state().editing).toBe(true);
      });

      it("should call displayActionEditor", () => {
        // mock displayActionEditor function
        const displayActionEditorSpy = jest.fn();
        // eslint-disable-next-line import/namespace
        intentDetail.displayActionEditor = displayActionEditorSpy;
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        expect(displayActionEditorSpy).toHaveBeenCalled();
        const expectedActionEditorArgs = {
          title: "Set topic name",
          type: undefined,
          action: "Set",
          actionDef: "Topic",
          parameters: "*",
          function: () => {},
          handleEditAction: () => {},
          handleChangeAction: () => {},
          isInput: false,
        };
        expect(displayActionEditorSpy.mock.calls[0][0]).toEqual(
          expectedActionEditorArgs.title,
        );
        expect(displayActionEditorSpy.mock.calls[0][1]).toEqual(
          expectedActionEditorArgs.type,
        );
        expect(displayActionEditorSpy.mock.calls[0][2]).toEqual(
          expectedActionEditorArgs.action,
        );
        expect(displayActionEditorSpy.mock.calls[0][3]).toEqual(
          expectedActionEditorArgs.actionDef,
        );
        expect(displayActionEditorSpy.mock.calls[0][4]).toEqual(
          expectedActionEditorArgs.parameters,
        );
        expect(displayActionEditorSpy.mock.calls[0][8]).toEqual(
          expectedActionEditorArgs.isInput,
        );
      });
    });

    describe("on intentDetail parameters Previous selected", () => {
      const args = {
        // name: "Emballages produits ménagers",
        name: defaultProps.selectedIntent.name,
        type: undefined,
        state: "previous",
        index: undefined,
      };

      it("should set component fields and state", () => {
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        // should set this.actionContainer
        // should set this.actionType
        // should set this.selectedAction
        expect(wrapper.instance().actionContainer).toEqual(args.name);
        expect(wrapper.instance().actionType).toEqual(args.type);
        expect(wrapper.instance().selectedAction).toEqual(args.index);

        // can have diff parameters if type === 'condition'

        // should set editing state
        expect(wrapper.state().editing).toBe(true);
      });

      it("should call displayActionEditor", () => {
        // mock displayActionEditor function
        const displayActionEditorSpy = jest.fn();
        // eslint-disable-next-line import/namespace
        intentDetail.displayActionEditor = displayActionEditorSpy;
        const wrapper = shallow(<IntentContainerBase {...defaultProps} />);

        // set this.actionContainer
        wrapper.instance().actionContainer = undefined;

        wrapper.instance().handleActions(args);

        expect(displayActionEditorSpy).toHaveBeenCalled();
        const expectedActionEditorArgs = {
          title: "Set previous intent",
          type: undefined,
          action: "Set",
          actionDef: "Previous",
          parameters: undefined,
          function: () => {},
          handleEditAction: () => {},
          handleChangeAction: () => {},
          isInput: false,
        };
        expect(displayActionEditorSpy.mock.calls[0][0]).toEqual(
          expectedActionEditorArgs.title,
        );
        expect(displayActionEditorSpy.mock.calls[0][1]).toEqual(
          expectedActionEditorArgs.type,
        );
        expect(displayActionEditorSpy.mock.calls[0][2]).toEqual(
          expectedActionEditorArgs.action,
        );
        expect(displayActionEditorSpy.mock.calls[0][3]).toEqual(
          expectedActionEditorArgs.actionDef,
        );
        expect(displayActionEditorSpy.mock.calls[0][4]).toEqual(
          expectedActionEditorArgs.parameters,
        );
        expect(displayActionEditorSpy.mock.calls[0][8]).toEqual(
          expectedActionEditorArgs.isInput,
        );
      });
    });
  });
});
