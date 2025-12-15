import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Track {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
    phase: string;
    phaseIcon: string;
    phaseColor: string;
}

interface MusicMixState {
    mixType: string;
    selectedPlaylistMode: string;
    seedTags: string[];
    tracks: Track[];
    totalDuration: string;
    trackCount: number;
    mixId: string | null;

    setMixType: (type: string) => void;
    setSelectedPlaylistMode: (mode: string) => void;
    addSeedTag: (tag: string) => void;
    removeSeedTag: (tag: string) => void;
    setMixDetails: (details: { tracks: Track[], seedTags: string[], playlistMode: string, totalDuration: string, trackCount: number, mixId: string }) => void;
    resetState: () => void;
}

const initialMusicMixState = {
    mixType: 'Full Session',
    selectedPlaylistMode: 'AI Smart Mix',
    seedTags: [],
    tracks: [],
    totalDuration: '00:00',
    trackCount: 0,
    mixId: null,
};

export const useMusicMixStore = create<MusicMixState>()(
    devtools(
        persist(
            immer((set) => ({
                ...initialMusicMixState,

                setMixType: (type) => set((state) => {
                    state.mixType = type;
                }),
                setSelectedPlaylistMode: (mode) => set((state) => {
                    state.selectedPlaylistMode = mode;
                }),
                addSeedTag: (tag) => set((state) => {
                    if (!state.seedTags.includes(tag)) {
                        state.seedTags.push(tag);
                    }
                }),
                removeSeedTag: (tag) => set((state) => {
                    state.seedTags = state.seedTags.filter((t) => t !== tag);
                }),
                setMixDetails: (details) => set((state) => {
                    state.tracks = details.tracks;
                    state.seedTags = details.seedTags;
                    state.selectedPlaylistMode = details.playlistMode;
                    state.totalDuration = details.totalDuration;
                    state.trackCount = details.trackCount;
                    state.mixId = details.mixId;
                }),
                resetState: () => set(initialMusicMixState),
            })),
            {
                name: 'music-mix-storage',
                getStorage: () => localStorage,
            }
        )
    )
);
