import express from 'express';

const router = express.Router();

const INDEXNOW_KEY = 'd1a2b3c4e5f6g7h8i9j0k1l2m3n4o5p6';

const pingIndexNow = async (urls) => {
  const urlList = Array.isArray(urls) ? urls : [urls];
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(urlList[0]).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${new URL(urlList[0]).origin}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch (e) {
    console.error('IndexNow ping failed:', e.message);
  }
};

router.get('/indexnow-key.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(INDEXNOW_KEY);
});

router.post('/indexnow', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'urls array required' });
    }
    await pingIndexNow(urls);
    res.json({ message: 'IndexNow ping sent', urls: urls.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { pingIndexNow };
export default router;
