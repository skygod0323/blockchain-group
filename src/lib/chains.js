export const CHAIN_ID_ETHEREUM = 1;
export const CHAIN_ID_ETHEREUM_HEX = '0x1';
export const CHAIN_ID_BSC_TESTNET = 97;
export const CHAIN_ID_BSC_TESTNET_HEX = '0x61';
export const CHAIN_ID_RINKEBY_TESTNET = 4;
export const CHAIN_ID_RINKEBY_TESTNET_HEX = '0x4';
export const CHAIN_ID_BSC_MAINNET = 56;
export const CHAIN_ID_BSC_MAINNET_HEX = '0x38';


// export const DEFAULT_CHAIN_ID = CHAIN_ID_ETHEREUM;
// export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_ETHEREUM_HEX;
// export const DEFAULT_CHAIN_ID = CHAIN_ID_RINKEBY_TESTNET;
// export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_RINKEBY_TESTNET_HEX;

// export const DEFAULT_CHAIN_ID = CHAIN_ID_BSC_MAINNET;
// export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_BSC_MAINNET_HEX;

// export const DEFAULT_CHAIN_ID = CHAIN_ID_BSC_TESTNET;
// export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_BSC_TESTNET_HEX;

export const DEFAULT_CHAIN_ID = CHAIN_ID_BSC_MAINNET;
export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_BSC_MAINNET_HEX;


const supportedChains = [
  {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    rpc_url: 'https://rinkeby.infura.io/v3/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Binance Smart Chain',
    short_name: 'bsc',
    chain: 'smartchain',
    network: 'mainnet',
    chain_id: 56,
    network_id: 56,
    rpc_url: 'https://bsc-dataseed1.defibit.io/',
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
]

export default supportedChains
