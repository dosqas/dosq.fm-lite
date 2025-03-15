"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function UnderConstructionPage() {
    const router = useRouter();

    return (
      <div className="construction-site-content">
        <div className="construction-site-image">
          <Image src="/images/page-under-construction.svg" alt="Page Under Construction" width={400} height={400} />
        </div>
        <div className="construction-site-text">
          <p>This page is under construction. Sit tight!</p>
          <p>You can go back to the <Link href="/home" className="construction-page-link">home page</Link> or back to the <button onClick={() => router.back()} className="construction-page-link">previous page</button> you visited.</p>
        </div>
      </div>
    );
}

export default UnderConstructionPage;