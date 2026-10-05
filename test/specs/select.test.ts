import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Select from '../../src/select/select'
import SelectOption from '../../src/select/select-option'

const TAG = 'ae-select'
const OPT_TAG = 'ae-select-option'

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

/** Get the trigger element from a Select shadow root */
function getTrigger(el: Select): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>('.trigger')!
}

/** Get the dropdown element from a Select shadow root */
function getDropdown(el: Select): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!
}

before(async () => {
  Select.define('select')
  SelectOption.define('select-option')
  await Promise.all([whenDefined(TAG), whenDefined(OPT_TAG)])
})

afterEach(() => {
  unmountAll()
})

describe('Select', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(Select)
    })

    it(`SelectOption is registered as "${OPT_TAG}"`, () => {
      expect(customElements.get(OPT_TAG)).to.equal(SelectOption)
    })

    it('createElement returns a Select instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Select)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('rendering', () => {
    it('renders .trigger and .dropdown inside shadow DOM', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      expect(getTrigger(el)).to.exist
      expect(getDropdown(el)).to.exist
    })

    it('shows placeholder text when no value is set', async () => {
      const el = await mount<Select>(`<${TAG} placeholder="Pick one"></${TAG}>`)
      await updated()
      const ph = el.shadowRoot!.querySelector('.placeholder')
      expect(ph).to.exist
      expect(ph!.textContent).to.equal('Pick one')
    })

    it('shows selected label from options prop', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      el.value = 'banana'
      await updated()
      const val = el.shadowRoot!.querySelector<HTMLElement>('.value:not(.placeholder)')
      expect(val).to.exist
      expect(val!.textContent).to.equal('Banana')
    })

    it('adds .disabled class to trigger when disabled', async () => {
      const el = await mount<Select>(`<${TAG} disabled></${TAG}>`)
      await updated()
      expect(getTrigger(el).classList.contains('disabled')).to.be.true
    })

    it('renders clear button when clearable', async () => {
      const el = await mount<Select>(`<${TAG} clearable></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.clear-btn')).to.exist
    })

    it('renders reset button when resettable', async () => {
      const el = await mount<Select>(`<${TAG} resettable></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.reset-btn')).to.exist
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('position prop', () => {
    it('defaults to position-bottom when position is not set', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      expect(getDropdown(el).classList.contains('position-bottom')).to.be.true
    })

    for (const pos of ['bottom', 'top', 'left', 'right'] as const) {
      it(`adds .position-${pos} class to dropdown`, async () => {
        const el = await mount<Select>(`<${TAG} position="${pos}"></${TAG}>`)
        await updated()
        expect(getDropdown(el).classList.contains(`position-${pos}`)).to.be.true
      })
    }
  })

  describe('single-select value', () => {
    it('reflects value attribute to the value prop', async () => {
      const el = await mount<Select>(`<${TAG} value="apple"></${TAG}>`)
      await updated()
      expect(el.value).to.equal('apple')
    })

    it('shows selected label after setting value via JS prop', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      el.value = 'cherry'
      await updated()
      expect(
        el.shadowRoot!.querySelector<HTMLElement>('.value:not(.placeholder)')?.textContent,
      ).to.equal('Cherry')
    })

    it('shows placeholder again after value is cleared to empty string', async () => {
      const el = await mount<Select>(`<${TAG} placeholder="Pick one"></${TAG}>`)
      el.options = FRUITS
      el.value = 'apple'
      await updated()
      el.value = ''
      await updated()
      expect(el.shadowRoot!.querySelector('.placeholder')).to.exist
    })
  })

  describe('dropdown open/close', () => {
    it('opens dropdown when trigger is clicked', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      getTrigger(el).click()
      expect(getDropdown(el).classList.contains('open')).to.be.true
    })

    it('closes dropdown when trigger is clicked a second time', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      getTrigger(el).click()
      getTrigger(el).click()
      expect(getDropdown(el).classList.contains('open')).to.be.false
    })

    it('does not open when the component is disabled', async () => {
      const el = await mount<Select>(`<${TAG} disabled></${TAG}>`)
      await updated()
      getTrigger(el).click()
      expect(getDropdown(el).classList.contains('open')).to.be.false
    })

    it('renders the dropdown as a popover (top layer) when supported', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      const dd = getDropdown(el)
      if (!('popover' in HTMLElement.prototype)) return // fallback browser
      expect(dd.hasAttribute('popover')).to.be.true
      getTrigger(el).click()
      await updated()
      expect(dd.matches(':popover-open')).to.be.true
    })

    it('closes the dropdown on Escape key (light dismiss)', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      if (!('popover' in HTMLElement.prototype)) return // fallback browser
      getTrigger(el).click()
      await updated()
      expect(getDropdown(el).matches(':popover-open')).to.be.true

      getDropdown(el).dispatchEvent(
        new ToggleEvent('toggle', { newState: 'closed', oldState: 'open' }),
      )
      await updated()

      expect(getDropdown(el).classList.contains('open')).to.be.false
    })

    it('closes the dropdown on outside click (light dismiss)', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      if (!('popover' in HTMLElement.prototype)) return // fallback browser
      getTrigger(el).click()
      await updated()

      getDropdown(el).hidePopover()
      await updated()
      await new Promise((r) => setTimeout(r, 0))

      expect(getDropdown(el).matches(':popover-open')).to.be.false
      expect(getDropdown(el).classList.contains('open')).to.be.false
    })

    it('positions the dropdown with fixed coordinates in popover mode', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      await updated()
      if (!('popover' in HTMLElement.prototype)) return // fallback browser
      getTrigger(el).click()
      await updated()

      const dd = getDropdown(el)
      expect(dd.style.position).to.equal('')
      expect(dd.style.top).to.not.be.empty
      expect(dd.style.left).to.not.be.empty
      expect(dd.classList.contains('position-top')).to.be.false
    })

    it('flips to position-top when there is no room below', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      // Push the select near the bottom of the viewport
      el.style.position = 'fixed'
      el.style.top = `${window.innerHeight - 50}px`
      el.style.left = '10px'
      el.style.width = '200px'
      await updated()
      if (!('popover' in HTMLElement.prototype)) return // fallback browser
      getTrigger(el).click()
      await updated()

      expect(getDropdown(el).classList.contains('position-top')).to.be.true
    })
  })

  describe('option selection - options prop', () => {
    it('clicking an option sets the value and closes the dropdown', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      await updated()
      getTrigger(el).click()
      await updated()

      const opt = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!
      opt.click()
      await updated()

      expect(el.value).to.equal('apple')
      expect(getDropdown(el).classList.contains('open')).to.be.false
    })

    it('fires a change event with the selected value', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      await updated()
      getTrigger(el).click()

      let eventValue: unknown
      el.addEventListener('change', (e: Event) => {
        eventValue = (e as CustomEvent).detail?.value
      })

      el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="banana"]`)!.click()
      await updated()

      expect(eventValue).to.equal('banana')
    })

    it('selected option gets the [selected] attribute', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      el.value = 'cherry'
      await updated()

      const opt = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="cherry"]`)!
      expect(opt.hasAttribute('selected')).to.be.true
    })

    it('unselected options do not carry the [selected] attribute', async () => {
      const el = await mount<Select>(`<${TAG}></${TAG}>`)
      el.options = FRUITS
      el.value = 'cherry'
      await updated()

      const opt = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!
      expect(opt.hasAttribute('selected')).to.be.false
    })
  })

  describe('option selection - slot mode', () => {
    it('clicking a slot option selects it and fires change event', async () => {
      const el = await mount<Select>(`
        <${TAG}>
          <${OPT_TAG} value="a">Alpha</${OPT_TAG}>
          <${OPT_TAG} value="b">Beta</${OPT_TAG}>
        </${TAG}>
      `)
      await updated()
      getTrigger(el).click()

      let eventValue: unknown
      el.addEventListener('change', (e: Event) => {
        eventValue = (e as CustomEvent).detail?.value
      })

      el.querySelector<HTMLElement>(`${OPT_TAG}[value="b"]`)!.click()
      await updated()

      expect(el.value).to.equal('b')
      expect(eventValue).to.equal('b')
    })

    it('does not fire change when a disabled slot option is clicked', async () => {
      const el = await mount<Select>(`
        <${TAG}>
          <${OPT_TAG} value="a">Alpha</${OPT_TAG}>
          <${OPT_TAG} value="b" disabled>Beta</${OPT_TAG}>
        </${TAG}>
      `)
      await updated()
      getTrigger(el).click()

      let fired = false
      el.addEventListener('change', () => { fired = true })

      el.querySelector<HTMLElement>(`${OPT_TAG}[value="b"]`)!.click()
      await updated()

      expect(fired).to.be.false
    })
  })

  describe('clear and reset', () => {
    it('clear button fires change event and empties the value', async () => {
      const el = await mount<Select>(`<${TAG} clearable></${TAG}>`)
      el.options = FRUITS
      el.value = 'apple'
      await updated()

      let eventAction: unknown
      el.addEventListener('change', (e: Event) => {
        eventAction = (e as CustomEvent).detail?.action
      })

      el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')!.click()
      await updated()

      expect(el.value == null || el.value === '').to.be.true
      expect(eventAction).to.equal('clear')
    })

    it('reset button restores the defaultValue', async () => {
      const el = await mount<Select>(`<${TAG} resettable value="apple" default-value="banana"></${TAG}>`)
      el.options = FRUITS
      await updated()

      el.shadowRoot!.querySelector<HTMLElement>('.reset-btn')!.click()
      await updated()

      expect(el.value).to.equal('banana')
    })
  })

  describe('multiple mode', () => {
    it('renders a tag (ae-tag) for each selected value', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'cherry']
      await updated()

      const tags = el.shadowRoot!.querySelectorAll('ae-tag')
      expect(tags.length).to.equal(2)
    })

    it('tag labels reflect the option labels (not values)', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'banana']
      await updated()

      const labels = Array.from(
        el.shadowRoot!.querySelectorAll('ae-tag'),
      ).map(t => t.textContent?.trim())
      expect(labels).to.include('Apple')
      expect(labels).to.include('Banana')
    })

    it('clicking an unselected option adds it to the value array', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = []
      await updated()
      getTrigger(el).click()
      await updated()

      el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!.click()
      await updated()

      expect(Array.isArray(el.value)).to.be.true
      expect((el.value as string[]).includes('apple')).to.be.true
    })

    it('clicking a selected option removes it from the value array', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'banana']
      await updated()
      getTrigger(el).click()
      await updated()

      el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!.click()
      await updated()

      const vals = el.value as string[]
      expect(vals.includes('apple')).to.be.false
      expect(vals.includes('banana')).to.be.true
    })

    it('dropdown stays open after toggling an option in multiple mode', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      await updated()
      getTrigger(el).click()
      await updated()

      el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!.click()
      await updated()

      expect(getDropdown(el).classList.contains('open')).to.be.true
    })

    it('clicking × on a tag removes that item from the value', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'banana']
      await updated()

      // Tags are rendered in order of the value array; first tag = "apple"
      const firstTag = el.shadowRoot!.querySelector<HTMLElement>('ae-tag')!
      firstTag.shadowRoot!.querySelector<HTMLElement>('.tag-dismiss')!.click()
      await updated()

      const vals = el.value as string[]
      expect(vals.includes('apple')).to.be.false
      expect(vals.includes('banana')).to.be.true
    })

    it('fires change event with an array value', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      await updated()
      getTrigger(el).click()
      await updated()

      let eventValue: unknown
      el.addEventListener('change', (e: Event) => {
        eventValue = (e as CustomEvent).detail?.value
      })

      el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="cherry"]`)!.click()
      await updated()

      expect(Array.isArray(eventValue)).to.be.true
      expect((eventValue as string[]).includes('cherry')).to.be.true
    })

    it('selected options carry the [selected] attribute', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'cherry']
      await updated()

      const apple = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="apple"]`)!
      const banana = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="banana"]`)!
      const cherry = el.shadowRoot!.querySelector<HTMLElement>(`${OPT_TAG}[value="cherry"]`)!
      expect(apple.hasAttribute('selected')).to.be.true
      expect(banana.hasAttribute('selected')).to.be.false
      expect(cherry.hasAttribute('selected')).to.be.true
    })

    it('value survives JSON round-trip (array stored as attribute)', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.value = ['x', 'y']
      await updated()
      // Reading back from the attribute should return the same array
      const attr = el.getAttribute('value')
      expect(attr).to.equal('["x","y"]')
      expect(JSON.parse(attr!)).to.deep.equal(['x', 'y'])
    })
  })

  describe('expandable prop', () => {
    it('defaults expandable to false (attribute absent)', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      await updated()
      expect(el.expandable).to.not.be.true
    })

    it('selected-list has --clipped class when expandable=false', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple']
      await updated()
      const list = el.shadowRoot!.querySelector('.selected-list')
      expect(list!.classList.contains('selected-list--clipped')).to.be.true
    })

    it('selected-list does NOT have --clipped class when expandable=true', async () => {
      const el = await mount<Select>(`<${TAG} multiple expandable></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple']
      await updated()
      const list = el.shadowRoot!.querySelector('.selected-list')
      expect(list!.classList.contains('selected-list--clipped')).to.be.false
    })

    it('no overflow-indicator when expandable=true even with many items', async () => {
      const el = await mount<Select>(`<${TAG} multiple expandable style="max-width:120px"></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'banana', 'cherry']
      await updated()
      await updated() // second cycle for onUpdated overflow check
      expect(el.shadowRoot!.querySelector('.overflow-indicator')).to.be.null
    })

    it('overflow-indicator absent when only one item fits (not yet overflowing)', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple']
      await updated()
      await updated()
      // With a single item there is no overflow; indicator should not be present
      expect(el.shadowRoot!.querySelector('.overflow-indicator')).to.be.null
    })

    it('sets expandable via attribute', async () => {
      const el = await mount<Select>(`<${TAG} multiple expandable></${TAG}>`)
      await updated()
      expect(el.expandable).to.equal(true)
    })

    it('clipped list resets when switching from expandable=false to expandable=true', async () => {
      const el = await mount<Select>(`<${TAG} multiple></${TAG}>`)
      el.options = FRUITS
      el.value = ['apple', 'banana']
      await updated()
      await updated()
      // Now switch to expandable
      el.expandable = true
      await updated()
      await updated()
      const list = el.shadowRoot!.querySelector('.selected-list')
      expect(list!.classList.contains('selected-list--clipped')).to.be.false
    })
  })
})
