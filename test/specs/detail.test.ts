import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Detail from '../../src/detail/detail.js'

const TAG = 'ae-detail'

before(async () => {
  Detail.register()
  await whenDefined(TAG)
})

afterEach(() => {
  unmountAll()
})

describe('Detail', () => {
  describe('registration', () => {
    it(`is registered as "${TAG}"`, () => {
      expect(customElements.get(TAG)).to.equal(Detail)
    })

    it('createElement returns a Detail instance with a shadow root', () => {
      const el = document.createElement(TAG)
      expect(el).to.be.instanceOf(Detail)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a .detail wrapper', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.detail')).to.exist
    })

    it('renders a .summary button with type="button"', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector('button.summary')
      expect(btn).to.exist
      expect(btn!.getAttribute('type')).to.equal('button')
    })

    it('renders a .content-outer wrapper and .content region', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('.content-outer')).to.exist
      expect(el.shadowRoot!.querySelector('.content')).to.exist
    })

    it('renders a summary named slot inside the button', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      const btn = el.shadowRoot!.querySelector('button.summary')!
      expect(btn.querySelector('slot[name="summary"]')).to.exist
    })

    it('renders expand and collapse named slots', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.shadowRoot!.querySelector('slot[name="expand"]')).to.exist
      expect(el.shadowRoot!.querySelector('slot[name="collapse"]')).to.exist
    })

    it('renders a default slot inside .content', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      const content = el.shadowRoot!.querySelector('.content')!
      expect(content.querySelector('slot:not([name])')).to.exist
    })
  })

  describe('default state', () => {
    it('summary prop defaults to empty string', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.summary).to.equal('')
    })

    it('variant defaults to "filled"', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.variant).to.equal('filled')
      expect(el.getAttribute('variant')).to.equal('filled')
    })

    it('color defaults to "default"', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      await updated()
      expect(el.color).to.equal('default')
    })

    it('disabled defaults to false', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.disabled).to.equal(false)
    })

    it('isOpen() returns false by default', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.isOpen()).to.be.false
    })

    it('does not have "open" attribute by default', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.hasAttribute('open')).to.be.false
    })
  })

  describe('summary prop', () => {
    it('renders summary text in fallback .label span', async () => {
      const el = await mount<Detail>(`<${TAG} summary="Details"></${TAG}>`)
      await updated()
      const label = el.shadowRoot!.querySelector('.label')
      expect(label?.textContent).to.equal('Details')
    })

    it('updates .label when summary prop changes', async () => {
      const el = await mount<Detail>(`<${TAG} summary="Before"></${TAG}>`)
      await updated()
      el.summary = 'After'
      await updated()
      const label = el.shadowRoot!.querySelector('.label')
      expect(label?.textContent).to.equal('After')
    })
  })

  describe('summary slot', () => {
    it('renders slotted summary content', async () => {
      const el = await mount<Detail>(
        `<${TAG}><span slot="summary" id="s">Rich Title</span></${TAG}>`
      )
      await updated()
      expect(el.querySelector('#s')).to.exist
      expect(el.querySelector('#s')!.textContent).to.equal('Rich Title')
    })

    it('slotted content overrides the summary prop fallback', async () => {
      const el = await mount<Detail>(
        `<${TAG} summary="Prop Text"><span slot="summary">Slot Text</span></${TAG}>`
      )
      await updated()
      const summarySlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="summary"]')!
      const assigned = summarySlot.assignedElements()
      expect(assigned.length).to.equal(1)
      expect(assigned[0].textContent).to.equal('Slot Text')
    })
  })

  describe('variant prop', () => {
    for (const variant of ['subtle', 'faint', 'filled', 'outlined', 'text'] as const) {
      it(`sets variant="${variant}" via attribute`, async () => {
        const el = await mount<Detail>(`<${TAG} variant="${variant}"></${TAG}>`)
        await updated()
        expect(el.variant).to.equal(variant)
        expect(el.getAttribute('variant')).to.equal(variant)
      })
    }

    it('updates variant programmatically', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.variant = 'outlined'
      await updated()
      expect(el.variant).to.equal('outlined')
      expect(el.getAttribute('variant')).to.equal('outlined')
    })
  })

  describe('color prop', () => {
    it('sets color via attribute', async () => {
      const el = await mount<Detail>(`<${TAG} color="primary"></${TAG}>`)
      await updated()
      expect(el.color).to.equal('primary')
      expect(el.getAttribute('color')).to.equal('primary')
    })

    it('updates color programmatically', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.color = 'danger'
      await updated()
      expect(el.color).to.equal('danger')
      expect(el.getAttribute('color')).to.equal('danger')
    })
  })

  describe('disabled prop', () => {
    it('reflects disabled attribute', async () => {
      const el = await mount<Detail>(`<${TAG} disabled></${TAG}>`)
      expect(el.disabled).to.equal(true)
    })

    it('summary button has disabled attribute when disabled', async () => {
      const el = await mount<Detail>(`<${TAG} disabled></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector('button.summary')!
      expect(btn.hasAttribute('disabled')).to.be.true
    })

    it('summary button does not have disabled attribute when enabled', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector('button.summary')!
      expect(btn.hasAttribute('disabled')).to.be.false
    })
  })

  describe('open()', () => {
    it('sets the "open" attribute on the host', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      expect(el.hasAttribute('open')).to.be.true
    })

    it('makes isOpen() return true', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      expect(el.isOpen()).to.be.true
    })

    it('emits an "open" event', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      let fired = false
      el.addEventListener('open', () => { fired = true })
      el.open()
      expect(fired).to.be.true
    })

    it('does nothing when already open', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      let count = 0
      el.addEventListener('open', () => count++)
      el.open()
      expect(count).to.equal(0)
    })

    it('does nothing when disabled', async () => {
      const el = await mount<Detail>(`<${TAG} disabled></${TAG}>`)
      el.open()
      expect(el.isOpen()).to.be.false
      expect(el.hasAttribute('open')).to.be.false
    })

    it('updates aria-expanded on summary button to "true"', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      await updated()
      const btn = el.shadowRoot!.querySelector('button.summary')!
      expect(btn.getAttribute('aria-expanded')).to.equal('true')
    })
  })

  describe('close()', () => {
    it('removes the "open" attribute from the host', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      el.close()
      expect(el.hasAttribute('open')).to.be.false
    })

    it('makes isOpen() return false', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      el.close()
      expect(el.isOpen()).to.be.false
    })

    it('emits a "close" event', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      let fired = false
      el.addEventListener('close', () => { fired = true })
      el.close()
      expect(fired).to.be.true
    })

    it('does nothing when already closed', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      let count = 0
      el.addEventListener('close', () => count++)
      el.close()
      expect(count).to.equal(0)
    })

    it('updates aria-expanded on summary button to "false"', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      el.close()
      await updated()
      const btn = el.shadowRoot!.querySelector('button.summary')!
      expect(btn.getAttribute('aria-expanded')).to.equal('false')
    })
  })

  describe('toggle()', () => {
    it('opens when closed', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.toggle()
      expect(el.isOpen()).to.be.true
    })

    it('closes when open', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      el.toggle()
      expect(el.isOpen()).to.be.false
    })

    it('emits "open" then "close" on two successive calls', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      const events: string[] = []
      el.addEventListener('open', () => events.push('open'))
      el.addEventListener('close', () => events.push('close'))
      el.toggle()
      el.toggle()
      expect(events).to.deep.equal(['open', 'close'])
    })
  })

  describe('isOpen()', () => {
    it('returns false initially', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      expect(el.isOpen()).to.be.false
    })

    it('returns true after open()', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      expect(el.isOpen()).to.be.true
    })

    it('returns false after open() then close()', async () => {
      const el = await mount<Detail>(`<${TAG}></${TAG}>`)
      el.open()
      el.close()
      expect(el.isOpen()).to.be.false
    })
  })

  describe('summary button click', () => {
    it('toggles open state when summary button is clicked', async () => {
      const el = await mount<Detail>(`<${TAG} summary="Test"></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button.summary')!
      btn.click()
      expect(el.isOpen()).to.be.true
      btn.click()
      expect(el.isOpen()).to.be.false
    })

    it('does not toggle when disabled', async () => {
      const el = await mount<Detail>(`<${TAG} disabled></${TAG}>`)
      await updated()
      const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('button.summary')!
      btn.click()
      expect(el.isOpen()).to.be.false
    })
  })
})
