export function truncateText(text, l) {
  return text.length <= l ? text : text.slice(0, l) + "...";
}

export const filter = (arr, callback) => {
  return arr.filter(callback);
};

export function textToImage(text) {
  const spaced = text.split(" ");
  let joined;

  if (spaced.length < 2) {
    const splited = spaced[0].split("");

    if (splited.length < 2) {
      joined = splited[0];
    } else {
      joined = splited[0] + splited[1];
    }
  } else {
    joined = spaced[0].split("")[0] + spaced[1].split("")[0];
  }

  return joined.toUpperCase();
}
