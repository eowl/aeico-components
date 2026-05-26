import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Icon from '../../src/icon/icon.js'
import IconRegistry from '../../src/icon/registry.js'

const TAG_NAME = 'ae-icon'

// A simple fill path and a stroke-flagged path for tests
const FILL_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
const STROKE_PATH = 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35'

before(async () => {
  Icon.register()
  await whenDefined(TAG_NAME)

  IconRegistry.add({
    'test-star':   FILL_PATH,
    'test-search': { path: STROKE_PATH, stroke: true, strokeWidth: 2 },
    'test-thick':  { path: STROKE_PATH, stroke: true, strokeWidth: 3 },
  })
})

afterEach(() => {
  unmountAll()
})

describe('Icon', () => {
  describe('registration', () => {
    it('is registered as ae-icon', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Icon)
    })

    it('createElement returns an Icon instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Icon)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('rendering', () => {
    it('renders nothing when name is absent', async () => {
      const el = await mount<Icon>(`<${TAG_NAME}></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg')
      expect(svg).to.not.exist
    })

    it('renders nothing for an unregistered name', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="not-registered"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg')
      expect(svg).to.not.exist
    })

    it('renders an SVG for a registered name', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg).to.exist
    })

    it('renders a <path> inside the SVG', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      const path = el.shadowRoot?.querySelector('svg.icon-svg path')
      expect(path).to.exist
      expect(path!.getAttribute('d')).to.equal(FILL_PATH)
    })

    it('svg has aria-hidden="true"', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg!.getAttribute('aria-hidden')).to.equal('true')
    })

    it('uses defaultViewBox when registry entry has none', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 24 24')
    })

    it('uses custom viewBox from registry entry', async () => {
      IconRegistry.add({ 'test-custom-vb': { path: FILL_PATH, viewBox: '0 0 32 32' } })
      const el = await mount<Icon>(`<${TAG_NAME} name="test-custom-vb"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 32 32')
    })
  })

  describe('name prop', () => {
    it('reflects name attribute', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      expect(el.getAttribute('name')).to.equal('test-star')
    })

    it('re-renders when name changes', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      el.setAttribute('name', 'test-search')
      await updated()
      const path = el.shadowRoot?.querySelector('svg.icon-svg path')
      expect(path!.getAttribute('d')).to.equal(STROKE_PATH)
    })

    it('removes SVG when name is cleared', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      el.removeAttribute('name')
      await updated()
      expect(el.shadowRoot?.querySelector('svg')).to.not.exist
    })
  })

  describe('size prop', () => {
    const stringSizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of stringSizes) {
      it(`reflects size="${size}" as attribute`, async () => {
        const el = await mount<Icon>(`<${TAG_NAME} name="test-star" size="${size}"></${TAG_NAME}>`)
        expect(el.getAttribute('size')).to.equal(size)
      })
    }

    it('sets inline font-size for numeric size', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" size="32"></${TAG_NAME}>`)
      expect(el.style.fontSize).to.equal('32px')
    })

    it('removes inline font-size for string size', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" size="lg"></${TAG_NAME}>`)
      expect(el.style.fontSize).to.equal('')
    })
  })

  describe('color prop', () => {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const

    for (const color of colors) {
      it(`reflects color="${color}" as attribute`, async () => {
        const el = await mount<Icon>(`<${TAG_NAME} name="test-star" color="${color}"></${TAG_NAME}>`)
        expect(el.getAttribute('color')).to.equal(color)
      })
    }

    it('has no color attribute by default', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      expect(el.hasAttribute('color')).to.be.false
    })
  })

  describe('stroke — registry default', () => {
    it('fill icon has no --icon-fill CSS var set', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('')
    })

    it('stroke registry icon sets --icon-fill to none', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-search"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('none')
    })

    it('stroke registry icon sets --icon-stroke to currentColor', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-search"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('currentColor')
    })

    it('stroke registry icon sets --icon-stroke-width from registry', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-thick"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke-width')).to.equal('3')
    })
  })

  describe('stroke prop — component override', () => {
    it('forces stroke on a fill icon (stroke attr)', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('none')
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('currentColor')
    })

    it('defaults strokeWidth to 2 when not specified', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke-width')).to.equal('2')
    })

    it('component strokeWidth overrides registry strokeWidth', async () => {
      // test-thick has strokeWidth=3 in registry; component stroke-width=1.5 should win
      const el = await mount<Icon>(`<${TAG_NAME} name="test-thick" stroke-width="1.5"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke-width')).to.equal('1.5')
    })

    it('component stroke=true overrides fill registry icon', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('none')
    })

    it('removes stroke CSS vars when stroke is removed', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke></${TAG_NAME}>`)
      el.removeAttribute('stroke')
      await updated()
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('')
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('')
    })
  })

  describe('IconRegistry', () => {
    it('get() returns undefined for unknown icon', () => {
      const { default: Reg } = { default: IconRegistry }
      expect(Reg.get('definitely-not-registered')).to.be.undefined
    })

    it('has() returns true for registered icon', () => {
      expect(IconRegistry.has('test-star')).to.be.true
    })

    it('has() returns false for unregistered icon', () => {
      expect(IconRegistry.has('nope')).to.be.false
    })

    it('string shorthand is normalised to IconDefinition with defaultViewBox', () => {
      IconRegistry.add({ 'test-shorthand': FILL_PATH })
      const def = IconRegistry.get('test-shorthand')
      expect(def).to.deep.equal({ path: FILL_PATH, viewBox: '0 0 24 24' })
    })

    it('object definition is stored as-is', () => {
      const def = IconRegistry.get('test-search')
      expect(def?.stroke).to.be.true
      expect(def?.strokeWidth).to.equal(2)
      expect(def?.path).to.equal(STROKE_PATH)
    })

    describe('addBuiltIn', () => {
      // Unique path used as a sentinel value across built-in tests
      const BUILTIN_PATH = 'M0 0h24v24H0z'

      it('registers an icon that can be retrieved', () => {
        IconRegistry.addBuiltIn({ 'test-bi-basic': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-basic')).to.exist
        expect(IconRegistry.get('test-bi-basic')?.path).to.equal(BUILTIN_PATH)
      })

      it('has() returns true for a built-in icon', () => {
        IconRegistry.addBuiltIn({ 'test-bi-has': BUILTIN_PATH })
        expect(IconRegistry.has('test-bi-has')).to.be.true
      })

      it('normalises string shorthand to IconDefinition with defaultViewBox', () => {
        IconRegistry.addBuiltIn({ 'test-bi-shorthand': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-shorthand')).to.deep.equal({
          path: BUILTIN_PATH,
          viewBox: '0 0 24 24',
        })
      })

      it('stores object definition as-is', () => {
        IconRegistry.addBuiltIn({ 'test-bi-obj': { path: BUILTIN_PATH, stroke: true, strokeWidth: 1.5 } })
        const def = IconRegistry.get('test-bi-obj')
        expect(def?.stroke).to.be.true
        expect(def?.strokeWidth).to.equal(1.5)
        expect(def?.path).to.equal(BUILTIN_PATH)
      })

      it('does NOT overwrite an icon previously registered via add()', () => {
        const userPath = 'M1 1h22v22H1z'
        IconRegistry.add({ 'test-bi-priority': userPath })
        IconRegistry.addBuiltIn({ 'test-bi-priority': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-priority')?.path).to.equal(userPath)
      })

      it('a subsequent add() call overwrites a built-in icon', () => {
        const userPath = 'M2 2h20v20H2z'
        IconRegistry.addBuiltIn({ 'test-bi-override': BUILTIN_PATH })
        IconRegistry.add({ 'test-bi-override': userPath })
        expect(IconRegistry.get('test-bi-override')?.path).to.equal(userPath)
      })

      it('add() then addBuiltIn() does not restore the built-in value', () => {
        const userPath = 'M3 3h18v18H3z'
        IconRegistry.addBuiltIn({ 'test-bi-no-restore': BUILTIN_PATH })
        IconRegistry.add({ 'test-bi-no-restore': userPath })
        // After user add(), addBuiltIn() must not clobber the user value
        IconRegistry.addBuiltIn({ 'test-bi-no-restore': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-no-restore')?.path).to.equal(userPath)
      })

      it('a second addBuiltIn() call updates the same built-in key', () => {
        const updatedPath = 'M4 4h16v16H4z'
        IconRegistry.addBuiltIn({ 'test-bi-update': BUILTIN_PATH })
        IconRegistry.addBuiltIn({ 'test-bi-update': updatedPath })
        expect(IconRegistry.get('test-bi-update')?.path).to.equal(updatedPath)
      })
    })
  })
})
