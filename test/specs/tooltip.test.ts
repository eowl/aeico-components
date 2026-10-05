import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import Tooltip from '../../src/tooltip/tooltip.js'

const TAG_NAME = 'ae-tooltip'

before(async () => {
  Tooltip.define('tooltip')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Tooltip', () => {
  describe('registration', () => {
    it('is registered as ae-tooltip', () => {
      expect(customElements.get(TAG_NAME)).to.equal(Tooltip)
    })

    it('createElement returns a Tooltip instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Tooltip)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a default slot for trigger content', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME}><button>Trigger</button></${TAG_NAME}>`)
      const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])')
      expect(defaultSlot).to.exist
    })

    it('renders a tooltip panel div with role="tooltip"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      const panel = el.shadowRoot?.querySelector('.tooltip-panel')
      expect(panel).to.exist
      expect(panel!.getAttribute('role')).to.equal('tooltip')
    })

    it('renders a named tooltip slot inside the panel', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      const tooltipSlot = el.shadowRoot?.querySelector('slot[name="tooltip"]')
      expect(tooltipSlot).to.exist
    })
  })

  describe('content prop', () => {
    it('reflects content attribute', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="Hello"><span>T</span></${TAG_NAME}>`)
      expect(el.getAttribute('content')).to.equal('Hello')
      expect(el.content).to.equal('Hello')
    })
  })

  describe('placement prop', () => {
    it('defaults to "top"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      expect(el.placement).to.equal('top')
    })

    const placements = [
      'top', 'top-start', 'top-end',
      'bottom', 'bottom-start', 'bottom-end',
      'left', 'right',
    ] as const

    for (const placement of placements) {
      it(`applies placement-${placement} class to panel`, async () => {
        const el = await mount<Tooltip>(
          `<${TAG_NAME} content="tip" placement="${placement}"><span>T</span></${TAG_NAME}>`
        )
        const panel = el.shadowRoot?.querySelector('.tooltip-panel')
        expect(panel?.classList.contains(`placement-${placement}`)).to.be.true
      })
    }
  })

  describe('open prop', () => {
    it('does not have open attribute by default', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      expect(el.hasAttribute('open')).to.be.false
      expect(el.open).to.be.false
    })

    it('reflects open attribute when set', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" open><span>T</span></${TAG_NAME}>`)
      expect(el.hasAttribute('open')).to.be.true
      expect(el.open).to.be.true
    })

    it('sets aria-hidden="false" on panel when open', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" open><span>T</span></${TAG_NAME}>`)
      const panel = el.shadowRoot?.querySelector('.tooltip-panel')
      expect(panel?.getAttribute('aria-hidden')).to.equal('false')
    })

    it('sets aria-hidden="true" on panel when closed', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      const panel = el.shadowRoot?.querySelector('.tooltip-panel')
      expect(panel?.getAttribute('aria-hidden')).to.equal('true')
    })
  })

  describe('disabled prop', () => {
    it('does not have disabled attribute by default', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      expect(el.hasAttribute('disabled')).to.be.false
      expect(el.disabled).to.be.false
    })

    it('reflects disabled attribute when set', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" disabled><span>T</span></${TAG_NAME}>`)
      expect(el.hasAttribute('disabled')).to.be.true
      expect(el.disabled).to.be.true
    })

    it('does not open when disabled and mouseenter fires', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" disabled><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      expect(el.open).to.be.false
    })
  })

  describe('hover behaviour', () => {
    it('opens on mouseenter', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      expect(el.open).to.be.true
    })

    it('closes on mouseleave', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" open><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      expect(el.open).to.be.false
    })
  })

  describe('focus behaviour', () => {
    it('opens on focusin', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><button>T</button></${TAG_NAME}>`)
      el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
      expect(el.open).to.be.true
    })

    it('closes on focusout', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" open><button>T</button></${TAG_NAME}>`)
      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
      expect(el.open).to.be.false
    })
  })

  describe('trigger prop', () => {
    it('defaults to "hover"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      expect(el.trigger).to.equal('hover')
    })

    it('reflects trigger attribute', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" trigger="click"><span>T</span></${TAG_NAME}>`)
      expect(el.getAttribute('trigger')).to.equal('click')
      expect(el.trigger).to.equal('click')
    })

    it('toggles open on click when trigger="click"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" trigger="click"><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(el.open).to.be.true
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(el.open).to.be.false
    })

    it('does not open on mouseenter when trigger="click"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" trigger="click"><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      expect(el.open).to.be.false
    })

    it('does not open on click when trigger="hover"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(el.open).to.be.false
    })

    it('does not toggle when disabled and trigger="click"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" trigger="click" disabled><span>T</span></${TAG_NAME}>`)
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(el.open).to.be.false
    })
  })

  describe('popover (top layer)', () => {
    const supportsPopover = 'popover' in HTMLElement.prototype

    function getPanel(el: Tooltip): HTMLElement {
      return el.shadowRoot!.querySelector<HTMLElement>('.tooltip-panel')!
    }

    it('renders the panel as a manual popover when supported', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      const panel = getPanel(el)
      if (!supportsPopover) return
      expect(panel.getAttribute('popover')).to.equal('manual')
    })

    it('shows the panel in the top layer when opened', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      if (!supportsPopover) return
      el.open = true
      await updated()
      expect(getPanel(el).matches(':popover-open')).to.be.true
    })

    it('hides the popover when closed', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" open><span>T</span></${TAG_NAME}>`)
      await updated()
      if (!supportsPopover) return
      expect(getPanel(el).matches(':popover-open')).to.be.true

      el.open = false
      await updated()
      expect(getPanel(el).matches(':popover-open')).to.be.false
    })

    it('positions the panel with fixed coordinates when opened', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      if (!supportsPopover) return
      el.open = true
      await updated()
      expect(getPanel(el).style.top).to.not.be.empty
      expect(getPanel(el).style.left).to.not.be.empty
    })

    it('syncs the popover when closed via outside click', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip"><span>T</span></${TAG_NAME}>`)
      if (!supportsPopover) return
      el.open = true
      await updated()

      document.body.click()
      await updated()

      // outside-click closes the tooltip (existing behavior for all trigger modes)
      expect(el.open).to.be.false
      expect(getPanel(el).matches(':popover-open')).to.be.false
    })

    it('closes on outside click when trigger="click"', async () => {
      const el = await mount<Tooltip>(`<${TAG_NAME} content="tip" trigger="click"><span>T</span></${TAG_NAME}>`)
      if (!supportsPopover) return
      el.open = true
      await updated()
      expect(getPanel(el).matches(':popover-open')).to.be.true

      document.body.click()
      await updated()

      expect(el.open).to.be.false
      expect(getPanel(el).matches(':popover-open')).to.be.false
    })
  })
})
