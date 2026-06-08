import express from 'express';

const router = express.Router();

let feedbackStore = [];

router.post('/', async (req, res) => {
  try {
    const { subject, message, email } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const feedback = {
      id: Date.now().toString(),
      subject,
      message,
      email: email || 'anonymous',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    feedbackStore.push(feedback);
    console.log('New feedback received:', feedback);
    
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    res.json(feedbackStore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
