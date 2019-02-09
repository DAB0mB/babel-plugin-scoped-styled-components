import * as babel from '@babel/core'
import jsxPlugin from '@babel/plugin-syntax-jsx'
import scopedStyledComponentsPlugin from '.'

describe('babel-plugin-scoped-styled-components', () => {
  it('should replace "._" rules with props.__scopename', () => {
    const code = transform(freeText(`
      styled.div\`
        .bar {

        }

        ._foo {

        }
      \`
    `))

    expect(code).toEqual(freeText(`
      styled.div\`
        .bar {

        }

        .\$\{props => props.__scopename\}-foo {

        }
      \`;
    `))
  })

  it('should replace define __scopename for <Style /> components', () => {
    const code = transform(freeText(`
      const MyComponent = (
        <MyComponentStyle />
      )

      const MyOtherComponent = (
        <div />
      )
    `))

    expect(code).toEqual(freeText(`
      const MyComponent = <MyComponentStyle __scopename="__scope0" />;
      const MyOtherComponent = <div />;
    `))
  })

  it('should replace "_" class names with __scopename literals', () => {
    const code = transform(freeText(`
      const MyComponent = (
        <MyComponentStyle>
          <div className="_foo bar" />
        </MyComponentStyle>
      )
    `))

    expect(code).toEqual(freeText(`
      const MyComponent = <MyComponentStyle __scopename=\"__scope0\">
          <div className=\"__scope0-foo bar\" />
        </MyComponentStyle>;
    `))
  })
})

const transform = (code) => {
  return babel.transformSync(code, {
    plugins: [scopedStyledComponentsPlugin, jsxPlugin],
    code: true,
    ast: false,
  }).code
}

// Will use the shortest indention as an axis
export const freeText = (text) => {
  if (text instanceof Array) {
    text = text.join('')
  }

  // This will allow inline text generation with external functions, same as ctrl+shift+c
  // As long as we surround the inline text with ==>text<==
  text = text.replace(
    /( *)==>((?:.|\n)*?)<==/g,
    (match, baseIndent, content) =>
  {
    return content
      .split('\n')
      .map(line => `${baseIndent}${line}`)
      .join('\n')
  })

  const lines = text.split('\n')

  const minIndent = lines.filter(line => line.trim()).reduce((minIndent, line) => {
    const currIndent = line.match(/^ */)[0].length

    return currIndent < minIndent ? currIndent : minIndent
  }, Infinity)

  return lines
    .map(line => line.slice(minIndent))
    .join('\n')
    .trim()
    .replace(/\n +\n/g, '\n\n')
}
