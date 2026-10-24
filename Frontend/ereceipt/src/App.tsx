import { useState, useEffect } from 'react';
import { LandingPage } from './features/Landing';
import { MerchantRegistration } from './features/merchant-registration';
import { LoginForm } from './features/auth';
import { Audit } from './features/audit';
import { Admin } from './features/admin';
import { ReceiptIssuance } from './features/receipt-issuance';
import { ReceiptVerification } from './features/verification';
import './App.css';

type AppView =
  | 'landing'
  | 'signin'
  | 'login'
  | 'receipt-issuance'
  | 'merchant'
  | 'audit'
  | 'admin'
  | 'registration'
  | 'verify';

function parseUrlState(): { view: AppView; merchantScreen: string } {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');
  const screenParam = params.get('screen');

  if (viewParam === 'verify' || window.location.pathname.startsWith('/verify') || params.get('irn')) {
    return { view: 'verify', merchantScreen: 'dashboard' };
  }
  if (viewParam === 'login' || viewParam === 'signin') {
    return { view: 'signin', merchantScreen: 'dashboard' };
  }
  if (viewParam === 'registration' || viewParam === 'register') {
    return { view: 'registration', merchantScreen: 'dashboard' };
  }
  if (viewParam === 'admin') {
    return { view: 'admin', merchantScreen: 'dashboard' };
  }
  if (viewParam === 'receipt-issuance' || viewParam === 'pos') {
    return { view: 'receipt-issuance', merchantScreen: 'dashboard' };
  }
  if (
    viewParam === 'merchant' ||
    viewParam === 'audit' ||
    viewParam === 'settings' ||
    viewParam === 'invoice' ||
    viewParam === 'dashboard' ||
    viewParam === 'sales' ||
    viewParam === 'transactions' ||
    viewParam === 'overview'
  ) {
    let screen = screenParam || 'dashboard';
    if (viewParam === 'invoice' || screenParam === 'receipt') screen = 'receipt';
    else if (viewParam === 'settings') screen = 'settings';
    else if (viewParam === 'sales' || viewParam === 'transactions') screen = 'sales';
    else if (viewParam === 'audit') screen = 'audit';
    else if (viewParam === 'dashboard' || viewParam === 'overview') screen = 'dashboard';

    return { view: 'merchant', merchantScreen: screen };
  }

  return { view: 'landing', merchantScreen: 'dashboard' };
}

function App() {
  const initialState = parseUrlState();
  const [currentView, setCurrentView] = useState<AppView>(initialState.view);
  const [merchantScreen, setMerchantScreen] = useState<string>(initialState.merchantScreen);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const state = parseUrlState();
      setCurrentView(state.view);
      setMerchantScreen(state.merchantScreen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (screen: string, pushHistory = true) => {
    let targetView: AppView = 'landing';
    let targetMerchantScreen = 'dashboard';
    let urlQuery = '';

    if (screen === 'landing' || screen === 'home') {
      targetView = 'landing';
      urlQuery = '?view=landing';
    } else if (screen === 'registration' || screen === 'register') {
      targetView = 'registration';
      urlQuery = '?view=registration';
    } else if (screen === 'login' || screen === 'signin' || screen === 'signout' || screen === 'logout') {
      targetView = 'signin';
      urlQuery = '?view=signin';
    } else if (screen === 'admin') {
      targetView = 'admin';
      urlQuery = '?view=admin';
    } else if (screen === 'verify' || screen === 'verification') {
      targetView = 'verify';
      urlQuery = '?view=verify';
    } else if (screen === 'pos' || screen === 'receipt-issuance') {
      targetView = 'receipt-issuance';
      urlQuery = '?view=pos';
    } else if (
      screen === 'merchant' ||
      screen === 'audit' ||
      screen === 'receipt' ||
      screen === 'settings' ||
      screen === 'sales' ||
      screen === 'dashboard'
    ) {
      targetView = 'merchant';
      targetMerchantScreen = screen === 'merchant' ? 'dashboard' : screen;
      urlQuery = `?view=merchant&screen=${targetMerchantScreen}`;
    }

    setCurrentView(targetView);
    setMerchantScreen(targetMerchantScreen);

    if (pushHistory) {
      const newUrl = `${window.location.pathname}${urlQuery}`;
      window.history.pushState({ view: targetView, screen: targetMerchantScreen }, '', newUrl);
    }
  };

  return (
    <div className="app-container">
      {currentView === 'landing' ? (
        <LandingPage
          onNavigate={handleNavigate}
          onSignInClick={() => handleNavigate('signin')}
          onGetStartedClick={() => handleNavigate('registration')}
          onScanReceiptClick={() => handleNavigate('verify')}
          onMerchantPortalClick={() => handleNavigate('dashboard')}
        />
      ) : currentView === 'verify' ? (
        <ReceiptVerification onNavigate={handleNavigate} />
      ) : currentView === 'signin' || currentView === 'login' ? (
        <LoginForm
          onSuccess={() => handleNavigate('dashboard')}
          onLoginSuccess={(_merchant) => handleNavigate('dashboard')}
          onRegisterClick={() => handleNavigate('registration')}
          onNavigateToRegister={() => handleNavigate('registration')}
          onHomeClick={() => handleNavigate('landing')}
          onNavigateToHome={() => handleNavigate('landing')}
          onNavigateHome={() => handleNavigate('landing')}
          onAdminClick={() => handleNavigate('admin')}
        />
      ) : currentView === 'receipt-issuance' ? (
        <ReceiptIssuance onNavigate={handleNavigate} />
      ) : currentView === 'registration' ? (
        <MerchantRegistration
          onSignInClick={() => handleNavigate('signin')}
          onHomeClick={() => handleNavigate('landing')}
        />
      ) : currentView === 'admin' ? (
        <Admin onReturnToMerchant={(screen) => handleNavigate(screen || 'dashboard')} />
      ) : (
        <Audit initialScreen={merchantScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
