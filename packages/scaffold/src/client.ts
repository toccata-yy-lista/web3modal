import type {
  ConnectionControllerClient,
  EventsControllerState,
  NetworkControllerClient,
  NetworkControllerState,
  OptionsControllerState,
  PublicStateControllerState,
  ThemeControllerState,
  ThemeMode,
  ThemeVariables,
  ModalControllerState
} from '@web3modal/core'
import {
  AccountController,
  BlockchainApiController,
  ConnectionController,
  ConnectorController,
  CoreHelperUtil,
  EventsController,
  ModalController,
  NetworkController,
  OptionsController,
  PublicStateController,
  ThemeController,
  SnackController
} from '@web3modal/core'
import { setColorTheme, setThemeVariables } from '@web3modal/ui'
import type { SIWEControllerClient } from '@web3modal/siwe'

// -- Helpers -------------------------------------------------------------------
let isInitialized = false

// -- Types ---------------------------------------------------------------------
export interface LibraryOptions {
  projectId: OptionsControllerState['projectId']
  themeMode?: ThemeMode
  themeVariables?: ThemeVariables
  allWallets?: OptionsControllerState['allWallets']
  includeWalletIds?: OptionsControllerState['includeWalletIds']
  excludeWalletIds?: OptionsControllerState['excludeWalletIds']
  featuredWalletIds?: OptionsControllerState['featuredWalletIds']
  overrideWallets?: OptionsControllerState['overrideWallets']
  defaultChain?: NetworkControllerState['caipNetwork']
  tokens?: OptionsControllerState['tokens']
  termsConditionsUrl?: OptionsControllerState['termsConditionsUrl']
  privacyPolicyUrl?: OptionsControllerState['privacyPolicyUrl']
  customWallets?: OptionsControllerState['customWallets']
  enableAnalytics?: OptionsControllerState['enableAnalytics']
  metadata?: OptionsControllerState['metadata']
  enableOnramp?: OptionsControllerState['enableOnramp']
  enableWalletFeatures?: OptionsControllerState['enableWalletFeatures']
  allowUnsupportedChain?: NetworkControllerState['allowUnsupportedChain']
  _sdkVersion: OptionsControllerState['sdkVersion']
}

export interface ScaffoldOptions extends LibraryOptions {
  networkControllerClient: NetworkControllerClient
  connectionControllerClient: ConnectionControllerClient
  siweControllerClient?: SIWEControllerClient
}

export interface OpenOptions {
  view: 'Account' | 'Connect' | 'Networks' | 'ApproveTransaction'
}

// -- Client --------------------------------------------------------------------
export class Web3ModalScaffold {
  private initPromise?: Promise<void> = undefined

  public constructor(options: ScaffoldOptions) {
    this.initControllers(options)
    this.initOrContinue()
  }

  // -- Public -------------------------------------------------------------------
  public async open(options?: OpenOptions) {
    await this.initOrContinue()
    ModalController.open(options)
  }

  public async close() {
    await this.initOrContinue()
    ModalController.close()
  }

  public setLoading(loading: ModalControllerState['loading']) {
    ModalController.setLoading(loading)
  }

  public getThemeMode() {
    return ThemeController.state.themeMode
  }

  public getThemeVariables() {
    return ThemeController.state.themeVariables
  }

  public setThemeMode(themeMode: ThemeControllerState['themeMode']) {
    ThemeController.setThemeMode(themeMode)
    setColorTheme(ThemeController.state.themeMode)
  }

  public setThemeVariables(themeVariables: ThemeControllerState['themeVariables']) {
    ThemeController.setThemeVariables(themeVariables)
    setThemeVariables(ThemeController.state.themeVariables)
  }

  public subscribeTheme(callback: (newState: ThemeControllerState) => void) {
    return ThemeController.subscribe(callback)
  }

  public getState() {
    return { ...PublicStateController.state }
  }

  public subscribeState(callback: (newState: PublicStateControllerState) => void) {
    return PublicStateController.subscribe(callback)
  }

  public showErrorMessage(message: string) {
    SnackController.showError(message)
  }

  public showSuccessMessage(message: string) {
    SnackController.showSuccess(message)
  }

  public getEvent() {
    return { ...EventsController.state }
  }

  public subscribeEvents(callback: (newEvent: EventsControllerState) => void) {
    return EventsController.subscribe(callback)
  }

  // -- Protected ----------------------------------------------------------------
  protected setIsConnected: (typeof AccountController)['setIsConnected'] = isConnected => {
    AccountController.setIsConnected(isConnected)
  }

  protected setCaipAddress: (typeof AccountController)['setCaipAddress'] = caipAddress => {
    AccountController.setCaipAddress(caipAddress)
  }

  protected setBalance: (typeof AccountController)['setBalance'] = (balance, balanceSymbol) => {
    AccountController.setBalance(balance, balanceSymbol)
  }

