import type { CaipNetworkId, Tokens } from '@lista-wallet/core'
import { ConstantsUtil } from './ConstantsUtil.js'

export const HelpersUtil = {
  caipNetworkIdToNumber(caipnetworkId?: CaipNetworkId) {
    return caipnetworkId ? Number(caipnetworkId.split(':')[1]) : undefined
  },

  getCaipTokens(tokens?: Tokens) {
    if (!tokens) {
      return undefined
    }

    const caipTokens: Tokens = {}
    Object.entries(tokens).forEach(([id, token]) => {
      caipTokens[`${ConstantsUtil.EIP155}:${id}`] = token
    })

    return caipTokens
  }
}
