import { MovementCharacteristics, MovementProfile } from './types';

/**
 * Коллекция предопределенных профилей движения,
 * описывающих различные стили и характеристики
 */
export const MovementProfiles: Record<string, MovementProfile> = {
  NATURAL: {
    name: 'Естественное',
    description: 'Имитирует природные, органические движения с небольшими нюансами и вариациями',
    characteristics: {
      fluidity: 0.8,
      weight: 0.6,
      elasticity: 0.4,
      predictability: 0.7,
      complexity: 0.5,
      energy: 0.6,
      organicity: 0.9,
      playfulness: 0.3,
      aggression: 0.2
    }
  },
  
  MECHANICAL: {
    name: 'Механическое',
    description: 'Чёткие, точные движения с заданным ритмом и предсказуемостью',
    characteristics: {
      fluidity: 0.3,
      weight: 0.7,
      elasticity: 0.2,
      predictability: 0.9,
      complexity: 0.3,
      energy: 0.5,
      organicity: 0.1,
      playfulness: 0.1,
      aggression: 0.3
    }
  },
  
  PLAYFUL: {
    name: 'Игривое',
    description: 'Динамичное, непредсказуемое движение с элементами прыгучести и энергичности',
    characteristics: {
      fluidity: 0.7,
      weight: 0.3,
      elasticity: 0.8,
      predictability: 0.3,
      complexity: 0.7,
      energy: 0.9,
      organicity: 0.7,
      playfulness: 0.95,
      aggression: 0.4
    }
  },
  
  LIQUID: {
    name: 'Жидкое',
    description: 'Плавное, текучее движение с минимальным сопротивлением и высокой адаптивностью',
    characteristics: {
      fluidity: 0.95,
      weight: 0.4,
      elasticity: 0.5,
      predictability: 0.6,
      complexity: 0.4,
      energy: 0.4,
      organicity: 0.8,
      playfulness: 0.3,
      aggression: 0.1
    }
  },
  
  AGGRESSIVE: {
    name: 'Агрессивное',
    description: 'Резкие, интенсивные движения с высокой энергией и непредсказуемостью',
    characteristics: {
      fluidity: 0.3,
      weight: 0.7,
      elasticity: 0.5,
      predictability: 0.2,
      complexity: 0.6,
      energy: 0.9,
      organicity: 0.4,
      playfulness: 0.2,
      aggression: 0.9
    }
  },
  
  ROBOTIC: {
    name: 'Роботизированное',
    description: 'Дискретное, сегментированное движение с чётко выраженными паузами и переходами',
    characteristics: {
      fluidity: 0.1,
      weight: 0.6,
      elasticity: 0.1,
      predictability: 0.8,
      complexity: 0.5,
      energy: 0.6,
      organicity: 0.0,
      playfulness: 0.1,
      aggression: 0.3
    }
  },
  
  ETHEREAL: {
    name: 'Эфирное',
    description: 'Лёгкое, воздушное движение с минимальным весом и максимальной плавностью',
    characteristics: {
      fluidity: 0.9,
      weight: 0.1,
      elasticity: 0.7,
      predictability: 0.5,
      complexity: 0.6,
      energy: 0.4,
      organicity: 0.7,
      playfulness: 0.5,
      aggression: 0.0
    }
  }
};

/**
 * Функция для создания пользовательского профиля движения
 */
export function createMovementProfile(
  name: string,
  description: string,
  characteristics: Partial<MovementCharacteristics>
): MovementProfile {
  // Базовые характеристики по умолчанию
  const defaultCharacteristics: MovementCharacteristics = {
    fluidity: 0.5,
    weight: 0.5,
    elasticity: 0.5,
    predictability: 0.5,
    complexity: 0.5,
    energy: 0.5,
    organicity: 0.5,
    playfulness: 0.5,
    aggression: 0.5
  };
  
  return {
    name,
    description,
    characteristics: { ...defaultCharacteristics, ...characteristics }
  };
}