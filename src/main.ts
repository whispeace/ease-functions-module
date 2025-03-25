// Импортируем стили
import './styles.css';

// Импортируем весь модуль
import * as EasingModule from './index';

// Импортируем демонстрацию
import './demo';

// Делаем модуль доступным в глобальном объекте window для тестирования в консоли
(window as any).EasingModule = EasingModule;

console.log('Модуль функций сглаживания загружен и готов к использованию.');
console.log('Вы можете получить доступ к API через объект EasingModule в консоли браузера.');