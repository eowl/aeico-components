import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import DropdownButton from '../../src/dropdown/dropdown-button.js'
import Dropdown from '../../src/dropdown/dropdown.js'
import DropdownItem from '../../src/dropdown/dropdown-item.js'
import Button from '../../src/button/button.js'
import ButtonGroup from '../../src/button-group/button-group.js'

const TAG = 'ae-dropdown-button'
const DROPDOWN_TAG = 'ae-dropdown'
const ITEM_TAG = 'ae-dropdown-item'
const BTN_TAG = 'ae-button'
const GROUP_TAG = 'ae-button-group'

before(async () => {
  DropdownButton.define('button')
  Dropdown.define('dropdown')
  DropdownItem.define('dropdown-item')
  Button.define('button')
  ButtonGroup.define('button-group')
  await Promise.all([
    whenDefined(TAG),
    whenDefined(DROPDOWN_TAG),
    whenDefined(ITEM_TAG),
    whenDefined(BTN_TAG),
    whenDefined(GROUP_TAG),
  ])
})

afterEach(() => {
  unmountAll()
})

describe('DropdownButton', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(DropdownButton)
    })

    it('createElement returns a DropdownButton instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(DropdownButton)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('structure', () => {
    it('renders an ae-dropdown in the shadow DOM', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector(DROPDOWN_TAG)).to.exist
    })

    it('renders an ae-button[slot="trigger"] inside ae-dropdown', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      const dropdown = el.shadowRoot!.querySelector(DROPDOWN_TAG)!
      expect(dropdown.querySelector(`${BTN_TAG}[slot="trigger"]`)).to.exist
    })

    it('has a slot[name="label"] inside the trigger button', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      const dropdown = el.shadowRoot!.querySelector(DROPDOWN_TAG)!
      const btn = dropdown.querySelector(`${BTN_TAG}[slot="trigger"]`)!
      expect(btn.shadowRoot ? btn.shadowRoot.querySelector('slot') : btn.querySelector('slot[name="label"]')).to.exist
    })
  })

  describe('variant prop', () => {
    it('defaults to "filled"', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.variant).to.equal('filled')
    })

    it('reflects variant attribute', async () => {
      const el = await mount<DropdownButton>(`<${TAG} variant="outlined"></${TAG}>`)
      expect(el.variant).to.equal('outlined')
    })

    it('passes variant to the internal ae-button', async () => {
      const el = await mount<DropdownButton>(`<${TAG} variant="subtle"></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector(DROPDOWN_TAG)!.querySelector<HTMLElement>(`${BTN_TAG}[slot="trigger"]`)!
      expect(btn.getAttribute('variant')).to.equal('subtle')
    })
  })

  describe('color prop', () => {
    it('defaults to "default"', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.color).to.equal('default')
    })

    it('passes color to the internal ae-button', async () => {
      const el = await mount<DropdownButton>(`<${TAG} color="primary"></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector(DROPDOWN_TAG)!.querySelector<HTMLElement>(`${BTN_TAG}[slot="trigger"]`)!
      expect(btn.getAttribute('color')).to.equal('primary')
    })
  })

  describe('size prop', () => {
    it('defaults to "md"', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.size).to.equal('md')
    })

    it('passes size to the internal ae-button', async () => {
      const el = await mount<DropdownButton>(`<${TAG} size="sm"></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector(DROPDOWN_TAG)!.querySelector<HTMLElement>(`${BTN_TAG}[slot="trigger"]`)!
      expect(btn.getAttribute('size')).to.equal('sm')
    })
  })

  describe('disabled prop', () => {
    it('defaults to false', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.disabled).to.equal(false)
    })

    it('passes disabled to the internal ae-button', async () => {
      const el = await mount<DropdownButton>(`<${TAG} disabled></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector(DROPDOWN_TAG)!.querySelector<HTMLElement>(`${BTN_TAG}[slot="trigger"]`)!
      expect(btn.hasAttribute('disabled')).to.be.true
    })
  })

  describe('placement prop', () => {
    it('defaults to "bottom-start"', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.placement).to.equal('bottom-start')
    })

    it('passes placement to the internal ae-dropdown', async () => {
      const el = await mount<DropdownButton>(`<${TAG} placement="bottom-end"></${TAG}>`)
      await updated()
      const dropdown = el.shadowRoot!.querySelector<HTMLElement>(DROPDOWN_TAG)!
      expect(dropdown.getAttribute('placement')).to.equal('bottom-end')
    })
  })

  describe('closeOnSelect prop', () => {
    it('defaults to true', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      expect(el.closeOnSelect).to.equal(true)
    })
  })

  describe('open getter', () => {
    it('returns false when the panel is closed', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.open).to.equal(false)
    })

    it('returns true after show() is called', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      el.show()
      expect(el.open).to.equal(true)
    })
  })

  describe('show()', () => {
    it('opens the internal dropdown', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      el.show()
      const dropdown = el.shadowRoot!.querySelector<Dropdown>(DROPDOWN_TAG)!
      expect(dropdown.open).to.equal(true)
    })

    it('does nothing when disabled', async () => {
      const el = await mount<DropdownButton>(`<${TAG} disabled></${TAG}>`)
      await updated()
      el.show()
      expect(el.open).to.equal(false)
    })
  })

  describe('hide()', () => {
    it('closes the internal dropdown', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      el.show()
      el.hide()
      expect(el.open).to.equal(false)
    })
  })

  describe('toggle()', () => {
    it('opens when closed', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      el.toggle()
      expect(el.open).to.equal(true)
    })

    it('closes when open', async () => {
      const el = await mount<DropdownButton>(`<${TAG}></${TAG}>`)
      await updated()
      el.show()
      el.toggle()
      expect(el.open).to.equal(false)
    })
  })

  describe('item selection', () => {
    it('emits "select" with value and label when an item is clicked', async () => {
      const el = await mount<DropdownButton>(`
        <${TAG}>
          <span slot="label">Actions</span>
          <${ITEM_TAG} value="edit">Edit</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()

      let detail: Record<string, unknown> = {}
      el.addEventListener('select', (e) => { detail = (e as CustomEvent).detail })

      el.querySelector<HTMLElement>(ITEM_TAG)!.click()

      expect(detail.value).to.equal('edit')
      expect(detail.label).to.equal('Edit')
    })

    it('closes the panel after selection by default', async () => {
      const el = await mount<DropdownButton>(`
        <${TAG}>
          <${ITEM_TAG} value="x">Item</${ITEM_TAG}>
        </${TAG}>
      `)
      await updated()
      el.show()
      el.querySelector<HTMLElement>(ITEM_TAG)!.click()
      expect(el.open).to.equal(false)
    })
  })

  describe('ae-button-group integration', () => {
    it('ae-button-group recognises ae-dropdown-button as a child', async () => {
      const group = await mount<ButtonGroup>(`
        <${GROUP_TAG} color="primary">
          <${BTN_TAG}>Save</${BTN_TAG}>
          <${TAG}><${ITEM_TAG} value="draft">Draft</${ITEM_TAG}></${TAG}>
        </${GROUP_TAG}>
      `)
      await updated()
      // If recognised, the group syncs color to the dropdown-button
      const db = group.querySelector<DropdownButton>(TAG)!
      expect(db.color).to.equal('primary')
    })

    it('sets compact corner radius CSS vars on ae-dropdown-button in compact mode', async () => {
      const group = await mount<ButtonGroup>(`
        <${GROUP_TAG} compact color="primary">
          <${BTN_TAG}>Save</${BTN_TAG}>
          <${TAG}><${ITEM_TAG} value="x">X</${ITEM_TAG}></${TAG}>
        </${GROUP_TAG}>
      `)
      await updated()
      const db = group.querySelector<HTMLElement>(TAG)!
      
      expect(db.style.getPropertyValue('--_btn-r-tr')).to.not.equal('0')
      expect(db.style.getPropertyValue('--_btn-r-tl')).to.equal('0')
    })
  })
})
