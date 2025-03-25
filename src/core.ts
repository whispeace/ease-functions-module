import { EasingFunction } from './types';

/**
 * Ограничивает значение в заданном диапазоне
 * @param t Значение для ограничения
 * @param min Минимальная граница (по умолчанию 0)
 * @param max Максимальная граница (по умолчанию 1)
 */
export const clamp = (t: number, min = 0, max = 1): number => 
  Math.max(min, Math.min(max, t));

/**
 * Нормализует значение в заданном диапазоне к диапазону 0-1
 * @param value Исходное значение
 * @param min Минимум исходного диапазона
 * @param max Максимум исходного диапазона
 */
export const normalize = (value: number, min: number, max: number): number => 
  (value - min) / (max - min);

/**
 * Создает функцию сглаживания типа "in" (ускорение)
 * @param power Степень (определяет интенсивность эффекта)
 */
export const makeEaseIn = (power: number): EasingFunction => 
  (t: number) => Math.pow(clamp(t), power);

/**
 * Создает функцию сглаживания типа "out" (замедление)
 * @param power Степень (определяет интенсивность эффекта)
 */
export const makeEaseOut = (power: number): EasingFunction => 
  (t: number) => 1 - Math.pow(1 - clamp(t), power);

/**
 * Создает функцию сглаживания типа "inOut" (ускорение-замедление)
 * @param power Степень (определяет интенсивность эффекта)
 */
export const makeEaseInOut = (power: number): EasingFunction => 
  (t: number) => {
    const c = clamp(t);
    if (c < 0.5) {
      return Math.pow(2 * c, power) / 2;
    } else {
      return 1 - Math.pow(-2 * c + 2, power) / 2;
    }
  };

/**
 * Инвертирует функцию сглаживания (отражает её по вертикали и горизонтали)
 * @param fn Исходная функция
 */
export const invert = (fn: EasingFunction): EasingFunction => 
  (t: number) => 1 - fn(1 - t);

/**
 * Отражает функцию сглаживания по горизонтали
 * @param fn Исходная функция
 */
export const mirror = (fn: EasingFunction): EasingFunction => 
  (t: number) => fn(1 - t);

/**
 * Отражает функцию сглаживания по вертикали
 * @param fn Исходная функция
 */
export const flip = (fn: EasingFunction): EasingFunction => 
  (t: number) => 1 - fn(t);