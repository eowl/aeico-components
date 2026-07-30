import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Menu from '../../src/menu/menu.js'
import MenuItem from '../../src/menu/menu-item.js'

const TAG = 'ae-menu'
const ITEM_TAG = 'ae-menu-item'

before(async () => {
  Menu.define('menu')
  MenuItem.define('menu-item')
  await Promise.all([whenDefined(TAG), whenDefined(ITEM_TAG)])
})

afterEach(() => {
  unmountAll()
})

describe('Menu', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(Menu)
    })

    it('createElement returns a Menu instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Menu)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('default props', () => {
    it('mode defaults to "flyout"', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.mode).to.equal('flyout')
    })

    it('orientation defaults to "horizontal"', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.orientation).to.equal('horizontal')
    })

    it('trigger defaults to "click"', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.trigger).to.equal('click')
    })

    it('selectedKey is initially undefined', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.selectedKey).to.be.undefined
    })
  })

  describe('structure', () => {
    it('renders a .menu-list container', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.menu-list')).to.exist
    })

    it('menu-list has role="menubar" when orientation is horizontal', async () => {
      const el = await mount<Menu>(`<${TAG} orientation="horizontal"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.menu-list')!.getAttribute('role')).to.equal('menubar')
    })

    it('menu-list has role="menu" when orientation is vertical', async () => {
      const el = await mount<Menu>(`<${TAG} orientation="vertical"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.menu-list')!.getAttribute('role')).to.equal('menu')
    })

    it('adds .menu-list--horizontal class when orientation is horizontal', async () => {
      const el = await mount<Menu>(`<${TAG} orientation="horizontal"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.menu-list--horizontal')).to.exist
    })

    it('does not add .menu-list--horizontal when orientation is vertical', async () => {
      const el = await mount<Menu>(`<${TAG} orientation="vertical"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.menu-list--horizontal')).to.not.exist
    })

    it('has a default slot', async () => {
      const el = await mount<Menu>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('slot:not([name])')).to.exist
    })
  })

  describe('select event', () => {
    it('emits "select" when a leaf item is clicked', async () => {
      const el = await mount<Menu>(`
        <${TAG}>
          <${ITEM_TAG} key="home">Home</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      let detail: any
      el.addEventListener('select', (e: Event) => {
        detail = (e as CustomEvent).detail
      })

      const item = el.querySelector(ITEM_TAG) as MenuItem
      item.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()

      expect(detail).to.exist
      expect(detail.key).to.equal('home')
      expect(detail.label).to.equal('Home')
    })

    it('select event detail includes keyPath', async () => {
      const el = await mount<Menu>(`
        <${TAG}>
          <${ITEM_TAG} key="products" label="Products">
            <${ITEM_TAG} key="web">Web</${ITEM_TAG}>
          </${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      let detail: any
      el.addEventListener('select', (e: Event) => {
        detail = (e as CustomEvent).detail
      })

      const parentItem = el.querySelector(`[key="products"]`) as MenuItem
      // Open the parent first (flyout)
      parentItem.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()

      const leafItem = el.querySelector(`[key="web"]`) as MenuItem
      leafItem.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()

      expect(detail.key).to.equal('web')
      expect(detail.keyPath).to.deep.equal(['products', 'web'])
    })

    it('updates selectedKey after a leaf is selected', async () => {
      const el = await mount<Menu>(`
        <${TAG}>
          <${ITEM_TAG} key="home">Home</${ITEM_TAG}>
          <${ITEM_TAG} key="about">About</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      const home = el.querySelector(`[key="home"]`) as MenuItem
      home.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()

      expect(el.selectedKey).to.equal('home')
    })

    it('sets selected=true on the clicked item and false on others', async () => {
      const el = await mount<Menu>(`
        <${TAG}>
          <${ITEM_TAG} key="home">Home</${ITEM_TAG}>
          <${ITEM_TAG} key="about">About</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      const home = el.querySelector(`[key="home"]`) as MenuItem
      const about = el.querySelector(`[key="about"]`) as MenuItem

      home.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()

      expect(home.selected).to.equal(true)
      expect(about.selected).to.equal(false)
    })
  })
})

describe('MenuItem', () => {
  describe('registration', () => {
    it(`is registered as "${ITEM_TAG}"`, () => {
      expect(customElements.get(ITEM_TAG)).to.equal(MenuItem)
    })

    it('createElement returns a MenuItem instance with a shadow root', () => {
      const el = document.createElement(ITEM_TAG)
      expect(el).to.be.instanceOf(MenuItem)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('leaf item (no label)', () => {
    it('renders a button with role="menuitem" by default', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="home">Home</${ITEM_TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector('button')
      expect(btn).to.exist
      expect(btn!.getAttribute('role')).to.equal('menuitem')
    })

    it('renders an anchor when href is provided', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="link" href="/page">Link</${ITEM_TAG}>`)
      await updated()
      const anchor = el.shadowRoot!.querySelector('a')
      expect(anchor).to.exist
      expect(anchor!.getAttribute('href')).to.equal('/page')
    })

    it('does not render anchor href when disabled', async () => {
      const el = await mount<MenuItem>(
        `<${ITEM_TAG} key="link" href="/page" disabled>Link</${ITEM_TAG}>`
      )
      await updated()
      const anchor = el.shadowRoot!.querySelector('a')
      expect(anchor).to.exist
      expect(anchor!.getAttribute('href')).to.be.null
    })

    it('disabled button has disabled attribute', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="x" disabled>X</${ITEM_TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button')
      expect(btn!.disabled).to.equal(true)
    })

    it('dispatches _menu-item-select event on click', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="home">Home</${ITEM_TAG}>`)
      await updated()

      let detail: any
      document.addEventListener('_menu-item-select', (e: Event) => {
        detail = (e as CustomEvent).detail
      }, { once: true })

      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()

      expect(detail).to.exist
      expect(detail.key).to.equal('home')
    })

    it('does not dispatch _menu-item-select when disabled', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="home" disabled>Home</${ITEM_TAG}>`)
      await updated()

      let fired = false
      el.addEventListener('_menu-item-select', () => { fired = true })
      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()

      expect(fired).to.equal(false)
    })
  })

  describe('parent item (with label)', () => {
    it('renders a trigger button when label is set', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="products" label="Products">
          <${ITEM_TAG} key="web">Web</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      const btn = el.shadowRoot!.querySelector('button')
      expect(btn).to.exist
    })

    it('trigger button has aria-haspopup="menu"', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button')
      expect(btn!.getAttribute('aria-haspopup')).to.equal('menu')
    })

    it('aria-expanded reflects open state', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button')
      expect(btn!.getAttribute('aria-expanded')).to.equal('false')

      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()

      expect(btn!.getAttribute('aria-expanded')).to.equal('true')
    })

    it('open defaults to false', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="p" label="P">...</${ITEM_TAG}>`)
      expect(el.open).to.equal(false)
    })

    it('clicking the trigger button toggles open', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()

      expect(el.open).to.equal(false)
      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()
      expect(el.open).to.equal(true)

      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      await updated()
      expect(el.open).to.equal(false)
    })

    it('renders a flyout submenu-panel by default', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      expect(el.shadowRoot!.querySelector('.submenu-panel')).to.exist
    })

    it('submenu-panel has "open" class when open=true', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      expect(el.shadowRoot!.querySelector('.submenu-panel.open')).to.not.exist

      el.open = true
      await updated()
      expect(el.shadowRoot!.querySelector('.submenu-panel.open')).to.exist
    })

    it('renders inline submenu-inline when inside mode="inline" menu', async () => {
      const menu = await mount<Menu>(`
        <${TAG} mode="inline" orientation="vertical">
          <${ITEM_TAG} key="p" label="Parent">
            <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
          </${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      const parentItem = menu.querySelector(`[key="p"]`) as MenuItem
      expect(parentItem.shadowRoot!.querySelector('.submenu-inline')).to.exist
      expect(parentItem.shadowRoot!.querySelector('.submenu-panel')).to.not.exist
    })

    it('submenu-panel gets placement-bottom in horizontal menu', async () => {
      const menu = await mount<Menu>(`
        <${TAG} orientation="horizontal">
          <${ITEM_TAG} key="p" label="Parent">
            <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
          </${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      const parentItem = menu.querySelector(`[key="p"]`) as MenuItem
      expect(parentItem.shadowRoot!.querySelector('.submenu-panel.placement-bottom')).to.exist
    })

    it('submenu-panel gets placement-right in vertical menu', async () => {
      const menu = await mount<Menu>(`
        <${TAG} orientation="vertical">
          <${ITEM_TAG} key="p" label="Parent">
            <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
          </${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()

      const parentItem = menu.querySelector(`[key="p"]`) as MenuItem
      expect(parentItem.shadowRoot!.querySelector('.submenu-panel.placement-right')).to.exist
    })

    it('Escape key closes open submenu', async () => {
      const el = await mount<MenuItem>(`
        <${ITEM_TAG} key="p" label="Parent">
          <${ITEM_TAG} key="c">Child</${ITEM_TAG}>
        </${ITEM_TAG}>
      `)
      await updated()
      el.open = true
      await updated()

      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button')!
      btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await updated()

      expect(el.open).to.equal(false)
    })
  })

  describe('selected prop', () => {
    it('defaults to false', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="x">X</${ITEM_TAG}>`)
      expect(el.selected).to.equal(false)
    })

    it('selected=true reflects as attribute', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="x" selected>X</${ITEM_TAG}>`)
      await updated()
      expect(el.hasAttribute('selected')).to.equal(true)
    })
  })

  describe('key prop', () => {
    it('stores the key value', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="my-key">Item</${ITEM_TAG}>`)
      expect(el.key).to.equal('my-key')
    })

    it('key is included in _menu-item-select detail', async () => {
      const el = await mount<MenuItem>(`<${ITEM_TAG} key="foo">Foo</${ITEM_TAG}>`)
      await updated()

      let detail: any
      el.addEventListener('_menu-item-select', (e: Event) => {
        detail = (e as CustomEvent).detail
      })

      el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click()
      expect(detail.key).to.equal('foo')
    })
  })
})
