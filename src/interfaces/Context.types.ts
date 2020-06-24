import { Request, Response } from 'express';

export interface Context {
  req: Request;
  res: Response;
  payload?: { username: string; role: 'business' | 'user' | 'admin' };
}
