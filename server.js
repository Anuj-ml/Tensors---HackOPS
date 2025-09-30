const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Sentiment = require('sentiment');
require('dotenv').config();

const app = express();
const sentiment = new Sentiment();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Mood detection endpoint
app.post('/api/detect-mood', (req, res) => {
    try {
        const { text, language = 'en' } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Analyze sentiment
        const result = sentiment.analyze(text);
        
        // Define mood keywords for better accuracy (English and Hindi)
        const moodKeywords = {
            happy: {
                en: ['happy', 'joy', 'excited', 'amazing', 'great', 'good', 'wonderful', 'ecstatic', 'cheerful', 'delighted', 'thrilled', 'blessed', 'fantastic', 'awesome', 'love', 'loving'],
                hi: ['खुश', 'खुशी', 'प्रसन्न', 'आनंद', 'मस्त', 'बढ़िया', 'शानदार', 'अच्छा', 'उत्साहित', 'रोमांचित', 'धन्य', 'प्यार']
            },
            sad: {
                en: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'lonely', 'heartbroken', 'crying', 'tears', 'hurt', 'pain', 'sorrow', 'grief', 'blue', 'melancholy'],
                hi: ['दुखी', 'उदास', 'अकेला', 'रोना', 'आंसू', 'दर्द', 'पीड़ा', 'गम', 'निराश', 'टूटा', 'अवसाद']
            },
            angry: {
                en: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage', 'hate', 'pissed', 'upset', 'livid'],
                hi: ['गुस्सा', 'क्रोध', 'नाराज', 'चिढ़', 'परेशान', 'झुंझलाहट', 'रोष', 'नफरत', 'क्रोधित']
            },
            calm: {
                en: ['calm', 'peaceful', 'relaxed', 'chill', 'serene', 'tranquil', 'mellow', 'zen', 'quiet', 'still'],
                hi: ['शांत', 'सुकून', 'आराम', 'ठंडा', 'स्थिर', 'निर्मल', 'चैन', 'प्रशांत']
            },
            energetic: {
                en: ['energetic', 'pumped', 'hyped', 'motivated', 'ready', 'fired', 'powerful', 'strong', 'active'],
                hi: ['ऊर्जावान', 'जोश', 'उत्साह', 'प्रेरित', 'तैयार', 'शक्तिशाली', 'मजबूत', 'सक्रिय', 'ताकतवर']
            },
            romantic: {
                en: ['romantic', 'love', 'crush', 'dating', 'relationship', 'valentine', 'sweetheart', 'affection'],
                hi: ['रोमांटिक', 'प्यार', 'प्रेम', 'मोहब्बत', 'इश्क', 'दिल', 'प्रेमी', 'स्नेह']
            }
        };

        const textLower = text.toLowerCase();
        const moodScores = {};

        // Calculate keyword-based scores using selected language
        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            const langKeywords = keywords[language] || keywords.en;
            moodScores[mood] = langKeywords.filter(keyword => 
                textLower.includes(keyword)
            ).length;
        }

        // Combine sentiment score with keyword matching
        let detectedMood = 'calm';
        
        // Find mood with highest keyword score
        const maxKeywordScore = Math.max(...Object.values(moodScores));
        if (maxKeywordScore > 0) {
            detectedMood = Object.keys(moodScores).find(
                mood => moodScores[mood] === maxKeywordScore
            );
        } else {
            // Fallback to sentiment analysis
            if (result.score > 2) {
                detectedMood = 'happy';
            } else if (result.score < -2) {
                detectedMood = 'sad';
            } else if (result.score < 0) {
                detectedMood = 'calm';
            } else {
                detectedMood = 'happy';
            }
        }

        res.json({
            mood: detectedMood,
            score: result.score,
            confidence: Math.min(Math.abs(result.score) / 10, 1)
        });
    } catch (error) {
        console.error('Error detecting mood:', error);
        res.status(500).json({ error: 'Failed to detect mood' });
    }
});

