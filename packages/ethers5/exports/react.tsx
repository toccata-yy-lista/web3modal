'use client'

import type { Web3ModalOptions } from '../src/client.js'
import { Web3Modal } from '../src/client.js'
import { ConstantsUtil } from '@lista-wallet/scaffold-utils'
import { EthersStoreUtil } from '@lista-wallet/scaffold-utils/ethers'
import { getWeb3Modal } from '@lista-wallet/scaffold-react'
import { useSnapshot } from 'valtio'
import { ethers } from 'ethers'

// -- Types -------------------------------------------------------------------
export type { Web3ModalOptions } from '../src/client.js'

// -- Setup -------------------------------------------------------------------
let modal: Web3Modal | undefined = undefined

export function createWeb3Modal(options: Web3ModalOptions) {
  if (!modal) {
    modal = new Web3Modal({
      ...options,
      _sdkVersion: `react-ethers5-${ConstantsUtil.VERSION}`
    })
  }
  getWeb3Modal(modal)

  return modal
}

// -- Hooks -------------------------------------------------------------------
export function useWeb3ModalProvider() {
  const { provider, providerType } = useSnapshot(EthersStoreUtil.state)

  const walletProvider = provider as ethers.providers.ExternalProvider | undefined
  const walletProviderType = providerType

  return {
    walletProvider,
    walletProviderType
  }
}

export function useDisconnect() {
  async function disconnect() {
    await modal?.disconnect()
  }

  return {
    disconnect
  }
}

export function useSwitchNetwork() {
  async function switchNetwork(chainId: number) {
    await modal?.switchNetwork(chainId)
  }

  return {
    switchNetwork
  }
}

export function useWeb3ModalAccount() {
  const { address, isConnected, chainId } = useSnapshot(EthersStoreUtil.state)

  return {
    address,
    isConnected,
    chainId
  }
}

export function useWeb3ModalError() {
  const { error } = useSnapshot(EthersStoreUtil.state)

  return {
    error
  }
}

export {
  useWeb3ModalTheme,
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalEvents
} from '@lista-wallet/scaffold-react'

// -- Universal Exports -------------------------------------------------------
export { defaultConfig } from '../src/utils/defaultConfig.js'
