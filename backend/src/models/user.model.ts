import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  salesforceUsername: string;
  salesforcePassword: string;
  salesforceAccessToken?: string;
  salesforceRefreshToken?: string;
  salesforceInstanceUrl?: string;
  verified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> {
  public id!: string;
  public email!: string;
  public password!: string;
  public salesforceUsername!: string;
  public salesforcePassword!: string;
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

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salesforceUsername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salesforcePassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salesforceAccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salesforceRefreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salesforceInstanceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User; 