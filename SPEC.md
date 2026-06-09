# News Site - Technical Specification

## Project Overview
- **Project Name**: NewsHub
- **Type**: Full-stack web application (Blog & News Website)
- **Core Functionality**: A modern news platform with user authentication, content management, and admin dashboard
- **Target Users**: General public seeking news, registered users who can like/comment, administrators

## Tech Stack
- **Frontend**: React 18, Vite, MUI (Material UI), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **State Management**: React Context API

---

## UI/UX Specification

### Color Palette

#### Light Theme
- **Primary**: `#0D9488` (Teal)
- **Secondary**: `#6366F1` (Indigo)
- **Background**: `#F8FAFC`
- **Surface**: `#FFFFFF`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Accent**: `#14B8A6`

#### Dark Theme
- **Primary**: `#F43F5E` (Rose)
- **Secondary**: `#A855F7` (Purple)
- **Background**: `#0F0F1A`
- **Surface**: `#1A1A2E`
- **Text Primary**: `#F1F5F9`
- **Text Secondary**: `#94A3B8`
- **Accent**: `#EC4899`

### Typography
- **Font Family**: 
  - Headings: "Poppins", sans-serif
  - Body: "Inter", sans-serif
- **Sizes**:
  - H1: 2.5rem (40px), weight 700
  - H2: 2rem (32px), weight 600
  - H3: 1.5rem (24px), weight 600
  - Body: 1rem (16px), weight 400
  - Small: 0.875rem (14px)

### Spacing System
- Base unit: 8px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

### Responsive Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

---

## Components Specification

### 1. Header
- **Height**: 70px (sticky)
- **Background**: Surface color with backdrop blur
- **Logo**: 40x40px, clickable to homepage
- **Search Bar**: 
  - Width: 300px (desktop), full-width on mobile
  - Placeholder: "Search news..."
  - Search by title, tags, category
- **Navigation Links**: All News, Top News, Liked, Recent, Local, Settings
- **User Menu**: Dropdown with login/logout, profile, preferences
- **Theme Toggle**: Animated sun/moon icon switch

### 2. NewsCard
- **Shape**: Square with 12px border-radius
- **Image**: 16:9 aspect ratio, object-cover
- **Hover Effect**: Scale 1.02, shadow elevation
- **Menu Icon**: 3-line icon reveals dropdown description
- **Metadata**: 
  - Views (eye icon)
  - Rating (star icons, 5-star system)
  - Likes (heart icon)
  - Comments (message icon)

### 3. Footer
- **Layout**: 4-column grid (desktop), stacked (mobile)
- **Sections**: Quick Links, Social Icons, Newsletter, Copyright
- **Social Icons**: Facebook, Twitter, Instagram, LinkedIn
- **Newsletter**: Email input + Subscribe button
- **Background**: Gradient overlay

### 4. Pages

#### All News
- Paginated grid of news cards
- 12 cards per page
- Filter/sort options

#### Top News
- Sorted by views + likes
- Badge indicator for "Hot"

#### Liked News
- Only for authenticated users
- Grid of user's liked articles

#### Recent News
- Latest 20 posts
- "New" badge indicator

#### Local News
- Filter by user location (if set)
- Geolocation prompt if not set

#### Settings
- Tab-based layout
- Profile: avatar, name, email, bio
- Preferences: theme toggle, notification toggles
- Contact: feedback form

#### Admin Dashboard
- **Stats Cards**: Total users, total views, trending posts
- **User Management**: Table with username, email, actions (delete)
- **News Management**: CRUD operations
- **Charts**: Simple bar/pie visualizations

---

## Functionality Specification

### Authentication
- JWT stored in localStorage
- Access token + Refresh token flow
- Password hashing with bcrypt (10 rounds)
- Role: "user" | "admin"
- Protected routes for authenticated pages

### API Endpoints

#### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### News
- `GET /api/news` - Get all (paginated, filtered)
- `GET /api/news/:id` - Get single news
- `POST /api/news` - Create (admin)
- `PUT /api/news/:id` - Update (admin)
- `DELETE /api/news/:id` - Delete (admin)
- `GET /api/news/top` - Get top news
- `GET /api/news/recent` - Get recent news
- `GET /api/news/local` - Get local news

