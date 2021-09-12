import { Contract } from '@ethersproject/contracts'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'
import { ethers } from 'ethers'
import { getContract } from '../utils'

import MULTICALL2_ABI from '../constants/abis/multicall2.json'
import GOLD_ABI from '../constants/abis/gold.json'
import NAMES_ABI from '../constants/abis/names.json'

import { GOLD_CONTRACTS, MULTICALL2_ADDRESS, RARITY_NAME_CONTRACT } from '../constants'

export function useContract(
    address: string | undefined,
    ABI: ethers.ContractInterface,
    withSignerIfPossible = true
): Contract | null {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useRarityGoldContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? GOLD_CONTRACTS[chainId] : undefined, GOLD_ABI)
}

export function useMulticall2Contract(): Contract | null {
    return useContract(MULTICALL2_ADDRESS, MULTICALL2_ABI, false)
}

export function useRarityNameContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? RARITY_NAME_CONTRACT[chainId] : undefined, NAMES_ABI)
}
