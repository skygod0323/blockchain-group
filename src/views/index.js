import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainLayout from './layout/main';
import PageNotFound from './pages/notfound';

import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';

import useGlobalState from '../hooks/useGlobalState';
import { useToasts } from 'react-toast-notifications';
import PageHome from './pages/home';
import { getMemberContract } from '../contracts';
import { useLocalizationContext } from '../context/LocalizationContext';


function Views(props) {
  const {t} = useLocalizationContext()
  const { loading, message, setMessage, modal, setModal } = useAppContext();
  const {setUserInfo, setLoadingUserInfo} = useUserContext();
  const { web3Provider, address } = useGlobalState();
  const { addToast } = useToasts();

  useEffect(() => {
    const getMemberData = async () => {
      console.log('web3 provider change');
      setLoadingUserInfo(true);
      try {
        if (web3Provider && address) {
          const memberContract =  getMemberContract(web3Provider.getSigner());
          const isJoined = await memberContract.checkJoined(address);
          const member_res = await memberContract.getMemberByAddress(address);
          const isAdmin = await memberContract.isAuthorized(address);

          console.log('member info: ', member_res);

          //// check join status
          if (isJoined) {

            const _userInfo = {
              addr: member_res.addr,
              name: member_res.name,
              joined: true,
              activated: member_res.activated,
              isAdmin
            }

            console.log('set userInfo: ', _userInfo);
            setUserInfo(_userInfo);
          } else {
            setUserInfo(false);
          }

          setLoadingUserInfo(false);
        } else {
          setLoadingUserInfo(false);
          setUserInfo(false);
        }
      } catch (error) {
        setLoadingUserInfo(false);
        addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
      }
      
    }
    
    getMemberData();

  }, [address, web3Provider]);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<PageHome/>} />
          <Route path='/*' element={<MainLayout/>} />
          {/* <Route path='/auth/*'  element={<AuthLayout/>} /> */}
          <Route path='*'  element={<PageNotFound/>} />
        </Routes>
      </Router>
    </>
  );
}

export default Views;