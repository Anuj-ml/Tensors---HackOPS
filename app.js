// DOM Elements
const moodInput = document.getElementById('moodInput');
const voiceBtn = document.getElementById('voiceBtn');
const generateBtn = document.getElementById('generateBtn');
const recordingStatus = document.getElementById('recordingStatus');
const loading = document.getElementById('loading');
const playlistContainer = document.getElementById('playlistContainer');
const moodText = document.getElementById('moodText');
const playlist = document.getElementById('playlist');
const langEnglish = document.getElementById('langEnglish');
const langHindi = document.getElementById('langHindi');
const moodLabel = document.getElementById('moodLabel');
const moodSlider = document.getElementById('moodSlider');
const moodSliderValue = document.getElementById('moodSliderValue');
const moodSliderLabel = document.getElementById('moodSliderLabel');
const shareBtn = document.getElementById('shareBtn');

// Language state
let currentLanguage = 'en'; // 'en' or 'hi'
let currentPlaylist = [];
let currentMood = '';

// Speech Recognition Setup
let recognition;
let isRecording = false;
let finalTranscript = '';

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;  // Keep listening
    recognition.interimResults = true;  // Show real-time results
    recognition.lang = 'en-US';  // Will be updated based on language selection
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        console.log('🎤 Speech recognition started - speak now!');
        isRecording = true;
        finalTranscript = '';
        voiceBtn.classList.add('bg-red-500', 'recording');
        voiceBtn.classList.remove('bg-purple-500');
        recordingStatus.classList.remove('hidden');
        recordingStatus.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>Listening... Speak now!';
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        // Loop through results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
                console.log('✅ Final transcript:', transcript);
            } else {
                interimTranscript += transcript;
                console.log('⏳ Interim transcript:', transcript);
            }
        }
        
        // Update input field with both final and interim results
        moodInput.value = finalTranscript + interimTranscript;
        
        // Update recording status with what's being heard
        if (interimTranscript || finalTranscript) {
            recordingStatus.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>Hearing: "${interimTranscript || finalTranscript.trim()}"`;
        }
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        stopRecording();
        
        if (event.error === 'no-speech') {
            recordingStatus.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>No speech detected. Click mic to try again.';
            setTimeout(() => {
                recordingStatus.classList.add('hidden');
            }, 3000);
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            alert('🎤 Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'aborted') {
            // User stopped recording, this is normal
            console.log('Recording stopped by user');
        } else {
            alert(`Speech recognition error: ${event.error}`);
        }
    };
    
    recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
        if (isRecording) {
            // If still in recording state, update the status
            recordingStatus.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>Recording complete!';
            setTimeout(() => {
                stopRecording();
            }, 1000);
        }
    };
} else {
    voiceBtn.style.display = 'none';
    console.warn('⚠️ Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
    alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari for voice features.');
}

// Stop recording
function stopRecording() {
    isRecording = false;
    voiceBtn.classList.remove('bg-red-500', 'recording');
    voiceBtn.classList.add('bg-purple-500');
    recordingStatus.classList.add('hidden');
    // Keep the transcript in the input field
    console.log('Final text:', moodInput.value);
}

// Toggle voice recording
function toggleRecording() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    if (!isRecording) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            alert('Failed to start voice recognition. Please try again.');
        }
    } else {
        recognition.stop();
    }
}

// Language switching
langEnglish.addEventListener('click', () => {
    currentLanguage = 'en';
    updateLanguage();
});

langHindi.addEventListener('click', () => {
    currentLanguage = 'hi';
    updateLanguage();
});

function updateLanguage() {
    if (currentLanguage === 'en') {
        // English UI
        langEnglish.classList.add('lang-btn-active');
        langHindi.classList.remove('lang-btn-active');
        
        moodLabel.innerHTML = '<span class="text-2xl">💭</span> <span>How are you feeling today?</span>';
        moodInput.placeholder = 'Type how you\'re feeling or use the mic...';
        generateBtn.innerHTML = '<span class="btn-text">Generate My Playlist</span><span class="btn-icon">🎵</span>';
        moodSliderLabel.innerHTML = '<span class="text-2xl">🎚️</span> <span>Or use the Moodometer</span>';
        updateSliderDisplay();
        
        if (recognition) {
            recognition.lang = 'en-US';
        }
    } else {
        // Hindi UI
        langHindi.classList.add('lang-btn-active');
        langEnglish.classList.remove('lang-btn-active');
        
        moodLabel.innerHTML = '<span class="text-2xl">💭</span> <span>आज आप कैसा महसूस कर रहे हैं?</span>';
        moodInput.placeholder = 'टाइप करें या माइक का उपयोग करें...';
        generateBtn.innerHTML = '<span class="btn-text">मेरी प्लेलिस्ट बनाएं</span><span class="btn-icon">🎵</span>';
        moodSliderLabel.innerHTML = '<span class="text-2xl">🎚️</span> <span>या मूडोमीटर का उपयोग करें</span>';
        updateSliderDisplay();
        
        if (recognition) {
            recognition.lang = 'hi-IN';
        }
    }
    console.log('Language changed to:', currentLanguage);
}

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Mood detection function using backend API
async function detectMood(text) {
    try {
        console.log('Detecting mood for text:', text);
        const response = await fetch(`${API_BASE_URL}/detect-mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, language: currentLanguage })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to detect mood: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Mood detected:', data.mood);
        return data.mood;
    } catch (error) {
        console.error('Error detecting mood:', error);
        // Fallback to simple detection if API fails
        console.warn('Using fallback mood: happy');
        return 'happy';
    }
}