#### Users
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/like/:newsId` - Like news
- `GET /api/users/liked` - Get liked news

#### Comments
- `GET /api/comments/:newsId` - Get comments
- `POST /api/comments/:newsId` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Data Models

#### User
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: user, admin),
  avatar: String,
  bio: String,
  location: String,
  likedNews: [ObjectId],
  createdAt: Date
}
```

#### News
```javascript
{
  title: String (required),
  description: String,
  content: String,
  image: String,
  category: String,
  tags: [String],
  author: ObjectId (ref: User),
  views: Number,
  likes: [ObjectId],
  rating: Number,
  isLocal: Boolean,
  createdAt: Date
}
```

#### Comment
```javascript
{
  user: ObjectId (ref: User),
  news: ObjectId (ref: News),
  content: String,
  createdAt: Date
}
```

---

## Animation Specification

### Theme Transition
- Duration: 300ms
- Easing: ease-in-out
- Properties: background-color, color, border-color

### Card Hover
- Scale: 1.02
- Box-shadow: elevated
- Duration: 200ms

### Page Transitions
- Fade in: 300ms
- Staggered delay for cards: 50ms each

### Dropdown Menu
- Slide down + fade: 200ms
- Origin: top center

### Search Bar
- Expand animation on focus
- Smooth width transition: 200ms

---

## Folder Structure
```
/server
  /models
  /routes
  /middleware
  /controllers
  server.js
  .env

/client
  /src
    /components
      /Header
      /Footer
      /NewsCard
      /Layout
    /pages
      /AllNews
      /TopNews
      /LikedNews
      /RecentNews
      /LocalNews
      /Settings
      /Admin
      /Login
      /Register
    /contexts
      ThemeContext.jsx
      DataContext.jsx
    /hooks
      useAuth.js
      usePagination.js
    /api
      api.js
    /utils
    App.jsx
    main.jsx
  package.json
  vite.config.js
```

---

## Acceptance Criteria

### Must Have
- [ ] Responsive header with all navigation items
- [ ] Search functionality works
- [ ] Dark/Light theme toggle works with smooth transition
- [ ] News cards display with all metadata
- [ ] Description dropdown works on click
- [ ] All 6 pages render correctly
- [ ] Pagination works on list pages
- [ ] Login/Register flow works
- [ ] JWT authentication protects routes
- [ ] Admin dashboard shows stats
- [ ] Footer displays with all sections

### Should Have
- [ ] Smooth page transitions
- [ ] Card hover animations
- [ ] Error boundaries with toast notifications
- [ ] Lazy loading images

### Nice to Have
- [ ] SEO meta tags

---

## Extended Features (v2.0)

### File Upload
- **Profile Upload**: Drag-and-drop profile picture upload with preview
  - Accepts JPG, PNG, GIF, WebP
  - Max file size: 5MB
  - Stored in server uploads folder
- **News Image Upload**: Admin can upload images when creating/editing news
  - Preview before saving
  - Supports base64 upload method

### User Submissions
- **Submit News**: Authenticated users can submit news/blogs
  - Title, description, content, category
  - Optional image upload
  - Status field: pending (default), approved, rejected
- **Approval Workflow**: Admin can approve/reject submissions
  - Pending tab in Admin dashboard
  - One-click approve/reject buttons
  - User can track submissions in Settings

### Sample Data
- **20 News Articles**: Across categories (Politics, Sports, Tech, Entertainment, Local)
- **6 Users**: 1 admin + 5 regular users
- **Comments**: Sample comments on news articles
- **Randomized Data**: Views, likes, ratings with realistic values

### New API Endpoints
- `POST /api/upload/profile` - Profile picture upload
- `POST /api/upload/news` - News image upload
- `POST /api/upload/news/base64` - Base64 image upload
- `POST /api/news/submit` - User submission (pending)
- `PUT /api/news/approve/:id` - Admin approval
- `PUT /api/news/reject/:id` - Admin rejection
- `GET /api/news/pending` - Get pending submissions
- `GET /api/news/my-submissions` - User's submissions
- [ ] Service worker for caching
- [ ] Unit tests
