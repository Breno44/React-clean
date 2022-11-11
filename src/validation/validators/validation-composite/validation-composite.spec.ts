import faker from "faker";
import { FieldValidationSpy } from "@/validation/test/mock-field-validation";
import { ValidationComposite } from "./validation-composite";

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationSpy: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];
  const sut = ValidationComposite.build(fieldValidationSpy);
  return {
    sut,
    fieldValidationSpy,
  };
};

describe("ValidationComposite", () => {
  test("Should return error if any validation fails", () => {
    const fieldName = faker.database.column();
    const { sut, fieldValidationSpy } = makeSut(fieldName);
    const errorMessage = faker.random.word();
    fieldValidationSpy[0].error = new Error(errorMessage);
    fieldValidationSpy[1].error = new Error(faker.random.word());
    const error = sut.validate(fieldName, { [fieldName]: faker.random.word() });
    expect(error).toBe(errorMessage);
  });

  test("Should return error if any validation fails", () => {
    const fieldName = faker.database.column();
    const { sut } = makeSut(fieldName);
    const error = sut.validate(fieldName, { [fieldName]: faker.random.word() });
    expect(error).toBeFalsy();
  });
});
