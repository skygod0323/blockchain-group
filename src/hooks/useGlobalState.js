import { useContext } from 'react';
import { StateContext } from '../components/Providers';

const useGlobalState = () => {
  const stateContext = useContext(StateContext);
  if (stateContext === undefined) {
    throw new Error('Global context undefined');
  }
  return stateContext.state;
}

export default useGlobalState;
