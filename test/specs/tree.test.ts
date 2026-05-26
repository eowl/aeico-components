import { expect } from '@esm-bundle/chai'
import { mount, unmountAll, updated, whenDefined } from '../helpers/mount'
import Tree from '../../src/tree/tree'
import TreeItem from '../../src/tree/tree-item'

const TREE = 'ae-tree'
const ITEM = 'ae-tree-item'

const BASIC_TREE = `
  <ae-tree>
    <ae-tree-item key="parent" label="Parent">
      <ae-tree-item key="child1" label="Child 1"></ae-tree-item>
      <ae-tree-item key="child2" label="Child 2"></ae-tree-item>
    </ae-tree-item>
    <ae-tree-item key="leaf" label="Leaf"></ae-tree-item>
  </ae-tree>
`

before(async () => {
  Tree.register()
  TreeItem.register()
  await Promise.all([whenDefined(TREE), whenDefined(ITEM)])
})

afterEach(() => {
  unmountAll()
})

describe('Tree', () => {
  describe('registration', () => {
    it(`is registered as "${TREE}"`, () => {
      expect(customElements.get(TREE)).to.equal(Tree)
    })

    it('createElement returns a Tree instance with a shadow root', () => {
      const el = document.createElement(TREE)
      expect(el).to.be.instanceOf(Tree)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('default props', () => {
    it('checkable defaults to false', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      expect(el.checkable).to.be.false
    })

    it('multiple defaults to false', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      expect(el.multiple).to.be.false
    })

    it('showLine defaults to false', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      expect(el.showLine).to.be.false
    })

    it('defaultExpandAll defaults to false', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      expect(el.defaultExpandAll).to.be.false
    })

    it('selectedKey defaults to undefined', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      expect(el.selectedKey).to.be.undefined
    })
  })

  describe('structure', () => {
    it('renders a .tree div with role="tree"', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()
      const root = el.shadowRoot!.querySelector('.tree')
      expect(root).to.exist
      expect(root!.getAttribute('role')).to.equal('tree')
    })

    it('has a default slot', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()
      expect(el.shadowRoot!.querySelector('slot:not([name])')).to.exist
    })

    it('aria-multiselectable is "false" by default', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()
      expect(el.shadowRoot!.querySelector('.tree')!.getAttribute('aria-multiselectable')).to.equal('false')
    })

    it('aria-multiselectable is "true" in multiple mode', async () => {
      const el = await mount<Tree>(`<ae-tree multiple><ae-tree-item key="a" label="A"></ae-tree-item></ae-tree>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.tree')!.getAttribute('aria-multiselectable')).to.equal('true')
    })
  })

  describe('select — single', () => {
    it('emits "select" with key and selected=true on first click', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      let detail: any
      el.addEventListener('select', (e: Event) => { detail = (e as CustomEvent).detail })

      const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
      leaf.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()

      expect(detail).to.exist
      expect(detail.key).to.equal('leaf')
      expect(detail.selected).to.be.true
    })

    it('sets selected=true on the clicked item', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
      leaf.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(leaf.selected).to.be.true
    })

    it('deselects other items when a new item is selected', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
      const parent = el.querySelector<TreeItem>('[key="parent"]')!

      leaf.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(leaf.selected).to.be.false
      expect(parent.selected).to.be.true
    })

    it('deselects the item on second click (toggle off)', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
      leaf.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()
      leaf.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(leaf.selected).to.be.false
      expect(el.selectedKey).to.be.undefined
    })

    it('updates tree.selectedKey', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      el.querySelector<TreeItem>('[key="leaf"]')!
        .shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(el.selectedKey).to.equal('leaf')
    })
  })

  describe('select — multiple', () => {
    it('allows selecting multiple items', async () => {
      const el = await mount<Tree>(`
        <ae-tree multiple>
          <ae-tree-item key="a" label="A"></ae-tree-item>
          <ae-tree-item key="b" label="B"></ae-tree-item>
          <ae-tree-item key="c" label="C"></ae-tree-item>
        </ae-tree>
      `)
      await updated()

      const a = el.querySelector<TreeItem>('[key="a"]')!
      const b = el.querySelector<TreeItem>('[key="b"]')!

      a.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()
      b.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(a.selected).to.be.true
      expect(b.selected).to.be.true
      expect(el.selectedKeys).to.deep.equal(['a', 'b'])
    })

    it('toggles off an already-selected item', async () => {
      const el = await mount<Tree>(`
        <ae-tree multiple>
          <ae-tree-item key="a" label="A"></ae-tree-item>
        </ae-tree>
      `)
      await updated()

      const a = el.querySelector<TreeItem>('[key="a"]')!
      a.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()
      a.shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()

      expect(a.selected).to.be.false
      expect(el.selectedKeys).to.deep.equal([])
    })

    it('select event detail contains selectedKeys array', async () => {
      const el = await mount<Tree>(`
        <ae-tree multiple>
          <ae-tree-item key="a"><span slot="label">A</span></ae-tree-item>
          <ae-tree-item key="b"><span slot="label">B</span></ae-tree-item>
        </ae-tree>
      `)
      await updated()

      let detail: any
      el.addEventListener('select', (e: Event) => { detail = (e as CustomEvent).detail })

      el.querySelector<TreeItem>('[key="a"]')!
        .shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()
      await updated()
      el.querySelector<TreeItem>('[key="b"]')!
        .shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()

      expect(detail.selectedKeys).to.deep.equal(['a', 'b'])
    })
  })

  describe('expand / collapse', () => {
    it('emits "expand" with key, expanded=true on first click', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      let detail: any
      el.addEventListener('expand', (e: Event) => { detail = (e as CustomEvent).detail })

      const parent = el.querySelector<TreeItem>('[key="parent"]')!
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()

      expect(detail).to.exist
      expect(detail.key).to.equal('parent')
      expect(detail.expanded).to.be.true
    })

    it('sets expanded=true on the item', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="parent"]')!
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()
      await updated()

      expect(parent.expanded).to.be.true
    })

    it('collapses an already-expanded item', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="parent"]')!
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()
      await updated()
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()
      await updated()

      expect(parent.expanded).to.be.false
    })

    it('updates tree.expandedKeys', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="parent"]')!
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()

      expect(el.expandedKeys).to.include('parent')
    })

    it('removes key from expandedKeys when collapsed', async () => {
      const el = await mount<Tree>(BASIC_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="parent"]')!
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()
      parent.shadowRoot!.querySelector<HTMLButtonElement>('.expand-btn')!.click()

      expect(el.expandedKeys).to.not.include('parent')
    })
  })

  describe('checkable mode', () => {
    const CHECKABLE_TREE = `
      <ae-tree checkable>
        <ae-tree-item key="p" label="Parent">
          <ae-tree-item key="c1" label="Child 1"></ae-tree-item>
          <ae-tree-item key="c2" label="Child 2"></ae-tree-item>
        </ae-tree-item>
      </ae-tree>
    `

    it('emits "check" event with key and checked state', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      let detail: any
      el.addEventListener('check', (e: Event) => { detail = (e as CustomEvent).detail })

      const c1 = el.querySelector<TreeItem>('[key="c1"]')!
      const checkbox = c1.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      checkbox.checked = true
      checkbox.dispatchEvent(new Event('change', { bubbles: true, composed: true }))

      expect(detail).to.exist
      expect(detail.key).to.equal('c1')
      expect(detail.checked).to.be.true
    })

    it('checking a parent sets all children to checked', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="p"]')!
      const c1 = el.querySelector<TreeItem>('[key="c1"]')!
      const c2 = el.querySelector<TreeItem>('[key="c2"]')!

      const pCheckbox = parent.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      pCheckbox.checked = true
      pCheckbox.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      await updated()

      expect(c1.checked).to.be.true
      expect(c2.checked).to.be.true
    })

    it('checking all children sets parent to checked', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="p"]')!
      const c1 = el.querySelector<TreeItem>('[key="c1"]')!
      const c2 = el.querySelector<TreeItem>('[key="c2"]')!

      for (const item of [c1, c2]) {
        const cb = item.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
        cb.checked = true
        cb.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
        await updated()
      }

      expect(parent.checked).to.be.true
      expect(parent.indeterminate).to.be.false
    })

    it('checking some children sets parent to indeterminate', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      const parent = el.querySelector<TreeItem>('[key="p"]')!
      const c1 = el.querySelector<TreeItem>('[key="c1"]')!

      const c1Checkbox = c1.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      c1Checkbox.checked = true
      c1Checkbox.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      await updated()

      expect(parent.indeterminate).to.be.true
      expect(parent.checked).to.be.false
    })

    it('checkedKeys includes fully-checked items, excludes indeterminate parents', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      const c1 = el.querySelector<TreeItem>('[key="c1"]')!
      const c1Checkbox = c1.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      c1Checkbox.checked = true
      c1Checkbox.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      await updated()

      expect(el.checkedKeys).to.include('c1')
      expect(el.checkedKeys).to.not.include('p')
    })

    it('check event detail contains checkedKeys array', async () => {
      const el = await mount<Tree>(CHECKABLE_TREE)
      await updated()

      let detail: any
      el.addEventListener('check', (e: Event) => { detail = (e as CustomEvent).detail })

      const c1 = el.querySelector<TreeItem>('[key="c1"]')!
      const cb = c1.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      cb.checked = true
      cb.dispatchEvent(new Event('change', { bubbles: true, composed: true }))

      expect(Array.isArray(detail.checkedKeys)).to.be.true
    })
  })

  describe('disabled items', () => {
    it('does not emit select when a disabled item is clicked', async () => {
      const el = await mount<Tree>(`
        <ae-tree>
          <ae-tree-item key="d" label="Disabled" disabled></ae-tree-item>
        </ae-tree>
      `)
      await updated()

      let fired = false
      el.addEventListener('select', () => { fired = true })

      el.querySelector<TreeItem>('[key="d"]')!
        .shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()

      expect(fired).to.be.false
    })

    it('does not emit check when a disabled checkbox is changed', async () => {
      const el = await mount<Tree>(`
        <ae-tree checkable>
          <ae-tree-item key="d" label="Disabled" disabled></ae-tree-item>
        </ae-tree>
      `)
      await updated()

      let fired = false
      el.addEventListener('check', () => { fired = true })

      const item = el.querySelector<TreeItem>('[key="d"]')!
      const cb = item.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!
      cb.dispatchEvent(new Event('change', { bubbles: true, composed: true }))

      expect(fired).to.be.false
    })
  })

  describe('defaultExpandAll', () => {
    it('expands all parent items on mount', async () => {
      const el = await mount<Tree>(`
        <ae-tree default-expand-all>
          <ae-tree-item key="p" label="Parent">
            <ae-tree-item key="c" label="Child"></ae-tree-item>
          </ae-tree-item>
        </ae-tree>
      `)
      await updated()
      await updated()

      const parent = el.querySelector<TreeItem>('[key="p"]')!
      expect(parent.expanded).to.be.true
    })

    it('does not expand leaf items', async () => {
      const el = await mount<Tree>(`
        <ae-tree default-expand-all>
          <ae-tree-item key="leaf" label="Leaf"></ae-tree-item>
        </ae-tree>
      `)
      await updated()
      await updated()

      const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
      expect(leaf.expanded).to.be.false
    })
  })
})

describe('TreeItem', () => {
  describe('registration', () => {
    it(`is registered as "${ITEM}"`, () => {
      expect(customElements.get(ITEM)).to.equal(TreeItem)
    })

    it('createElement returns a TreeItem with a shadow root', () => {
      const el = document.createElement(ITEM)
      expect(el).to.be.instanceOf(TreeItem)
      expect(el.shadowRoot).to.not.be.null
    })
  })

  describe('default props', () => {
    it('disabled defaults to false', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      expect(el.disabled).to.be.false
    })

    it('expanded defaults to false', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      expect(el.expanded).to.be.false
    })

    it('selected defaults to false', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      expect(el.selected).to.be.false
    })

    it('checked defaults to false', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      expect(el.checked).to.be.false
    })
  })

  describe('structure', () => {
    it('renders .tree-item-content with role="treeitem"', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      await updated()
      const content = el.shadowRoot!.querySelector('.tree-item-content')
      expect(content).to.exist
      expect(content!.getAttribute('role')).to.equal('treeitem')
    })

    it('renders a .tree-item-label button', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x">Hello</ae-tree-item>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.tree-item-label')).to.exist
    })

    it('projects default slot content into the label button', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x">Hello World</ae-tree-item>`)
      await updated()
      const labelBtn = el.shadowRoot!.querySelector('.tree-item-label')!
      const s = labelBtn.querySelector('slot')
      expect(s).to.exist
      expect(s!.getAttribute('name')).to.be.null
    })

    it('renders .expand-placeholder for a leaf item (no children)', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="Leaf"></ae-tree-item>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.expand-placeholder')).to.exist
      expect(el.shadowRoot!.querySelector('.expand-btn')).to.not.exist
    })

    it('renders .expand-btn for a parent item (has children)', async () => {
      const el = await mount<TreeItem>(`
        <ae-tree-item key="p" label="Parent">
          <ae-tree-item key="c" label="Child"></ae-tree-item>
        </ae-tree-item>
      `)
      await updated()
      await updated()
      expect(el.shadowRoot!.querySelector('.expand-btn')).to.exist
      expect(el.shadowRoot!.querySelector('.expand-placeholder')).to.not.exist
    })

    it('has a .tree-item-children div for child slots', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      await updated()
      expect(el.shadowRoot!.querySelector('.tree-item-children')).to.exist
    })

    it('sets aria-disabled="true" when disabled', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X" disabled></ae-tree-item>`)
      await updated()
      const content = el.shadowRoot!.querySelector('.tree-item-content')!
      expect(content.getAttribute('aria-disabled')).to.equal('true')
    })

    it('does not set aria-disabled when not disabled', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      await updated()
      const content = el.shadowRoot!.querySelector('.tree-item-content')!
      expect(content.getAttribute('aria-disabled')).to.be.null
    })
  })

  describe('aria-expanded', () => {
    it('sets aria-expanded="false" on parent item when collapsed', async () => {
      const el = await mount<TreeItem>(`
        <ae-tree-item key="p" label="P">
          <ae-tree-item key="c" label="C"></ae-tree-item>
        </ae-tree-item>
      `)
      await updated()
      await updated()
      const content = el.shadowRoot!.querySelector('.tree-item-content')!
      expect(content.getAttribute('aria-expanded')).to.equal('false')
    })

    it('sets aria-expanded="true" when expanded=true', async () => {
      const el = await mount<TreeItem>(`
        <ae-tree-item key="p" label="P">
          <ae-tree-item key="c" label="C"></ae-tree-item>
        </ae-tree-item>
      `)
      await updated()
      await updated()

      el.expanded = true
      await updated()

      const content = el.shadowRoot!.querySelector('.tree-item-content')!
      expect(content.getAttribute('aria-expanded')).to.equal('true')
    })

    it('does not set aria-expanded on leaf items', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      await updated()
      const content = el.shadowRoot!.querySelector('.tree-item-content')!
      expect(content.getAttribute('aria-expanded')).to.be.null
    })
  })

  describe('expanded attribute reflects to host', () => {
    it('host gains "expanded" attribute when expanded=true', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X"></ae-tree-item>`)
      el.expanded = true
      await updated()
      expect(el.hasAttribute('expanded')).to.be.true
    })

    it('host loses "expanded" attribute when expanded=false', async () => {
      const el = await mount<TreeItem>(`<ae-tree-item key="x" label="X" expanded></ae-tree-item>`)
      await updated()
      el.expanded = false
      await updated()
      expect(el.hasAttribute('expanded')).to.be.false
    })
  })
})

