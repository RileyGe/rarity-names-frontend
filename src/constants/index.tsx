import Fantom from '../assets/networks/fantom-network.jpg'

export enum ChainId {
    MAINNET = 250,
}

export const SHOP_OWNER = "1672924"

export const NETWORK_ICON = {
    [ChainId.MAINNET]: Fantom,
}

export const GOLD_CONTRACTS = {
    [ChainId.MAINNET]: '0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2',
}

export const MULTICALL2_ADDRESS = '0x5f28e9fca1c34b2dd44630df26fc7aa3d3f35eb9'

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
    [ChainId.MAINNET]: 'Fantom',
}

export const NAME = 'name'
export const SYMBOL = 'symbol'
export const DECIMALS = 'decimals'

export const TOKENS: { [k: string]: { [NAME]: string; [SYMBOL]: string; [DECIMALS]: number } } = {
    '0x83DA2674037d0BC070c3108D42e0595d84a1CC18': {
        [NAME]: 'Rarity Crowns',
        [SYMBOL]: 'CROWNS',
        [DECIMALS]: 18,
    },
    '0xEc79983a0711D2C64e671ce56b64483875789008': {
        [NAME]: 'Rarity Gold',
        [SYMBOL]: 'GOLD',
        [DECIMALS]: 18,
    },
}

export function calcAPCost(score: number): number {
    if (score <= 14) {
        return score - 8
    } else {
        return Math.floor((score - 8) ** 2 / 6)
    }
}
