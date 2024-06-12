import { render, screen } from "@testing-library/react";
import { Loading } from ".";

describe("#Loading", () => {
  test("renders loading component with correct class", () => {
    render(<Loading />);

    const loadingElement = screen.getByTestId("loading-element");
    expect(loadingElement).toBeInTheDocument();
  });
});
