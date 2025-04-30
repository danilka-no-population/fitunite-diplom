import { Request, Response } from 'express';
import ProgressModel from '../models/Progress';
import { subDays, subYears, subMonths } from 'date-fns';

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
        const { period } = req.query;
        //@ts-ignore
        const user_id = req.user.id;
    
        try {
            const exercises = await ProgressModel.getUserWorkoutExercises(user_id);
    
            // Устанавливаем дату фильтрации в зависимости от периода
            let startDate: Date;
            if (period === '3months') {
                startDate = subMonths(new Date(), 3);
            } else if (period === 'year') {
                startDate = subYears(new Date(), 1);
            } else {
                startDate = subMonths(new Date(), 1); // По умолчанию за месяц
            }
    
            const categoryProgress: Record<string, any[]> = {};
    
            exercises.forEach(exercise => {
                const { category, sets, reps, weight, duration, distance, date, type, exercise_id } = exercise;
    
                // Проверяем, попадает ли дата в выбранный период
                const exerciseDate = new Date(date);
                if (exerciseDate < startDate) return;
    
                if (!categoryProgress[category]) {
                    categoryProgress[category] = [];
                }
    
                if (type === 'strength') {
                    const volume = (sets || 0) * (reps || 0) * (weight || 0);
                    categoryProgress[category].push({ 
                        date, 
                        volume,
                        exerciseId: exercise_id 
                    });
                } else if (type === 'cardio') {
                    const speed = (distance || 0) / parseFloat(duration || '1');
                    categoryProgress[category].push({ 
                        date, 
                        speed,
                        exerciseId: exercise_id 
                    });
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

            // Получение прогресса клиента
            static async getClientProgress(req: Request, res: Response) {
                const { user_id } = req.params;
            
                try {
                    const { metrics, exercises } = await ProgressModel.getClientProgress(Number(user_id));
            
                    // Обработка упражнений для категорий
                    const categoryProgress: Record<string, any[]> = {};
            
                    exercises.forEach(exercise => {
                        const { category, sets, reps, weight, duration, distance, date, type, exercise_id } = exercise;
            
                        if (!categoryProgress[category]) {
                            categoryProgress[category] = [];
                        }
            
                        if (type === 'strength') {
                            const volume = (sets || 0) * (reps || 0) * (weight || 0);
                            categoryProgress[category].push({ 
                                date, 
                                volume,
                                exerciseId: exercise_id 
                            });
                        } else if (type === 'cardio') {
                            const speed = (distance || 0) / parseFloat(duration || '1');
                            categoryProgress[category].push({ 
                                date, 
                                speed,
                                exerciseId: exercise_id 
                            });
                        }
                    });
            
                    res.status(200).json({ metrics, categoryProgress });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Ошибка сервера' });
                }
            }
            

    // В ProgressController
    static async getMyProgress(req: Request, res: Response) {
        //@ts-ignore
        const user_id = req.user.id;
    
        try {
            const { metrics, exercises } = await ProgressModel.getClientProgress(user_id);
    
            const categoryProgress: Record<string, any[]> = {};
    
            exercises.forEach(exercise => {
                const { category, sets, reps, weight, duration, distance, date, type, exercise_id } = exercise;
    
                if (!categoryProgress[category]) {
                    categoryProgress[category] = [];
                }
    
                if (type === 'strength') {
                    const volume = (sets || 0) * (reps || 0) * (weight || 0);
                    categoryProgress[category].push({ 
                        date, 
                        volume,
                        exerciseId: exercise_id 
                    });
                } else if (type === 'cardio') {
                    const speed = (distance || 0) / parseFloat(duration || '1');
                    categoryProgress[category].push({ 
                        date, 
                        speed,
                        exerciseId: exercise_id 
                    });
                }
            });
    
            res.status(200).json({ metrics, categoryProgress });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

export default ProgressController;