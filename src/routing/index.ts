import { Rule, SchematicContext, Tree, apply, noop, filter, move, mergeWith, MergeStrategy, url, template, externalSchematic, chain } from '@angular-devkit/schematics';
import { setupOptions } from '../utilities/setupOptions';
import { normalize, strings } from '@angular-devkit/core';
import { addImportToNgModule } from '../utilities/module-utils';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function routing(options: any): Rule {

  return (tree: Tree, context: SchematicContext) => {
    setupOptions(tree, options);

    const movePath = (options.flat) ?
      normalize(options.path) :
      normalize(options.path + '/' + strings.dasherize(options.name));

    const rules = [];

    // if module with same name does not exist then create it.
    const modulePath = normalize(movePath + "/" + strings.dasherize(options.name) + '.module.ts');
    if (!tree.exists(modulePath)) {
      rules.push(externalSchematic('@schematics/angular', 'module', options));
    }

    const routingModuleName = normalize(options.name + '-routing.module');
    const routingModuleClassName = strings.classify(normalize(options.name + '-routing-module'));
    const routingModulePath = normalize(movePath + '/' + routingModuleName);

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
        routingModuleName,
        routingModuleClassName,
      }),
      move(movePath),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Default);
    rules.push(rule);

    // update the module
    rules.push(addImportToNgModule({
      modulePath: modulePath,
      importedModulePath: routingModulePath,
      importedModuleName: routingModuleClassName
    }));
    return chain(rules)(tree, context);
  };
}
