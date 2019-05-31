import custom from '../webpack/webpack.config.custom';

const path = require('path');

const { alias } = custom.resolve;

const isRelative = (filePath = '') => filePath[0] === '.';
const filterNonRelative = p => isRelative(p.value.value);

const getKeyByValue = (object, value) =>
  Object.keys(object).find(key => object[key] === value);

const renameLiteral = (j, newPath) => p => {
  j(p).replaceWith(() => j.literal(newPath));
};

export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const fileAbsPath = fileInfo.path;

  const importDeclarations = root
    .find(j.ImportDeclaration)
    .find(j.Literal)
    .filter(filterNonRelative);

  const aliasImports = [];
  importDeclarations.paths().forEach(importDeclaration => {
    const relativeImport = importDeclaration.value.value;
    const correspondingAlias = getKeyByValue(
      alias,
      path.dirname(path.resolve(path.dirname(fileAbsPath), relativeImport)),
    );

    if (correspondingAlias) {
      aliasImports.push(
        correspondingAlias.concat('/', path.basename(relativeImport)),
      );
    } else {
      aliasImports.push(relativeImport);
    }
  });

  importDeclarations.forEach((importDeclaration, i) => {
    const rewriter = renameLiteral(j, aliasImports[i]);
    rewriter(importDeclaration);
  });

  return root.toSource();
};
