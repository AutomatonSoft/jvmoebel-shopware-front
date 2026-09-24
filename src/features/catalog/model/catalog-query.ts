export function getCatalogQueryValues(
  parameters: URLSearchParams,
  key: string,
): string[] {
  return parameters
    .getAll(key)
    .flatMap((entry) => entry.split(",").filter(Boolean));
}

export function toggleCatalogQueryValue(
  parameters: URLSearchParams,
  key: string,
  value: string,
): string[] {
  const values = getCatalogQueryValues(parameters, key);

  return values.includes(value)
    ? values.filter((selectedValue) => selectedValue !== value)
    : [...values, value];
}

export function toggleCatalogPropertyValue(
  parameters: URLSearchParams,
  groupId: string,
  value: string,
): string[] {
  const properties = getCatalogQueryValues(parameters, "property");
  const prefix = `${groupId}:`;
  const property = `${prefix}${value}`;

  return properties.includes(property)
    ? properties.filter((selectedProperty) => selectedProperty !== property)
    : [...properties, property];
}
