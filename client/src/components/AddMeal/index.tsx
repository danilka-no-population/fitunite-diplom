/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const MealSection = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const AddMeal: React.FC<{ onMealAdded: () => void }> = ({ onMealAdded }) => {
  const [date, setDate] = useState('');
  const [breakfastProducts, setBreakfastProducts] = useState<any[]>([]);
  const [lunchProducts, setLunchProducts] = useState<any[]>([]);
  const [dinnerProducts, setDinnerProducts] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/food-items');
        setAvailableProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProducts();
  }, []);

  const handleAddProduct = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const newProduct = { productId: '', quantity: '' };
    if (mealType === 'breakfast') {
      setBreakfastProducts([...breakfastProducts, newProduct]);
    } else if (mealType === 'lunch') {
      setLunchProducts([...lunchProducts, newProduct]);
    } else {
      setDinnerProducts([...dinnerProducts, newProduct]);
    }
  };

  const handleProductChange = (
    mealType: 'breakfast' | 'lunch' | 'dinner',
    index: number,
    field: string,
    value: string
  ) => {
    if (mealType === 'breakfast') {
      const updatedProducts = [...breakfastProducts];
      updatedProducts[index][field] = value;
      setBreakfastProducts(updatedProducts);
    } else if (mealType === 'lunch') {
      const updatedProducts = [...lunchProducts];
      updatedProducts[index][field] = value;
      setLunchProducts(updatedProducts);
    } else {
      const updatedProducts = [...dinnerProducts];
      updatedProducts[index][field] = value;
      setDinnerProducts(updatedProducts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mealResponse = await api.post('/meals', {
        date,
      });

      const mealId = mealResponse.data.id;

      const addProducts = async (products: any[], mealType: 'breakfast' | 'lunch' | 'dinner') => {
        for (const product of products) {
          await api.post('/meals/products', {
            meal_id: mealId,
            product_id: product.productId,
            quantity: product.quantity,
            meal_type: mealType,
          });
        }
      };

      await addProducts(breakfastProducts, 'breakfast');
      await addProducts(lunchProducts, 'lunch');
      await addProducts(dinnerProducts, 'dinner');

      onMealAdded();
      setDate('');
      setBreakfastProducts([]);
      setLunchProducts([]);
      setDinnerProducts([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <MealSection>
        <h3>Breakfast</h3>
        {breakfastProducts.map((product, index) => (
          <div key={index}>
            <Select
              value={product.productId}
              onChange={(e) => handleProductChange('breakfast', index, 'productId', e.target.value)}
              required
            >
              <option value="" disabled>Select Product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.category})
                </option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Quantity (grams/ml)"
              value={product.quantity}
              onChange={(e) => handleProductChange('breakfast', index, 'quantity', e.target.value)}
              required
            />
          </div>
        ))}
        <Button type="button" onClick={() => handleAddProduct('breakfast')}>
          Add Product
        </Button>
      </MealSection>
      <MealSection>
        <h3>Lunch</h3>
        {lunchProducts.map((product, index) => (
          <div key={index}>
            <Select
              value={product.productId}
              onChange={(e) => handleProductChange('lunch', index, 'productId', e.target.value)}
              required
            >
              <option value="" disabled>Select Product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.category})
                </option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Quantity (grams/ml)"
              value={product.quantity}
              onChange={(e) => handleProductChange('lunch', index, 'quantity', e.target.value)}
              required
            />
          </div>
        ))}
        <Button type="button" onClick={() => handleAddProduct('lunch')}>
          Add Product
        </Button>
      </MealSection>
      <MealSection>
        <h3>Dinner</h3>
        {dinnerProducts.map((product, index) => (
          <div key={index}>
            <Select
              value={product.productId}
              onChange={(e) => handleProductChange('dinner', index, 'productId', e.target.value)}
              required
            >
              <option value="" disabled>Select Product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.category})
                </option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Quantity (grams/ml)"
              value={product.quantity}
              onChange={(e) => handleProductChange('dinner', index, 'quantity', e.target.value)}
              required
            />
          </div>
        ))}
        <Button type="button" onClick={() => handleAddProduct('dinner')}>
          Add Product
        </Button>
      </MealSection>
      <Button type="submit">Save Meal</Button>
    </Form>
  );
};

export default AddMeal;