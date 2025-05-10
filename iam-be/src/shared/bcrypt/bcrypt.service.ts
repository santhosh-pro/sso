import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class BcryptService {
  async hash(value1: string, value2: string | number): Promise<string> {
    return await bcrypt.hash(value1, value2);
  }

  async genSalt(value: number): Promise<string> {
    return await bcrypt.genSalt(value);
  }

  async comparePassword(attempt: string, password: string): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }
}
