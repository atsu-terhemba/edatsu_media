// Estimated reading-time helper.
// Strips HTML, counts whitespace-separated tokens, divides by WPM (200 is the
// standard for online reading), rounds up. Returns null when the input has
// nothing to estimate from so callers can hide the badge entirely.
const WORDS_PER_MINUTE = 200;

const stripHtml = (s) => String(s).replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');

export const estimateReadMinutes = (text) => {
    if (!text) return null;
    const clean = stripHtml(text).trim();
    if (!clean) return null;
    const words = clean.split(/\s+/).filter(Boolean).length;
    if (words < 20) return null; // too short to be meaningful — likely a teaser
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

export const formatReadMinutes = (minutes) => (minutes ? `${minutes} min read` : null);
