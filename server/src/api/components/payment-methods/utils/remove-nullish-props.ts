function removeNullishProperties<T extends Record<string, unknown>>(obj: T): T {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });

  return obj;
}

export default removeNullishProperties;
