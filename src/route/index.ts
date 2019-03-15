import { Rule, SchematicContext, Tree, chain, externalSchematic, SchematicsException, schematic } from '@angular-devkit/schematics';
import { setupOptions } from '../utilities/setupOptions';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';

const MODULE_EXT = '.module.ts';

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
      throw new SchematicsException(`Looks like the schema.json is not right...`);
    }
    
    const moduleParsedPath = parseName('', modulePath);
    const moduleName = moduleParsedPath.name.split(MODULE_EXT)[0];
    console.log('moduleName', moduleName);
    const routingOptions = {
      name: moduleName,
    };
    rules.push(schematic('routing', routingOptions));

    return chain(rules)(tree, context);
  };
}
