export default function(babel) {
  const { types: t } = babel;
  const bin = t.binaryExpression;
  const str = t.stringLiteral;
  const isBin = t.isBinaryExpression;
  const isStr = t.isStringLiteral;

  return {
    name: 'classnames.macro',

    visitor: {
      ImportDeclaration(path, state) {
        const { source, specifiers } = path.node;
        if (!isStr(source, { value: 'classnames.macro' })) return;
        if (specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0])) {
          state.alias = specifiers[0].local.name;
          path.remove();
        }
      },

      CallExpression(path, state) {
        if (t.isIdentifier(path.node.callee, { name: state.alias })) {
          const args = path.node.arguments;
          const parts = [];

          args.forEach(arg => {
            if (isStr(arg)) {
              if (parts.length) arg.value = ' ' + arg.value;
              parts.push(arg);
              return;
            }

            if (t.isIdentifier(arg)) {
              if (arg.name === 'undefined') return;
              if (parts.length) parts.push(str(' '));
              parts.push(t.logicalExpression('||', arg, str('')));
              return;
            }

            if (t.isObjectExpression(arg)) {
              arg.properties.forEach(prop => {
                const className = prop.computed ? prop.key : str(' ' + prop.key.name);

                if (t.isBooleanLiteral(prop.value) || t.isNumericLiteral(prop.value)) {
                  if (prop.value.value) {
                    parts.push(className);
                  }
                  return;
                }

                parts.push(t.conditionalExpression(prop.value, className, str('')));
              });
              return;
            }

            if (parts.length) parts.push(str(' '));
            parts.push(arg);
          });

          const newNode = parts.reduce((expr, part) => {
            if (!expr) {
              if (isStr(part)) part.value = part.value.trim();
              return part;
            }

            if (isStr(expr) && isStr(part)) {
              expr.value += part.value;
              return expr;
            }

            if (isBin(expr) && isStr(expr.right) && isStr(part)) {
              expr.right.value += part.value;
              return expr;
            }

            return bin('+', expr, part);
          }, null);

          path.replaceWith(newNode || str(''));
        }
      }
    }
  };
}
