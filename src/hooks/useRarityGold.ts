import { useMulticall2Contract, useRarityGoldContract } from './useContract'
import { useCallback } from 'react'
import { BigNumber } from 'ethers'

interface GoldInterface {
    approve: (from: string, spender: string, amount: string) => Promise<boolean>
    allowance: (from: string, spender: string) => Promise<number>
    summoners_balances: (ids: string[]) => Promise<{ id: string; balance: BigNumber }[]>
}

export default function useRarityGold(): GoldInterface {
    const gold = useRarityGoldContract()

    const multicall = useMulticall2Contract()

    const approve = useCallback(
        async (from: string, spender: string, amount: string): Promise<boolean> => {
            try {
                const tx = await gold?.approve(from, spender, amount)
                return tx.wait()
            } catch (e) {
                return false
            }
        },
        [gold]
    )
    const allowance = useCallback(
        async (from: string, spender: string): Promise<number> => {
            try {
                return gold?.allowance(from, spender)
            } catch (e) {
                return 0
            }
        },
        [gold]
    )

    const summoners_balances = useCallback(
        async (ids: string[]): Promise<{ id: string; balance: BigNumber }[]> => {
            try {
                const fragment = gold?.interface?.getFunction('balanceOf')
                if (fragment) {
                    const call = ids.map((id) => {
                        return {
                            target: gold?.address,
                            callData: gold?.interface.encodeFunctionData(fragment, [id]),
                        }
                    })
                    const result = await multicall?.callStatic.tryAggregate(true, call)
                    return result.map((r: any, i: number) => {
                        return { id: ids[i], balance: gold?.interface.decodeFunctionResult(fragment, r.returnData)[0] }
                    })
                } else {
                    return []
                }
            } catch (e) {
                return []
            }
        },
        [gold, multicall]
    )

    return { summoners_balances, allowance, approve }
}
