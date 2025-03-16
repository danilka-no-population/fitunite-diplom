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

    // Функция для группировки данных: сумма для обычных упражнений, среднее для бега
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
            date: format(new Date(date), 'dd.MM'), // Форматируем дату
            value: isRunning ? (count > 1 ? (sum / count * 1.5).toFixed(4) : (sum / count).toFixed(4)) : sum // Среднее для бега, сумма для остальных
        }));
    };

    const filteredMetrics = filterDataByPeriod(allMetrics).map(item => ({
        ...item,
        date: format(new Date(item.date), 'dd.MM')
    }));

    const filteredCategories: Record<string, any[]> = {};
    Object.entries(allCategories).forEach(([category, data]) => {
        const filteredData = filterDataByPeriod(data);
        const isRunning = category.toLowerCase().includes('бег'); // Определяем, что это бег
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

            <h2>В качестве критериев прогресса отображаются значения интенсивности работы по определенным категориям, которые вычисляются по определенной формуле</h2>

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
