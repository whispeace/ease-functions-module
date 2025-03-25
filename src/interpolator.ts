import { EasingFunction, Interpolator } from './types';

/**
 * Интерполятор для чисел
 */
export class NumberInterpolator implements Interpolator<number> {
  /**
   * Интерполирует между двумя числами
   */
  interpolate(start: number, end: number, easingFn: EasingFunction, t: number): number {
    return start + (end - start) * easingFn(t);
  }
}

/**
 * Интерполятор для 2D векторов
 */
export class Vector2Interpolator implements Interpolator<{ x: number, y: number }> {
  private numberInterpolator = new NumberInterpolator();
  
  /**
   * Интерполирует между двумя 2D векторами
   */
  interpolate(
    start: { x: number, y: number }, 
    end: { x: number, y: number }, 
    easingFn: EasingFunction, 
    t: number
  ): { x: number, y: number } {
    return {
      x: this.numberInterpolator.interpolate(start.x, end.x, easingFn, t),
      y: this.numberInterpolator.interpolate(start.y, end.y, easingFn, t)
    };
  }
}

/**
 * Интерполятор для 3D векторов
 */
export class Vector3Interpolator implements Interpolator<{ x: number, y: number, z: number }> {
  private numberInterpolator = new NumberInterpolator();
  
  /**
   * Интерполирует между двумя 3D векторами
   */
  interpolate(
    start: { x: number, y: number, z: number }, 
    end: { x: number, y: number, z: number }, 
    easingFn: EasingFunction, 
    t: number
  ): { x: number, y: number, z: number } {
    return {
      x: this.numberInterpolator.interpolate(start.x, end.x, easingFn, t),
      y: this.numberInterpolator.interpolate(start.y, end.y, easingFn, t),
      z: this.numberInterpolator.interpolate(start.z, end.z, easingFn, t)
    };
  }
}

/**
 * Интерполятор для цветов в формате RGB
 */
export class RGBColorInterpolator implements Interpolator<{ r: number, g: number, b: number }> {
  private numberInterpolator = new NumberInterpolator();
  
  /**
   * Интерполирует между двумя RGB цветами
   */
  interpolate(
    start: { r: number, g: number, b: number }, 
    end: { r: number, g: number, b: number }, 
    easingFn: EasingFunction, 
    t: number
  ): { r: number, g: number, b: number } {
    return {
      r: Math.round(this.numberInterpolator.interpolate(start.r, end.r, easingFn, t)),
      g: Math.round(this.numberInterpolator.interpolate(start.g, end.g, easingFn, t)),
      b: Math.round(this.numberInterpolator.interpolate(start.b, end.b, easingFn, t))
    };
  }
}

/**
 * Интерполятор для углов (в радианах)
 */
export class AngleInterpolator implements Interpolator<number> {
  /**
   * Интерполирует между двумя углами по кратчайшему пути
   */
  interpolate(start: number, end: number, easingFn: EasingFunction, t: number): number {
    // Нормализуем углы в диапазон [0, 2π]
    const normalize = (angle: number) => {
      const twoPI = 2 * Math.PI;
      return ((angle % twoPI) + twoPI) % twoPI;
    };
    
    const a = normalize(start);
    const b = normalize(end);
    
    // Находим кратчайший путь
    let d = b - a;
    if (Math.abs(d) > Math.PI) {
      d = d > 0 ? d - 2 * Math.PI : d + 2 * Math.PI;
    }
    
    return a + d * easingFn(t);
  }
}