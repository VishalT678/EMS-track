import { Request, Response } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export type CustomResponse = Response; 