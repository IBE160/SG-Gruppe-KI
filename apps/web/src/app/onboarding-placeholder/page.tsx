// apps/web/src/app/onboarding-placeholder/page.tsx

import React from 'react';

const OnboardingPlaceholderPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#102216', // background-dark
      color: '#ffffff', // text-white
      fontFamily: 'Lexend, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#13ec5b' // primary green
      }}>
        Onboarding Flow Coming Soon!
      </h1>
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '2rem'
      }}>
        We're working hard to bring you a personalized onboarding experience.
      </p>
      <p style={{
        fontSize: '1rem',
        color: '#92c9a4' // primary green / 70% opacity
      }}>
        Thank you for your patience! You will be redirected here after successful new user authentication.
      </p>
    </div>
  );
};

export default OnboardingPlaceholderPage;
