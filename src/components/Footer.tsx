import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="site-footer-content">
                <div className="site-footer-links">
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </div>
                <div className="site-footer-social-media">
                    <Link href="https://www.linkedin.com/in/sebastian-soptelea/" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
                    <Link href="https://github.com/dosqas" target="_blank" rel="noopener noreferrer">GitHub</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;