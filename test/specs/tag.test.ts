import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Tag from '../../src/tag/tag.js'

const TAG_NAME = 'ae-tag'

before(async () => {
  Tag.define('tag')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Tag', () => {
  describe('registration', () => {
    it('is registered as ae-tag', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Tag)
    })

    it('createElement returns a Tag instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Tag)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a .tag span with part="tag"', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>Hello</${TAG_NAME}>`)
      const span = el.shadowRoot?.querySelector('span.tag')
      expect(span).to.exist
      expect(span!.getAttribute('part')).to.equal('tag')
    })

    it('renders default slot content', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      expect(el.textContent?.trim()).to.equal('Label')
    })

    it('renders start slot', async () => {
      const el = await mount<Tag>(
        `<${TAG_NAME}><span slot="start">icon</span>Text</${TAG_NAME}>`
      )
      const startSlot = el.shadowRoot?.querySelector('slot[name="start"]')
      expect(startSlot).to.exist
    })

    it('renders end slot', async () => {
      const el = await mount<Tag>(
        `<${TAG_NAME}>Text<span slot="end">icon</span></${TAG_NAME}>`
      )
      const endSlot = el.shadowRoot?.querySelector('slot[name="end"]')
      expect(endSlot).to.exist
    })
  })

  describe('color prop', () => {
    const colors = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const

    for (const color of colors) {
      it(`reflects color="${color}"`, async () => {
        const el = await mount<Tag>(`<${TAG_NAME} color="${color}">T</${TAG_NAME}>`)
        expect(el.getAttribute('color')).to.equal(color)
        expect(el.color).to.equal(color)
      })
    }
  })

  describe('variant prop', () => {
    const variants = ['filled', 'outlined', 'faint', 'subtle', 'text'] as const

    for (const variant of variants) {
      it(`reflects variant="${variant}"`, async () => {
        const el = await mount<Tag>(`<${TAG_NAME} variant="${variant}">V</${TAG_NAME}>`)
        expect(el.getAttribute('variant')).to.equal(variant)
        expect(el.variant).to.equal(variant)
      })
    }
  })

  describe('size prop', () => {
    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg'] as const

    for (const size of sizes) {
      it(`reflects size="${size}"`, async () => {
        const el = await mount<Tag>(`<${TAG_NAME} size="${size}">S</${TAG_NAME}>`)
        expect(el.getAttribute('size')).to.equal(size)
        expect(el.size).to.equal(size)
      })
    }
  })

  describe('pill prop', () => {
    it('does not have pill attribute by default', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('pill')).to.be.false
    })

    it('reflects pill attribute when set', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} pill>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('pill')).to.be.true
      expect(el.pill).to.be.true
    })
  })

  describe('dismissible prop', () => {
    it('does not render dismiss button by default', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      const btn = el.shadowRoot?.querySelector('.tag-dismiss') as HTMLElement | null
      expect(btn).to.exist
      // button exists in DOM but display:none via CSS; attribute absent
      expect(el.hasAttribute('dismissible')).to.be.false
    })

    it('reflects dismissible attribute when set', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} dismissible>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('dismissible')).to.be.true
      expect(el.dismissible).to.be.true
    })

    it('emits dismiss event when dismiss button is clicked', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} dismissible>Label</${TAG_NAME}>`)
      let fired = false
      el.addEventListener('dismiss', () => { fired = true })
      const btn = el.shadowRoot?.querySelector('.tag-dismiss') as HTMLElement
      btn.click()
      expect(fired).to.be.true
    })

    it('does not emit dismiss when disabled', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} dismissible disabled>Label</${TAG_NAME}>`)
      let fired = false
      el.addEventListener('dismiss', () => { fired = true })
      const btn = el.shadowRoot?.querySelector('.tag-dismiss') as HTMLElement
      btn.click()
      expect(fired).to.be.false
    })
  })

  describe('disabled prop', () => {
    it('does not have disabled attribute by default', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('disabled')).to.be.false
    })

    it('reflects disabled attribute when set', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} disabled>Label</${TAG_NAME}>`)
      expect(el.hasAttribute('disabled')).to.be.true
      expect(el.disabled).to.be.true
    })
  })

  describe('prop changes', () => {
    it('updates color attribute reactively', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} color="primary">T</${TAG_NAME}>`)
      el.color = 'danger'
      await updated()
      expect(el.getAttribute('color')).to.equal('danger')
    })

    it('updates variant attribute reactively', async () => {
      const el = await mount<Tag>(`<${TAG_NAME} variant="filled">T</${TAG_NAME}>`)
      el.variant = 'outlined'
      await updated()
      expect(el.getAttribute('variant')).to.equal('outlined')
    })

    it('updates dismissible attribute reactively', async () => {
      const el = await mount<Tag>(`<${TAG_NAME}>T</${TAG_NAME}>`)
      el.dismissible = true
      await updated()
      expect(el.hasAttribute('dismissible')).to.be.true
    })
  })
})
