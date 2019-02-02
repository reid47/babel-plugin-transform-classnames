# classnames.macro

A Babel plugin that optimizes the composition of class names in React components (or anywhere, really). It lets you write code similarly to how you would with the popular [classnames](https://github.com/JedWatson/classnames) library, but this "library" is compiled away at build time.

Input:

```js
import cn from 'classnames.macro';

function MyComponent(props) {
  return (
    <div
      className={cn('hello', 'world', something, {
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
        'hello world ' +
        (something || '') +
        ' always' +
        (props.test ? ' wow' : '') +
        (props.size > 100 ? ' big' : '')
      }
    />
  );
}
```

This removes your dependency on a library like `classnames` and means that no extra work is done to join your class names together at runtime.

Here are some more examples. Note that this plugin is not limited to use within React components. It will work anywhere it sees an import statement that looks like `import someIdentifier from 'classnames.macro';`.

Input:

```js
import classNames from 'classnames.macro';

const a = classNames('wow', 'cool', 'nice');
const b = classNames();
const c = classNames('hello', { world: maybe });
const d = classNames(something, somethingElse);
```

Output:

```js
const a = 'wow cool nice';
const b = '';
const c = 'hello' + (maybe ? ' world' : '');
const d = (something || '') + ' ' + (somethingElse || '');
```

## Caveats

Since this transformation happens at compile time, it doesn't have any runtime information about the code it's transforming. In practice, this means there are a couple of things that the `classnames` library can do that this library cannot do.

For example, things like this:

```js
import classnames from 'classnames';

// pretend this is calculated somewhere else or imported from another file
const arrayOfNames = ['name1', 'name2'];

classnames('hello', arrayOfNames);
```

`classnames` is able to check the type of `arrayOfNames`, see that it's an array, and join all the names into a string at runtime (like `hello name1 name2`). But `classnames.macro` won't know this is an array at compile time. It will be transformed into something like:

```js
'hello ' + (arrayOfNames || '')
```

...which, when evaluated at runtime, would look like `hello name1,name2` (just `toString`ing that array).

It's definitely possible to work around this. Still, it's important to be aware that this library is not aiming for 100% feature parity with that library (and could never achieve it). It's a tradeoff for the improved runtime performance that this library gives.