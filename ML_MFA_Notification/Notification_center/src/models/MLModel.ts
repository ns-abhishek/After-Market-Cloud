export enum ModelType {
  PRIORITY_PREDICTOR = 'priority_predictor',
  DELIVERY_TIME_OPTIMIZER = 'delivery_time_optimizer',
  INTERACTION_PREDICTOR = 'interaction_predictor',
  CONTENT_PERSONALIZER = 'content_personalizer',
  CATEGORY_CLASSIFIER = 'category_classifier',
  USER_ACTIVITY_PREDICTOR = 'user_activity_predictor'
}

export interface FeatureImportance {
  featureName: string;
  importance: number;
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  auc?: number;
  mse?: number;
  mae?: number;
  r2?: number;
  customMetrics?: Record<string, number>;
}

export interface MLModel {
  id: string;
  type: ModelType;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  lastTrainedAt: Date;
  metrics: ModelMetrics;
  featureImportance: FeatureImportance[];
  hyperparameters?: Record<string, any>;
  trainingDataSize: number;
  validationDataSize: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}
