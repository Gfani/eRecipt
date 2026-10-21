import { useState } from 'react';
import { MerchantRegistration } from './features/merchant-registration';
import { Audit } from './features/audit';
import { ReceiptIssuance } from './features/receipt-issuance';
import './App.css';

type AppView = 'receipt-issuance' | 'audit' | 'registration';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('receipt-issuance');

  const handleNavigate = (screen: string) => {
    if (screen === 'registration') {
      setCurrentView('registration');
    } else if (screen === 'audit') {
      setCurrentView('audit');
    } else if (screen === 'pos' || screen === 'receipt-issuance' || screen === 'receipt') {
      setCurrentView('receipt-issuance');
    }
  };

  return (
    <div className="app-container">
      {/* Floating feature switcher */}
      <aside className="view-switcher-pill" aria-label="Feature navigation">
        <button
          type="button"
          className={`switcher-btn ${currentView === 'receipt-issuance' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('receipt-issuance')}
        >
          Issue Receipt (My Part)
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'audit' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('audit')}
        >
          Audit
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'registration' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('registration')}
        >
          Merchant Registration
        </button>
      </aside>

      {currentView === 'receipt-issuance' ? (
        <ReceiptIssuance onNavigate={handleNavigate} />
      ) : currentView === 'registration' ? (
        <MerchantRegistration
          onSignInClick={() => setCurrentView('audit')}
          onHomeClick={() => setCurrentView('receipt-issuance')}
        />
      ) : (
        <Audit onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
