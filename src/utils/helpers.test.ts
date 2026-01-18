import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { calcularDiasTranscurridos } from './helpers';

describe('helpers', () => {
    describe('calcularDiasTranscurridos', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('calculates days elapsed correctly', () => {
            // Set "today" to 2024-01-10
            vi.setSystemTime(new Date('2024-01-10'));

            const result = calcularDiasTranscurridos('2024-01-01');
            expect(result).toBe(9); // 10 - 1 = 9 days
        });

        it('returns negative if future date', () => {
            // Set "today" to 2024-01-01
            vi.setSystemTime(new Date('2024-01-01'));

            const result = calcularDiasTranscurridos('2024-01-05');
            expect(result).toBeLessThan(0);
        });
    });
});
