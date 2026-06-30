import { useEffect, useRef } from 'react';

function GoogleButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '232273623767-rghiq4roq6d5sncuhn3ormobupdr3him.apps.googleusercontent.com',
          callback: (response) => {
            if (onSuccess) onSuccess(response);
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: buttonRef.current.offsetWidth,
        });
      }
    };

    if (window.google && window.google.accounts) {
      initGoogle();
    } else {
      window.addEventListener('load', initGoogle);
    }

    return () => window.removeEventListener('load', initGoogle);
  }, []);

  return <div ref={buttonRef} id="googleSignInButton"></div>;
}

export default GoogleButton;