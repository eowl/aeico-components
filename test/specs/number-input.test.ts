import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import NumberInput from '../../src/number-input/number-input.js'

const TAG_NAME = 'ae-number-input'

before(async () => {
  NumberInput.register()
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('NumberInput', () => {
  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(NumberInput)
    })

    it('document.createElement returns a NumberInput instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(NumberInput)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('rendering', () => {
    it('renders an <input type="number"> element inside shadow DOM', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      const input = el.shadowRoot!.querySelector('input')
      expect(input).to.exist
      expect(input!.type).to.equal('number')
    })

    it('sets the placeholder attribute on the inner <input>', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} placeholder="Enter number"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.placeholder).to.equal('Enter number')
    })

    it('sets min, max, and step attributes on the inner <input>', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} min="0" max="100" step="5"></${TAG_NAME}>`)
      await updated()
      const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!
      expect(input.min).to.equal('0')
      expect(input.max).to.equal('100')
      expect(input.step).to.equal('5')
    })
  })

  describe('CSS ?inline import (styleStore integration)', () => {
    it('has at least one adopted stylesheet after connecting to DOM', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })

    it('adopted stylesheet contains input CSS rules', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      const allRules = el.shadowRoot!.adoptedStyleSheets
        .flatMap(sheet => Array.from(sheet.cssRules))
        .map(rule => rule.cssText)
        .join(' ')
      expect(allRules).to.include('input')
    })
  })

  describe('value binding', () => {
    it('reflects numeric value to the inner input', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} value="42"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('42')
    })

    it('handles decimal values', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} value="3.14"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('3.14')
    })

    it('handles negative values', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} value="-10"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('-10')
    })
  })

  describe('clearable', () => {
    it('shows clear button when clearable and has value', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} clearable value="5"></${TAG_NAME}>`)
      await updated()
      const clearBtn = el.shadowRoot!.querySelector('.clear-btn') as HTMLElement
      expect(clearBtn).to.exist
      expect(clearBtn.style.display).to.not.equal('none')
    })

    it('hides clear button when value is empty', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} clearable></${TAG_NAME}>`)
      await updated()
      const clearBtn = el.shadowRoot!.querySelector('.clear-btn') as HTMLElement
      expect(clearBtn).to.exist
      expect(clearBtn.style.display).to.equal('none')
    })
  })

  describe('disabled state', () => {
    it('disables the inner input when disabled prop is set', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} disabled value="10"></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.disabled).to.be.true
    })
  })

  describe('controls', () => {
    it('renders increment and decrement buttons when controls is set', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls></${TAG_NAME}>`)
      await updated()
      const buttons = el.shadowRoot!.querySelectorAll('.number-btn')
      expect(buttons.length).to.equal(2)
      // + on top, − on bottom
      expect(buttons[0]!.textContent).to.equal('+')
      expect(buttons[1]!.textContent).to.equal('-')
    })

    it('does not render stepper buttons without controls', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.number-btn')).to.be.null
    })

    it('increments value by step when clicking +', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls value="10" step="5"></${TAG_NAME}>`)
      await updated()
      const incBtn = el.shadowRoot!.querySelector('.number-btn-increment') as HTMLButtonElement
      incBtn.click()
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('15')
    })

    it('decrements value by step when clicking −', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls value="10" step="5"></${TAG_NAME}>`)
      await updated()
      const decBtn = el.shadowRoot!.querySelector('.number-btn-decrement') as HTMLButtonElement
      decBtn.click()
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('5')
    })

    it('respects max when incrementing', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls value="95" max="100" step="10"></${TAG_NAME}>`)
      await updated()
      const incBtn = el.shadowRoot!.querySelector('.number-btn-increment') as HTMLButtonElement
      incBtn.click()
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('100')
    })

    it('respects min when decrementing', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls value="5" min="0" step="10"></${TAG_NAME}>`)
      await updated()
      const decBtn = el.shadowRoot!.querySelector('.number-btn-decrement') as HTMLButtonElement
      decBtn.click()
      await updated()
      expect(el.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).to.equal('0')
    })

    it('disables stepper buttons when disabled prop is set', async () => {
      const el = await mount<NumberInput>(`<${TAG_NAME} controls disabled></${TAG_NAME}>`)
      await updated()
      const buttons = el.shadowRoot!.querySelectorAll('.number-btn')
      buttons.forEach((btn) => {
        expect((btn as HTMLButtonElement).disabled).to.be.true
      })
    })
  })
})
