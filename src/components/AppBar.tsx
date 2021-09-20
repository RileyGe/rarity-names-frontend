import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import { Popover } from '@headlessui/react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

function AppBar(): JSX.Element {
    const { library } = useActiveWeb3React()

    return (
        <header className="flex-shrink-0 w-full text-white">
            <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
                {({ open }) => (
                    <>
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center uppercase">
                                    <a
                                        href={'/'}
                                        className="uppercase text-xl p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                                    >
                                        <h1>Rarity swap</h1>{' '}
                                    </a>
                                </div>
                                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 lg:w-auto bg-custom-background lg:relative lg:p-0 lg:bg-transparent">
                                    {/*<a className="mx-2 text-3xl" href="https://twitter.com/RarityGame">*/}
                                    {/*    <FontAwesomeIcon icon={faTwitter} />*/}
                                    {/*</a>*/}
                                    {/*<a className="mx-2 text-3xl" href="https://discord.gg/NUrfGsUkmd">*/}
                                    {/*    <FontAwesomeIcon icon={faDiscord} />*/}
                                    {/*</a>*/}
                                    {/*<a className="mx-2 text-3xl" href="https://github.com/rarity-adventure">*/}
                                    {/*    <FontAwesomeIcon icon={faGithub} />*/}
                                    {/*</a>*/}
                                    <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                                        {library && library.provider.isMetaMask && (
                                            <div className="hidden sm:inline-block">
                                                <Web3Network />
                                            </div>
                                        )}

                                        <div className="w-auto flex items-center rounded bg-custom-background p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                                            <Web3Status />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Popover>
        </header>
    )
}

export default AppBar
