# babel-plugin-classnames

A Babel plugin that optimizes the composition of class names in React components (or anywhere, really). It lets you write code similarly to how you would with the popular [classnames](https://github.com/JedWatson/classnames) library, but this "library" is optimized away at build time.

Input:

```js
import cn from 'babel-plugin-classnames';

function MyComponent(props) {
  return (
    <div
      className={cn('hello', 'world', {
        always: true,
        never: false,
        wow: props.test,
        big: props.size > 100
      })}
    />
  );
}
```

Output:

```js
function MyComponent(props) {
  return (
    <div
      className={
        'hello world always ' + (props.test ? 'wow' : '') + ' ' + (props.size > 100 ? 'big' : '')
      }
    />
  );
}
```
