import { expect } from '@esm-bundle/chai'
import { mount, unmountAll } from '../helpers/mount.js'
import AeicoComponent from '../../src/aeico-component.js'
import { toKebab } from '../../src/utils'

afterEach(() => {
  unmountAll()
})

describe('AeicoComponent', () => {
  describe('static methods', () => {
    it('should have define() static method', () => {
      expect(AeicoComponent.define).to.be.a('function')
    })

    it('should prepend "ae-" prefix when name does not have it', async () => {
      class PrefixTestComponent extends AeicoComponent {}
      PrefixTestComponent.define('prefix-test')
      await customElements.whenDefined('ae-prefix-test')
      expect(customElements.get('ae-prefix-test')).to.equal(PrefixTestComponent)
    })

    it('should not double-add "ae-" prefix when name already has it', async () => {
      class PrefixTestComponent2 extends AeicoComponent {}
      PrefixTestComponent2.define('ae-prefix-test-2')
      await customElements.whenDefined('ae-prefix-test-2')
      expect(customElements.get('ae-prefix-test-2')).to.equal(PrefixTestComponent2)
    })
  })

  describe('toKebab util', () => {
    it('converts PascalCase to kebab-case', () => {
      expect(toKebab('MyComponent')).to.equal('my-component')
    })

    it('strips leading underscores and digits', () => {
      expect(toKebab('_1MyEl')).to.equal('my-el')
    })
  })

  describe('instance', () => {
    it('should create instances correctly', async () => {
      class TestComponent extends AeicoComponent {
        static define(_name: string) {
          customElements.define('test-aeico-component', TestComponent)
        }
      }
      
      TestComponent.define('test-component')
      const el = await mount<InstanceType<typeof TestComponent>>('<test-aeico-component></test-aeico-component>')
      
      // Check that element is properly instantiated
      expect(el).to.be.instanceOf(TestComponent)
      expect(el.shadowRoot).to.exist
    })
  })
})
