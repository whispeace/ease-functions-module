import { 
  easeOutQuad, 
  easeInQuad, 
  easeOutElastic,
  easeInOutBack,
  easingCombinator, 
  vector2Interpolator, 
  animator,
  createVisualizer
} from './index';

// Пример 1: Анимация прыжка персонажа
class GameCharacter {
  position: { x: number; y: number };
  isJumping: boolean;
  
  constructor(x: number, y: number) {
    this.position = { x, y };
    this.isJumping = false;
  }
  
  // Метод для выполнения прыжка
  jump(height: number, duration: number): void {
    if (this.isJumping) return;
    
    this.isJumping = true;
    
    // Сохраняем начальную позицию
    const startY = this.position.y;
    
    // Создаем составную функцию для прыжка:
    // Первая половина - подъем (easeOutQuad)
    // Вторая половина - падение (easeInQuad)
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
      target: this,
      property: 'position',
      start: 0,
      end: 1,
      duration,
      easingFn: jumpEasing,
      onUpdate: (_, progress) => {
        // Вычисляем текущую высоту прыжка
        const jumpHeight = height * (1 - Math.abs(2 * progress - 1));
        
        // Обновляем позицию персонажа
        this.position.y = startY - jumpHeight;
      },
      onComplete: () => {
        this.isJumping = false;
        console.log('Прыжок завершен!');
      }
    });
  }
}

// Инициализация и использование
document.addEventListener('DOMContentLoaded', () => {
  // Создаем персонажа
  const character = new GameCharacter(100, 200);
  
  // Кнопка для запуска прыжка
  const jumpButton = document.getElementById('jump-button');
  if (jumpButton) {
    jumpButton.addEventListener('click', () => {
      character.jump(150, 800); // высота 150px, длительность 800мс
    });
  }
  
  // Создаем визуализатор
  const visualizer = createVisualizer('easing-canvas', 'easing-controls');
  
  // Добавляем наши сложные функции
  visualizer.addFunction('jumpEasing', easingCombinator.conditional([
    {
      predicate: (t) => t < 0.5,
      fn: (t) => easeOutQuad(t * 2) / 2
    },
    {
      predicate: (t) => t >= 0.5,
      fn: (t) => 0.5 + easeInQuad((t - 0.5) * 2) / 2
    }
  ]));
  
  // Пример сложной функции путем смешивания
  const complexEasing = easingCombinator.blend(
    [easeInOutBack, easeOutElastic],
    [0.7, 0.3]
  );
  
  visualizer.addFunction('complexEasing', complexEasing);
});