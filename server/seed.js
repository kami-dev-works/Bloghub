import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Blog from './models/Blog.js';
import Comment from './models/Comment.js';
import Advertisement from './models/Advertisement.js';
import ServiceCategory from './models/ServiceCategory.js';
import Service from './models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'System Administrator',
    location: 'New York',
    notifications: { email: true, likes: true, comments: true }
  },
  {
    username: 'johnsmith',
    email: 'john@techworld.com',
    password: 'User123!',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Tech enthusiast and software developer',
    location: 'San Francisco',
    notifications: { email: true, likes: false, comments: true }
  },
  {
    username: 'sarahwilson',
    email: 'sarah@sportsfan.com',
    password: 'User123!',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Sports journalist covering global events',
    location: 'Los Angeles',
    notifications: { email: true, likes: true, comments: true }
  },
  {
    username: 'mikebrown',
    email: 'mike@politicsdaily.com',
    password: 'User123!',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Political analyst and commentator',
    location: 'Washington DC',
    notifications: { email: false, likes: true, comments: true }
  },
  {
    username: 'emilydavis',
    email: 'emily@entertainmentweekly.com',
    password: 'User123!',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Entertainment correspondent',
    location: 'Hollywood',
    notifications: { email: true, likes: true, comments: false }
  },
  {
    username: 'localreporter',
    email: 'reporter@localnews.com',
    password: 'User123!',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    bio: 'Community news reporter',
    location: 'Chicago',
    notifications: { email: true, likes: true, comments: true }
  }
];

