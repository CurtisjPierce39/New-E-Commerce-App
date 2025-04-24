import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '../components/ProductForm';
import { productService } from '../store/productService';

jest.mock('../store/productService', () => ({//creates mock for productService
    productService: {
        createProduct: jest.fn().mockResolvedValue({//mocks createProduct function
            //returns a promise that resolves to an object with id, name, price, description, stock, imageUrl, and category
            id: '101',
            name: 'T Shirt',
            price: 0,
            description: 'White T Shirt',
            stock: 0,
            imageUrl: 'unsplash.com/tshirt',
            category: 'Mens Clothing'
        })
    }
}));

beforeEach(() => {//clears all mocks before each test
    jest.clearAllMocks();
});

describe('ProductForm', () => {//renders ProductForm component
    test('submits the form data correctly', async () => {//tests if form data is submitted correctly
        render(<ProductForm />);
        //mocks user input for form data
        fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'T Shirt' } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'White T Shirt' } });
        fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: 'unsplash.com/tshirt' } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Mens Clothing' } });

        const form = screen.getByRole('form');//mocks submitting form
        fireEvent.submit(form);

        await waitFor(() => {//expects createProduct function to have been called with correct data
            const expectedData = {
                name: 'T Shirt',
                price: 0,
                description: 'White T Shirt',
                stock: 0,
                imageUrl: 'unsplash.com/tshirt',
                category: 'Mens Clothing'
            };
            const createProductFn = () => productService.createProduct;
            expect(createProductFn()).toHaveBeenCalledTimes(1);
            expect(createProductFn()).toHaveBeenCalledWith(expectedData);
        });
    });
});