import { useState, useEffect } from 'react';
import { LandingPage } from './features/Landing';
import { MerchantRegistration } from './features/merchant-registration';
import { LoginForm } from './features/auth';
import { Audit } from './features/audit';
import { Admin } from './features/admin';
import { ReceiptIssuance } from './features/receipt-issuance';
import './App.css';

type AppView =
  | 'landing'
  | 'signin'
  | 'login'
  | 'receipt-issuance'
  | 'merchant'
  | 'audit'
  | 'admin'
  | 'registration';

const SESSION_VIEW_KEY = 'ereceipt_active_view';
const SESSION_SCREEN_KEY = 'ereceipt_active_screen';

function parseUrlState(): { view: AppView; merchantScreen: string } {
  const pathname = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const viewParam = (params.get('view') || '').toLowerCase();
  const screenParam = (params.get('screen') || '').toLowerCase();

  const savedView = window.sessionStorage.getItem(SESSION_VIEW_KEY) as AppView | null;
  const savedScreen = window.sessionStorage.getItem(SESSION_SCREEN_KEY) || 'dashboard';

  // 1. Pathname-based detection (e.g. /admin, /registration, /signin, /merchant/*)
  if (pathname.includes('/admin')) {
    return { view: 'admin', merchantScreen: 'dashboard' };
  }
  if (pathname.includes('/registration') || pathname.includes('/register')) {
    return { view: 'registration', merchantScreen: 'dashboard' };
  }
  if (pathname.includes('/signin') || pathname.includes('/login')) {
    return { view: 'signin', merchantScreen: 'dashboard' };
  }
  if (pathname.includes('/pos') || pathname.includes('/receipt-issuance')) {
    return { view: 'receipt-issuance', merchantScreen: 'dashboard' };
  }
  if (pathname.includes('/merchant') || pathname.includes('/dashboard')) {
    let screen = 'dashboard';
    if (pathname.includes('/settings')) screen = 'settings';
    else if (pathname.includes('/transactions') || pathname.includes('/sales')) screen = 'sales';
    else if (pathname.includes('/audit')) screen = 'audit';
    else if (pathname.includes('/receipt') || pathname.includes('/invoice')) screen = 'receipt';
    else if (pathname.includes('/pos')) screen = 'pos';
    else if (screenParam) screen = screenParam;
    else if (savedScreen) screen = savedScreen;

    return { view: 'merchant', merchantScreen: screen };
  }

  // 2. Query parameter detection (e.g. ?view=merchant&screen=settings)
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

  // 3. Saved session state on refresh (prevents jumping back to landing)
  if (savedView && savedView !== 'landing') {
    return { view: savedView, merchantScreen: savedScreen };
  }

  // 4. Authenticated session check: if merchant is signed in, retain merchant portal
  const token =
    window.localStorage.getItem('ereceipt_token') ||
    window.localStorage.getItem('merchant_token') ||
    window.sessionStorage.getItem('ereceipt_token');
  if (token) {
    return { view: 'merchant', merchantScreen: savedScreen || 'dashboard' };
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

    // Persist active view and screen so refresh stays right where user is
    window.sessionStorage.setItem(SESSION_VIEW_KEY, targetView);
    window.sessionStorage.setItem(SESSION_SCREEN_KEY, targetMerchantScreen);

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
          onScanReceiptClick={() => handleNavigate('receipt-issuance')}
          onMerchantPortalClick={() => handleNavigate('dashboard')}
        />
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
