import Image from 'next/image';

function UnderConstructionPage() {
    return (
      <div className="construction-site-content">
        <Image src="/images/page-under-construction.svg" alt="Page Under Construction" width={400} height={400} />
        This page is under construction. Sit tight!
      </div>
    );
  }
  
  export default UnderConstructionPage;