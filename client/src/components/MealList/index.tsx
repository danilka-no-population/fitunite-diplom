/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import AddMealComment from '../AddMealComment';
import ScrollReveal from '../../components/ScrollReveal';
import Pagination from '../Pagination';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 1.1rem;
`;

const MealCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const MealDate = styled.h3`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
`;

const MealSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #058E3A;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ProductCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f5f9ff;
  border-radius: 10px;
  border: 1px solid #e0e9ff;
`;

const ProductName = styled.p`
  font-weight: bold;
  color: #05396B;
  margin-bottom: 5px;
`;

const ProductDetail = styled.p`
  color: #666;
  margin-bottom: 3px;
  font-size: 0.9rem;
`;

const NutritionInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #edf5e0;
  border-radius: 10px;
  border: 1px solid #d8e8c0;
`;

const NutritionTitle = styled.h4`
  color: #058E3A;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const NutritionItem = styled.p`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CommentCard = styled.div`
  padding: 15px;
  margin-top: 20px;
  background-color: #f0f7ff;
  border-radius: 10px;
  border: 1px solid #d0e3ff;
`;

const CommentText = styled.p`
  color: #05396B;
  margin-bottom: 5px;
`;

const CommentDate = styled.small`
  color: #888;
  font-size: 0.8rem;
`;

const NoComments = styled.div`
  padding: 15px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #eee;
  color: #666;
  text-align: center;
`;

const MealList: React.FC<{ refresh: boolean; userId?: number }> = ({ refresh, userId }) => {
  const [meals, setMeals] = useState<any[]>([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 3;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const endpoint = userId ? `/meals/client/${userId}` : '/meals';
        const response = await api.get(endpoint);
        const mealsWithProducts = await Promise.all(
          response.data.map(async (meal: any) => {
            const productsResponse = await api.get(`/meals/${meal.id}/products`);
            const commentsResponse = await api.get(`/meal-comments/${meal.id}`);
            return { ...meal, products: productsResponse.data, comments: commentsResponse.data };
          })
        );
        
        // Сортировка по дате (новые сверху)
        mealsWithProducts.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA === dateB) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return dateB - dateA;
        });
        
        setMeals(mealsWithProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeals();
  }, [refresh, userId, update]);

  const handleCommentAdded = () => {
    setUpdate(!update);
  };

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

  // Пагинация
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(meals.length / mealsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
        {meals.length === 0 ? (
          <EmptyMessage>{!userId ? "Вы пока не добавляли ничего в дневник питания!" : "Клиент пока не добавлял ничего в дневник питания!"}</EmptyMessage>
        ) : (
          <>
            {currentMeals.map((meal) => {
              const { totalCalories, totalProteins, totalFats, totalCarbs } = calculateNutrition(meal.products);
              const groupedProducts = groupProductsByMealType(meal.products);

              return (
                <ScrollReveal key={meal.id}>
                  <MealCard>
                    <MealDate>{new Date(meal.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</MealDate>
                    
                    {groupedProducts.breakfast.length > 0 && (
                      <MealSection>
                        <SectionTitle>Завтрак</SectionTitle>
                        {groupedProducts.breakfast.map((product) => (
                          <ProductCard key={product.id}>
                            <ProductName>{product.name}</ProductName>
                            <ProductDetail>Категория: {product.category}</ProductDetail>
                            <ProductDetail>Количество: {product.quantity} грамм/мл</ProductDetail>
                          </ProductCard>
                        ))}
                      </MealSection>
                    )}
                    
                    {groupedProducts.lunch.length > 0 && (
                      <MealSection>
                        <SectionTitle>Обед</SectionTitle>
                        {groupedProducts.lunch.map((product) => (
                          <ProductCard key={product.id}>
                            <ProductName>{product.name}</ProductName>
                            <ProductDetail>Категория: {product.category}</ProductDetail>
                            <ProductDetail>Количество: {product.quantity} грамм/мл</ProductDetail>
                          </ProductCard>
                        ))}
                      </MealSection>
                    )}
                    
                    {groupedProducts.dinner.length > 0 && (
                      <MealSection>
                        <SectionTitle>Ужин</SectionTitle>
                        {groupedProducts.dinner.map((product) => (
                          <ProductCard key={product.id}>
                            <ProductName>{product.name}</ProductName>
                            <ProductDetail>Категория: {product.category}</ProductDetail>
                            <ProductDetail>Количество: {product.quantity} грамм/мл</ProductDetail>
                          </ProductCard>
                        ))}
                      </MealSection>
                    )}
                    
                    <NutritionInfo>
                      <NutritionTitle>Пищевая ценность</NutritionTitle>
                      <NutritionItem>
                        <span>Калории:</span>
                        <span>{totalCalories} ккал</span>
                      </NutritionItem>
                      <NutritionItem>
                        <span>Белки:</span>
                        <span>{totalProteins} г</span>
                      </NutritionItem>
                      <NutritionItem>
                        <span>Жиры:</span>
                        <span>{totalFats} г</span>
                      </NutritionItem>
                      <NutritionItem>
                        <span>Углеводы:</span>
                        <span>{totalCarbs} г</span>
                      </NutritionItem>
                    </NutritionInfo>
                    
                    <CommentCard>
                      <SectionTitle>Комментарии тренера</SectionTitle>
                      {meal.comments?.length > 0 ? (
                        meal.comments.map((comment: any) => (
                          <div key={comment.id}>
                            <CommentText>{comment.comment}</CommentText>
                            <CommentDate>
                              {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </CommentDate>
                          </div>
                        ))
                      ) : (
                        <NoComments>
                          {!userId ? 'Ваш тренер пока не оставлял комментариев' : 'Вы пока не оставляли комментариев'}
                        </NoComments>
                      )}
                    </CommentCard>
                    
                    {userId && <AddMealComment mealId={meal.id} onCommentAdded={handleCommentAdded} />}
                  </MealCard>
                </ScrollReveal>
              );
            })}
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            )}
          </>
        )}
    </Container>
  );
};

export default MealList;