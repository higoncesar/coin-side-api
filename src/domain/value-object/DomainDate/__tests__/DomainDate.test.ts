import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InvalidDateError } from '@/domain/exceptions/InvalidDateError';
import { DomainDate } from '@/domain/value-object/DomainDate';

describe('DomainDate', () => {
  describe('now()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should create a DomainDate with the current UTC time', () => {
      const fixedDate = new Date('2025-04-26T10:00:00Z');
      vi.setSystemTime(fixedDate);

      const domainDate = DomainDate.now();

      expect(domainDate.toDate().getTime()).toBe(fixedDate.getTime());
    });
  });

  describe('create()', () => {
    it('should create a DomainDate from a valid Date object', () => {
      const date = new Date('2025-04-26T12:00:00Z');
      const domainDate = DomainDate.create(date);

      expect(domainDate.toISOString()).toBe('2025-04-26T12:00:00.000Z');
    });

    it('should throw InvalidDateError when creating with an invalid Date (NaN)', () => {
      const invalidDate = new Date('invalid-date');

      expect(() => {
        DomainDate.create(invalidDate);
      }).toThrow(InvalidDateError);
    });

    it('should throw InvalidDateError when creating with a non-Date object', () => {
      expect(() => {
        // @ts-expect-error - testando passagem errada de tipo
        DomainDate.create('2025-04-26T12:00:00Z');
      }).toThrow(InvalidDateError);

      expect(() => {
        // @ts-expect-error
        DomainDate.create(1745668800000);
      }).toThrow(InvalidDateError);

      expect(() => {
        // @ts-expect-error
        DomainDate.create({});
      }).toThrow(InvalidDateError);

      expect(() => {
        // @ts-expect-error
        DomainDate.create(null);
      }).toThrow(InvalidDateError);

      expect(() => {
        // @ts-expect-error
        DomainDate.create(undefined);
      }).toThrow(InvalidDateError);
    });
  });

  describe('comparison methods', () => {
    it('should correctly identify isBefore as true', () => {
      const earlier = DomainDate.create(new Date('2025-04-25T12:00:00Z'));
      const later = DomainDate.create(new Date('2025-04-26T12:00:00Z'));

      expect(earlier.isBefore(later)).toBe(true);
    });

    it('should correctly identify isBefore as false when dates are equal', () => {
      const date1 = DomainDate.create(new Date('2025-04-26T12:00:00Z'));
      const date2 = DomainDate.create(new Date('2025-04-26T12:00:00Z'));

      expect(date1.isBefore(date2)).toBe(false);
    });

    it('should correctly identify isAfter as true', () => {
      const earlier = DomainDate.create(new Date('2025-04-25T12:00:00Z'));
      const later = DomainDate.create(new Date('2025-04-26T12:00:00Z'));

      expect(later.isAfter(earlier)).toBe(true);
    });

    it('should correctly identify isAfter as false when dates are equal', () => {
      const date1 = DomainDate.create(new Date('2025-04-26T12:00:00Z'));
      const date2 = DomainDate.create(new Date('2025-04-26T12:00:00Z'));

      expect(date1.isAfter(date2)).toBe(false);
    });
  });

  describe('serialization methods', () => {
    it('toDate() should return a new Date instance with the same value', () => {
      const date = new Date('2025-04-26T12:00:00Z');
      const domainDate = DomainDate.create(date);

      const resultDate = domainDate.toDate();

      expect(resultDate).not.toBe(domainDate['props'].date); // new instance
      expect(resultDate.getTime()).toBe(domainDate['props'].date.getTime());
    });

    it('toISOString() should return the correct UTC ISO string', () => {
      const date = new Date('2025-04-26T12:00:00Z');
      const domainDate = DomainDate.create(date);

      expect(domainDate.toISOString()).toBe('2025-04-26T12:00:00.000Z');
    });

    it('getValue() should return the internal Date instance', () => {
      const date = new Date('2025-04-26T12:00:00Z');
      const domainDate = DomainDate.create(date);

      expect(domainDate.getValue()).toBe(domainDate['props'].date);
    });
  });
});
