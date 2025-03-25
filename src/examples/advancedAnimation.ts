import { animator } from "..";
import { semanticEasing, contextualSemanticEasing } from "../meta/functions";
import { MovementProfiles, createMovementProfile } from "../meta/profiles";
import { springFamily, polynomialFamily, elasticFamily } from "../parametric/generators";

// Пример использования метафункций
export function animateWithSemantics(element: HTMLElement): void {
  // Используем предопределенный профиль для естественного движения
  const naturalEasing = semanticEasing(MovementProfiles.NATURAL);
  
  // Собственный профиль для подводного движения
  const underwaterProfile = createMovementProfile(
    'Подводное',
    'Движение с имитацией сопротивления воды',
    {
      fluidity: 0.9,
      weight: 0.7,
      elasticity: 0.3,
      predictability: 0.7,
      complexity: 0.4,
      energy: 0.3,
      organicity: 0.8,
      playfulness: 0.2,
      aggression: 0.1
    }
  );
  
  // Создаем функцию сглаживания для подводного движения
  const underwaterEasing = semanticEasing(underwaterProfile);
  
  // Анимируем элемент с естественным движением
  animator.animate({
    target: element.style,
    property: 'left',
    start: 0,
    end: 500,
    duration: 2000,
    easingFn: naturalEasing,
    onComplete: () => {
      // После завершения анимируем обратно с подводным движением
      animator.animate({
        target: element.style,
        property: 'left',
        start: 500,
        end: 0,
        duration: 3000,
        easingFn: underwaterEasing
      });
    }
  });
}

// Пример использования контекстуальных функций
export function animateWithContext(element: HTMLElement): void {
  // Контекст для анимации
  const context = {
    direction: 'alternating' as const,
    iteration: 0,
    velocity: 0,
    previousValue: 0,
    gravity: 9.8,
    resistance: 0.2
  };
  
  // Используем контекстуальную метафункцию
  const bouncyEasing = contextualSemanticEasing(MovementProfiles.PLAYFUL);
  
  // Функция обновления для пошаговой анимации
  const updateAnimation = (currentTime: number): void => {
    if (!startTime) {
      startTime = currentTime;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Обновляем контекст
    context.iteration = Math.floor(elapsed / 1000);
    context.previousValue = currentValue;
    
    // Вычисляем новое значение с учетом контекста
    currentValue = bouncyEasing(progress, context);
    
    // Рассчитываем скорость
    const deltaValue = currentValue - (context.previousValue || 0);
    context.velocity = deltaValue * 60; // Приблизительно для 60fps
    
    // Обновляем позицию элемента
    element.style.transform = `translateY(${currentValue * 200}px)`;
    
    // Продолжаем анимацию
    if (progress < 1) {
      requestAnimationFrame(updateAnimation);
    }
  };
  
  let startTime: number | null = null;
  let currentValue = 0;
  const duration = 3000;
  
  // Запускаем анимационный цикл
  requestAnimationFrame(updateAnimation);
}

// Пример использования параметрических семейств
export function animateWithParametricFamily(element: HTMLElement): void {
  // Создаем пружинную функцию с высокой осцилляцией
  const bouncySpring = springFamily({
    oscillation: 5,
    damping: 0.3,
    intensity: 0.8,
    overshoot: 2.5,
    anticipation: 0.2,
    followThrough: 0.4
  });
  
  // Создаем полиномиальную функцию с высокой интенсивностью
  const sharpPolynomial = polynomialFamily({
    intensity: 0.9,
    symmetry: 0.2,
    smoothness: 0.3
  });
  
  // Комбинируем функции для создания сложного эффекта
  const elasticBounce = elasticFamily({
    oscillation: 3,
    overshoot: 1.8,
    damping: 0.4,
    symmetry: 0.7
  });
  
  // Последовательная анимация с разными функциями
  animator.animate({
    target: element.style,
    property: 'transform',
    start: 0,
    end: 1,
    duration: 1500,
    easingFn: bouncySpring,
    onUpdate: (value) => {
      element.style.transform = `scale(${0.5 + value * 0.5})`;
    },
    onComplete: () => {
      // Вторая фаза
      animator.animate({
        target: element.style,
        property: 'transform',
        start: 0,
        end: 1,
        duration: 1200,
        easingFn: sharpPolynomial,
        onUpdate: (value) => {
          element.style.transform = `scale(${1.0}) rotate(${value * 360}deg)`;
        },
        onComplete: () => {
          // Третья фаза
          animator.animate({
            target: element.style,
            property: 'transform',
            start: 0,
            end: 1,
            duration: 2000,
            easingFn: elasticBounce,
            onUpdate: (value) => {
              element.style.transform = `scale(${1.0 + value * 0.3}) 
                                        translateX(${value * 200}px)`;
            }
          });
        }
      });
    }
  });
}