describe('ae-tree icon prop', () => {
  beforeEach(() => whenDefined('ae-tree'))
  afterEach(() => unmountAll())

  it('icon defaults to undefined', async () => {
    const el = await mount<Tree>(BASIC_TREE)
    expect(el.icon).to.be.undefined
  })

  it('parent items show ae-icon in expand-btn when tree has icon set', async () => {
    const el = await mount<Tree>(`
      <ae-tree icon="chevron-right">
        <ae-tree-item key="p">
          Parent
          <ae-tree-item key="c">Child</ae-tree-item>
        </ae-tree-item>
      </ae-tree>
    `)
    await updated()
    await updated()

    const parent = el.querySelector<TreeItem>('[key="p"]')!
    expect(parent.shadowRoot!.querySelector('.expand-btn ae-icon')).to.exist
    expect(parent.shadowRoot!.querySelector('.expand-btn svg')).to.not.exist
  })

  it('leaf items never show an expand icon regardless of tree icon', async () => {
    const el = await mount<Tree>(`
      <ae-tree icon="chevron-right">
        <ae-tree-item key="leaf">Leaf</ae-tree-item>
      </ae-tree>
    `)
    await updated()
    await updated()

    const leaf = el.querySelector<TreeItem>('[key="leaf"]')!
    expect(leaf.shadowRoot!.querySelector('.expand-btn')).to.not.exist
    expect(leaf.shadowRoot!.querySelector('.expand-placeholder')).to.exist
  })

  it('per-item icon overrides tree-level icon', async () => {
    const el = await mount<Tree>(`
      <ae-tree icon="chevron-right">
        <ae-tree-item key="p" icon="chevron-down">
          Parent
          <ae-tree-item key="c">Child</ae-tree-item>
        </ae-tree-item>
      </ae-tree>
    `)
    await updated()
    await updated()

    const parent = el.querySelector<TreeItem>('[key="p"]')!
    const icon = parent.shadowRoot!.querySelector<HTMLElement>('.expand-btn ae-icon')!
    expect(icon).to.exist
    expect(icon.getAttribute('name')).to.equal('chevron-down')
  })

  it('items without explicit key get a stable auto-generated key', async () => {
    const el = await mount<Tree>(`
      <ae-tree>
        <ae-tree-item id="nokey">No Key</ae-tree-item>
      </ae-tree>
    `)
    await updated()

    let detail: any
    el.addEventListener('select', (e: Event) => { detail = (e as CustomEvent).detail })

    el.querySelector<TreeItem>('#nokey')!
      .shadowRoot!.querySelector<HTMLButtonElement>('.tree-item-label')!.click()

    expect(detail).to.exist
    expect(detail.key).to.be.a('string')
    expect(detail.key.startsWith('ae-tree-item-')).to.be.true
  })
})
