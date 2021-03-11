const {printOptions} = require('./utils/config');
const {addSubmoduleImport, removeEmptyModuleImport, parseStrToArray} = require('./utils');

const deprecatedComponentNames = ['Link', 'NavLink', 'dynamic', 'withRouter', 'Redirect'];

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const antdPkgNames = parseStrToArray(
    options.antdPkgNames || 'umi/link,umi/navlink,umi/dynamic,umi/withRouter,umi/redirect',
  );

  // import deprecated components from 'umi'
  function importDeprecatedComponent(j, root) {
    let hasChanged = false;

    // import Link from 'umi/link';
    root
      .find(j.Identifier)
      .filter((path) => {
        return (
          deprecatedComponentNames.includes(path.node.name) &&
          path.parent.node.type === 'ImportDefaultSpecifier' &&
          antdPkgNames.includes(path.parent.parent.node.source.value)
        );
      })
      .forEach((path) => {
        hasChanged = true;
        const antdPkgName = path.parent.parent.node.source.value;

        // remove old imports
        const importDeclaration = path.parent.parent.node;
        importDeclaration.specifiers = [];

        // add new import from 'umi'
        const localComponentName = path.parent.node.local.name;
        addSubmoduleImport(j, root, {
          moduleName: 'umi',
          importedName: path.node.name,
          localName: localComponentName,
          before: antdPkgName,
        });
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
