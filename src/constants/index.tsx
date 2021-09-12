import Fantom from '../assets/networks/fantom-network.jpg'

export enum ChainId {
    MAINNET = 250,
}

export const SHOP_OWNER = '1672924'

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

export const RARITY_NAME_CONTRACT = {
    [ChainId.MAINNET]: '0xE1Ef5bbF7E85d68753897924556AD0aDb6cf5D6a',
}

export function calcAPCost(score: number): number {
    if (score <= 14) {
        return score - 8
    } else {
        return Math.floor((score - 8) ** 2 / 6)
    }
}
