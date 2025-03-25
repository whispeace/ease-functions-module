import { EasingFamilyGenerator, EasingFamilyParameters } from './types';
import { clamp } from '../core';

/**
 * Создает семейство пружинных функций сглаживания
 * с параметрической настройкой упругости и затухания
 */
export const springFamily: EasingFamilyGenerator = (
  params: EasingFamilyParameters
): (t: number) => number => {
  // Извлекаем и нормализуем параметры
  const oscillation = Math.max(0, params.oscillation ?? 3);  // Частота колебаний
  const damping = clamp(params.damping ?? 0.5, 0, 1);        // Затухание
  const intensity = clamp(params.intensity ?? 0.5, 0, 1);    // Интенсивность эффекта
  const overshoot = Math.max(0, params.overshoot ?? 1.70158); // Величина перехлеста
  
  // Создаем пружинную функцию с заданными параметрами
  return (t: number): number => {
    const c = clamp(t);
    
    if (c === 0) return 0;
    if (c === 1) return 1;
    
    // Рассчитываем параметры пружины
    const omega = oscillation * Math.PI * 2; // Угловая частота
    const decay = damping * 5;               // Коэффициент затухания
    
    // Применяем пружинный эффект
    const decayFactor = Math.exp(-decay * c);
    const oscillationTerm = Math.sin(omega * c) / omega;
    
    // Рассчитываем базовое значение
    let value = 1 - decayFactor * (Math.cos(omega * c) + decay * oscillationTerm);
    
    // Применяем интенсивность и овершут
    value = 1 - (1 - value) * intensity;
    if (params.anticipation && c < 0.3) {
      // Добавляем эффект подготовки в начале
      const anticipationEffect = params.anticipation * Math.sin(Math.PI * c / 0.3) * 0.1;
      value -= anticipationEffect;
    }
    
    if (params.followThrough && c > 0.8) {
      // Добавляем эффект инерции в конце
      const followThroughEffect = params.followThrough * 
        Math.sin(Math.PI * (c - 0.8) / 0.2) * 0.05;
      value += followThroughEffect;
    }
    
    return clamp(value);
  };
};

/**
 * Создает семейство полиномиальных функций сглаживания
 * с настраиваемыми параметрами
 */
export const polynomialFamily: EasingFamilyGenerator = (
  params: EasingFamilyParameters
): (t: number) => number => {
  // Извлекаем и нормализуем параметры
  const intensity = clamp(params.intensity ?? 0.5, 0, 1);
  const symmetry = clamp(params.symmetry ?? 0.5, 0, 1);
  const smoothness = clamp(params.smoothness ?? 0.5, 0, 1);
  
  // Рассчитываем экспоненту на основе интенсивности (от 1 до 5)
  const exponent = 1 + 4 * intensity;
  
  return (t: number): number => {
    const c = clamp(t);
    
    // Для симметричного случая (близкого к ease-in-out)
    if (symmetry > 0.5) {
      const symmetryWeight = (symmetry - 0.5) * 2; // 0 до 1
      if (c < 0.5) {
        return (Math.pow(c * 2, exponent) / 2) * symmetryWeight + 
               (c * 2) * (1 - symmetryWeight) / 2;
      } else {
        return (1 - Math.pow((1 - c) * 2, exponent) / 2) * symmetryWeight + 
               (1 - (1 - c) * 2 * (1 - symmetryWeight) / 2);
      }
    } 
    // Для асимметричного случая (ближе к ease-in или ease-out)
    else {
      const asymmetryWeight = 1 - symmetry * 2; // 1 до 0
      
      // Больше похоже на ease-in при asymmetryWeight ближе к 1
      if (asymmetryWeight > 0) {
        const easeFactor = Math.pow(c, exponent);
        return easeFactor * asymmetryWeight + c * (1 - asymmetryWeight);
      } 
      // Больше похоже на ease-out при asymmetryWeight ближе к 0
      else {
        const easeOutWeight = -asymmetryWeight; // 0 до 1
        const easeFactor = 1 - Math.pow(1 - c, exponent);
        return easeFactor * easeOutWeight + c * (1 - easeOutWeight);
      }
    }
  };
};

/**
 * Создает семейство эластичных функций с настраиваемыми параметрами
 */
export const elasticFamily: EasingFamilyGenerator = (
  params: EasingFamilyParameters
): (t: number) => number => {
  // Извлекаем и нормализуем параметры
  const oscillation = Math.max(1, params.oscillation ?? 3);
  const overshoot = Math.max(0, params.overshoot ?? 1.5);
  const damping = clamp(params.damping ?? 0.5, 0, 1);
  const symmetry = clamp(params.symmetry ?? 0, 0, 1);
  
  return (t: number): number => {
    const c = clamp(t);
    
    // Функция для эластичного эффекта "ease-in"
    const easeInElastic = (t: number): number => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      
      const period = 1 / oscillation;
      const dampingFactor = Math.pow(2, 10 * (t - 1)) * damping;
      const s = period / 4;
      
      return -(dampingFactor * Math.sin((t - s) * (2 * Math.PI) / period)) * overshoot;
    };
    
    // Функция для эластичного эффекта "ease-out"
    const easeOutElastic = (t: number): number => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      
      const period = 1 / oscillation;
      const dampingFactor = Math.pow(2, -10 * t) * damping;
      const s = period / 4;
      
      return (1 + dampingFactor * Math.sin((t - s) * (2 * Math.PI) / period)) * overshoot;
    };
    
    // Комбинация в зависимости от симметрии
    if (symmetry < 0.5) {
      // Больше похоже на ease-in
      const weight = 1 - symmetry * 2;
      return easeInElastic(c) * weight + c * (1 - weight);
    } else {
      // Больше похоже на ease-out
      const weight = (symmetry - 0.5) * 2;
      return easeOutElastic(c) * weight + c * (1 - weight);
    }
  };
};