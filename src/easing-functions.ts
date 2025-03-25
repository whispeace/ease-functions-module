import { EasingFunction } from './types';
import { clamp, makeEaseIn, makeEaseOut, makeEaseInOut } from './core';

/**
 * Линейная функция (без сглаживания)
 */
export const linear: EasingFunction = (t) => clamp(t);

// Семейство синусоидальных функций
/**
 * Синусоидальная функция ускорения (мягкое начало)
 */
export const easeInSine: EasingFunction = (t) => 
  1 - Math.cos((clamp(t) * Math.PI) / 2);

/**
 * Синусоидальная функция замедления (мягкий конец)
 */
export const easeOutSine: EasingFunction = (t) => 
  Math.sin((clamp(t) * Math.PI) / 2);

/**
 * Синусоидальная функция ускорения-замедления (мягкое начало и конец)
 */
export const easeInOutSine: EasingFunction = (t) => 
  -(Math.cos(Math.PI * clamp(t)) - 1) / 2;

// Семейство квадратичных функций
/**
 * Квадратичная функция ускорения (t²)
 */
export const easeInQuad = makeEaseIn(2);

/**
 * Квадратичная функция замедления (1-(1-t)²)
 */
export const easeOutQuad = makeEaseOut(2);

/**
 * Квадратичная функция ускорения-замедления
 */
export const easeInOutQuad = makeEaseInOut(2);

// Семейство кубических функций
/**
 * Кубическая функция ускорения (t³)
 */
export const easeInCubic = makeEaseIn(3);

/**
 * Кубическая функция замедления (1-(1-t)³)
 */
export const easeOutCubic = makeEaseOut(3);

/**
 * Кубическая функция ускорения-замедления
 */
export const easeInOutCubic = makeEaseInOut(3);

// Семейство функций четвертой степени
/**
 * Функция ускорения 4-й степени (t⁴)
 */
export const easeInQuart = makeEaseIn(4);

/**
 * Функция замедления 4-й степени (1-(1-t)⁴)
 */
export const easeOutQuart = makeEaseOut(4);

/**
 * Функция ускорения-замедления 4-й степени
 */
export const easeInOutQuart = makeEaseInOut(4);

// Семейство функций пятой степени
/**
 * Функция ускорения 5-й степени (t⁵)
 */
export const easeInQuint = makeEaseIn(5);

/**
 * Функция замедления 5-й степени (1-(1-t)⁵)
 */
export const easeOutQuint = makeEaseOut(5);

/**
 * Функция ускорения-замедления 5-й степени
 */
export const easeInOutQuint = makeEaseInOut(5);

// Экспоненциальные функции
/**
 * Экспоненциальная функция ускорения (2^(10(t-1)))
 */
export const easeInExpo: EasingFunction = (t) => 
  t === 0 ? 0 : Math.pow(2, 10 * clamp(t) - 10);

/**
 * Экспоненциальная функция замедления
 */
export const easeOutExpo: EasingFunction = (t) => 
  t === 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t));

/**
 * Экспоненциальная функция ускорения-замедления
 */
export const easeInOutExpo: EasingFunction = (t) => {
  const c = clamp(t);
  if (c === 0) return 0;
  if (c === 1) return 1;
  if (c < 0.5) return Math.pow(2, 20 * c - 10) / 2;
  return (2 - Math.pow(2, -20 * c + 10)) / 2;
};

// Циркулярные функции
/**
 * Круговая функция ускорения (основана на уравнении окружности)
 */
export const easeInCirc: EasingFunction = (t) => 
  1 - Math.sqrt(1 - Math.pow(clamp(t), 2));

/**
 * Круговая функция замедления
 */
export const easeOutCirc: EasingFunction = (t) => 
  Math.sqrt(1 - Math.pow(clamp(t) - 1, 2));

/**
 * Круговая функция ускорения-замедления
 */
export const easeInOutCirc: EasingFunction = (t) => {
  const c = clamp(t);
  if (c < 0.5) {
    return (1 - Math.sqrt(1 - Math.pow(2 * c, 2))) / 2;
  } else {
    return (Math.sqrt(1 - Math.pow(-2 * c + 2, 2)) + 1) / 2;
  }
};

// Функции с эффектом "отскока назад"
/**
 * Функция с "оттяжкой назад" при начале
 */
export const easeInBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * clamp(t) * clamp(t) * clamp(t) - c1 * clamp(t) * clamp(t);
};

/**
 * Функция с "оттяжкой назад" при завершении
 */
export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(clamp(t) - 1, 3) + c1 * Math.pow(clamp(t) - 1, 2);
};

/**
 * Функция с "оттяжкой назад" при начале и завершении
 */
export const easeInOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  const c = clamp(t);
  
  if (c < 0.5) {
    return (Math.pow(2 * c, 2) * ((c2 + 1) * 2 * c - c2)) / 2;
  } else {
    return (Math.pow(2 * c - 2, 2) * ((c2 + 1) * (c * 2 - 2) + c2) + 2) / 2;
  }
};

// Эластичные функции
/**
 * Эластичная функция ускорения (имитирует растяжение пружины)
 */
export const easeInElastic: EasingFunction = (t) => {
  const c = clamp(t);
  if (c === 0) return 0;
  if (c === 1) return 1;
  
  const c4 = (2 * Math.PI) / 3;
  return -Math.pow(2, 10 * c - 10) * Math.sin((c * 10 - 10.75) * c4);
};

/**
 * Эластичная функция замедления (имитирует затухание пружины)
 */
export const easeOutElastic: EasingFunction = (t) => {
  const c = clamp(t);
  if (c === 0) return 0;
  if (c === 1) return 1;
  
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * c) * Math.sin((c * 10 - 0.75) * c4) + 1;
};

/**
 * Эластичная функция ускорения-замедления
 */
export const easeInOutElastic: EasingFunction = (t) => {
  const c = clamp(t);
  if (c === 0) return 0;
  if (c === 1) return 1;
  
  const c5 = (2 * Math.PI) / 4.5;
  if (c < 0.5) {
    return -(Math.pow(2, 20 * c - 10) * Math.sin((20 * c - 11.125) * c5)) / 2;
  } else {
    return (
      (Math.pow(2, -20 * c + 10) * Math.sin((20 * c - 11.125) * c5)) / 2 + 1
    );
  }
};

// Функции с эффектом "отскока"
/**
 * Функция отскока при начале 
 */
export const easeInBounce: EasingFunction = (t) => {
  return 1 - easeOutBounce(1 - clamp(t));
};

/**
 * Функция отскока при завершении (как мяч, падающий на пол)
 */
export const easeOutBounce: EasingFunction = (t) => {
  let c = clamp(t);
  const n1 = 7.5625;
  const d1 = 2.75;
  
  if (c < 1 / d1) {
    return n1 * c * c;
  } else if (c < 2 / d1) {
    return n1 * (c -= 1.5 / d1) * c + 0.75;
  } else if (c < 2.5 / d1) {
    return n1 * (c -= 2.25 / d1) * c + 0.9375;
  } else {
    return n1 * (c -= 2.625 / d1) * c + 0.984375;
  }
};

/**
 * Функция отскока при начале и завершении
 */
export const easeInOutBounce: EasingFunction = (t) => {
  const c = clamp(t);
  if (c < 0.5) {
    return (1 - easeOutBounce(1 - 2 * c)) / 2;
  } else {
    return (1 + easeOutBounce(2 * c - 1)) / 2;
  }
};