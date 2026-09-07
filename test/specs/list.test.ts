import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount.js'
import List from '../../src/list/list.js'
import ListItem from '../../src/list/list-item.js'

const LIST = 'ae-list'
const LIST_ITEM = 'ae-list-item'

before(async () => {
  List.define('list')
  ListItem.define('list-item')
  await Promise.all([whenDefined(LIST), whenDefined(LIST_ITEM)])
})

afterEach(() => {
  unmountAll()
})


describe('List', () => {
  describe('registration', () => {
    it('is registered as ae-list', () => {
      expect(customElements.get(LIST)).to.equal(List)
    })

    it('createElement returns a List instance', () => {
      const el = document.createElement(LIST)
      expect(el).to.be.instanceOf(List)
      expect(el.shadowRoot).to.not.be.null
    })

    it('has at least one adopted stylesheet', async () => {
      const el = await mount<List>(`<${LIST}></${LIST}>`)
      expect(el.shadowRoot!.adoptedStyleSheets.length).to.be.greaterThan(0)
    })
  })

  describe('structure', () => {
    it('renders a div with class "list", part "list" and role "list"', async () => {
      const el = await mount<List>(`<${LIST}></${LIST}>`)
      const list = el.shadowRoot!.querySelector('.list')
      expect(list).to.exist
      expect(list!.getAttribute('part')).to.equal('list')
      expect(list!.getAttribute('role')).to.equal('list')
    })
  })

  describe('variant prop', () => {
    it('defaults to "subtle"', async () => {
      const el = await mount<List>(`<${LIST}></${LIST}>`)
      expect(el.variant).to.equal('subtle')
      expect(el.getAttribute('variant')).to.equal('subtle')
    })

    for (const variant of ['faint', 'filled', 'outlined', 'text'] as const) {
      it(`reflects variant="${variant}"`, async () => {
        const el = await mount<List>(`<${LIST} variant="${variant}"></${LIST}>`)
        expect(el.variant).to.equal(variant)
        expect(el.getAttribute('variant')).to.equal(variant)
      })
    }
  })

  describe('divided prop', () => {
    it('defaults to false', async () => {
      const el = await mount<List>(`<${LIST}></${LIST}>`)
      expect(el.divided).to.be.false
    })

    it('reflects the divided attribute', async () => {
      const el = await mount<List>(`<${LIST} divided></${LIST}>`)
      expect(el.divided).to.be.true
    })

    it('syncs the divided attribute to all items except the first', async () => {
      const el = await mount<List>(`
        <${LIST} divided>
          <${LIST_ITEM}>A</${LIST_ITEM}>
          <${LIST_ITEM}>B</${LIST_ITEM}>
        </${LIST}>
      `)
      await updated()
      const items = el.querySelectorAll<ListItem>(LIST_ITEM)
      expect(items[0].hasAttribute('divided')).to.be.false
      expect(items[1].hasAttribute('divided')).to.be.true
    })

    it('does not set divided on items when false', async () => {
      const el = await mount<List>(`
        <${LIST}>
          <${LIST_ITEM}>A</${LIST_ITEM}>
        </${LIST}>
      `)
      await updated()
      const item = el.querySelector<ListItem>(LIST_ITEM)!
      expect(item.hasAttribute('divided')).to.be.false
    })

    it('syncs when the divided prop changes dynamically', async () => {
      const el = await mount<List>(`
        <${LIST}>
          <${LIST_ITEM}>A</${LIST_ITEM}>
          <${LIST_ITEM}>B</${LIST_ITEM}>
        </${LIST}>
      `)
      await updated()
      const items = el.querySelectorAll<ListItem>(LIST_ITEM)
      el.divided = true
      await updated()
      expect(items[0].hasAttribute('divided')).to.be.false
      expect(items[1].hasAttribute('divided')).to.be.true
      el.divided = false
      await updated()
      expect(items[0].hasAttribute('divided')).to.be.false
      expect(items[1].hasAttribute('divided')).to.be.false
    })

    it('ignores non-item slotted elements when syncing', async () => {
      const el = await mount<List>(`
        <${LIST} divided>
          <${LIST_ITEM}>A</${LIST_ITEM}>
          <span>plain</span>
        </${LIST}>
      `)
      await updated()
      const span = el.querySelector('span')!
      expect(span.hasAttribute('divided')).to.be.false
    })
  })

  describe('selection', () => {
    const mountList = () => mount<List>(`
      <${LIST}>
        <${LIST_ITEM} key="a">A</${LIST_ITEM}>
        <${LIST_ITEM} key="b">B</${LIST_ITEM}>
        <${LIST_ITEM} key="c" disabled>C</${LIST_ITEM}>
      </${LIST}>
    `)

    it('selects an item on click and emits select', async () => {
      const el = await mountList()
      await updated()
      let detail: any = null
      el.addEventListener('select', (e) => { detail = (e as CustomEvent).detail })
      const item = el.querySelector<ListItem>(`${LIST_ITEM}[key="b"]`)!
      item.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      expect(el.selectedKey).to.equal('b')
      expect(item.selected).to.be.true
      expect(detail).to.deep.equal({ key: 'b', selected: true, selectedKeys: ['b'] })
    })

    it('deselects when clicking the selected item again', async () => {
      const el = await mountList()
      await updated()
      const item = el.querySelector<ListItem>(`${LIST_ITEM}[key="b"]`)!
      item.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      item.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      expect(el.selectedKey).to.be.undefined
      expect(item.selected).to.be.false
    })

    it('single-select: clicking another item moves the selection', async () => {
      const el = await mountList()
      await updated()
      const a = el.querySelector<ListItem>(`${LIST_ITEM}[key="a"]`)!
      const b = el.querySelector<ListItem>(`${LIST_ITEM}[key="b"]`)!
      a.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      b.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      expect(el.selectedKey).to.equal('b')
      expect(a.selected).to.be.false
      expect(b.selected).to.be.true
    })

    it('does not select a disabled item nor emit select', async () => {
      const el = await mountList()
      await updated()
      let fired = false
      el.addEventListener('select', () => { fired = true })
      const item = el.querySelector<ListItem>(`${LIST_ITEM}[key="c"]`)!
      item.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      expect(el.selectedKey).to.be.undefined
      expect(item.selected).to.be.false
      expect(fired).to.be.false
    })

    it('sets aria-selected on the selected item', async () => {
      const el = await mountList()
      await updated()
      const item = el.querySelector<ListItem>(`${LIST_ITEM}[key="a"]`)!
      item.shadowRoot!.querySelector<HTMLElement>('.item')!.click()
      await updated()
      expect(item.shadowRoot!.querySelector('.item')!.getAttribute('aria-selected')).to.equal('true')
      expect(el.querySelector<ListItem>(`${LIST_ITEM}[key="b"]`)!.shadowRoot!.querySelector('.item')!.getAttribute('aria-selected')).to.be.null
    })
  })
})

