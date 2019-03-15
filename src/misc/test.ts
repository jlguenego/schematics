import * as ts from 'typescript';
import * as fs from 'fs';
import { findNode } from '@schematics/angular/utility/ast-utils';

// function getName(num: any) {
//     for (let p in ts.SyntaxKind) {
//         if (p == num) {
//             console.log('name', p, ts.SyntaxKind[p]);
//         }
//     }
// }

function insert(source: string, content: string, start: number, end: number) {
    return source.substring(0, start) + content + source.substring(end);
}

function updateRoutes(sourceText: string, textToAdd: string): string {
    const source: ts.SourceFile = ts.createSourceFile(filename, sourceText, ts.ScriptTarget.Latest, true);
    const node = findNode(source, ts.SyntaxKind.Identifier, 'routes');
    if (node === null) {
        throw new Error('error');
    }
    const parent = node.parent;
    if (parent.kind !== ts.SyntaxKind.VariableDeclaration) {
        throw new Error('routes is not a variable declaration');
    }
    const initializer = (<ts.VariableDeclaration>parent).initializer;
    if (initializer === undefined || initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        throw new Error();
    }
    const array = initializer.getChildren();
    const lastChild = array[1];
    
    const replacedText = insert(sourceText, textToAdd, lastChild.end, lastChild.end);
    return replacedText;
}

const filename = './hello.ts.tmpl';
const sourceText = fs.readFileSync(filename).toString();
const replacedText = updateRoutes(sourceText, ',{truc: "coucou"}');

console.log('replacedText', replacedText);
