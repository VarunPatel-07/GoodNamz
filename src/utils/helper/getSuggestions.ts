export const GetNameSuggestion = (name: string): string => {
  if (name.startsWith("data")) {
    return "userData";
  }
  if (name.startsWith("temp")) {
    return "temporaryValue";
  }
  if (name === "a") {
    return "count";
  }
  if (name === "b") {
    return "result";
  }
  if (name === "foo") {
    return "handler";
  }
  if (name === "bar") {
    return "response";
  }
  return "meaningfulName";
};
