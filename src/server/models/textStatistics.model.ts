import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export interface TextStatisticsAttributes {
  id?: number;
  userId: number;
  totalTransformations: number;
  totalCharactersProcessed: number;
  totalCreditsSpent: number;
  averageTextLength: number;
  popularTransformationLevel: string;
  lastActivityDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TextStatisticsInstance extends Model<TextStatisticsAttributes, TextStatisticsAttributes>, TextStatisticsAttributes {}

export const TextStatistics = sequelize.define<TextStatisticsInstance>(
  'TextStatistics',
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
    totalTransformations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalCharactersProcessed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalCreditsSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    averageTextLength: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    popularTransformationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'moderate',
    },
    lastActivityDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'text_statistics',
    timestamps: true,
  }
);

// Create or update user statistics
export const updateUserStatistics = async (
  userId: number, 
  charCount: number, 
  creditsUsed: number,
  transformationLevel: string
) => {
  try {
    // Find or create statistics record for user
    let [stats, created] = await TextStatistics.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        totalTransformations: 1,
        totalCharactersProcessed: charCount,
        totalCreditsSpent: creditsUsed,
        averageTextLength: charCount,
        popularTransformationLevel: transformationLevel,
        lastActivityDate: new Date()
      }
    });
    
    // If record already existed, update it
    if (!created) {
      const newTotalTransformations = stats.totalTransformations + 1;
      const newTotalChars = stats.totalCharactersProcessed + charCount;
      
      // Calculate new average
      const newAverage = newTotalChars / newTotalTransformations;
      
      // Update statistics
      stats.totalTransformations = newTotalTransformations;
      stats.totalCharactersProcessed = newTotalChars;
      stats.totalCreditsSpent += creditsUsed;
      stats.averageTextLength = newAverage;
      stats.lastActivityDate = new Date();
      
      // Update popular transformation level (simple approach)
      // In a real application, you might want to store counts for each level
      if (transformationLevel !== stats.popularTransformationLevel) {
        // For now, we'll just use the latest level
        // A more sophisticated approach would count occurrences of each level
        stats.popularTransformationLevel = transformationLevel;
      }
      
      await stats.save();
    }
    
    return stats;
  } catch (error) {
    console.error('Error updating user statistics:', error);
    throw error;
  }
}; 