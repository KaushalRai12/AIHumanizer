import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export interface SubscriptionAttributes {
  id?: number;
  userId: number;
  planType: string;
  creditsTotal: number;
  creditsUsed: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionInstance extends Model<SubscriptionAttributes, SubscriptionAttributes>, SubscriptionAttributes {}

export const Subscription = sequelize.define<SubscriptionInstance>(
  'Subscription',
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
    planType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'free',
    },
    creditsTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    creditsUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'subscriptions',
    timestamps: true,
  }
);

// Create default subscription for new users
export const createDefaultSubscription = async (userId: number) => {
  try {
    const subscription = await Subscription.create({
      userId,
      planType: 'free',
      creditsTotal: 100,
      creditsUsed: 0,
      startDate: new Date(),
      endDate: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      })(),
      active: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error creating default subscription:', error);
    throw error;
  }
};

// Function to check if a user has enough credits
export const hasEnoughCredits = async (userId: number, creditsNeeded: number) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId,
        active: true,
      },
    });
    
    if (!subscription) {
      return false;
    }
    
    const creditsRemaining = subscription.creditsTotal - subscription.creditsUsed;
    return creditsRemaining >= creditsNeeded;
  } catch (error) {
    console.error('Error checking user credits:', error);
    throw error;
  }
};

// Function to deduct credits from a user's subscription
export const deductCredits = async (userId: number, creditsToDeduct: number) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId,
        active: true,
      },
    });
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }
    
    subscription.creditsUsed += creditsToDeduct;
    await subscription.save();
    
    return subscription;
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw error;
  }
}; 