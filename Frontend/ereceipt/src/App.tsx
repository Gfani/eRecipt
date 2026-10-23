import { useState } from 'react';
import { LandingPage } from './features/Landing';
import { LoginForm } from './features/auth';
import { MerchantRegistration } from './features/merchant-registration';
import { Audit } from './features/audit';
import { Admin } from './features/admin';
import { ReceiptIssuance } from './features/receipt-issuance';
import './App.css';

type AppView = 'landing' | 'signin' | 'registration' | 'merchant' | 'receipt-issuance' | 'admin';

function App() {
  const getInitialView = (): AppView => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'signin' || viewParam === 'login') return 'signin';
    if (viewParam === 'registration') return 'registration';
    if (viewParam === 'admin') return 'admin';
    if (viewParam === 'receipt-issuance' || viewParam === 'pos') return 'receipt-issuance';
    if (viewParam === 'merchant' || viewParam === 'audit' || viewParam === 'settings' || viewParam === 'invoice')
      return 'merchant';
    if (viewParam === 'landing' || viewParam === 'home') return 'landing';
    return 'landing'; // Starts from Landing page by default
  };

  const getInitialMerchantScreen = (): string => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'invoice') return 'receipt';
    if (viewParam === 'settings') return 'settings';
    if (viewParam === 'audit') return 'audit';
    if (viewParam === 'pos' || viewParam === 'receipt-issuance') return 'pos';
    if (viewParam === 'sales' || viewParam === 'transactions') return 'sales';
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [merchantScreen, setMerchantScreen] = useState<string>(getInitialMerchantScreen);

  const handleNavigate = (screen: string) => {
    if (screen === 'landing' || screen === 'home') {
      setCurrentView('landing');
    } else if (screen === 'signin' || screen === 'login') {
      setCurrentView('signin');
    } else if (screen === 'registration') {
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
          className={`switcher-btn ${currentView === 'landing' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('landing')}
        >
          Landing Page
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'signin' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('signin')}
        >
          Merchant Sign In
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'registration' ? 'switcher-btn-active' : ''}`}
          onClick={() => setCurrentView('registration')}
        >
          Merchant Registration
        </button>
        <button
          type="button"
          className={`switcher-btn ${currentView === 'merchant' ? 'switcher-btn-active' : ''}`}
          onClick={() => {
            setCurrentView('merchant');
            setMerchantScreen('dashboard');
          }}
        >
          Merchant Overview
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
          Revenue Admin
        </button>
      </aside>

      {currentView === 'landing' ? (
        <LandingPage
          onSignInClick={() => setCurrentView('signin')}
          onGetStartedClick={() => setCurrentView('registration')}
          onScanReceiptClick={() => setCurrentView('receipt-issuance')}
          onMerchantPortalClick={() => {
            setCurrentView('merchant');
            setMerchantScreen('dashboard');
          }}
        />
      ) : currentView === 'signin' ? (
        <LoginForm
          onRegisterClick={() => setCurrentView('registration')}
          onHomeClick={() => setCurrentView('landing')}
          onSuccess={() => {
            setCurrentView('merchant');
            setMerchantScreen('dashboard');
          }}
        />
      ) : currentView === 'receipt-issuance' ? (
        <ReceiptIssuance onNavigate={handleNavigate} />
      ) : currentView === 'registration' ? (
        <MerchantRegistration
          onSignInClick={() => setCurrentView('signin')}
          onHomeClick={() => setCurrentView('landing')}
        />
      ) : currentView === 'admin' ? (
        <Admin onReturnToMerchant={(screen) => handleNavigate(screen || 'audit')} />
      ) : (
        <Audit initialScreen={merchantScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
