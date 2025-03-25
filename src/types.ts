/**
 * Базовый тип функции сглаживания - принимает нормализованное время (0-1)
 * и возвращает коэффициент прогресса (обычно тоже в диапазоне 0-1)
 */
export type EasingFunction = (t: number) => number;

/**
 * Категории функций сглаживания
 * - in: ускорение (медленно -> быстро)
 * - out: замедление (быстро -> медленно)
 * - inOut: ускорение, затем замедление
 * - custom: пользовательская функция
 */
export type EasingCategory = 'in' | 'out' | 'inOut' | 'custom';

/**
 * Семейства функций сглаживания, определяющие математическую основу
 */
export type EasingFamily = 
  | 'sine'    // На основе синуса
  | 'quad'    // Квадратичная (t^2)
  | 'cubic'   // Кубическая (t^3)
  | 'quart'   // 4-й степени (t^4)
  | 'quint'   // 5-й степени (t^5)
  | 'expo'    // Экспоненциальная (2^10t)
  | 'circ'    // Круговая (√(1-t²))
  | 'back'    // С "оттяжкой"
  | 'elastic' // Пружинная
  | 'bounce'  // С отскоками
  | 'bezier';  // На основе кривой Безье

/**
 * Уникальный идентификатор функции сглаживания
 */
export interface EasingIdentifier {
  category: EasingCategory;
  family: EasingFamily;
  params?: Record<string, number>; // Опциональные параметры для настройки функции
}

/**
 * Интерфейс для сериализации/десериализации функций
 */
export interface EasingSerializer {
  /**
   * Преобразует функцию в строковое представление для хранения
   */
  serialize(fn: EasingFunction): string;
  
  /**
   * Воссоздает функцию из строкового представления
   */
  deserialize(serialized: string): EasingFunction;
}

/**
 * Интерфейс для комбинирования функций сглаживания
 */
export interface EasingCombinator {
  /**
   * Последовательное применение функций (первая до t=0.5, вторая после)
   * @param fns Массив функций
   * @param weights Относительные веса каждой функции (если не указаны, равные)
   */
  sequence(fns: EasingFunction[], weights?: number[]): EasingFunction;
  
  /**
   * Смешивание результатов нескольких функций
   * @param fns Массив функций
   * @param weights Веса для смешивания (если не указаны, равные)
   */
  blend(fns: EasingFunction[], weights?: number[]): EasingFunction;
  
  /**
   * Условное применение функций в зависимости от значения t
   * @param conditions Массив условий и соответствующих функций
   */
  conditional(conditions: Array<{
    predicate: (t: number) => boolean,
    fn: EasingFunction
  }>): EasingFunction;
}

/**
 * Интерфейс для интерполяции значений
 * Обобщенный тип T позволяет интерполировать любой тип данных
 */
export interface Interpolator<T> {
  /**
   * Интерполирует между начальным и конечным значением
   * @param start Начальное значение
   * @param end Конечное значение
   * @param easingFn Функция сглаживания
   * @param t Нормализованное время (0-1)
   */
  interpolate(start: T, end: T, easingFn: EasingFunction, t: number): T;
}