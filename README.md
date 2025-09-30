# 🎵 Mood Music Maestro

An AI-powered web application that detects your mood from voice or text input and generates a personalized 5-song playlist to match your emotional state.

## ✨ Features

- **Dual Input Methods**: Type or speak how you're feeling
- **AI Mood Detection**: Uses sentiment analysis to accurately detect emotions
- **Smart Playlists**: Generates curated playlists for 6 different moods:
  - 😊 Happy
  - 😢 Sad
  - 😠 Angry
  - 😌 Calm
  - ⚡ Energetic
  - 💕 Romantic
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Voice Recognition**: Built-in speech-to-text functionality

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\Users\Rishabh\CascadeProjects\windsurf-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

1. **Enter Your Feelings**
   - Type how you're feeling in the text box, OR
   - Click the microphone icon and speak

2. **Generate Playlist**
   - Click "Generate My Playlist" button
   - Wait for the AI to analyze your mood

3. **Enjoy Your Music**
   - View your personalized 5-song playlist
   - See the detected mood and song details

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript
- Web Speech API (for voice input)

### Backend
- Node.js
- Express.js
- Sentiment Analysis Library
- CORS for cross-origin requests

## 📁 Project Structure

```
windsurf-project/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── app.js             # Frontend JavaScript
├── server.js          # Backend API server
├── package.json       # Node.js dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🔧 API Endpoints

### POST `/api/detect-mood`
Analyzes text and returns detected mood.

**Request Body:**
```json
{
  "text": "I'm feeling great today!"
}
```

**Response:**
```json
{
  "mood": "happy",
  "score": 5,
  "confidence": 0.8
}
```

### POST `/api/generate-playlist`
Generates a playlist based on mood.

**Request Body:**
```json
{
  "mood": "happy"
}
```

**Response:**
```json
{
  "mood": "happy",
  "songs": [
    {
      "title": "Happy",
      "artist": "Pharrell Williams",
      "album": "G I R L",
      "year": 2013
    }
  ],
  "count": 5
}
```

### GET `/api/health`
Health check endpoint.

## 🎨 Customization

### Adding More Songs
Edit the `playlists` object in `server.js` to add more songs to each mood category.

### Changing Mood Detection
Modify the `moodKeywords` object in `server.js` to adjust mood detection sensitivity.

### Styling
Update `styles.css` or modify Tailwind classes in `index.html` to customize the appearance.

## 🔒 Browser Compatibility

- **Voice Input**: Requires a browser that supports the Web Speech API
  - ✅ Chrome/Edge (Chromium)
  - ✅ Safari
  - ❌ Firefox (limited support)

## 🐛 Troubleshooting

### Voice input not working
- Ensure your browser supports Web Speech API
- Check microphone permissions
- Try using Chrome or Edge for best compatibility

### Server won't start
- Make sure port 3000 is not in use
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be v14+)

### Playlist not generating
- Check browser console for errors
- Ensure the backend server is running
- Verify network connection between frontend and backend

## 🚀 Future Enhancements

- [ ] Integration with Spotify/YouTube APIs for real playback
- [ ] User accounts to save favorite playlists
- [ ] More mood categories
- [ ] Playlist export functionality
- [ ] Social sharing features
- [ ] Machine learning model for better mood detection

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Made with ❤️ and 🎵
