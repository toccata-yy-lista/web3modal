import { getWeb3Modal } from '@lista-wallet/scaffold-vue'
import type { Web3ModalOptions, CoreConfig } from '../src/client.js'
import { Web3Modal } from '../src/client.js'
import { ConstantsUtil } from '@lista-wallet/scaffold-utils'

// -- Types -------------------------------------------------------------------
export type { Web3ModalOptions } from '../src/client.js'

// -- Setup -------------------------------------------------------------------
let modal: Web3Modal | undefined = undefined

export function createWeb3Modal(options: Web3ModalOptions<CoreConfig>) {
  if (!modal) {
    modal = new Web3Modal({
      ...options,
      _sdkVersion: `vue-wagmi-${ConstantsUtil.VERSION}`
    })
    getWeb3Modal(modal)
  }

  return modal
}

// -- Composites --------------------------------------------------------------
export {
  useWeb3ModalTheme,
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalEvents
} from '@lista-wallet/scaffold-vue'

// -- Universal Exports -------------------------------------------------------
export { defaultWagmiConfig } from '../src/utils/defaultWagmiCoreConfig.js'
