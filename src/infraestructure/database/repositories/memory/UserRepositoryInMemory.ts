import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class UserRepositoryInMemory implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email.getValue() === email);
    return user || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id.isEqual(user.id));
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
