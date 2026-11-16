import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Callout from '../../src/callout/callout.js'

const TAG_NAME = 'ae-callout'

before(async () => {
  Callout.define('callout')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Callout', () => {
  describe('registration', () => {
    it('is registered as ae-callout', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Callout)
    })

    it('createElement returns a Callout instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Callout)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('default state', () => {
    it('has variant="filled" attribute by default', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.getAttribute('variant')).to.equal('filled')
    })

    it('has color="default" attribute by default', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.getAttribute('color')).to.equal('default')
    })

    it('does not have has-icon attribute by default', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-icon')).to.be.false
    })

    it('does not have has-header attribute by default', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-header')).to.be.false
    })

    it('is not accent by default', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('accent')).to.be.false
    })
  })

  describe('variant prop', () => {
    for (const variant of ['subtle', 'faint', 'filled', 'outlined', 'text'] as const) {
      it(`sets variant="${variant}" via attribute`, async () => {
        const el = await mount<Callout>(`<${TAG_NAME} variant="${variant}"></${TAG_NAME}>`)
        await updated()
        expect(el.variant).to.equal(variant)
        expect(el.getAttribute('variant')).to.equal(variant)
      })
    }

    it('updates variant prop programmatically', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.variant = 'outlined'
      await updated()
      expect(el.variant).to.equal('outlined')
      expect(el.getAttribute('variant')).to.equal('outlined')
    })
  })

  describe('color prop', () => {
    for (const color of ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const) {
      it(`sets color="${color}" via attribute`, async () => {
        const el = await mount<Callout>(`<${TAG_NAME} color="${color}"></${TAG_NAME}>`)
        await updated()
        expect(el.color).to.equal(color)
        expect(el.getAttribute('color')).to.equal(color)
      })
    }

    it('updates color prop programmatically', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.color = 'success'
      await updated()
      expect(el.color).to.equal('success')
      expect(el.getAttribute('color')).to.equal('success')
    })
  })

  describe('accent prop', () => {
    it('sets accent attribute via HTML', async () => {
      const el = await mount<Callout>(`<${TAG_NAME} accent></${TAG_NAME}>`)
      await updated()
      expect(el.accent).to.be.true
    })

    it('toggles accent prop programmatically', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}></${TAG_NAME}>`)
      el.accent = true
      await updated()
      expect(el.hasAttribute('accent')).to.be.true
      el.accent = false
      await updated()
      expect(el.hasAttribute('accent')).to.be.false
    })
  })

  describe('icon slot', () => {
    it('adds has-icon when icon slot is filled', async () => {
      const el = await mount<Callout>(
        `<${TAG_NAME}><span slot="icon">*</span></${TAG_NAME}>`
      )
      await updated()
      expect(el.hasAttribute('has-icon')).to.be.true
    })

    it('does not add has-icon when no icon slot content', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}>Body</${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-icon')).to.be.false
    })
  })

  describe('header slot', () => {
    it('adds has-header when header slot is filled', async () => {
      const el = await mount<Callout>(
        `<${TAG_NAME}><span slot="header">Title</span></${TAG_NAME}>`
      )
      await updated()
      expect(el.hasAttribute('has-header')).to.be.true
    })

    it('does not add has-header when no header slot content', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}>Body</${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-header')).to.be.false
    })
  })

  describe('default body slot', () => {
    it('renders default slot content', async () => {
      const el = await mount<Callout>(`<${TAG_NAME}>Some content</${TAG_NAME}>`)
      await updated()
      const assigned = el.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement
      expect(assigned.assignedNodes({ flatten: true }).map(n => n.textContent?.trim()).join('')).to.equal('Some content')
    })
  })
})
