export const multilineToSingleLine = (text: string) => {
  if (!text) {
    return '';
  }

  return text.replaceAll(/[\n\r]/g, ' ');
};

export const multilineToSingleLineLowerCased = (text: string) => {
  if (!text) {
    return '';
  }

  return multilineToSingleLine(text).toLowerCase();
};
