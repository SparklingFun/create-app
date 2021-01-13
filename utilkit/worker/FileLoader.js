async function htmlLoader(url) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  const response = await fetch(url, init);
  const results = await response.text();
  return results;
}

const FileLoaders = {
  html: htmlLoader
}

export default FileLoaders;