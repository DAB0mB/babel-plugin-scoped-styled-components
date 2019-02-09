[![CircleCI](https://circleci.com/gh/DAB0mB/babel-plugin-scoped-styled-components/tree/master.svg?style=svg)](https://circleci.com/gh/DAB0mB/babel-plugin-scoped-styled-components/tree/master)

# babel-plugin-scoped-styled-components

Removes the necessity for a dedicated styled component for every React element; instead, we can just use the `className` prop. See [example](#example) below.

### Example

#### old

```jsx
const Button = styled.button `
  border-radius: 999px;
`

const RedButton = styled(Button) `
  color: red;
`

const GreenButton = styled(Button) `
  color: green;
`

const BlueButton = styled(Button) `
  color: blue;
`

const Dashboard = (
  <div>
    <RedButton />
    <GreenButton />
    <BlueButton />
  </div>
)
```

#### new

```jsx
const DashboardStyle = styled.div `
  ._btn {
    border-radius: 999px;
  }

  ._red-btn {
    color: red;
  }

  ._green-btn {
    color: green;
  }

  ._blue-btn {
    color: blue;
  }
`

const Dashboard = (
  <DashboardStyle>
    <button className="_btn _red-btn" />
    <button className="_btn _green-btn" />
    <button className="_btn _blue-btn" />
  </DashboardStyle>
)
```

#### out

```jsx
const DashboardStyle = styled.div `
  .${props => props.__scopename}-btn {
    border-radius: 999px;
  }

  .${props => props.__scopename}-red-btn {
    color: red;
  }

  .${props => props.__scopename}-green-btn {
    color: green;
  }

  .${props => props.__scopename}-blue-btn {
    color: blue;
  }
`

const Dashboard = (
  <DashboardStyle __scopename="__scope0">
    <button className="__scope0-red-btn" />
    <button className="__scope0-green-btn" />
    <button className="__scope0-blue-btn" />
  </DashboardStyle>
)
```

### Usage

- ALWAYS use the `styled` identifier to declare styled components.
- ALWAYS use the `Style` postfix for components that you would like to scope.
- Use the `_` prefix for class names that you would like to encapsulate.

### Installation

`babel-plugin-scoped-styled-components` is installable via NPM (or Yarn):

    $ npm install babel-plugin-scoped-styled-components

Add the plug-in to your `.babelrc`:

```json
{
  "plugins": ["babel-plugin-scoped-styled-components"]
}
```

### License

MIT
