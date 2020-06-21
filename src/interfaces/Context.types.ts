import { Request, Response } from 'express';

export interface Context {
  req: Request;
  res: Response;
  payload?: { phone: string; role: 'business' | 'user' | 'admin' };
}
