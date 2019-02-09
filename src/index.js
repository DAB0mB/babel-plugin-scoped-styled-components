import { types as t } from '@babel/core'
import generate from '@babel/generator'
import { declare } from '@babel/helper-plugin-utils'

export default declare((api) => {
  api.assertVersion(7)

  return {
    name: 'scoped-styled-components',

    pre() {
      this.scopeUid = () => {
        const id = this.scopeUid.memo || 0
        this.scopeUid.memo = id + 1

        return `__scope${id}`
      }
    },

    visitor: {
      TaggedTemplateExpression(path) {
        // Much easier to handle as a string rather than an AST
        const tagCode = generate(path.node.tag).code

        if (!/^styled/.test(tagCode)) return

        path.node.quasi.quasis.forEach((templateElement) => {
          templateElement.value.raw = templateElement.value.raw
            .replace(/\._+/g, '.${props => props.__scopename}-')
        })
      },

      JSXOpeningElement(path) {
        if (!/Style$/.test(path.node.name.name)) return

        let scopeAttr = path.node.attributes.find((attr) => {
          return attr.name.name == '__scopename'
        })

        if (!scopeAttr) {
          scopeAttr = t.jsxAttribute(t.jsxIdentifier('__scopename'))
          path.node.attributes.push(scopeAttr)
        }

        if (!scopeAttr.value) {
          scopeAttr.value = t.stringLiteral(this.scopeUid())
        }
      },

      JSXElement(path) {
        let scopeAttr
        let scopePath = path.parentPath

        while (!scopeAttr && t.isJSXElement(scopePath.node)) {
          scopeAttr = scopePath.node.openingElement.attributes.find((attr) => {
            return attr.name.name == '__scopename'
          })

          scopePath = path.parentPath
        }

        // JSXElement is not scoped
        if (!scopeAttr) return

        const classAttr = path.node.openingElement.attributes.find((attr) => {
          return attr.name.name == 'className'
        })

        if (!classAttr) return

        const scopeName = scopeAttr.value.value
        const className = classAttr.value.value.replace(/_+/g, `${scopeName}-`)

        classAttr.value = t.stringLiteral(className)
      },
    },
  }
})
