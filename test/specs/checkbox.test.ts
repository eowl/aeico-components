import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import { randomItem } from '../helpers/utils'
import Checkbox from '../../src/checkbox'

const TAG_NAME = 'ae-checkbox'

before(async () => {
  Checkbox.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Checkbox', () => {
  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Checkbox)
    })
    
    it('document.createElement returns a Checkbox instance with a shadow root', async () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Checkbox)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('rendering', () => {
    it('renders a checkbox input inside shadow DOM', async () => {
      const el = await mount<Checkbox>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('input[type="checkbox"]')).to.exist
    })

    it ('sets the checked state based on the "checked" attribute', async () => {
      const checkedValStr = randomItem(['checked', 'checked="true"'])
      const el = await mount<Checkbox>(`<${TAG_NAME} ${checkedValStr}></${TAG_NAME}>`)
      await updated()
      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(input.checked).to.be.true
    })

    it ('sets the checked state is false', async () => {
      const checkedValStr = randomItem(['', 'checked="false"'])
      const el = await mount<Checkbox>(`<${TAG_NAME} ${checkedValStr}></${TAG_NAME}>`)
      await updated()

      const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(input.checked).to.be.false
    })

    it('sets the variant attribute on the container element', async () => {
      const el = await mount<Checkbox>(`<${TAG_NAME} variant="checkbox"></${TAG_NAME}>`)
      await updated()

      const container = el.shadowRoot!.querySelector('.checkbox-container')
      expect(container).to.exist
      expect(container!.getAttribute('variant')).to.equal('checkbox')
    })
  })
})
