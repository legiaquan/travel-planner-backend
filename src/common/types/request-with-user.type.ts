import { Request } from 'express';

import { IUser } from '../../models/user.model';

export interface RequestWithUser extends Request {
  user: IUser;
}
