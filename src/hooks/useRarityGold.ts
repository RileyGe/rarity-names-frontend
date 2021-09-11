import {useMulticall2Contract, useRarityGoldContract} from "./useContract";
import {useCallback} from "react";
import {BigNumber} from "ethers";

interface GoldInterface {
    allowance: (spender: string) => Promise<number>
    summoners_balances: (ids: string[]) => Promise<{id: string, balance: BigNumber}[]>
}

export default function useRarityGold(): GoldInterface {
    const gold = useRarityGoldContract()

    const multicall = useMulticall2Contract()

    const allowance = useCallback( async (spender: string): Promise<number> => {
          try {
              return gold?.allowance(spender)
          } catch (e) {
              return 0
          }
      },
      [gold, multicall]
    )

    const summoners_balances = useCallback(
      async (ids: string[]): Promise<{id: string, balance: BigNumber}[]> => {
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

    return { summoners_balances, allowance }
}