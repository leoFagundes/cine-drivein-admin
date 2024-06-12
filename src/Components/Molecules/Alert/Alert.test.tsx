import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Alert from ".";

const mockFunction = jest.fn();
const mockSetIsAlertOpen = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("#Alert", () => {
  test("render the alert correctly", () => {
    render(
      <Alert
        isAlertOpen={true}
        setIsAlertOpen={mockSetIsAlertOpen}
        message="Alerta de teste"
        alertDisplayTime={5000}
        onClose={mockFunction}
        type="success"
      />
    );

    const alert = screen.getByText("Alerta de teste");

    expect(alert).toBeVisible();
  });

  test("close alert when 'X' is clicked", () => {
    render(
      <Alert
        isAlertOpen={true}
        setIsAlertOpen={mockSetIsAlertOpen}
        message="Alerta de teste"
        alertDisplayTime={5000}
        onClose={mockFunction}
        type="success"
      />
    );

    const alertCloseIco = screen.getByTestId("closeIco");

    fireEvent.click(alertCloseIco);

    expect(mockSetIsAlertOpen).toHaveBeenCalledWith(false);
  });

  test("close alert after 1000ms", async () => {
    render(
      <Alert
        isAlertOpen={true}
        setIsAlertOpen={mockSetIsAlertOpen}
        message="Alerta de teste"
        alertDisplayTime={1000}
        onClose={mockFunction}
        type="success"
      />
    );

    const alert = screen.getByText("Alerta de teste");

    expect(alert).toBeVisible();

    await waitFor(
      () => {
        expect(mockFunction).toBeCalled();
      },
      { timeout: 1100 }
    );
  });
});
