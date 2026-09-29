import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Button from '../../src/button/button.js'

const TAG_NAME = 'ae-button'

before(async () => {
  Button.define('button')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Button', () => {
  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Button)
    })

    it('createElement returns a Button instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Button)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('structure', () => {
    it('renders a <button> with part="button"', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Click</${TAG_NAME}>`)
      const button = el.shadowRoot!.querySelector('button')
      expect(button).to.exist
      expect(button!.getAttribute('part')).to.equal('button')
    })

    it('renders the slotted content inside the button', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Click</${TAG_NAME}>`)
      const slot = el.shadowRoot!.querySelector('slot')
      expect(slot).to.exist
      expect(el.textContent!.trim()).to.equal('Click')
    })

    it('defaults type to "button"', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Click</${TAG_NAME}>`)
      const button = el.shadowRoot!.querySelector('button')
      expect(button!.getAttribute('type')).to.equal('button')
    })

    it('applies the disabled attribute to the inner button', async () => {
      const el = await mount<Button>(`<${TAG_NAME} disabled>Click</${TAG_NAME}>`)
      const button = el.shadowRoot!.querySelector('button')
      expect(button!.hasAttribute('disabled')).to.equal(true)
    })
  })

  describe('link mode (href)', () => {
    it('renders an <a> instead of a <button> when href is set', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/settings">Settings</${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('a')).to.exist
      expect(el.shadowRoot!.querySelector('button')).to.be.null
    })

    it('sets the href attribute on the anchor', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/settings">Settings</${TAG_NAME}>`)
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.getAttribute('href')).to.equal('/settings')
    })

    it('exposes part="button" on the anchor', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/settings">Settings</${TAG_NAME}>`)
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.getAttribute('part')).to.equal('button')
    })

    it('forwards target to the anchor', async () => {
      const el = await mount<Button>(
        `<${TAG_NAME} href="https://example.com" target="_blank">Docs</${TAG_NAME}>`,
      )
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.getAttribute('target')).to.equal('_blank')
    })

    it('forwards rel to the anchor', async () => {
      const el = await mount<Button>(
        `<${TAG_NAME} href="https://example.com" rel="noopener noreferrer">Docs</${TAG_NAME}>`,
      )
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.getAttribute('rel')).to.equal('noopener noreferrer')
    })

    it('does not set target or rel when they are omitted', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/settings">Settings</${TAG_NAME}>`)
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.hasAttribute('target')).to.equal(false)
      expect(anchor.hasAttribute('rel')).to.equal(false)
    })

    it('omits href and sets aria-disabled when disabled', async () => {
      const el = await mount<Button>(
        `<${TAG_NAME} href="/settings" disabled>Settings</${TAG_NAME}>`,
      )
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.hasAttribute('href')).to.equal(false)
      expect(anchor.getAttribute('aria-disabled')).to.equal('true')
    })

    it('restores the anchor when href becomes empty', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/settings">Settings</${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('a')).to.exist

      el.href = undefined
      await updated()

      expect(el.shadowRoot!.querySelector('a')).to.be.null
      expect(el.shadowRoot!.querySelector('button')).to.exist
    })

    it('does not render a link when href is not set', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Click</${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('a')).to.be.null
    })
  })

  describe('active prop', () => {
    it('reflects aria-pressed on the inner button', async () => {
      const el = await mount<Button>(`<${TAG_NAME} active>Bold</${TAG_NAME}>`)
      const button = el.shadowRoot!.querySelector('button')!
      expect(button.hasAttribute('aria-pressed')).to.equal(true)
    })

    it('reflects aria-pressed on the anchor in link mode', async () => {
      const el = await mount<Button>(`<${TAG_NAME} href="/x" active>Bold</${TAG_NAME}>`)
      const anchor = el.shadowRoot!.querySelector('a')!
      expect(anchor.hasAttribute('aria-pressed')).to.equal(true)
    })

    it('omits aria-pressed when active is not set', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Bold</${TAG_NAME}>`)
      const button = el.shadowRoot!.querySelector('button')!
      expect(button.hasAttribute('aria-pressed')).to.equal(false)
    })
  })

  describe('click()', () => {
    it('dispatches a click on the inner button', async () => {
      const el = await mount<Button>(`<${TAG_NAME}>Click</${TAG_NAME}>`)
      let clicks = 0
      el.addEventListener('click', () => clicks++)

      el.click()

      expect(clicks).to.equal(1)
    })

    it('does nothing when disabled', async () => {
      const el = await mount<Button>(`<${TAG_NAME} disabled>Click</${TAG_NAME}>`)
      let clicks = 0
      el.addEventListener('click', () => clicks++)

      el.click()

      expect(clicks).to.equal(0)
    })
  })
})
