/*
|-----------------------------------------
| setting up Page for Blocked Users
| @author: Your Name Here
| @copyright: Your Project, October, 2023
|-----------------------------------------
*/

'use client';

import React from 'react';

const BlockedUserPage = () => {
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0a', // Darker background
    fontFamily: 'Roboto, sans-serif', // Modern font
    color: '#f0f0f0',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: '#1c1c1c', // Slightly lighter dark background for the container
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // More pronounced shadow
    maxWidth: '700px',
    width: '100%',
    animation: 'fadeInUp 0.8s ease-out', // Simple animation
    border: '1px solid #333',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '72px',
    color: '#ff4d4f', // Red for warning
    marginBottom: '20px',
    animation: 'pulse 1.5s infinite', // Pulsing animation for the icon
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '3rem',
    color: '#e0e0e0',
    marginBottom: '16px',
    fontWeight: '700',
    letterSpacing: '1px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    lineHeight: '1.8',
    marginBottom: '28px',
    color: '#b0b0b0',
  };

  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: '#007bff', // Bright blue for CTA
    color: '#ffffff',
    padding: '14px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontSize: '1.1rem',
    marginTop: '20px',
  };

  const smallTextStyle: React.CSSProperties = {
    marginTop: '30px',
    fontSize: '0.95rem',
    color: '#888',
  };

  const linkStyle: React.CSSProperties = {
    color: '#007bff', // Same blue for consistency
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={iconStyle}>
          {/* You can replace this with an actual SVG icon, e.g., a "blocked" or "stop" icon */}
          🚫
        </div>
        <h1 style={headingStyle}>Account Blocked</h1>
        <p style={textStyle}>
          It appears your access to our services has been temporarily or permanently suspended. We understand this might be frustrating, and we apologize for
          any inconvenience.
        </p>
        <p style={textStyle}>This action is typically taken due to a violation of our terms of service or community guidelines.</p>
        <a
          href="/contact"
          style={ctaButtonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Contact Support
        </a>
        <p style={smallTextStyle}>
          If you believe this is an error or would like to appeal this decision, please visit our{' '}
          <a href="/contact" style={linkStyle}>
            contact page
          </a>{' '}
          for further assistance.
        </p>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        /* Basic responsiveness */
        @media (max-width: 768px) {
          div[style*="max-width: 700px"] { /* Targeting containerStyle */
            padding: 30px;
          }
          h1[style*="font-size: 3rem"] { /* Targeting headingStyle */
            font-size: 2.5rem;
          }
          p[style*="font-size: 1.25rem"] { /* Targeting textStyle */
            font-size: 1.1rem;
          }
          a[style*="font-size: 1.1rem"] { /* Targeting ctaButtonStyle */
            font-size: 1rem;
            padding: 12px 24px;
          }
        }
        @media (max-width: 480px) {
          div[style*="max-width: 700px"] { /* Targeting containerStyle */
            padding: 20px;
          }
          h1[style*="font-size: 3rem"] { /* Targeting headingStyle */
            font-size: 2rem;
          }
          p[style*="font-size: 1.25rem"] { /* Targeting textStyle */
            font-size: 1rem;
          }
          div[style*="font-size: 72px"] { /* Targeting iconStyle */
            font-size: 60px;
          }
          a[style*="font-size: 1.1rem"] { /* Targeting ctaButtonStyle */
            display: block;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </main>
  );
};

export default BlockedUserPage;
