export function generateScopeSelectors(scopes: string[][]): string[] {
  if(scopes.length === 0) {
    return [];
  }

  let selectors = scopes[0];

  for(let i = 1; i < scopes.length; i++) {
    let scope = scopes[i];

    let acc = [];

    for(let base of selectors) {
      for(let selector of scope) {
        acc.push(`${base} ${selector}`);
      }
    }

    selectors = acc;
  }

  return selectors;
}