// Playlist generation endpoint
app.post('/api/generate-playlist', async (req, res) => {
    try {
        const { mood, language = 'en' } = req.body;
        
        if (!mood) {
            return res.status(400).json({ error: 'Mood is required' });
        }

        // Curated playlists for different moods (English)
        const playlistsEN = {
            happy: [
                { title: "Happy", artist: "Pharrell Williams", album: "G I R L", year: 2013, reason: "This upbeat anthem with its infectious clapping rhythm and positive lyrics is scientifically proven to boost mood and make you smile." },
                { title: "Don't Stop Me Now", artist: "Queen", album: "Jazz", year: 1978, reason: "Freddie Mercury's soaring vocals and the energetic tempo create an unstoppable feeling of joy and freedom." },
                { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls OST", year: 2016, reason: "A feel-good pop song with groovy beats that naturally makes you want to dance and celebrate life." },
                { title: "Good as Hell", artist: "Lizzo", album: "Cuz I Love You", year: 2019, reason: "An empowering self-love anthem that radiates confidence and positive energy with every note." },
                { title: "Walking on Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", year: 1983, reason: "The ultimate feel-good classic with bright horns and cheerful lyrics that instantly lifts your spirits." },
                { title: "Shake It Off", artist: "Taylor Swift", album: "1989", year: 2014, reason: "A catchy, carefree anthem about letting go of negativity and embracing joy with infectious pop energy." },
                { title: "September", artist: "Earth, Wind & Fire", album: "The Best of Earth, Wind & Fire Vol. 1", year: 1978, reason: "Funky disco vibes and celebratory lyrics make this the perfect song for pure happiness and nostalgia." },
                { title: "I Gotta Feeling", artist: "Black Eyed Peas", album: "The E.N.D.", year: 2009, reason: "An electrifying party anthem that captures the excitement of good times and positive anticipation." },
                { title: "Best Day of My Life", artist: "American Authors", album: "Oh, What a Life", year: 2013, reason: "Uplifting indie-pop with hand-clapping beats and optimistic lyrics celebrating life's best moments." },
                { title: "Three Little Birds", artist: "Bob Marley & The Wailers", album: "Exodus", year: 1977, reason: "Reggae's most reassuring message that 'every little thing gonna be alright' delivered with soothing rhythms." }
            ],
            sad: [
                { title: "Someone Like You", artist: "Adele", album: "21", year: 2011, reason: "Adele's powerful vocals and raw emotion provide catharsis for heartbreak, helping you process feelings of loss." },
                { title: "All I Want", artist: "Kodaline", album: "In a Perfect World", year: 2013, reason: "A hauntingly beautiful ballad that captures the ache of longing with gentle piano and emotional vocals." },
                { title: "Fix You", artist: "Coldplay", album: "X&Y", year: 2005, reason: "Chris Martin's tender vocals offer comfort and hope during difficult times, building to an uplifting crescendo." },
                { title: "The Night We Met", artist: "Lord Huron", album: "Strange Trails", year: 2015, reason: "Nostalgic and melancholic, this song beautifully expresses the pain of lost love and wishing to turn back time." },
                { title: "Hurt", artist: "Johnny Cash", album: "American IV", year: 2002, reason: "Cash's weathered voice adds profound depth to this reflection on regret and pain, offering emotional release." },
                { title: "Say Something", artist: "A Great Big World, Christina Aguilera", album: "Is There Anybody Out There?", year: 2013, reason: "A heart-wrenching duet about giving up on a relationship, with minimalist piano that amplifies the emotion." },
                { title: "Skinny Love", artist: "Bon Iver", album: "For Emma, Forever Ago", year: 2007, reason: "Justin Vernon's falsetto and sparse instrumentation create an intimate space for processing heartache." },
                { title: "Mad World", artist: "Gary Jules", album: "Donnie Darko OST", year: 2001, reason: "A melancholic cover that captures feelings of isolation and sadness with haunting simplicity." },
                { title: "Tears in Heaven", artist: "Eric Clapton", album: "Unplugged", year: 1992, reason: "A deeply personal song about loss and grief that offers solace through its gentle acoustic melody." },
                { title: "Nothing Compares 2 U", artist: "Sinéad O'Connor", album: "I Do Not Want What I Haven't Got", year: 1990, reason: "O'Connor's vulnerable performance captures the devastating emptiness of missing someone deeply." }
            ],
            angry: [
                { title: "In the End", artist: "Linkin Park", album: "Hybrid Theory", year: 2000, reason: "Chester Bennington's raw vocals channel frustration into powerful catharsis with nu-metal intensity." },
                { title: "Killing in the Name", artist: "Rage Against the Machine", album: "Rage Against the Machine", year: 1992, reason: "Aggressive riffs and rebellious lyrics provide the perfect outlet for rage and defiance." },
                { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", year: 1999, reason: "An unapologetic anthem for when you're having a terrible day and need to vent your frustration." },
                { title: "Chop Suey!", artist: "System of a Down", album: "Toxicity", year: 2001, reason: "Chaotic energy and intense vocals mirror the turbulent emotions of anger and confusion." },
                { title: "Bulls on Parade", artist: "Rage Against the Machine", album: "Evil Empire", year: 1996, reason: "Heavy guitar riffs and politically charged lyrics fuel righteous anger and empowerment." },
                { title: "You're Gonna Go Far, Kid", artist: "The Offspring", album: "Rise and Fall, Rage and Grace", year: 2008, reason: "Fast-paced punk rock that channels anger into energetic defiance and determination." },
                { title: "Bodies", artist: "Drowning Pool", album: "Sinner", year: 2001, reason: "Aggressive nu-metal with pounding rhythms perfect for releasing pent-up frustration." },
                { title: "Freak on a Leash", artist: "Korn", album: "Follow the Leader", year: 1998, reason: "Jonathan Davis's unique vocals and heavy bass express inner turmoil and anger powerfully." },
                { title: "Last Resort", artist: "Papa Roach", album: "Infest", year: 2000, reason: "Raw emotion and heavy instrumentation provide an outlet for feelings of desperation and anger." },
                { title: "Numb", artist: "Linkin Park", album: "Meteora", year: 2003, reason: "Expresses frustration with expectations and pressure through intense electronic rock fusion." }
            ],
            calm: [
                { title: "Weightless", artist: "Marconi Union", album: "Weightless", year: 2011, reason: "Scientifically designed to reduce anxiety by 65%, with ambient sounds that slow your heart rate." },
                { title: "Breathe Me", artist: "Sia", album: "Colour the Small One", year: 2004, reason: "Delicate piano and Sia's vulnerable vocals create a safe space for introspection and calm." },
                { title: "Holocene", artist: "Bon Iver", album: "Bon Iver", year: 2011, reason: "Ethereal vocals and gentle instrumentation evoke peaceful natural landscapes and inner tranquility." },
                { title: "To Build a Home", artist: "The Cinematic Orchestra", album: "Ma Fleur", year: 2007, reason: "A beautiful piano-driven piece that creates a sense of comfort and emotional peace." },
                { title: "Clair de Lune", artist: "Claude Debussy", album: "Suite Bergamasque", year: 1905, reason: "This classical masterpiece's flowing melody has been soothing listeners for over a century." },
                { title: "Sunset Lover", artist: "Petit Biscuit", album: "Petit Biscuit", year: 2015, reason: "Dreamy electronic soundscapes create a peaceful, meditative atmosphere perfect for relaxation." },
                { title: "Banana Pancakes", artist: "Jack Johnson", album: "In Between Dreams", year: 2005, reason: "Laid-back acoustic vibes and gentle vocals create a cozy, stress-free atmosphere." },
                { title: "The A Team", artist: "Ed Sheeran", album: "+", year: 2011, reason: "Soft guitar and tender storytelling provide a gentle, contemplative listening experience." },
                { title: "Skinny Love", artist: "Birdy", album: "Birdy", year: 2011, reason: "Birdy's delicate piano cover creates a serene, emotionally soothing soundscape." },
                { title: "River Flows in You", artist: "Yiruma", album: "First Love", year: 2001, reason: "This beautiful piano composition flows like water, naturally inducing relaxation and peace." }
            ],
            energetic: [
                { title: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", year: 1982, reason: "The ultimate motivational anthem with driving guitars that fuel determination and fighting spirit." },
                { title: "Thunderstruck", artist: "AC/DC", album: "The Razors Edge", year: 1990, reason: "High-voltage rock energy with electrifying guitar riffs that pump adrenaline instantly." },
                { title: "Lose Yourself", artist: "Eminem", album: "8 Mile OST", year: 2002, reason: "Eminem's intense flow and motivational lyrics inspire you to seize every opportunity with full force." },
                { title: "Till I Collapse", artist: "Eminem", album: "The Eminem Show", year: 2002, reason: "A powerful workout anthem with relentless energy that pushes you beyond your limits." },
                { title: "Stronger", artist: "Kanye West", album: "Graduation", year: 2007, reason: "Daft Punk's sample combined with Kanye's confidence creates an unstoppable energy boost." },
                { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", album: "The Heist", year: 2011, reason: "Explosive energy and rapid-fire lyrics create an unstoppable momentum perfect for action." },
                { title: "Remember the Name", artist: "Fort Minor", album: "The Rising Tied", year: 2005, reason: "Mike Shinoda's powerful verses about dedication and hustle fuel competitive energy." },
                { title: "Centuries", artist: "Fall Out Boy", album: "American Beauty/American Psycho", year: 2014, reason: "Epic rock anthem with stadium-sized energy that makes you feel invincible and legendary." },
                { title: "Run Boy Run", artist: "Woodkid", album: "The Golden Age", year: 2013, reason: "Orchestral percussion and urgent vocals create cinematic energy perfect for pushing forward." },
                { title: "POWER", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", year: 2010, reason: "Bold production and confident lyrics deliver pure power and unstoppable energy." }
            ],
            romantic: [
                { title: "Perfect", artist: "Ed Sheeran", album: "÷ (Divide)", year: 2017, reason: "A modern classic that captures the beauty of finding your soulmate with heartfelt sincerity." },
                { title: "Thinking Out Loud", artist: "Ed Sheeran", album: "x (Multiply)", year: 2014, reason: "Soulful vocals and sweet lyrics about enduring love make this perfect for romantic moments." },
                { title: "All of Me", artist: "John Legend", album: "Love in the Future", year: 2013, reason: "John Legend's passionate piano ballad celebrates unconditional love and acceptance beautifully." },
                { title: "Make You Feel My Love", artist: "Adele", album: "19", year: 2008, reason: "Adele's powerful rendition of Dylan's classic expresses deep devotion and unwavering commitment." },
                { title: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga", year: 2011, reason: "Delicate piano and heartfelt lyrics capture the timeless nature of true love perfectly." },
                { title: "At Last", artist: "Etta James", album: "At Last!", year: 1960, reason: "Etta's soulful voice and lush orchestration create the ultimate romantic atmosphere." },
                { title: "Can't Help Falling in Love", artist: "Elvis Presley", album: "Blue Hawaii", year: 1961, reason: "Elvis's tender delivery of this timeless ballad captures the inevitability of falling in love." },
                { title: "Your Song", artist: "Elton John", album: "Elton John", year: 1970, reason: "Simple, honest lyrics and beautiful melody express pure, genuine romantic affection." },
                { title: "Unchained Melody", artist: "The Righteous Brothers", album: "Just Once in My Life", year: 1965, reason: "Soaring vocals and emotional depth make this one of the most romantic songs ever recorded." },
                { title: "Everything", artist: "Michael Bublé", album: "Call Me Irresponsible", year: 2007, reason: "Bublé's smooth vocals and charming lyrics celebrate finding everything you need in one person." }
            ]
        };

        // Hindi/Bollywood playlists
        const playlistsHI = {
            happy: [
                { title: "Badtameez Dil", artist: "Benny Dayal, Shefali Alvares", album: "Yeh Jawaani Hai Deewani", year: 2013, reason: "एक मस्त और जोशीला गाना जो आपको नाचने पर मजबूर कर देगा, युवा ऊर्जा से भरपूर।" },
                { title: "Gallan Goodiyaan", artist: "Yashita Sharma, Manish Kumar Tipu", album: "Dil Dhadakne Do", year: 2015, reason: "पंजाबी धुनों के साथ यह शादी का गाना खुशी और उत्सव का सही माहौल बनाता है।" },
                { title: "Balam Pichkari", artist: "Vishal Dadlani, Shalmali Kholgade", album: "Yeh Jawaani Hai Deewani", year: 2013, reason: "होली की मस्ती और रंगों का जश्न, इस गाने की ऊर्जा संक्रामक है।" },
                { title: "Dil Dhadakne Do", artist: "Priyanka Chopra, Farhan Akhtar", album: "Zindagi Na Milegi Dobara", year: 2011, reason: "जिंदगी जीने का जोश भरने वाला गाना, दोस्ती और खुशी का जश्न मनाता है।" },
                { title: "Kar Gayi Chull", artist: "Neha Kakkar, Badshah", album: "Kapoor & Sons", year: 2016, reason: "पार्टी एंथम जो तुरंत डांस फ्लोर पर उतरने का मन कर देता है।" },
                { title: "Aankh Marey", artist: "Neha Kakkar, Mika Singh, Kumar Sanu", album: "Simmba", year: 2018, reason: "90s के हिट का रीमेक, पुरानी यादों के साथ नई ऊर्जा लाता है।" },
                { title: "Kala Chashma", artist: "Amar Arshi, Badshah, Neha Kakkar", album: "Baar Baar Dekho", year: 2016, reason: "कैची बीट और मजेदार lyrics के साथ पूरी पार्टी को झूमा देने वाला गाना।" },
                { title: "Nachde Ne Saare", artist: "Jasleen Royal, Siddharth Mahadevan", album: "Baar Baar Dekho", year: 2016, reason: "पंजाबी-पॉप फ्यूजन जो सबको एक साथ नचाने की ताकत रखता है।" },
                { title: "Radha", artist: "Shreya Ghoshal, Udit Narayan", album: "Student of the Year", year: 2012, reason: "रंगीन और जोशीला गाना जो खुशी की लहर ला देता है।" },
                { title: "Ghagra", artist: "Vishal Dadlani, Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani", year: 2013, reason: "राजस्थानी लोक संगीत के साथ बॉलीवुड का शानदार मिश्रण।" }
            ],
            sad: [
                { title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", year: 2013, reason: "अरिजीत की भावुक आवाज़ दिल टूटने के दर्द को सही तरीके से व्यक्त करती है।" },
                { title: "Channa Mereya", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil", year: 2016, reason: "एकतरफा प्यार की पीड़ा को बयान करता यह गाना दिल को छू जाता है।" },
                { title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", album: "Tamasha", year: 2015, reason: "रिश्तों की जटिलता और अलगाव के दर्द को खूबसूरती से दर्शाता है।" },
                { title: "Kabira", artist: "Tochi Raina, Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani", year: 2013, reason: "सूफी प्रभाव के साथ यह गाना आत्मा को शांति देता है।" },
                { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil", year: 2016, reason: "प्यार में मिलने वाली तकलीफों को बेहद खूबसूरती से पेश करता है।" },
                { title: "Hamari Adhuri Kahani", artist: "Arijit Singh", album: "Hamari Adhuri Kahani", year: 2015, reason: "अधूरे प्यार की कहानी, अरिजीत की आवाज़ में जादू भर देती है।" },
                { title: "Tujhe Bhula Diya", artist: "Mohit Chauhan, Shekhar Ravjiani", album: "Anjaana Anjaani", year: 2010, reason: "किसी को भूलने की कोशिश में छुपा दर्द, बेहद भावुक।" },
                { title: "Phir Mohabbat", artist: "Arijit Singh, Saim Bhat", album: "Murder 2", year: 2011, reason: "दोबारा प्यार में पड़ने के डर को दर्शाता मार्मिक गाना।" },
                { title: "Muskurane", artist: "Arijit Singh", album: "Citylights", year: 2014, reason: "सादगी और भावना से भरा गाना जो दिल को छू लेता है।" },
                { title: "Pachtaoge", artist: "Arijit Singh", album: "Single", year: 2019, reason: "खोने के बाद पछतावे की भावना को बखूबी व्यक्त करता है।" }
            ],
            angry: [
                { title: "Apna Time Aayega", artist: "Ranveer Singh, DIVINE", album: "Gully Boy", year: 2019, reason: "अंडरडॉग का जोश और संघर्ष, हिप-हॉप की शक्ति से भरपूर।" },
                { title: "Khoon Chala", artist: "Mohit Chauhan, Shruti Pathak", album: "Rang De Basanti", year: 2006, reason: "क्रांति और बदलाव की आग, देशभक्ति से भरा शक्तिशाली गाना।" },
                { title: "Malhari", artist: "Vishal Dadlani", album: "Bajirao Mastani", year: 2015, reason: "युद्ध का जोश और वीरता, ढोल की थाप पर आधारित ताकतवर गाना।" },
                { title: "Tattad Tattad", artist: "Aditya Narayan", album: "Goliyon Ki Raasleela Ram-Leela", year: 2013, reason: "गुजराती लोक संगीत के साथ रौद्र रस का शानदार मिश्रण।" },
                { title: "Sultan", artist: "Sukhwinder Singh", album: "Sultan", year: 2016, reason: "लड़ाई का जज्बा और जीतने की भूख, सुखविंदर की ताकतवर आवाज़।" },
                { title: "Mere Desh Ki Dharti", artist: "Mahendra Kapoor", album: "Upkar", year: 1967, reason: "देशभक्ति का जोश जगाने वाला क्लासिक गाना।" },
                { title: "Jai Jai Shivshankar", artist: "Vishal Dadlani, Benny Dayal", album: "War", year: 2019, reason: "एक्शन और एनर्जी से भरपूर, हाई-ऑक्टेन ट्रैक।" },
                { title: "Khalibali", artist: "Shivam Pathak", album: "Padmaavat", year: 2018, reason: "रणवीर सिंह के खिलजी किरदार का जोश, आक्रामक ऊर्जा।" },
                { title: "Azadi", artist: "DIVINE, Dub Sharma", album: "Gully Boy", year: 2019, reason: "आजादी और विद्रोह का नारा, रैप की शक्ति।" },
                { title: "Dangal", artist: "Daler Mehndi", album: "Dangal", year: 2016, reason: "संघर्ष और जीत का जश्न, दलेर की ऊर्जावान आवाज़।" }
            ],
            calm: [
                { title: "Tum Se Hi", artist: "Mohit Chauhan", album: "Jab We Met", year: 2007, reason: "मोहित चौहान की मधुर आवाज़ दिल को सुकून देती है।" },
                { title: "Muskurane", artist: "Arijit Singh", album: "Citylights", year: 2014, reason: "सरल और भावुक, मन को शांति प्रदान करने वाला गाना।" },
                { title: "Phir Le Aya Dil", artist: "Arijit Singh, Mohd. Irfan", album: "Barfi!", year: 2012, reason: "नॉस्टैल्जिक और शांत, पुरानी यादों में खो जाने का एहसास।" },
                { title: "Ilahi", artist: "Arijit Singh", album: "Yeh Jawaani Hai Deewani", year: 2013, reason: "आध्यात्मिक शांति और आत्म-खोज का सफर, सुकून भरा।" },
                { title: "Shayad", artist: "Arijit Singh", album: "Love Aaj Kal", year: 2020, reason: "कोमल और भावुक, रिश्तों की अनिश्चितता को दर्शाता है।" },
                { title: "Iktara", artist: "Kavita Seth, Amitabh Bhattacharya", album: "Wake Up Sid", year: 2009, reason: "सूफी प्रभाव के साथ शांत और मधुर, मन को ठहराव देता है।" },
                { title: "Pee Loon", artist: "Mohit Chauhan", album: "Once Upon A Time In Mumbai", year: 2010, reason: "रोमांटिक और शांत, प्यार की मधुरता को व्यक्त करता है।" },
                { title: "Tum Ho", artist: "Mohit Chauhan", album: "Rockstar", year: 2011, reason: "सादगी और गहराई से भरा, आत्मा को छूने वाला गाना।" },
                { title: "Khuda Jaane", artist: "KK, Shilpa Rao", album: "Bachna Ae Haseeno", year: 2008, reason: "प्यार की अनिश्चितता को कोमलता से बयान करता है।" },
                { title: "Teri Ore", artist: "Rahat Fateh Ali Khan, Shreya Ghoshal", album: "Singh Is Kinng", year: 2008, reason: "राहत की सूफी आवाज़ दिल को सुकून और प्यार से भर देती है।" }
            ],
            energetic: [
                { title: "Zinda", artist: "Siddharth Mahadevan", album: "Bhaag Milkha Bhaag", year: 2013, reason: "मिल्खा सिंह की जीवटता, दौड़ने और जीतने का जोश।" },
                { title: "Ainvayi Ainvayi", artist: "Salim Merchant", album: "Band Baaja Baaraat", year: 2010, reason: "शादी का जोश और उत्साह, नाचने को मजबूर करने वाला।" },
                { title: "Senorita", artist: "Farhan Akhtar, Hrithik Roshan, Abhay Deol", album: "Zindagi Na Milegi Dobara", year: 2011, reason: "स्पेनिश फ्लेवर के साथ दोस्ती और जिंदगी का जश्न।" },
                { title: "Ghungroo", artist: "Arijit Singh, Shilpa Rao", album: "War", year: 2019, reason: "हाई एनर्जी डांस ट्रैक, हृतिक के मूव्स के साथ परफेक्ट।" },
                { title: "Tune Maari Entriyaan", artist: "Vishal Dadlani, Neeti Mohan, Bappi Lahiri", album: "Gunday", year: 2014, reason: "रेट्रो और मॉडर्न का मिश्रण, पार्टी के लिए बेस्ट।" },
                { title: "Chak De India", artist: "Sukhwinder Singh", album: "Chak De! India", year: 2007, reason: "देशभक्ति और टीम स्पिरिट, जीतने का जोश भर देता है।" },
                { title: "Dhoom Machale", artist: "Sunidhi Chauhan", album: "Dhoom", year: 2004, reason: "एड्रेनालाइन रश और स्पीड का एहसास, एक्शन पैक्ड।" },
                { title: "Jumme Ki Raat", artist: "Mika Singh, Palak Muchhal", album: "Kick", year: 2014, reason: "वीकेंड पार्टी का परफेक्ट गाना, डांस फ्लोर पर धमाल।" },
                { title: "Desi Girl", artist: "Vishal Dadlani, Sunidhi Chauhan", album: "Dostana", year: 2008, reason: "देसी स्वैग और एनर्जी, प्रियंका के साथ आइकॉनिक।" },
                { title: "Tattoo", artist: "Abhi Dutt", album: "RRKPK", year: 2022, reason: "हाई एनर्जी पंजाबी बीट, युवा जोश से भरपूर।" }
            ],
            romantic: [
                { title: "Tum Jo Aaye", artist: "Rahat Fateh Ali Khan, Tulsi Kumar", album: "Once Upon A Time In Mumbai", year: 2010, reason: "राहत की सूफी आवाज़ प्यार की गहराई को बयान करती है।" },
                { title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", album: "Jo Jeeta Wohi Sikandar", year: 1992, reason: "पहले प्यार की मासूमियत और खुशी, सदाबहार रोमांटिक गाना।" },
                { title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", album: "Kabir Singh", year: 2019, reason: "गहरे प्यार की अभिव्यक्ति, अरिजीत की भावुक आवाज़।" },
                { title: "Raabta", artist: "Arijit Singh", album: "Agent Vinod", year: 2012, reason: "आत्माओं के बीच का रिश्ता, सूफी रोमांस का बेहतरीन उदाहरण।" },
                { title: "Tera Ban Jaunga", artist: "Akhil Sachdeva, Tulsi Kumar", album: "Kabir Singh", year: 2019, reason: "समर्पण और प्यार की गहराई, दिल को छू लेने वाला।" },
                { title: "Tum Mile", artist: "Neeraj Shridhar, Pritam", album: "Tum Mile", year: 2009, reason: "बारिश और रोमांस का परफेक्ट कॉम्बिनेशन।" },
                { title: "Jeene Laga Hoon", artist: "Atif Aslam, Shreya Ghoshal", album: "Ramaiya Vastavaiya", year: 2013, reason: "प्यार में जीने का एहसास, आतिफ की मखमली आवाज़।" },
                { title: "Bolna", artist: "Arijit Singh, Asees Kaur", album: "Kapoor & Sons", year: 2016, reason: "कोमल और भावुक, प्यार की बातें करने का गाना।" },
                { title: "Hawayein", artist: "Arijit Singh", album: "Jab Harry Met Sejal", year: 2017, reason: "प्यार की हवाओं में बहने का एहसास, मधुर और रोमांटिक।" },
                { title: "Tere Bina", artist: "A.R. Rahman, Chinmayi", album: "Guru", year: 2007, reason: "रहमान का जादू, प्यार के बिना अधूरेपन को दर्शाता है।" }
            ]
        };

        const playlists = language === 'hi' ? playlistsHI : playlistsEN;
        const songs = playlists[mood] || playlists.happy;
        
        res.json({
            mood,
            songs,
            count: songs.length,
            language
        });
    } catch (error) {
        console.error('Error generating playlist:', error);
        res.status(500).json({ error: 'Failed to generate playlist' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mood Tune AI API is running' });
});

app.listen(PORT, () => {
    console.log(`🎵 Mood Tune AI server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
