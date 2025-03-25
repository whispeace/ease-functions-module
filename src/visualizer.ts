import { EasingFunction } from './types';
import * as easingFunctions from './easing-functions';

/**
 * Класс для визуальной демонстрации и сравнения функций сглаживания
 */
export class EasingVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private padding: number = 30; // Увеличенный padding для улучшения читаемости
  private functions: Map<string, { fn: EasingFunction, color: string }> = new Map();
  private colors: string[] = [
    '#89b4fa', '#f38ba8', '#a6e3a1', '#fab387', '#cba6f7', 
    '#f9e2af', '#94e2d5', '#b4befe', '#f5c2e7', '#74c7ec'
  ];
  
  /**
   * Создает новый визуализатор функций сглаживания
   * @param canvasId ID элемента canvas
   * @param width Ширина холста
   * @param height Высота холста
   */
  constructor(canvasId: string, width = 800, height = 300) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas элемент с ID ${canvasId} не найден`);
    }
    
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Не удалось получить 2D контекст холста');
    }
    
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    
    // Устанавливаем базовые функции
    this.addFunction('linear', (t) => t);
    this.addFunction('easeInQuad', easingFunctions.easeInQuad);
    this.addFunction('easeOutQuad', easingFunctions.easeOutQuad);
    this.addFunction('easeInOutQuad', easingFunctions.easeInOutQuad);
    
    // Делаем canvas адаптивным
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }
  
  /**
   * Обрабатывает изменение размера окна
   */
  private handleResize(): void {
    const containerWidth = this.canvas.parentElement?.clientWidth || this.width;
    
    // Устанавливаем размеры canvas
    this.canvas.style.width = '100%';
    this.canvas.style.height = `${this.height}px`;
    
    // Учитываем pixel ratio для четкости на ретина-дисплеях
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = containerWidth * dpr;
    this.canvas.height = this.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.width = containerWidth;
    
    // Перерисовываем графики
    this.draw();
  }
  
  /**
   * Добавляет функцию сглаживания для отображения
   * @param name Имя функции
   * @param fn Функция сглаживания
   */
  addFunction(name: string, fn: EasingFunction): void {
    // Выбираем цвет из палитры
    const colorIndex = this.functions.size % this.colors.length;
    const color = this.colors[colorIndex];
    
    this.functions.set(name, { fn, color });
    this.draw();
  }
  
  /**
   * Удаляет функцию сглаживания с графика
   * @param name Имя функции
   */
  removeFunction(name: string): void {
    this.functions.delete(name);
    this.draw();
  }
  
  /**
   * Очищает все функции
   */
  clearFunctions(): void {
    this.functions.clear();
    this.draw();
  }
  
  /**
   * Отрисовывает все функции
   */
  draw(): void {
    // Очищаем холст
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Рисуем координатную сетку
    this.drawGrid();
    
    // Рисуем оси координат
    this.drawAxes();
    
    // Рисуем каждую функцию
    for (const [name, { fn, color }] of this.functions.entries()) {
      this.drawFunction(fn, color);
    }
    
    // Рисуем легенду
    this.drawLegend();
  }
  
  /**
   * Отрисовывает координатную сетку
   */
  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(166, 173, 200, 0.15)'; // Светло-серый с прозрачностью
    this.ctx.lineWidth = 1;
    
    // Горизонтальные линии
    for (let y = 0; y <= 1; y += 0.2) {
      const pixelY = this.mapY(y);
      this.ctx.beginPath();
      this.ctx.moveTo(this.padding, pixelY);
      this.ctx.lineTo(this.width - this.padding, pixelY);
      this.ctx.stroke();
    }
    
    // Вертикальные линии
    for (let x = 0; x <= 1; x += 0.2) {
      const pixelX = this.mapX(x);
      this.ctx.beginPath();
      this.ctx.moveTo(pixelX, this.padding);
      this.ctx.lineTo(pixelX, this.height - this.padding);
      this.ctx.stroke();
    }
  }
  
  /**
   * Отрисовывает оси координат
   */
  private drawAxes(): void {
    this.ctx.strokeStyle = 'rgba(205, 214, 244, 0.8)'; // Светлый цвет для осей
    this.ctx.lineWidth = 1.5;
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillStyle = 'rgba(205, 214, 244, 0.8)';
    
    // Ось X
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.height - this.padding);
    this.ctx.lineTo(this.width - this.padding, this.height - this.padding);
    this.ctx.stroke();
    
    // Подписи на оси X
    for (let x = 0; x <= 1; x += 0.2) {
      const pixelX = this.mapX(x);
      this.ctx.fillText(x.toFixed(1), pixelX - 8, this.height - this.padding + 16);
    }
    this.ctx.fillText('t', this.width - this.padding + 10, this.height - this.padding + 5);
    
    // Ось Y
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.height - this.padding);
    this.ctx.lineTo(this.padding, this.padding);
    this.ctx.stroke();
    
    // Подписи на оси Y
    for (let y = 0; y <= 1; y += 0.2) {
      const pixelY = this.mapY(y);
      this.ctx.fillText(y.toFixed(1), this.padding - 25, pixelY + 4);
    }
    this.ctx.fillText('value', this.padding - 18, this.padding - 10);
  }
  
  /**
   * Отрисовывает функцию сглаживания
   * @param fn Функция сглаживания
   * @param color Цвет линии
   */
  private drawFunction(fn: EasingFunction, color: string): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    
    // Рисуем график функции с более высоким разрешением для плавности
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const value = fn(t);
      
      const x = this.mapX(t);
      const y = this.mapY(value);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
  }
  
  /**
   * Отрисовывает легенду с функциями
   */
  private drawLegend(): void {
    const legendPadding = 10;
    const itemHeight = 20;
    const legendTop = this.padding;
    let currentY = legendTop;
    
    for (const [name, { color }] of this.functions.entries()) {
      // Рисуем цветной индикатор
      this.ctx.fillStyle = color;
      this.ctx.fillRect(this.width - 130, currentY, 12, 12);
      
      // Рисуем название функции
      this.ctx.fillStyle = 'rgba(205, 214, 244, 0.8)';
      this.ctx.font = '12px Inter, sans-serif';
      this.ctx.fillText(name, this.width - 110, currentY + 10);
      
      currentY += itemHeight;
    }
  }
  
  /**
   * Преобразует X-координату из диапазона [0, 1] в пиксели холста
   */
  private mapX(x: number): number {
    return this.padding + x * (this.width - 2 * this.padding);
  }
  
  /**
   * Преобразует Y-координату из диапазона [0, 1] в пиксели холста
   * Учитывает, что ось Y в браузере направлена вниз, а математически - вверх
   */
  private mapY(y: number): number {
    return (this.height - this.padding) - y * (this.height - 2 * this.padding);
  }
  
  /**
   * Добавляет интерактивные элементы управления
   * @param containerId ID контейнера для элементов управления
   */
  addControls(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Контейнер с ID ${containerId} не найден`);
    }
    
    // Создаем контейнер для выбора функций
    const functionSelectContainer = document.createElement('div');
    functionSelectContainer.className = 'function-select-container';
    
    // Создаем выпадающий список со всеми доступными функциями
    const select = document.createElement('select');
    select.className = 'select';
    select.id = 'easing-function-select';
    
    // Добавляем опции для всех функций из easing-functions
    const fnNames = Object.keys(easingFunctions).sort();
    fnNames.forEach(fnName => {
      const option = document.createElement('option');
      option.value = fnName;
      option.textContent = fnName;
      select.appendChild(option);
    });
    
    // Создаем кнопку добавления
    const addButton = document.createElement('button');
    addButton.className = 'btn primary';
    addButton.textContent = 'Добавить функцию';
    addButton.onclick = () => {
      const fnName = select.value;
      if (fnName && !this.functions.has(fnName)) {
        this.addFunction(fnName, (easingFunctions as any)[fnName]);
        this.updateFunctionList(functionListContainer);
      }
    };
    
    // Создаем кнопку очистки
    const clearButton = document.createElement('button');
    clearButton.className = 'btn';
    clearButton.textContent = 'Очистить все';
    clearButton.onclick = () => {
      this.clearFunctions();
      this.updateFunctionList(functionListContainer);
    };
    
    // Добавляем элементы в контейнер выбора функций
    functionSelectContainer.appendChild(select);
    functionSelectContainer.appendChild(addButton);
    functionSelectContainer.appendChild(clearButton);
    
    // Создаем контейнер для списка активных функций
    const functionListContainer = document.createElement('div');
    functionListContainer.className = 'function-list';
    
    // Обновляем текущий список функций
    this.updateFunctionList(functionListContainer);
    
    // Добавляем всё в основной контейнер
    container.appendChild(functionSelectContainer);
    container.appendChild(functionListContainer);
  }
  
  /**
   * Обновляет список отображаемых функций
   * @param container Контейнер для списка функций
   */
  private updateFunctionList(container: HTMLElement): void {
    // Очищаем текущее содержимое
    container.innerHTML = '';
    
    // Добавляем каждую функцию в виде чипа
    for (const [name, { color }] of this.functions.entries()) {
      const chip = document.createElement('div');
      chip.className = 'function-chip';
      
      // Цветной индикатор
      const colorIndicator = document.createElement('span');
      colorIndicator.className = 'color-indicator';
      colorIndicator.style.backgroundColor = color;
      
      // Название функции
      const nameSpan = document.createElement('span');
      nameSpan.textContent = name;
      
      // Кнопка удаления
      const removeBtn = document.createElement('span');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '×';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        this.removeFunction(name);
        this.updateFunctionList(container);
      };
      
      chip.appendChild(colorIndicator);
      chip.appendChild(nameSpan);
      chip.appendChild(removeBtn);
      
      container.appendChild(chip);
    }
  }
}