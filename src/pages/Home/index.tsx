import sword from '../../assets/images/sword.png'
import { useUserSummoners } from '../../state/user/hooks'
import useRarityGold from "../../hooks/useRarityGold";
import {useCallback, useEffect, useState} from "react";

export default function Home(): JSX.Element | null {
    const summoners = useUserSummoners()
    console.log(summoners)

    const { summoners_balances } = useRarityGold()

    const [shopAllowance, _1] = useState(0)

    const [allowedSummoners, setAllowedSummoners ] = useState<string[]>([])

    const fetch_balances = useCallback( async () => {
        const balances = await summoners_balances(summoners.map((s) => {return s.id}))
        const filtered = balances.filter( (s) => s.balance.gte(200))
        setAllowedSummoners(filtered.map((s) => {return s.id}))
    }, [summoners])


    useEffect( () => {
        fetch_balances()
    })

 /*   const fetch_allowance = useCallback( async () => {
        const allowed = await allowance(SHOP_OWNER)
        setShopAllowance(allowed)
    }, [allowance])

    useEffect( () => {
        fetch_allowance()
    })*/

/*
    const [option, setOption] = useState('0')
*/
    return (
        <>
            <div className="w-full mb-4">
                <img alt="sword" src={sword} className="mx-auto w-16 -mt-4 md:w-32" />
                <h1 className="w-full text-x text-white my-4 text-center text-4xl">Rarity Names Shop</h1>
            </div>
            <div className="w-full bg-custom-blue text-center h-screen p-4">
{/*
                <span className="w-full text-x text-white my-4 text-center text-xl">What do you want to do?</span>
*/}
                <div className="md:flex w-full md:w-2/4 mx-auto justify-between items-center mt-8">
                    {/*<div className="mx-auto my-2 w-3/4 md:w-2/5">
                        <button
                            className="w-full bg-custom-green border-4 rounded-lg text-white p-2 text-2xl"
                            onClick={() => setOption('1')}
                        >
                            Buy a name
                        </button>
                    </div>
                    <div className="mx-auto my-2 w-3/4 md:w-2/5">
                        <button
                            className="w-full bg-custom-green border-4 rounded-lg text-white p-2 text-2xl"
                            onClick={() => setOption('2')}
                        >
                            Assign a name
                        </button>
                    </div>*/}
                </div>
{/*
                {option === '1' && (
*/}
                    <div className="bg-custom-green border-4 border-white w-3/4 mx-auto mt-8">
                        <div className="text-white my-4">
                            <p>Buy a rarity name for your summoner</p>
                        </div>
                        <div className="text-white my-4">
                            <p>Only summoners with more than 200 GOLD can buy a name</p>
                        </div>
                        <div className="text-white my-4">
                            <span>Select a summoner</span>
                        </div>
                        <div className="text-white my-4">Select your name</div>
                        <div className="text-white my-4">
                            { shopAllowance > 200
                              ? (
                                <button className="px-8 bg-custom-selected border-4 rounded-lg text-white p-2 text-2xl">
                                    Buy
                                </button>
                              )
                              : (
                                <button className="px-8 bg-custom-selected border-4 rounded-lg text-white p-2 text-2xl">
                                    Approve
                                </button>
                              )
                            }

                        </div>
                    </div>
               {/* )}
                {option === '2' && <div>Assign names</div>}*/}
            </div>
        </>
    )
}
