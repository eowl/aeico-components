import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, whenDefined } from '../helpers/mount.js'
import ProgressBar from '../../src/progress-bar/progress-bar.js'

const TAG_NAME = 'ae-progress-bar'

before(async () => {
  ProgressBar.define('progress-bar')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('ProgressBar', () => {
  describe('registration', () => {
    it('is registered as ae-progress-bar', () => {
      expect(customElements.get(TAG_NAME)).to.equal(ProgressBar)
    })

    it('createElement returns a ProgressBar instance', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(ProgressBar)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders .progress-track with role="progressbar"', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track).to.exist
      expect(track!.getAttribute('role')).to.equal('progressbar')
    })

    it('renders .progress-bar inside .progress-track', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      const bar = el.shadowRoot?.querySelector('.progress-track .progress-bar')
      expect(bar).to.exist
    })

    it('does not render a visible label element', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50" label="Upload"></${TAG_NAME}>`)
      const label = el.shadowRoot?.querySelector('.progress-label')
      expect(label).to.not.exist
    })
  })

  describe('value prop', () => {
    it('reflects aria-valuenow matching clamped value', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="75"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track!.getAttribute('aria-valuenow')).to.equal('75')
    })

    it('clamps value above 100 to 100', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="150"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track!.getAttribute('aria-valuenow')).to.equal('100')
    })

    it('clamps value below 0 to 0', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="-10"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track!.getAttribute('aria-valuenow')).to.equal('0')
    })

    it('bar inline width matches clamped value', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="40"></${TAG_NAME}>`)
      const bar = el.shadowRoot?.querySelector<HTMLElement>('.progress-bar')
      expect(bar!.style.width).to.equal('40%')
    })
  })

  describe('color prop', () => {
    const colors = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const

    for (const color of colors) {
      it(`reflects color="${color}" attribute`, async () => {
        const el = await mount<ProgressBar>(`<${TAG_NAME} value="50" color="${color}"></${TAG_NAME}>`)
        expect(el.getAttribute('color')).to.equal(color)
      })
    }
  })

  describe('animated prop', () => {
    it('does not have [animated] attribute by default', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      expect(el.hasAttribute('animated')).to.be.false
    })

    it('reflects [animated] boolean attribute', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50" animated></${TAG_NAME}>`)
      expect(el.hasAttribute('animated')).to.be.true
    })
  })

  describe('aria', () => {
    it('has aria-valuemin="0" and aria-valuemax="100"', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track!.getAttribute('aria-valuemin')).to.equal('0')
      expect(track!.getAttribute('aria-valuemax')).to.equal('100')
    })

    it('sets aria-label from label prop', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50" label="Loading"></${TAG_NAME}>`)
      const track = el.shadowRoot?.querySelector('.progress-track')
      expect(track!.getAttribute('aria-label')).to.equal('Loading')
    })
  })

  describe('CSS custom properties', () => {
    it('--progress-height changes the track height', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      el.style.setProperty('--progress-height', '16px')
      const track = el.shadowRoot!.querySelector<HTMLElement>('.progress-track')!
      expect(getComputedStyle(track).height).to.equal('16px')
    })

    it('--progress-bar-color overrides the bar background color', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50"></${TAG_NAME}>`)
      el.style.setProperty('--progress-bar-color', 'rgb(255, 0, 0)')
      const bar = el.shadowRoot!.querySelector<HTMLElement>('.progress-bar')!
      expect(getComputedStyle(bar).backgroundColor).to.equal('rgb(255, 0, 0)')
    })

    it('--progress-bar-color takes precedence over color prop', async () => {
      const el = await mount<ProgressBar>(`<${TAG_NAME} value="50" color="success"></${TAG_NAME}>`)
      el.style.setProperty('--progress-bar-color', 'rgb(255, 165, 0)')
      const bar = el.shadowRoot!.querySelector<HTMLElement>('.progress-bar')!
      expect(getComputedStyle(bar).backgroundColor).to.equal('rgb(255, 165, 0)')
    })
  })
})
