import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export interface UserAttributes {
  id?: string;
  email: string;
  password: string;
  salesforceAccessToken?: string;
  salesforceRefreshToken?: string;
  salesforceInstanceUrl?: string;
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public salesforceAccessToken?: string;
  public salesforceRefreshToken?: string;
  public salesforceInstanceUrl?: string;
  public verified!: boolean;
  public verificationToken?: string;
  public verificationTokenExpires?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export { User }; 