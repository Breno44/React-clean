import { FieldValidation } from "@/validation/protocols/field-validation";
import { InvalidFieldError } from "@/validation/errors";

export class CompareFieldsValidation implements FieldValidation {
  constructor(
    readonly field: string,
    private readonly valueToCompare: string
  ) {}

  validate(value: string): any {
    return value !== this.valueToCompare ? new InvalidFieldError() : null;
  }
}
