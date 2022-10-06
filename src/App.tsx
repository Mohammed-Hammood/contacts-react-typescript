import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ContactDetailPage, HomePage, AuthenticationPage, ProfilePage, Error404Page } from './pages';
import { ScrollToTop, Header, Footer } from './components';
import { useAuthentication } from './hooks';
import Modal from './modals';
import './styles/common/global.scss';


function App() {
  // const hostname_: string = "https://apifrontend.pythonanywhere.com"; production
  // const hostname: string = "http://127.0.0.1:8000"; development
  const hostname = "https://apifrontend.pythonanywhere.com";
  const { loading, errors } = useAuthentication({ hostname });
  if (loading && !errors.error) return (<div className='loader'></div>)

  return (<>
    <Header />
    <Modal hostname={hostname} />
    <Routes>
      <Route path='/' element={<HomePage source='home' hostname={hostname} />} />
      <Route path='/login' element={<AuthenticationPage hostname={hostname} />} />
      <Route path='/profile' element={<ProfilePage hostname={hostname} />} />
      <Route path='/contact/:contactId' element={<ContactDetailPage hostname={hostname} />} />
      <Route path={`/search=:q`} element={<HomePage source='search' hostname={hostname} />} />
      <Route path='*' element={<Error404Page />} />
    </Routes>
    <ScrollToTop />
    <Footer />
  </>);
}

export default App;
