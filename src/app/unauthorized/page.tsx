/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/
import React from 'react'; // Import React to use its types

const UnauthorizedPage = () => {
  // By adding `: React.CSSProperties`, we tell TypeScript the exact shape this object should have.
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a202c',
    fontFamily: 'sans-serif',
    color: '#a0aec0',
  };

  const containerStyle: React.CSSProperties = {
    textAlign: 'center', // Now TypeScript knows 'center' is a valid value for textAlign
    backgroundColor: '#2d3748',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '64px',
    color: '#4299e1',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    color: '#e2e8f0',
    marginBottom: '16px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    marginBottom: '24px',
  };

  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: '#4299e1',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
  };

  const contactLinkStyle: React.CSSProperties = {
    color: '#63b3ed',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={iconStyle}>{/* SVG code... */}</div>
        <h1 style={headingStyle}>Access Denied</h1>
        <p style={textStyle}>You are not authorized to view this page. It seems you&apos;ve stumbled upon a restricted area.</p>
        <p style={textStyle}>
          To gain access to the dashboard and other protected resources, please contact the site administrator to have your permissions updated.
        </p>
        <a href="mailto:admin@example.com" style={ctaButtonStyle}>
          Contact Admin
        </a>
        <p style={{ marginTop: '24px', fontSize: '0.875rem' }}>
          If you believe you are seeing this in error, please reach out to our{' '}
          <a href="/support" style={contactLinkStyle}>
            support team
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
