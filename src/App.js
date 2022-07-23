import logo from './logo.svg';
import './App.css';

import './assets/scss/custom.scss';
import Views from './views';
import 'rsuite/dist/rsuite.min.css';

import { CookiesProvider } from 'react-cookie';
import { ToastProvider } from 'react-toast-notifications';
import AppContextProvider from './context/AppContext';
import UserContextProvider from './context/UserContext';
import StateContextProvider from './components/Providers';
import LocalizationContextProvider from './context/LocalizationContext';

function App() {
  return (
    <div className="App">
      <LocalizationContextProvider>
        <StateContextProvider>
          <ToastProvider
            autoDismiss
            autoDismissTimeout={6000}
            placement="top-right"
          >
            <CookiesProvider>
              <AppContextProvider>
                <UserContextProvider>
                  <Views />
                </UserContextProvider>
              </AppContextProvider>
            </CookiesProvider>
          </ToastProvider>
        </StateContextProvider>
     </LocalizationContextProvider>
    </div>
  );
}

export default App;
