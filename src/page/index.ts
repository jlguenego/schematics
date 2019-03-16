import { Rule, SchematicContext, Tree, externalSchematic, chain } from '@angular-devkit/schematics';
import { Schema as ComponentOptions } from '@schematics/angular/component/schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function page(options: ComponentOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const createComponentOptions: ComponentOptions = {
      ...options,
      name: options.name + '-page',
      entryComponent: true,
    };

    rules.push(externalSchematic('@schematics/angular', 'component', createComponentOptions));

    return chain(rules)(tree, context);
  };
}
