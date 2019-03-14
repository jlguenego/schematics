import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function routing(_options: any): Rule {
  console.log('hello');
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('AJLG.txt', 'this is a content');
    return tree;
  };
}
