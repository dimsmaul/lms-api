export function getNested(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setNested(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => acc[key] ??= {}, obj);
  target[lastKey] = value;
}