describe('ListItem', () => {
  describe('registration', () => {
    it('is registered as ae-list-item', () => {
      expect(customElements.get(LIST_ITEM)).to.equal(ListItem)
    })

    it('createElement returns a ListItem instance', () => {
      const el = document.createElement(LIST_ITEM)
      expect(el).to.be.instanceOf(ListItem)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('structure', () => {
    it('renders a div with class "item", part "item" and role "listitem"', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>Label</${LIST_ITEM}>`)
      const item = el.shadowRoot!.querySelector('.item')
      expect(item).to.exist
      expect(item!.getAttribute('part')).to.equal('item')
      expect(item!.getAttribute('role')).to.equal('listitem')
    })

    it('renders default slot content in .label', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>My Label</${LIST_ITEM}>`)
      expect(el.textContent?.trim()).to.equal('My Label')
      const label = el.shadowRoot!.querySelector('.label')
      expect(label).to.exist
    })

    it('renders an ae-divider when divided is set', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} divided>Label</${LIST_ITEM}>`)
      const divider = el.shadowRoot!.querySelector('ae-divider')
      expect(divider).to.exist
      expect(divider!.getAttribute('part')).to.equal('divider')
    })

    it('renders no ae-divider when divided is not set', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>Label</${LIST_ITEM}>`)
      expect(el.shadowRoot!.querySelector('ae-divider')).to.be.null
    })
  })

  describe('key prop', () => {
    it('reflects the key attribute', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} key="a">A</${LIST_ITEM}>`)
      expect(el.getAttribute('key')).to.equal('a')
      expect(el.key).to.equal('a')
    })
  })

  describe('disabled prop', () => {
    it('defaults to false', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>A</${LIST_ITEM}>`)
      expect(el.disabled).to.be.false
    })

    it('reflects the disabled attribute and sets aria-disabled', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} disabled>A</${LIST_ITEM}>`)
      expect(el.disabled).to.be.true
      const item = el.shadowRoot!.querySelector('.item')!
      expect(item.getAttribute('aria-disabled')).to.equal('true')
    })

    it('omits aria-disabled when not disabled', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>A</${LIST_ITEM}>`)
      const item = el.shadowRoot!.querySelector('.item')!
      expect(item.getAttribute('aria-disabled')).to.be.null
    })
  })

  describe('description prop', () => {
    it('renders no .description element when unset', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>A</${LIST_ITEM}>`)
      expect(el.shadowRoot!.querySelector('.description')).to.be.null
    })

    it('renders .description with part and text', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} description="Secondary">A</${LIST_ITEM}>`)
      const desc = el.shadowRoot!.querySelector('.description')!
      expect(desc).to.exist
      expect(desc.getAttribute('part')).to.equal('description')
      expect(desc.textContent).to.equal('Secondary')
    })
  })

  describe('prefix slot', () => {
    it('renders slot[name="prefix"] inside .prefix', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>A</${LIST_ITEM}>`)
      const prefixSlot = el.shadowRoot!.querySelector('slot[name="prefix"]')
      expect(prefixSlot).to.exist
    })

    it('assigns slotted prefix content', async () => {
      const el = await mount<ListItem>(`
        <${LIST_ITEM}>
          <span slot="prefix">*</span>
          A
        </${LIST_ITEM}>
      `)
      const slotEl = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="prefix"]')!
      const assigned = slotEl.assignedElements()
      expect(assigned.length).to.equal(1)
      expect(assigned[0].textContent).to.equal('*')
    })
  })

  describe('divided prop', () => {
    it('reflects the divided attribute', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} divided>A</${LIST_ITEM}>`)
      expect(el.divided).to.be.true
    })
  })

  describe('selected prop', () => {
    it('defaults to false', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM}>A</${LIST_ITEM}>`)
      expect(el.selected).to.be.false
    })

    it('adds item--selected class and aria-selected when true', async () => {
      const el = await mount<ListItem>(`<${LIST_ITEM} selected>A</${LIST_ITEM}>`)
      const item = el.shadowRoot!.querySelector('.item')!
      expect(item.classList.contains('item--selected')).to.be.true
      expect(item.getAttribute('aria-selected')).to.equal('true')
    })
  })
})
