import faker from "faker";
import * as Helper from "../support/http-mocks";

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/login/, "POST");

export const mockOk = (): void => Helper.mockOk(/login/, "POST");

export const mockInvalidData = (): void =>
  Helper.mockOk(/login/, "POST", { invalid: faker.random.word() });
