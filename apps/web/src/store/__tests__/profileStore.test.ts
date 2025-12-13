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
    const { currentUserData, isEditing, tempUserData } = useProfileStore.getState();
    expect(currentUserData).toBeNull();
    expect(isEditing).toBe(false);
    expect(tempUserData).toBeNull();
  });

  it('should set the current user data', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setCurrentUserData(mockProfile);
    });
    expect(useProfileStore.getState().currentUserData).toEqual(mockProfile);
  });

  it('should start editing and create a temp user data copy', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setCurrentUserData(mockProfile); // Set current user data first
      useProfileStore.getState().startEditing(mockProfile); // Pass initial data to startEditing
    });
    const { isEditing, tempUserData } = useProfileStore.getState();
    expect(isEditing).toBe(true);
    expect(tempUserData).toEqual(mockProfile);
    expect(tempUserData).not.toBe(mockProfile); // Ensure it's a copy, not the same object
  });

  it('should cancel editing and revert temp user data to current user data', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    const changedProfile = { ...mockProfile, unit_preference: 'lbs' };
    act(() => {
      useProfileStore.getState().setCurrentUserData(mockProfile); // Set initial current data
      useProfileStore.getState().startEditing(mockProfile);
      useProfileStore.getState().updateTempUserData({ unit_preference: 'lbs' }); // Make changes
      expect(useProfileStore.getState().tempUserData).toEqual(changedProfile); // Verify changes were made
      useProfileStore.getState().cancelEditing(); // Cancel
    });
    const { isEditing, tempUserData } = useProfileStore.getState();
    expect(isEditing).toBe(false);
    expect(tempUserData).toEqual(mockProfile); // Should revert to original current data
  });

  it('should update temp user data during editing', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setCurrentUserData(mockProfile);
      useProfileStore.getState().startEditing(mockProfile);
      useProfileStore.getState().updateTempUserData({ unit_preference: 'lbs' });
    });
    expect(useProfileStore.getState().tempUserData?.unit_preference).toBe('lbs');
    expect(useProfileStore.getState().tempUserData?.email).toBe('test@example.com'); // Other fields remain
  });

  it('should reset the state to initial values', () => {
    const mockProfile = { id: '1', email: 'test@example.com', unit_preference: 'kg' };
    act(() => {
      useProfileStore.getState().setCurrentUserData(mockProfile);
      useProfileStore.getState().startEditing(mockProfile);
      useProfileStore.getState().resetState();
    });
    const { currentUserData, isEditing, tempUserData } = useProfileStore.getState();
    expect(currentUserData).toBeNull();
    expect(isEditing).toBe(false);
    expect(tempUserData).toBeNull();
  });
});