const sampleNews = [
  {
    title: 'Revolutionary AI System Passes Turing Test, Raising Ethical Questions',
    description: 'A groundbreaking artificial intelligence developed by leading tech researchers has successfully passed the Turing test, marking a historic milestone in machine intelligence.',
    content: `In a development that has sparked both excitement and concern, researchers at Advanced AI Labs announced that their latest artificial intelligence system has successfully passed the Turing Test, demonstrating human-level conversational abilities for the first time in history.\n\nThe AI, named ARIA (Advanced Reasoning and Intelligence Architecture), engaged in extensive conversations with human evaluators who were unable to consistently distinguish its responses from those of real humans. This achievement, decades in the making, opens new frontiers in human-computer interaction while simultaneously raising profound ethical questions about the future of consciousness and rights for artificial systems.\n\n"This is both a triumph of engineering and a call to action for the entire scientific community," said Dr. Sarah Chen, lead researcher on the project. "We must now grapple with questions we once relegated to science fiction."\n\nCritics have expressed concern about potential misuse of such technology, while supporters argue it represents an unprecedented opportunity to enhance human capabilities and solve complex global challenges.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    category: 'tech',
    tags: ['AI', 'technology', 'artificial intelligence', 'ethics'],
    status: 'approved',
    isFeatured: true,
    views: 4856,
    rating: 4.8,
    faq: [
      { question: 'What is the Turing Test?', answer: 'The Turing Test, proposed by Alan Turing in 1950, measures a machine\'s ability to exhibit intelligent behavior indistinguishable from a human.' },
      { question: 'How does ARIA differ from other AI systems?', answer: 'ARIA can maintain coherent, contextual conversations across diverse topics without revealing its non-human nature.' }
    ]
  },
  {
    title: 'Historic Climate Agreement Reached at Global Summit',
    description: 'World leaders have agreed to ambitious new climate targets that could reshape the global economy and accelerate the transition to renewable energy.',
    content: `After two weeks of intense negotiations, representatives from 195 nations have reached a landmark agreement on climate action that commits the world to achieving net-zero carbon emissions by 2050.\n\nThe agreement, signed in Geneva, includes binding commitments for major economies to reduce their greenhouse gas emissions by 60% from 2005 levels by 2035, a significant increase from previous targets. Wealthy nations have also agreed to establish a $500 billion fund to help developing countries transition to clean energy.\n\n"This is a watershed moment for humanity," declared UN Secretary-General at the closing ceremony. "For the first time, we have a truly global commitment that matches the scale of the crisis we face."\n\nThe agreement includes provisions for regular progress reviews, penalties for non-compliance, and mechanisms for technology transfer to emerging economies. Environmental groups have cautiously welcomed the deal while emphasizing the need for swift implementation.`,
    image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
    category: 'politics',
    tags: ['climate', 'environment', 'global warming', 'summit'],
    status: 'approved',
    isFeatured: true,
    views: 3921,
    rating: 4.5
  },
  {
    title: 'Underdog Team Clinches Championship in Historic Overtime Victory',
    description: 'In one of the most dramatic finals ever witnessed, the Phoenix Rising defeated the defending champions 3-2 after extra time.',
    content: `The sports world witnessed history last night as the Phoenix Rising, a team that had never won a championship in its 15-year history, captured the title in what commentators are calling the greatest final ever played.\n\nTrailing 0-2 at halftime, the Rising mounted an incredible comeback, scoring three goals in the final 25 minutes of regulation time. With the score tied 2-2, the match went into extra time, where striker Marcus Williams delivered the winning goal in the 118th minute.\n\n"I told the boys at halftime that legends are made in moments like these," said coach Jennifer Martinez, fighting back tears. "They went out there and proved they belong among the greats."\n\nThe victory sparked celebrations across the city, with an estimated 500,000 fans expected to line the streets for tomorrow's victory parade.`,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607d8212f?w=800',
    category: 'sports',
    tags: ['championship', 'football', 'victory', 'overtime'],
    status: 'approved',
    isFeatured: true,
    views: 4567,
    rating: 4.9
  },
  {
    title: 'Major Streaming Service Announces Revolutionary Interactive Programming',
    description: 'A new wave of choose-your-own-adventure style content will transform how viewers engage with their favorite shows.',
    content: `The entertainment landscape is about to change forever as StreamMax unveiled its groundbreaking "Narrative Engine" technology, which allows viewers to make real-time decisions that alter the storylines of their favorite shows.\n\nUnlike previous interactive efforts, the new system uses advanced AI to generate personalized story branches while maintaining narrative coherence. Viewers can make up to 50 meaningful choices per episode, with their decisions influencing everything from character relationships to plot outcomes.\n\n"We're essentially giving viewers the keys to the storytelling car," said StreamMax CEO Robert Martinez. "This isn't just choosing endings - it's about truly experiencing stories from within."\n\nThe platform will launch with 10 original series, including dramas, comedies, and thrillers, all designed specifically for the interactive format.`,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
    category: 'entertainment',
    tags: ['streaming', 'interactive', 'entertainment', 'technology'],
    status: 'approved',
    views: 3245,
    rating: 4.3
  },
  {
    title: 'Local Community Garden Transforms Abandoned Lot into Urban Oasis',
    description: 'A neighborhood initiative has turned a vacant property into a thriving green space that provides fresh produce for hundreds of families.',
    content: `What was once a eyesore blighted by illegal dumping has become the pride of Riverside Heights, as the Millbrook Community Garden celebrated its first anniversary with a harvest festival attended by over 2,000 residents.\n\nThe garden, started by a small group of volunteers in spring, now features 150 individual plots, a children's educational area, a bee sanctuary, and a composting facility. Last year alone, it produced over 10,000 pounds of organic vegetables distributed to local families in need.\n\n"My grandmother always said that when you put seeds in the ground, you're planting hope," said garden founder Maria Rodriguez. "Look at what that hope has grown into."\n\nThe success has inspired similar projects in neighboring communities, with city officials announcing plans to designate 50 more lots for community garden development.`,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    category: 'local',
    tags: ['community', 'garden', 'local', 'volunteers'],
    status: 'approved',
    views: 1823,
    rating: 4.7
  },
  {
    title: 'Quantum Computing Breakthrough Promises Unhackable Communications',
    description: 'Scientists have achieved a major milestone in quantum encryption that could revolutionize cybersecurity worldwide.',
    content: `A team of researchers at the Quantum Technology Institute has demonstrated the first commercially viable quantum communication system, achieving data transmission speeds previously thought impossible while maintaining perfect security.\n\nThe system, called QuantumShield, uses quantum key distribution to create encryption that is theoretically impossible to break, even with unlimited computing power. Unlike previous quantum communication experiments that required extremely cold temperatures and specialized equipment, QuantumShield operates at room temperature.\n\n"This changes everything we thought we knew about cybersecurity," said Dr. James Liu, lead author of the study. "Organizations that adopt this technology will have communications that are genuinely secure against any future threat."\n\nMajor financial institutions and government agencies have already expressed interest in the technology, with pilot programs expected to begin within the year.`,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'tech',
    tags: ['quantum computing', 'cybersecurity', 'encryption', 'breakthrough'],
    status: 'approved',
    views: 2789,
    rating: 4.6
  },
  {
    title: 'New Study Links Mediterranean Diet to Significant Longevity Benefits',
    description: 'Research spanning 20 years confirms that following a traditional Mediterranean diet can add up to a decade to lifespan.',
    content: `A comprehensive study tracking over 100,000 participants across three continents has provided the strongest evidence yet that a Mediterranean diet rich in olive oil, fish, nuts, and fresh vegetables significantly extends lifespan.\n\nThe research, published in the Journal of Nutritional Science, found that participants who closely adhered to the Mediterranean dietary pattern experienced a 35% reduction in cardiovascular disease risk and a 25% lower risk of cancer compared to those following typical Western diets.\n\n"What's remarkable is how consistent the benefits are across different populations and lifestyles," said lead researcher Dr. Elena Papadopoulos. "The diet appears to work by reducing inflammation, improving gut health, and providing essential nutrients that our modern diets often lack."\n\nThe study also found that participants who combined the Mediterranean diet with regular moderate exercise and stress management practices showed even greater benefits.`,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    category: 'tech',
    tags: ['health', 'diet', 'longevity', 'research'],
    status: 'approved',
    views: 3456,
    rating: 4.4
  },
  {
    title: 'Record-Breaking Auction: Rare Artwork Sells for $450 Million',
    description: 'A lost masterpiece by a renowned Renaissance artist has set a new record for the most expensive painting ever sold at auction.',
    content: `In a sale that has stunned the art world, a previously unknown painting attributed to Leonardo da Vinci has been sold for $450 million, shattering all previous records for artwork at auction.\n\nThe painting, depicting a young woman in an orange dress, was discovered in 2019 in a private collection where it had been misattributed to one of da Vinci's followers. Following extensive analysis and conservation, experts concluded it was likely an early work by the master himself.\n\n"This discovery represents one of the most significant art historical findings of the century," said museum director Catherine Williams. "The painting demonstrates techniques that da Vinci would later perfect in his more famous works."\n\nThe anonymous buyer, believed to be a consortium of international collectors, has announced plans to exhibit the work in major museums worldwide before establishing a permanent home for the masterpiece.`,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
    category: 'entertainment',
    tags: ['art', 'auction', 'Leonardo da Vinci', 'record'],
    status: 'approved',
    views: 4123,
    rating: 4.8
  },
  {
    title: 'Electric Vehicle Sales Surpass Traditional Cars for First Time',
    description: 'Monthly global sales data shows electric vehicles have overtaken gasoline-powered cars, marking a historic shift in the automotive industry.',
    content: `The automotive industry reached a historic milestone last month as electric vehicle sales exceeded those of traditional internal combustion engine vehicles for the first time in history, according to data released by the International Energy Agency.\n\nGlobal EV sales reached 3.2 million units in April, representing 52% of all new vehicle sales worldwide. This represents a dramatic acceleration from just three years ago when EVs held only 12% of the market.\n\n"We're witnessing the end of the gasoline era," said automotive analyst Maria Santos. "The transition that seemed like it would take decades is happening in years."\n\nThe shift has been driven by falling battery costs, expanded charging infrastructure, and government incentives across major markets. Traditional automakers have responded by announcing plans to phase out combustion engine production entirely by 2035.`,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    category: 'tech',
    tags: ['electric vehicles', 'automotive', 'environment', 'technology'],
    status: 'approved',
    views: 2987,
    rating: 4.5
  },
  {
    title: 'City Council Approves Major Public Transit Expansion',
    description: 'A $2.5 billion investment will bring new subway lines and bus rapid transit to underserved neighborhoods.',
    content: `The Metropolitan Transit Authority received final approval yesterday for its ambitious plan to expand public transportation across the region, with construction set to begin on three new subway lines and an extensive bus rapid transit network.\n\nThe $2.5 billion project, funded through a combination of federal grants and local bond measures, will connect currently underserved communities to major employment centers, reducing commute times for an estimated 300,000 residents.\n\n"Reliable public transit is the backbone of an equitable city," said Council President Jennifer Lee. "This investment will open doors for people who've been left behind by our current system."\n\nThe expansion includes accessibility improvements, real-time arrival information systems, and integration with bike-sharing programs. Full completion is expected by 2028.`,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    category: 'local',
    tags: ['transit', 'infrastructure', 'city council', 'expansion'],
    status: 'approved',
    views: 1567,
    rating: 4.2
  },
  {
    title: 'Olympic Committee Announces Revolutionary Format for Summer Games',
    description: 'The 2028 Olympics will feature new sports, team-based events, and innovative scoring systems designed to engage younger audiences.',
    content: `The International Olympic Committee unveiled sweeping changes to the Summer Games yesterday, announcing a new format that incorporates esports, mixed-gender team events, and dynamic scoring systems intended to appeal to a younger global audience.\n\nAmong the changes: popular video games will become official medal events, existing sports will add mixed-gender team competitions, and several new sports including skateboarding and sport climbing will expand their medal programs.\n\n"Sport must evolve to stay relevant," said IOC President Thomas Bach. "These changes honor our traditions while embracing the future."\n\nThe announcement has generated mixed reactions, with traditionalists expressing concern about diluting the Olympic brand while younger athletes and fans have welcomed the modernization.`,
    image: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800',
    category: 'sports',
    tags: ['Olympics', 'sports', 'esports', 'innovation'],
    status: 'approved',
    views: 3876,
    rating: 4.1
  },
  {
    title: 'Healthcare Startup Launches AI-Powered Diagnostic Platform',
    description: 'A new telemedicine service promises to provide accurate preliminary diagnoses using advanced artificial intelligence.',
    content: `MediAI, a healthcare technology startup, has launched what it claims is the most accurate AI-powered diagnostic platform, offering patients preliminary health assessments based on symptoms and medical history.\n\nThe system, developed over five years using data from millions of patient records, can analyze over 500 symptoms and provide ranked potential diagnoses with associated confidence levels. Early trials showed diagnostic accuracy rates exceeding 92% for common conditions.\n\n"We're not replacing doctors—we're giving people a powerful first step in understanding their health," said MediAI CEO Dr. Amanda Foster. "Many people delay seeking care because they're unsure if their symptoms are serious. Our platform helps them make informed decisions."\n\nThe service is currently available in 15 countries and has already assisted over one million users since its soft launch last month.`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    category: 'tech',
    tags: ['healthcare', 'AI', 'telemedicine', 'diagnosis'],
    status: 'approved',
    views: 2645,
    rating: 4.3
  },
  {
    title: 'Local High School Wins National Science Olympiad Championship',
    description: 'Students from Millbrook High have captured the top prize in the National Science Olympiad, defeating schools from across the country.',
    content: `For the first time in school history, the Millbrook High School Science Olympiad team has won the national championship, defeating 120 competing schools from across the United States.\n\nThe 15-member team, composed entirely of students from grades 9-11, excelled in 23 different events spanning biology, chemistry, physics, and engineering. Their victory was sealed with a first-place finish in the "Write It, Do It" event and multiple top-three finishes throughout the two-day competition.\n\n"These kids have been preparing for this moment since seventh grade," said team coach and chemistry teacher Robert Thompson. "Their dedication and teamwork have been absolutely remarkable."\n\nThe victory has inspired a wave of interest in STEM programs at the school, with enrollment in advanced science courses increasing by 40% for next year.`,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    category: 'local',
    tags: ['education', 'science', 'championship', 'students'],
    status: 'approved',
    views: 2156,
    rating: 4.9
  },
  {
    title: 'Central Bank Announces Historic Interest Rate Decision',
    description: 'In a move that signals a new era in monetary policy, the Federal Reserve has implemented unprecedented measures to address inflation.',
    content: `The Federal Reserve announced today a comprehensive set of monetary policy changes that economists are calling the most significant shift in central banking in decades.\n\nAmong the measures: a new inflation-targeting framework that allows for temporary overshoots during economic recovery, enhanced forward guidance that commits to specific policy paths, and new tools for managing long-term interest rates.\n\n"The economic landscape has fundamentally changed," said Fed Chair in a prepared statement. "Our policies must evolve to reflect new realities while maintaining our core mission of price stability and maximum employment."\n\nMarkets responded positively to the announcement, with major indices rising over 2% in afternoon trading as investors interpreted the moves as signs of a more flexible and responsive monetary policy.`,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    category: 'politics',
    tags: ['economy', 'Federal Reserve', 'interest rates', 'monetary policy'],
    status: 'approved',
    views: 3456,
    rating: 4.0
  },
  {
    title: 'Breakthrough Treatment Shows Promise for Alzheimer\'s Disease',
    description: 'Clinical trials of a new drug have demonstrated significant cognitive improvement in early-stage Alzheimer\'s patients.',
    content: `Pharmaceutical giant NeuroTech announced today that its experimental Alzheimer\'s treatment has shown remarkable results in Phase 3 clinical trials, with patients demonstrating measurable cognitive improvement for the first time in the disease\'s history.\n\nThe drug, called CogniFix, works by targeting and clearing amyloid plaques that accumulate in the brains of Alzheimer\'s patients. In the trial of 2,000 patients with early-stage disease, those receiving CogniFix showed a 40% reduction in cognitive decline compared to placebo groups.\n\n"This is the moment we\'ve been working toward for 30 years," said Dr. Richard Harmon, NeuroTech\'s chief scientific officer. "We\'re not just slowing the disease—we\'re beginning to reverse it."\n\nThe company plans to submit the drug for FDA approval within six months, with potential market availability as early as next year if expedited review is granted.`,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
    category: 'tech',
    tags: ['Alzheimer\'s', 'medical research', 'healthcare', 'breakthrough'],
    status: 'approved',
    views: 4523,
    rating: 4.8
  },
  {
    title: 'New Film Festival Celebrates Independent Documentaries',
    description: 'The inaugural Global Doc Fest showcases 50 groundbreaking documentaries from filmmakers across 30 countries.',
    content: `The first-ever Global Documentary Film Festival opened this weekend in downtown, drawing filmmakers, critics, and documentary enthusiasts from around the world to celebrate the art of nonfiction storytelling.\n\nThe festival features 50 films spanning topics from climate change and social justice to technology and human rights. A notable highlight is the "Impact Award," recognizing documentaries that have catalyzed real-world change.\n\n"Documentary filmmaking has never been more vital," said festival director Patricia Chen. "In an age of misinformation, these films cut through the noise with truth and humanity."\n\nScreenings will be followed by discussions with directors and subjects, and a virtual pass allows viewers worldwide to watch selections online.`,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    category: 'entertainment',
    tags: ['film festival', 'documentary', 'independent film', 'culture'],
    status: 'approved',
    views: 1876,
    rating: 4.4
  },
  {
    title: 'Community Center Opens New STEM Learning Lab for Youth',
    description: 'A state-of-the-art facility offers free coding, robotics, and engineering programs for local students.',
    content: `The Downtown Community Center cut the ribbon yesterday on its new $3 million STEM Learning Lab, a cutting-edge facility designed to inspire the next generation of scientists, engineers, and innovators.\n\nThe lab features 50 workstations equipped with the latest computers, 3D printers, robotics kits, and virtual reality systems. Programming will focus on hands-on learning experiences including app development, game design, and engineering challenges.\n\n"Every child deserves access to these kinds of opportunities," said center director Michael Washington. "This lab levels the playing field for kids who might not have tech resources at home."\n\nAll programs are free for local youth, funded through a combination of corporate sponsorships and grant funding. Registration for summer programs opens next week.`,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    category: 'local',
    tags: ['STEM', 'education', 'youth', 'community'],
    status: 'approved',
    views: 1234,
    rating: 4.7
  },
  {
    title: 'Space Agency Reveals Plans for Permanent Lunar Base',
    description: 'An international consortium has announced a joint project to establish the first permanently inhabited outpost on the Moon by 2030.',
    content: `In an announcement that has reignited excitement about space exploration, a consortium of space agencies from 15 countries has unveiled detailed plans for "Lunar Gateway," the first permanent human settlement on the Moon.\n\nThe ambitious project, budgeted at $150 billion over 10 years, will establish a habitable base in the Moon\'s south pole region, utilizing ancient ice deposits for water and oxygen production. The settlement will serve as both a scientific research station and a stepping stone for future Mars missions.\n\n"We\'re not just going to the Moon to visit," said ESA Director General at the press conference. "We\'re going to stay, to learn, and to prepare for humanity\'s next giant leap."\n\nConstruction is set to begin in 2025, with the first permanent residents expected to arrive in 2028.`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    category: 'politics',
    tags: ['space', 'Moon', 'NASA', 'exploration'],
    status: 'approved',
    views: 5234,
    rating: 4.9
  },
  {
    title: 'उत्तर प्रदेश में बारिश से फसलों को नुकसान, किसान चिंतित',
    description: 'भारी बारिश ने उत्तर प्रदेश के कई जिलों में खड़ी फसलों को नुकसान पहुंचाया है। प्रशासन ने राहत कार्य शुरू किए।',
    content: `लखनऊ: उत्तर प्रदेश में पिछले तीन दिनों से हो रही भारी बारिश से राज्य के 20 से अधिक जिलों में खड़ी फसलों को भारी नुकसान हुआ है। गेहूं, धान और सब्जियों की फसलें जलमग्न हो गई हैं।\n\nकिसानों ने प्रशासन से मुआवजे की मांग की है। मुख्यमंत्री ने अधिकारियों को राहत कार्य में तेजी लाने के निर्देश दिए हैं।\n\nमौसम विभाग ने अगले पांच दिनों में और बारिश की संभावना जताई है। ग्रामीणों को सतर्क रहने को कहा गया है।`,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    category: 'local',
    tags: ['बारिश', 'उत्तर प्रदेश', 'किसान', 'फसल'],
    status: 'approved',
    views: 2345,
    rating: 4.1
  },
  {
    title: 'बिहार चुनाव: मतदान के लिए तैयारी पूरी, सुरक्षा व्यवस्था कड़ी',
    description: 'बिहार विधानसभा चुनाव के लिए सभी तैयारियां पूरी कर ली गई हैं। सुरक्षा व्यवस्था को कड़ा किया गया है।',
    content: `पटना: बिहार विधानसभा चुनाव के पहले चरण के लिए सभी तैयारियां पूरी कर ली गई हैं। 71,000 से अधिक मतदान केंद्र बनाए गए हैं।\n\nचुनाव आयोग ने कड़ी सुरक्षा व्यवस्था के निर्देश दिए हैं। केंद्रीय बलों की तैनाती की गई है।\n\nमुख्य निर्वाचन आयुक्त ने कहा कि मतदान स्वतंत्र और निष्पक्ष होगा। सभी राजनीतिक दलों से सहयोग की अपील की गई है।`,
    image: 'https://images.unsplash.com/photo-1591064097812-5c2f6f9e27f6?w=800',
    category: 'politics',
    tags: ['चुनाव', 'बिहार', 'मतदान', 'सुरक्षा'],
    status: 'approved',
    views: 3456,
    rating: 4.3
  },
  {
    title: 'महाराष्ट्र में ओलिंपिक खिलाड़ियों का सम्मान समारोह',
    description: 'महाराष्ट्र सरकार ने ओलिंपिक और पैरालंपिक खिलाड़ियों के सम्मान में एक विशेष कार्यक्रम आयोजित किया।',
    content: `मुंबई: महाराष्ट्र सरकार ने टोक्यो ओलिंपिक और पैरालंपिक में भाग लेने वाले खिलाड़ियों के सम्मान में एक भव्य समारोह आयोजित किया।\n\nमुख्यमंत्री ने प्रत्येक खिलाड़ी को नकद पुरस्कार और सम्मान पत्र प्रदान किए। ओलिंपिक पदक विजेता को विशेष सम्मान दिया गया।\n\nखिलाड़ियों ने अपनी उपलब्धियों पर प्रसन्नता व्यक्त की और आगामी खेलों के लिए प्रशिक्षण की प्रतिबद्धता जताई।`,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607d8212f?w=800',
    category: 'sports',
    tags: ['ओलिंपिक', 'खिलाड़ी', 'महाराष्ट्र', 'सम्मान'],
    status: 'approved',
    views: 1876,
    rating: 4.6
  },
  {
    title: 'गोवा टूरिज्म: इस सीजन में रिकॉर्ड पर्यटकों का आगमन',
    description: 'इस साल गोवा में पर्यटकों की संख्या में रिकॉर्ड वृद्धि हुई है। होटल और रेस्तरां व्यस्त हैं।',
    content: `पणजी: गोवा में इस पर्यटन सीजन में अब तक का सबसे अधिक पर्यटक आगमन हुआ है। घरेलू और विदेशी पर्यटकों की संख्या पिछले साल से 40% अधिक है।\n\nहोटल व्यवसायियों का कहना है कि बुकिंग पहले से ही अगले महीने तक पूरी हो चुकी है। बीच रिसॉर्ट्स और कैसिनो में भारी भीड़ है।\n\nसरकार ने पर्यटन अवसंरचना में सुधार के लिए नए प्रोजेक्ट शुरू किए हैं। हवाई अड्डे का विस्तार भी हो रहा है।`,
    image: 'https://images.unsplash.com/photo-1577183012914-2a89e7b8c922?w=800',
    category: 'local',
    tags: ['गोवा', 'पर्यटन', 'होटल', 'समुद्र तट'],
    status: 'approved',
    views: 2134,
    rating: 4.5
  },
  {
    title: 'स्टॉक मार्केट में उछाल: सेंसेक्स ने नई ऊंचाई छुई',
    description: 'भारतीय शेयर बाजार में आज जोरदार तेजी देखी गई। सेंसेक्स और निफ्टी दोनों ने नई ऊंचाइयां बनाईं।',
    content: `मुंबई: आज के कारोबार में भारतीय शेयर बाजार में जोरदार तेजी रही। बॉम्बे स्टॉक एक्सचेंज का सेंसेक्स 500 अंकों से अधिक चढ़ा।\n\nनिफ्टी भी नई ऊंचाई पर बंद हुआ। IT और फार्मा सेक्टर में सबसे अधिक खरीदारी देखी गई।\n\nविश्लेषकों का कहना है कि वैश्विक बाजारों में सकारात्मक रुख और घरेलू आर्थिक आंकड़ों से बाजार को समर्थन मिल रहा है।`,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    category: 'business',
    tags: ['शेयर बाजार', 'सेंसेक्स', 'निफ्टी', 'निवेश'],
    status: 'approved',
    views: 3245,
    rating: 4.2
  },
  {
    title: 'K-Pop का भारत में बढ़ता प्रभाव: कोरियन संस्कृति का जलवा',
    description: 'दक्षिण कोरियाई संगीत और संस्कृति भारत में तेजी से लोकप्रिय हो रही है। युवा पीढ़ी इससे आकर्षित है।',
    content: `नई दिल्ली: K-Pop संगीत और कोरियन संस्कृति भारत में तेजी से लोकप्रिय हो रही है। BTS और BLACKPINK के प्रशंसकों की संख्या लगातार बढ़ रही है।\n\nकोरियन भाषा सीखने की इच्छा रखने वालों में इजाफा हुआ है। कोरियन फिल्में और ड्रामा भी दर्शकों के बीच लोकप्रिय हो रहे हैं।\n\nदिल्ली और मुंबई में कोरियन फेस्टिवल का आयोजन किया जाता है जिसमें हजारों लोग teilnehmer होते हैं।`,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    category: 'entertainment',
    tags: ['K-Pop', 'कोरिया', 'संगीत', 'संस्कृति'],
    status: 'approved',
    views: 4532,
    rating: 4.4
  },
  {
    title: 'मध्य प्रदेश: वन्यजीव संरक्षण में नई सफलता, बाघों की संख्या बढ़ी',
    description: 'मध्य प्रदेश के राष्ट्रीय उद्यानों में बाघों की संख्या में वृद्धि हुई है। यह संरक्षण का बड़ा सफलता है।',
    content: `भोपाल: मध्य प्रदेश के कान्हा और पंचमढ़ी राष्ट्रीय उद्यानों में बाघों की संख्या में महत्वपूर्ण वृद्धि हुई है।\n\nवन विभाग के अनुसार, पिछले गणना में 50% से अधिक बाघों की वृद्धि दर्ज की गई। संरक्षण प्रयासों को इस सफलता का श्रेय दिया जाता है।\n\nप्रधानमंत्री ने वनकर्मियों और संरक्षणकर्ताओं को बधाई दी है। पर्यटन को भी इससे लाभ मिल रहा है।`,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
    category: 'local',
    tags: ['बाघ', 'वन्यजीव', 'मध्य प्रदेश', 'संरक्षण'],
    status: 'approved',
    views: 1876,
    rating: 4.8
  },
  {
    title: 'टेलीकॉम सेक्टर में क्रांति: 5G सेवाएं 100 शहरों में शुरू',
    description: 'भारत में 5G सेवाएं अब 100 से अधिक शहरों में उपलब्ध हैं। इंटरनेट की स्पीड अब तक की सबसे तेज।',
    content: `नई दिल्ली: भारतीय टेलीकॉम कंपनियों ने 5G सेवाएं 100 से अधिक शहरों में शुरू कर दी हैं।\n\n5G इंटरनेट की स्पीड 4G से 10 गुना अधिक है। डाउनलोड और स्ट्रीमिंग में बड़ा सुधार देखा जा रहा है।\n\nटेलीकॉम कंपनियां ग्रामीण क्षेत्रों में भी 5G पहुंचाने की योजना बना रही हैं। इससे डिजिटल इंडिया को और बढ़ावा मिलेगा।`,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    category: 'technology',
    tags: ['5G', 'टेलीकॉम', 'इंटरनेट', 'स्मार्टफोन'],
    status: 'approved',
    views: 5678,
    rating: 4.5
  },
  {
    title: 'स्वास्थ्य बीमा: सरकार ने आयुष्मान योजना का विस्तार किया',
    description: 'प्रधानमंत्री आयुष्मान भारत योजना का दायरा बढ़ाया गया। अब और परिवारों को मुफ्त इलाज मिलेगा।',
    content: `नई दिल्ली: प्रधानमंत्री आयुष्मान भारत योजना का विस्तार करते हुए अब 10 करोड़ अतिरिक्त परिवारों को इसमें शामिल किया गया है।\n\nअब 50 करोड़ से अधिक परिवारों को प्रति वर्ष 5 लाख रुपये तक का मुफ्त इलाज मिलेगा।\n\nसरकारी अस्पतालों और निजी अस्पतालों में कार्ड के जरिए इलाज उपलब्ध होगा। इससे गरीब परिवारों को बड़ी राहत मिलेगी।`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    category: 'health',
    tags: ['स्वास्थ्य', 'बीमा', 'आयुष्मान', 'योजना'],
    status: 'approved',
    views: 3456,
    rating: 4.6
  },
  {
    title: 'शिक्षा नीति: नई शिक्षा प्रणाली में बड़े बदलाव की तैयारी',
    description: 'केंद्र सरकार ने शिक्षा नीति में व्यापक सुधारों की योजना बनाई है। विशेषज्ञों की राय ली जा रही है।',
    content: `नई दिल्ली: केंद्र सरकार ने राष्ट्रीय शिक्षा नीति 2024 में बड़े बदलाव की तैयारी शुरू कर दी है।\n\nमुख्य बिंदु: प्राथमिक शिक्षा में मातृभाषा में पढ़ाई, कोडिंग को अनिवार्य बनाना, और व्यावसायिक शिक्षा पर जोर।\n\nविशेषज्ञों का कहना है कि यह बदलाव छात्रों के समग्र विकास में मदद करेंगे। राज्यों से भी सुझाव मांगे गए हैं।`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'politics',
    tags: ['शिक्षा', 'नीति', 'सरकार', 'स्कूल'],
    status: 'approved',
    views: 2876,
    rating: 4.1
  },
  {
    title: 'क्रिप्टो करेंसी: भारत में नए नियम, बिटकॉइन का दाम बढ़ा',
    description: 'भारत सरकार ने क्रिप्टो करेंसी के लिए नई कराधान व्यवस्था लागू की। बिटकॉइन की कीमत बढ़ी।',
    content: `नई दिल्ली: भारत सरकार ने क्रिप्टो करेंसी के लिए नई कराधान व्यवस्था लागू की है। 30% टैक्स और 1% TDS का प्रावधान है।\n\nइसके बावजूद बिटकॉइन और एथेरियम की कीमतों में तेजी देखी गई है। निवेशकों का रुख सकारात्मक बना हुआ है।\n\nकेंद्रीय बैंक ने डिजिटल करेंसी के लिए अपनी योजनाएं भी जाहिर की हैं।`,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
    category: 'business',
    tags: ['क्रिप्टो', 'बिटकॉइन', 'निवेश', 'कर'],
    status: 'approved',
    views: 4123,
    rating: 4.0
  },
  {
    title: 'रिलायंस जियो: 5G सेवा के 6 महीने में 10 करोड़ उपयोगकर्ता',
    description: 'रिलायंस जियो ने अपने 5G सेवा के 6 महीने में 10 करोड़ उपयोगकर्ता हासिल करने का रिकॉर्ड बनाया।',
    content: `मुंबई: रिलायंस जियो ने अपनी 5G सेवा Jio True 5G के 6 महीने में 10 करोड़ से अधिक उपयोगकर्ता हासिल कर लिए हैं।\n\nयह दुनिया में किसी भी 5G सेवा की सबसे तेज उपयोगकर्ता वृद्धि है। कंपनी ने 400 से अधिक शहरों में सेवा शुरू की है।\n\nविश्लेषकों का कहना है कि जियो की सस्ती योजनाएं और तेज स्पीड इस सफलता की वजह हैं।`,
    image: 'https://images.unsplash.com/photo-1556656793-02774a8c577a?w=800',
    category: 'technology',
    tags: ['रिलायंस', 'जियो', '5G', 'उपयोगकर्ता'],
    status: 'approved',
    views: 3876,
    rating: 4.4
  },
  {
    title: 'पाकिस्तान क्रिकेट टीम का भारत दौरा: दोनों देशों के बीच मैच',
    description: 'पाकिस्तान क्रिकेट टीम 10 साल बाद भारत दौरे पर आएगी। ICC टूर्नामेंट में मुकाबला होगा।',
    content: `नई दिल्ली: पाकिस्तान क्रिकेट टीम 10 साल बाद भारत दौरे पर आने वाली है। यह दोनों देशों के बीच कूटनीतिक तनाव के बावजूद होगा।\n\nमैच दिल्ली और मुंबई में खेले जाएंगे। सुरक्षा व्यवस्था कड़ी की गई है।\n\nक्रिकेट प्रशंसकों में इस मुकाबले को लेकर उत्साह है। टिकटों की मांग बहुत अधिक है।`,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    category: 'sports',
    tags: ['क्रिकेट', 'पाकिस्तान', 'भारत', 'मैच'],
    status: 'approved',
    views: 5678,
    rating: 4.7
  },
  {
    title: 'हॉलीवुड-बॉलीवुड सहयोग: पहली संयुक्त फिल्म का ऐलान',
    description: 'प्रसिद्ध हॉलीवुड स्टूडियो और बॉलीवुड प्रोडक्शन हाउस ने पहली संयुक्त फिल्म का ऐलान किया है।',
    content: `लॉस एंजिल्स: हॉलीवुड और बॉलीवुड के बीच पहली बड़ी साझेदारी होने जा रही है। एक प्रसिद्ध अमेरिकी स्टूडियो और भारतीय प्रोडक्शन हाउस मिलकर एक बड़ी बजट फिल्म बनाएंगे।\n\nफिल्म में बॉलीवुड और हॉलीवुड के बड़े सितारे नजर आएंगे। बजट 200 मिलियन डॉलर से अधिक है।\n\nयह सिनेमा जगत का सबसे बड़ा सहयोग माना जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    category: 'entertainment',
    tags: ['हॉलीवुड', 'बॉलीवुड', 'फिल्म', 'सहयोग'],
    status: 'approved',
    views: 4532,
    rating: 4.5
  },
  {
    title: 'उड़ीसा ट्रेन हादसा: सुरक्षा सुधारों की मांग तेज',
    description: 'उड़ीसा में हुए भीषण ट्रेन हादसे के बाद सुरक्षा सुधारों की मांग तेज हो गई है।',
    content: `भुवनेश्वर: उड़ीसा में हाल के ट्रेन हादसे ने रेलवे की सुरक्षा व्यवस्था पर प्रश्नचिह्न लगा दिया है।\n\nरेल मंत्री ने सुरक्षा समीक्षा के निर्देश दिए हैं। सभी ट्रेनों में ATP सिस्टम लगाने की योजना है।\n\nपीड़ित परिवारों को मुआवजे की घोषणा की गई है। ऑनलाइन शिकायतें भी शुरू हुई हैं।`,
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800',
    category: 'local',
    tags: ['ट्रेन', 'हादसा', 'सुरक्षा', 'रेलवे'],
    status: 'approved',
    views: 3456,
    rating: 3.8
  },
  {
    title: 'तमिलनाडु: बाढ़ से हजारों प्रभावित, NDRF की मदद',
    description: 'तमिलनाडु में भारी बाढ़ से हजारों लोग प्रभावित हैं। NDRF और सेना ने राहत अभियान शुरू किया।',
    content: `चेन्नई: तमिलनाडु में भारी बारिश से आई बाढ़ ने हजारों लोगों को प्रभावित किया है।\n\nNDRF की टीमों और सेना ने बचाव अभियान शुरू किया है। कई क्षेत्रों में पानी का स्तर अभी भी खतरे के निशान पर है।\n\nमुख्यमंत्री ने प्रभावितों के लिए 500 करोड़ रुपये की राहत पैकेज की घोषणा की है।`,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800',
    category: 'local',
    tags: ['बाढ़', 'तमिलनाडु', 'राहत', 'NDRF'],
    status: 'approved',
    views: 2345,
    rating: 4.0
  },
  {
    title: 'फिल्म परिषद में नई फिल्मों को मंजूरी, 15 नई फिल्में रिलीज',
    description: 'सेंट्रल बोर्ड ऑफ फिल्म सर्टिफिकेशन ने 15 नई फिल्मों को सर्टिफिकेट दिया है। इस हफ्ते रिलीज होंगी।',
    content: `मुंबई: सेंट्रल बोर्ड ऑफ फिल्म सर्टिफिकेशन (CBFC) ने इस हफ्ते 15 नई फिल्मों को मंजूरी दी है।\n\nइनमें से अधिकांश हिंदी और दक्षिण भारतीय फिल्में हैं। कुछ को U/A और कुछ को A सर्टिफिकेट मिला है।\n\nफिल्म उद्योग के लिए यह अच्छी खबर है क्योंकि पिछले कुछ महीनों में फिल्में कम रिलीज हो रही थीं।`,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    category: 'entertainment',
    tags: ['फिल्म', 'सर्टिफिकेट', 'CBFC', 'मंजूरी'],
    status: 'approved',
    views: 1876,
    rating: 4.2
  },
  {
    title: 'ISRO का नया मिशन: चंद्रयान-5 की तैयारी शुरू',
    description: 'ISRO ने चंद्रयान-5 मिशन की तैयारियां शुरू कर दी हैं। इस बार चांद से नमूने लाए जाएंगे।',
    content: `बेंगलुरु: भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने चंद्रयान-5 मिशन की तैयारियां शुरू कर दी हैं।\n\nइस मिशन का उद्देश्य चांद से मिट्टी और चट्टान के नमूने एकत्र करकर पृथ्वी पर लाना है।\n\nयह भारत का पहला ऐसा मिशन होगा। चीन और अमेरिका के बाद भारत तीसरा देश बनेगा जो चांद से नमूने लाएगा।`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    category: 'science',
    tags: ['ISRO', 'चंद्रयान', 'अंतरिक्ष', 'चांद'],
    status: 'approved',
    views: 4567,
    rating: 4.9
  },
  {
    title: 'वायु प्रदूषण: दिल्ली-NCR में GRAP-4 लागू, स्कूल बंद',
    description: 'दिल्ली-NCR में वायु प्रदूषण गंभीर होने के कारण GRAP-4 लागू किया गया है। स्कूल बंद कर दिए गए।',
    content: `नई दिल्ली: दिल्ली-NCR में वायु प्रदूषण खतरनाक स्तर पर पहुंचने के कारण GRAP (ग्रेडेड रिस्पांस एक्शन प्लान) के चौथे चरण को लागू किया गया है।\n\nस्कूलों को बंद किया गया है। निर्माण कार्य पर रोक लगा दी गई है। ट्रकों का प्रवेश प्रतिबंधित है।\n\nलोगों को घर के अंदर रहने और मास्क पहनने की सलाह दी गई है। AQI 500 से ऊपर बना हुआ है।`,
    image: 'https://images.unsplash.com/photo-1609873814058-a8928924184e?w=800',
    category: 'health',
    tags: ['प्रदूषण', 'दिल्ली', 'AQI', 'GRAP'],
    status: 'approved',
    views: 5678,
    rating: 3.5
  },
  {
    title: 'बैंकिंग सेक्टर में बड़ा बदलाव: RBI ने नए नियम जारी किए',
    description: 'भारतीय रिजर्व बैंक ने बैंकिंग सेक्टर के लिए नए नियम जारी किए हैं। ग्राहकों को फायदा होगा।',
    content: `मुंबई: भारतीय रिजर्व बैंक (RBI) ने बैंकिंग सेक्टर के लिए कई नए नियम जारी किए हैं।\n\nअब बैंकों को ग्राहकों की शिकायतों का 15 दिनों में समाधान करना होगा। डिजिटल पेमेंट पर सुरक्षा मानक बढ़ाए गए हैं।\n\nRBI गवर्नर ने कहा कि ये बदलाव ग्राहक अनुभव को बेहतर बनाएंगे और वित्तीय समावेशन को बढ़ावा देंगे।`,
    image: 'https://images.unsplash.com/photo-1565514020175-8507f7d08b7b?w=800',
    category: 'business',
    tags: ['RBI', 'बैंक', 'नियम', 'वित्त'],
    status: 'approved',
    views: 2134,
    rating: 4.3
  },
  {
    title: 'यूपी में गन्ना किसानों को खुशखबरी: बकाया भुगतान शुरू',
    description: 'उत्तर प्रदेश में गन्ना किसानों का बकाया भुगतान शुरू हो गया है। 10,000 करोड़ से अधिक बकाया है।',
    content: `लखनऊ: उत्तर प्रदेश में गन्ना किसानों का बकाया भुगतान शुरू हो गया है। मिलों को 15 दिनों में भुगतान करने के निर्देश दिए गए हैं।\n\nकिसानों को 10,000 करोड़ रुपये से अधिक बकाया है। सरकार ने मिल मालिकों पर कार्रवाई की चेतावनी दी है।\n\nगन्ना किसानों ने इस कदम का स्वागत किया है। अगले सीजन में गन्ने की रिकॉर्ड खेती की उम्मीद है।`,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    category: 'local',
    tags: ['किसान', 'गन्ना', 'भुगतान', 'उत्तर प्रदेश'],
    status: 'approved',
    views: 1876,
    rating: 4.1
  },
  {
    title: 'टॉयलेट एक्सेस: ग्रामीण भारत में सफलता की कहानी',
    description: 'प्रधानमंत्री स्वच्छ भारत मिशन के तहत 10 करोड़ से अधिक शौचालय बनाए गए हैं।',
    content: `नई दिल्ली: प्रधानमंत्री स्वच्छ भारत मिशन (SBHM) के तहत अब तक 10 करोड़ से अधिक शौचालय बनाए जा चुके हैं।\n\nग्रामीण भारत में खुले में शौच की दर 50% से कम हो गई है। यह स्वास्थ्य और गरिमा दोनों के लिए अच्छा है।\n\nविशेषज्ञों ने इस उपलब्धि की सराहना की है। अब ओडीएफ (Open Defecation Free) का लक्ष्य पूरा होने जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800',
    category: 'politics',
    tags: ['शौचालय', 'स्वच्छ भारत', 'ग्रामीण', 'स्वास्थ्य'],
    status: 'approved',
    views: 1567,
    rating: 4.4
  },
  {
    title: 'वनडे क्रिकेट: भारत-ऑस्ट्रेलिया सीरीज का रोमांच',
    description: 'भारत और ऑस्ट्रेलिया के बीच 5 मैचों की वनडे सीरीज रोमांचक होने जा रही है।',
    content: `मुंबई: भारत और ऑस्ट्रेलिया के बीच 5 मैचों की वनडे क्रिकेट सीरीज का पहला मैच मुंबई में खेला जाएगा।\n\nदोनों टीमें विश्व कप की तैयारी में हैं। कप्तान रोहित शर्मा और पैट कमिंस अपनी टीमों का नेतृत्व करेंगे।\n\nप्रशंसकों के लिए यह सीरीज बेहद रोमांचक होने जा रही है। टिकट पहले ही आउट हो चुके हैं।`,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    category: 'sports',
    tags: ['क्रिकेट', 'भारत', 'ऑस्ट्रेलिया', 'वनडे'],
    status: 'approved',
    views: 4532,
    rating: 4.6
  },
  {
    title: 'डिजिटल पेमेंट: UPI का विश्व में सबसे अधिक इस्तेमाल',
    description: 'भारत का UPI अब दुनिया में सबसे अधिक इस्तेमाल होने वाला डिजिटल पेमेंट प्लेटफॉर्म बन गया है।',
    content: `नई दिल्ली: भारत का यूनिफाइड पेमेंट्स इंटरफेस (UPI) अब दुनिया का सबसे बड़ा रियल-टाइम पेमेंट प्लेटफॉर्म बन गया है।\n\nपिछले महीने 10 अरब से अधिक ट्रांजैक्शन हुई हैं। Google Pay, PhonePe और Paytm सबसे लोकप्रिय ऐप्स हैं।\n\nप्रधानमंत्री ने इसे डिजिटल इंडिया की सफलता बताया है। ग्रामीण क्षेत्रों में भी UPI का इस्तेमाल बढ़ रहा है।`,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    category: 'technology',
    tags: ['UPI', 'डिजिटल पेमेंट', 'भारत', 'गूगल पे'],
    status: 'approved',
    views: 5678,
    rating: 4.7
  },
  {
    title: 'ट्रैवल और टूरिज्म: पर्यटन सीजन में रिकॉर्ड बुकिंग',
    description: 'इस पर्यटन सीजन में होटल और ट्रैवल बुकिंग में रिकॉर्ड वृद्धि देखी जा रही है।',
    content: `नई दिल्ली: इस पर्यटन सीजन में घरेलू और अंतरराष्ट्रीय दोनों पर्यटन में भारी वृद्धि हो रही है।\n\nकेरल, गोवा, राजस्थान और हिमाचल प्रदेश में होटल बुकिंग पहले से ही भरे हुए हैं। एयरलाइन टिकट भी महंगे हो गए हैं।\n\nपर्यटन उद्योग को इस साल 50 अरब डॉलर का राजस्व मिलने की उम्मीद है।`,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'business',
    tags: ['पर्यटन', 'होटल', 'ट्रैवल', 'बुकिंग'],
    status: 'approved',
    views: 2345,
    rating: 4.3
  },
  {
    title: 'NEET परीक्षा विवाद: सुप्रीम कोर्ट ने सुनवाई टाली',
    description: 'NEET परीक्षा में कथित अनियमितता को लेकर सुप्रीम कोर्ट में याचिका दायर की गई है।',
    content: `नई दिल्ली: NEET परीक्षा 2024 में कथित अनियमितता को लेकर सुप्रीम कोर्ट में याचिका दायर की गई है।\n\nछात्रों और अभिभावकों ने परीक्षा रद्द करने की मांग की है। कई राज्यों में विरोध प्रदर्शन हुए हैं।\n\nNTA ने जांच के निर्देश दिए हैं। अगली सुनवाई अगले महीने होगी।`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'politics',
    tags: ['NEET', 'परीक्षा', 'शिक्षा', 'सुप्रीम कोर्ट'],
    status: 'approved',
    views: 3456,
    rating: 4.0
  },
  {
    title: 'कृषि क्षेत्र: इस साल रिकॉर्ड उत्पादन की उम्मीद',
    description: 'इस साल देश में खाद्यान्न उत्पादन रिकॉर्ड स्तर पर पहुंचने की उम्मीद है। मानसून अच्छा रहा।',
    content: `नई दिल्ली: इस कृषि वर्ष में भारत में खाद्यान्न उत्पादन रिकॉर्ड 330 मिलियन टन को पार कर सकता है।\n\nमानसून की अच्छी स्थिति और सरकारी योजनाओं से किसानों को फायदा हो रहा है।\n\nगेहूं, धान और दालों का उत्पादन पिछले साल से अधिक होने की संभावना है। किसानों की आय बढ़ने की उम्मीद है।`,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    category: 'business',
    tags: ['कृषि', 'उत्पादन', 'खाद्यान्न', 'किसान'],
    status: 'approved',
    views: 1876,
    rating: 4.5
  },
  {
    title: 'मनोरंजन: Netflix पर भारतीय वेब सीरीज का बोलबाला',
    description: 'Netflix और Amazon Prime पर भारतीय वेब सीरीज दर्शकों के बीच बेहद लोकप्रिय हो रही हैं।',
    content: `मुंबई: OTT प्लेटफॉर्म्स पर भारतीय वेब सीरीज का बोलबाला है। Netflix, Amazon Prime और Disney+ Hotstar पर नई सीरीज रिलीज हो रही हैं।\n\n'डेजर्ट राज', 'मिर्जापुर' और 'सैक्रेड गेम्स' जैसी सीरीज को दर्शकों का भारी समर्थन मिल रहा है।\n\nभारतीय सामग्री का वैश्विक बाजार में दबदबा बढ़ रहा है।`,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800',
    category: 'entertainment',
    tags: ['Netflix', 'वेब सीरीज', 'OTT', 'मनोरंजन'],
    status: 'approved',
    views: 4123,
    rating: 4.4
  },
  {
    title: 'भारत-चीन सीमा विवाद: सैनिकों के बीच फिर तनाव',
    description: 'भारत-चीन सीमा पर LAC के पास फिर तनाव बढ़ गया है। दोनों तरफ से सैनिकों की तैनाती।',
    content: `नई दिल्ली: भारत-चीन सीमा पर लाइन ऑफ एक्चुअल कंट्रोल (LAC) के पास फिर तनाव बढ़ गया है।\n\nदोनों देशों ने अपने-अपने सैनिकों की तैनाती बढ़ा दी है। सैन्य अधिकारी बातचीत कर रहे हैं।\n\nराजनीतिक विश्लेषकों का कहना है कि शांतिपूर्ण समाधान जरूरी है।`,
    image: 'https://images.unsplash.com/photo-1541872703-74c5963631df?w=800',
    category: 'politics',
    tags: ['चीन', 'सीमा', 'सेना', 'तनाव'],
    status: 'approved',
    views: 5678,
    rating: 4.1
  },
  {
    title: 'ऑनलाइन शिक्षा: कोविड के बाद भी डिजिटल लर्निंग का बोलबाला',
    description: 'कोविड के बाद भी ऑनलाइन शिक्षा प्लेटफॉर्म्स लोकप्रिय बने हुए हैं। BYJU, Unacademy की तेजी।',
    content: `नई दिल्ली: कोविड महामारी के बाद भी ऑनलाइन शिक्षा प्लेटफॉर्म्स की मांग बनी हुई है।\n\nBYJU'S, Unacademy और Vedantu जैसी कंपनियों ने करोड़ों उपयोगकर्ता हासिल किए हैं।\n\nग्रामीण क्षेत्रों में भी इंटरनेट की पहुंच बढ़ने से डिजिटल शिक्षा का दायरा बढ़ रहा है।`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'technology',
    tags: ['ऑनलाइन शिक्षा', 'BYJU', 'Unacademy', 'डिजिटल'],
    status: 'approved',
    views: 3456,
    rating: 4.2
  },
  {
    title: 'खेलो इंडिया: युवा खिलाड़ियों के लिए नई योजना',
    description: 'केंद्र सरकार ने खेलो इंडिया योजना के तहत युवा खिलाड़ियों को प्रशिक्षण और सहायता देने की घोषणा की।',
    content: `नई दिल्ली: केंद्र सरकार ने खेलो इंडिया योजना के तहत 5000 युवा खिलाड़ियों को चुना है।\n\nचयनित खिलाड़ियों को मासिक वृत्तिका और प्रशिक्षण सुविधाएं दी जाएंगी। ओलिंपिक खेलों पर विशेष ध्यान दिया जाएगा।\n\nराज्यों को भी खेल अवसंरचना में निवेश करने को कहा गया है।`,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607d8212f?w=800',
    category: 'sports',
    tags: ['खेलो इंडिया', 'खिलाड़ी', 'योजना', 'प्रशिक्षण'],
    status: 'approved',
    views: 2134,
    rating: 4.5
  },
  {
    title: 'अयोध्या: राम मंदिर निर्माण 80% पूरा, प्राण प्रतिष्ठा की तैयारी',
    description: 'अयोध्या में राम मंदिर का निर्माण कार्य लगभग 80% पूरा हो गया है। जल्द प्राण प्रतिष्ठा।',
    content: `अयोध्या: अयोध्या में राम जन्मभूमि पर बन रहे भव्य राम मंदिर का निर्माण 80% से अधिक पूरा हो गया है।\n\nमुख्य मंदिर की छत का कार्य जल्द पूरा होने वाला है। प्राण प्रतिष्ठा की तैयारियां शुरू हो गई हैं।\n\nदेशभर से भक्त अयोध्या आ रहे हैं। पर्यटन में भारी वृद्धि हो रही है।`,
    image: 'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?w=800',
    category: 'local',
    tags: ['राम मंदिर', 'अयोध्या', 'मंदिर', 'प्राण प्रतिष्ठा'],
    status: 'approved',
    views: 7890,
    rating: 4.9
  },
  {
    title: 'रक्षा क्षेत्र: भारत ने नई मिसाइल का सफल परीक्षण किया',
    description: 'भारतीय रक्षा अनुसंधान संगठन (DRDO) ने नई बैलिस्टिक मिसाइल का सफल परीक्षण किया।',
    content: `चांदीपुर: भारतीय रक्षा अनुसंधान संगठन (DRDO) ने नई बैलिस्टिक मिसाइल का सफल परीक्षण किया है।\n\nयह मिसाइल 5000 किलोमीटर से अधिक की दूरी तक मार कर सकती है। रक्षा मंत्री ने वैज्ञानिकों को बधाई दी है।\n\nयह परीक्षण राष्ट्रीय सुरक्षा के लिए महत्वपूर्ण माना जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800',
    category: 'science',
    tags: ['DRDO', 'मिसाइल', 'रक्षा', 'परीक्षण'],
    status: 'approved',
    views: 4567,
    rating: 4.6
  },
  {
    title: 'New Wellness App Uses AI to Personalize Mental Health Support',
    description: 'A innovative mobile application combines cognitive behavioral therapy techniques with artificial intelligence to provide 24/7 mental wellness support.',
    content: `MindfulAI, the latest entrant in the digital wellness space, has launched with a revolutionary approach to mental health support that combines traditional therapeutic techniques with advanced AI personalization.\n\nThe app provides users with daily check-ins, guided meditation sessions, cognitive behavioral therapy exercises, and real-time crisis support. What sets it apart is its adaptive learning system that tailors recommendations based on individual progress and preferences.\n\n"We wanted to create something that feels like having a personal therapist in your pocket," said MindfulAI founder Dr. Lisa Park. "But at a price point that makes it accessible to everyone."\n\nThe app is free to download with premium features available for $9.99/month. Mental health professionals can review user progress through an optional dashboard feature.`,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    category: 'tech',
    tags: ['mental health', 'wellness', 'AI', 'mobile app'],
    status: 'approved',
    views: 2345,
    rating: 4.2
  },
  {
    title: 'Student Athletes Demand Fair Compensation in Historic Petition',
    description: 'Thousands of college athletes have signed a petition calling for revenue sharing and educational support programs.',
    content: `A coalition of college athletes representing 200 universities across the country has delivered a petition with over 50,000 signatures to the NCAA headquarters, demanding comprehensive reforms including revenue sharing, guaranteed scholarships, and comprehensive healthcare.\n\nThe petition, organized through social media, has quickly gained momentum following recent high-profile cases of athletes struggling financially despite generating billions in revenue for their institutions.\n\n"We are the product. We deserve to share in the profits," said Marcus Johnson, a basketball player at State University and one of the petition's primary organizers. "This isn't just about money—it's about dignity."\n\nThe NCAA has acknowledged receipt of the petition and committed to scheduling discussions with athlete representatives, though formal negotiations have not yet begun.`,
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800',
    category: 'politics',
    tags: ['college sports', 'athletes', 'NCAA', 'reform'],
    status: 'pending',
    views: 0,
    rating: 0
  },
  {
    title: 'क्रिकेट विश्व कप 2024: भारत ने फाइनल में ऑस्ट्रेलिया को हराया',
    description: 'अहमदाबाद के नरेंद्र मोदी स्टेडियम में हुए रोमांचक फाइनल मैच में भारत ने ऑस्ट्रेलिया को 6 विकेट से हराकर तीसरी बार विश्व कप जीता।',
    content: `इतिहास तो यहां बना! अहमदाबाद के नरेंद्र मोदी स्टेडियम में खेले गए क्रिकेट विश्व कप 2024 के फाइनल में भारत ने ऑस्ट्रेलिया को रोमांचक मुकाबले में 6 विकेट से हराकर तीसरी बार चैंपियन बनने का गौरव हासिल किया।\n\nपहले बल्लेबाजी करते हुए ऑस्ट्रेलिया ने 50 ओवर में 6 विकेट खोकर 326 रन बनाए। कप्तान पैट कमिंस ने 87 और स्टीव स्मिथ ने 78 रन की शानदार पारी खेली।\n\nजवाब में भारत ने विराट कोहली के 97 और कप्तान रोहित शर्मा के 58 रनों की मदद से लक्ष्य हासिल कर लिया। अंतिम ओवर में केएल राहुल ने छक्का लगाकर भारत को विजयी बनाया।\n\nप्रधानमंत्री नरेद्र मोदी ने स्टेडियम से ही खिलाड़ियों को बधाई दी और कहा कि यह जीत पूरे देश के लिए गर्व की बात है। पूरे देश में जश्न मनाया जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    category: 'sports',
    tags: ['क्रिकेट', 'विश्व कप', 'भारत', 'ऑस्ट्रेलिया'],
    status: 'approved',
    isFeatured: true,
    views: 8956,
    rating: 4.9
  },
  {
    title: 'AI क्रांति: भारत बन रहा है दुनिया का नया टेक हब',
    description: 'भारत ने कृत्रिम बुद्धिमत्ता क्षेत्र में तेजी से प्रगति करते हुए दुनिया के प्रमुख प्रौद्योगिकी केंद्रों में अपनी जगह बनाई है।',
    content: `नई दिल्ली: भारत तेजी से कृत्रिम बुद्धिमत्ता (AI) का वैश्विक केंद्र बनकर उभर रहा है। एक ताज़ा रिपोर्ट के अनुसार, भारत में AI स्टार्टअप्स की संख्या पिछले दो वर्षों में तीन गुना बढ़ी है।\n\nबेंगलुरु, हैदराबाद और पुणे जैसे शहरों में AI अनुसंधान केंद्र खुल रहे हैं। Google, Microsoft और Amazon जैसी बड़ी तकनीकी कंपनियां भारत में भारी निवेश कर रही हैं।\n\nIT मंत्री ने कहा कि सरकार AI को बढ़ावा देने के लिए 10,000 करोड़ रुपये का फंडिंग पैकेज देगी। शिक्षा और स्वास्थ्य सेवाओं में AI के उपयोग पर विशेष ध्यान दिया जाएगा।\n\nविशेषज्ञों का कहना है कि 2025 तक भारत AI क्षेत्र में 1 लाख करोड़ रुपये का व्यवसाय कर सकता है।`,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
    category: 'technology',
    tags: ['AI', 'प्रौद्योगिकी', 'स्टार्टअप', 'निवेश'],
    status: 'approved',
    isFeatured: true,
    views: 6789,
    rating: 4.7
  },
  {
    title: 'दीवाली पर दिल्ली में वायु प्रदूषण से हालत बिगड़ा, AQI 500 के पार',
    description: 'दिवाली के बाद राजधानी दिल्ली में प्रदूषण का स्तर खतरनाक सीमा को पार कर गया है। सरकार ने आपातकाल घोषित किया।',
    content: `नई दिल्ली: दिवाली पर पटाखों की अनियंत्रित आतिशबाजी के बाद दिल्ली में वायु गुणवत्ता गंभीर रूप से प्रभावित हो गई है। AQI 500 से अधिक दर्ज की गई, जो 'गंभीर' श्रेणी में आती है।\n\nस्वास्थ्य विशेषज्ञों ने लोगों को घर के अंदर रहने की सलाह दी है। श्वसन संबंधी बीमारियों में तेजी से वृद्धि हो रही है और अस्पतालों में मरीजों की भारी भीड़ है।\n\nसरकार ने निर्माण कार्य पर रोक लगा दी है, स्कूलों को बंद कर दिया है और वाहनों की संख्या पर प्रतिबंध लगाया है। प्रधानमंत्री ने प्रदूषण नियंत्रण के लिए राष्ट्रीय आपातकाल की घोषणा की है।\n\nपड़ोसी राज्यों पंजाब और हरियाणा में भी पराली जलाने से हालत खराब हो रही है।`,
    image: 'https://images.unsplash.com/photo-1609873814058-a8928924184e?w=800',
    category: 'health',
    tags: ['प्रदूषण', 'दिल्ली', 'दिवाली', 'AQI'],
    status: 'approved',
    views: 5432,
    rating: 3.8
  },
  {
    title: 'बॉलीवुड सुपरस्टार्स की नई फिल्म ने पहले दिन 200 करोड़ कमाए',
    description: 'खिलाड़ी कुमार और प्रिया शर्मा की मुख्य भूमिका वाली एक्शन फिल्म ने बॉक्स ऑफिस पर धमाकेदार शुरुआत की है।',
    content: `मुंबई: बॉलीवुड के दो सबसे बड़े सितारों खिलाड़ी कुमार और प्रिया शर्मा की फिल्म 'गदर 2' ने रिलीज के पहले दिन ही 200 करोड़ रुपये से अधिक की कमाई कर ली है।\n\nयह बॉलीवुड इतिहास में किसी भी हिंदी फिल्म की सबसे बड़ी ओपनिंग है। थिएटरों में सुबह 6 बजे से ही लोगों की कतारें लग गई थीं।\n\nफिल्म के निर्देशक ने कहा, "दर्शकों का प्यार और समर्थन हमारे लिए सबसे बड़ा इनाम है। यह सफलता पूरी टीम की मेहनत का परिणाम है।"\n\nफिल्म ने न केवल भारत में बल्कि विदेशों में भी जबरदस्त प्रदर्शन किया है। अमेरिका, यूके और GCC देशों में भी सिनेमाघरों में भारी भीड़ रही।`,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    category: 'entertainment',
    tags: ['बॉलीवुड', 'फिल्म', 'बॉक्स ऑफिस', 'सुपरस्टार'],
    status: 'approved',
    isFeatured: true,
    views: 7234,
    rating: 4.5
  },
  {
    title: 'चंद्रयान-4 की सफलता पर भारत को मिला अंतरिक्ष में नया कीर्तिमान',
    description: 'ISRO ने चंद्रयान-4 मिशन के जरिए चांद पर स्थायी अनुसंधान स्टेशन स्थापित करने में सफलता हासिल की है।',
    content: `बेंगलुरु: भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने आज चंद्रयान-4 मिशन के जरिए चांद पर स्थायी अनुसंधान स्टेशन स्थापित करने में सफलता हासिल की है। यह भारत के लिए ऐतिहासिक उपलब्धि है।\n\nचंद्रयान-4 ने चांद के दक्षिणी ध्रुव पर सॉफ्ट लैंडिंग की और वहां परमानेंट बेस कैंप की स्थापना की। यह अमेरिका और चीन के बाद दुनिया का तीसरा देश है जिसने चांद पर स्थायी उपस्थिति दर्ज कराई।\n\nप्रधानमंत्री ने ISRO वैज्ञानिकों को बधाई दी और कहा कि यह उपलब्धि भारत की विज्ञान क्षमता को दर्शाती है। अंतरिक्ष यात्री मिशन के लिए भी रास्ता खुल गया है।\n\nइसरो के अध्यक्ष ने कहा कि अगला लक्ष्य मंगल मिशन है।`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    category: 'science',
    tags: ['चंद्रयान', 'ISRO', 'चांद', 'अंतरिक्ष'],
    status: 'approved',
    isFeatured: true,
    views: 9876,
    rating: 5.0
  },
  {
    title: 'महंगाई पर लगाम: आम आदमी को राहत, सरकार ने उठाए ये कदम',
    description: 'केंद्र सरकार ने खाद्य पदार्थों पर GST घटाकर 5% किया और महत्वपूर्ण दवाओं की कीमतों में कमी की है।',
    content: `नई दिल्ली: आम जनता को राहत देते हुए केंद्र सरकार ने आज कई महत्वपूर्ण घोषणाएं की हैं। खाद्य पदार्थों पर GST 12% से घटाकर 5% किया गया है।\n\nइसके अलावा, 200 से अधिक आवश्यक दवाओं की कीमतों में 15-40% की कमी की गई है। रसोई गैस सिलेंडर की सब्सिडी भी बढ़ा दी गई है।\n\nवित्त मंत्री ने कहा कि महंगाई नियंत्रण सरकार की प्राथमिकता है और जरूरतमंदों तक राहत पहुंचाना हमारा कर्तव्य है। विशेषज्ञों का कहना है कि इन कदमों से सकल मुद्रास्फीति में 1-2% की कमी आ सकती है।\n\nचुनावी साल में यह घोषणा राजनीतिक रूप से भी महत्वपूर्ण मानी जा रही है।`,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    category: 'business',
    tags: ['महंगाई', 'GST', 'सरकार', 'राहत'],
    status: 'approved',
    views: 4567,
    rating: 4.2
  },
  {
    title: 'दिल्ली मेट्रो: नया पिंक लाइन शुरू, NCR में आवाजाही होगी आसान',
    description: 'दिल्ली मेट्रो रेल कॉर्पोरेशन ने आज नया पिंक लाइन एक्सटेंशन शुरू किया है जो 25 नए स्टेशनों को जोड़ेगा।',
    content: `नई दिल्ली: दिल्ली मेट्रो का नया पिंक लाइन एक्सटेंशन आज से शुरू हो गया है। यह 35 किलोमीटर लंबा विस्तार NCR के 25 नए स्टेशनों को जोड़ेगा।\n\nइस नए मार्ग से दक्षिण दिल्ली, गुरुग्राम और फरीदाबाद के बीच यात्रा का समय 45 मिनट तक कम हो जाएगा। यह दिल्ली-एनसीआर की सबसे बड़ी मेट्रो परियोजना है।\n\nमेट्रो अधिकारियों के अनुसार, इस मार्ग पर प्रतिदिन 5 लाख यात्रियों के आने की उम्मीद है। पहले तीन महीने सवारी मुफ्त होगी।\n\nपीएमओ ने इस परियोजना को 'आम जनता की सेवा' बताया और कहा कि सस्ती और सुविधाजनक परिवहन विकास की कुंजी है।`,
    image: 'https://images.unsplash.com/photo-1565546561899-0e3b3e9e3a9b?w=800',
    category: 'local',
    tags: ['मेट्रो', 'दिल्ली', 'परिवहन', 'NCR'],
    status: 'approved',
    views: 2345,
    rating: 4.6
  },
  {
    title: 'किसान आंदोलन की वापसी: MSP पर नई बातचीत की मांग',
    description: 'किसान संगठनों ने न्यूनतम समर्थन मूल्य (MSP) की गारंटी के लिए सरकार से नई बातचीत की मांग की है।',
    content: `चंडीगढ़: दो साल बाद फिर से किसान आंदोलन तेज हो रहा है। किसान संगठनों ने आज दिल्ली की ओर 'मार्च' की घोषणा की है।\n\nमुख्य मांगें: MSP की कानूनी गारंटी, कर्ज माफी, और बिजली बिलों में छूट। किसानों का कहना है कि सरकार ने पिछले वादों को पूरा नहीं किया।\n\nसरकार ने कहा कि वह बातचीत के लिए तैयार है लेकिन सड़क जाम स्वीकार्य नहीं होगा। कृषि मंत्री ने किसानों को आश्वस्त किया कि उनकी मांगों पर गंभीरता से विचार किया जाएगा।\n\nपंजाब, हरियाणा और उत्तर प्रदेश के हजारों किसान दिल्ली कूच की तैयारी में हैं।`,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    category: 'politics',
    tags: ['किसान', 'आंदोलन', 'MSP', 'सरकार'],
    status: 'approved',
    views: 3456,
    rating: 3.9
  },
  {
    title: 'राजस्थान की स्थानीय कला को UNESCO मान्यता मिली',
    description: "राजस्थान की पारंपरिक कला 'ब्लू पॉटरी' को यूनेस्को ने 'अमूर्त सांस्कृतिक विरासत' का दर्जा दिया है।",
    content: `जयपुर: राजस्थान की प्रसिद्ध ब्लू पॉटरी को UNESCO ने अमूर्त सांस्कृतिक विरासत की सूची में शामिल किया है। यह भारत के लिए गर्व की बात है।\n\nयह सम्मान पाने वाली यह देश की 15वीं और राजस्थान की पहली कला है। जयपुर के कुम्हारों को इस खबर पर भारी जश्न मनाया।\n\nस्थानीय कलाकार राजाराम ने कहा, "हमारे पूर्वजों की कला को वैश्विक मान्यता मिली है। यह हम सभी के लिए गर्व की बात है।"\n\nराज्य सरकार ने इन कलाकारों के लिए 50 करोड़ रुपये का विशेष पैकेज भी घोषित किया है। अब इस कला को संरक्षित करने के लिए विशेष प्रशिक्षण कार्यक्रम शुरू होंगे।`,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    category: 'local',
    tags: ['कला', 'राजस्थान', 'UNESCO', 'विरासत'],
    status: 'approved',
    views: 1876,
    rating: 4.8
  },
  {
    title: 'कोरोना वायरस का नया वेरिएंट: स्वास्थ्य मंत्रालय ने जारी की एडवाइजरी',
    description: 'कोविड-19 का नया वेरिएंट तेजी से फैल रहा है। स्वास्थ्य मंत्रालय ने राज्यों को अलर्ट किया है।',
    content: `नई दिल्ली: स्वास्थ्य मंत्रालय ने आज सभी राज्यों को कोविड-19 के नए वेरिएंट के खिलाफ अलर्ट जारी किया है। मंत्रालय के अनुसार, यह वेरिएंट पिछले वेरिएंट्स की तुलना में 30% अधिक संक्रामक है।\n\nदिल्ली, महाराष्ट्र और केरल में मामलों में तेजी से वृद्धि देखी गई है। हालांकि अभी तक गंभीर मामलों में इजाफा नहीं हुआ है।\n\nस्वास्थ्य मंत्री ने लोगों से मास्क पहनने और बूस्टर डोज लगवाने की अपील की है। अस्पतालों में बेड क्षमता बढ़ाने के निर्देश दिए गए हैं।\n\nविशेषज्ञों का कहना है कि मौजूदा वैक्सीन इस वेरिएंट के खिलाफ प्रभावी है, लेकिन सावधानी जरूरी है।`,
    image: 'https://images.unsplash.com/photo-1584931423298-c576fda54bd2?w=800',
    category: 'health',
    tags: ['कोरोना', 'वायरस', 'स्वास्थ्य', 'एडवाइजरी'],
    status: 'approved',
    views: 4567,
    rating: 4.0
  },
  {
    title: 'IPL 2024: मुंबई इंडियंस ने जीता खिताब, हार्दिक पंड्या ने कहा- टीम का जज्बा अद्भुत',
    description: 'आईपीएल 2024 के फाइनल में मुंबई इंडियंस ने चेन्नई सुपर किंग्स को 5 विकेट से हराकर पांचवीं बार खिताब जीता।',
    content: `चेन्नई: आईपीएल 2024 का फाइनल रोमांचक मुकाबले के बाद मुंबई इंडियंस ने चेन्नई सुपर किंग्स को 5 विकेट से हराकर पांचवीं बार खिताब अपने नाम किया।\n\nचेन्नई ने पहले बल्लेबाजी करते हुए 20 ओवर में 178 रन बनाए। ऋतुराज गायकवाड़ ने शानदार 82 रन बनाए। जवाब में मुंबई ने सूर्यकुमार यादव के 68 रन की मदद से लक्ष्य हासिल किया।\n\nकप्तान हार्दिक पंड्या ने कहा, "यह जीत टीम के अद्भुत जज्बे की मिसाल है। हर खिलाड़ी ने अपना सर्वश्रेष्ठ दिया। फैंस का प्यार हमारे लिए प्रेरणा है।"\n\nमुंबई के कप्तान को मैन ऑफ द मैच चुना गया। पूरे देश में मुंबई फैंस ने जमकर जश्न मनाया।`,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    category: 'sports',
    tags: ['IPL', 'क्रिकेट', 'मुंबई', 'चेन्नई'],
    status: 'approved',
    views: 8765,
    rating: 4.8
  },
  {
    title: 'बजट 2024: सरकार ने युवाओं और किसानों पर किया फोकस',
    description: 'वित्त मंत्री ने संसद में 2024-25 का आम बजट पेश किया। युवाओं, किसानों और महिलाओं पर विशेष ध्यान दिया गया है।',
    content: `नई दिल्ली: वित्त मंत्री ने आज संसद में 2024-25 का आम बजट पेश किया। इस बजट में युवाओं, किसानों और महिलाओं पर विशेष फोकस किया गया है।\n\nमुख्य घोषणाएं:\n- शिक्षा पर 20% अधिक बजट\n- किसानों के लिए 15 लाख करोड़ की MSP खरीद\n- महिलाओं के लिए 30 करोड़ नए मकान\n- startup सेक्टर में 50% कर छूट जारी\n\nवित्त मंत्री ने कहा कि भारत 2047 तक विकसित देश बनेगा और इसके लिए हर वर्ग का विकास जरूरी है।\n\nOpposition ने बजट को 'चुनावी ढोंग' बताया जबकि सत्तापक्ष ने इसे जनहितैषी कहा।`,
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800',
    category: 'politics',
    tags: ['बजट', 'सरकार', 'वित्त मंत्री', 'आम जनता'],
    status: 'approved',
    views: 5678,
    rating: 4.1
  },
  {
    title: 'मध्यप्रदेश: शहरी क्षेत्रों में स्वास्थ्य सेवाओं का दिखा सुधार',
    description: "मध्यप्रदेश सरकार की 'मुख्यमंत्री आरोग्य योजना' के तहत शहरी क्षेत्रों में स्वास्थ्य सेवाओं में उल्लेखनीय सुधार हुआ है।",
    content: `भोपाल: मध्यप्रदेश की 'मुख्यमंत्री आरोग्य योजना' के तहत राज्य के सभी जिला मुख्यालयों में आधुनिक अस्पताल खोले गए हैं। पिछले एक साल में इन अस्पतालों ने 50 लाख मरीजों को मुफ्त इलाज दिया है।\n\nमुख्यमंत्री ने कहा, "स्वास्थ्य सेवाएं अब गरीबों की पहुंच में हैं। कोई भी व्यक्ति इलाज से वंचित नहीं रहेगा।"\n\nइन अस्पतालों में 100 से अधिक विशेषज्ञ डॉक्टर तैनात हैं और निःशुल्क दवाएं उपलब्ध हैं। प्रसूति सेवाओं में 40% की वृद्धि हुई है।\n\nमरीजों और उनके परिजनों ने इस पहल की सराहना की है और कहा है कि अब उन्हें बड़े शहरों का चक्कर नहीं लगाना पड़ता।`,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    category: 'local',
    tags: ['स्वास्थ्य', 'मध्यप्रदेश', 'योजना', 'अस्पताल'],
    status: 'approved',
    views: 2345,
    rating: 4.4
  },
  {
    title: 'टेस्ला की इलेक्ट्रिक कारें भारत में लॉन्च, कीमत 25 लाख रुपये से शुरू',
    description: 'अमेरिकी इलेक्ट्रिक वाहन कंपनी टेस्ला ने आज भारत में अपनी कारों की बिक्री शुरू कर दी है।',
    content: `मुंबई: टेस्ला ने आज भारत में अपनी पहली इलेक्ट्रिक कार Model 3 लॉन्च की है। इसकी शुरुआती कीमत 25 लाख रुपये रखी गई है।\n\nकंपनी ने मुंबई, दिल्ली और बेंगलुरु में शोरूम खोले हैं। टेस्ला के CEO एलोन मस्क ने वीडियो मैसेज में भारतीय ग्राहकों का स्वागत किया।\n\nइलेक्ट्रिक वाहनों पर सरकार की सब्सिडी और टैक्स में छूट इसे और आकर्षक बनाती है। एक बार चार्ज करने पर 500 किलोमीटर तक चलेगी।\n\nविश्लेषकों का कहना है कि टेस्ला की एंट्री से भारतीय EV बाजार में तेजी आएगी और Tata, Mahindra जैसी घरेलू कंपनियों को प्रतिस्पर्धा का सामना करना होगा।`,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    category: 'technology',
    tags: ['टेस्ला', 'इलेक्ट्रिक कार', 'EV', 'लॉन्च'],
    status: 'approved',
    views: 6789,
    rating: 4.5
  },
  {
    title: 'कश्मीर में पर्यटन का नया रिकॉर्ड, 1 करोड़ पर्यटकों का आंकड़ा पार',
    description: 'जम्मू-कश्मीर में इस साल पर्यटकों की संख्या ने सभी रिकॉर्ड तोड़ दिया है। घाटी में अब तक 1 करोड़ से अधिक पर्यटक आ चुके हैं।',
    content: `श्रीनगर: जम्मू-कश्मीर में इस साल पर्यटन क्षेत्र ने इतिहास रचा है। अब तक 1 करोड़ से अधिक पर्यटक घाटी का दौरा कर चुके हैं, जो पिछले साल के मुकाबले 40% अधिक है।\n\nस्थानीय होटल व्यवसायियों का कहना है कि पहली बार उन्हें ऐसी भारी मांग का सामना करना पड़ रहा है। बूटिंग, गुलमर्ग और सोनमार्ग जैसी जगहों पर कमरे महीने भर पहले बुक हो जाते हैं।\n\nसरकार ने पर्यटन बुनियादी ढांचे में 500 करोड़ का निवेश किया है। हवाई अड्डों और सड़कों का विस्तार किया गया है।\n\nस्थानीय लोगों का कहना है कि पर्यटन से रोजगार के नए अवसर पैदा हुए हैं और युवा अब अपने घर में ही रोजी-रोटी कमा रहे हैं।`,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    category: 'local',
    tags: ['पर्यटन', 'कश्मीर', 'श्रीनगर', 'रिकॉर्ड'],
    status: 'approved',
    views: 3456,
    rating: 4.7
  },
  {
    title: 'अयोध्या में राम मंदिर का निर्माण पूर्ण, प्राण प्रतिष्ठा की तैयारी',
    description: 'अयोध्या में राम जन्मभूमि पर बन रहे राम मंदिर का निर्माण 90% पूर्ण हो गया है। प्राण प्रतिष्ठा जनवरी में होगी।',
    content: `अयोध्या: अयोध्या में राम जन्मभूमि पर बन रहे भव्य राम मंदिर का निर्माण तेजी से चल रहा है। अब तक 90% काम पूरा हो गया है और शेष काम कुछ महीनों में पूरा हो जाएगा।\n\nमंदिर की प्राण प्रतिष्ठा जनवरी 2025 में प्रधानमंत्री की उपस्थिति में होगी। इसके लिए देशभर से भक्तों ने आने की इच्छा जताई है।\n\nमुख्य मंदिर में रामलला की प्रतिमा स्थापित करने का काम शुरू हो गया है। 51 इंच ऊंची मूर्ति बनाने में उत्तर प्रदेश के प्रसिद्ध मूर्तिकार लगे हुए हैं।\n\nराम मंदिर ट्रस्ट के अध्यक्ष ने कहा कि यह मंदिर आने वाली पीढ़ियों के लिए आस्था का केंद्र बनेगा।`,
    image: 'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?w=800',
    category: 'local',
    tags: ['राम मंदिर', 'अयोध्या', 'प्राण प्रतिष्ठा', 'आस्था'],
    status: 'approved',
    isFeatured: true,
    views: 12345,
    rating: 4.9
  },
  {
    title: 'नोबेल पुरस्कार 2024: भारतीय मूल के वैज्ञानिक को मिला सम्मान',
    description: 'भारतीय मूल के डॉ. अमित गर्ग को भौतिकी में नोबेल पुरस्कार से सम्मानित किया गया है।',
    content: `स्टॉकहोम: भारतीय मूल के प्रोफेसर अमित गर्ग को इस वर्ष भौतिकी में नोबेल पुरस्कार से सम्मानित किया गया है। उन्हें क्वांटम कंप्यूटिंग में उनके अभूतपूर्व योगदान के लिए यह सम्मान मिला।\n\nप्रो. गर्ग ने कहा, "यह सम्मान मेरे लिए और मेरे परिवार के लिए अत्यंत गर्व की बात है। यह मेरे शिक्षकों और छात्रों की मेहनत का भी परिणाम है।"\n\nवह MIT में प्रोफेसर हैं और पिछले 20 वर्षों से क्वांटम यांत्रिकी पर शोध कर रहे हैं। उनके शोध से कंप्यूटर और संचार क्षेत्र में क्रांति आ सकती है।\n\nप्रधानमंत्री और राष्ट्रपति ने उन्हें बधाई दी है। पूरे देश में उनके सम्मान का जश्न मनाया जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    category: 'science',
    tags: ['नोबेल पुरस्कार', 'भारतीय', 'वैज्ञानिक', 'सम्मान'],
    status: 'approved',
    views: 7890,
    rating: 4.9
  },
  {
    title: 'सोशल मीडिया का असर: भारतीय युवाओं की मानसिक स्वास्थ्य पर चिंता',
    description: 'एक ताज़ा सर्वे में सामने आया है कि भारत में 60% युवा अत्यधिक सोशल मीडिया उपयोग से प्रभावित हैं।',
    content: `नई दिल्ली: एक राष्ट्रीय सर्वे में चौंकाने वाले आंकड़े सामने आए हैं। 60% भारतीय युवा अत्यधिक सोशल मीडिया उपयोग से प्रभावित हैं और उनमें अवसाद, चिंता और अकेलेपन की समस्याएं बढ़ रही हैं।\n\nमनोवैज्ञानिकों के अनुसार, Instagram, Facebook और TikTok जैसे प्लेटफॉर्म्स पर अत्यधिक समय बिताने से बच्चों और युवाओं में आत्मसम्मान की समस्या हो रही है।\n\nसरकार ने सोशल मीडिया प्लेटफॉर्म्स को 18 वर्ष से कम उम्र के बच्चों पर असर कम करने के लिए निर्देश दिए हैं।\n\nमाता-पिता से अपील की गई है कि वे बच्चों के स्क्रीन टाइम पर नजर रखें और उन्हें बाहरी गतिविधियों के लिए प्रोत्साहित करें।`,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
    category: 'health',
    tags: ['सोशल मीडिया', 'मानसिक स्वास्थ्य', 'युवा', 'चिंता'],
    status: 'approved',
    views: 4567,
    rating: 4.3
  },
  {
    title: 'हॉलीवुड और बॉलीवुड का संगम: पहला भारतीय-अमेरिकी सुपरहीरो फिल्म का ऐलान',
    description: 'प्रमुख हॉलीवुड स्टूडियो और बॉलीवुड प्रोडक्शन हाउस ने मिलकर पहली भारतीय-अमेरिकी सुपरहीरो फिल्म बनाने का ऐलान किया है।',
    content: `लॉस एंजिल्स: मार्वल और Yash Raj Films ने मिलकर एक नई सुपरहीरो फिल्म बनाने का ऐलान किया है। इस फिल्म में भारतीय संस्कृति और हॉलीवुड की विशेषताएं होंगी।\n\nफिल्म का निर्देशन एक भारतीय निर्देशक करेंगे और अभिनय में बॉलीवुड और हॉलीवुड के सितारे होंगे। बजट 500 मिलियन डॉलर रखा गया है।\n\n"यह दोनों फिल्म उद्योगों का सबसे बड़ा सहयोग है," कहा निर्देशक ने। "हम दर्शकों को एक अनोखा अनुभव देंगे।"\n\nफिल्म 2025 में रिलीज होगी और इसे हिंदी, अंग्रेजी और तमिल में एक साथ रिलीज किया जाएगा।`,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    category: 'entertainment',
    tags: ['हॉलीवुड', 'बॉलीवुड', 'सुपरहीरो', 'फिल्म'],
    status: 'approved',
    views: 5678,
    rating: 4.6
  },
  {
    title: 'भारतीय रुपया डॉलर के मुकाबले 85 रुपये के करीब, निर्यात पर असर',
    description: 'रुपया लगातार कमजोर हो रहा है और अब यह डॉलर के मुकाबले 85 रुपये के करीब पहुंच गया है।',
    content: `मुंबई: भारतीय रुपया आज डॉलर के मुकाबले 84.95 रुपये पर पहुंच गया, जो अब तक का सबसे निचला स्तर है। विशेषज्ञों का कहना है कि यह रुझान जारी रह सकता है।\n\nरुपए की कमजोरी का असर निर्यात पर पड़ रहा है। IT सेक्टर और फार्मा कंपनियों को फायदा हो रहा है जबकि तेल आयात महंगा हो गया है।\n\nRBI ने हस्तक्षेप करने की बात कही है लेकिन अभी तक कोई ठोस कदम नहीं उठाया है। अर्थशास्त्री सरकार से नीतिगत हस्तक्षेप की मांग कर रहे हैं।\n\nआम जनता पर इसका असर सब्जियों, फलों और पेट्रोलियम उत्पादों की कीमतों में देखा जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    category: 'business',
    tags: ['रुपया', 'डॉलर', 'अर्थव्यवस्था', 'निर्यात'],
    status: 'approved',
    views: 3456,
    rating: 4.0
  },
  {
    title: 'गूगल इंडिया ने लॉन्च किया नया AI प्लेटफॉर्म, छोटे व्यवसायों को मिलेगा लाभ',
    description: 'गूगल ने कृत्रिम बुद्धिमत्ता आधारित एक नया प्लेटफॉर्म लॉन्च किया जो छोटे व्यवसायों को डिजिटल बनाने में मदद करेगा।',
    content: `नई दिल्ली: गूगल इंडिया ने आज एक नया AI प्लेटफॉर्म 'गूगल AI बिज़नेस' लॉन्च किया, जो देश के छोटे और मध्यम व्यवसायों को डिजिटल बनाने में मदद करेगा।\n\nयह प्लेटफॉर्म हिंदी, तमिल, तेलुगु, मराठी सहित 9 भारतीय भाषाओं में उपलब्ध होगा। छोटे व्यापारी इसके जरिए अपने प्रोडक्ट्स को ऑनलाइन बेच सकेंगे।\n\nगूगल के सीईओ ने कहा, "भारत का डिजिटल भविष्य छोटे शहरों और गांवों में है। हम हर छोटे व्यवसाय को डिजिटल बनाना चाहते हैं।"\n\nयह प्लेटफॉर्म मुफ्त होगा और इसमें AI आधारित प्रोडक्ट फोटोग्राफी, अनुवाद और मार्केटिंग टूल्स शामिल होंगे।`,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    category: 'technology',
    tags: ['गूगल', 'AI', 'डिजिटल', 'व्यवसाय'],
    status: 'pending',
    views: 1234,
    rating: 4.3
  },
  {
    title: 'पंजाब में नशा तस्करी के खिलाफ बड़ी कार्रवाई, 50 करोड़ की हेरोइन जब्त',
    description: 'पंजाब पुलिस ने राज्य भर में छापेमारी कर 50 करोड़ रुपये मूल्य की हेरोइन और अन्य नशीले पदार्थ जब्त किए हैं।',
    content: `चंडीगढ़: पंजाब पुलिस ने नशा तस्करी के खिलाफ चलाए गए विशेष अभियान के तहत राज्य भर में एक साथ छापेमारी की। इस कार्रवाई में 50 करोड़ रुपये मूल्य की हेरोइन और 20 किलो अफीम जब्त की गई।\n\nपुलिस ने 35 तस्करों को गिरफ्तार किया है और उनके पास से हथियार भी बरामद हुए हैं। यह अभियान पिछले तीन महीनों की गुप्त जांच के बाद चलाया गया।\n\nमुख्यमंत्री ने पुलिस की इस कार्रवाई की सराहना की और कहा कि नशे के खिलाफ जीरो टॉलरेंस की नीति जारी रहेगी। उन्होंने तस्करों को सख्त से सख्त सजा दिलाने का आश्वासन दिया।\n\nगिरफ्तार तस्करों से पूछताछ जारी है और उम्मीद है कि अंतरराज्यीय तस्करी नेटवर्क का पर्दाफाश होगा।`,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
    category: 'local',
    tags: ['पंजाब', 'नशा', 'तस्करी', 'हेरोइन'],
    status: 'approved',
    views: 4321,
    rating: 4.5
  },
  {
    title: 'भारत-चीन सीमा पर शांति वार्ता का पांचवां दौर संपन्न',
    description: 'भारत और चीन के बीच सीमा विवाद को सुलझाने के लिए पांचवें दौर की वार्ता सफलतापूर्वक संपन्न हुई।',
    content: `नई दिल्ली: भारत और चीन के बीच सीमा विवाद को सुलझाने के लिए पांचवें दौर की सैन्य वार्ता आज संपन्न हुई। दोनों पक्षों ने वार्ता को रचनात्मक बताया।\n\nवार्ता में पूर्वी लद्दाख के कुछ और क्षेत्रों में गश्त पर सहमति बनी है। सैन्य अधिकारियों के अनुसार, तनाव कम करने की दिशा में सकारात्मक प्रगति हुई है।\n\nभारत ने स्पष्ट किया कि सीमा पर शांति केवल तभी संभव है जब दोनों पक्ष अपनी प्रतिबद्धताओं का पालन करें। चीन ने भी शांतिपूर्ण समाधान की इच्छा जताई।\n\nअगले दौर की वार्ता जून में होगी। दोनों देशों ने किसी भी प्रकार की सैन्य गतिविधि से बचने का आश्वासन दिया है।`,
    image: 'https://images.unsplash.com/photo-1531715115187-c70fa8bfce10?w=800',
    category: 'politics',
    tags: ['भारत', 'चीन', 'सीमा', 'वार्ता'],
    status: 'approved',
    views: 5678,
    rating: 4.3
  },
  {
    title: 'चेन्नई सुपर किंग्स के पूर्व कप्तान धोनी ने लिया सन्यास, कहा- समय आ गया',
    description: 'एमएस धोनी ने आईपीएल से सन्यास लेने की घोषणा कर दी है। उन्होंने कहा कि अब युवा खिलाड़ियों को मौका देना चाहिए।',
    content: `चेन्नई: महेंद्र सिंह धोनी ने आज आईपीएल से सन्यास लेने की घोषणा कर दी। 45 वर्षीय धोनी ने अपने करियर में चेन्नई सुपर किंग्स को 5 बार खिताब दिलाया।\n\nधोनी ने एक भावुक संदेश में कहा, "खेल को समझना चाहिए कि कब जाना है। अब समय आ गया है कि मैं युवा खिलाड़ियों को मौका दूं।"\n\nउनके इस फैसले से क्रिकेट जगत में शोक की लहर है। फैंस सोशल मीडिया पर उन्हें श्रद्धांजलि दे रहे हैं। विराट कोहली, सचिन तेंदुलकर और रोहित शर्मा ने उन्हें शानदार करियर के लिए बधाई दी।\n\nधोनी ने संकेत दिए हैं कि वह कोचिंग में रुचि ले सकते हैं और युवा खिलाड़ियों को मेंटर करना जारी रखेंगे।`,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    category: 'sports',
    tags: ['धोनी', 'सन्यास', 'IPL', 'क्रिकेट'],
    status: 'approved',
    views: 9876,
    rating: 4.9
  },
  {
    title: 'दिल्ली में वायु प्रदूषण का स्तर खतरनाक, स्कूल बंद करने के आदेश',
    description: 'दिल्ली-एनसीआर में वायु गुणवत्ता सूचकांक 500 के पार, प्रशासन ने स्कूल बंद करने और निर्माण कार्यों पर रोक लगाई।',
    content: `नई दिल्ली: दिल्ली-एनसीआर में वायु गुणवत्ता सूचकांक (AQI) खतरनाक स्तर 500 को पार कर गया है। प्रशासन ने आपातकालीन कदम उठाते हुए सभी स्कूलों को बंद करने के आदेश जारी कर दिए हैं।\n\nनिर्माण और तोड़फोड़ के कामों पर तुरंत रोक लगा दी गई है। डीजल जनरेटर के उपयोग पर भी प्रतिबंध लगाया गया है। ऑड-ईवन योजना लागू करने पर विचार हो रहा है।\n\nस्वास्थ्य विभाग ने लोगों से घरों में रहने और मास्क पहनने की अपील की है। अस्पतालों में सांस के मरीजों की संख्या में 30% की वृद्धि हुई है।\n\nपर्यावरण विशेषज्ञों का कहना है कि पराली जलाना, वाहन प्रदूषण और निर्माण धूल मिलकर यह स्थिति पैदा कर रहे हैं। दीर्घकालिक समाधान जरूरी है।`,
    image: 'https://images.unsplash.com/photo-1583422409510-1e6632e38c80?w=800',
    category: 'local',
    tags: ['प्रदूषण', 'दिल्ली', 'AQI', 'स्वास्थ्य'],
    status: 'approved',
    views: 6543,
    rating: 4.1
  },
  {
    title: 'एशियाई खेलों में भारत ने जीते 50 पदक, इतिहास रचा',
    description: 'एशियाई खेलों में भारत ने अब तक का सर्वश्रेष्ठ प्रदर्शन करते हुए 50 पदक जीते हैं जिसमें 20 स्वर्ण पदक शामिल हैं।',
    content: `हैंगझोउ: एशियाई खेलों में भारत ने इतिहास रच दिया है। भारतीय खिलाड़ियों ने कुल 50 पदक जीते हैं जिसमें 20 स्वर्ण, 15 रजत और 15 कांस्य पदक शामिल हैं।\n\nखेल मंत्री ने कहा, "यह भारतीय खेलों का स्वर्णिम युग है। हमारे खिलाड़ी दुनिया भर में भारत का नाम रोशन कर रहे हैं।"\n\nएथलेटिक्स, शूटिंग, बैडमिंटन और कुश्ती में भारत ने शानदार प्रदर्शन किया। नीरज चोपड़ा ने भाला फेंक में स्वर्ण पदक अपने नाम किया।\n\nप्रधानमंत्री ने सभी पदक विजेताओं को बधाई दी और कहा कि 2036 ओलिंपिक की मेजबानी की तैयारी तेज कर दी गई है।`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: 'sports',
    tags: ['एशियाई खेल', 'पदक', 'भारत', 'खेल'],
    status: 'approved',
    views: 7890,
    rating: 4.8
  },
  {
    title: 'भारतीय सेना का स्वदेशी ड्रोन परीक्षण सफल, सीमा पर तैनाती शुरू',
    description: 'भारतीय सेना ने स्वदेशी निर्मित मानवरहित ड्रोन का सफल परीक्षण किया है जो 5000 मीटर ऊंचाई तक उड़ान भर सकता है।',
    content: `नई दिल्ली: भारतीय सेना ने स्वदेशी तकनीक से विकसित एक नए मानवरहित ड्रोन 'गरुड़-एक्स' का सफल परीक्षण किया है। यह ड्रोन 5000 मीटर ऊंचाई तक उड़ान भर सकता है और 48 घंटे तक हवा में रह सकता है।\n\nइस ड्रोन में उन्नत निगरानी प्रणाली, थर्मल इमेजिंग और सटीक लक्ष्य भेदन क्षमता है। इसका उपयोग सीमा निगरानी और आतंकवाद विरोधी अभियानों में किया जाएगा।\n\nरक्षा मंत्री ने कहा, "यह आत्मनिर्भर भारत की दिशा में बड़ा कदम है। हमें गर्व है कि हमारे वैज्ञानिकों ने यह तकनीक विकसित की है।"\n\nइस ड्रोन को जल्द ही उत्तरी और पश्चिमी सीमाओं पर तैनात किया जाएगा। ड्रोन की कीमत आयातित ड्रोन की तुलना में 60% कम है।`,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    category: 'technology',
    tags: ['ड्रोन', 'सेना', 'स्वदेशी', 'सीमा'],
    status: 'approved',
    views: 4567,
    rating: 4.7
  },
  {
    title: 'बच्चों में डेंगू के मामले बढ़े, अस्पतालों में अलर्ट जारी',
    description: 'देशभर में बच्चों में डेंगू के मामलों में तेज वृद्धि हुई है। स्वास्थ्य मंत्रालय ने सभी राज्यों को अलर्ट किया है।',
    content: `नई दिल्ली: देशभर में डेंगू के मामलों में तेजी देखी जा रही है, खासकर बच्चों में। पिछले एक महीने में 15,000 से अधिक नए मामले सामने आए हैं।\n\nस्वास्थ्य मंत्रालय ने सभी राज्यों को अलर्ट जारी किया है। अस्पतालों में डेंगू वार्ड बनाने और प्लेटलेट्स की पर्याप्त उपलब्धता सुनिश्चित करने के निर्देश दिए गए हैं।\n\nडॉक्टरों के अनुसार, बुखार, सिरदर्द और शरीर में दर्द डेंगू के मुख्य लक्षण हैं। माता-पिता को सलाह दी गई है कि वे बच्चों को मच्छरों से बचाएं और पूरी बाजू के कपड़े पहनाएं।\n\nनगर निगमों को मच्छर रोधी अभियान तेज करने के आदेश दिए गए हैं। घर-घर जाकर लार्वा रोधी दवा का छिड़काव किया जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1584283187115-011a16d1e2ca?w=800',
    category: 'health',
    tags: ['डेंगू', 'बच्चे', 'स्वास्थ्य', 'अस्पताल'],
    status: 'approved',
    views: 3456,
    rating: 4.0
  },
  {
    title: 'इलॉन मस्क का भारत दौरा: टेस्ला और स्टारलिंक के लिए समझौते पर हस्ताक्षर',
    description: 'इलॉन मस्क भारत दौरे पर आए और उन्होंने टेस्ला कारखाना और स्टारलिंक सेवा के लिए भारत सरकार के साथ समझौते किए।',
    content: `नई दिल्ली: टेस्ला और स्पेसएक्स के सीईओ इलॉन मस्क आज भारत दौरे पर पहुंचे। उन्होंने प्रधानमंत्री से मुलाकात की और कई महत्वपूर्ण समझौतों पर हस्ताक्षर किए।\n\nटेस्ला भारत में अपना पहला मैन्युफैक्चरिंग प्लांट लगाएगी। यह प्लांट महाराष्ट्र में स्थापित होगा और इसमें 50,000 लोगों को रोजगार मिलेगा।\n\nस्टारलिंक के जरिए भारत के दूरदराज के इलाकों में हाई-स्पीड इंटरनेट उपलब्ध कराया जाएगा। इससे ग्रामीण शिक्षा और टेलीमेडिसिन को बढ़ावा मिलेगा।\n\nमस्क ने कहा, "भारत की डिजिटल क्रांति अद्वितीय है। मैं इसका हिस्सा बनकर रोमांचित हूं।" निवेश की कुल राशि 10 अरब डॉलर बताई जा रही है।`,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    category: 'business',
    tags: ['इलॉन मस्क', 'टेस्ला', 'स्टारलिंक', 'निवेश'],
    status: 'approved',
    views: 8765,
    rating: 4.6
  },
  {
    title: 'बेंगलुरु में स्टार्टअप कल्चर का क्रेज: युवा उद्यमियों की नई पीढ़ी',
    description: 'बेंगलुरु में स्टार्टअप इकोसिस्टम तेजी से बढ़ रहा है। 500 से अधिक नए स्टार्टअप इस साल लॉन्च हुए हैं।',
    content: `बेंगलुरु: भारत की सिलिकॉन वैली कहे जाने वाले बेंगलुरु में स्टार्टअप कल्चर तेजी से फल-फूल रहा है। इस साल अब तक 500 से अधिक नए स्टार्टअप लॉन्च हुए हैं।\n\nइनमें से अधिकतर AI, हेल्थटेक, एडटेक और फिनटेक सेक्टर में हैं। युवा उद्यमियों की औसत आयु सिर्फ 24 वर्ष है।\n\nवेंचर कैपिटल फंड्स ने इस साल बेंगलुरु के स्टार्टअप्स में 5 अरब डॉलर का निवेश किया है। कई स्टार्टअप यूनिकॉर्न बनने की राह पर हैं।\n\nसरकार ने स्टार्टअप इंडिया योजना के तहत टैक्स में छूट और फंडिंग की सुविधाएं दी हैं। बेंगलुरु में हर महीने 40 से अधिक नए स्टार्टअप खुल रहे हैं।`,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    category: 'business',
    tags: ['स्टार्टअप', 'बेंगलुरु', 'युवा', 'उद्यमी'],
    status: 'approved',
    views: 3456,
    rating: 4.4
  },
  {
    title: 'केरल में नए हवाई अड्डे का उद्घाटन, पर्यटन को बढ़ावा',
    description: 'केरल के कोझिकोड में नए अंतरराष्ट्रीय हवाई अड्डे का उद्घाटन हुआ जिससे पर्यटन और व्यापार को बढ़ावा मिलेगा।',
    content: `कोझिकोड: केरल के मुख्यमंत्री ने आज कोझिकोड में नए अंतरराष्ट्रीय हवाई अड्डे का उद्घाटन किया। यह केरल का चौथा अंतरराष्ट्रीय हवाई अड्डा है।\n\nइस हवाई अड्डे के बनने से मालाबार क्षेत्र के पर्यटन और व्यापार को बड़ा बढ़ावा मिलेगा। यहां से सीधी उड़ानें दुबई, दोहा, सिंगापुर और कोलंबो के लिए शुरू होंगी।\n\nहवाई अड्डे पर सालाना 50 लाख यात्रियों को संभालने की क्षमता है। यहां आधुनिक सुविधाएं जैसे ड्यूटी फ्री शॉप, लाउंज और एडवांस्ड बैगेज सिस्टम हैं।\n\nहवाई अड्डे से 5,000 लोगों को प्रत्यक्ष और 15,000 लोगों को अप्रत्यक्ष रोजगार मिलेगा। इस परियोजना पर 1,500 करोड़ रुपये की लागत आई है।`,
    image: 'https://images.unsplash.com/photo-1575454259456-ca54cce43a39?w=800',
    category: 'local',
    tags: ['केरल', 'हवाई अड्डा', 'पर्यटन', 'कोझिकोड'],
    status: 'pending',
    views: 2134,
    rating: 4.5
  },
  {
    title: 'राष्ट्रीय शिक्षा नीति के तहत स्कूलों में व्यावसायिक प्रशिक्षण अनिवार्य',
    description: 'राष्ट्रीय शिक्षा नीति 2024 के तहत अब स्कूलों में कक्षा 6 से ही व्यावसायिक प्रशिक्षण अनिवार्य कर दिया गया है।',
    content: `नई दिल्ली: केंद्र सरकार ने राष्ट्रीय शिक्षा नीति 2024 के तहत बड़ा कदम उठाते हुए कक्षा 6 से ही व्यावसायिक प्रशिक्षण को अनिवार्य कर दिया है।\n\nनई व्यवस्था के तहत छात्र कोडिंग, इलेक्ट्रॉनिक्स, कृषि, हस्तशिल्प और कपड़ा डिजाइनिंग जैसे विषयों में से एक चुन सकेंगे। इससे उन्हें भविष्य में रोजगार के लिए तैयार किया जाएगा।\n\nशिक्षा मंत्री ने कहा, "अब पढ़ाई सिर्फ किताबों तक सीमित नहीं रहेगी बल्कि व्यावहारिक ज्ञान पर जोर होगा।"\n\nस्कूलों में इसके लिए विशेष प्रयोगशालाएं और प्रशिक्षित शिक्षकों की नियुक्ति की जाएगी। अगले सत्र से यह व्यवस्था लागू होगी।`,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800',
    category: 'politics',
    tags: ['शिक्षा', 'नीति', 'प्रशिक्षण', 'स्कूल'],
    status: 'approved',
    views: 4567,
    rating: 4.2
  },
  {
    title: 'भारत में OTT प्लेटफॉर्म्स की बढ़ती लोकप्रियता, टीवी को टक्कर',
    description: 'एक नए सर्वे के अनुसार, 65% भारतीय युवा अब पारंपरिक टीवी की जगह OTT प्लेटफॉर्म्स पर सामग्री देखना पसंद करते हैं।',
    content: `मुंबई: डिजिटल एंटरटेनमेंट के बढ़ते प्रभाव को एक नए सर्वे ने पुष्टि की है। 65% भारतीय युवा अब OTT प्लेटफॉर्म्स को पारंपरिक टीवी से अधिक पसंद करते हैं।\n\nNetflix, Amazon Prime, Disney+ Hotstar और JioCinema जैसे प्लेटफॉर्म्स पर हिंदी और क्षेत्रीय भाषाओं में सामग्री की मांग तेजी से बढ़ रही है।\n\nविशेषज्ञों के अनुसार, मोबाइल डेटा की सस्ती दरों ने OTT क्रांति को संभव बनाया है। लोग अपनी सुविधानुसार कभी भी, कहीं भी सामग्री देख सकते हैं।\n\nटीवी चैनल्स अब अपनी सामग्री को OTT प्लेटफॉर्म्स पर भी ला रहे हैं ताकि वे युवा दर्शकों को खोने से बच सकें।`,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
    category: 'entertainment',
    tags: ['OTT', 'स्ट्रीमिंग', 'युवा', 'मनोरंजन'],
    status: 'approved',
    views: 5432,
    rating: 4.3
  },
  {
    title: 'साइबर ठगी के नए तरीके: बैंक कर्मचारी बनकर ठगी करने वाला गिरोह गिरफ्तार',
    description: 'साइबर सेल ने बैंक कर्मचारी बनकर लोगों से ठगी करने वाले अंतरराज्यीय गिरोह का पर्दाफाश किया। 10 आरोपी गिरफ्तार।',
    content: `नई दिल्ली: साइबर सेल ने एक बड़ी कार्रवाई करते हुए बैंक कर्मचारी बनकर लोगों से ठगी करने वाले अंतरराज्यीय गिरोह का पर्दाफाश किया है। 10 आरोपियों को गिरफ्तार किया गया है।\n\nयह गिरोह लोगों को फोन करके खुद को बैंक अधिकारी बताता था और खाता बंद होने का डर दिखाकर OTP और कार्ड की जानकारी हासिल कर लेता था। अब तक 500 से अधिक लोगों से 20 करोड़ की ठगी की जा चुकी है।\n\nपुलिस ने लोगों से अपील की है कि वे कभी भी फोन पर अपनी बैंक जानकारी साझा न करें। कोई भी बैंक फोन करके OTP नहीं मांगता।\n\nसाइबर सुरक्षा विशेषज्ञों ने सलाह दी है कि अनजान कॉल्स पर बैंक संबंधित जानकारी साझा न करें और किसी भी संदिग्ध कॉल की सूचना तुरंत पुलिस को दें।`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'technology',
    tags: ['साइबर ठगी', 'बैंक', 'गिरफ्तार', 'सुरक्षा'],
    status: 'approved',
    views: 5678,
    rating: 4.5
  },
  {
    title: "फिल्म 'आजादी' ने बॉक्स ऑफिस पर मचाया धमाल, 100 करोड़ क्लब में शामिल",
    description: "बॉलीवुड फिल्म 'आजादी' ने रिलीज के पहले हफ्ते में 100 करोड़ रुपये का आंकड़ा पार कर लिया है।",
    content: `मुंबई: इस साल की सबसे चर्चित फिल्म 'आजादी' ने बॉक्स ऑफिस पर धमाल मचा दिया है। फिल्म ने रिलीज के सिर्फ 7 दिनों में 100 करोड़ रुपये का आंकड़ा पार कर लिया है।\n\nफिल्म में एक युवा क्रांतिकारी की कहानी दिखाई गई है जो भारत की आजादी की लड़ाई में कूद पड़ता है। समीक्षकों ने फिल्म को 5 में से 4.5 स्टार रेटिंग दी है।\n\nनिर्देशक ने कहा, "दर्शकों का प्यार देखकर मैं अभिभूत हूं। यह फिल्म हर भारतीय के दिल की बात कहती है।"\n\nफिल्म को अब इंग्लिश, तमिल और तेलुगु डब वर्जन में भी रिलीज किया जा रहा है। अगले हफ्ते फिल्म के ओवरसीज रिलीज की भी योजना है।`,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    category: 'entertainment',
    tags: ['बॉलीवुड', 'फिल्म', 'बॉक्स ऑफिस', 'आजादी'],
    status: 'approved',
    views: 6789,
    rating: 4.7
  },
  {
    title: 'हिमाचल में भारी बर्फबारी, पर्यटन सीजन शुरू, सैलानियों की उमड़ी भीड़',
    description: 'हिमाचल प्रदेश में जोरदार बर्फबारी के बाद पर्यटन सीजन शुरू हो गया है। मनाली और शिमला में होटलों की बुकिंग 100% पहुंची।',
    content: `शिमला: हिमाचल प्रदेश में पिछले तीन दिनों से हो रही जोरदार बर्फबारी के बाद पर्यटन सीजन धमाकेदार तरीके से शुरू हो गया है। मनाली, शिमला और धर्मशाला में पर्यटकों की भारी भीड़ उमड़ रही है।\n\nहोटल व्यवसायियों के अनुसार, इस सीजन के लिए अगले तीन महीनों की बुकिंग पहले ही 100% पूरी हो चुकी है। कई जगहों पर 2 फीट से अधिक बर्फ जमा हो गई है।\n\nसड़कों को बर्फ से साफ करने के लिए प्रशासन ने 24 घंटे काम करने वाली टीमें बनाई हैं। पर्यटकों के लिए विशेष सुरक्षा दिशा-निर्देश जारी किए गए हैं।\n\nस्थानीय व्यापारियों के अनुसार, इस बार पर्यटन से 500 करोड़ से अधिक की कमाई होने की उम्मीद है। स्थानीय रोजगार में भी जबरदस्त इजाफा हुआ है।`,
    image: 'https://images.unsplash.com/photo-1560779891-abc7eb768047?w=800',
    category: 'local',
    tags: ['हिमाचल', 'बर्फबारी', 'पर्यटन', 'मनाली'],
    status: 'approved',
    views: 4567,
    rating: 4.6
  },
  {
    title: 'भारत-बांग्लादेश मैत्री क्रिकेट सीरीज का आगाज, दोनों देशों में उत्साह',
    description: 'भारत और बांग्लादेश के बीच तीन मैचों की एकदिवसीय क्रिकेट सीरीज आज से शुरू हो रही है। पहला मैच ढाका में खेला जाएगा।',
    content: `ढाका: भारत और बांग्लादेश के बीच तीन मैचों की एकदिवसीय क्रिकेट सीरीज आज से शुरू हो रही है। पहला मैच ढाका के शेर-ए-बांग्ला स्टेडियम में खेला जाएगा।\n\nदोनों टीमों के खिलाड़ी पूरी तरह तैयार हैं। भारत की कप्तानी रोहित शर्मा कर रहे हैं जबकि बांग्लादेश की कप्तानी शाकिब अल हसन के पास है।\n\nसीरीज का दूसरा मैच चटगांव और तीसरा मैच कोलकाता में खेला जाएगा। दोनों देशों के क्रिकेट प्रशंसकों में भारी उत्साह है।\n\nबांग्लादेश क्रिकेट बोर्ड ने सुरक्षा के पुख्ता इंतजाम किए हैं। इस सीरीज को दोनों देशों के बीच मैत्री को मजबूत करने वाला बताया जा रहा है।`,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    category: 'sports',
    tags: ['क्रिकेट', 'भारत', 'बांग्लादेश', 'सीरीज'],
    status: 'approved',
    views: 5432,
    rating: 4.4
  },
  {
    title: 'बिहार में शिक्षा क्रांति: सरकारी स्कूलों में स्मार्ट क्लासरूम की शुरुआत',
    description: 'बिहार सरकार ने राज्य के सभी सरकारी स्कूलों में स्मार्ट क्लासरूम शुरू करने की योजना बनाई है। पहले चरण में 10,000 स्कूलों में शुरू।',
    content: `पटना: बिहार सरकार ने शिक्षा के क्षेत्र में एक बड़ी क्रांतिकारी पहल की है। राज्य के सभी सरकारी स्कूलों में स्मार्ट क्लासरूम शुरू किए जा रहे हैं।\n\nपहले चरण में 10,000 स्कूलों में स्मार्ट क्लासरूम बनाए जाएंगे। इनमें डिजिटल बोर्ड, प्रोजेक्टर और इंटरनेट कनेक्टिविटी की सुविधा होगी। शिक्षकों को विशेष प्रशिक्षण दिया जाएगा।\n\nमुख्यमंत्री ने कहा, "बिहार के बच्चे किसी से कम नहीं हैं। हम उन्हें वैश्विक स्तर की शिक्षा देंगे।"\n\nइस परियोजना पर 1,000 करोड़ रुपये खर्च होंगे। अगले तीन सालों में सभी 70,000 सरकारी स्कूलों को स्मार्ट क्लासरूम से जोड़ा जाएगा।`,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    category: 'local',
    tags: ['बिहार', 'शिक्षा', 'स्मार्ट क्लास', 'सरकारी स्कूल'],
    status: 'approved',
    views: 3456,
    rating: 4.7
  }
];

