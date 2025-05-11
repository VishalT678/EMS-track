import { Request, Response } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface CustomResponse extends Response {
  locals?: {
    user?: {
      id: string;
      role: string;
    };
  };
} 