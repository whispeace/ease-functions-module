import { EasingFunction } from '../types';
import { ContextualEasingFunction, AnimationContext } from '../contextual/types';

/**
 * Семантические характеристики движения
 */
export interface MovementCharacteristics {
  // Основные характеристики
  fluidity: number;         // 0: резкие движения, 1: плавные движения
  weight: number;           // 0: невесомость, 1: тяжесть
  elasticity: number;       // 0: ригидность, 1: высокая эластичность
  
  // Характеристики поведения
  predictability: number;   // 0: хаотичное, 1: предсказуемое
  complexity: number;       // 0: простое, 1: сложное
  energy: number;           // 0: вялое, 1: энергичное
  
  // Нюансы движения
  organicity: number;       // 0: механическое, 1: органическое
  playfulness: number;      // 0: серьезное, 1: игривое
  aggression: number;       // 0: мягкое, 1: агрессивное
}

/**
 * Базовый профиль для стилей движения
 */
export interface MovementProfile {
  name: string;
  description: string;
  characteristics: MovementCharacteristics;
}

/**
 * Тип метафункции, возвращающей функцию сглаживания
 * на основе семантического описания
 */
export type MetaEasingFunction = (profile: MovementProfile) => EasingFunction;

/**
 * Контекстуальная метафункция, учитывающая контекст анимации
 */
export type ContextualMetaEasingFunction = (
  profile: MovementProfile
) => ContextualEasingFunction;