// Generate playlist based on mood using backend API
async function generatePlaylist(mood) {
    try {
        console.log('Generating playlist for mood:', mood);
        const response = await fetch(`${API_BASE_URL}/generate-playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood, language: currentLanguage })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to generate playlist: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Playlist generated:', data.songs.length, 'songs');
        return data.songs;
    } catch (error) {
        console.error('Error generating playlist:', error);
        throw error;
    }
}

// Moodometer functionality
const moodMap = {
    0: { name: 'sad', emoji: '😢', en: 'Sad', hi: 'दुखी' },
    1: { name: 'angry', emoji: '😠', en: 'Angry', hi: 'गुस्सा' },
    2: { name: 'happy', emoji: '😊', en: 'Happy', hi: 'खुश' },
    3: { name: 'calm', emoji: '😌', en: 'Calm', hi: 'शांत' },
    4: { name: 'energetic', emoji: '⚡', en: 'Energetic', hi: 'ऊर्जावान' },
    5: { name: 'romantic', emoji: '💕', en: 'Romantic', hi: 'रोमांटिक' }
};

function updateSliderDisplay() {
    const value = parseInt(moodSlider.value);
    const mood = moodMap[value];
    const displayText = currentLanguage === 'hi' ? mood.hi : mood.en;
    moodSliderValue.textContent = `${mood.emoji} ${displayText}`;
}

moodSlider.addEventListener('input', updateSliderDisplay);

// Display playlist
function displayPlaylist(songs, mood) {
    // Store current playlist and mood for sharing
    currentPlaylist = songs;
    currentMood = mood;
    
    // Update mood display
    moodText.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    
    // Clear previous playlist
    playlist.innerHTML = '';
    
    // Add songs to playlist
    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5 playlist-item mb-4';
        songElement.innerHTML = `
            <div class="flex items-start">
                <div class="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    ${index + 1}
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-lg mb-1">${song.title}</h3>
                    <p class="text-gray-700 text-sm mb-1 font-medium">${song.artist}</p>
                    ${song.album ? `<p class="text-gray-600 text-xs mb-2">${song.album} ${song.year ? `(${song.year})` : ''}</p>` : ''}
                    ${song.reason ? `
                        <div class="mt-3 pt-3 border-t border-gray-300">
                            <p class="text-gray-700 text-sm italic leading-relaxed">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ${song.reason}
                            </p>
                        </div>
                    ` : ''}
                </div>
                <button class="text-purple-500 hover:text-purple-700 transition-colors ml-3 flex-shrink-0" title="Play on your music app">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        `;
        playlist.appendChild(songElement);
    });
    
    // Show playlist container
    playlistContainer.classList.remove('hidden');
    playlistContainer.classList.add('fade-in');
}

// Event Listeners
voiceBtn.addEventListener('click', toggleRecording);

generateBtn.addEventListener('click', async () => {
    const text = moodInput.value.trim();
    let mood;
    
    // Check if user used the slider or text input
    if (!text) {
        // Use slider value
        const sliderValue = parseInt(moodSlider.value);
        mood = moodMap[sliderValue].name;
        console.log('Using moodometer:', mood);
    } else {
        // Use text input
    }
    
    // Show loading state
    loading.classList.remove('hidden');
    playlistContainer.classList.add('hidden');
    
    try {
        // Detect mood from text if not already set
        if (!mood) {
            mood = await detectMood(text);
        }
        
        // Generate playlist based on mood
        const songs = await generatePlaylist(mood);
        
        // Display the playlist
        displayPlaylist(songs, mood);
    } catch (error) {
        console.error('Error generating playlist:', error);
        alert('Failed to generate playlist. Please check the console for details.');
    } finally {
        // Hide loading state
        loading.classList.add('hidden');
    }
});

// Allow pressing Enter in the input field to generate playlist
moodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

// Share playlist functionality
shareBtn.addEventListener('click', async () => {
    if (currentPlaylist.length === 0) {
        alert('No playlist to share!');
        return;
    }
    
    // Create shareable text
    const moodEmoji = Object.values(moodMap).find(m => m.name === currentMood)?.emoji || '🎵';
    const moodDisplay = currentMood.charAt(0).toUpperCase() + currentMood.slice(1);
    
    let shareText = `${moodEmoji} My ${moodDisplay} Mood Playlist from Mood Tune AI\n\n`;
    currentPlaylist.forEach((song, index) => {
        shareText += `${index + 1}. ${song.title} - ${song.artist}\n`;
    });
    shareText += `\n🎵 Create your own mood playlist at Mood Tune AI!`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        try {
            await navigator.share({
                title: `My ${moodDisplay} Mood Playlist`,
                text: shareText
            });
            console.log('Playlist shared successfully');
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                copyToClipboard(shareText);
            }
        }
    } else {
        // Fallback to clipboard
        copyToClipboard(shareText);
    }
});

function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // Show success message
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
        `;
        setTimeout(() => {
            shareBtn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy playlist. Please try again.');
    } finally {
        document.body.removeChild(textarea);
    }
}
