# Rate-it ⭐

A modern web application for rating and reviewing social media influencers. Built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

- **Influencer Discovery**: Browse and search through influencers
- **Advanced Filtering**: Filter by rating, platform, and tags
- **User Authentication**: Secure login/signup with Supabase
- **Review System**: Rate influencers on authenticity, professionalism, and communication
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live data from Supabase backend

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React, React Icons
- **Deployment**: GitHub Pages

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Rate-it.git
   cd Rate-it
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Rate-it.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Set **Source** to "GitHub Actions"
   - The workflow will automatically deploy on every push to main branch

3. **Your site will be available at**: `https://YOUR_USERNAME.github.io/Rate-it/`

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 📱 Features

### Search & Filter
- **Text Search**: Search by name, username, bio, or platform
- **Platform Filter**: Filter by social media platform
- **Rating Filter**: Filter by overall rating (3+, 4+, 5 stars)
- **Tag Filter**: Filter by influencer tags

### User Experience
- **Responsive Design**: Works on all device sizes
- **Real-time Search**: Instant search results
- **Smooth Animations**: Modern UI interactions
- **Accessibility**: Keyboard navigation support

### Security
- **Input Validation**: Client-side form validation
- **XSS Protection**: Input sanitization
- **Secure Authentication**: Supabase Auth integration

## 🗄️ Database Schema

### Tables
- **influencers**: Influencer profiles and information
- **ratings**: User reviews and ratings
- **profiles**: User profile information

### Key Fields
- `influencer_id`: Links ratings to influencers
- `user_id_comment`: Links ratings to users
- `overall`, `authenticity`, `professionalism`, `communication`: Rating scores

## 🔐 Environment Variables

Make sure to set these in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/YOUR_USERNAME/Rate-it/issues) page
2. Create a new issue with detailed description
3. Include your environment details and error messages

## 🌟 Live Demo

Visit: [https://YOUR_USERNAME.github.io/Rate-it/](https://YOUR_USERNAME.github.io/Rate-it/)

---

**Made with ❤️ using React, Vite, and Tailwind CSS**
