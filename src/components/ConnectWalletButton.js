import Web3Modal from 'web3modal';
import { providerOptions } from '../consts.js';
import { useCallback, useEffect } from 'react';
import { providers } from 'ethers';
import useGlobalState from '../hooks/useGlobalState';
import useDispatch from '../hooks/useDispatch';
import { DEFAULT_CHAIN_ID, DEFAULT_CHAIN_ID_HEX } from '../lib/chains.js';
import { useLocalizationContext } from '../context/LocalizationContext.js';

const networks = {
  //// BNB Main Network
  56: {
    chainId: `0x38`,
    chainName: 'BNB Main Network',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [
      'https://bsc-dataseed.binance.org'
    ],
    blockExplorerUrls: [`https://bscscan.com/`],
  },
  97: {
    chainId: `0x61`,
    chainName: 'BNB Test Network',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [
      'https://data-seed-prebsc-2-s1.binance.org:8545'
    ],
    blockExplorerUrls: [`https://testnet.bscscan.com/`],
  }

}
  

const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  });

function ConnectWalletButton() {
  const { provider, web3Provider, chainId } = useGlobalState()
  const dispatch = useDispatch()
  const {t} = useLocalizationContext()

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    })
  }, [dispatch])

  const setupNetwork = async () => {
    if (provider && chainId !== DEFAULT_CHAIN_ID) {
      if (window && window.ethereum) {
        try {
          await window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: DEFAULT_CHAIN_ID_HEX }]});  
        } catch (switchError) {
          if ((switchError)?.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  // {
                  //   chainId: `0x${chainId.toString(16)}`,
                  //   chainName: NETWORK_CONFIG[chainId].name,
                  //   nativeCurrency: {
                  //     name: 'BNB',
                  //     symbol: 'bnb',
                  //     decimals: 18,
                  //   },
                  //   rpcUrls: nodes,
                  //   blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
                  // },
                  networks[DEFAULT_CHAIN_ID]
                ],
              })
            } catch (error) {
              console.error('Failed to setup the network in Metamask:', error)
            }
          }
          return false
        }
      } else {
        console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
        return false
      }
       
    }
  }

  useEffect(() => {
    setupNetwork();
  }, [chainId, provider])

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  )

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload()
      }

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect, dispatch])

  return web3Provider ? (
    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={disconnect}>{t('Disconnect')}</button>
  ) : (
    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={connect}>{t('Connect')}</button>
  )
}

export default ConnectWalletButton;
