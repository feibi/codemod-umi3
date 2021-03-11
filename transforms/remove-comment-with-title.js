module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  return j(file.source)
    .find(j.Comment)
    .forEach((path) => {
      console.log(path, path.value.value);
      if (path.value.value.indexOf('title:') > -1) {
        path.prune();
      }
    })
    .toSource();
};
