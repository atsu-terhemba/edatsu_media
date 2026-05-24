// Tiny localStorage-backed reading-progress tracker. Keyed by article link so
// it survives across sessions and works for both guests and authenticated
// users. Stored as a fraction 0..1 plus an ISO timestamp.
//
// Promote to a DB-backed store later if cross-device sync becomes a
// requirement — the call sites already treat this as async-friendly.

const STORE_KEY = 'edatsu_reading_progress';
const MAX_ENTRIES = 200;
// Only treat a meaningful midway position as "resumable". Tiny scrolls and
// near-the-end positions are noise.
const RESUME_LOWER = 0.05;
const RESUME_UPPER = 0.95;

const readMap = () => {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
        return {};
    }
};

const writeMap = (map) => {
    try {
        // Cap the map size so heavy readers don't bloat localStorage. Evict
        // oldest entries first.
        const keys = Object.keys(map);
        if (keys.length > MAX_ENTRIES) {
            const sorted = keys
                .map((k) => [k, map[k]?.updated_at || ''])
                .sort((a, b) => (a[1] < b[1] ? -1 : 1));
            const evict = sorted.slice(0, keys.length - MAX_ENTRIES);
            evict.forEach(([k]) => delete map[k]);
        }
        localStorage.setItem(STORE_KEY, JSON.stringify(map));
    } catch {
        // localStorage may be full or disabled — silently ignore
    }
};

export const getProgress = (link) => {
    if (!link) return null;
    const map = readMap();
    const entry = map[link];
    if (!entry || typeof entry.progress !== 'number') return null;
    if (entry.progress < RESUME_LOWER || entry.progress > RESUME_UPPER) return null;
    return entry.progress;
};

export const setProgress = (link, progress) => {
    if (!link || typeof progress !== 'number' || !isFinite(progress)) return;
    const clamped = Math.max(0, Math.min(1, progress));
    const map = readMap();
    if (clamped < RESUME_LOWER || clamped > RESUME_UPPER) {
        // Saved value would be unresumable — clear instead of storing
        if (map[link]) {
            delete map[link];
            writeMap(map);
        }
        return;
    }
    map[link] = { progress: clamped, updated_at: new Date().toISOString() };
    writeMap(map);
};

export const clearProgress = (link) => {
    if (!link) return;
    const map = readMap();
    if (map[link]) {
        delete map[link];
        writeMap(map);
    }
};
