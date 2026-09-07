import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Image from '../../src/image'

const TAG_NAME = 'ae-image'

before(async () => {
  Image.define('image')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

describe('Image', () => {

  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Image)
    })

    it('createElement returns an Image instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Image)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<Image>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('rendering', () => {
    it('renders thumbnail img with src and alt', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" alt="A photo"></${TAG_NAME}>`)
      const img = el.shadowRoot!.querySelector<HTMLImageElement>('.thumb-img')
      expect(img).to.exist
      expect(img!.src).to.contain('a.jpg')
      expect(img!.alt).to.equal('A photo')
    })

    it('renders caption overlay from caption attribute', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" caption="My caption"></${TAG_NAME}>`)
      const caption = el.shadowRoot!.querySelector('.caption')
      expect(caption).to.exist
      expect(caption!.textContent).to.equal('My caption')
    })

    it('falls back to default slot for caption', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg">Slot caption</${TAG_NAME}>`)
      await updated()
      const caption = el.shadowRoot!.querySelector('.caption')
      expect(caption).to.exist
      const slot = caption!.querySelector('slot')
      expect(slot).to.exist
      expect(slot!.assignedNodes()[0].textContent).to.contain('Slot caption')
    })

    it('omits caption overlay when no caption is provided', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      await updated()
      const caption = el.shadowRoot!.querySelector<HTMLElement>('.caption')
      expect(caption).to.exist
      expect(caption!.style.display).to.equal('none')
    })

    it('maps fit attribute to object-fit', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" fit="contain"></${TAG_NAME}>`)
      await updated()
      const img = el.shadowRoot!.querySelector<HTMLElement>('.thumb-img')!
      expect(getComputedStyle(img).objectFit).to.equal('contain')
    })

    it('passes loading and decoding to the thumbnail img', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" loading="eager" decoding="sync"></${TAG_NAME}>`)
      await updated()
      const img = el.shadowRoot!.querySelector<HTMLImageElement>('.thumb-img')!
      expect(img.loading).to.equal('eager')
      expect(img.decoding).to.equal('sync')
    })

    it('defaults thumbnail img to lazy loading and async decoding', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      const img = el.shadowRoot!.querySelector<HTMLImageElement>('.thumb-img')!
      expect(img.loading).to.equal('lazy')
      expect(img.decoding).to.equal('async')
    })

    it('has no forced default width so the host behaves like an img', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      await updated()
      expect(getComputedStyle(el).width).to.not.equal('240px')
      expect(el.style.width).to.equal('')
    })

    it('width prop constrains the host width', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" width="260"></${TAG_NAME}>`)
      await updated()
      expect(el.style.getPropertyValue('--ae-image-width')).to.equal('260px')
      expect(getComputedStyle(el).width).to.equal('260px')
    })

    it('height prop constrains the host height', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" width="260" height="160"></${TAG_NAME}>`)
      await updated()
      expect(el.style.getPropertyValue('--ae-image-width')).to.equal('260px')
      expect(el.style.getPropertyValue('--ae-image-height')).to.equal('160px')
      expect(getComputedStyle(el).width).to.equal('260px')
      expect(getComputedStyle(el).height).to.equal('160px')
    })

    it('clears size CSS vars when width/height are unset', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" width="260" height="160"></${TAG_NAME}>`)
      el.width = undefined
      el.height = undefined
      await updated()
      expect(el.style.getPropertyValue('--ae-image-width')).to.equal('')
      expect(el.style.getPropertyValue('--ae-image-height')).to.equal('')
    })
  })

  describe('open / close', () => {
    it('isOpen() returns false initially', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      expect(el.isOpen()).to.be.false
    })

    it('open() shows the viewer and isOpen() returns true', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      expect(el.isOpen()).to.be.true
      expect(el.hasAttribute('data-open')).to.be.true
    })

    it('close() hides the viewer', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      el.close()
      expect(el.isOpen()).to.be.false
      expect(el.hasAttribute('data-closing')).to.be.true
    })

    it('emits "open" and "close" events with target in detail', (done) => {
      mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`).then(async (el) => {
        let openDetail: any
        el.addEventListener('open', (e: Event) => { openDetail = (e as CustomEvent).detail })
        el.open()
        expect(openDetail).to.exist
        expect(openDetail.target).to.equal(el)
        el.addEventListener('close', (e: Event) => {
          expect((e as CustomEvent).detail.target).to.equal(el)
          done()
        })
        el.close()
      })
    })

    it('does not open when zoomable is false', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg" zoomable="false"></${TAG_NAME}>`)
      el.open()
      expect(el.isOpen()).to.be.false
    })

    it('Escape key closes the viewer', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(el.isOpen()).to.be.false
    })
  })

  describe('group navigation', () => {
    it('shows no nav controls without a group', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      await updated()
      expect(el.shadowRoot!.querySelector('.nav-btn')).to.not.exist
    })

    it('switches between same-group images in one viewer', async () => {
      const el = await mount<Image>(
        `<div>` +
        `<${TAG_NAME} group="g" src="a.jpg" caption="A"></${TAG_NAME}>` +
        `<${TAG_NAME} group="g" src="b.jpg" caption="B"></${TAG_NAME}>` +
        `<${TAG_NAME} group="g" src="c.jpg" caption="C"></${TAG_NAME}>` +
        `</div>`,
      )
      const second = el.querySelectorAll<Image>(TAG_NAME)[1]
      second.open()
      await updated()
      const viewerImg = second.shadowRoot!.querySelector<HTMLImageElement>('.viewer-img')!
      expect(viewerImg.src).to.contain('b.jpg')
      expect(second.shadowRoot!.querySelector('.count')!.textContent).to.contain('2 / 3')

      // next wraps to the first image
      second.shadowRoot!.querySelector<HTMLElement>('.nav-btn.next')!.click()
      await updated()
      expect(second.shadowRoot!.querySelector<HTMLImageElement>('.viewer-img')!.src).to.contain('c.jpg')
      expect(second.shadowRoot!.querySelector('.count')!.textContent).to.contain('3 / 3')

      // prev twice wraps back around to the last image
      second.shadowRoot!.querySelector<HTMLElement>('.nav-btn.prev')!.click()
      second.shadowRoot!.querySelector<HTMLElement>('.nav-btn.prev')!.click()
      await updated()
      expect(second.shadowRoot!.querySelector<HTMLImageElement>('.viewer-img')!.src).to.contain('a.jpg')
      expect(second.shadowRoot!.querySelector('.viewer-caption')!.textContent).to.equal('A')
    })

    it('does not group images with a different group value', async () => {
      const el = await mount<Image>(
        `<div>` +
        `<${TAG_NAME} group="a" src="a.jpg"></${TAG_NAME}>` +
        `<${TAG_NAME} group="b" src="b.jpg"></${TAG_NAME}>` +
        `</div>`,
      )
      const first = el.querySelectorAll<Image>(TAG_NAME)[0]
      first.open()
      await updated()
      expect(first.shadowRoot!.querySelector('.nav-btn')).to.not.exist
    })

    it('arrow keys navigate within the group', async () => {
      const el = await mount<Image>(
        `<div>` +
        `<${TAG_NAME} group="k" src="a.jpg"></${TAG_NAME}>` +
        `<${TAG_NAME} group="k" src="b.jpg"></${TAG_NAME}>` +
        `</div>`,
      )
      const first = el.querySelectorAll<Image>(TAG_NAME)[0]
      first.open()
      await updated()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await updated()
      expect(first.shadowRoot!.querySelector<HTMLImageElement>('.viewer-img')!.src).to.contain('b.jpg')
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await updated()
      expect(first.shadowRoot!.querySelector<HTMLImageElement>('.viewer-img')!.src).to.contain('a.jpg')
    })
  })

  describe('zoom', () => {
    it('double click toggles zoom to 2x and back', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      await updated()
      const stage = el.shadowRoot!.querySelector<HTMLElement>('.stage')!
      stage.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      let img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!
      expect(img.style.transform).to.contain('scale(2)')
      stage.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!
      expect(img.style.transform).to.contain('scale(1)')
    })

    it('wheel zooms in and out within 1x-4x limits', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      await updated()
      const stage = el.shadowRoot!.querySelector<HTMLElement>('.stage')!
      const wheel = (deltaY: number) =>
        stage.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY }))

      for (let i = 0; i < 20; i++) wheel(-100)
      let img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!
      expect(img.style.transform).to.contain('scale(4)')

      for (let i = 0; i < 40; i++) wheel(100)
      img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!
      expect(img.style.transform).to.contain('scale(1)')
    })

    it('drag pans the zoomed image', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      await updated()
      const stage = el.shadowRoot!.querySelector<HTMLElement>('.stage')!
      stage.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      const img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!

      stage.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: 100, clientY: 100 }))
      stage.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 160, clientY: 130 }))
      stage.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))

      expect(img.style.transform).to.contain('translate(60px, 30px)')
      expect(img.style.transform).to.contain('scale(2)')
    })

    it('does not pan when not zoomed', async () => {
      const el = await mount<Image>(`<${TAG_NAME} src="a.jpg"></${TAG_NAME}>`)
      el.open()
      await updated()
      const stage = el.shadowRoot!.querySelector<HTMLElement>('.stage')!
      const img = el.shadowRoot!.querySelector<HTMLElement>('.viewer-img')!
      stage.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: 100, clientY: 100 }))
      stage.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 160, clientY: 130 }))
      expect(img.style.transform).to.contain('translate(0px, 0px)')
    })
  })
})
