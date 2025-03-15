/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

const ProgressCharts: React.FC = () => {
    const [allMetrics, setAllMetrics] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<Record<string, any[]>>({});
    const [period, setPeriod] = useState<'3days' | 'week' | 'month'>('month');

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:5000/api/progress/metrics?period=month`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const formattedData = data.map((item: { date: string }) => ({
                ...item,
                date: format(new Date(item.date), 'yyyy-MM-dd')
            }));
            setAllMetrics(formattedData);
        })
        .catch(error => console.error("Ошибка загрузки метрик:", error));

        fetch(`http://localhost:5000/api/progress/categories?period=month`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const formattedCategories: Record<string, any[]> = {};
            Object.entries(data).forEach(([category, values]) => {
                formattedCategories[category] = (values as any[]).map(item => ({
                    ...item,
                    date: format(new Date(item.date), 'yyyy-MM-dd'),
                    value: item.volume || item.speed
                }));
            });
            setAllCategories(formattedCategories);
        })
        .catch(error => console.error("Ошибка загрузки категорий:", error));
    }, []);

    // Фильтрация данных по выбранному периоду
    const filterDataByPeriod = (data: any[]) => {
        const today = new Date();
        // eslint-disable-next-line prefer-const
        let startDate = period === '3days' ? subDays(today, 3) :
                        period === 'week' ? subDays(today, 7) :
                        subDays(today, 30);

        return data.filter(item => new Date(item.date) >= startDate);
    };

    // Функция для группировки данных по дням и суммирования value
    const groupAndSumData = (data: any[]) => {
        const groupedData: Record<string, number> = {}; // { '2024-03-15': 150, '2024-03-16': 200 }

        data.forEach(({ date, value }) => {
            if (!groupedData[date]) {
                groupedData[date] = 0;
            }
            groupedData[date] += value;
        });

        return Object.entries(groupedData).map(([date, totalValue]) => ({
            date: format(new Date(date), 'dd.MM'), // Форматируем дату
            value: totalValue
        }));
    };

    const filteredMetrics = filterDataByPeriod(allMetrics).map(item => ({
        ...item,
        date: format(new Date(item.date), 'dd.MM')
    }));

    const filteredCategories: Record<string, any[]> = {};
    Object.entries(allCategories).forEach(([category, data]) => {
        const filteredData = filterDataByPeriod(data);
        filteredCategories[category] = groupAndSumData(filteredData);
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
            <h2>Прогресс по весу и ИМТ</h2>
            {filteredMetrics.length > 0 ? (
                <LineChart width={600} height={300} data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" />
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
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
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
