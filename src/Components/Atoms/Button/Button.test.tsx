import Button from "./index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockFunction = jest.fn();

describe("#Button", () => {
  test("renders the button with the correct label", () => {
    render(<Button onClick={() => ""} label="MyButton" />);
    const button = screen.getByText("MyButton");
    expect(button).toBeVisible();
  });

  test("calls the onClick handler when clicked", () => {
    render(<Button onClick={mockFunction} label="MyButton" />);
    const button = screen.getByText("MyButton");

    userEvent.click(button);
    expect(mockFunction).toHaveBeenCalled();
  });

  test("change to correct color", () => {
    render(
      <Button
        onClick={mockFunction}
        label="MyButton"
        backGroundColor="invalid-color"
      />
    );

    const button = screen.getByRole("button", { name: "MyButton" });
    expect(button).toHaveClass("backgroundInvalidColor");
  });
});
