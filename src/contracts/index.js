
import { Contract, providers } from 'ethers';
import { RPC_URL } from '../consts';

import MEMBER_ABI from './member.json';
import MODULE1_ABI from './module1.json';

// const MEMVER_CONTRACT_ADDRESS = '0x6b2a84871E3241114cD4A759fD0087075a3Da983'; // BSC TEST NETWORK
// const MODULE1_CONTRACT_ADDRESS = '0x0cc0DbF27B6004A00C1BFE8B1aC952e0F3f9e6DD'   // BSC TEST NETWORK

const MEMVER_CONTRACT_ADDRESS = '0x3a08f129d11F5C12D2913D2DE101EaE1a12a8C15'; // BSC MAIN NETWORK
const MODULE1_CONTRACT_ADDRESS = '0xDeA1546Df7ccC3f65001d84c6C83bb78c0D93E7a'   // BSC MAIN NETWORK


export const getMemberContract = (signer = null) => {
    const signerOrProvider = signer ?? new providers.JsonRpcProvider(RPC_URL);
    return new Contract(MEMVER_CONTRACT_ADDRESS, MEMBER_ABI, signerOrProvider)
}

export const getModule1Contract = (signer = null) => {
    const signerOrProvider = signer ?? new providers.JsonRpcProvider(RPC_URL);
    return new Contract(MODULE1_CONTRACT_ADDRESS, MODULE1_ABI, signerOrProvider)
}