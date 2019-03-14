import { Rule, SchematicContext, Tree, apply, noop, filter, move, mergeWith, MergeStrategy, url, template } from '@angular-devkit/schematics';
import { setupOptions } from './setupOptions';
import { normalize, strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function routing(options: any): Rule {

  return (tree: Tree, context: SchematicContext) => {
    console.log('start routing');
    console.log('options', options);
    setupOptions(tree, options);
    console.log('end1');
    const movePath = (options.flat) ?
      normalize(options.path) :
      normalize(options.path + '/' + strings.dasherize(options.name));

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(movePath),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Default);
    console.log('end');
    return rule(tree, context);
  };
}
