import axios from 'axios';

const BASE_URL = 'http://localhost:3000/products';

export const fetchProducts = async () => {
    const { data } = await axios.get(BASE_URL);
    return data;
};

export const createProduct = async (newProduct: { name: string; price: number }) => {
    const { data } = await axios.post(BASE_URL, newProduct);
    return data;
};
