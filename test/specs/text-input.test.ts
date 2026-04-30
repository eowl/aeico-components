import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import TextInput from '../../src/text-input/text-input.js'

const TAG_NAME = 'ae-text-input'

before(async () => {
  TextInput.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('TextInput', () => {
  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(TextInput)
    })

    it('document.createElement returns a TextInput instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(TextInput)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('rendering', () => {
    it('renders an <input> element inside shadow DOM', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('input')).to.exist
    })

    it('sets the type attribute on the inner <input>', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME} type="email"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.type).to.equal('email')
    })

    it('sets the placeholder attribute on the inner <input>', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME} placeholder="Enter email"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.placeholder).to.equal('Enter email')
    })
  })

  describe('CSS ?inline import (styleStore integration)', () => {
    it('has at least one adopted stylesheet after connecting to DOM', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })

    it('adopted stylesheet contains input-field CSS rules', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      const allRules = el.shadowRoot!.adoptedStyleSheets
        .flatMap(sheet => Array.from(sheet.cssRules))
        .map(rule => rule.cssText)
        .join(' ')
      expect(allRules).to.include('input')
    })
  })

  describe('value binding', () => {
    it('reflects value to the inner input', async () => {
      const el = await mount<TextInput>(`<${TAG_NAME} value="hello"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('hello')
    })
  })
})
