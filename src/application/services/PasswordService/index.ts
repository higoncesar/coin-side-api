import { hash } from 'bcryptjs';

export class PasswordService {
  static async hash(password: string) {
    return await hash(password, 10);
  }
}