  protected fetchTokenBalance = () => {
    AccountController.fetchTokenBalance()
  }

  protected setProfileName: (typeof AccountController)['setProfileName'] = profileName => {
    AccountController.setProfileName(profileName)
  }

  protected setProfileImage: (typeof AccountController)['setProfileImage'] = profileImage => {
    AccountController.setProfileImage(profileImage)
  }

  protected resetAccount: (typeof AccountController)['resetAccount'] = () => {
    AccountController.resetAccount()
  }

  protected setCaipNetwork: (typeof NetworkController)['setCaipNetwork'] = caipNetwork => {
    NetworkController.setCaipNetwork(caipNetwork)
  }

  protected getCaipNetwork = () => NetworkController.state.caipNetwork

  protected setRequestedCaipNetworks: (typeof NetworkController)['setRequestedCaipNetworks'] =
    requestedCaipNetworks => {
      NetworkController.setRequestedCaipNetworks(requestedCaipNetworks)
    }

  protected getApprovedCaipNetworksData: (typeof NetworkController)['getApprovedCaipNetworksData'] =
    () => NetworkController.getApprovedCaipNetworksData()

  protected resetNetwork: (typeof NetworkController)['resetNetwork'] = () => {
    NetworkController.resetNetwork()
  }

  protected setConnectors: (typeof ConnectorController)['setConnectors'] = connectors => {
    ConnectorController.setConnectors(connectors)
  }

  protected addConnector: (typeof ConnectorController)['addConnector'] = connector => {
    ConnectorController.addConnector(connector)
  }

  protected getConnectors: (typeof ConnectorController)['getConnectors'] = () =>
    ConnectorController.getConnectors()

  protected resetWcConnection: (typeof ConnectionController)['resetWcConnection'] = () => {
    ConnectionController.resetWcConnection()
  }

  protected fetchIdentity: (typeof BlockchainApiController)['fetchIdentity'] = request =>
    BlockchainApiController.fetchIdentity(request)

  protected setAddressExplorerUrl: (typeof AccountController)['setAddressExplorerUrl'] =
    addressExplorerUrl => {
      AccountController.setAddressExplorerUrl(addressExplorerUrl)
    }

  protected setSmartAccountDeployed: (typeof AccountController)['setSmartAccountDeployed'] =
    isDeployed => {
      AccountController.setSmartAccountDeployed(isDeployed)
    }
  // -- Private ------------------------------------------------------------------
  private async initControllers(options: ScaffoldOptions) {
    NetworkController.setClient(options.networkControllerClient)
    NetworkController.setDefaultCaipNetwork(options.defaultChain)

    OptionsController.setProjectId(options.projectId)
    OptionsController.setAllWallets(options.allWallets)
    OptionsController.setIncludeWalletIds(options.includeWalletIds)
    OptionsController.setExcludeWalletIds(options.excludeWalletIds)
    OptionsController.setFeaturedWalletIds(options.featuredWalletIds)
    OptionsController.setOverrideWallets(options.overrideWallets)
    OptionsController.setTokens(options.tokens)
    OptionsController.setTermsConditionsUrl(options.termsConditionsUrl)
    OptionsController.setPrivacyPolicyUrl(options.privacyPolicyUrl)
    OptionsController.setCustomWallets(options.customWallets)
    OptionsController.setEnableAnalytics(options.enableAnalytics)
    OptionsController.setSdkVersion(options._sdkVersion)

    ConnectionController.setClient(options.connectionControllerClient)

    if (options.siweControllerClient) {
      const { SIWEController } = await import('@web3modal/siwe')

      SIWEController.setSIWEClient(options.siweControllerClient)
    }

    if (options.metadata) {
      OptionsController.setMetadata(options.metadata)
    }

    if (options.themeMode) {
      ThemeController.setThemeMode(options.themeMode)
    }

    if (options.themeVariables) {
      ThemeController.setThemeVariables(options.themeVariables)
    }

    if (options.enableOnramp) {
      OptionsController.setOnrampEnabled(Boolean(options.enableOnramp))
    }

    if (options.enableWalletFeatures) {
      OptionsController.setWalletFeaturesEnabled(Boolean(options.enableWalletFeatures))
    }

    if (options.allowUnsupportedChain) {
      NetworkController.setAllowUnsupportedChain(options.allowUnsupportedChain)
    }
  }

  private async initOrContinue() {
    if (!this.initPromise && !isInitialized && CoreHelperUtil.isClient()) {
      isInitialized = true
      this.initPromise = new Promise<void>(async resolve => {
        await Promise.all([import('@web3modal/ui'), import('./modal/w3m-modal/index.js')])
        const modal = document.createElement('w3m-modal')
        document.body.insertAdjacentElement('beforeend', modal)
        resolve()
      })
    }

    return this.initPromise
  }
}
