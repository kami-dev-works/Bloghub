const stopWords = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from',
  'up','down','out','off','over','under','again','further','then','once','here','there',
  'when','where','why','how','all','each','every','both','few','more','most','other',
  'some','such','no','nor','not','only','own','same','so','than','too','very','just',
  'because','as','until','while','about','between','into','through','during','before',
  'after','above','below','is','are','was','were','be','been','being','have','has',
  'had','having','do','does','did','doing','would','could','should','may','might',
  'shall','can','need','dare','ought','used','this','that','these','those','i','it',
  'its','my','our','your','his','her','their','me','us','we','you','he','she','they',
  'am','get','make','got','made','also','well','will','what','which','who','whom'
]);

export function extractSeoTitles(title) {
  if (!title || title.length < 5) return [];

  const raw = title.replace(/[^\w\s-]/g, '').replace(/-/g, ' ');
  const words = raw.split(/\s+/).filter(Boolean);

  const phrases = new Set();

  const meaningful = words.filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));

  meaningful.forEach(w => {
    phrases.add(w.charAt(0).toUpperCase() + w.slice(1));
  });

  for (let i = 0; i < meaningful.length - 1; i++) {
    const phrase = meaningful.slice(i, i + 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (phrase.length > 4) phrases.add(phrase);
  }

  for (let i = 0; i < meaningful.length - 2; i++) {
    const phrase = meaningful.slice(i, i + 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (phrase.length > 8 && phrase.length < 60) phrases.add(phrase);
  }

  const titleWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  phrases.add(titleWords.join(' '));

  return Array.from(phrases).slice(0, 8);
}
