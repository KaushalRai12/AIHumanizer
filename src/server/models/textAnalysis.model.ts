import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export interface TextAnalysisAttributes {
  id?: number;
  userId: number;
  originalText: string;
  humanizedText: string;
  characterCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TextAnalysisInstance extends Model<TextAnalysisAttributes, TextAnalysisAttributes>, TextAnalysisAttributes {}

export const TextAnalysis = sequelize.define<TextAnalysisInstance>(
  'TextAnalysis',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    originalText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    humanizedText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    characterCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'text_analyses',
    timestamps: true,
  }
); 