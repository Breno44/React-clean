import { fireEvent, screen } from "@testing-library/react";
import faker from "faker";

export const testChildCount = (fieldName: string, count: number): void => {
  const el = screen.getByRole(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = screen.getByRole(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (
  fieldName: string,
  validationError: string = ""
): void => {
  const wrap = screen.getByRole(`${fieldName}-wrap`);
  const field = screen.getByRole(fieldName);
  const label = screen.getByRole(`${fieldName}-label`);

  expect(wrap.getAttribute("data-status")).toBe(
    validationError ? "invalid" : "valid"
  );
  expect(field.title).toBe(validationError);
  expect(label.title).toBe(validationError);
};

export const populateField = (
  fieldName: string,
  value = faker.random.word()
): void => {
  const el = screen.getByRole(fieldName);
  fireEvent.input(el, {
    target: { value: value },
  });
};

export const testElementsExists = (fieldName: string): void => {
  const el = screen.getByRole(fieldName);
  expect(el).toBeTruthy();
};
