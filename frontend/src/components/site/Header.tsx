import React from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="site-header-content">
        <div className="site-header-logo">
          <Link href="/">
            <span className="site-header-logo-dosq-part">dosq</span>
            <span className="site-header-logo-fm-part">.fm</span>
          </Link>
        </div>
        <div className="site-header-user-actions">
            <div className="site-header-profile">
                <Link href="/profile">
                    <Image src="/images/user-circle.svg" alt="User Profile" width={50} height={50} priority/>   
                </Link>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;