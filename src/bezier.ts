import { EasingFunction } from './types';

/**
 * Вычисляет точку на квадратичной кривой Безье
 * @param p0 Начальная точка
 * @param p1 Контрольная точка
 * @param p2 Конечная точка
 * @param t Параметр (0-1)
 */
export const quadraticBezier = (
  p0: number, 
  p1: number, 
  p2: number, 
  t: number
): number => {
  const invT = 1 - t;
  return invT * invT * p0 + 2 * invT * t * p1 + t * t * p2;
};

/**
 * Вычисляет точку на кубической кривой Безье
 * @param p0 Начальная точка
 * @param p1 Первая контрольная точка
 * @param p2 Вторая контрольная точка
 * @param p3 Конечная точка
 * @param t Параметр (0-1)
 */
export const cubicBezier = (
  p0: number, 
  p1: number, 
  p2: number, 
  p3: number, 
  t: number
): number => {
  const invT = 1 - t;
  return (
    invT * invT * invT * p0 +
    3 * invT * invT * t * p1 +
    3 * invT * t * t * p2 +
    t * t * t * p3
  );
};

/**
 * Создает функцию сглаживания на основе кубической кривой Безье
 * Похоже на CSS transition-timing-function
 * @param x1 X-координата первой контрольной точки (0-1)
 * @param y1 Y-координата первой контрольной точки (может выходить за 0-1)
 * @param x2 X-координата второй контрольной точки (0-1)
 * @param y2 Y-координата второй контрольной точки (может выходить за 0-1)
 */
export const createCubicBezier = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): EasingFunction => {
  // Предварительно вычисляем таблицу значений для лучшей производительности
  const TABLE_SIZE = 1000;
  const table: number[] = [];
  
  for (let i = 0; i <= TABLE_SIZE; i++) {
    const t = i / TABLE_SIZE;
    table.push(cubicBezier(0, y1, y2, 1, t));
  }
  
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    
    // Находим ближайшее значение x в таблице
    const index = Math.floor(t * TABLE_SIZE);
    const remainder = (t * TABLE_SIZE) - index;
    
    // Линейная интерполяция между соседними значениями
    if (index === TABLE_SIZE) {
      return table[index];
    } else {
      return table[index] + remainder * (table[index + 1] - table[index]);
    }
  };
};

// Предопределенные кривые Безье (аналоги из CSS)
export const ease = createCubicBezier(0.25, 0.1, 0.25, 1.0);
export const easeIn = createCubicBezier(0.42, 0, 1.0, 1.0);
export const easeOut = createCubicBezier(0, 0, 0.58, 1.0);
export const easeInOut = createCubicBezier(0.42, 0, 0.58, 1.0);