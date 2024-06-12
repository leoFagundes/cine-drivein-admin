import { fireEvent, render, screen } from "@testing-library/react";
import CheckBox from ".";

describe("#CheckBox", () => {
  test("render correct checkbox", () => {
    const handleChange = jest.fn();

    render(<CheckBox checked onChange={handleChange} id="" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
  });
});
