import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Dropdown from '../../src/dropdown/dropdown.js'
import DropdownItem from '../../src/dropdown/dropdown-item.js'

const TAG = 'ae-dropdown'
const ITEM_TAG = 'ae-dropdown-item'

before(async () => {
  Dropdown.define('dropdown')
  DropdownItem.define('dropdown-item')
  await Promise.all([whenDefined(TAG), whenDefined(ITEM_TAG)])
})

afterEach(() => {
  unmountAll()
})

describe('Dropdown', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(Dropdown)
    })

    it('createElement returns a Dropdown instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Dropdown)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('structure', () => {
    it('renders a trigger-wrapper div', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.trigger-wrapper')).to.exist
    })

    it('renders a panel div with role="menu"', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      const panel = el.shadowRoot!.querySelector('.panel')
      expect(panel).to.exist
      expect(panel!.getAttribute('role')).to.equal('menu')
    })

    it('renders a trigger slot when no label prop is set', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('slot[name="trigger"]')).to.exist
    })

    it('renders an internal trigger-label button when label prop is set', async () => {
      const el = await mount<Dropdown>(`<${TAG} label="Menu"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('button.trigger-label')).to.exist
      expect(el.shadowRoot!.querySelector('slot[name="trigger"]')).to.not.exist
    })
  })

  describe('placement prop', () => {
    it('defaults to "bottom-start"', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.placement).to.equal('bottom-start')
    })

    it('reflects placement attribute', async () => {
      const el = await mount<Dropdown>(`<${TAG} placement="bottom-end"></${TAG}>`)
      expect(el.placement).to.equal('bottom-end')
    })

    it('adds a placement class to the panel', async () => {
      const el = await mount<Dropdown>(`<${TAG} placement="top-start"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.panel.placement-top-start')).to.exist
    })
  })

  describe('open prop', () => {
    it('defaults to false', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.open).to.equal(false)
    })

    it('panel is hidden when open is false', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      const panel = el.shadowRoot!.querySelector('.panel')!
      expect(panel.classList.contains('open')).to.be.false
    })

    it('panel has class "open" when open attribute is set', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      const panel = el.shadowRoot!.querySelector('.panel')!
      expect(panel.classList.contains('open')).to.be.true
    })
  })

  describe('disabled prop', () => {
    it('defaults to false', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.disabled).to.equal(false)
    })

    it('reflects disabled attribute', async () => {
      const el = await mount<Dropdown>(`<${TAG} disabled></${TAG}>`)
      expect(el.disabled).to.equal(true)
    })
  })

  describe('closeOnSelect prop', () => {
    it('defaults to true', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      expect(el.closeOnSelect).to.equal(true)
    })
  })

  describe('show()', () => {
    it('sets open to true and emits "open" event', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      let fired = false
      el.addEventListener('open', () => { fired = true })
      el.show()
      expect(el.open).to.equal(true)
      expect(fired).to.be.true
    })

    it('does nothing when already open', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      let count = 0
      el.addEventListener('open', () => count++)
      el.show()
      expect(count).to.equal(0)
    })

    it('does nothing when disabled', async () => {
      const el = await mount<Dropdown>(`<${TAG} disabled></${TAG}>`)
      el.show()
      expect(el.open).to.equal(false)
    })
  })

  describe('hide()', () => {
    it('sets open to false and emits "close" event', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      let fired = false
      el.addEventListener('close', () => { fired = true })
      el.hide()
      expect(el.open).to.equal(false)
      expect(fired).to.be.true
    })

    it('does nothing when already closed', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      let count = 0
      el.addEventListener('close', () => count++)
      el.hide()
      expect(count).to.equal(0)
    })
  })

  describe('toggle()', () => {
    it('opens when closed', async () => {
      const el = await mount<Dropdown>(`<${TAG}></${TAG}>`)
      el.toggle()
      expect(el.open).to.equal(true)
    })

    it('closes when open', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      el.toggle()
      expect(el.open).to.equal(false)
    })
  })

  describe('item selection', () => {
    it('emits "select" with value and label when an item is clicked', async () => {
      const el = await mount<Dropdown>(`
        <${TAG}>
          <ae-button slot="trigger">Trigger</ae-button>
          <${ITEM_TAG} value="edit">Edit</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()

      let detail: Record<string, unknown> = {}
      el.addEventListener('select', (e) => { detail = (e as CustomEvent).detail })

      const item = el.querySelector<HTMLElement>(ITEM_TAG)!
      item.click()

      expect(detail.value).to.equal('edit')
      expect(detail.label).to.equal('Edit')
    })

    it('closes the panel after selection when closeOnSelect is true', async () => {
      const el = await mount<Dropdown>(`
        <${TAG}>
          <ae-button slot="trigger">Trigger</ae-button>
          <${ITEM_TAG} value="x">Item</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()
      el.querySelector<HTMLElement>(ITEM_TAG)!.click()
      expect(el.open).to.equal(false)
    })

    it('keeps the panel open after selection when close-on-select is false', async () => {
      const el = await mount<Dropdown>(`
        <${TAG} close-on-select="false">
          <ae-button slot="trigger">Trigger</ae-button>
          <${ITEM_TAG} value="x">Item</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()
      el.querySelector<HTMLElement>(ITEM_TAG)!.click()
      expect(el.open).to.equal(true)
    })

    it('does not emit select for a disabled item', async () => {
      const el = await mount<Dropdown>(`
        <${TAG}>
          <ae-button slot="trigger">Trigger</ae-button>
          <${ITEM_TAG} value="x" disabled>Item</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()

      let fired = false
      el.addEventListener('select', () => { fired = true })

      el.querySelector<HTMLElement>(ITEM_TAG)!.click()
      expect(fired).to.be.false
      expect(el.open).to.equal(true)
    })
  })

  describe('keyboard', () => {
    it('closes on Escape key', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      expect(el.open).to.equal(false)
    })

    it('does not close on other keys', async () => {
      const el = await mount<Dropdown>(`<${TAG} open></${TAG}>`)
      await updated()
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(el.open).to.equal(true)
    })
  })

  describe('DropdownItem', () => {
    describe('registration', () => {
      it(`is registered as "${ITEM_TAG}"`, () => {
        expect(customElements.get(ITEM_TAG)).to.equal(DropdownItem)
      })
    })

    it('renders a button by default', async () => {
      const item = await mount<DropdownItem>(`<${ITEM_TAG} value="x">Label</${ITEM_TAG}>`)
      await updated()
      expect(item.shadowRoot!.querySelector('button[part="item"]')).to.exist
    })

    it('renders an anchor when href is set', async () => {
      const item = await mount<DropdownItem>(`<${ITEM_TAG} href="/path">Link</${ITEM_TAG}>`)
      await updated()
      expect(item.shadowRoot!.querySelector('a[part="item"]')).to.exist
    })

    it('reflects disabled attribute', async () => {
      const item = await mount<DropdownItem>(`<${ITEM_TAG} disabled>X</${ITEM_TAG}>`)
      expect(item.disabled).to.equal(true)
    })

    it('has role="menuitem"', async () => {
      const item = await mount<DropdownItem>(`<${ITEM_TAG}>X</${ITEM_TAG}>`)
      expect(item.getAttribute('role')).to.equal('menuitem')
    })

    describe('active prop', () => {
      it('defaults to false', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG}>X</${ITEM_TAG}>`)
        expect(item.active).to.equal(false)
      })

      it('reflects active attribute', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} active>X</${ITEM_TAG}>`)
        expect(item.active).to.equal(true)
        expect(item.hasAttribute('active')).to.be.true
      })
    })

    describe('type="checkbox"', () => {
      it('defaults type to undefined', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG}>X</${ITEM_TAG}>`)
        expect(item.type).to.be.undefined
      })

      it('renders .check-indicator when type="checkbox"', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox">X</${ITEM_TAG}>`)
        await updated()
        expect(item.shadowRoot!.querySelector('.check-indicator')).to.exist
      })

      it('does not render .check-indicator for normal items', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG}>X</${ITEM_TAG}>`)
        await updated()
        expect(item.shadowRoot!.querySelector('.check-indicator')).to.not.exist
      })

      it('sets aria-checked="false" when unchecked', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox">X</${ITEM_TAG}>`)
        await updated()
        const btn = item.shadowRoot!.querySelector('[part="item"]')!
        expect(btn.getAttribute('aria-checked')).to.equal('false')
      })

      it('sets aria-checked="true" when checked', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox" checked>X</${ITEM_TAG}>`)
        await updated()
        const btn = item.shadowRoot!.querySelector('[part="item"]')!
        expect(btn.getAttribute('aria-checked')).to.equal('true')
      })

      it('toggles checked on click', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox">X</${ITEM_TAG}>`)
        expect(item.checked).to.equal(false)
        item.click()
        expect(item.checked).to.equal(true)
        item.click()
        expect(item.checked).to.equal(false)
      })

      it('emits _item-select with checked state in detail', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox" value="notify">Notify</${ITEM_TAG}>`)
        let detail: Record<string, unknown> = {}
        item.addEventListener('_item-select', (e) => { detail = (e as CustomEvent).detail })
        item.click()
        expect(detail.checked).to.equal(true)
        expect(detail.value).to.equal('notify')
      })

      it('does not toggle when disabled', async () => {
        const item = await mount<DropdownItem>(`<${ITEM_TAG} type="checkbox" disabled>X</${ITEM_TAG}>`)
        item.click()
        expect(item.checked).to.equal(false)
      })
    })
  })
})
