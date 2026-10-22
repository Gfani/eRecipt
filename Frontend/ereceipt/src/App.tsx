import { useState } from 'react';
import { MerchantRegistration } from './features/merchant-registration';
import { Audit } from './features/audit';
import { Admin } from './features/admin';
import { ReceiptIssuance } from './features/receipt-issuance';
import './App.css';

type AppView = 'receipt-issuance' | 'merchant' | 'admin' | 'registration';

function App() {
  const getInitialView = (): AppView => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'registration') return 'registration';
    if (viewParam === 'admin') return 'admin';
    if (viewParam === 'receipt-issuance' || viewParam === 'pos') return 'receipt-issuance';
    if (viewParam === 'merchant' || viewParam === 'audit' || viewParam === 'settings' || viewParam === 'invoice')
      return 'merchant';
    return 'merchant';
  };

  const getInitialMerchantScreen = (): string => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'invoice') return 'receipt';
    if (viewParam === 'settings') return 'settings';
    return 'audit';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [merchantScreen, setMerchantScreen] = useState<string>(getInitialMerchantScreen);

  const handleNavigate = (screen: string) => {
    if (screen === 'registration') {
      setCurrentView('registration');
    } else if (screen === 'admin') {
      setCurrentView('admin');
    } else if (screen === 'pos' || screen === 'receipt-issuance') {
      setCurrentView('receipt-issuance');
    } else if (
      screen === 'audit' ||
      screen === 'receipt' ||
      screen === 'settings' ||
      screen === 'sales' ||
      screen === 'dashboard'
    ) {
      setCurrentView('merchant');
      setMerchantScreen(screen);
    }
  };

  return (
    <div className="app-container">
      {/* Floating feature switcher */}
      <aside className="view-switcher-pill" aria-label="Feature navigation">
        <button
          type="button"
          className={`switcher-btn ${currentView === 'merchant' ? 'switcher-btn-active' : ''}`}
          onClick={() => {
            setCurrentView('merchant');
            setMerchantScreen('audit');
          }}
        >
          Merchant Portal (Audit, Invoices, Settings)
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'receipt-issuance' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('receipt-issuance')}
        >
          Issue Receipt
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'admin' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('admin')}
        >
          Revenue Admin Portal
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
          onSignInClick={() => handleNavigate('audit')}
          onHomeClick={() => handleNavigate('receipt-issuance')}
        />
      ) : currentView === 'admin' ? (
        <Admin
          onReturnToMerchant={(screen) => handleNavigate(screen || 'audit')}
          onNavigateToIssueReceipt={() => handleNavigate('pos')}
        />
      ) : (
        <Audit initialScreen={merchantScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
