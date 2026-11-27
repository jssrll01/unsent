export const NOVEL_TITLE = 'The Stranger Who Felt Like Home';
export const TAGLINE =
  'Sometimes, life takes everything familiar away from us, only to introduce us to people, experiences, and parts of ourselves we never knew existed.';
export const CHAPTERS = [{ id: 1, title: 'Unsent', count: 100 }];
export const MOODS = ['Hopeful', 'Grateful', 'Calm', 'Warm', 'Tired', 'Heavy', 'Afraid', 'Lonely'];
export const LIMITS = { title: 120, body: 50000, mood: 30 };

export const chapterById = (id) => CHAPTERS.find((c) => String(c.id) === String(id)) || null;
export const pad = (n) => String(n).padStart(3, '0');
export const validNum = (ch, num) => /^\d{3}$/.test(num) && Number(num) >= 1 && Number(num) <= ch.count;
export const entryKey = (chapterId, num) => `${chapterId}-${num}`;
