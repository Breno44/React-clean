import faker from "faker";
import * as Helper from "../support/http-mocks";

export const mockEmailInUse = (): void => Helper.mockEmailInUse(/signup/);
