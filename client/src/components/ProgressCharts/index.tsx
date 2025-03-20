/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

const ProgressCharts: React.FC<{ userId?: number }> = ({ userId }) => {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [categoryProgress, setCategoryProgress] = useState<Record<string, any[]>>({});
    const [period, setPeriod] = useState<'3days' | 'week' | 'month'>('month');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Токен авторизации отсутствует');
                return;
            }

            try {
                // Определяем эндпоинт в зависимости от наличия userId
                const endpoint = userId 
                    ? `/api/progress/client/${userId}` 
                    : '/api/progress/my-progress';

                const response = await fetch(`http://localhost:5000${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                // Обработка метрик
                const formattedMetrics = data.metrics.map((item: { date: string }) => ({
                    ...item,
                    date: format(new Date(item.date), 'yyyy-MM-dd')
                }));
                setMetrics(formattedMetrics);

                // Обработка категорий
                const formattedCategories: Record<string, any[]> = {};
                Object.entries(data.categoryProgress).forEach(([category, values]) => {
                    formattedCategories[category] = (values as any[]).map(item => ({
                        ...item,
                        date: format(new Date(item.date), 'yyyy-MM-dd'),
                        value: item.volume || item.speed
                    }));
                });
                setCategoryProgress(formattedCategories);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, [userId, period]);

    // Фильтрация данных по выбранному периоду
    const filterDataByPeriod = (data: any[]) => {
        const today = new Date();
        const startDate = period === '3days' ? subDays(today, 3) :
                        period === 'week' ? subDays(today, 7) :
                        subDays(today, 30);

        return data.filter(item => new Date(item.date) >= startDate);
    };

    // Группировка данных
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
            value: isRunning ? (count > 1 ? (sum / count * 1.5).toFixed(4) : (sum / count).toFixed(4)) : sum
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

    return (
        <div>
            {/* Выбор периода */}
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setPeriod('3days')}>Последние 3 дня</button>
                <button onClick={() => setPeriod('week')}>Последняя неделя</button>
                <button onClick={() => setPeriod('month')}>Последний месяц</button>
            </div>

            {/* Графики для веса и ИМТ */}
            <h2>Прогресс по массе тела</h2>
            {filteredMetrics.length > 0 ? (
                <LineChart width={600} height={300} data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Вес (кг)" />
                </LineChart>
            ) : (
                <p>Нет данных по весу и ИМТ за выбранный период.</p>
            )}

            {/* Графики для каждой категории */}
            {Object.entries(filteredCategories).map(([category, data]) => (
                <div key={category} style={{ margin: '40px 0', gap: '10px' }}>
                    <h2>{category}</h2>
                    {data.length > 0 ? (
                        <LineChart width={600} height={300} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke={category.toLowerCase().includes('бег') ? "#ff7300" : "#82ca9d"} name={category.toLocaleLowerCase() === 'бег' ? "Коэфф. интенсивности бега" : "Коэфф. интенсивности выполнения"} />
                        </LineChart>
                    ) : (
                        <p>Вы не выполняли упражнения в категории {category} за выбранный период.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressCharts;
