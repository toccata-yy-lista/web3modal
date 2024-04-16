import type { BaseError } from '@lista-wallet/core'
import {
  ConnectionController,
  EventsController,
  ModalController,
  OptionsController,
  RouterController,
  StorageUtil
} from '@lista-wallet/core'
import { customElement } from '@lista-wallet/ui'
import { W3mConnectingWidget } from '../../utils/w3m-connecting-widget/index.js'

@customElement('w3m-connecting-external-view')
export class W3mConnectingExternalView extends W3mConnectingWidget {
  public constructor() {
    super()
    if (!this.connector) {
      throw new Error('w3m-connecting-view: No connector provided')
    }

    EventsController.sendEvent({
      type: 'track',
      event: 'SELECT_WALLET',
      properties: {
        name: this.connector.name ?? 'Unknown',
        platform: 'browser'
      }
    })
    this.onConnect = this.onConnectProxy.bind(this)
    this.onAutoConnect = this.onConnectProxy.bind(this)
    this.isWalletConnect = false
  }

  // -- Private ------------------------------------------- //
  private async onConnectProxy() {
    try {
      this.error = false
      if (this.connector) {
        StorageUtil.setConnectedWallet({
          id: this.connector.id,
          name: this.connector.name || '',
          image_id: this.connector.imageId,
          image_url: this.connector.imageUrl,
          rdns: this.connector.info?.rdns,
        })

        if (this.connector.imageUrl) {
          StorageUtil.setConnectedWalletImageUrl(this.connector.imageUrl)
        }
        await ConnectionController.connectExternal(this.connector)

        if (OptionsController.state.isSiweEnabled) {
          RouterController.push('ConnectingSiwe')
        } else {
          ModalController.close()
        }

        EventsController.sendEvent({
          type: 'track',
          event: 'CONNECT_SUCCESS',
          properties: { method: 'browser', name: this.connector.name || 'Unknown' }
        })
      }
    } catch (error) {
      EventsController.sendEvent({
        type: 'track',
        event: 'CONNECT_ERROR',
        properties: { message: (error as BaseError)?.message ?? 'Unknown' }
      })
      this.error = true
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-connecting-external-view': W3mConnectingExternalView
  }
}
