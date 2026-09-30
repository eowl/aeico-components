import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Dialog from '../../src/dialog'

const TAG_NAME = 'ae-dialog'

before(async () => {
  Dialog.define('dialog')
  await whenDefined(TAG_NAME)
})

afterEach(() => {
  unmountAll()
})

function openDialog(label = 'Test Dialog', attrs = ''): Promise<Dialog> {
  return mount<Dialog>(`<${TAG_NAME} label="${label}" ${attrs}></${TAG_NAME}>`)
    .then(async (el) => {
      await updated()
      el.open()
      return el
    })
}

async function waitClose(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50))
}

describe('Dialog', () => {

  describe('registration', () => {
    it(`is registered as "${TAG_NAME}"`, () => {
      expect(customElements.get(TAG_NAME)).to.equal(Dialog)
    })

    it('createElement returns a Dialog instance with a shadow root', () => {
      const el = document.createElement(TAG_NAME)
      expect(el).to.be.instanceOf(Dialog)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('open / close', () => {
    it('opens and reports isOpen', async () => {
      const el = await openDialog()
      expect(el.isOpen()).to.be.true
      el.close()
      expect(el.isOpen()).to.be.false
    })

    it('emits open and close events', async () => {
      const el = await openDialog()
      let opened = 0
      let closed = 0
      el.addEventListener('open', () => opened++)
      el.addEventListener('close', () => closed++)
      el.open()
      el.close()
      await waitClose()
      expect(opened).to.equal(1)
      expect(closed).to.equal(1)
    })
  })

  describe('scroll lock', () => {
    it('locks body scrolling when a modal dialog opens', async () => {
      const el = await openDialog()
      expect(document.body.style.overflow).to.equal('hidden')
      el.close()
      await waitClose()
      expect(document.body.style.overflow).to.not.equal('hidden')
    })

    it('sets padding-right compensation while open', async () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      const el = await openDialog()
      if (scrollbarWidth > 0) {
        expect(document.body.style.paddingRight).to.contain(`${scrollbarWidth}px`)
      } else {
        // No visible scrollbar in headless: nothing to compensate.
        expect(document.body.style.paddingRight).to.equal('')
      }
      el.close()
      await waitClose()
      expect(document.body.style.paddingRight).to.equal('')
    })

    it('does not lock scrolling for modeless dialogs', async () => {
      const el = await openDialog('Modeless', 'modal="false"')
      expect(document.body.style.overflow).to.not.equal('hidden')
      el.close()
      await waitClose()
      expect(document.body.style.overflow).to.not.equal('hidden')
    })

    it('keeps the lock while another dialog is still open', async () => {
      const first = await openDialog('First')
      const second = await openDialog('Second')
      second.close()
      await waitClose()
      expect(document.body.style.overflow).to.equal('hidden')
      first.close()
      await waitClose()
      expect(document.body.style.overflow).to.not.equal('hidden')
    })

    it('releases the lock when the element is removed without close()', async () => {
      await openDialog('Removed')
      expect(document.body.style.overflow).to.equal('hidden')
      await unmountAll()
      expect(document.body.style.overflow).to.not.equal('hidden')
    })

    it('re-renders correctly after being reopened', async () => {
      const el = await openDialog('Reopen')
      el.close()
      await waitClose()
      el.open()
      expect(document.body.style.overflow).to.equal('hidden')
      el.close()
      await waitClose()
      expect(document.body.style.overflow).to.not.equal('hidden')
    })
  })

  describe('structure', () => {
    it('renders header with label by default', async () => {
      const el = await mount<Dialog>(`<${TAG_NAME} label="My Title"></${TAG_NAME}>`)
      const label = el.shadowRoot!.querySelector('.label')
      expect(label).to.exist
      expect(label!.textContent).to.equal('My Title')
    })

    it('renders a close button when closable is default', async () => {
      const el = await mount<Dialog>(`<${TAG_NAME}></${TAG_NAME}>`)
      expect(el.shadowRoot!.querySelector('.close-btn')).to.exist
    })

    it('hides footer when footer slot is empty', async () => {
      const el = await mount<Dialog>(`<${TAG_NAME}></${TAG_NAME}>`)
      await updated()
      const footer = el.shadowRoot!.querySelector('footer') as HTMLElement
      expect(footer.style.display).to.equal('none')
    })
  })
})
