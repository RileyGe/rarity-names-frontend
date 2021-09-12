import { useMulticall2Contract, useRarityNameContract } from './useContract'
import { useCallback } from 'react'

interface NamesInterface {
    claim: (name: string, summoner: string) => Promise<void>
    summoner_name: (id: string) => Promise<string>
    multicall_summoner_name: (ids: string[]) => Promise<string[]>
}

export default function useRarityName(): NamesInterface {
    const name = useRarityNameContract()

    const multicall = useMulticall2Contract()

    const claim = useCallback(
        async (_name: string, summoner): Promise<void> => {
            try {
                return await name?.claim(_name, summoner)
            } catch (e) {
                return
            }
        },
        [name]
    )

    const summoner_name = useCallback(
        async (id: string): Promise<string> => {
            try {
                return await name?.summoner_name(id)
            } catch (e) {
                return ''
            }
        },
        [name]
    )

    const multicall_summoner_name = useCallback(
        async (ids: string[]): Promise<string[]> => {
            try {
                const fragment = name?.interface?.getFunction('summoner_name')
                if (fragment) {
                    const call = ids.map((id) => {
                        return {
                            target: name?.address,
                            callData: name?.interface.encodeFunctionData(fragment, [id]),
                        }
                    })
                    const result = await multicall?.callStatic.tryAggregate(true, call)
                    return result.map((r: any, i: number) => {
                        return { id: ids[i], name: name?.interface.decodeFunctionResult(fragment, r.returnData).name }
                    })
                } else {
                    return []
                }
            } catch (e) {
                return []
            }
        },
        [name, multicall]
    )

    return { summoner_name, multicall_summoner_name, claim }
}
