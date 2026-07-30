import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Card from '../../src/card/card.js'

const TAG_NAME = 'ae-card'

before(async () => {
  Card.define('card')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Card', () => {
  describe('registration', () => {
    it('is registered as ae-card', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Card)
    })

    it('createElement returns a Card instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Card)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('default state', () => {
    it('does not have has-header attribute by default', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.hasAttribute('has-header')).to.be.false
    })

    it('does not have has-footer attribute by default', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.hasAttribute('has-footer')).to.be.false
    })

    it('has variant="filled" attribute by default', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`) as Card
      await updated()
      expect(el.getAttribute('variant')).to.equal('filled')
    })
  })

  describe('variant prop', () => {
    for (const variant of ['subtle', 'filled', 'outlined', 'text'] as const) {
      it(`sets variant="${variant}" via attribute`, async () => {
        const el = await mount<Card>(`<${TAG_NAME} variant="${variant}"></${TAG_NAME}>`) as Card
        await updated()
        expect(el.getAttribute('variant')).to.equal(variant)
        expect(el.variant).to.equal(variant)
      })
    }

    it('updates variant prop programmatically', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`) as Card
      el.variant = 'filled'
      await updated()
      expect(el.variant).to.equal('filled')
      expect(el.getAttribute('variant')).to.equal('filled')
    })
  })

  describe('color prop', () => {
    it('sets color attribute via HTML', async () => {
      const el = await mount<Card>(`<${TAG_NAME} color="primary"></${TAG_NAME}>`) as Card
      await updated()
      expect(el.getAttribute('color')).to.equal('primary')
      expect(el.color).to.equal('primary')
    })

    it('updates color prop programmatically', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`) as Card
      el.color = 'success'
      await updated()
      expect(el.color).to.equal('success')
      expect(el.getAttribute('color')).to.equal('success')
    })
  })

  describe('header slot', () => {
    it('adds has-header when header slot is filled', async () => {
      const el = await mount<Card>(
        `<${TAG_NAME}><span slot="header">Title</span></${TAG_NAME}>`
      )
      await updated()
      expect(el.hasAttribute('has-header')).to.be.true
    })

    it('does not add has-header when no header slot content', async () => {
      const el = await mount<Card>(`<${TAG_NAME}>Body</${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-header')).to.be.false
    })
  })

  describe('footer slot', () => {
    it('adds has-footer when footer slot is filled', async () => {
      const el = await mount<Card>(
        `<${TAG_NAME}><span slot="footer">Footer</span></${TAG_NAME}>`
      )
      await updated()
      expect(el.hasAttribute('has-footer')).to.be.true
    })

    it('does not add has-footer when no footer slot content', async () => {
      const el = await mount<Card>(`<${TAG_NAME}>Body</${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('has-footer')).to.be.false
    })
  })

  describe('default body slot', () => {
    it('renders slotted body content', async () => {
      const el = await mount<Card>(`<${TAG_NAME}><p id="body-test">Hello</p></${TAG_NAME}>`)
      await updated()
      const p = el.querySelector('#body-test')
      expect(p).to.not.be.null
      expect(p!.textContent).to.equal('Hello')
    })
  })

  describe('shadow DOM structure', () => {
    it('has card, header, body, footer parts', async () => {
      const el = await mount<Card>(`<${TAG_NAME}></${TAG_NAME}>`)
      const root = el.shadowRoot!
      expect(root.querySelector('[part="card"]')).to.not.be.null
      expect(root.querySelector('[part="header"]')).to.not.be.null
      expect(root.querySelector('[part="body"]')).to.not.be.null
      expect(root.querySelector('[part="footer"]')).to.not.be.null
    })
  })
})
