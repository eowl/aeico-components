import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Textarea from '../../src/textarea/textarea.js'

const TAG = 'ae-textarea'

before(async () => {
  Textarea.register()
  await whenDefined(TAG)
})

afterEach(() => {
  unmountAll()
})

describe('Textarea', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(Textarea)
    })

    it('document.createElement returns a Textarea instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Textarea)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('rendering', () => {
    it('renders a <textarea> element inside shadow DOM', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('textarea')).to.exist
    })

    it('sets placeholder on the inner <textarea>', async () => {
      const el = await mount<Textarea>(`<${TAG} placeholder="Write something..."></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.placeholder).to.equal('Write something...')
    })

    it('sets rows on the inner <textarea>', async () => {
      const el = await mount<Textarea>(`<${TAG} rows="8"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.rows).to.equal(8)
    })

    it('defaults rows to 3 when not specified', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.rows).to.equal(3)
    })
  })

  describe('styles', () => {
    it('has at least one adopted stylesheet after connecting to DOM', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })

    it('adopted stylesheets contain textarea CSS rules', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      const allRules = el.shadowRoot!.adoptedStyleSheets
        .flatMap(sheet => Array.from(sheet.cssRules))
        .map(rule => rule.cssText)
        .join(' ')
      expect(allRules).to.include('textarea')
    })
  })

  describe('value binding', () => {
    it('reflects value attribute to the inner textarea', async () => {
      const el = await mount<Textarea>(`<${TAG} value="hello world"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.value).to.equal('hello world')
    })

    it('writeValue updates textarea.value when prop changes', async () => {
      const el = await mount<Textarea>(`<${TAG} value="initial"></${TAG}>`)
      await updated()
      el.value = 'updated'
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.value).to.equal('updated')
    })

    it('clears textarea.value when value is set to empty string', async () => {
      const el = await mount<Textarea>(`<${TAG} value="some text"></${TAG}>`)
      await updated()
      el.value = ''
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.value).to.equal('')
    })
  })

  describe('maxlength / minlength', () => {
    it('sets maxLength on the inner <textarea>', async () => {
      const el = await mount<Textarea>(`<${TAG} maxlength="200"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.maxLength).to.equal(200)
    })

    it('sets minLength on the inner <textarea>', async () => {
      const el = await mount<Textarea>(`<${TAG} minlength="10"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.minLength).to.equal(10)
    })
  })

  describe('resize', () => {
    it('defaults to vertical resize style', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      await updated()
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(ta.style.resize).to.equal('vertical')
    })

    it('applies resize="none" to the textarea style', async () => {
      const el = await mount<Textarea>(`<${TAG} resize="none"></${TAG}>`)
      await updated()
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(ta.style.resize).to.equal('none')
    })

    it('applies resize="both" to the textarea style', async () => {
      const el = await mount<Textarea>(`<${TAG} resize="both"></${TAG}>`)
      await updated()
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(ta.style.resize).to.equal('both')
    })

    it('forces resize="none" when autoResize is enabled', async () => {
      const el = await mount<Textarea>(`<${TAG} resize="vertical" auto-resize></${TAG}>`)
      await updated()
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(ta.style.resize).to.equal('none')
    })
  })

  describe('required', () => {
    it('passes required to the inner <textarea>', async () => {
      const el = await mount<Textarea>(`<${TAG} required></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.required).to.be.true
    })

    it('inner textarea is not required when prop is absent', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!.required).to.be.false
    })
  })

  describe('disabled', () => {
    it('reflects disabled attribute to host element', async () => {
      const el = await mount<Textarea>(`<${TAG} disabled></${TAG}>`)
      await updated()
      expect(el.hasAttribute('disabled')).to.be.true
    })
  })

  describe('label integration (AeicoField)', () => {
    it('renders a <label> when label prop is set', async () => {
      const el = await mount<Textarea>(`<${TAG} label="Description"></${TAG}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('label')).to.exist
    })

    it('label for attribute matches inner textarea id', async () => {
      const el = await mount<Textarea>(`<${TAG} label="Bio"></${TAG}>`)
      await updated()
      const label = el.shadowRoot!.querySelector<HTMLLabelElement>('label')!
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(label.getAttribute('for')).to.equal(ta.id)
      expect(ta.id).to.not.equal('')
    })

    it('renders .field-error when error prop is set', async () => {
      const el = await mount<Textarea>(`<${TAG} error="Too short"></${TAG}>`)
      await updated()
      const errEl = el.shadowRoot!.querySelector('.field-error')
      expect(errEl).to.exist
      expect(errEl!.textContent).to.equal('Too short')
    })

    it('sets aria-invalid on inner textarea when error is present', async () => {
      const el = await mount<Textarea>(`<${TAG} error="Invalid"></${TAG}>`)
      await updated()
      const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!
      expect(ta.getAttribute('aria-invalid')).to.equal('true')
    })
  })

  describe('clearable', () => {
    it('shows a clear button when clearable and value is non-empty', async () => {
      const el = await mount<Textarea>(`<${TAG} clearable value="some text"></${TAG}>`)
      await updated()
      const clearBtn = el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')
      expect(clearBtn).to.exist
      expect(clearBtn!.style.display).to.not.equal('none')
    })

    it('hides the clear button when value is empty', async () => {
      const el = await mount<Textarea>(`<${TAG} clearable value=""></${TAG}>`)
      await updated()
      const clearBtn = el.shadowRoot!.querySelector<HTMLElement>('.clear-btn')
      expect(clearBtn).to.exist
      expect(clearBtn!.style.display).to.equal('none')
    })
  })

  describe('checkValidity()', () => {
    it('returns true when required is not set', async () => {
      const el = await mount<Textarea>(`<${TAG}></${TAG}>`)
      expect(el.checkValidity()).to.be.true
    })

    it('returns false when required is set and value is empty', async () => {
      const el = await mount<Textarea>(`<${TAG} required></${TAG}>`)
      await updated()
      expect(el.checkValidity()).to.be.false
    })

    it('returns true when required is set and value is provided', async () => {
      const el = await mount<Textarea>(`<${TAG} required value="some content"></${TAG}>`)
      await updated()
      expect(el.checkValidity()).to.be.true
    })
  })
})
