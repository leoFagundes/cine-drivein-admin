import { render, screen } from "@testing-library/react";
import Text from ".";

describe("#Text", () => {
  test("render correct text", () => {
    render(<Text>Teste</Text>);

    const textElement = screen.getByText("Teste");

    expect(textElement).toBeVisible();
  });

  test("applies the correct class when parameters are used", () => {
    render(
      <Text
        fontAlign="justify"
        fontSize="extraLarge"
        fontWeight="bold"
        fontColor="gray-color"
      >
        Teste
      </Text>
    );

    const textElement = screen.getByText("Teste");

    expect(textElement).toHaveClass("textAlignJustify");
    expect(textElement).toHaveClass("fontSizeExtraLarge");
    expect(textElement).toHaveClass("fontWeightBold");
    expect(textElement).toHaveClass("fontColorGrayColor");
  });
});
