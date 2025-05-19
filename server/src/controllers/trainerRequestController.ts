import { Request, Response } from 'express';
import TrainerRequestModel from '../models/TrainerRequest';
import UserModel from '../models/User';
import ChatModel from '../models/Chat';
import { notifyChatCreated } from '../websocket';
import pool from '../config/db';

class TrainerRequestController {
  static async sendRequest(req: Request, res: Response) {
    const { clientId } = req.body;
    // @ts-ignore
    const trainerId = req.user.id;
  
    try {
      // Проверяем, есть ли у клиента уже тренер
      const client = await UserModel.findById(clientId);
      if (client?.trainer_id) {
        return res.status(400).json({ message: 'У клиента уже есть тренер' });
      }
  
      // Проверяем существующие pending запросы
      const existingRequest = await TrainerRequestModel.findByTrainerAndClient(trainerId, clientId);
      if (existingRequest && existingRequest.status === 'pending') {
        return res.status(400).json({ message: 'Запрос уже отправлен' });
      }
  
      // Если есть старый запрос (например, отклоненный) - удаляем его
      if (existingRequest) {
        await TrainerRequestModel.delete(existingRequest.id);
      }
  
      // Создаем новый запрос
      const request = await TrainerRequestModel.create({
        trainer_id: trainerId,
        client_id: clientId,
        status: 'pending'
      });
  
      res.status(201).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async cancelRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    // @ts-ignore
    const trainerId = req.user.id;

    try {
      const request = await TrainerRequestModel.findByTrainerAndClient(trainerId, Number(requestId));
      if (!request) {
        return res.status(404).json({ message: 'Запрос не найден' });
      }

      await TrainerRequestModel.delete(request.id);
      res.status(200).json({ message: 'Запрос отменен' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async acceptRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    // @ts-ignore
    const clientId = req.user.id;
  
    try {
      // Исправляем запрос - ищем запрос по ID, а не по trainer_id и client_id
      const request = await TrainerRequestModel.findById(Number(requestId));
      if (!request) {
        return res.status(404).json({ message: 'Запрос не найден' });
      }
  
      if (request.client_id !== clientId) {
        return res.status(403).json({ message: 'Нет прав для принятия этого запроса' });
      }
  
      // Обновляем статус запроса
      await TrainerRequestModel.updateStatus(request.id, 'accepted');
  
      // Назначаем тренера клиенту
      await UserModel.addClient(request.trainer_id, request.client_id);
  
      res.status(200).json({ message: 'Запрос принят' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
  
  static async rejectRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    // @ts-ignore
    const clientId = req.user.id;
  
    try {
      // Получаем запрос по ID
      const request = await TrainerRequestModel.findById(Number(requestId));
      if (!request) {
        return res.status(404).json({ message: 'Запрос не найден' });
      }
  
      // Проверяем, что запрос адресован текущему пользователю
      if (request.client_id !== clientId) {
        return res.status(403).json({ message: 'Нет прав для отклонения этого запроса' });
      }
  
      // Вместо обновления статуса - удаляем запрос полностью
      await TrainerRequestModel.delete(request.id);
  
      res.status(200).json({ message: 'Запрос отклонен и удален' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getPendingRequests(req: Request, res: Response) {
    // @ts-ignore
    const clientId = req.user.id;

    try {
      const requests = await TrainerRequestModel.getPendingRequestsForClient(clientId);
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getTrainerRequests(req: Request, res: Response) {
    // @ts-ignore
    const trainerId = req.user.id;

    try {
      const requests = await TrainerRequestModel.getRequestsForTrainer(trainerId);
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

export default TrainerRequestController;