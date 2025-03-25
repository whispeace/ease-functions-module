import { EasingFunction } from '../types';

/**
 * Направление анимации
 */
export type AnimationDirection = 'forward' | 'backward' | 'alternating';

/**
 * Фаза анимации для циклических анимаций
 */
export type AnimationPhase = 'accelerating' | 'cruising' | 'decelerating' | 'resting';

/**
 * Расширенный контекст анимации, содержащий информацию
 * о состоянии и окружении выполняемой анимации
 */
export interface AnimationContext {
  // Основные параметры
  direction: AnimationDirection;
  iteration: number;
  
  // Кинематические характеристики
  previousValue?: number;
  velocity?: number;
  acceleration?: number;
  
  // Окружение
  gravity?: number;
  resistance?: number;
  
  // Состояние
  phase?: AnimationPhase;
  energyLevel?: number;
  
  // Временные характеристики
  elapsedTimeMs?: number;
  deltaTimeMs?: number;
  
  // Пространственные характеристики
  distance?: number;
  distanceRemaining?: number;
}

/**
 * Контекстуальная функция сглаживания, учитывающая дополнительные
 * факторы окружения выполнения анимации
 */
export type ContextualEasingFunction = (t: number, context: AnimationContext) => number;

/**
 * Преобразует обычную функцию сглаживания в контекстуальную,
 * по умолчанию игнорирующую контекст
 */
export function asContextual(fn: EasingFunction): ContextualEasingFunction {
  return (t: number, _context: AnimationContext) => fn(t);
}

/**
 * Преобразует контекстуальную функцию сглаживания в обычную,
 * фиксируя контекст
 */
export function withFixedContext(
  fn: ContextualEasingFunction, 
  context: AnimationContext
): EasingFunction {
  return (t: number) => fn(t, context);
}