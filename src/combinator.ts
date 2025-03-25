import { EasingFunction, EasingCombinator } from './types';

/**
 * Реализация комбинатора функций сглаживания
 * Позволяет создавать сложные функции из простых
 */
export class DefaultEasingCombinator implements EasingCombinator {
  /**
   * Последовательное применение функций
   * @param fns Массив функций
   * @param weights Относительные веса (длительности) каждой функции
   */
  sequence(fns: EasingFunction[], weights?: number[]): EasingFunction {
    // Нормализуем веса, если они предоставлены
    const normalizedWeights = this.normalizeWeights(fns.length, weights);
    
    let totalWeight = 0;
    const segments: Array<{ weight: number; offset: number }> = [];
    
    // Вычисляем смещения для каждого сегмента
    for (let i = 0; i < fns.length; i++) {
      segments.push({ weight: normalizedWeights[i], offset: totalWeight });
      totalWeight += normalizedWeights[i];
    }
    
    return (t: number) => {
      // Находим соответствующий сегмент
      const segment = segments.find((s, i) => {
        return t >= s.offset && (
          i === segments.length - 1 || 
          t < segments[i + 1].offset
        );
      });
      
      if (!segment) return 0;
      
      // Вычисляем локальное время для сегмента
      const index = segments.indexOf(segment);
      const localT = (t - segment.offset) / segment.weight;
      
      // Применяем соответствующую функцию сглаживания
      return fns[index](Math.max(0, Math.min(1, localT)));
    };
  }
  
  /**
   * Смешивание результатов нескольких функций
   * @param fns Массив функций
   * @param weights Веса для смешивания
   */
  blend(fns: EasingFunction[], weights?: number[]): EasingFunction {
    // Нормализуем веса, если они предоставлены
    const normalizedWeights = this.normalizeWeights(fns.length, weights);
    
    return (t: number) => {
      let result = 0;
      
      // Вычисляем взвешенную сумму
      for (let i = 0; i < fns.length; i++) {
        result += fns[i](t) * normalizedWeights[i];
      }
      
      return result;
    };
  }
  
  /**
   * Условное применение функций
   * @param conditions Массив условий и соответствующих функций
   */
  conditional(conditions: Array<{
    predicate: (t: number) => boolean,
    fn: EasingFunction
  }>): EasingFunction {
    return (t: number) => {
      for (const condition of conditions) {
        if (condition.predicate(t)) {
          return condition.fn(t);
        }
      }
      
      // Если ни одно условие не выполнено, возвращаем t (линейная функция)
      return t;
    };
  }
  
  /**
   * Утилита для нормализации весов
   * @private
   */
  private normalizeWeights(count: number, weights?: number[]): number[] {
    if (!weights || weights.length === 0) {
      // Если веса не предоставлены, используем равные значения
      return Array(count).fill(1 / count);
    } else if (weights.length !== count) {
      // Если количество весов не совпадает, дополняем или обрезаем
      const result = Array(count).fill(0);
      const min = Math.min(count, weights.length);
      
      for (let i = 0; i < min; i++) {
        result[i] = weights[i];
      }
      
      // Нормализуем веса, чтобы сумма была равна 1
      const sum = result.reduce((acc, val) => acc + val, 0);
      return result.map(w => w / sum);
    } else {
      // Нормализуем предоставленные веса
      const sum = weights.reduce((acc, val) => acc + val, 0);
      return weights.map(w => w / sum);
    }
  }
}