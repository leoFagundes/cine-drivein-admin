import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from ".";
import { act } from "react-dom/test-utils";

const mockFunction = jest.fn();

describe("#Dropdown", () => {
  test("render correct dropdown", () => {
    render(
      <Dropdown
        options={[]}
        value=""
        onChange={mockFunction}
        placeholder="Categoria"
      />
    );

    const dropdown = screen.getByText("Categoria");
    expect(dropdown).toBeVisible();
  });

  test("renders and handles option clicks correctly", () => {
    render(
      <Dropdown
        options={["option1", "option2"]}
        value=""
        onChange={mockFunction}
        placeholder="Categoria"
      />
    );

    const dropdown = screen.getByRole("combobox");

    act(() => {
      fireEvent.change(dropdown, { target: { value: "option1" } });
    });

    expect(mockFunction).toHaveBeenCalledWith("option1");
  });
});
