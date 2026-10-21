import { useState } from 'react';
import { MerchantRegistration } from './features/merchant-registration';
import { Audit } from './features/audit';
import { AdminPortal } from './features/admin';
import './App.css';

function App() {
  const getInitialView = (): 'registration' | 'audit' | 'admin' => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'registration') return 'registration';
    if (viewParam === 'audit') return 'audit';
    // Default to admin view since user requested to see the admin page
    return 'admin';
  };

  const [currentView, setCurrentView] = useState<'registration' | 'audit' | 'admin'>(getInitialView);

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
          Audit (Merchant)
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'admin' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('admin')}
        >
          Revenue Admin Portal
        </button>
      </aside>

      {currentView === 'registration' ? (
        <MerchantRegistration
          onSignInClick={() => setCurrentView('audit')}
          onHomeClick={() => setCurrentView('audit')}
        />
      ) : currentView === 'audit' ? (
        <Audit
          onNavigate={(screen) => {
            if (screen === 'registration') setCurrentView('registration');
          }}
        />
      ) : (
        <AdminPortal
          onReturnToMerchant={() => setCurrentView('registration')}
        />
      )}
    </div>
  );
}

export default App;
