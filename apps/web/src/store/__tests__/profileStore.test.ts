import { act } from 'react-dom/test-utils';
import { useProfileStore } from '../profileStore';

describe('useProfileStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    act(() => {
      useProfileStore.getState().resetState();
    });
  });

  it('should initialize with default values', () => {
    const { userProfile, isEditing, tempProfileData } = useProfileStore.getState();
    expect(userProfile).toBeNull();
    expect(isEditing).toBe(false);
    expect(tempProfileData).toBeNull();
  });

  it('should set the user profile', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
    });
    expect(useProfileStore.getState().userProfile).toEqual(mockProfile);
  });

  it('should start editing and create a temp profile data copy', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
      useProfileStore.getState().startEditing();
    });
    const { isEditing, tempProfileData } = useProfileStore.getState();
    expect(isEditing).toBe(true);
    expect(tempProfileData).toEqual(mockProfile);
    expect(tempProfileData).not.toBe(mockProfile); // Ensure it's a copy, not the same object
  });

  it('should cancel editing and clear temp profile data', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
      useProfileStore.getState().startEditing();
      useProfileStore.getState().cancelEditing();
    });
    const { isEditing, tempProfileData } = useProfileStore.getState();
    expect(isEditing).toBe(false);
    expect(tempProfileData).toBeNull();
  });

  it('should update temp profile data during editing', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
      useProfileStore.getState().startEditing();
      useProfileStore.getState().updateTempProfileData({ unit_preference: 'lbs' });
    });
    expect(useProfileStore.getState().tempProfileData?.unit_preference).toBe('lbs');
    expect(useProfileStore.getState().tempProfileData?.email).toBe('test@example.com'); // Other fields remain
  });

  it('should save changes and update user profile, exiting editing mode', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    const updatedProfile = { ...mockProfile, unit_preference: 'lbs' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
      useProfileStore.getState().startEditing();
      useProfileStore.getState().updateTempProfileData({ unit_preference: 'lbs' });
      useProfileStore.getState().saveChanges(updatedProfile);
    });
    const { userProfile, isEditing, tempProfileData } = useProfileStore.getState();
    expect(userProfile).toEqual(updatedProfile);
    expect(isEditing).toBe(false);
    expect(tempProfileData).toBeNull();
  });

  it('should reset the state to initial values', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setProfile(mockProfile);
      useProfileStore.getState().startEditing();
      useProfileStore.getState().resetState();
    });
    const { userProfile, isEditing, tempProfileData } = useProfileStore.getState();
    expect(userProfile).toBeNull();
    expect(isEditing).toBe(false);
    expect(tempProfileData).toBeNull();
  });
});