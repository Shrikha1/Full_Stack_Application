import sequelize from '../config/database';
import User from './user.model';
import dotenv from 'dotenv';

dotenv.config();

// Initialize models
User.init(
  {
    id: {
      type: 'UUID',
      defaultValue: 'UUIDV4',
      primaryKey: true,
    },
    email: {
      type: 'STRING',
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: 'STRING',
      allowNull: false,
    },
    verified: {
      type: 'BOOLEAN',
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: 'STRING',
      allowNull: true,
    },
    verificationTokenExpires: {
      type: 'DATE',
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

// Export models
export { User };
export default sequelize; 