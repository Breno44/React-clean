import faker from "faker";
import * as Helper from "../support/http-mocks";

export const mockEmailInUse = (): void => Helper.mockEmailInUse(/signup/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, "POST");

export const mockOk = (): void => Helper.mockOk(/signup/, "POST");

export const mockInvalidData = (): void =>
  Helper.mockOk(/signup/, "POST", { invalid: faker.random.word() });
