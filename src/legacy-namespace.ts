import * as Browser from "./types";
import { mapToArray, arrayToMap } from "./helpers";

export function collectLegacyNamespaceTypes(webidl: Browser.WebIdl): Browser.Interface[] {
  if (!webidl.namespaces) {
    return [];
  }

  const namespaceMap: Record<string, Browser.Interface> = arrayToMap(webidl.namespaces, i => i.name, i => i);
  for (const i of mapToArray(webidl.interfaces!.interface)) {
    if (i["legacy-namespace"]) {
      getNamespace(i["legacy-namespace"]).nested!.interfaces.push(i);
    }
  }
  for (const i of mapToArray(webidl.dictionaries!.dictionary)) {
    if (i["legacy-namespace"]) {
      getNamespace(i["legacy-namespace"]).nested!.dictionaries.push(i);
    }
  }
  for (const i of mapToArray(webidl.enums!.enum)) {
    if (i["legacy-namespace"]) {
      getNamespace(i["legacy-namespace"]).nested!.enums.push(i);
    }
  }

  return mapToArray(namespaceMap);

  function getNamespace(name: string) {
    if (name in namespaceMap) {
      const nestedAdded = addEmptyNested(namespaceMap[name]);
      namespaceMap[name] = nestedAdded;
      return nestedAdded;
    }
    throw new Error(`Couldn't find a namespace named ${name}.`);
  }
}

function addEmptyNested(namespace: Browser.Interface): Browser.Interface {
  if (namespace.nested) {
    return namespace;
  };
  return {
    ...namespace,
    nested: {
      interfaces: [],
      enums: [],
      dictionaries: []
    }
  };
}