import sword from '../../assets/images/sword.png'
import { useUserSummoners } from '../../state/user/hooks'
import useRarityGold from '../../hooks/useRarityGold'
import { useCallback, useEffect, useState } from 'react'
import useRarityName from '../../hooks/useRarityNames'
import { CLASSES } from '../../constants/classes'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { SHOP_OWNER } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Home(): JSX.Element | null {
    const { library, chainId } = useActiveWeb3React()

    const summoners = useUserSummoners()

    const { allowance, summoners_balances, approve } = useRarityGold()

    const [shopAllowance, setShopAllowance] = useState(0)

    const [selectedSummoner, setSelectedSummoner] = useState('')

    const [allowedSummoners, setAllowedSummoners] = useState<string[]>([])

    const { multicall_summoner_name, claim, validate_name, is_name_claimed } = useRarityName()

    const [names, setNames] = useState<{ [k: string]: string }>({})

    const fetch_names = useCallback(async () => {
        const ids = summoners.map((s) => {
            return s.id
        })
        const queryNames = await multicall_summoner_name(ids)
        const namesState = queryNames.reduce(
            (obj: { [k: string]: string }, item: any) => Object.assign(obj, { [item.id]: item.name }),
            {}
        )
        setNames(namesState)
    }, [summoners, multicall_summoner_name])

    useEffect(() => {
        if (!library || !chainId) return
        fetch_names()
    }, [chainId, library, fetch_names])

    const fetch_balances = useCallback(async () => {
        const balances = await summoners_balances(
            summoners.map((s) => {
                return s.id
            })
        )
        const filtered = balances.filter((s) => s.balance.gte(200))
        setAllowedSummoners(
            filtered.map((s) => {
                return s.id
            })
        )
    }, [summoners, summoners_balances])

    useEffect(() => {
        fetch_balances()
    })

    function summonerDataToString(id: string): string {
        const summoner = summoners.find((s) => s.id === id)
        if (!summoner) return ''
        return !names[summoner.id] || names[summoner.id] === ''
            ? parseInt(summoner.id).toString() + ' Level ' + summoner._level + ' ' + CLASSES[summoner._class].name
            : names[summoner.id]
    }

    const fetch_allowance = useCallback(async () => {
        if (selectedSummoner !== '') {
            const allowed = await allowance(selectedSummoner, SHOP_OWNER)
            setShopAllowance(allowed)
        }
    }, [allowance, selectedSummoner])

    useEffect(() => {
        if (!library || !chainId || !allowance) return
        fetch_allowance()
    }, [fetch_allowance, library, chainId, allowance])

    const [claimName, setClaimName] = useState('')

    function choosenName(n: string) {
        setClaimName(n)
    }

    const [approving, setApproving] = useState(false)
    async function approveShop() {
        setApproving(true)
        await approve(selectedSummoner, SHOP_OWNER, '200000000000000000000')
        await fetch_allowance()
        setApproving(false)
    }

    const [claiming, setClaiming] = useState(false)
    async function claimNameFunction() {
        setClaiming(true)
        await claim(claimName, selectedSummoner)
        setClaiming(false)
    }

    const [verifyStatus, setVerify] = useState('')
    const [verifying, setVerifying] = useState(false)
    async function verify() {
        setVerifying(true)
        const calls = []
        calls.push(validate_name(claimName))
        calls.push(is_name_claimed(claimName))
        const responses = await Promise.all(calls)
        setVerify(responses[0] && !responses[1] ? 'Valid' : !responses[0] ? 'Invalid' : 'Unavailable')
        setVerifying(false)
    }

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
                        <p>Get a rarity name for your summoner.</p>
                    </div>
                    <div className="text-white my-4">
                        <p>Only summoners with more than 200 GOLD can buy a name</p>
                    </div>
                    <p className="w-full text-x text-white my-4">Select a summoner</p>
                    <select
                        defaultValue={0}
                        className="p-2 border-custom-green border-4 rounded-lg"
                        onChange={(v) => {
                            if (v.target.value !== '0') {
                                setSelectedSummoner(JSON.parse(v.target.value))
                            }
                        }}
                    >
                        <option value={0}>Select summoner</option>
                        {allowedSummoners.map((summoner) => {
                            return (
                                <option key={summoner} value={JSON.stringify(summoner)}>
                                    {summonerDataToString(summoner)}
                                </option>
                            )
                        })}
                    </select>
                    {selectedSummoner !== '' && (
                        <>
                            <div className="text-white my-4">
                                Select your name for {parseInt(selectedSummoner, 16).toString()}
                            </div>
                            <div className="text-white text-xs w-2/4 mx-auto">
                                <span>
                                    For names you can only use up to 25 chars, letters from a-z lowercase, letters from
                                    A-Z uppercase and numbers between 0 to 9 and spaces are allowed{' '}
                                </span>
                            </div>
                            <div className="text-custom-background text-center my-4summoners_balances">
                                <input
                                    onChange={(v) => choosenName(v.target.value)}
                                    className="border-custom-background border-2 p-2 my-4"
                                />
                                <button
                                    className="bg-custom-selected p-2 mx-1 rounded-lg border-2 border-white text-white"
                                    onClick={() => verify()}
                                >
                                    Verify
                                </button>
                                {verifying && (
                                    <span className="p-2 border-2 rounded-lg border-custom-background bg-custom-selected text-white">
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                    </span>
                                )}
                                {!verifying && verifyStatus !== '' && verifyStatus === 'Valid' ? (
                                    <span className="p-2 border-2 rounded-lg border-custom-background bg-custom-selected text-white">
                                        {verifyStatus}
                                    </span>
                                ) : (!verifying && verifyStatus === 'Invalid') ||
                                  (!verifying && verifyStatus === 'Unavailable') ? (
                                    <span className="p-2 border-2 rounded-lg border-custom-background bg-custom-red text-white">
                                        {verifyStatus}
                                    </span>
                                ) : (
                                    <div />
                                )}
                            </div>
                            <div className="text-white my-4">
                                {shopAllowance > 200 ? (
                                    <button
                                        onClick={() => claimNameFunction()}
                                        className="px-8 bg-custom-selected border-4 rounded-lg text-white p-2 text-2xl"
                                    >
                                        {claiming ?  <FontAwesomeIcon icon={faSpinner} spin /> : <span>Claim</span>}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => approveShop()}
                                        className="px-8 bg-custom-selected border-4 rounded-lg text-white p-2 text-2xl"
                                    >
                                        {approving ? <FontAwesomeIcon icon={faSpinner} spin /> : <span>Approve</span>}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {/* )}
                {option === '2' && <div>Assign names</div>}*/}
            </div>
        </>
    )
}
