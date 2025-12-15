// apps/web/src/global.d.ts
interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: typeof Spotify;
}

declare namespace Spotify {
    interface Player {
        new (options: PlayerInit): Player;
        connect(): Promise<boolean>;
        disconnect(): void;
        addListener(event: 'ready', callback: (data: { device_id: string }) => void): void;
        addListener(event: 'not_ready', callback: (data: { device_id: string }) => void): void;
        addListener(event: 'player_state_changed', callback: (state: PlayerState) => void): void;
        addListener(event: 'initialization_error' | 'authentication_error' | 'account_error' | 'playback_error', callback: (error: Error) => void): void;
        togglePlay(): Promise<void>;
        nextTrack(): Promise<void>;
        previousTrack(): Promise<void>;
        setVolume(volume: number): Promise<void>; // volume is 0 to 1
        getCurrentState(): Promise<PlayerState | null>;
        // Add other methods as needed
    }

    interface PlayerInit {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
    }

    interface PlayerState {
        context: Context;
        disallows: Disallows;
        duration: number;
        paused: boolean;
        position: number;
        repeat_mode: number;
        shuffle: boolean;
        timestamp: number;
        track_window: TrackWindow;
        playback_id: string; // Add playback_id as it is available in the state object
        // Add other properties as needed
    }

    interface Context {
        metadata: any;
        uri: string;
    }

    interface Disallows {
        pausing: boolean;
        peeking: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
        toggling_repeat_context: boolean;
        toggling_repeat_track: boolean;
        toggling_shuffle: boolean;
        transferring_playback: boolean;
    }

    interface TrackWindow {
        current_track: Track;
        next_tracks: Track[];
        previous_tracks: Track[];
    }

    interface Track {
        album: {
            uri: string;
            name: string;
            images: { url: string }[];
        };
        artists: { uri: string; name: string }[];
        duration_ms: number;
        id: string;
        name: string;
        is_playable: boolean;
        linked_from: { uri: string; id: string } | null;
        linked_to: { uri: string; id: string } | null;
        media_type: string;
        type: string;
        uri: string;
        // Add other properties as needed
    }

    interface Error {
        message: string;
    }
}
