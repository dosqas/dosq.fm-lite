import React from 'react';
import "../../styles/about.css";

const AboutPage: React.FC = () => {
    return (
        <div className="about-page">
            <h1>About dosq.fm</h1>
            <p>
                dosq.fm is a personalized Spotify listening history tracker designed to provide insightful statistics and analytics. Whether you're a music lover or simply curious about your listening habits, dosq.fm offers a fun and informative way to explore your music journey.
            </p>
            <h2>What is dosq.fm?</h2>
            <p>
                dosq.fm allows you to track your Spotify listening history, discover new trends in your music preferences, and gain detailed insights into your listening patterns over time. With custom features like filtering, recommendations, and interactive stats, it’s your personal music dashboard.
            </p>
            <h2>Technologies Used</h2>
            <ul>
                <li><strong>Frontend:</strong> Built with Next.js and TypeScript, ensuring a smooth and responsive user experience.</li>
                <li><strong>Backend:</strong> Uses Next.js API routes to handle requests, enabling seamless interaction with Spotify’s API and efficient data processing.</li>
                <li><strong>Database:</strong> PostgreSQL as the primary database, with Redis used as a caching layer for improved performance.</li>
            </ul>
            <h2>Inspiration</h2>
            <p>
                dosq.fm is heavily inspired by the platform Last.fm, which I really love and use a lot. While I intend to draw inspiration from it, I also aim to add unique features that I would have loved to see on the platform, such as an obscurity meter (inspired by the Obscurify app), deeper insights related to genres, time of day trends, and more.
            </p>
            <h2>Key Features</h2>
            <h3>Listening Stats & Insights</h3>
            <ul>
                <li>Top artists, albums & songs: View stats for different time periods or custom date ranges.</li>
                <li>Listening streak: Track the longest and current streaks for any artist, album, or song.</li>
                <li>Time of day trends: Analyze listening patterns by hour, genre, and artist.</li>
                <li>Genre breakdown: See listening distribution across genres.</li>
                <li>Favorite decades: Discover trends in the release years of your favorite tracks.</li>
                <li>Obscure-meter: Measure the rarity of your music taste based on Spotify data.</li>
            </ul>
            <h3>Social & Community Features</h3>
            <ul>
                <li>Live listening feed: See what friends are currently listening to in real-time.</li>
                <li>Listening compatibility: Compare your music taste with other users.</li>
                <li>Collab playlists: Create shared playlists with friends.</li>
            </ul>
            <h3>Personalized & Interactive Features</h3>
            <ul>
                <li>Listening prediction suggestions: Get song, album, or artist recommendations based on past history.</li>
                <li>Throwback reminders: See what you listened to on this day in past years.</li>
                <li>Listening mood analysis: Detect emotional trends in your listening habits.</li>
            </ul>
            <h3>Integration & Discovery</h3>
            <ul>
                <li>Summaries: Weekly, monthly, and yearly recaps.</li>
                <li>Artist suggestions: Discover new artists based on listening history and friends' preferences.</li>
                <li>Concert alerts: Get notified about upcoming concerts from your favorite artists.</li>
            </ul>
            <h2>Creator</h2>
            <p>
                Created by Sebastian Soptelea as a university project, dosq.fm combines my passion for both music and web development. This project was developed as part of the Systems for Design and Implementation course during the second semester of my second year at university, showcasing my skills in full-stack development.
            </p>
            <h2>Future Goals</h2>
            <p>
            As I continue to develop dosq.fm, I plan to expand its functionality by enhancing social features, refining music insights, and introducing new ways for users to explore their listening habits. Future updates may include more in-depth trends, interactive visualizations, and additional personalization options to make the experience even more engaging. My goal is to create a platform that not only provides meaningful statistics but also deepens the connection between users and their music.            </p>
        </div>
    );
};

export default AboutPage;
