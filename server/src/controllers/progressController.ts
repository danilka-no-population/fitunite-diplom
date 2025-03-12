import { Request, Response } from 'express';
import ProgressModel from '../models/Progress';

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
}

export default ProgressController;