import { expect } from '@esm-bundle/chai'
import { mount, unmountAll } from '../helpers/mount.js'
import AeicoComponent from '../../src/aeico-component.js'
import { toKebab } from '../../src/utils'

afterEach(() => {
  unmountAll()
})

describe('AeicoComponent', () => {
  describe('static methods', () => {
    it('should have register() static method', () => {
      expect(AeicoComponent.register).to.be.a('function')
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
        static register() {
          customElements.define('test-aeico-component', TestComponent)
        }
      }
      
      TestComponent.register()
      const el = await mount<InstanceType<typeof TestComponent>>('<test-aeico-component></test-aeico-component>')
      
      // Check that element is properly instantiated
      expect(el).to.be.instanceOf(TestComponent)
      expect(el.shadowRoot).to.exist
    })
  })
})
