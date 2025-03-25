import { 
  MetaEasingFunction, 
  MovementProfile, 
  ContextualMetaEasingFunction 
} from './types';
import { 
  EasingFunction, 
  easingCombinator 
} from '../index';
import { 
  easeInOutQuad, 
  easeOutElastic, 
  easeInOutBack, 
  easeOutBounce, 
  easeInOutSine,
  linear 
} from '../easing-functions';
import { 
  ContextualEasingFunction, 
  AnimationContext 
} from '../contextual/types';
import {
  inertial,
  physical
} from '../contextual/functions';

/**
 * Создает семантическую функцию сглаживания на основе профиля движения
 */
export const semanticEasing: MetaEasingFunction = (profile: MovementProfile): EasingFunction => {
  const { characteristics } = profile;
  
  // Набор базовых функций, соответствующих разным характеристикам
  const elasticFn = easeOutElastic;
  const fluidFn = easeInOutSine;
  const heavyFn = easeInOutBack;
  const playfulFn = easeOutBounce;
  const simpleFn = easeInOutQuad;
  const mechanicalFn = linear;
  
  // Веса для разных функций, основанные на характеристиках
  const weights = [
    { fn: fluidFn, weight: characteristics.fluidity },
    { fn: heavyFn, weight: characteristics.weight },
    { fn: elasticFn, weight: characteristics.elasticity },
    { fn: simpleFn, weight: 1 - characteristics.complexity },
    { fn: playfulFn, weight: characteristics.playfulness },
    { fn: mechanicalFn, weight: 1 - characteristics.organicity }
  ];
  
  // Сортируем по весу для выбора наиболее значимых функций
  const sortedWeights = [...weights].sort((a, b) => b.weight - a.weight);
  
  // Выбираем топ-3 функции с наибольшими весами
  const topFunctions = sortedWeights.slice(0, 3).map(item => item.fn);
  
  // Нормализуем веса для этих функций
  const topWeights = sortedWeights.slice(0, 3).map(item => item.weight);
  const sumWeights = topWeights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = topWeights.map(w => w / sumWeights);
  
  // Создаем комбинированную функцию
  return easingCombinator.blend(topFunctions, normalizedWeights);
};

/**
 * Создает контекстуальную семантическую функцию сглаживания
 */
export const contextualSemanticEasing: ContextualMetaEasingFunction = 
  (profile: MovementProfile): ContextualEasingFunction => {
  const { characteristics } = profile;
  
  // Базовая функция без контекста
  const baseEasing = semanticEasing(profile);
  
  return (t: number, context: AnimationContext): number => {
    // Модифицируем базовую функцию в зависимости от контекста
    
    // Если движение маятниковое и имеет вес
    if (context.direction === 'alternating' && characteristics.weight > 0.6) {
      // Применяем инерционное влияние
      const inertiaFn = inertial(
        characteristics.weight * 2, 
        (1 - characteristics.fluidity) * 0.5
      );
      return inertiaFn(t, context);
    }
    
    // Если движение органическое и имеет вес
    if (characteristics.organicity > 0.7 && characteristics.weight > 0.4) {
      // Применяем физическое моделирование
      const physicalFn = physical({
        gravity: characteristics.weight * 15,
        bounce: characteristics.elasticity * 0.7,
        friction: (1 - characteristics.fluidity) * 0.5
      });
      return physicalFn(t, context);
    }
    
    // В остальных случаях используем базовую функцию
    return baseEasing(t);
  };
};