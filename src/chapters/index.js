const metaMods = import.meta.glob('./chapter-*/meta.js', { eager: true });
const fileMods = import.meta.glob('./chapter-*/*.js', { eager: true });

export const CHAPTERS = Object.values(metaMods)
  .map((m) => m.default)
  .sort((a, b) => a.id - b.id);

const ENTRIES = {};
for (const [path, mod] of Object.entries(fileMods)) {
  const m = path.match(/^\.\/chapter-(\d+)\/(\d{3})\.js$/);
  if (m) ENTRIES[`${Number(m[1])}-${m[2]}`] = mod.default;
}

export const getEntry = (chapterId, num) => ENTRIES[`${chapterId}-${num}`] || null;

export const writtenNums = (chapterId) =>
  Object.keys(ENTRIES)
    .filter((k) => k.startsWith(`${chapterId}-`))
    .map((k) => k.slice(k.indexOf('-') + 1))
    .sort();
