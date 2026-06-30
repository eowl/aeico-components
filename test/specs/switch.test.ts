import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Switch from '../../src/switch'
import IconRegistry from '../../src/icon/registry'

const TAG_NAME = 'ae-switch'

// Minimal icon paths for rendering tests
const ICON_PATH_A = 'M12 2v20 M2 12h20'
const ICON_PATH_B = 'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z'

before(async () => {
  Switch.register()
  await whenDefined(TAG_NAME)

  IconRegistry.add({
    'test-icon-a': ICON_PATH_A,
    'test-icon-b': ICON_PATH_B,
  })
})

afterEach(() => {
  unmountAll()
})

describe('Switch', () => {

  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Switch)
    })

    it('createElement returns a Switch instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Switch)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('rendering', () => {
    it('renders a checkbox input inside shadow DOM', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]')
      expect(input).to.exist
    })

    it('renders .toggle-slider inside shadow DOM', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.toggle-slider')).to.exist
    })

    it('is unchecked by default', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.checked).to.be.false
    })

    it('reflects checked attribute on the input', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} checked></${TAG_NAME}>`)
      await updated()
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.checked).to.be.true
    })

    it('reflects disabled attribute on the input', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} disabled></${TAG_NAME}>`)
      await updated()
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.disabled).to.be.true
    })
  })

  describe('value management', () => {
    it('getValue() returns false when unchecked', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect((el as any).getValue()).to.be.false
    })

    it('getValue() returns true when checked', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} checked></${TAG_NAME}>`)
      await updated()
      expect((el as any).getValue()).to.be.true
    })

    it('reset() restores to defaultChecked value', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} default-checked></${TAG_NAME}>`)
      await updated()
      el.reset()
      await updated()
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.checked).to.be.true
    })

    it('reset() with explicit value sets that value', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.reset(true)
      await updated()
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.checked).to.be.true
    })

    it('clear() sets checked to false', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} checked></${TAG_NAME}>`)
      await updated()
      el.clear()
      await updated()
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement
      expect(input.checked).to.be.false
    })
  })

  describe('icon rendering — no icon', () => {
    it('renders no .toggle-knob-icon when neither icon nor iconChecked is set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon')).to.not.exist
    })

    it('renders no .track-icon when neither icon nor iconChecked is set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.track-icon')).to.not.exist
    })
  })

  describe('icon rendering — knob mode', () => {
    it('renders a single .toggle-knob-icon when only icon is set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      const icons = el.shadowRoot!.querySelectorAll('.toggle-knob-icon')
      expect(icons.length).to.equal(1)
      expect(icons[0].classList.contains('icon-unchecked')).to.be.false
      expect(icons[0].classList.contains('icon-checked')).to.be.false
    })

    it('renders a single .toggle-knob-icon when only iconChecked is set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon-checked="test-icon-b"></${TAG_NAME}>`)
      await updated()
      const icons = el.shadowRoot!.querySelectorAll('.toggle-knob-icon')
      expect(icons.length).to.equal(1)
    })

    it('renders two .toggle-knob-icon elements when both icon and iconChecked are set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b"></${TAG_NAME}>`)
      await updated()
      const icons = el.shadowRoot!.querySelectorAll('.toggle-knob-icon')
      expect(icons.length).to.equal(2)
    })

    it('adds .icon-unchecked and .icon-checked classes on dual-icon knob', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon.icon-unchecked')).to.exist
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon.icon-checked')).to.exist
    })

    it('renders ae-icon inside .toggle-knob-icon', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      const aeIcon = el.shadowRoot!.querySelector('.toggle-knob-icon ae-icon')
      expect(aeIcon).to.exist
    })

    it('passes correct name to ae-icon in single-icon knob', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      const aeIcon = el.shadowRoot!.querySelector('.toggle-knob-icon ae-icon')
      expect(aeIcon!.getAttribute('name')).to.equal('test-icon-a')
    })

    it('passes correct names to ae-icons in dual-icon knob', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b"></${TAG_NAME}>`)
      await updated()
      const uncheckedIcon = el.shadowRoot!.querySelector('.toggle-knob-icon.icon-unchecked ae-icon')
      const checkedIcon = el.shadowRoot!.querySelector('.toggle-knob-icon.icon-checked ae-icon')
      expect(uncheckedIcon!.getAttribute('name')).to.equal('test-icon-a')
      expect(checkedIcon!.getAttribute('name')).to.equal('test-icon-b')
    })

    it('falls back to icon name when iconChecked is absent in single-icon mode', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      const aeIcon = el.shadowRoot!.querySelector('.toggle-knob-icon ae-icon')
      expect(aeIcon!.getAttribute('name')).to.equal('test-icon-a')
    })

    it('renders no .track-icon elements in knob mode', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.track-icon')).to.not.exist
    })

    it('is the default placement when icon-placement is not set', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon')).to.exist
      expect(el.shadowRoot!.querySelector('.track-icon')).to.not.exist
    })
  })

  describe('icon rendering — track mode', () => {
    it('renders .track-icon-left and .track-icon-right when icon-placement="track"', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.track-icon-left')).to.exist
      expect(el.shadowRoot!.querySelector('.track-icon-right')).to.exist
    })

    it('renders ae-icon inside .track-icon-left', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.track-icon-left ae-icon')).to.exist
    })

    it('renders ae-icon inside .track-icon-right', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.track-icon-right ae-icon')).to.exist
    })

    it('left track icon uses iconChecked name', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      const leftIcon = el.shadowRoot!.querySelector('.track-icon-left ae-icon')
      expect(leftIcon!.getAttribute('name')).to.equal('test-icon-b')
    })

    it('right track icon uses icon name', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      const rightIcon = el.shadowRoot!.querySelector('.track-icon-right ae-icon')
      expect(rightIcon!.getAttribute('name')).to.equal('test-icon-a')
    })

    it('falls back to icon for left track when iconChecked is absent', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      const leftIcon = el.shadowRoot!.querySelector('.track-icon-left ae-icon')
      expect(leftIcon!.getAttribute('name')).to.equal('test-icon-a')
    })

    it('falls back to iconChecked for right track when icon is absent', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      const rightIcon = el.shadowRoot!.querySelector('.track-icon-right ae-icon')
      expect(rightIcon!.getAttribute('name')).to.equal('test-icon-b')
    })

    it('renders no .toggle-knob-icon elements in track mode', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-checked="test-icon-b" icon-placement="track"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon')).to.not.exist
    })
  })

  describe('icon prop reflection', () => {
    it('reflects icon attribute', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      expect(el.getAttribute('icon')).to.equal('test-icon-a')
    })

    it('reflects icon-checked attribute', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon-checked="test-icon-b"></${TAG_NAME}>`)
      expect(el.getAttribute('icon-checked')).to.equal('test-icon-b')
    })

    it('reflects icon-placement attribute', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a" icon-placement="track"></${TAG_NAME}>`)
      expect(el.getAttribute('icon-placement')).to.equal('track')
    })

    it('re-renders when icon prop changes', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()

      el.icon = 'test-icon-b'
      await updated()

      const aeIcon = el.shadowRoot!.querySelector('.toggle-knob-icon ae-icon')
      expect(aeIcon!.getAttribute('name')).to.equal('test-icon-b')
    })

    it('removes icon elements when icon prop is cleared', async () => {
      const el = await mount<Switch>(`<${TAG_NAME} icon="test-icon-a"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon')).to.exist

      el.icon = undefined
      await updated()
      expect(el.shadowRoot!.querySelector('.toggle-knob-icon')).to.not.exist
    })
  })
})
