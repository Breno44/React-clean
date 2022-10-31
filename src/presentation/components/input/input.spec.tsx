import { render, RenderResult, screen } from "@testing-library/react";
import React from "react";
import Input from "./input";
import Context from "@/presentation/contexts/form/form-context";

const makeSut = (): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name="field" />
    </Context.Provider>
  );
};

describe("Input component", () => {
  test("Should begin with readOnly", () => {
    makeSut();
    const input = screen.getByRole("field") as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });
});
