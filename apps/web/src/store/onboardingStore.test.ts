// apps/web/src/store/onboardingStore.test.ts
import { act } from 'react';
import { useOnboardingStore } from './onboardingStore';

describe('useOnboardingStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    act(() => {
      useOnboardingStore.setState({
        goal: null,
        customGoal: null,
        trainingFrequency: null,
        trainingDuration: null,
        equipment: [],
        customEquipment: null,
        injuriesLimitations: [],
        customInjuriesLimitations: null,
        unitPreference: null,
      });
    });
  });

  it('should initialize with default values', () => {
    const state = useOnboardingStore.getState();
    expect(state.goal).toBeNull();
    expect(state.customGoal).toBeNull();
    expect(state.trainingFrequency).toBeNull();
    expect(state.trainingDuration).toBeNull();
    expect(state.equipment).toEqual([]);
    expect(state.customEquipment).toBeNull();
    expect(state.injuriesLimitations).toEqual([]);
    expect(state.customInjuriesLimitations).toBeNull();
    expect(state.unitPreference).toBeNull();
  });

  it('should set the goal', () => {
    act(() => {
      useOnboardingStore.getState().setGoal('Build Muscle');
    });
    expect(useOnboardingStore.getState().goal).toBe('Build Muscle');
  });

  it('should set the custom goal', () => {
    act(() => {
      useOnboardingStore.getState().setCustomGoal('Run a marathon');
    });
    expect(useOnboardingStore.getState().customGoal).toBe('Run a marathon');
  });

  it('should set the training frequency', () => {
    act(() => {
      useOnboardingStore.getState().setTrainingFrequency(4);
    });
    expect(useOnboardingStore.getState().trainingFrequency).toBe(4);
  });

  it('should set the training duration', () => {
    act(() => {
      useOnboardingStore.getState().setTrainingDuration(60);
    });
    expect(useOnboardingStore.getState().trainingDuration).toBe(60);
  });

  it('should set the equipment', () => {
    const newEquipment = ['Dumbbells', 'Resistance Bands'];
    act(() => {
      useOnboardingStore.getState().setEquipment(newEquipment);
    });
    expect(useOnboardingStore.getState().equipment).toEqual(newEquipment);
  });

  it('should set the custom equipment', () => {
    act(() => {
      useOnboardingStore.getState().setCustomEquipment('Cable Machine');
    });
    expect(useOnboardingStore.getState().customEquipment).toBe('Cable Machine');
  });

  it('should set the injuries/limitations', () => {
    const newInjuries = ['Knee Pain', 'Lower Back Issues'];
    act(() => {
      useOnboardingStore.getState().setInjuriesLimitations(newInjuries);
    });
    expect(useOnboardingStore.getState().injuriesLimitations).toEqual(newInjuries);
  });

  it('should set the custom injuries/limitations', () => {
    act(() => {
      useOnboardingStore.getState().setCustomInjuriesLimitations('Shoulder instability');
    });
    expect(useOnboardingStore.getState().customInjuriesLimitations).toBe('Shoulder instability');
  });

  it('should set the unit preference', () => {
    act(() => {
      useOnboardingStore.getState().setUnitPreference('lbs');
    });
    expect(useOnboardingStore.getState().unitPreference).toBe('lbs');
  });
});
