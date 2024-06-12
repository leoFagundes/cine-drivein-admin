import { fireEvent, render, screen } from "@testing-library/react";
import RegisterCard from ".";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const mockFunction = jest.fn();

describe("#RegisterCard", () => {
  test("test", () => {
    render(
      <RegisterCard
        label="Texto principal"
        description="Texto de descrição"
        icon={<FontAwesomeIcon icon={faPizzaSlice} />}
        onClick={mockFunction}
      />
    );

    const cardElement = screen.getByText("Texto principal");

    expect(cardElement).toBeVisible();
  });

  test("onClick is called with click", () => {
    render(
      <RegisterCard
        label="Texto principal"
        description="Texto de descrição"
        icon={<FontAwesomeIcon icon={faPizzaSlice} />}
        onClick={mockFunction}
      />
    );

    const cardElement = screen.getByText("Texto principal");

    fireEvent.click(cardElement);

    expect(cardElement).toBeVisible();
  });

  test("correct class when isActive is true", () => {
    render(
      <RegisterCard
        label="Texto principal"
        description="Texto de descrição"
        icon={<FontAwesomeIcon icon={faPizzaSlice} />}
        onClick={mockFunction}
        isActive
      />
    );

    const cardElement = screen.getByTestId("testContainer");

    expect(cardElement).toHaveClass("isActiveContainer");
  });
});
