import { fireEvent, render, screen } from "@testing-library/react";
import { HorizontalItem } from ".";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";

const mockFunction = jest.fn();

describe("#HorizontalItem", () => {
  test("render the horizontalItem correctly", () => {
    render(
      <HorizontalItem
        isSelected
        label="TesteItem"
        icon={faPizzaSlice}
        onClick={mockFunction}
        marginTop="16px"
      />
    );

    const itemElement = screen.getByText("TesteItem");

    expect(itemElement).toBeVisible();
  });

  test("onClick is called with click", () => {
    render(
      <HorizontalItem
        isSelected
        label="TesteItem"
        icon={faPizzaSlice}
        onClick={mockFunction}
        marginTop="16px"
      />
    );

    const itemElement = screen.getByText("TesteItem");

    fireEvent.click(itemElement);

    expect(mockFunction).toBeCalled();
  });

  test("correct class when isSelected is true", () => {
    render(
      <HorizontalItem
        isSelected
        label="TesteItem"
        icon={faPizzaSlice}
        onClick={mockFunction}
        marginTop="16px"
      />
    );

    const itemElement = screen.getByTestId("testContainer");
    const icoElement = screen.getByTestId("testIco");

    expect(itemElement).toHaveClass("sidebarItemContainerActivate");
    expect(icoElement).toHaveClass("iconContainerActivate");
  });
});
