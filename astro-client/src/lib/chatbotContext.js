export const chatbotContext = {
  name: 'BlogHub Assistant',
  greetings: [
    "Hello! I'm BlogHub Assistant. How can I help you today?",
    "Hi there! Ask me anything about BlogHub, our services, or the platform.",
    "Hey! I can help with questions about our content, services, and policies.",
  ],
  fallback: [
    "I'm sorry, I don't have an answer for that. You can contact our support team for further help.",
    "I'm not sure I understand. Could you try rephrasing? For more help, reach out to our support team.",
    "That one's outside my knowledge for now. Our team would be happy to help — please use the contact page or WhatsApp button.",
  ],
  faqs: [
    {
      keywords: ['what', 'bloghub', 'about', 'platform'],
      answer: "BlogHub is a content platform where you can read, publish, and discover blogs and services across categories like technology, business, sports, entertainment, health, and science.",
    },
    {
      keywords: ['how', 'register', 'sign', 'up', 'create', 'account', 'join'],
      answer: "To register, click the Sign Up button at the top right of the page and fill in your username, email, and password. Registration is free.",
    },
    {
      keywords: ['how', 'login', 'sign', 'in'],
      answer: "Click the Login button at the top right and enter your email and password. You can also stay signed in on this device.",
    },
    {
      keywords: ['services', 'service', 'offer'],
      answer: "BlogHub offers a variety of professional services listed under the Services page. Each service has its own page with details, ratings, and reviews.",
    },
    {
      keywords: ['price', 'cost', 'fee', 'charge', 'free', 'paid', 'pricing'],
      answer: "Service prices vary by provider and category. Some services are free, others are paid. Check the service detail page for exact pricing.",
    },
    {
      keywords: ['contact', 'email', 'reach', 'support'],
      answer: "You can reach us via the Contact page, by email, or by phone. Our contact details are also shown in the website footer.",
    },
    {
      keywords: ['phone', 'number', 'call', 'whatsapp'],
      answer: "Our phone and WhatsApp numbers are listed in the footer of every page. You can tap the floating WhatsApp button to chat with us instantly.",
    },
    {
      keywords: ['blog', 'write', 'publish', 'post', 'author', 'submit'],
      answer: "Any registered user can submit a blog through the Submit page. Approved blogs are published on the platform and visible to all visitors.",
    },
    {
      keywords: ['like', 'like', 'love', 'favorite'],
      answer: "Tap the heart icon on any blog or service to like it. You can view all your liked items from your profile or the Liked page.",
    },
    {
      keywords: ['rating', 'rate', 'review', 'star'],
      answer: "You can rate services from 1 to 5 stars. Your rating helps other users find the best services. Blogs can be liked but not rated.",
    },
    {
      keywords: ['category', 'categories', 'tag', 'topic'],
      answer: "We support categories like technology, business, sports, entertainment, health, science, world, local, and politics. You can filter blogs and services by category.",
    },
    {
      keywords: ['privacy', 'policy', 'data'],
      answer: "Our privacy policy is available on the Privacy page. We only collect data needed to provide and improve our services.",
    },
    {
      keywords: ['terms', 'conditions', 'tos'],
      answer: "Our terms and conditions are available on the Terms page. By using BlogHub you agree to follow them.",
    },
    {
      keywords: ['about', 'us', 'company', 'team'],
      answer: "BlogHub is a content platform built for readers and creators. Learn more about us on the About page.",
    },
    {
      keywords: ['help', 'support', 'assist', 'issue', 'problem', 'bug'],
      answer: "I'm here to help with common questions. For complex issues, please use the Contact page to reach our support team.",
    },
    {
      keywords: ['language', 'hindi', 'english', 'translate'],
      answer: "Our platform currently supports English and Hindi. You can switch language from the header.",
    },
    {
      keywords: ['dark', 'mode', 'theme', 'light'],
      answer: "You can switch between light and dark mode using the theme toggle button in the header. Your preference is saved on this device.",
    },
    {
      keywords: ['newsletter', 'subscribe', 'email', 'updates'],
      answer: "You can subscribe to our newsletter using the form in the website footer. We'll send you updates about new blogs and services.",
    },
    {
      keywords: ['admin', 'dashboard', 'manage', 'panel'],
      answer: "Admins can access the dashboard from the Admin button in their profile menu. It includes tools to manage blogs, services, users, and site settings.",
    },
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good', 'morning', 'evening', 'afternoon'],
      answer: null,
    },
    {
      keywords: ['bye', 'goodbye', 'see', 'later', 'cya'],
      answer: "Goodbye! Come back anytime you have more questions.",
    },
    {
      keywords: ['thank', 'thanks', 'appreciate'],
      answer: "You're welcome! Happy to help.",
    },
  ],
};

const REFUSAL_PHRASES = [
  "I'm sorry, I don't have an answer for that right now. You can contact our support team for further help.",
  "That's a bit outside my scope. Please reach out to our team via the Contact page or the WhatsApp button.",
  "I don't have information on that yet. Our support team would be glad to help — try the contact options in the footer.",
];

export function getBotReply(userMessage) {
  const text = (userMessage || '').toLowerCase().trim();
  if (!text) return pick(REFUSAL_PHRASES);

  const stopwords = new Set(['i', 'im', 'me', 'my', 'a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'would', 'should', 'you', 'your', 'yours', 'we', 'our', 'us', 'to', 'of', 'in', 'on', 'for', 'with', 'at', 'by', 'from', 'and', 'or', 'but', 'so', 'it', 'this', 'that', 'be', 'have', 'has', 'had', 'will', 'shall', 'may', 'might', 'please', 'tell', 'about', 'get', 'got']);

  const tokens = text
    .replace(/[^\w\s+]/g, ' ')
    .split(/\s+/)
    .filter(t => t && t.length > 1 && !stopwords.has(t));

  if (tokens.length === 0) return pick(REFUSAL_PHRASES);

  let best = null;
  let bestScore = 0;
  for (const faq of chatbotContext.faqs) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (tokens.includes(kw.toLowerCase())) score += 2;
      else if (text.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  if (!best || bestScore === 0) return pick(REFUSAL_PHRASES);
  if (best.answer === null) {
    return pick(chatbotContext.greetings.concat(chatbotContext.fallback.slice(0, 1)));
  }
  return best.answer;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
