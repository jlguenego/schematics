import { Rule, SchematicContext, Tree, chain, externalSchematic, SchematicsException, schematic } from '@angular-devkit/schematics';
import { setupOptions } from '../utilities/setupOptions';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { basename, Path } from '@angular-devkit/core';

const MODULE_EXT = '.module.ts';

function isFlat(path: Path, name: string) {
  const dir = <string>basename(path);
  console.log('dir', dir);
  console.log('name', name);
  return dir !== name || dir === 'app';
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function route(options: any): Rule {
  // purpose: add a route in a module.
  // 1) add a new component in the route directory under the module
  // 2) find the module it has to go in from the path
  // 3) create a routing module if needed
  // 4) add the route in the route variable.
  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);
    const rules: Rule[] = [];

    rules.push(externalSchematic('@schematics/angular', 'component', options));

    const modulePath = findModuleFromOptions(tree, options);
    console.log('modulePath', modulePath);

    if (!modulePath) {
      throw new SchematicsException(`module to add the route not found.`);
    }

    const moduleParsedPath = parseName('', modulePath);
    const name = moduleParsedPath.name.split(MODULE_EXT)[0];

    const routingOptions = {
      name,
      flat: isFlat(moduleParsedPath.path, name),
    };
    console.log('routingOptions.name', routingOptions.name);

    // call tye schematic routing
    rules.push(schematic('routing', routingOptions));

    // adding in the route variable


    return chain(rules)(tree, context);
  };
}
