import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';
import { BigNumber } from 'ethers';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

export const IMAGES_PER_REQUEST = 20;

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    },
    options: {
      appName: 'Coinbase', // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const {appName, networkUrl, chainId} = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

// export const RPC_URL = 'https://data-seed-prebsc-2-s3.binance.org:8545';    //// BSC TEST NETWORK RPC
export const RPC_URL = 'https://bsc-dataseed.binance.org';    //// BSC MAIN NETWORK RPC

