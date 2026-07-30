import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, whenDefined } from '../helpers/mount.js'
import Badge from '../../src/badge/badge.js'

const TAG_NAME = 'ae-badge'

before(async () => {
  Badge.define('badge')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Badge', () => {
  describe('registration', () => {
    it('is registered as ae-badge', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Badge)
    })

    it('createElement returns a Badge instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Badge)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Badge>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a .badge span with part="badge"', async () => {
      const el = await mount<Badge>(`<${TAG_NAME}>Hello</${TAG_NAME}>`)
      const span = el.shadowRoot?.querySelector('span.badge')
      expect(span).to.exist
      expect(span!.getAttribute('part')).to.equal('badge')
    })

    it('renders default slot content', async () => {
      const el = await mount<Badge>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      expect(el.textContent?.trim()).to.equal('Label')
    })
  })

  describe('color prop', () => {
    it('reflects color attribute', async () => {
      const el = await mount<Badge>(`<${TAG_NAME} color="primary">P</${TAG_NAME}>`)
      expect(el.getAttribute('color')).to.equal('primary')
    })

    it('reflects color="danger"', async () => {
      const el = await mount<Badge>(`<${TAG_NAME} color="danger">D</${TAG_NAME}>`)
      expect(el.getAttribute('color')).to.equal('danger')
    })
  })

  describe('variant prop', () => {
    const variants = ['filled', 'outlined', 'faint', 'subtle', 'text'] as const

    for (const variant of variants) {
      it(`reflects variant="${variant}"`, async () => {
        const el = await mount<Badge>(`<${TAG_NAME} variant="${variant}">V</${TAG_NAME}>`)
        expect(el.getAttribute('variant')).to.equal(variant)
      })
    }
  })

  describe('size prop', () => {
    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg'] as const

    for (const size of sizes) {
      it(`reflects size="${size}"`, async () => {
        const el = await mount<Badge>(`<${TAG_NAME} size="${size}">S</${TAG_NAME}>`)
        expect(el.getAttribute('size')).to.equal(size)
      })
    }
  })

  describe('icon slots', () => {
    it('renders start slot', async () => {
      const el = await mount<Badge>(
        `<${TAG_NAME}><span slot="start">icon</span>Text</${TAG_NAME}>`
      )
      const startSlot = el.shadowRoot?.querySelector('slot[name="start"]')
      expect(startSlot).to.exist
    })

    it('renders end slot', async () => {
      const el = await mount<Badge>(
        `<${TAG_NAME}>Text<span slot="end">icon</span></${TAG_NAME}>`
      )
      const endSlot = el.shadowRoot?.querySelector('slot[name="end"]')
      expect(endSlot).to.exist
    })
  })

  describe('pill prop', () => {
    it('does not have pill attribute by default', async () => {
      const el = await mount<Badge>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('pill')).to.be.false
    })

    it('reflects pill attribute when set', async () => {
      const el = await mount<Badge>(`<${TAG_NAME} pill>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('pill')).to.be.true
    })
  })
})
