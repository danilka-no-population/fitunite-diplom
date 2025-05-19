/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, subYears } from 'date-fns';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';
import Loader from '../components/Loader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #05396B;
  font-size: 2rem;
  margin-bottom: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 500px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.4rem;
  }

  @media (max-width: 280px) {
    font-size: 1.2rem;
    padding: 0.8rem 0;
  }
`;

const PeriodSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 565px) {
    gap: 10px;
  }
`;

const PeriodButton = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  background-color: ${props => props.active ? '#058E3A' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 150px;
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background-color: ${props => props.active ? '#046b2d' : '#e0e0e0'};
  }

  @media (max-width: 610px) {
    font-size: 0.9rem;
    padding: 10px 15px;
    min-width: 120px;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
    padding: 8px 12px;
    min-width: 100px;
  }

  @media (max-width: 280px) {
    font-size: 0.75rem;
    padding: 6px 10px;
    min-width: 80px;
  }
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;

  @media (max-width: 500px) {
    padding: 15px;
  }

  @media (max-width: 400px) {
    padding: 12px;
  }
`;

const ChartTitle = styled.h2`
  color: #05396B;
  font-size: 1.4rem;
  text-align: center;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  color: #666;
  font-size: 1rem;

  @media (max-width: 400px) {
    padding: 15px;
    font-size: 0.9rem;
  }
`;

const ScrollableChart = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 15px;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #058E3A #f0f0f0;
  margin-left: 40px; /* Добавляем отступ слева для оси Y */

  &::-webkit-scrollbar {
    height: 8px;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #058E3A;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #046b2d;
    }
  }

  @media (max-width: 500px) {
    margin: 0 -10px 0 30px;
    padding-bottom: 10px;
  }
`;

const ChartWrapper = styled.div<{ dataLength: number }>`
  min-width: ${props => Math.max(600, props.dataLength * 100)}px;
  position: relative;
  padding: 0 20px; /* Добавляем отступы по бокам для крайних точек */

  @media (max-width: 768px) {
    min-width: ${props => Math.max(500, props.dataLength * 80)}px;
  }

  @media (max-width: 500px) {
    min-width: ${props => Math.max(400, props.dataLength * 70)}px;
  }

  @media (max-width: 400px) {
    min-width: ${props => Math.max(350, props.dataLength * 60)}px;
  }
`;

const LegendContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ExerciseSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  color: #333;
  font-size: 0.9rem;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  width: 100%;
    margin-left: 0;
    margin-top: 10px;

  &:hover {
    border-color: #058E3A;
  }

  &:focus {
    outline: none;
    border-color: #058E3A;
    box-shadow: 0 0 0 2px rgba(5, 142, 58, 0.2);
  }

  @media (max-width: 500px) {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
    font-size: 0.85rem;
  }

  @media (max-width: 280px) {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const YAxisContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: white;
  z-index: 1;
`;

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <LegendContainer>
      {payload.map((entry: any, index: number) => (
        <span key={`item-${index}`} style={{ 
          color: entry.color,
          margin: '0 10px',
          display: 'inline-block',
          fontWeight: 500,
          fontSize: '0.9rem'
        }}>
          {entry.value}
        </span>
      ))}
    </LegendContainer>
  );
};

const Progress: React.FC<{ userId?: number }> = ({ userId }) => {
  return (
    <Container>
      <ScrollReveal>
        {!userId && <Title>Мой прогресс</Title>}
      </ScrollReveal>
      <ProgressCharts userId={userId}/>
    </Container>
  );
};

export const ProgressCharts: React.FC<{ userId?: number }> = ({ userId }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, any[]>>({});
  const [availableExercises, setAvailableExercises] = useState<Record<string, any[]>>({});
  const [selectedExercises, setSelectedExercises] = useState<Record<string, string>>({});
  const [period, setPeriod] = useState<'month' | '3months' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const chartRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const yAxisRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = userId 
          ? `/progress/client/${userId}` 
          : '/progress/my-progress';

        const progressResponse = await api.get(endpoint);
        
        const formattedMetrics = progressResponse.data.metrics?.map((item: { date: string }) => ({
          ...item,
          date: format(new Date(item.date), 'yyyy-MM-dd')
        })) || [];
        
        setMetrics(formattedMetrics);

        const formattedCategories: Record<string, any[]> = {};
        Object.entries(progressResponse.data.categoryProgress || {}).forEach(([category, values]) => {
          formattedCategories[category] = (values as any[]).map(item => ({
            ...item,
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            value: item.volume || item.speed
          }));
        });
        setCategoryProgress(formattedCategories);

        const exercisesResponse = await api.get('/exercises');
        const exercisesByCategory: Record<string, any[]> = {};
        
        exercisesResponse.data.forEach((exercise: any) => {
          if (!exercisesByCategory[exercise.category]) {
            exercisesByCategory[exercise.category] = [];
          }
          exercisesByCategory[exercise.category].push(exercise);
        });

        setAvailableExercises(exercisesByCategory);

        const defaultSelections: Record<string, string> = {};
        Object.keys(exercisesByCategory).forEach(category => {
          defaultSelections[category] = 'all';
        });
        setSelectedExercises(defaultSelections);

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, period]);

  useEffect(() => {
    // Скроллим графики к концу после загрузки данных
    if (!loading) {
      setTimeout(() => {
        Object.keys(chartRefs.current).forEach(key => {
          const chart = chartRefs.current[key];
          if (chart) {
            chart.scrollLeft = chart.scrollWidth;
          }
        });
      }, 100);
    }
  }, [loading, period, selectedExercises]);

  const filterDataByPeriod = (data: any[]) => {
    const today = new Date();
    const startDate = period === 'month' ? subMonths(today, 1) :
                    period === '3months' ? subMonths(today, 3) :
                    subYears(today, 1);

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const groupAndProcessData = (data: any[], isRunning: boolean) => {
    const groupedData: Record<string, { sum: number, count: number }> = {}; 

    data.forEach(({ date, value }) => {
      if (!groupedData[date]) {
        groupedData[date] = { sum: 0, count: 0 };
      }
      groupedData[date].sum += value;
      groupedData[date].count += 1;
    });

    return Object.entries(groupedData).map(([date, { sum, count }]) => ({
      date: format(new Date(date), 'dd.MM.yy'),
      value: isRunning ? (count > 1 ? (sum / count * 1.5).toFixed(2) : (sum / count).toFixed(2)) : sum
    }));
  };

  const handleExerciseChange = (category: string, exerciseId: string) => {
    setSelectedExercises(prev => ({
      ...prev,
      [category]: exerciseId
    }));
  };

  const filteredMetrics = filterDataByPeriod(metrics).map(item => ({
    ...item,
    date: format(new Date(item.date), 'dd.MM.yy')
  }));

  const filteredCategories: Record<string, any[]> = {};
  Object.entries(categoryProgress).forEach(([category, data]) => {
    const filteredData = filterDataByPeriod(data);
    const isRunning = category.toLowerCase().includes('бег');
    
    const selectedExerciseId = selectedExercises[category];
    let filteredByExercise = filteredData;
    
    if (selectedExerciseId && selectedExerciseId !== 'all' && availableExercises[category]) {
      const exercise = availableExercises[category].find((ex: any) => ex.id.toString() === selectedExerciseId);
      if (exercise) {
        filteredByExercise = filteredData.filter((item: any) => item.exerciseId?.toString() === selectedExerciseId);
      }
    }
    
    filteredCategories[category] = groupAndProcessData(filteredByExercise, isRunning);
  });

  if (loading) {
    return (
      <Container>
        <Loader/>
      </Container>
    );
  }

  return (
    <div>
      <ScrollReveal delay={0.1}>
        <PeriodSelector>
          <PeriodButton 
            active={period === 'month'} 
            onClick={() => setPeriod('month')}
          >
            Последний месяц
          </PeriodButton>
          <PeriodButton 
            active={period === '3months'} 
            onClick={() => setPeriod('3months')}
          >
            Последние 3 месяца
          </PeriodButton>
          <PeriodButton 
            active={period === 'year'} 
            onClick={() => setPeriod('year')}
          >
            Последний год
          </PeriodButton>
        </PeriodSelector>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <ChartContainer>
          <ChartHeader>
            <ChartTitle>Масса тела</ChartTitle>
          </ChartHeader>
          {filteredMetrics.length > 0 ? (
            <>
              {renderCustomLegend({
                payload: [{
                  value: "Вес (кг)",
                  color: "#5CDB94"
                }]
              })}
              <div style={{ position: 'relative' }}>
                <YAxisContainer ref={el => yAxisRefs.current['weight'] = el}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredMetrics} margin={{ left: 0, right: 0 }}>
                      <YAxis 
                        dataKey="weight"
                        orientation="left"
                        width={40}
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: '#ccc' }}
                        tickMargin={10}
                        domain={['dataMin - 5', 'dataMax + 1']}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </YAxisContainer>
                <ScrollableChart 
                  ref={el => chartRefs.current['weight'] = el}
                  style={{ minHeight: '300px' }}
                >
                  <ChartWrapper dataLength={filteredMetrics.length}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart 
                        data={filteredMetrics}
                        margin={{ right: 20, left: 0, top: 10, bottom: 10 }}
                      >
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="#eee" 
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: '#666', fontSize: 12 }}
                          axisLine={{ stroke: '#ccc' }}
                          tickMargin={15}
                          interval={0}
                          padding={{ left: 22, right: 3 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                            border: 'none',
                            fontSize: '14px'
                          }}
                          itemStyle={{
                            fontSize: '14px',
                            padding: '2px 0'
                          }}
                          labelStyle={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            fontSize: '14px'
                          }}
                          formatter={(value: any) => [`${value} кг`, "Вес"]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#5CDB94" 
                          strokeWidth={3}
                          name="Вес (кг)" 
                          dot={{ 
                            r: 5, 
                            fill: '#058E3A',
                            stroke: '#fff',
                            strokeWidth: 2
                          }}
                          activeDot={{ 
                            r: 7, 
                            fill: '#05396B',
                            stroke: '#fff',
                            strokeWidth: 2
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </ScrollableChart>
              </div>
            </>
          ) : (
            <NoDataMessage>Нет данных по весу за выбранный период.</NoDataMessage>
          )}
        </ChartContainer>
      </ScrollReveal>

      {Object.entries(filteredCategories).map(([category, data], index) => (
        <ScrollReveal key={category} delay={0.10 + index * 0.05}>
          <ChartContainer>
            <ChartHeader>
              <ChartTitle>{category}</ChartTitle>
              {availableExercises[category] && (
                <ExerciseSelect
                  value={selectedExercises[category] || 'all'}
                  onChange={(e) => handleExerciseChange(category, e.target.value)}
                >
                  <option value="all">Все упражнения</option>
                  {availableExercises[category].map((exercise: any) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </ExerciseSelect>
              )}
            </ChartHeader>
            {data.length > 0 ? (
              <>
                {renderCustomLegend({
                  payload: [{
                    value: category === 'Бег' ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности",
                    color: category === 'Бег' ? "#FF8C42" : "#058E3A"
                  }]
                })}
                <div style={{ position: 'relative' }}>
                  <YAxisContainer ref={el => yAxisRefs.current[category] = el}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data} margin={{ left: 0, right: 0 }}>
                        <YAxis 
                          dataKey="value"
                          orientation="left"
                          width={40}
                          tick={{ fill: '#666', fontSize: 12 }}
                          axisLine={{ stroke: '#ccc' }}
                          tickMargin={1}
                          domain={[0, 'auto']}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </YAxisContainer>
                  <ScrollableChart 
                    ref={el => chartRefs.current[category] = el}
                    style={{ minHeight: '300px' }}
                  >
                    <ChartWrapper dataLength={data.length}>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart 
                          data={data}
                          margin={{ right: 20, left: 0, top: 10, bottom: 10 }}
                        >
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#eee" 
                            vertical={false}
                          />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#ccc' }}
                            tickMargin={10}
                            interval={0}
                            padding={{ left: 23, right: 3 }}
                          />
                          <Tooltip 
                            contentStyle={{
                              background: '#fff',
                              borderRadius: '8px',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                              border: 'none',
                              fontSize: '14px'
                            }}
                            itemStyle={{
                              fontSize: '14px',
                              padding: '2px 0'
                            }}
                            labelStyle={{
                              fontWeight: 'bold',
                              marginBottom: '5px',
                              fontSize: '14px'
                            }}
                            formatter={(value: any) => [value, category === 'Бег' ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности"]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={category.toLowerCase().includes('бег') ? "#FF8C42" : "#058E3A"} 
                            strokeWidth={3}
                            name={category.toLowerCase().includes('бег') ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности"} 
                            dot={{ 
                              r: 5, 
                              fill: category.toLowerCase().includes('бег') ? "#FF6B1A" : "#1abe64",
                              stroke: '#fff',
                              strokeWidth: 2
                            }}
                            activeDot={{ 
                              r: 7, 
                              fill: category.toLowerCase().includes('бег') ? "#E05200" : "#1D5F5C",
                              stroke: '#fff',
                              strokeWidth: 2
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartWrapper>
                  </ScrollableChart>
                </div>
              </>
            ) : (
              <NoDataMessage style={{color: '#05396B'}}>
                {!userId ? `Вы не выполняли упражнения в категории "${category}" за выбранный период.` : `Клиент не выполнял упражнения в категории "${category}" за выбранный период.`}
              </NoDataMessage>
            )}
          </ChartContainer>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default Progress;