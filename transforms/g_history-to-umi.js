const {printOptions} = require('./utils/config');
const {addSubmoduleImport, removeEmptyModuleImport, parseStrToArray} = require('./utils');

const deprecatedComponentNames = ['g_history'];

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const antdPkgNames = parseStrToArray(options.antdPkgNames || 'umi');

  // import deprecated components from 'umi'
  function importDeprecatedComponent(j, root) {
    let hasChanged = false;

    // window.g_history

    root
      .find(j.Identifier)
      .filter((path) => {
        const isInWindow = path.parent.node.object && path.parent.node.object.name === 'window';
        return deprecatedComponentNames.includes(path.node.name) && isInWindow;
      })
      .forEach((path) => {
        hasChanged = true;

        addSubmoduleImport(j, root, {
          moduleName: 'umi',
          importedName: 'history',
          localName: 'history',
        });
        j(path.parent).replaceWith(j.identifier('history'));
      });

    return hasChanged;
  }

  // step1. import deprecated components from 'umi'
  // step2. cleanup antd import if empty
  let hasChanged = false;
  hasChanged = importDeprecatedComponent(j, root) || hasChanged;

  if (hasChanged) {
    antdPkgNames.forEach((antdPkgName) => {
      removeEmptyModuleImport(j, root, antdPkgName);
    });
  }

  return hasChanged ? root.toSource(options.printOptions || printOptions) : null;
};
