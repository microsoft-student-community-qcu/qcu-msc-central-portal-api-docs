import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Custom navbar brand: logo image + two-line wordmark matching the portal
 * frontend (Sora 16px / Rubik 10px, see src/css/custom.css).
 */
export default function NavbarLogo(): React.JSX.Element {
  return (
    <Link to={useBaseUrl('/')} className="navbar__brand navbar-brand" aria-label="QCU MSC API Docs home">
      <img
        className="navbar-brand__img"
        src={useBaseUrl('img/qcu-msc-logo.png')}
        alt="QCU MSC Logo"
        width={32}
        height={36}
      />
      <span className="navbar-brand__lines">
        <span className="navbar-brand__name">Quezon City University</span>
        <span className="navbar-brand__org">Microsoft Student Community</span>
      </span>
    </Link>
  );
}
