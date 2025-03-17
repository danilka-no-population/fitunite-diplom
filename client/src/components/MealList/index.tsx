/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const MealCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const ProductCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const NutritionInfo = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const MealList: React.FC<{ refresh: boolean; userId?: number }> = ({ refresh, userId }) => {
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const endpoint = userId ? `/meals/client/${userId}` : '/meals';
        const response = await api.get(endpoint);
        const mealsWithProducts = await Promise.all(
          response.data.map(async (meal: any) => {
            const productsResponse = await api.get(`/meals/${meal.id}/products`);
            return { ...meal, products: productsResponse.data };
          })
        );
        setMeals(mealsWithProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeals();
  }, [refresh, userId]);

  const calculateNutrition = (products: any[]) => {
    let totalCalories = 0;
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbs = 0;

    products.forEach((product) => {
      const quantity = product.quantity / 100;
      totalCalories += product.calories_per_100 * quantity;
      totalProteins += product.proteins_per_100 * quantity;
      totalFats += product.fats_per_100 * quantity;
      totalCarbs += product.carbs_per_100 * quantity;
    });

    return {
      totalCalories: totalCalories.toFixed(2),
      totalProteins: totalProteins.toFixed(2),
      totalFats: totalFats.toFixed(2),
      totalCarbs: totalCarbs.toFixed(2),
    };
  };

  const groupProductsByMealType = (products: any[]) => {
    const groupedProducts: { [key: string]: any[] } = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };

    products.forEach((product) => {
      groupedProducts[product.meal_type].push(product);
    });

    return groupedProducts;
  };

  return (
    <Container>
      <h1>{userId ? "Client's Meals" : 'My Meals'}</h1>
      {meals.map((meal) => {
        const { totalCalories, totalProteins, totalFats, totalCarbs } = calculateNutrition(meal.products);
        const groupedProducts = groupProductsByMealType(meal.products);

        return (
          <MealCard key={meal.id}>
            <h3>{new Date(meal.date).toLocaleDateString()}</h3>
            <h4>Breakfast:</h4>
            {groupedProducts.breakfast.map((product) => (
              <ProductCard key={product.id}>
                <p>Product: {product.name}</p>
                <p>Category: {product.category}</p>
                <p>Quantity: {product.quantity} grams/ml</p>
              </ProductCard>
            ))}
            <h4>Lunch:</h4>
            {groupedProducts.lunch.map((product) => (
              <ProductCard key={product.id}>
                <p>Product: {product.name}</p>
                <p>Category: {product.category}</p>
                <p>Quantity: {product.quantity} grams/ml</p>
              </ProductCard>
            ))}
            <h4>Dinner:</h4>
            {groupedProducts.dinner.map((product) => (
              <ProductCard key={product.id}>
                <p>Product: {product.name}</p>
                <p>Category: {product.category}</p>
                <p>Quantity: {product.quantity} grams/ml</p>
              </ProductCard>
            ))}
            <NutritionInfo>
              <p>Total Calories: {totalCalories} kcal</p>
              <p>Total Proteins: {totalProteins} g</p>
              <p>Total Fats: {totalFats} g</p>
              <p>Total Carbs: {totalCarbs} g</p>
            </NutritionInfo>
          </MealCard>
        );
      })}
    </Container>
  );
};

export default MealList;