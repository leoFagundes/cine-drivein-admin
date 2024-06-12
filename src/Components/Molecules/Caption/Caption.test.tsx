import { fireEvent, render, screen } from "@testing-library/react";
import Caption from ".";

const mockFunction = jest.fn();

describe("#Caption", () => {
  test("render the caption correctly", () => {
    render(<Caption label="Clique aqui" onClick={mockFunction} />);

    const caption = screen.getByText("Clique aqui");

    expect(caption).toBeVisible();
  });

  test("mockFunction is called with click", () => {
    render(<Caption label="Clique aqui" onClick={mockFunction} />);

    const caption = screen.getByText("Clique aqui");

    fireEvent.click(caption);

    expect(mockFunction).toBeCalled();
  });
});
