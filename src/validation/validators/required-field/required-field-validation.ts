import { RequiredFieldError } from "@/validation/errors/required-field-error";
import { FieldValidation } from "@/validation/protocols/field-validation";

export class RequiredFieldValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(value: string): any {
    if (value) return;

    return new RequiredFieldError();
  }
}
