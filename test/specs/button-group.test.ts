import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import ButtonGroup from '../../src/button-group/button-group.js'
import Button from '../../src/button/button.js'

const TAG_NAME = 'ae-button-group'
const BUTTON_TAG = 'ae-button'

before(async () => {
  ButtonGroup.define('button-group')
  Button.define('button')
  await Promise.all([whenDefined(TAG_NAME), whenDefined(BUTTON_TAG)])
})

afterEach(() => {
  unmountAll()
})

describe('ButtonGroup', () => {
  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(ButtonGroup)
    })

    it('createElement returns a ButtonGroup instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(ButtonGroup)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('defaults', () => {
    it('defaults variant to "filled"', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.variant).to.equal('filled')
    })

    it('defaults color to "default"', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.color).to.equal('default')
    })

    it('defaults size to "md"', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.size).to.equal('md')
    })

    it('defaults compact to false', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.compact).to.equal(false)
    })

    it('defaults vertical to false', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.vertical).to.equal(false)
    })
  })

  describe('vertical prop', () => {
    it('sets the vertical attribute on host', async () => {
      const el = await mount<ButtonGroup>(`<${TAG_NAME} vertical></${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('vertical')).to.be.true
    })

    it('stacks buttons vertically via flex-direction column', async () => {
      const el = await mount<ButtonGroup>(`
        <${TAG_NAME} vertical>
          <${BUTTON_TAG}>One</${BUTTON_TAG}>
          <${BUTTON_TAG}>Two</${BUTTON_TAG}>
        </${TAG_NAME}>
      `)
      await updated()
      expect(getComputedStyle(el).flexDirection).to.equal('column')
    })

    it('applies compact vertical radius to first and last buttons only', async () => {
      const el = await mount<ButtonGroup>(`
        <${TAG_NAME} vertical compact>
          <${BUTTON_TAG}>One</${BUTTON_TAG}>
          <${BUTTON_TAG}>Two</${BUTTON_TAG}>
          <${BUTTON_TAG}>Three</${BUTTON_TAG}>
        </${TAG_NAME}>
      `)
      await updated()
      const buttons = el.querySelectorAll<Button>(BUTTON_TAG)
      expect(buttons.length).to.equal(3)

      const first = buttons[0]
      const middle = buttons[1]
      const last = buttons[2]

      expect(first.style.getPropertyValue('--_btn-r-tl')).to.not.equal('0')
      expect(first.style.getPropertyValue('--_btn-r-tr')).to.not.equal('0')
      expect(first.style.getPropertyValue('--_btn-r-bl')).to.equal('0')
      expect(first.style.getPropertyValue('--_btn-r-br')).to.equal('0')

      expect(middle.style.getPropertyValue('--_btn-r-tl')).to.equal('0')
      expect(middle.style.getPropertyValue('--_btn-r-tr')).to.equal('0')
      expect(middle.style.getPropertyValue('--_btn-r-bl')).to.equal('0')
      expect(middle.style.getPropertyValue('--_btn-r-br')).to.equal('0')

      expect(last.style.getPropertyValue('--_btn-r-tl')).to.equal('0')
      expect(last.style.getPropertyValue('--_btn-r-tr')).to.equal('0')
      expect(last.style.getPropertyValue('--_btn-r-bl')).to.not.equal('0')
      expect(last.style.getPropertyValue('--_btn-r-br')).to.not.equal('0')
    })
  })

  describe('prop propagation', () => {
    it('propagates color to child buttons', async () => {
      const el = await mount<ButtonGroup>(`
        <${TAG_NAME} color="primary">
          <${BUTTON_TAG}>One</${BUTTON_TAG}>
          <${BUTTON_TAG}>Two</${BUTTON_TAG}>
        </${TAG_NAME}>
      `)
      await updated()
      const buttons = el.querySelectorAll<Button>(BUTTON_TAG)
      expect(buttons.length).to.equal(2)
      buttons.forEach((btn) => {
        expect(btn.color).to.equal('primary')
      })
    })

    it('disables child buttons when disabled is true', async () => {
      const el = await mount<ButtonGroup>(`
        <${TAG_NAME} disabled>
          <${BUTTON_TAG}>One</${BUTTON_TAG}>
          <${BUTTON_TAG}>Two</${BUTTON_TAG}>
        </${TAG_NAME}>
      `)
      await updated()
      const buttons = el.querySelectorAll<Button>(BUTTON_TAG)
      expect(buttons.length).to.equal(2)
      buttons.forEach((btn) => {
        expect(btn.disabled).to.equal(true)
      })
    })
  })

  describe('compact mode', () => {
    it('applies horizontal margin and radius by default', async () => {
      const el = await mount<ButtonGroup>(`
        <${TAG_NAME} compact>
          <${BUTTON_TAG}>One</${BUTTON_TAG}>
          <${BUTTON_TAG}>Two</${BUTTON_TAG}>
          <${BUTTON_TAG}>Three</${BUTTON_TAG}>
        </${TAG_NAME}>
      `)
      await updated()
      const buttons = el.querySelectorAll<Button>(BUTTON_TAG)
      expect(buttons.length).to.equal(3)

      expect(buttons[0].style.marginLeft).to.equal('')
      expect(buttons[1].style.marginLeft).to.equal('-1px')
      expect(buttons[0].style.getPropertyValue('--_btn-r-tl')).to.not.equal('0')
      expect(buttons[2].style.getPropertyValue('--_btn-r-tr')).to.not.equal('0')
    })
  })
})
