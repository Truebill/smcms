export function getFileExtension(key) {
  return key.substr(key.lastIndexOf('.') + 1);
}

export function isUrl(str) {
  // Matches URLs (naively).
  const urlRegex = /^(?:[a-z]+:)?\/\//i;
  return urlRegex.test(str);
}
