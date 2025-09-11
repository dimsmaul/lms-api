export function getNestedArray(obj: any, path: string): any[] {
  const keys = path.split('.');
  let current: any[] = [obj]; // mulai dari root sebagai array
  for (const key of keys) {
    current = current.flatMap((item) => {
      if (Array.isArray(item[key])) return item[key];
      if (item[key] !== undefined) return [item[key]];
      return [];
    });
  }
  return current;
}

export function setNestedArray(obj: any, path: string, updater: (val: any) => any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let targets: any[] = [obj];

  for (const key of keys) {
    targets = targets.flatMap((item) => {
      if (Array.isArray(item[key])) return item[key];
      if (item[key] !== undefined) return [item[key]];
      return [];
    });
  }

  for (const target of targets) {
    if (target && target[lastKey]) {
      target[lastKey] = updater(target[lastKey]);
    }
  }
}
