import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Divider from '../../src/divider/divider.js'

const TAG_NAME = 'ae-divider'

before(async () => {
  Divider.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Divider', () => {
  describe('registration', () => {
    it('is registered as ae-divider', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Divider)
    })

    it('createElement returns a Divider instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Divider)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('default horizontal', () => {
    it('does not have vertical attribute by default', async () => {
      const el = await mount<Divider>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.hasAttribute('vertical')).to.be.false
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Divider>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('vertical prop', () => {
    it('sets the vertical attribute on host', async () => {
      const el = await mount<Divider>(`<${TAG_NAME} vertical></${TAG_NAME}>`)
      await updated()
      expect(el.hasAttribute('vertical')).to.be.true
    })

    it('sets vertical prop programmatically', async () => {
      const el = await mount<Divider>(`<${TAG_NAME}></${TAG_NAME}>`) as Divider
      el.vertical = true
      await updated()
      expect(el.vertical).to.be.true
    })
  })

  describe('thickness prop', () => {
    it('sets --thickness when thickness is provided', async () => {
      const el = await mount<Divider>(`<${TAG_NAME} thickness="4px"></${TAG_NAME}>`) as Divider
      await updated()
      expect(el.style.getPropertyValue('--thickness')).to.equal('4px')
    })

    it('removes --thickness when thickness is cleared', async () => {
      const el = await mount<Divider>(`<${TAG_NAME} thickness="4px"></${TAG_NAME}>`) as Divider
      await updated()
      el.thickness = undefined
      await updated()
      expect(el.style.getPropertyValue('--thickness')).to.equal('')
    })
  })

  describe('color prop', () => {
    it('sets the color attribute on host', async () => {
      const el = await mount<Divider>(`<${TAG_NAME} color="primary"></${TAG_NAME}>`)
      await updated()
      expect(el.getAttribute('color')).to.equal('primary')
    })
  })
})