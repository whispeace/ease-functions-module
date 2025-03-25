import { EasingFunction } from './types';

/**
 * Параметры анимации
 */
export interface AnimationOptions<T> {
  /** Целевой объект */
  target: T;
  /** Имя свойства для анимации */
  property: keyof T;
  /** Начальное значение */
  start: number;
  /** Конечное значение */
  end: number;
  /** Длительность анимации в миллисекундах */
  duration: number;
  /** Функция сглаживания */
  easingFn: EasingFunction;
  /** Колбэк для обновления (вызывается на каждом кадре) */
  onUpdate?: (value: number, progress: number) => void;
  /** Колбэк при завершении анимации */
  onComplete?: () => void;
}

/**
 * Менеджер анимаций
 */
export class Animator {
  /** Карта активных анимаций */
  private animations: Map<any, Map<string, {
    startTime: number;
    options: AnimationOptions<any>;
  }>> = new Map();
  
  /** ID текущего кадра анимации */
  private animationFrameId: number | null = null;
  
  /** Флаг запущенного цикла анимации */
  private isRunning: boolean = false;
  
  /**
   * Запускает анимацию свойства объекта
   * @param options Параметры анимации
   */
  animate<T extends Record<string, any>>(options: AnimationOptions<T>): void {
    const { target, property } = options;
    
    // Создаем записи для целевого объекта, если их еще нет
    if (!this.animations.has(target)) {
      this.animations.set(target, new Map());
    }
    
    // Сохраняем информацию об анимации
    this.animations.get(target)!.set(property as string, {
      startTime: performance.now(),
      options
    });
    
    // Запускаем цикл анимации, если он еще не запущен
    if (!this.isRunning) {
      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    }
  }
  
  /**
   * Функция обновления, вызываемая на каждом кадре
   * @private
   */
  private update(currentTime: number): void {
    let hasActiveAnimations = false;
    
    // Обрабатываем все активные анимации
    for (const [target, propertyMap] of this.animations.entries()) {
      for (const [property, animation] of propertyMap.entries()) {
        const { options, startTime } = animation;
        const { start, end, duration, easingFn, onUpdate, onComplete } = options;
        
        // Вычисляем прогресс анимации
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = start + (end - start) * easingFn(progress);
        
        // Обновляем свойство цели
        target[property] = value;
        
        // Вызываем колбэк обновления, если он задан
        if (onUpdate) {
          onUpdate(value, progress);
        }
        
        // Если анимация завершена, удаляем её
        if (progress >= 1) {
          propertyMap.delete(property);
          
          // Вызываем колбэк завершения, если он задан
          if (onComplete) {
            onComplete();
          }
        } else {
          hasActiveAnimations = true;
        }
      }
      
      // Если у объекта не осталось анимаций, удаляем его из карты
      if (propertyMap.size === 0) {
        this.animations.delete(target);
      }
    }
    
    // Продолжаем цикл анимации, если есть активные анимации
    if (hasActiveAnimations) {
      this.animationFrameId = requestAnimationFrame(this.update.bind(this));
    } else {
      this.isRunning = false;
      this.animationFrameId = null;
    }
  }
  
  /**
   * Останавливает все активные анимации
   */
  stopAll(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.isRunning = false;
    }
    
    this.animations.clear();
  }
  
  /**
   * Останавливает все анимации для указанного объекта
   * @param target Целевой объект
   */
  stopTarget<T>(target: T): void {
    if (this.animations.has(target)) {
      this.animations.delete(target);
    }
  }
  
  /**
   * Останавливает анимацию конкретного свойства объекта
   * @param target Целевой объект
   * @param property Имя свойства
   */
  stopProperty<T>(target: T, property: keyof T): void {
    if (this.animations.has(target)) {
      this.animations.get(target)!.delete(property as string);
      
      if (this.animations.get(target)!.size === 0) {
        this.animations.delete(target);
      }
    }
  }
}