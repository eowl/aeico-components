import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Drawer from '../../src/drawer'

const TAG_NAME = 'ae-drawer'

before(async () => {
  Drawer.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Drawer', () => {

  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Drawer)
    })

    it('createElement returns a Drawer instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Drawer)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('rendering', () => {
    it('renders a panel div inside shadow DOM', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.panel')).to.exist
    })

    it('applies placement-right class by default', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      const panel = el.shadowRoot!.querySelector('.panel')!
      expect(panel.classList.contains('placement-right')).to.be.true
    })

    it('applies placement class matching the placement prop', async () => {
      for (const placement of ['left', 'right', 'top', 'bottom'] as const) {
        const el = await mount<Drawer>(`<${TAG_NAME} placement="${placement}"></${TAG_NAME}>`)
        const panel = el.shadowRoot!.querySelector('.panel')!
        expect(panel.classList.contains(`placement-${placement}`)).to.be.true
      }
    })

    it('renders header with label text by default', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME} label="Test Label"></${TAG_NAME}>`)
      const label = el.shadowRoot!.querySelector('.label')
      expect(label).to.exist
      expect(label!.textContent).to.equal('Test Label')
    })

    it('renders a close button in the header by default', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.close-btn')).to.exist
    })

    it('omits close button when closable="false"', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME} closable="false"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.close-btn')).to.not.exist
    })

    it('omits header when header="false"', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME} header="false"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('header')).to.not.exist
    })
  })

  describe('open / close', () => {
    it('isOpen() returns false initially', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.isOpen()).to.be.false
    })

    it('open() opens the dialog and isOpen() returns true', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.open()
      expect(el.isOpen()).to.be.true
    })

    it('close() closes the dialog and isOpen() returns false', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.open()
      el.close()
      expect(el.isOpen()).to.be.false
    })

    it('emits "open" event when opened', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      let fired = false
      el.addEventListener('open', () => { fired = true })
      el.open()
      expect(fired).to.be.true
    })

    it('emits "close" event when closed', (done) => {
      mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`).then(el => {
        el.addEventListener('close', () => done())
        el.open()
        el.close()
      })
    })

    it('open event detail contains target reference', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME}></${TAG_NAME}>`)
      let detail: any
      el.addEventListener('open', (e: Event) => { detail = (e as CustomEvent).detail })
      el.open()
      expect(detail).to.exist
      expect(detail.target).to.equal(el)
    })
  })

  describe('size prop', () => {
    it('sets inline width for left/right placement', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME} size="400px"></${TAG_NAME}>`)
      const panel = el.shadowRoot!.querySelector('.panel') as HTMLElement
      expect(panel.style.width).to.equal('400px')
    })

    it('sets inline height for top/bottom placement', async () => {
      const el = await mount<Drawer>(`<${TAG_NAME} placement="bottom" size="280px"></${TAG_NAME}>`)
      const panel = el.shadowRoot!.querySelector('.panel') as HTMLElement
      expect(panel.style.height).to.equal('280px')
    })
  })

  describe('data-close', () => {
    it('closes when a slotted element with [data-close] is clicked', async () => {
      const el = await mount<Drawer>(`
        <${TAG_NAME}>
          <button slot="footer" data-close id="close-btn">Close</button>
        </${TAG_NAME}>
      `)
      el.open()
      expect(el.isOpen()).to.be.true

      // Simulate click on an element with data-close
      const btn = el.querySelector('#close-btn') as HTMLElement
      btn.click()
      expect(el.isOpen()).to.be.false
    })
  })

})
