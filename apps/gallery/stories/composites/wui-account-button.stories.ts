import type { Meta } from '@storybook/web-components'
import '@lista-wallet/ui/src/composites/wui-account-button'
import type { WuiAccountButton } from '@lista-wallet/ui/src/composites/wui-account-button'
import { html } from 'lit'
import { address, avatarImageSrc, networkImageSrc } from '../../utils/PresetUtils'

type Component = Meta<WuiAccountButton>

export default {
  title: 'Composites/wui-account-button',
  args: {
    disabled: false,
    networkSrc: networkImageSrc,
    avatarSrc: avatarImageSrc,
    address,
    balance: '0.527 ETH',
    isProfileName: false,
    charsStart: 4,
    charsEnd: 6
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' }
    },
    isProfileName: {
      control: { type: 'boolean' }
    }
  }
} as Component

export const Default: Component = {
  render: args =>
    html`<wui-account-button
      ?disabled=${args.disabled}
      ?isProfileName=${args.isProfileName}
      .networkSrc=${args.networkSrc}
      .avatarSrc=${args.avatarSrc}
      .balance=${args.balance}
      address=${args.address}
      .charsStart=${args.charsStart}
      .charsEnd=${args.charsEnd}
    ></wui-account-button>`
}
