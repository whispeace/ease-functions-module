import { 
  easeOutQuad, 
  easeInQuad, 
  easeOutElastic,
  easeInOutBack,
  easeOutBounce,
  easeInOutQuad,
  linear,
  easingCombinator, 
  animator, 
  createVisualizer 
} from './index';

/**
 * Инициализирует демонстрацию и настраивает интерактивные элементы
 */
document.addEventListener('DOMContentLoaded', () => {
  // Создаем визуализатор
  const visualizer = createVisualizer('easing-canvas', 'easing-controls');
  
  // Инициализируем демонстрации
  setupJumpDemo();
  setupMoveDemo();
  setupFadeDemo();
  
  // Показываем составную функцию для прыжка
  const jumpEasing = easingCombinator.conditional([
    {
      predicate: (t) => t < 0.5,
      fn: (t) => easeOutQuad(t * 2) / 2
    },
    {
      predicate: (t) => t >= 0.5,
      fn: (t) => 0.5 + easeInQuad((t - 0.5) * 2) / 2
    }
  ]);
  
  // Добавляем составную функцию прыжка в визуализатор
  visualizer.addFunction('jumpEasing', jumpEasing);
  
  /**
   * Настраивает демонстрацию прыжка
   */
  function setupJumpDemo(): void {
    const character = document.getElementById('character');
    if (!character) return;
    
    // Получаем исходную позицию персонажа
    const getInitialY = () => {
      const characterRect = character.getBoundingClientRect();
      const demoAreaRect = character.parentElement!.getBoundingClientRect();
      return characterRect.top - demoAreaRect.top;
    };
    
    const initialY = getInitialY();
    
    // Функция прыжка
    const jump = () => {
      const jumpHeight = 80; // высота прыжка в пикселях
      const duration = 800; // длительность прыжка в мс
      
      // Создаем функцию для прыжка
      const jumpEasing = easingCombinator.conditional([
        {
          predicate: (t) => t < 0.5,
          fn: (t) => easeOutQuad(t * 2) / 2
        },
        {
          predicate: (t) => t >= 0.5,
          fn: (t) => 0.5 + easeInQuad((t - 0.5) * 2) / 2
        }
      ]);
      
      // Запускаем анимацию
      animator.animate({
        target: {
          value: initialY
        },
        property: 'value',
        start: initialY,
        end: initialY,
        duration,
        easingFn: jumpEasing,
        onUpdate: (_, progress) => {
          const jumpOffset = jumpHeight * (1 - Math.abs(2 * progress - 1));
          character.style.transform = `translateX(-50%) translateY(-${jumpOffset}px)`;
        },
        onComplete: () => {
          character.style.transform = 'translateX(-50%) translateY(0)';
        }
      });
    };
    
    // Подключаем обработчик к кнопке
    const jumpButton = document.getElementById('jump-button');
    if (jumpButton) {
      jumpButton.addEventListener('click', jump);
    }
  }
  
  /**
   * Настраивает демонстрацию движения
   */
  function setupMoveDemo(): void {
    const box = document.getElementById('moving-box');
    if (!box) return;
    
    // Получаем родительский контейнер
    const demoArea = box.parentElement!;
    const width = demoArea.clientWidth;
    
    // Перемещаем box из начальной в конечную позицию и обратно
    let isAtStart = true;
    
    const move = () => {
      const startX = isAtStart ? '10%' : '85%';
      const endX = isAtStart ? '85%' : '10%';
      const duration = 1000;
      
      // Получаем выбранную функцию из select
      const select = document.getElementById('movement-easing') as HTMLSelectElement;
      const easingName = select?.value || 'easeInOutQuad';
      const easingFn = getEasingFunctionByName(easingName);
      
      // Запускаем анимацию
      animator.animate({
        target: box.style,
        property: 'left',
        start: 0,
        end: 1,
        duration,
        easingFn,
        onUpdate: (_, progress) => {
          box.style.left = `calc(${startX} + ${progress * (parseInt(endX) - parseInt(startX))}%)`;
        },
        onComplete: () => {
          isAtStart = !isAtStart;
        }
      });
    };
    
    // Подключаем обработчик к кнопке
    const moveButton = document.getElementById('move-button');
    if (moveButton) {
      moveButton.addEventListener('click', move);
    }
  }
  
  /**
   * Настраивает демонстрацию затухания
   */
  function setupFadeDemo(): void {
    const circle = document.getElementById('fading-circle');
    if (!circle) return;
    
    let isVisible = true;
    
    const fade = () => {
      // Получаем выбранную длительность из слайдера
      const durationInput = document.getElementById('fade-duration') as HTMLInputElement;
      const duration = parseInt(durationInput?.value || '1000');
      
      // Определяем начальное и конечное значение
      const startOpacity = isVisible ? 1 : 0;
      const endOpacity = isVisible ? 0 : 1;
      
      // Функция сглаживания
      const easingFn = isVisible ? easeOutQuad : easeInQuad;
      
      // Обновляем значение над слайдером
      const durationValueEl = document.getElementById('duration-value');
      if (durationValueEl) {
        durationValueEl.textContent = `${duration}ms`;
      }
      
      // Запускаем анимацию
      animator.animate({
        target: circle.style,
        property: 'opacity',
        start: startOpacity,
        end: endOpacity,
        duration,
        easingFn,
        onUpdate: (value) => {
          circle.style.opacity = value.toString();
        },
        onComplete: () => {
          isVisible = !isVisible;
        }
      });
    };
    
    // Подключаем обработчик к кнопке
    const fadeButton = document.getElementById('fade-button');
    if (fadeButton) {
      fadeButton.addEventListener('click', fade);
    }
    
    // Подключаем обработчик изменения слайдера
    const durationInput = document.getElementById('fade-duration');
    if (durationInput) {
      durationInput.addEventListener('input', () => {
        const value = parseInt((durationInput as HTMLInputElement).value);
        const durationValueEl = document.getElementById('duration-value');
        if (durationValueEl) {
          durationValueEl.textContent = `${value}ms`;
        }
      });
    }
  }
  
  /**
   * Возвращает функцию сглаживания по имени
   * @param name Имя функции
   */
  function getEasingFunctionByName(name: string) {
    const easingFunctions: Record<string, any> = {
      'linear': linear,
      'easeInOutQuad': easeInOutQuad,
      'easeOutElastic': easeOutElastic,
      'easeInOutBack': easeInOutBack,
      'easeOutBounce': easeOutBounce
    };
    
    return easingFunctions[name] || easeInOutQuad;
  }
});