/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import ScrollReveal from '../ScrollReveal';

const Form = styled.form`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px;
  }
  
  &[type="date"] {
    max-width: 1250px;
  }
  
  &[type="number"] {
    max-width: 150px;
  }
`;

const Select = styled.select`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px;
  }
`;

const Button = styled.button`
  padding: clamp(10px, 2vw, 15px) clamp(15px, 4vw, 25px);
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #046b2d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MealSection = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: #f5f9ff;
  border: 1px solid #e0e9ff;
`;

const SectionTitle = styled.h3`
  color: #05396B;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;


const ProductItem = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const RemoveButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#A80003' : '#A80003'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px 15px;
  }
  
  &:hover {
    background-color: ${props => props.type === 'button' ? '#930204' : '#930204'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #A80003;
  background-color: rgba(168, 0, 3, 0.1);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AddMeal: React.FC<{ onMealAdded: () => void }> = ({ onMealAdded }) => {
  const [date, setDate] = useState('');
  const [breakfastProducts, setBreakfastProducts] = useState<any[]>([]);
  const [lunchProducts, setLunchProducts] = useState<any[]>([]);
  const [dinnerProducts, setDinnerProducts] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');
  const [isMobileTiny, setIsMobileTiny] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileTiny(window.innerWidth < 375);
    };

    handleResize(); // инициализация на монтировании
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        setErrorField('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const handleRemoveProduct = (mealType: 'breakfast' | 'lunch' | 'dinner', index: number) => {
    if (mealType === 'breakfast') {
      setBreakfastProducts(breakfastProducts.filter((_, i) => i !== index));
    } else if (mealType === 'lunch') {
      setLunchProducts(lunchProducts.filter((_, i) => i !== index));
    } else {
      setDinnerProducts(dinnerProducts.filter((_, i) => i !== index));
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

  const validateForm = () => {
    // Проверка даты
    if (!date) {
      setError('Вы не выбрали дату');
      setErrorField('date');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      setError('Нельзя указать дату позже сегодняшнего дня');
      setErrorField('date');
      return false;
    }

    // Проверка наличия хотя бы одного продукта
    const hasProducts = breakfastProducts.length > 0 || lunchProducts.length > 0 || dinnerProducts.length > 0;
    if (!hasProducts) {
      setError('Добавьте хотя бы один продукт в один из приемов пищи');
      setErrorField('products');
      return false;
    }

    // Проверка выбора продуктов
    const hasEmptyProducts = 
      breakfastProducts.some(p => !p.productId) || 
      lunchProducts.some(p => !p.productId) || 
      dinnerProducts.some(p => !p.productId);
    
    if (hasEmptyProducts) {
      setError('В одном из полей не выбран продукт');
      setErrorField('product-select');
      return false;
    }

    // Проверка количества
    const hasInvalidQuantity = 
      breakfastProducts.some(p => !p.quantity || parseInt(p.quantity) <= 0 || parseInt(p.quantity) > 3000) || 
      lunchProducts.some(p => !p.quantity || parseInt(p.quantity) <= 0 || parseInt(p.quantity) > 3000) || 
      dinnerProducts.some(p => !p.quantity || parseInt(p.quantity) <= 0 || parseInt(p.quantity) > 3000);
    
    if (hasInvalidQuantity) {
      setError('В одном из полей неправильно или не указано количество');
      setErrorField('quantity');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField('');

    if (!validateForm()) return;

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
      setError('Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <ScrollReveal>
      <Form onSubmit={handleSubmit}>
        <h2>Добавить запись о питании</h2>
        
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={errorField === 'date' ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
        />

        <MealSection>
          <SectionTitle>
            <span>Завтрак</span>
            <Button type="button" onClick={() => handleAddProduct('breakfast')} style={{padding: '10px 15px'}}>
            {isMobileTiny ? 'Добавить' : 'Добавить продукт'}
            </Button>
          </SectionTitle>
          
          {breakfastProducts.map((product, index) => (
            <ProductItem key={index}>
              <Select
                value={product.productId}
                onChange={(e) => handleProductChange('breakfast', index, 'productId', e.target.value)}
                style={errorField === 'product-select' && !product.productId ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              >
                <option value="" disabled>Выберите продукт</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </Select>
              
              <Input
                type="number"
                placeholder="Количество (грамм/мл)"
                value={product.quantity}
                onChange={(e) => handleProductChange('breakfast', index, 'quantity', e.target.value)}
                min="1"
                max="3000"
                style={errorField === 'quantity' && (!product.quantity || parseInt(product.quantity) <= 0 || parseInt(product.quantity) > 3000) ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              />
              
              <RemoveButton type="button" onClick={() => handleRemoveProduct('breakfast', index)}>
                Удалить
              </RemoveButton>
            </ProductItem>
          ))}
        </MealSection>

        <MealSection>
          <SectionTitle>
            <span>Обед</span>
            <Button type="button" onClick={() => handleAddProduct('lunch')} style={{padding: '10px 15px'}}>
            {isMobileTiny ? 'Добавить' : 'Добавить продукт'}
            </Button>
          </SectionTitle>
          
          {lunchProducts.map((product, index) => (
            <ProductItem key={index}>
              <Select
                value={product.productId}
                onChange={(e) => handleProductChange('lunch', index, 'productId', e.target.value)}
                style={errorField === 'product-select' && !product.productId ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              >
                <option value="" disabled>Выберите продукт</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </Select>
              
              <Input
                type="number"
                placeholder="Количество (грамм/мл)"
                value={product.quantity}
                onChange={(e) => handleProductChange('lunch', index, 'quantity', e.target.value)}
                min="1"
                max="3000"
                style={errorField === 'quantity' && (!product.quantity || parseInt(product.quantity) <= 0 || parseInt(product.quantity) > 3000) ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              />
              
              <RemoveButton type="button" onClick={() => handleRemoveProduct('lunch', index)}>
                Удалить
              </RemoveButton>
            </ProductItem>
          ))}
        </MealSection>

        <MealSection>
          <SectionTitle>
            <span>Ужин</span>
            <Button type="button" onClick={() => handleAddProduct('dinner')} style={{padding: '10px 15px'}}>
            {isMobileTiny ? 'Добавить' : 'Добавить продукт'}
            </Button>
          </SectionTitle>
          
          {dinnerProducts.map((product, index) => (
            <ProductItem key={index}>
              <Select
                value={product.productId}
                onChange={(e) => handleProductChange('dinner', index, 'productId', e.target.value)}
                style={errorField === 'product-select' && !product.productId ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              >
                <option value="" disabled>Выберите продукт</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </Select>
              
              <Input
                type="number"
                placeholder="Количество (грамм/мл)"
                value={product.quantity}
                onChange={(e) => handleProductChange('dinner', index, 'quantity', e.target.value)}
                min="1"
                max="3000"
                style={errorField === 'quantity' && (!product.quantity || parseInt(product.quantity) <= 0 || parseInt(product.quantity) > 3000) ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
              />
              
              <RemoveButton type="button" onClick={() => handleRemoveProduct('dinner', index)}>
                Удалить
              </RemoveButton>
            </ProductItem>
          ))}
        </MealSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit">Сохранить</Button>
      </Form>
    </ScrollReveal>
  );
};

export default AddMeal;