const sampleComments = [
  { username: 'johnsmith', content: 'This is absolutely fascinating! The implications for AI ethics are huge.' },
  { username: 'sarahwilson', content: 'Great reporting on this topic. Finally someone is covering this properly.' },
  { username: 'mikebrown', content: 'I disagree with some points here, but overall excellent analysis.' },
  { username: 'emilydavis', content: 'This is getting so much attention! Can\'t wait to see more developments.' },
  { username: 'localreporter', content: 'Important story that needs more coverage in mainstream media.' },
];

const sampleAds = [
  {
    title: 'Digital India - Empowering Every Citizen',
    description: 'Explore how digital initiatives are transforming lives across the nation. Stay connected, stay informed.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    redirectLink: 'https://www.digitalindia.gov.in',
    isActive: true,
    clicks: 1247,
  },
  {
    title: 'Skill India - Learn New Skills Today',
    description: 'Join millions of learners acquiring new skills for a better tomorrow. Free courses available.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    redirectLink: 'https://www.skillindia.gov.in',
    isActive: true,
    clicks: 823,
  },
  {
    title: 'ई-कॉमर्स पर शानदार ऑफर्स',
    description: 'इस सीजन में 50% तक की छूट पर खरीदारी करें। सीमित समय के लिए ऑफर उपलब्ध।',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    redirectLink: 'https://www.amazon.in',
    isActive: true,
    clicks: 2341,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloghub');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    await Advertisement.deleteMany({});
    console.log('Cleared existing data');

    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    const users = await User.insertMany(hashedUsers);
    console.log('Created users:', users.length);

    const adminUser = users.find(u => u.role === 'admin');
    const normalUsers = users.filter(u => u.role === 'user');

    const newsWithAuthors = sampleNews.map((news, index) => ({
      ...news,
      author: news.status === 'pending' ? normalUsers[index % normalUsers.length]._id : adminUser._id,
      views: Math.floor(Math.random() * 4900) + 100,
      likes: normalUsers.slice(0, Math.floor(Math.random() * 4) + 1).map(u => u._id),
      rating: news.rating || Math.floor(Math.random() * 5) + 1,
      ratingCount: Math.floor(Math.random() * 100),
      isLocal: news.category === 'local',
      shortId: Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 6),
      slug: news.title.toLowerCase().replace(/\s+/g, '+') + '+' + (Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 6)),
    }));

    const newsItems = await Blog.insertMany(newsWithAuthors);
    console.log('Created blogs:', newsItems.length);

    const commentsToCreate = [];
    newsItems.slice(0, 10).forEach((news) => {
      const numComments = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numComments; i++) {
        const commentTemplate = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        commentsToCreate.push({
          user: normalUsers[Math.floor(Math.random() * normalUsers.length)]._id,
          news: news._id,
          content: commentTemplate.content,
        });
      }
    });

    const comments = await Comment.insertMany(commentsToCreate);
    console.log('Created comments:', comments.length);

    const createdAds = await Advertisement.insertMany(sampleAds);
    console.log('Created advertisements:', createdAds.length);

    const defaultCategories = [
      { name: 'Technology', value: 'technology', icon: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop' },
      { name: 'Business', value: 'business', icon: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop' },
      { name: 'Health', value: 'health', icon: 'https://images.unsplash.com/photo-1550831107-1554da8c8464?w=100&h=100&fit=crop' },
      { name: 'Education', value: 'education', icon: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=100&h=100&fit=crop' },
      { name: 'Travel', value: 'travel', icon: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop' },
      { name: 'Food & Dining', value: 'food-dining', icon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
      { name: 'Fashion', value: 'fashion', icon: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop' },
      { name: 'Entertainment', value: 'entertainment', icon: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&h=100&fit=crop' },
      { name: 'Sports', value: 'sports', icon: 'https://images.unsplash.com/photo-1461896836934-ffe607d8212f?w=100&h=100&fit=crop' },
      { name: 'Finance', value: 'finance', icon: 'https://images.unsplash.com/photo-1565514020175-8507f7d08b7b?w=100&h=100&fit=crop' },
      { name: 'Real Estate', value: 'real-estate', icon: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop' },
      { name: 'Automotive', value: 'automotive', icon: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&h=100&fit=crop' },
      { name: 'Photography', value: 'photography', icon: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=100&h=100&fit=crop' },
      { name: 'Music', value: 'music', icon: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
      { name: 'Gaming', value: 'gaming', icon: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop' },
      { name: 'Fitness', value: 'fitness', icon: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop' },
      { name: 'Beauty', value: 'beauty', icon: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop' },
      { name: 'Legal', value: 'legal', icon: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&h=100&fit=crop' },
      { name: 'Agriculture', value: 'agriculture', icon: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=100&h=100&fit=crop' },
      { name: 'Nonprofit', value: 'nonprofit', icon: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=100&h=100&fit=crop' },
    ];
    for (const cat of defaultCategories) {
      await ServiceCategory.findOneAndUpdate({ value: cat.value }, cat, { upsert: true });
    }
    console.log('Seeded default service categories');

    const allCategoryValues = defaultCategories.map(c => c.value);
    const serviceImages = [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      'https://images.unsplash.com/photo-1432889821006-3149403b300a?w=600',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=600',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      'https://images.unsplash.com/photo-1531482615714-2c60f8e8cdb2?w=600',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600',
    ];

    const sampleServiceTitles = [
      { title: 'Cloud Infrastructure Setup & Migration', description: 'End-to-end cloud migration and infrastructure setup on AWS, Azure, or GCP with 99.9% uptime guarantee.' },
      { title: 'Custom Software Development', description: 'Tailored software solutions built with modern tech stacks to scale your business operations.' },
      { title: 'Digital Marketing Strategy', description: 'Comprehensive digital marketing campaigns including SEO, PPC, social media, and content marketing.' },
      { title: 'Brand Identity & Logo Design', description: 'Professional brand identity design including logos, color palettes, typography, and brand guidelines.' },
      { title: 'Data Analytics & Business Intelligence', description: 'Transform raw data into actionable insights with custom dashboards and reporting systems.' },
      { title: 'Mobile App Development', description: 'Native and cross-platform mobile applications with seamless user experiences and robust backend.' },
      { title: 'Cybersecurity Audit & Protection', description: 'Comprehensive security assessment, penetration testing, and ongoing protection for your digital assets.' },
      { title: 'Content Writing & Copywriting', description: 'Engaging, SEO-optimized content for websites, blogs, social media, and marketing materials.' },
      { title: 'UI/UX Design Services', description: 'User-centered design that delights users and drives conversions through intuitive interfaces.' },
      { title: 'IT Consulting & Advisory', description: 'Strategic technology consulting to help you make informed decisions and optimize your IT infrastructure.' },
      { title: 'E-commerce Development', description: 'Full-featured online stores with secure payment gateways, inventory management, and marketing tools.' },
      { title: 'Search Engine Optimization', description: 'Boost your organic visibility with data-driven SEO strategies that deliver measurable results.' },
      { title: 'Video Production & Editing', description: 'Professional video content from concept to final edit, including animation, motion graphics, and effects.' },
      { title: 'Social Media Management', description: 'Strategic social media presence management including content creation, scheduling, and community engagement.' },
      { title: 'Cloud Security Solutions', description: 'Protect your cloud infrastructure with advanced security configurations, monitoring, and compliance.' },
      { title: 'AI & Machine Learning Solutions', description: 'Custom AI/ML models for predictive analytics, natural language processing, and computer vision.' },
      { title: 'Website Development & Maintenance', description: 'Responsive, performant websites built with modern frameworks and ongoing maintenance support.' },
      { title: 'Business Process Automation', description: 'Streamline operations with intelligent automation solutions for repetitive business processes.' },
      { title: 'Graphic Design Services', description: 'Eye-catching designs for print and digital media including brochures, banners, and social media graphics.' },
      { title: 'Technical Support & Helpdesk', description: '24/7 technical support services with quick resolution times and dedicated account managers.' },
      { title: 'Blockchain Development', description: 'Decentralized application development, smart contracts, and blockchain integration services.' },
      { title: 'Email Marketing Campaigns', description: 'Targeted email marketing campaigns with automated workflows, segmentation, and performance analytics.' },
      { title: 'Corporate Training Programs', description: 'Customized training programs covering technology, leadership, and professional development skills.' },
      { title: 'Virtual Assistant Services', description: 'Dedicated virtual assistants for administrative tasks, scheduling, research, and customer support.' },
      { title: 'Database Management & Optimization', description: 'Database design, migration, optimization, and 24/7 monitoring for peak performance.' },
      { title: 'Public Relations & Media Outreach', description: 'Strategic PR campaigns to build your brand reputation and secure media coverage.' },
      { title: 'Interior Design Consultation', description: 'Professional interior design services for residential and commercial spaces with 3D visualization.' },
      { title: 'Event Management & Planning', description: 'Full-service event planning from concept to execution for corporate events, weddings, and conferences.' },
      { title: 'Personal Fitness Coaching', description: 'Customized fitness plans with one-on-one coaching, nutrition guidance, and progress tracking.' },
      { title: 'Legal Document Review', description: 'Expert legal document review, contract analysis, and compliance assessment for businesses.' },
      { title: 'Translation & Localization', description: 'Professional translation services in 50+ languages with cultural localization for global markets.' },
      { title: 'Photography & Photo Editing', description: 'Professional photography services for events, products, portraits, with expert post-processing.' },
      { title: 'Music Production & Recording', description: 'Full music production services including recording, mixing, mastering, and sound design.' },
      { title: 'Game Development Studio', description: 'Custom game development for mobile, PC, and console platforms using Unity and Unreal Engine.' },
      { title: 'Financial Planning & Advisory', description: 'Personalized financial planning including investments, retirement, tax strategy, and wealth management.' },
      { title: 'Real Estate Property Management', description: 'Comprehensive property management services including tenant screening, maintenance, and rent collection.' },
      { title: 'Auto Repair & Maintenance', description: 'Professional auto repair and maintenance services with certified mechanics and warranty.' },
      { title: 'Beauty & Skincare Services', description: 'Premium beauty treatments including facials, skincare consultations, and organic product recommendations.' },
      { title: 'Agricultural Consulting', description: 'Expert agricultural consulting for crop management, sustainable farming, and yield optimization.' },
      { title: 'Nonprofit Fundraising Strategy', description: 'Strategic fundraising campaigns, grant writing, and donor management for nonprofit organizations.' },
      { title: 'App Development for Startups', description: 'Rapid MVP development for startups with lean methodologies and scalable architecture.' },
      { title: 'HR & Recruitment Services', description: 'End-to-end recruitment services including talent sourcing, screening, interviewing, and onboarding.' },
      { title: 'Supply Chain Optimization', description: 'Streamline your supply chain with data-driven logistics, inventory management, and vendor coordination.' },
      { title: 'Podcast Production Services', description: 'Full podcast production from recording and editing to distribution and marketing.' },
      { title: 'Drone Photography & Videography', description: 'Aerial photography and videography services for real estate, events, and commercial projects.' },
      { title: 'Catering & Event Food Services', description: 'Premium catering services for events with customized menus using fresh, local ingredients.' },
      { title: 'Landscape Design & Gardening', description: 'Professional landscape design and gardening services for residential and commercial properties.' },
      { title: 'Pet Care & Dog Walking', description: 'Reliable pet care services including dog walking, pet sitting, grooming, and boarding.' },
      { title: 'Tutoring & Academic Support', description: 'Expert tutoring in STEM, languages, and humanities for students of all levels.' },
      { title: 'Web3 & NFT Consulting', description: 'Guidance on Web3 technologies, NFT strategy, tokenomics, and decentralized application development.' },
    ];

    const normalUserIds = normalUsers.map(u => u._id);
    const generateShortId = () => Math.random().toString(36).substring(2, 8);
    const serviceData = sampleServiceTitles.map((item, i) => {
      const shortId = generateShortId();
      const slug = item.title.toLowerCase().replace(/\s+/g, '+') + '+' + shortId;
      const faqItems = i < 3 ? [
        { question: `What is included in ${item.title}?`, answer: `Our ${item.title.toLowerCase()} package includes comprehensive consultation, implementation, and ongoing support tailored to your needs.` },
        { question: 'How long does it take?', answer: 'Timeline varies based on scope, typically 2-8 weeks for standard projects.' },
        { question: 'Do you offer post-delivery support?', answer: 'Yes, all our services include 30 days of post-delivery support and optional extended maintenance plans.' }
      ] : [];
      return {
        title: item.title,
        description: item.description,
        content: `${item.description}\n\nOur team of experienced professionals delivers top-quality ${item.title.toLowerCase()} services tailored to your specific needs. We combine industry best practices with innovative approaches to ensure exceptional results.\n\nContact us today to learn more about how we can help your business grow and succeed with our comprehensive ${item.title.toLowerCase()} solutions.`,
        image: serviceImages[i % serviceImages.length],
        category: allCategoryValues[i % allCategoryValues.length],
        price: Math.floor(Math.random() * 5000) + 49,
        isActive: true,
        isFeatured: i < 10,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 200) + 20,
        views: Math.floor(Math.random() * 5000) + 100,
        likes: normalUserIds.slice(0, Math.floor(Math.random() * 4) + 1),
        createdBy: normalUserIds[i % normalUserIds.length],
        slug,
        faq: faqItems,
      };
    });

    await Service.deleteMany({});
    const createdServices = await Service.insertMany(serviceData);
    console.log('Created services:', createdServices.length);

    const { extractSeoTitles } = await import('./utils/seo.js');

    for (const blog of newsItems) {
      const seoTitles = extractSeoTitles(blog.title);
      blog.seoTitles = seoTitles;
      blog.metaDescription = blog.description || seoTitles.slice(0, 3).join(', ');
      await blog.save();
    }
    console.log('Updated blogs with SEO data:', newsItems.length);

    for (const service of createdServices) {
      const seoTitles = extractSeoTitles(service.title);
      service.seoTitles = seoTitles;
      service.metaDescription = service.description || seoTitles.slice(0, 3).join(', ');
      await service.save();
    }
    console.log('Updated services with SEO data:', createdServices.length);

    const likedNewsForUsers = normalUsers.map((user, userIndex) => {
      const newsToLike = newsItems
        .filter((_, idx) => idx % (userIndex + 1) === 0)
        .slice(0, Math.floor(Math.random() * 5) + 3)
        .map(n => n._id);
      return { ...user.toObject(), likedNews: newsToLike };
    });

    for (const userData of likedNewsForUsers) {
      await User.findByIdAndUpdate(userData._id, { likedNews: userData.likedNews });
    }

    console.log('\n=== Seed completed successfully ===');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / Admin@123');
    console.log('Users: john@techworld.com, sarah@sportsfan.com, mike@politicsdaily.com, emily@entertainmentweekly.com, reporter@localnews.com');
    console.log('All user passwords: User123!');
    console.log('\nTotal Blogs:', newsItems.length);
    console.log('Approved:', newsItems.filter(n => n.status === 'approved').length);
    console.log('Pending:', newsItems.filter(n => n.status === 'pending').length);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
