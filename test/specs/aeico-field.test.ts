import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import TextInput from '../../src/text-input/text-input'

/**
 * AeicoField base-class tests.
 * Exercised through TextInput as the concrete implementation.
 */

const TAG = 'ae-text-input'

before(async () => {
  TextInput.define('text-input')
  await whenDefined(TAG)
})

afterEach(() => {
  unmountAll()
})

describe('AeicoField (via TextInput)', () => {

  describe('label', () => {
    it('renders no <label> when label prop is absent', async () => {
      const el = await mount<TextInput>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('label')).to.not.exist
    })

    it('renders a <label> with the correct text when label is set', async () => {
      const el = await mount<TextInput>(`<${TAG} label="Username"></${TAG}>`)
      await updated()
      const label = el.shadowRoot!.querySelector('label')
      expect(label).to.exist
      expect(label!.textContent).to.include('Username')
    })

    it('label htmlFor matches the inner input id', async () => {
      const el = await mount<TextInput>(`<${TAG} label="Email"></${TAG}>`)
      await updated()
      const label = el.shadowRoot!.querySelector<HTMLLabelElement>('label')!
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!
      expect(label.getAttribute('for')).to.equal(input.id)
      expect(input.id).to.not.equal('')
    })

    it('each instance gets a unique field id', async () => {
      const a = await mount<TextInput>(`<${TAG} label="A"></${TAG}>`)
      const b = await mount<TextInput>(`<${TAG} label="B"></${TAG}>`)
      await updated()
      const idA = a.shadowRoot!.querySelector<HTMLInputElement>('input')!.id
      const idB = b.shadowRoot!.querySelector<HTMLInputElement>('input')!.id
      expect(idA).to.not.equal(idB)
    })
  })

  describe('required', () => {
    it('renders the * marker when label + required are both set', async () => {
      const el = await mount<TextInput>(`<${TAG} label="Name" required></${TAG}>`)
      await updated()
      const marker = el.shadowRoot!.querySelector('.field-required')
      expect(marker).to.exist
      expect(marker!.textContent).to.include('*')
    })

    it('does not render * marker when required is absent', async () => {
      const el = await mount<TextInput>(`<${TAG} label="Name"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.field-required')).to.not.exist
    })

    it('sets the required attribute on the inner input', async () => {
      const el = await mount<TextInput>(`<${TAG} required></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.required).to.be.true
    })

    it('inner input is not required when prop is absent', async () => {
      const el = await mount<TextInput>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.required).to.be.false
    })
  })

  describe('helperText', () => {
    it('renders .field-helper with the provided text', async () => {
      const el = await mount<TextInput>(`<${TAG} helper-text="Max 100 characters"></${TAG}>`)
      await updated()
      const helper = el.shadowRoot!.querySelector('.field-helper')
      expect(helper).to.exist
      expect(helper!.textContent).to.equal('Max 100 characters')
    })

    it('does not render .field-helper when helper-text is absent', async () => {
      const el = await mount<TextInput>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.field-helper')).to.not.exist
    })

    it('hides .field-helper when error is also set', async () => {
      const el = await mount<TextInput>(`<${TAG} helper-text="hint" error="Required"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.field-helper')).to.not.exist
    })
  })

  describe('error', () => {
    it('renders .field-error with the error message', async () => {
      const el = await mount<TextInput>(`<${TAG} error="This field is required"></${TAG}>`)
      await updated()
      const errEl = el.shadowRoot!.querySelector('.field-error')
      expect(errEl).to.exist
      expect(errEl!.textContent).to.equal('This field is required')
    })

    it('does not render .field-error when error is absent', async () => {
      const el = await mount<TextInput>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.field-error')).to.not.exist
    })

    it('sets aria-invalid="true" on the inner input when error is present', async () => {
      const el = await mount<TextInput>(`<${TAG} error="Invalid value"></${TAG}>`)
      await updated()
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!
      expect(input.getAttribute('aria-invalid')).to.equal('true')
    })

    it('removes aria-invalid when error prop is cleared', async () => {
      const el = await mount<TextInput>(`<${TAG} error="Invalid value"></${TAG}>`)
      await updated()
      el.error = undefined
      await updated()
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!
      expect(input.hasAttribute('aria-invalid')).to.be.false
    })
  })

  describe('checkValidity()', () => {
    it('returns true when required is not set', async () => {
      const el = await mount<TextInput>(`<${TAG}></${TAG}>`)
      expect(el.checkValidity()).to.be.true
    })

    it('returns false when required is set and value is empty', async () => {
      const el = await mount<TextInput>(`<${TAG} required></${TAG}>`)
      await updated()
      expect(el.checkValidity()).to.be.false
    })

    it('returns true when required is set and value is provided', async () => {
      const el = await mount<TextInput>(`<${TAG} required value="hello"></${TAG}>`)
      await updated()
      expect(el.checkValidity()).to.be.true
    })
  })

  describe('reportValidity()', () => {
    it('returns true when the field is valid', async () => {
      const el = await mount<TextInput>(`<${TAG} value="hi"></${TAG}>`)
      await updated()
      expect(el.reportValidity()).to.be.true
    })

    it('returns false when required field is empty', async () => {
      const el = await mount<TextInput>(`<${TAG} required></${TAG}>`)
      await updated()
      expect(el.reportValidity()).to.be.false
    })
  })
})
