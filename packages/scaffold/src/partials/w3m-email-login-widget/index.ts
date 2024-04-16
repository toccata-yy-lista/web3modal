import { ConnectorController, CoreHelperUtil } from '@lista-wallet/core'
import { customElement } from '@lista-wallet/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ref, createRef } from 'lit/directives/ref.js'
import type { Ref } from 'lit/directives/ref.js'
import styles from './styles.js'
import { SnackController, RouterController, EventsController } from '@lista-wallet/core'

@customElement('w3m-email-login-widget')
export class W3mEmailLoginWidget extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  private formRef: Ref<HTMLFormElement> = createRef()

  // -- State & Properties -------------------------------- //
  @state() private connectors = ConnectorController.state.connectors

  @state() private email = ''

  @state() private loading = false

  @state() private error = ''

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectorController.subscribeKey('connectors', val => (this.connectors = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  public override firstUpdated() {
    this.formRef.value?.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.onSubmitEmail(event)
      }
    })
  }

  // -- Render -------------------------------------------- //
  public override render() {
    const multipleConnectors = this.connectors.length > 1
    const connector = this.connectors.find(c => c.type === 'EMAIL')

    if (!connector) {
      return null
    }

    return html`
      <form ${ref(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          .errorMessage=${this.error}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>

      ${multipleConnectors ? html`<wui-separator text="or"></wui-separator>` : null}
    `
  }

  // -- Private ------------------------------------------- //
  private submitButtonTemplate() {
    const showSubmit = !this.loading && this.email.length > 3

    return showSubmit
      ? html`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `
      : null
  }

  private loadingTemplate() {
    return this.loading
      ? html`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`
      : null
  }

  private onEmailInputChange(event: CustomEvent<string>) {
    this.email = event.detail
    this.error = ''
  }

  private async onSubmitEmail(event: Event) {
    try {
      if (this.loading) {
        return
      }
      this.loading = true
      event.preventDefault()
      const emailConnector = ConnectorController.getEmailConnector()

      if (!emailConnector) {
        throw new Error('w3m-email-login-widget: Email connector not found')
      }
      const { action } = await emailConnector.provider.connectEmail({ email: this.email })
      EventsController.sendEvent({ type: 'track', event: 'EMAIL_SUBMITTED' })
      if (action === 'VERIFY_OTP') {
        EventsController.sendEvent({ type: 'track', event: 'EMAIL_VERIFICATION_CODE_SENT' })
        RouterController.push('EmailVerifyOtp', { email: this.email })
      } else if (action === 'VERIFY_DEVICE') {
        RouterController.push('EmailVerifyDevice', { email: this.email })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const parsedError = CoreHelperUtil.parseError(error)
      if (parsedError?.includes('Invalid email')) {
        this.error = 'Invalid email. Try again.'
      } else {
        SnackController.showError(error)
      }
    } finally {
      this.loading = false
    }
  }

  private onFocusEvent() {
    EventsController.sendEvent({ type: 'track', event: 'EMAIL_LOGIN_SELECTED' })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-email-login-widget': W3mEmailLoginWidget
  }
}
