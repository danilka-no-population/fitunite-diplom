import { Request, Response } from 'express';
import ProgramModel from '../models/Program';
import authMiddleware from '../middleware/authMiddleware';

class ProgramController {
  // Получение всех программ тренировок
  static async getPrograms(req: Request, res: Response) {
    try {
      const programs = await ProgramModel.findAll();
      res.status(200).json(programs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение программы тренировок по ID
  static async getProgramById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const program = await ProgramModel.findById(Number(id));
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json(program);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Создание новой программы тренировок
  // static async createProgram(req: Request, res: Response) {
  //   const { name, description } = req.body;
  //   //@ts-ignore
  //   const author_id = req.user.id;

  //   try {
  //     const newProgram = await ProgramModel.create({
  //       name,
  //       description,
  //       author_id,
  //     });
  //     res.status(201).json(newProgram);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }
  static async createProgram(req: Request, res: Response) {
    //@ts-ignore
    const author_id = req.user.id;
    //@ts-ignore
    const role = req.user.role;
  
    if (role !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create programs' });
    }
  
    const { name, description } = req.body;
  
    try {
      const newProgram = await ProgramModel.create({
        name,
        description,
        author_id,
      });
      res.status(201).json(newProgram);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProgramController;