import type { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    role: string;
    permissions: string[];
  };
}
