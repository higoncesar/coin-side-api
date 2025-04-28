export interface CreateAccountDTO {
  name: string;
  type: string;
  userId: string;
  isDefault: boolean;
  initialBalance: number;
}
