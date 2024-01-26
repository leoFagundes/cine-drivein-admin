import { Input } from "./Input";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockFunction = jest.fn();

describe('#Input', () => {
    test('render correct input', () => {
        render(<Input
            value=""
            onChange={mockFunction}
            placeholder='Naruto'
        />);

        const input = screen.getByPlaceholderText('Naruto');
        expect(input).toBeVisible();
    })

    test('call fucntion when change input value', () => {
        render(<Input
            value=""
            onChange={mockFunction}
            placeholder='Naruto'
        />);

        const input = screen.getByPlaceholderText('Naruto');

        userEvent.type(input, 'Sasuke');
        expect(mockFunction).toBeCalled()
    })

    test('render correct icon component if type is password', () => {
        render(<Input
            type="password"
            value=""
            onChange={mockFunction}
            placeholder='Naruto'
        />);

        const icon = screen.getByLabelText('icone de olho');
        expect(icon).toBeVisible();
    })

    test('render correct label component if error label exist ', () => {
        render(<Input
            type="password"
            value=""
            onChange={mockFunction}
            placeholder='Naruto'
            errorLabel="error test"
        />);

        const errorLabel = screen.getByText('error test');
        expect(errorLabel).toBeVisible();
    })
});
