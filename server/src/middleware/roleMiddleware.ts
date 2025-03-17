import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export default roleMiddleware;