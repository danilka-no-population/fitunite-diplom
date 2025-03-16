import { Request, Response } from 'express';
import ProgressModel from '../models/Progress';
import { subDays, subMonths } from 'date-fns';

class ProgressController {
    static async addMetric(req: Request, res: Response) {
        const { date, weight, height } = req.body;
        //@ts-ignore
        const user_id = req.user.id;

        try {
        const newMetric = await ProgressModel.addMetric({
            user_id,
            date,
            weight,
            height,
        });

        res.status(201).json(newMetric);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    }

    static async getMetrics(req: Request, res: Response) {
        //@ts-ignore
        const user_id = req.user.id;

        try {
        const metrics = await ProgressModel.findByUserId(user_id);
        res.status(200).json(metrics);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    }

    static async getCategoryProgress(req: Request, res: Response) {
        const { period } = req.query; // Получаем период из query параметра
        //@ts-ignore
        const user_id = req.user.id;

        try {
            const exercises = await ProgressModel.getUserWorkoutExercises(user_id);

            // Устанавливаем дату фильтрации в зависимости от периода
            let startDate: Date;
            if (period === 'week') {
                startDate = subDays(new Date(), 7); // Последние 7 дней
            } else if (period === 'month') {
                startDate = subMonths(new Date(), 1); // Последний месяц
            } else {
                startDate = subMonths(new Date(), 1); // По умолчанию за месяц
            }

            const categoryProgress: Record<string, number[]> = {};

            exercises.forEach(exercise => {
                const { category, sets, reps, weight, duration, distance, date, type } = exercise;

                // Проверяем, попадает ли дата в выбранный период
                const exerciseDate = new Date(date);
                if (exerciseDate < startDate) return; // Пропускаем упражнения, если дата меньше стартовой

                if (!categoryProgress[category]) {
                    categoryProgress[category] = [];
                }

                if (type === 'strength') {
                    const volume = (sets || 0) * (reps || 0) * (weight || 0);
                    //@ts-ignore
                    categoryProgress[category].push({ date, volume });
                } else if (type === 'cardio') {
                    const speed = (distance || 0) / parseFloat(duration || '1');
                    //@ts-ignore
                    categoryProgress[category].push({ date, speed });
                }
            });

            res.status(200).json(categoryProgress);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


        // Получение метрик пользователя (ИМТ, вес)
        static async getUserMetrics(req: Request, res: Response) {
            //@ts-ignore
            const user_id = req.user.id;
    
            try {
                const metrics = await ProgressModel.getUserMetrics(user_id);
                res.status(200).json(metrics);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Ошибка сервера' });
            }
        }
}

export default ProgressController;