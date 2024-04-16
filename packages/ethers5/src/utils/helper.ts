import type { Provider } from '@lista-wallet/scaffold-utils/ethers'

interface TrustProvider extends Provider {
  off: <T>(event: string, listener: (data: T) => void) => void
}

export function isTrustProvider(provider: Provider): provider is TrustProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (provider as any).isTrust || (provider as any).isTrustWallet
}
