import { EasingFunction } from '../types';

/**
 * Параметры для генерации семейства функций сглаживания
 */
export interface EasingFamilyParameters {
  // Базовые параметры
  intensity?: number;      // Интенсивность эффекта (0-1)
  overshoot?: number;      // Величина перехлеста (0+)
  oscillation?: number;    // Частота колебаний (0+)
  damping?: number;        // Затухание колебаний (0-1)
  
  // Форма функции
  symmetry?: number;       // Симметричность (0: асимметричный, 1: симметричный)
  smoothness?: number;     // Гладкость перехода (0: резкий, 1: гладкий)
  
  // Дополнительные эффекты
  anticipation?: number;   // Эффект подготовки (0: нет, 1: сильный)
  followThrough?: number;  // Эффект инерции в конце (0: нет, 1: сильный)
}

/**
 * Генератор семейства функций сглаживания на основе параметров
 */
export type EasingFamilyGenerator = (
  params: EasingFamilyParameters
) => EasingFunction;