import { customElement } from '@lista-wallet/ui'
import { W3mEmailOtpWidget } from '../../utils/w3m-email-otp-widget/index.js'
import type { OnOtpSubmitFn, OnOtpResendFn } from '../../utils/w3m-email-otp-widget/index.js'
import { EventsController, ConnectionController, ModalController } from '@lista-wallet/core'

@customElement('w3m-email-verify-otp-view')
export class W3mEmailVerifyOtpView extends W3mEmailOtpWidget {
  public constructor() {
    super()
  }

  // --  Private ------------------------------------------ //
  override onOtpSubmit: OnOtpSubmitFn = async otp => {
    try {
      if (this.emailConnector) {
        await this.emailConnector.provider.connectOtp({ otp })
        EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_PASS' })
        await ConnectionController.connectExternal(this.emailConnector)
        ModalController.close()
        EventsController.sendEvent({
          type: 'track',
          event: 'CONNECT_SUCCESS',
          properties: { method: 'email', name: this.emailConnector.name || 'Unknown' }
        })
      }
    } catch (error) {
      EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_FAIL' })
      throw error
    }
  }

  override onOtpResend: OnOtpResendFn = async email => {
    if (this.emailConnector) {
      await this.emailConnector.provider.connectEmail({ email })
      EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_SENT' })
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-email-verify-otp-view': W3mEmailVerifyOtpView
  }
}
