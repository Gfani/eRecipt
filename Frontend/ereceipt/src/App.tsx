import { useState } from 'react';
import { MerchantRegistration } from './features/merchant-registration';
import { Audit } from './features/audit';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'registration' | 'audit'>('audit');

  return (
    <div className="app-container">
      {/* Floating feature switcher */}
      <aside className="view-switcher-pill" aria-label="Feature navigation">
        <button
          type="button"
          className={`switcher-btn ${currentView === 'registration' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('registration')}
        >
          Merchant Registration
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'audit' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('audit')}
        >
          Audit
        </button>
      </aside>

      {currentView === 'registration' ? (
        <MerchantRegistration
          onSignInClick={() => setCurrentView('audit')}
          onHomeClick={() => setCurrentView('audit')}
        />
      ) : (
        <Audit
          onNavigate={(screen) => {
            if (screen === 'registration') setCurrentView('registration');
          }}
        />
      )}
    </div>
  );
}

export default App;
