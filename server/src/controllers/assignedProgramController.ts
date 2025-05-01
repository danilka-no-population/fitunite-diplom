import { Request, Response } from 'express';
import AssignedProgramModel from '../models/AssignedProgram';
import authMiddleware from '../middleware/authMiddleware';

class AssignedProgramController {
  // Назначение программы клиенту
  static async assignProgram(req: Request, res: Response) {
    //@ts-ignore
    const trainer_id = req.user.id;
    const { program_id, client_id } = req.body;

    try {
      // Проверяем, есть ли у клиента уже назначенная программа
      const hasProgram = await AssignedProgramModel.hasAssignedProgram(client_id);
      if (hasProgram) {
        return res.status(400).json({ message: 'У этого клиента уже есть назначенная программа тренировок!' });
      }

      // Назначаем программу
      const assignedProgram = await AssignedProgramModel.assignProgram({
        program_id,
        client_id,
        trainer_id
      });

      res.status(201).json(assignedProgram);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // Отмена назначения программы
  static async unassignProgram(req: Request, res: Response) {
    const { client_id } = req.body;

    try {
      await AssignedProgramModel.unassignProgram(client_id);
      res.status(200).json({ message: 'Программа успешно отменена' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // Получение назначенной программы клиента
  static async getAssignedProgram(req: Request, res: Response) {
    //@ts-ignore
    const client_id = req.user.id;

    try {
      const assignedProgram = await AssignedProgramModel.getByClientId(client_id);
      res.status(200).json(assignedProgram);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // Получение клиентов с назначенными программами для тренера
  static async getClientsWithPrograms(req: Request, res: Response) {
    //@ts-ignore
    const trainer_id = req.user.id;

    try {
      const clients = await AssignedProgramModel.getClientsWithPrograms(trainer_id);
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

export default AssignedProgramController;