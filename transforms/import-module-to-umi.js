const {printOptions} = require('./utils/config');
const {addSubmoduleImport, removeEmptyModuleImport, parseStrToArray} = require('./utils');

const deprecatedComponentNames = [
  // 'connect',
  // 'useSelector',
  // 'delay',
  // 'useDispatch',
  // 'useLocation',
  // 'useParams',
  // 'injectIntl',
  'formatMessage',
  // 'FormattedMessage',
  'Helmet',
  'ConnectedProps',
];

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const antdPkgNames = parseStrToArray(
    options.antdPkgNames || 'react-redux,react-helmet,umi-plugin-locale', // ,redux-saga
  );

  // import deprecated components from 'umi'
  function importDeprecatedComponent(j, root) {
    let hasChanged = false;

    // import { connect } from 'dva';
    // import { injectIntl } from 'react-intl';
    root
      .find(j.Identifier)
      .filter((path) => {
        return (
          deprecatedComponentNames.includes(path.node.name) &&
          path.parent.node.type === 'ImportSpecifier' &&
          antdPkgNames.includes(path.parent.parent.node.source.value)
        );
      })
      .forEach((path) => {
        hasChanged = true;
        const importedComponentName = path.parent.node.imported.name;
        const antdPkgName = path.parent.parent.node.source.value;

        // remove old imports
        const importDeclaration = path.parent.parent.node;
        importDeclaration.specifiers = importDeclaration.specifiers.filter(
          (specifier) => !specifier.imported || specifier.imported.name !== importedComponentName,
        );

        // add new import from 'umi'
        const localComponentName = path.parent.node.local.name;
        addSubmoduleImport(j, root, {
          moduleName: 'umi',
          importedName: importedComponentName,
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
