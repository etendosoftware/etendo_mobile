import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { FieldMode } from "../components/Field";
import { InputField } from "../components/InputField";
import FormContext from "../contexts/FormContext";
import "@testing-library/jest-dom";
import { References } from "../constants/References";

describe("Test with different inputs", () => {
  test.each`
    inputparameter                               | expected                                     | ref                           | refName
    ${"Almacenes"}                               | ${"Almacenes"}                               | ${References.Text}            | ${"Text"}
    ${""}                                        | ${""}                                        | ${References.String}          | ${"String"}
    ${"Purchase invoice"}                        | ${"Purchase invoice"}                        | ${References.Text}            | ${"Text"}
    ${"This is a description with numbers 0123"} | ${"This is a description with numbers 0123"} | ${References.Text}            | ${"Text"}
    ${"Is this a description?"}                  | ${"Is this a description?"}                  | ${References.Text}            | ${"Text"}
    ${"200"}                                     | ${200}                                       | ${References.Integer}         | ${"Integer"}
    ${"0"}                                       | ${0}                                         | ${References.Number}          | ${"Number"}
    ${"0.0"}                                     | ${0.0}                                       | ${References.Price}           | ${"Price"}
    ${"12"}                                      | ${12}                                        | ${References.Quantity}        | ${"Quantity"}
    ${"258"}                                     | ${258}                                       | ${References.GeneralQuantity} | ${"GeneralQuantity"}
    ${""}                                        | ${null}                                      | ${References.Amount}          | ${"Amount"}
    ${"0.01"}                                    | ${0.01}                                      | ${References.Amount}          | ${"Amount"}
    ${"0.000001"}                                | ${0.000001}                                  | ${References.Amount}          | ${"Amount"}
    ${"02/03/1996"}                              | ${"02/03/1996"}                              | ${References.Date}            | ${"Date"}
    ${"Test"}                                    | ${null}                                      | ${References.Number}          | ${"Number"}
    ${"Test text input"}                         | ${null}                                      | ${References.Amount}          | ${"Amount"}
    ${"zero tree one"}                           | ${null}                                      | ${References.Quantity}        | ${"Quantity"}
  `(
    "Write $inputparameter in the input with the reference $refName and the onChangeInput function returns: $expected",
    async ({ inputparameter, expected, ref }) => {
      // Given: A TextInput
      let field = {
        id: "",
        name: "",
        readOnly: false,
        column: {
          updatable: true
        },
        columnName: ""
      };
      let onblur: any;
      const onChangeInput = jest.fn();
      const { getByTestId } = await waitFor(() =>
        render(
          <FormContext.Provider value={{ onChangeInput: onChangeInput }}>
            <InputField
              field={field}
              onBlur={onblur}
              inputMode={FieldMode.horizontal}
              referenceKey={ref}
            />
          </FormContext.Provider>
        )
      );
      // When: Data is written in the input
      const inputTextBox = getByTestId("input-text-box");
      await fireEvent.changeText(inputTextBox, inputparameter);
      const returned = {
        column: { updatable: true },
        columnName: "",
        id: "",
        name: "",
        readOnly: false
      };
      // Then: onChangeInput returns the value that has been typed in the input
      expect(onChangeInput).toBeCalledWith(returned, expected);
    }
  );
});

describe("Test to clean an input", () => {
  test("Write text in an input and then clean it, the input has no content", async () => {
    // Given: A TextInput
    let field = {
      id: "",
      name: "",
      readOnly: false,
      column: {
        updatable: true
      },
      columnName: ""
    };
    let onblur: any;
    const onChangeInput = jest.fn();
    const { getByTestId } = await waitFor(() =>
      render(
        <FormContext.Provider value={{ onChangeInput: onChangeInput }}>
          <InputField
            field={field}
            onBlur={onblur}
            inputMode={FieldMode.horizontal}
          />
        </FormContext.Provider>
      )
    );
    // When: You put a text in an input
    const inputTextBox = getByTestId("input-text-box");
    await fireEvent.changeText(inputTextBox, "New description");
    const returned = {
      column: { updatable: true },
      columnName: "",
      id: "",
      name: "",
      readOnly: false
    };
    expect(onChangeInput).toBeCalledWith(returned, "New description");
    // And: clean the input
    await fireEvent.changeText(inputTextBox, " ");
    // Then: returns an empty string
    expect(onChangeInput).toBeCalledWith(returned, " ");
  });
});

describe("Test if a field is editable", () => {
  test.each`
    nameRO             | isRO     | expected
    ${"not read only"} | ${false} | ${true}
    ${"read only"}     | ${true}  | ${false}
  `(
    "If the TextInput is $nameRO (readOnly: $isRO), the 'editable' prop is $expected",
    async ({ isRO, expected }) => {
      // Given: A TextInput
      let field = {
        id: "",
        name: "",
        readOnly: isRO,
        column: {
          updatable: true
        },
        columnName: ""
      };
      let onblur: any;
      const onChangeInput = jest.fn();
      const { getByTestId } = await waitFor(() =>
        render(
          <FormContext.Provider value={{ onChangeInput: onChangeInput }}>
            <InputField
              field={field}
              onBlur={onblur}
              inputMode={FieldMode.horizontal}
            />
          </FormContext.Provider>
        )
      );
      const inputTextBox = getByTestId("input-text-box");
      // Then: The editable prop is true if the input is not readOnly; and false if the input is readOnly
      expect(inputTextBox.props.editable).toBe(expected);
    }
  );
});
