import { faker } from '@faker-js/faker/locale/pt_BR';

export function generateValidPassword(length = 12) {
  const lower = faker.string.alpha({ casing: 'lower', length: 1 });
  const upper = faker.string.alpha({ casing: 'upper', length: 1 });
  const digit = faker.string.numeric({ length: 1 });
  const special = faker.helpers.arrayElement([
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '-',
    '+',
    '_',
  ]);

  const remainingLength = length - 4;
  const allChars = faker.string.alphanumeric({ length: remainingLength });

  const rawPassword = lower + upper + digit + special + allChars;

  const shuffled = rawPassword
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  return shuffled;
}
