import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, whenDefined, updated } from '../helpers/mount.js'
import CopyButton from '../../src/copy-button/copy-button.js'

const TAG_NAME = 'ae-copy-button'

before(async () => {
  CopyButton.define('copy-button')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('CopyButton', () => {
  describe('registration', () => {
    it('is registered as ae-copy-button', () => {
      expect(customElements.get(TAG_NAME)).to.equal(CopyButton)
    })

    it('createElement returns a CopyButton instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(CopyButton)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a button with part="button"', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME}></${TAG_NAME}>`)
      const btn = el.shadowRoot?.querySelector('button')
      expect(btn).to.exist
      expect(btn!.getAttribute('part')).to.equal('button')
    })

    it('renders .icon-copy element', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME}></${TAG_NAME}>`)
      const icon = el.shadowRoot?.querySelector('.icon-copy')
      expect(icon).to.exist
    })

    it('renders .icon-check element', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME}></${TAG_NAME}>`)
      const icon = el.shadowRoot?.querySelector('.icon-check')
      expect(icon).to.exist
    })

    it('does not have copied attribute initially', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="hello"></${TAG_NAME}>`)
      expect(el.hasAttribute('copied')).to.be.false
    })
  })

  describe('props', () => {
    it('reflects color attribute', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} color="primary" text="x"></${TAG_NAME}>`)
      expect(el.getAttribute('color')).to.equal('primary')
    })

    it('reflects variant attribute', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} variant="outlined" text="x"></${TAG_NAME}>`)
      expect(el.getAttribute('variant')).to.equal('outlined')
    })

    it('reflects size attribute', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} size="sm" text="x"></${TAG_NAME}>`)
      expect(el.getAttribute('size')).to.equal('sm')
    })

    it('reflects disabled attribute', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} disabled text="x"></${TAG_NAME}>`)
      expect(el.hasAttribute('disabled')).to.be.true
    })

    it('passes disabled to the inner button', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} disabled text="x"></${TAG_NAME}>`)
      const btn = el.shadowRoot?.querySelector('button')
      expect(btn!.disabled).to.be.true
    })
  })

  describe('clipboard', () => {
    let originalClipboard: Clipboard
    let writeTextStub: ReturnType<typeof createWriteTextStub>

    function createWriteTextStub() {
      let lastText = ''
      let callCount = 0
      const stub = (text: string) => {
        lastText = text
        callCount++
        return Promise.resolve()
      }
      return { stub, get lastText() { return lastText }, get callCount() { return callCount } }
    }

    before(() => {
      originalClipboard = navigator.clipboard
    })

    beforeEach(() => {
      writeTextStub = createWriteTextStub()
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextStub.stub },
        configurable: true,
        writable: true,
      })
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
        writable: true,
      })
    })

    it('copies text attribute on click', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="hello world"></${TAG_NAME}>`)
      el.shadowRoot!.querySelector('button')!.click()
      await updated()
      expect(writeTextStub.callCount).to.equal(1)
      expect(writeTextStub.lastText).to.equal('hello world')
    })

    it('falls back to slot text content when text attribute is absent', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME}>slot content</${TAG_NAME}>`)
      el.shadowRoot!.querySelector('button')!.click()
      await updated()
      expect(writeTextStub.callCount).to.equal(1)
      expect(writeTextStub.lastText).to.equal('slot content')
    })

    it('text attribute takes priority over slot content', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="attr value">slot content</${TAG_NAME}>`)
      el.shadowRoot!.querySelector('button')!.click()
      await updated()
      expect(writeTextStub.lastText).to.equal('attr value')
    })

    it('sets [copied] attribute after successful copy', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="hi"></${TAG_NAME}>`)
      el.shadowRoot!.querySelector('button')!.click()
      await new Promise(r => setTimeout(r, 10))
      expect(el.hasAttribute('copied')).to.be.true
    })

    it('dispatches copy event with detail.text', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="event text"></${TAG_NAME}>`)
      let detail: { text: string } | null = null
      el.addEventListener('copy', (e) => { detail = (e as unknown as CustomEvent).detail })
      el.shadowRoot!.querySelector('button')!.click()
      await new Promise(r => setTimeout(r, 10))
      expect(detail).to.not.be.null
      expect(detail!.text).to.equal('event text')
    })

    it('does not copy when disabled', async () => {
      const el = await mount<CopyButton>(`<${TAG_NAME} text="x" disabled></${TAG_NAME}>`)
      el.shadowRoot!.querySelector('button')!.click()
      await updated()
      expect(writeTextStub.callCount).to.equal(0)
    })
  })
})
