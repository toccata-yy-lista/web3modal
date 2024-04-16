import { customElement } from '@lista-wallet/ui'
import { W3mEmailOtpWidget } from '../../utils/w3m-email-otp-widget/index.js'
import type { OnOtpSubmitFn } from '../../utils/w3m-email-otp-widget/index.js'
import { EventsController, RouterController } from '@lista-wallet/core'

@customElement('w3m-update-email-primary-otp-view')
export class W3mUpdateEmailPrimaryOtpView extends W3mEmailOtpWidget {
  public constructor() {
    super()
  }

  // --  Private ------------------------------------------ //
  override email = RouterController.state.data?.email

  override onOtpSubmit: OnOtpSubmitFn = async otp => {
    try {
      if (this.emailConnector) {
        await this.emailConnector.provider.updateEmailPrimaryOtp({ otp })
        EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_PASS' })
        RouterController.replace('UpdateEmailSecondaryOtp', RouterController.state.data)
      }
    } catch (error) {
      EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_FAIL' })
      throw error
    }
  }

  override onStartOver = () => {
    RouterController.replace('UpdateEmailWallet', RouterController.state.data)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-update-email-primary-otp-view': W3mUpdateEmailPrimaryOtpView
  }
}
