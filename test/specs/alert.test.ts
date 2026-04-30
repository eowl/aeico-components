import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, whenDefined, updated } from '../helpers/mount'
import Alert from '../../src/alert'

const TAG_NAME = 'ae-alert'

before(async () => {
  Alert.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Alert component', () => {
  it('should create an alert element with correct structure', async () => {
    const alert = await mount('<ae-alert>Test Alert</ae-alert>')
    const alertDiv = alert.shadowRoot?.querySelector('div.alert')
    expect(alertDiv).to.exist
    expect(alert.textContent).to.include('Test Alert')
  })

  it('should apply color and variant classes based on attributes', async () => {
    const alert = await mount('<ae-alert color="success" variant="filled">Success Alert</ae-alert>')
    const alertDiv = alert.shadowRoot?.querySelector('div.alert')
    expect(alertDiv).to.exist
    expect(alert.getAttribute('color')).to.equal('success')
    expect(alert.getAttribute('variant')).to.equal('filled')
  })

  it('should be dismissible when dismissible attribute is set', async () => {
    const alert = await mount('<ae-alert dismissible>Dismissible Alert</ae-alert>')
    const closeButton = alert.shadowRoot?.querySelector('button.alert-close')
    expect(closeButton).to.exist
    closeButton?.dispatchEvent(new Event('click'))
    expect(alert.isConnected).to.be.false
  })

  it('should toggle visibility with show() and hide() methods', async () => {
    const alert = await mount('<ae-alert invisible>Toggle Alert</ae-alert>') as Alert
    const alertDiv = alert.shadowRoot?.querySelector('div.alert') as HTMLElement
    expect(alertDiv).to.exist
    expect(alertDiv.style.display).to.equal('none')
    alert.show()
    await updated()
    expect(alertDiv.style.display).to.equal('')
    alert.hide()
    await updated()
    expect(alertDiv.style.display).to.equal('none')
  })
  
  it('should emit a "close" event with the alert instance as detail when dismissed', async () => {
    const alert = await mount('<ae-alert dismissible>Event Alert</ae-alert>') as Alert
    let eventDetail: { target: Alert } | null = null
    alert.addEventListener('alert-close', (event: Event) => {
      eventDetail = (event as CustomEvent).detail
    })
    const closeButton = alert.shadowRoot?.querySelector('button.alert-close')
    expect(closeButton).to.exist
    closeButton?.dispatchEvent(new Event('click'))
    expect(eventDetail).to.not.be.null
    expect(eventDetail!.target).to.equal(alert)
  })

  it('should not be visible when invisible attribute is set', async () => {
    const alert = await mount('<ae-alert invisible>Invisible Alert</ae-alert>')
    const alertDiv = alert.shadowRoot?.querySelector('div.alert') as HTMLElement
    expect(alertDiv).to.exist
    expect(alertDiv.style.display).to.equal('none')
  })
})
