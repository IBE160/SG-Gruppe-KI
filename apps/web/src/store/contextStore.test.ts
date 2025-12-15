// apps/web/src/store/contextStore.test.ts
import { act } from 'react-dom/test-utils';
import { useContextStore } from './contextStore';

describe('useContextStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    act(() => {
      useContextStore.getState().resetState();
    });
  });

  it('should return initial state', () => {
    const { mood, energyLevel, soreness } = useContextStore.getState();
    expect(mood).toBe('Neutral');
    expect(energyLevel).toBe('Medium');
    expect(soreness).toBe('');
  });

  it('should update mood', () => {
    act(() => {
      useContextStore.getState().setMood('Motivated');
    });
    expect(useContextStore.getState().mood).toBe('Motivated');
  });

  it('should update energy level', () => {
    act(() => {
      useContextStore.getState().setEnergyLevel('High');
    });
    expect(useContextStore.getState().energyLevel).toBe('High');
  });

  it('should update soreness', () => {
    act(() => {
      useContextStore.getState().setSoreness('Lower back is tight');
    });
    expect(useContextStore.getState().soreness).toBe('Lower back is tight');
  });

  it('should reset state', () => {
    act(() => {
      useContextStore.getState().setMood('Stressed');
      useContextStore.getState().setEnergyLevel('Low');
      useContextStore.getState().setSoreness('Arms are sore');
    });

    expect(useContextStore.getState().mood).toBe('Stressed');
    expect(useContextStore.getState().energyLevel).toBe('Low');
    expect(useContextStore.getState().soreness).toBe('Arms are sore');

    act(() => {
      useContextStore.getState().resetState();
    });

    expect(useContextStore.getState().mood).toBe('Neutral');
    expect(useContextStore.getState().energyLevel).toBe('Medium');
    expect(useContextStore.getState().soreness).toBe('');
  });
});
