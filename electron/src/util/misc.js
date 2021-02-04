function createCommandLineArgs(argJson) {
  return Object.keys(argJson).map(
    (key) =>
      "--" +
      (typeof argJson[key] === "boolean" && argJson[key]
        ? key
        : `${key}=${argJson[key]}`)
  );
}

function isNumericString(str) {
  try {
    parseInt(str);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = { createCommandLineArgs, isNumericString };
