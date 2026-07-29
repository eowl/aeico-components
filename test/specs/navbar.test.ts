import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Navbar from '../../src/navbar/navbar.js'

const TAG = 'ae-navbar'

before(async () => {
  Navbar.define('navbar')
  await whenDefined(TAG)
})

afterEach(() => {
  unmountAll()
})

describe('Navbar', () => {
  // ─── Registration ─────────────────────────────────────────────────────────

  describe('registration', () => {
    it('is registered as ae-navbar', () => {
      expect(customElements.get(TAG)).to.equal(Navbar)
    })

    it('createElement returns a Navbar instance', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Navbar)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  // ─── Shadow DOM structure ──────────────────────────────────────────────────

  describe('structure', () => {
    it('renders [part=brand] with a slot[name=brand]', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const brand = el.shadowRoot!.querySelector('[part="brand"]')
      expect(brand).to.exist
      expect(brand!.querySelector('slot[name="brand"]')).to.exist
    })

    it('renders [part=nav] with aria-label', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const nav = el.shadowRoot!.querySelector('[part="nav"]')
      expect(nav).to.exist
      expect(nav!.getAttribute('aria-label')).to.equal('Main navigation')
    })

    it('renders [part=start] inside [part=nav]', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const nav = el.shadowRoot!.querySelector('[part="nav"]')!
      const start = nav.querySelector('[part="start"]')
      expect(start).to.exist
      expect(start!.querySelector('slot[name="start"]')).to.exist
    })

    it('renders [part=end] inside [part=nav]', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const nav = el.shadowRoot!.querySelector('[part="nav"]')!
      const end = nav.querySelector('[part="end"]')
      expect(end).to.exist
      expect(end!.querySelector('slot[name="end"]')).to.exist
    })

    it('renders [part=hamburger] button', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector('[part="hamburger"]')
      expect(btn).to.exist
      expect(btn!.tagName.toLowerCase()).to.equal('button')
    })

    it('hamburger has aria-label="Toggle navigation"', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="hamburger"]')!
      expect(btn.getAttribute('aria-label')).to.equal('Toggle navigation')
    })
  })

  // ─── Props & attributes ────────────────────────────────────────────────────

  describe('color prop', () => {
    it('reflects color attribute to property', async () => {
      const el = await mount<Navbar>(`<${TAG} color="primary"></${TAG}>`)
      expect(el.getAttribute('color')).to.equal('primary')
      expect(el.color).to.equal('primary')
    })

    it('accepts all color values', async () => {
      const colors = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
      for (const color of colors) {
        const el = await mount<Navbar>(`<${TAG} color="${color}"></${TAG}>`)
        expect(el.getAttribute('color')).to.equal(color)
        unmountAll()
      }
    })
  })

  describe('appearance prop', () => {
    it('defaults to "text"', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      expect(el.appearance).to.equal('text')
    })

    it('reflects appearance attribute', async () => {
      const el = await mount<Navbar>(`<${TAG} appearance="block"></${TAG}>`)
      expect(el.getAttribute('appearance')).to.equal('block')
      expect(el.appearance).to.equal('block')
    })
  })

  describe('open prop', () => {
    it('defaults to false', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      expect(el.open).to.equal(false)
      expect(el.hasAttribute('open')).to.equal(false)
    })

    it('reflects open attribute', async () => {
      const el = await mount<Navbar>(`<${TAG} open></${TAG}>`)
      await updated()
      expect(el.open).to.equal(true)
      expect(el.hasAttribute('open')).to.equal(true)
    })

    it('setting open=true adds the open attribute', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      el.open = true
      await updated()
      expect(el.hasAttribute('open')).to.equal(true)
    })

    it('setting open=false removes the open attribute', async () => {
      const el = await mount<Navbar>(`<${TAG} open></${TAG}>`)
      await updated()
      el.open = false
      await updated()
      expect(el.hasAttribute('open')).to.equal(false)
    })
  })

  describe('sticky prop', () => {
    it('defaults to false and has no sticky attribute', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.sticky).to.equal(false)
      expect(el.hasAttribute('sticky')).to.equal(false)
    })

    it('sticky=true adds the sticky attribute', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      el.sticky = true
      await updated()
      expect(el.hasAttribute('sticky')).to.equal(true)
    })

    it('sticky attribute present sets sticky=true', async () => {
      const el = await mount<Navbar>(`<${TAG} sticky></${TAG}>`)
      await updated()
      expect(el.sticky).to.equal(true)
    })
  })

  // ─── Hamburger interaction ─────────────────────────────────────────────────

  describe('hamburger toggle', () => {
    it('toggleMenu() flips open state', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      expect(el.open).to.equal(false)
      el.toggleMenu()
      await updated()
      expect(el.open).to.equal(true)
      el.toggleMenu()
      await updated()
      expect(el.open).to.equal(false)
    })

    it('clicking hamburger opens the menu', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="hamburger"]')!
      btn.click()
      await updated()
      expect(el.open).to.equal(true)
    })

    it('hamburger aria-expanded mirrors open state', async () => {
      const el = await mount<Navbar>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="hamburger"]')!
      expect(btn.getAttribute('aria-expanded')).to.equal('false')
      el.open = true
      await updated()
      expect(btn.getAttribute('aria-expanded')).to.equal('true')
    })
  })

  // ─── Slot distribution ─────────────────────────────────────────────────────

  describe('slot distribution', () => {
    it('slots brand content into [part=brand]', async () => {
      const el = await mount<Navbar>(`
        <${TAG}>
          <a slot="brand" href="/">Logo</a>
        </${TAG}>
      `)
      const brandSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="brand"]')!
      const assigned = brandSlot.assignedElements()
      expect(assigned).to.have.length(1)
      expect(assigned[0].tagName.toLowerCase()).to.equal('a')
    })

    it('slots start content into [part=start]', async () => {
      const el = await mount<Navbar>(`
        <${TAG}>
          <a slot="start" href="/">Home</a>
          <a slot="start" href="/docs">Docs</a>
        </${TAG}>
      `)
      const startSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="start"]')!
      expect(startSlot.assignedElements()).to.have.length(2)
    })

    it('slots end content into [part=end]', async () => {
      const el = await mount<Navbar>(`
        <${TAG}>
          <button slot="end">Sign in</button>
        </${TAG}>
      `)
      const endSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="end"]')!
      expect(endSlot.assignedElements()).to.have.length(1)
    })
  })
})
