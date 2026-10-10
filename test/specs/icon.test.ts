import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Icon from '../../src/icon/icon.js'
import IconRegistry from '../../src/icon/registry.js'

const TAG_NAME = 'ae-icon'

// A simple fill path and a stroke-flagged path for tests
const FILL_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
const STROKE_PATH = 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35'
const MULTI_PATH_1 = 'M10 5l4-4 4 4'
const MULTI_PATH_2 = 'M10 19l4 4 4-4'

before(async () => {
  Icon.define('icon')
  await whenDefined(TAG_NAME)

  IconRegistry.add({
    'test-star':   FILL_PATH,
    'test-search': STROKE_PATH,
    'test-thick':  STROKE_PATH,
    'test-multi':  {
      paths: [
        { d: MULTI_PATH_1, fill: '#387eb8' },
        { d: MULTI_PATH_2, fill: '#ffe052' },
      ],
      viewBox: '0 0 24 24',
    },
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
      IconRegistry.add({ 'test-custom-vb': { paths: FILL_PATH, viewBox: '0 0 32 32' } })
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

  describe('stroke - component prop', () => {
    it('fill icon has no --icon-fill CSS var set', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('')
    })

    it('stroke prop sets --icon-fill to none', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-search" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('none')
    })

    it('stroke prop sets --icon-stroke to currentColor', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-search" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('currentColor')
    })

    it('defaults strokeWidth to 2 when not specified', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-search" stroke></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke-width')).to.equal('2')
    })

    it('strokeWidth prop sets --icon-stroke-width', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke stroke-width="1.5"></${TAG_NAME}>`)
      expect(el.style.getPropertyValue('--icon-stroke-width')).to.equal('1.5')
    })

    it('removes stroke CSS vars when stroke is removed', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-star" stroke></${TAG_NAME}>`)
      el.removeAttribute('stroke')
      await updated()
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('')
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('')
    })
  })

  describe('multi-path (IconPathDef[])', () => {
    it('renders multiple <path> elements', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-multi"></${TAG_NAME}>`)
      const paths = el.shadowRoot?.querySelectorAll('svg.icon-svg path')
      expect(paths?.length).to.equal(2)
    })

    it('each path has correct d attribute', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-multi"></${TAG_NAME}>`)
      const paths = el.shadowRoot?.querySelectorAll('svg.icon-svg path')
      expect(paths![0].getAttribute('d')).to.equal(MULTI_PATH_1)
      expect(paths![1].getAttribute('d')).to.equal(MULTI_PATH_2)
    })

    it('applies fill attribute from IconPathDef', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-multi"></${TAG_NAME}>`)
      const paths = el.shadowRoot?.querySelectorAll<SVGPathElement>('svg.icon-svg path')
      expect(paths![0].getAttribute('fill')).to.equal('#387eb8')
      expect(paths![1].getAttribute('fill')).to.equal('#ffe052')
    })

    it('clears stroke CSS vars in multi-path mode', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-multi" stroke></${TAG_NAME}>`)
      // stroke prop on component is ignored for multi-path icons
      expect(el.style.getPropertyValue('--icon-fill')).to.equal('')
      expect(el.style.getPropertyValue('--icon-stroke')).to.equal('')
    })
  })

  describe('defs and gradients', () => {
    before(() => {
      IconRegistry.add({
        'test-grad': {
          defs: [
            {
              type: 'linear',
              id: 'test-grad-1',
              stops: [
                { offset: 0, stopColor: '#387eb8' },
                { offset: 1, stopColor: '#9333ea' },
              ],
            },
          ],
          paths: [{ d: MULTI_PATH_1, fill: 'url(#test-grad-1)' }],
        },
        'test-grad-auto-id': {
          defs: [
            {
              type: 'radial',
              stops: [{ offset: 0, stopColor: 'red' }],
            },
          ],
          paths: [{ d: MULTI_PATH_1, fill: 'url(#ae-icon-grad-0)' }],
        },
      })
    })

    it('renders a <defs> element with a linearGradient', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-grad"></${TAG_NAME}>`)
      const grad = el.shadowRoot?.querySelector('svg.icon-svg defs linearGradient')
      expect(grad).to.exist
      expect(grad!.getAttribute('id')).to.equal('test-grad-1')
      expect(grad!.getAttribute('x1')).to.equal('0')
      expect(grad!.getAttribute('x2')).to.equal('1')
    })

    it('renders gradient stops', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-grad"></${TAG_NAME}>`)
      const stops = el.shadowRoot?.querySelectorAll('linearGradient stop')
      expect(stops?.length).to.equal(2)
      expect(stops![0].getAttribute('stop-color')).to.equal('#387eb8')
      expect(stops![1].getAttribute('offset')).to.equal('1')
    })

    it('path can reference a gradient via fill="url(#id)"', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-grad"></${TAG_NAME}>`)
      const path = el.shadowRoot?.querySelector('svg.icon-svg path')
      expect(path!.getAttribute('fill')).to.equal('url(#test-grad-1)')
    })

    it('generates a stable id when gradient id is omitted', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-grad-auto-id"></${TAG_NAME}>`)
      const grad = el.shadowRoot?.querySelector('svg.icon-svg defs radialGradient')
      expect(grad).to.exist
      expect(grad!.getAttribute('id')).to.equal('ae-icon-grad-0')
      expect(grad!.getAttribute('cx')).to.equal('0.5')
      expect(grad!.getAttribute('r')).to.equal('0.5')
    })
  })

  describe('multi-path stroke', () => {
    before(() => {
      IconRegistry.add({
        'test-multi-stroke': {
          paths: [
            { d: MULTI_PATH_1, stroke: true, strokeWidth: 1.5 },
            { d: MULTI_PATH_2, stroke: true },
          ],
        },
      })
    })

    it('applies stroke attributes per path', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-multi-stroke"></${TAG_NAME}>`)
      const paths = el.shadowRoot?.querySelectorAll('svg.icon-svg path')
      expect(paths![0].getAttribute('stroke')).to.equal('currentColor')
      expect(paths![0].getAttribute('stroke-width')).to.equal('1.5')
      expect(paths![0].getAttribute('fill')).to.equal('none')
      // Falls back to default stroke width of 2
      expect(paths![1].getAttribute('stroke-width')).to.equal('2')
    })
  })

  describe('raw svg registration', () => {
    const RAW_SVG =
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#387eb8"/></svg>'

    before(() => {
      IconRegistry.add({ 'test-raw': RAW_SVG })
      IconRegistry.add({ 'test-raw-obj': { rawSvg: RAW_SVG, viewBox: '0 0 48 48' } })
    })

    it('normalises raw svg string to an IconDefinition', () => {
      const def = IconRegistry.get('test-raw')
      expect(def && 'rawSvg' in def && def.rawSvg).to.equal(RAW_SVG)
    })

    it('renders raw svg markup inside the icon svg', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-raw"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg).to.exist
      expect(svg!.querySelector('circle')).to.exist
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 24 24')
    })

    it('IconRawSvg object can override the viewBox', async () => {
      const el = await mount<Icon>(`<${TAG_NAME} name="test-raw-obj"></${TAG_NAME}>`)
      const svg = el.shadowRoot?.querySelector('svg.icon-svg')
      expect(svg!.getAttribute('viewBox')).to.equal('0 0 48 48')
      expect(svg!.querySelector('circle')).to.exist
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
      expect(def).to.deep.equal({ paths: FILL_PATH, viewBox: '0 0 24 24' })
    })

    it('object definition is stored as-is (multi-path)', () => {
      const def = IconRegistry.get('test-multi')
      expect(def && 'paths' in def && Array.isArray(def.paths)).to.be.true
      const paths = (def as { paths: Array<{ d: string; fill?: string }> }).paths
      expect(paths[0].d).to.equal(MULTI_PATH_1)
      expect(paths[0].fill).to.equal('#387eb8')
      expect(paths[1].d).to.equal(MULTI_PATH_2)
      expect(paths[1].fill).to.equal('#ffe052')
    })

    describe('addBuiltIn', () => {
      // Unique path used as a sentinel value across built-in tests
      const BUILTIN_PATH = 'M0 0h24v24H0z'

      it('registers an icon that can be retrieved', () => {
        IconRegistry.addBuiltIn({ 'test-bi-basic': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-basic')).to.exist
        expect((IconRegistry.get('test-bi-basic') as { paths: string }).paths).to.equal(BUILTIN_PATH)
      })

      it('has() returns true for a built-in icon', () => {
        IconRegistry.addBuiltIn({ 'test-bi-has': BUILTIN_PATH })
        expect(IconRegistry.has('test-bi-has')).to.be.true
      })

      it('normalises string shorthand to IconDefinition with defaultViewBox', () => {
        IconRegistry.addBuiltIn({ 'test-bi-shorthand': BUILTIN_PATH })
        expect(IconRegistry.get('test-bi-shorthand')).to.deep.equal({
          paths: BUILTIN_PATH,
          viewBox: '0 0 24 24',
        })
      })

      it('stores object definition as-is', () => {
        IconRegistry.addBuiltIn({
          'test-bi-obj': { paths: [{ d: BUILTIN_PATH, fill: '#ff0000' }] },
        })
        const def = IconRegistry.get('test-bi-obj')
        const paths = (def as { paths: Array<{ d: string; fill?: string }> }).paths
        expect(Array.isArray(paths)).to.be.true
        expect(paths[0].d).to.equal(BUILTIN_PATH)
        expect(paths[0].fill).to.equal('#ff0000')
      })

      it('does NOT overwrite an icon previously registered via add()', () => {
        const userPath = 'M1 1h22v22H1z'
        IconRegistry.add({ 'test-bi-priority': userPath })
        IconRegistry.addBuiltIn({ 'test-bi-priority': BUILTIN_PATH })
        expect((IconRegistry.get('test-bi-priority') as { paths: string }).paths).to.equal(userPath)
      })

      it('a subsequent add() call overwrites a built-in icon', () => {
        const userPath = 'M2 2h20v20H2z'
        IconRegistry.addBuiltIn({ 'test-bi-override': BUILTIN_PATH })
        IconRegistry.add({ 'test-bi-override': userPath })
        expect((IconRegistry.get('test-bi-override') as { paths: string }).paths).to.equal(userPath)
      })

      it('add() then addBuiltIn() does not restore the built-in value', () => {
        const userPath = 'M3 3h18v18H3z'
        IconRegistry.addBuiltIn({ 'test-bi-no-restore': BUILTIN_PATH })
        IconRegistry.add({ 'test-bi-no-restore': userPath })
        // After user add(), addBuiltIn() must not clobber the user value
        IconRegistry.addBuiltIn({ 'test-bi-no-restore': BUILTIN_PATH })
        expect((IconRegistry.get('test-bi-no-restore') as { paths: string }).paths).to.equal(userPath)
      })

      it('a second addBuiltIn() call updates the same built-in key', () => {
        const updatedPath = 'M4 4h16v16H4z'
        IconRegistry.addBuiltIn({ 'test-bi-update': BUILTIN_PATH })
        IconRegistry.addBuiltIn({ 'test-bi-update': updatedPath })
        expect((IconRegistry.get('test-bi-update') as { paths: string }).paths).to.equal(updatedPath)
      })
    })

    describe('addInternal', () => {
      // Unique path used as a sentinel value across internal icon tests
      const INTERNAL_PATH = 'M0 0h24v24H0z'

      it('registers an icon that can be retrieved', () => {
        IconRegistry.addInternal({ '_test-internal': INTERNAL_PATH })
        expect(IconRegistry.get('_test-internal')).to.exist
        expect((IconRegistry.get('_test-internal') as { paths: string }).paths).to.equal(INTERNAL_PATH)
      })

      it('has() returns true for an internal icon', () => {
        IconRegistry.addInternal({ '_test-internal-has': INTERNAL_PATH })
        expect(IconRegistry.has('_test-internal-has')).to.be.true
      })

      it('normalises string shorthand to IconDefinition with defaultViewBox', () => {
        IconRegistry.addInternal({ '_test-internal-shorthand': INTERNAL_PATH })
        expect(IconRegistry.get('_test-internal-shorthand')).to.deep.equal({
          paths: INTERNAL_PATH,
          viewBox: '0 0 24 24',
        })
      })

      it('add() cannot override an internal icon', () => {
        const userPath = 'M5 5h14v14H5z'
        IconRegistry.addInternal({ '_test-internal-protected': INTERNAL_PATH })
        IconRegistry.add({ '_test-internal-protected': userPath })
        expect((IconRegistry.get('_test-internal-protected') as { paths: string }).paths).to.equal(INTERNAL_PATH)
      })

      it('addBuiltIn() cannot override an internal icon', () => {
        const biPath = 'M6 6h12v12H6z'
        IconRegistry.addInternal({ '_test-internal-vs-bi': INTERNAL_PATH })
        IconRegistry.addBuiltIn({ '_test-internal-vs-bi': biPath })
        expect((IconRegistry.get('_test-internal-vs-bi') as { paths: string }).paths).to.equal(INTERNAL_PATH)
      })

      it('rejects names without the "_" prefix', () => {
        IconRegistry.addInternal({ 'test-internal-noprefix': INTERNAL_PATH })
        expect(IconRegistry.has('test-internal-noprefix')).to.be.false
      })

      it('add() rejects reserved "_"-prefixed names', () => {
        IconRegistry.add({ '_test-user-reserved': INTERNAL_PATH })
        expect(IconRegistry.has('_test-user-reserved')).to.be.false
      })

      it('a user icon with a non-reserved name is unaffected by internal icons', () => {
        const userPath = 'M7 7h10v10H7z'
        IconRegistry.addInternal({ '_test-internal-sep': INTERNAL_PATH })
        IconRegistry.add({ 'test-internal-sep': userPath })
        expect((IconRegistry.get('test-internal-sep') as { paths: string }).paths).to.equal(userPath)
        expect((IconRegistry.get('_test-internal-sep') as { paths: string }).paths).to.equal(INTERNAL_PATH)
      })
    })
  })
})
