import { ContextualEasingFunction, AnimationContext } from './types';
import { easeOutQuad, easeInQuad } from '../easing-functions';

/**
 * Направленная функция сглаживания, меняющая поведение в зависимости
 * от направления анимации
 */
export function directional(
  forwardFn: (t: number) => number,
  backwardFn: (t: number) => number
): ContextualEasingFunction {
  return (t: number, context: AnimationContext) => {
    if (context.direction === 'forward') {
      return forwardFn(t);
    } else if (context.direction === 'backward') {
      return backwardFn(t);
    } else { // alternating
      const isForward = Math.floor(context.iteration) % 2 === 0;
      return isForward ? forwardFn(t) : backwardFn(t);
    }
  };
}

/**
 * Функция сглаживания с эффектом инерции, имитирующая 
 * объект с массой, на который действуют силы
 */
export function inertial(mass: number = 1, friction: number = 0.3): ContextualEasingFunction {
  return (t: number, context: AnimationContext) => {
    // Базовое прогрессивное значение
    const baseValue = easeOutQuad(t);
    
    // Если нет предыдущего значения или скорости, возвращаем базовое значение
    if (context.previousValue === undefined || context.velocity === undefined) {
      return baseValue;
    }
    
    // Рассчитываем инерционный эффект
    const resistance = context.resistance ?? friction;
    const inertiaFactor = Math.max(0, 1 - resistance / mass);
    
    // Вычисляем разницу между текущим базовым значением и предыдущим
    const delta = baseValue - context.previousValue;
    
    // Применяем инерцию к скорости и добавляем к базовому значению
    const inertia = context.velocity * inertiaFactor;
    
    // Возвращаем новое значение с влиянием инерции
    return Math.max(0, Math.min(1, baseValue + inertia * 0.16));
  };
}

/**
 * Функция сглаживания с адаптивной энергией, имитирующая усталость или
 * восстановление в зависимости от уровня энергии
 */
export function energyAdaptive(
  energyDepletion: number = 0.1,
  energyRecovery: number = 0.05
): ContextualEasingFunction {
  return (t: number, context: AnimationContext) => {
    // Если уровень энергии не определен, используем стандартное значение
    const energy = context.energyLevel ?? 1.0;
    
    // Применяем уровень энергии к прогрессии
    // При низкой энергии движение замедляется
    const adjustedT = t * (0.5 + 0.5 * energy);
    
    // Возвращаем скорректированное значение
    return easeOutQuad(adjustedT);
  };
}

/**
 * Функция сглаживания, имитирующая природные физические процессы
 * с учетом гравитации, сопротивления и инерции
 */
export function physical(options: {
  gravity?: number,
  bounce?: number,
  friction?: number
} = {}): ContextualEasingFunction {
  const defaultGravity = 9.8;
  const defaultBounce = 0.3;
  const defaultFriction = 0.2;
  
  return (t: number, context: AnimationContext) => {
    const gravity = context.gravity ?? options.gravity ?? defaultGravity;
    const bounce = options.bounce ?? defaultBounce;
    const friction = context.resistance ?? options.friction ?? defaultFriction;
    
    // Для падения используем квадратичную функцию, имитирующую воздействие гравитации
    if (t < 0.5) {
      // Падение
      return 2 * t * t;
    } else {
      // Отскок с затуханием
      const bouncePhase = (t - 0.5) * 2;
      const dampingFactor = Math.pow(bounce, context.iteration || 1);
      const height = Math.sin(bouncePhase * Math.PI) * dampingFactor;
      
      return 1 - height * (1 - friction);
    }
  };
}