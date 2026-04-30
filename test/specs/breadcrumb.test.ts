import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Breadcrumb from '../../src/breadcrumb/breadcrumb.js'
import BreadcrumbItem from '../../src/breadcrumb/breadcrumb-item.js'

const BC = 'ae-breadcrumb'
const BC_ITEM = 'ae-breadcrumb-item'

before(async () => {
  Breadcrumb.register()
  BreadcrumbItem.register()
  await Promise.all([whenDefined(BC), whenDefined(BC_ITEM)])
})

afterEach(() => {
  unmountAll()
})


describe('Breadcrumb', () => {
  describe('registration', () => {
    it('is registered as ae-breadcrumb', () => {
      expect(customElements.get(BC)).to.equal(Breadcrumb)
    })

    it('createElement returns a Breadcrumb instance', () => {
      const el = document.createElement(BC)
      expect(el).to.be.instanceOf(Breadcrumb)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Breadcrumb>(`<${BC}></${BC}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a <nav> with aria-label="breadcrumb"', async () => {
      const el = await mount<Breadcrumb>(`<${BC}></${BC}>`)
      const nav = el.shadowRoot!.querySelector('nav')
      expect(nav).to.exist
      expect(nav!.getAttribute('aria-label')).to.equal('breadcrumb')
    })

    it('renders an <ol> with part="list"', async () => {
      const el = await mount<Breadcrumb>(`<${BC}></${BC}>`)
      const ol = el.shadowRoot!.querySelector('ol')
      expect(ol).to.exist
      expect(ol!.getAttribute('part')).to.equal('list')
    })
  })

  describe('separator prop', () => {
    it('defaults to "/"', async () => {
      const el = await mount<Breadcrumb>(`<${BC}></${BC}>`)
      expect(el.separator).to.equal('/')
    })

    it('reflects separator attribute', async () => {
      const el = await mount<Breadcrumb>(`<${BC} separator=">">${BC}</${BC}>`)
      expect(el.getAttribute('separator')).to.equal('>')
      expect(el.separator).to.equal('>')
    })
  })

  describe('color prop', () => {
    it('reflects color attribute', async () => {
      const el = await mount<Breadcrumb>(`<${BC} color="primary"></${BC}>`)
      expect(el.getAttribute('color')).to.equal('primary')
    })
  })

  describe('separator injection', () => {
    it('injects no separator before the first item', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}>
          <${BC_ITEM}>First</${BC_ITEM}>
          <${BC_ITEM}>Second</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      const items = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)
      const firstItem = items[0]
      // No [data-ae-sep] in first item's light DOM
      expect(firstItem.querySelector('[data-ae-sep]')).to.be.null
    })

    it('injects a text separator before non-first items', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC} separator="/">
          <${BC_ITEM}>First</${BC_ITEM}>
          <${BC_ITEM}>Second</${BC_ITEM}>
          <${BC_ITEM}>Third</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      const items = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)
      // Second and third items should have injected separators
      const secondSep = items[1].querySelector('[data-ae-sep]')
      const thirdSep = items[2].querySelector('[data-ae-sep]')
      expect(secondSep).to.exist
      expect(thirdSep).to.exist
      expect(secondSep!.textContent).to.equal('/')
    })

    it('uses custom text separator', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC} separator="›">
          <${BC_ITEM}>A</${BC_ITEM}>
          <${BC_ITEM}>B</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      const second = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)[1]
      const sep = second.querySelector('[data-ae-sep]')
      expect(sep).to.exist
      expect(sep!.textContent).to.equal('›')
    })

    it('re-injects separators when separator prop changes', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC} separator="/">
          <${BC_ITEM}>A</${BC_ITEM}>
          <${BC_ITEM}>B</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      el.separator = '>'
      await updated()
      const second = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)[1]
      const sep = second.querySelector('[data-ae-sep]')
      expect(sep!.textContent).to.equal('>')
    })

    it('does not duplicate separators on multiple syncs', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}>
          <${BC_ITEM}>A</${BC_ITEM}>
          <${BC_ITEM}>B</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      await updated()
      const second = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)[1]
      const seps = second.querySelectorAll('[data-ae-sep]')
      expect(seps.length).to.equal(1)
    })
  })

  describe('aria-current', () => {
    it('sets aria-current="page" on the last item', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}>
          <${BC_ITEM}>First</${BC_ITEM}>
          <${BC_ITEM}>Second</${BC_ITEM}>
          <${BC_ITEM}>Third</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      const items = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)
      expect(items[0].getAttribute('aria-current')).to.be.null
      expect(items[1].getAttribute('aria-current')).to.be.null
      expect(items[2].getAttribute('aria-current')).to.equal('page')
    })

    it('removes aria-current from non-last items', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}>
          <${BC_ITEM} aria-current="page">A</${BC_ITEM}>
          <${BC_ITEM}>B</${BC_ITEM}>
        </${BC}>
      `)
      await updated()
      const items = el.querySelectorAll<BreadcrumbItem>(BC_ITEM)
      expect(items[0].getAttribute('aria-current')).to.be.null
      expect(items[1].getAttribute('aria-current')).to.equal('page')
    })
  })

  describe('single item', () => {
    it('sets aria-current on the only item', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}><${BC_ITEM}>Only</${BC_ITEM}></${BC}>
      `)
      await updated()
      const item = el.querySelector<BreadcrumbItem>(BC_ITEM)!
      expect(item.getAttribute('aria-current')).to.equal('page')
    })

    it('injects no separator for a single item', async () => {
      const el = await mount<Breadcrumb>(`
        <${BC}><${BC_ITEM}>Only</${BC_ITEM}></${BC}>
      `)
      await updated()
      const item = el.querySelector<BreadcrumbItem>(BC_ITEM)!
      expect(item.querySelector('[data-ae-sep]')).to.be.null
    })
  })
})

describe('BreadcrumbItem', () => {
  describe('registration', () => {
    it('is registered as ae-breadcrumb-item', () => {
      expect(customElements.get(BC_ITEM)).to.equal(BreadcrumbItem)
    })

    it('createElement returns a BreadcrumbItem instance', () => {
      const el = document.createElement(BC_ITEM)
      expect(el).to.be.instanceOf(BreadcrumbItem)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('structure', () => {
    it('renders a <li> with part="item"', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM}>Label</${BC_ITEM}>`)
      const li = el.shadowRoot!.querySelector('li')
      expect(li).to.exist
      expect(li!.getAttribute('part')).to.equal('item')
    })

    it('renders a .sep span with part="separator"', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM}>Label</${BC_ITEM}>`)
      const sep = el.shadowRoot!.querySelector('.sep')
      expect(sep).to.exist
      expect(sep!.getAttribute('part')).to.equal('separator')
    })

    it('renders default slot content', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM}>My Label</${BC_ITEM}>`)
      expect(el.textContent?.trim()).to.equal('My Label')
    })
  })

  describe('href prop', () => {
    it('renders a plain span (no <a>) when href is not set', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM}>Label</${BC_ITEM}>`)
      const a = el.shadowRoot!.querySelector('a')
      expect(a).to.be.null
    })

    it('renders an <a> with part="link" when href is set', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM} href="/home">Home</${BC_ITEM}>`)
      const a = el.shadowRoot!.querySelector('a')
      expect(a).to.exist
      expect(a!.getAttribute('href')).to.equal('/home')
      expect(a!.getAttribute('part')).to.equal('link')
    })

    it('reflects href attribute', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM} href="/test">T</${BC_ITEM}>`)
      expect(el.getAttribute('href')).to.equal('/test')
      expect(el.href).to.equal('/test')
    })
  })

  describe('separator slot', () => {
    it('renders slot[name="separator"] inside .sep', async () => {
      const el = await mount<BreadcrumbItem>(`<${BC_ITEM}>Label</${BC_ITEM}>`)
      const sepSlot = el.shadowRoot!.querySelector('slot[name="separator"]')
      expect(sepSlot).to.exist
    })

    it('renders injected separator content via slot="separator"', async () => {
      const el = await mount<BreadcrumbItem>(`
        <${BC_ITEM}>
          <span slot="separator">/</span>
          Label
        </${BC_ITEM}>
      `)
      const slotEl = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="separator"]')!
      const assigned = slotEl.assignedElements()
      expect(assigned.length).to.equal(1)
      expect(assigned[0].textContent).to.equal('/')
    })
  })
})
