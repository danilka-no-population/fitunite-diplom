/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
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
`;

// const Description = styled.p`
//   color: #666;
//   font-size: 1.1rem;
//   text-align: center;
//   margin-bottom: 30px;
// `;

const PeriodSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;

  @media (max-width: 565px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PeriodButton = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  background-color: ${props => props.active ? '#058E3A' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#046b2d' : '#e0e0e0'};
  }

  @media (max-width: 610px){
    font-size: 0.9rem;
  }
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const ChartTitle = styled.h2`
  color: #05396B;
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  color: #666;
  font-size: 1rem;
`;

const ScrollableChart = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;

  @media (max-width: 500px) {
    margin: 0 -10px;
  }
`;

const ChartWrapper = styled.div`
  min-width: 600px;

  @media (min-width: 501px) {
    width: 100%;
  }
`;

const LegendContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
`;

// const YAxisContainer = styled.div`
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100%;
//   width: 50px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <LegendContainer>
        {payload.map((entry: any, index: number) => (
          <span key={`item-${index}`} style={{ 
            color: entry.color,
            margin: '-15px 10px 10px 10px',
            display: 'inline-block'
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
        {!userId && (
            <Title>Мой прогресс</Title>
        )}
        {/* <Description>Здесь вы можете отслеживать свой прогресс за выбранный период</Description> */}
      </ScrollReveal>
      <ProgressCharts userId={userId}/>
    </Container>
  );
};

export const ProgressCharts: React.FC<{ userId?: number }> = ({ userId }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, any[]>>({});
  const [period, setPeriod] = useState<'3days' | 'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = userId 
          ? `/progress/client/${userId}` 
          : '/progress/my-progress';

        const response = await api.get(endpoint);
        
        const formattedMetrics = response.data.metrics?.map((item: { date: string }) => ({
          ...item,
          date: format(new Date(item.date), 'yyyy-MM-dd')
        })) || [];
        
        setMetrics(formattedMetrics);

        const formattedCategories: Record<string, any[]> = {};
        Object.entries(response.data.categoryProgress || {}).forEach(([category, values]) => {
          formattedCategories[category] = (values as any[]).map(item => ({
            ...item,
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            value: item.volume || item.speed
          }));
        });
        setCategoryProgress(formattedCategories);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, period]);

  const filterDataByPeriod = (data: any[]) => {
    const today = new Date();
    const startDate = period === '3days' ? subDays(today, 3) :
                    period === 'week' ? subDays(today, 7) :
                    subDays(today, 30);

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
      date: format(new Date(date), 'dd.MM'),
      value: isRunning ? (count > 1 ? (sum / count * 1.5).toFixed(2) : (sum / count).toFixed(2)) : sum
    }));
  };

  const filteredMetrics = filterDataByPeriod(metrics).map(item => ({
    ...item,
    date: format(new Date(item.date), 'dd.MM')
  }));

  const filteredCategories: Record<string, any[]> = {};
  Object.entries(categoryProgress).forEach(([category, data]) => {
    const filteredData = filterDataByPeriod(data);
    const isRunning = category.toLowerCase().includes('бег');
    filteredCategories[category] = groupAndProcessData(filteredData, isRunning);
  });

  if (loading) {
    return (
      <Container>
        {/* <NoDataMessage>Загрузка данных...</NoDataMessage> */}
        <Loader/>
      </Container>
    );
  }

  return (
    <div>
      <ScrollReveal delay={0.1}>
        <PeriodSelector>
          <PeriodButton 
            active={period === '3days'} 
            onClick={() => setPeriod('3days')}
          >
            Последние 3 дня
          </PeriodButton>
          <PeriodButton 
            active={period === 'week'} 
            onClick={() => setPeriod('week')}
          >
            Последняя неделя
          </PeriodButton>
          <PeriodButton 
            active={period === 'month'} 
            onClick={() => setPeriod('month')}
          >
            Последний месяц
          </PeriodButton>
        </PeriodSelector>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <ChartContainer>
          <ChartTitle>Масса тела</ChartTitle>
          {filteredMetrics.length > 0 ? (
            <>
              {renderCustomLegend({
                payload: [{
                  value: "Вес (кг)",
                  color: "#5CDB94"
                }]
              })}
              <ScrollableChart>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ccc' }}
                />
                <YAxis 
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ccc' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                {/* <Legend /> */}
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#5CDB94" 
                  strokeWidth={2}
                  name="Вес (кг)" 
                  dot={{ r: 4, fill: '#058E3A' }}
                  activeDot={{ r: 6, fill: '#05396B' }}
                />
              </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </ScrollableChart>
            </>
          ) : (
            <NoDataMessage>Нет данных по весу за выбранный период.</NoDataMessage>
          )}
        </ChartContainer>
      </ScrollReveal>

      {Object.entries(filteredCategories).map(([category, data], index) => (
        <ScrollReveal key={category} delay={0.10 + index * 0.05}>
          <ChartContainer>
            <ChartTitle>{category}</ChartTitle>
            {data.length > 0 ? (
            <>
            {renderCustomLegend({
                payload: [{
                  value: category === 'Бег' ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности",
                  color: category === 'Бег' ? "#ffac05" : "#5CDB94"
                }]
              })}
            <ScrollableChart>
            <ChartWrapper>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="6 3" stroke="#eee" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  {/* <Legend/> */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={category.toLowerCase().includes('бег') ? "#FF8C42" : "#058E3A"} 
                    strokeWidth={2}
                    name={category.toLowerCase().includes('бег') ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности"} 
                    dot={{ r: 4, fill: category.toLowerCase().includes('бег') ? "#FF6B1A" : "#1abe64" }}
                    activeDot={{ r: 6, fill: category.toLowerCase().includes('бег') ? "#E05200" : "#1D5F5C" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </ChartWrapper>
              </ScrollableChart>
              </>
            ) : (
              <NoDataMessage style={{color: '#05396B'}}>
                Вы не выполняли упражнения в категории "{category}" за выбранный период.
              </NoDataMessage>
            )}
          </ChartContainer>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default Progress;