// Экспортируем все из каждого модуля
export * from './types';
export * from './core';
export * from './easing-functions';
export * from './bezier';
export * from './combinator';
export * from './interpolator';
export * from './animation';
export * from './visualizer';

// Экспортируем контекстуальные функции
export * from './contextual/types';
export * from './contextual/functions';

// Экспортируем метафункции
export * from './meta/types';
export * from './meta/profiles';
export * from './meta/functions';

// Экспортируем параметрические функции
export * from './parametric/types';
export * from './parametric/generators';

// Создаем и экспортируем готовые к использованию экземпляры
import { DefaultEasingCombinator } from './combinator';
import { 
  NumberInterpolator, 
  Vector2Interpolator, 
  Vector3Interpolator, 
  RGBColorInterpolator,
  AngleInterpolator 
} from './interpolator';
import { Animator } from './animation';
import { EasingVisualizer } from './visualizer';

// Готовые к использованию экземпляры
export const easingCombinator = new DefaultEasingCombinator();
export const numberInterpolator = new NumberInterpolator();
export const vector2Interpolator = new Vector2Interpolator();
export const vector3Interpolator = new Vector3Interpolator();
export const rgbColorInterpolator = new RGBColorInterpolator();
export const angleInterpolator = new AngleInterpolator();
export const animator = new Animator();

// Функция для создания визуализатора
export const createVisualizer = (
  canvasId: string, 
  controlsId?: string, 
  width = 500, 
  height = 300
): EasingVisualizer => {
  const visualizer = new EasingVisualizer(canvasId, width, height);
  
  if (controlsId) {
    visualizer.addControls(controlsId);
  }
  
  return visualizer;
};