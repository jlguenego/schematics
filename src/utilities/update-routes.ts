import { Rule, Tree } from "@angular-devkit/schematics";
import { readIntoSourceFile } from "./common";
import { InsertChange, Change } from "@schematics/angular/utility/change";
import * as ts from 'typescript';
import { normalize, strings } from "@angular-devkit/core";
import { findNode } from "@schematics/angular/utility/ast-utils";

function getUpdateRoutesChanges(source: ts.SourceFile): Change[] {
    console.log('source', source);
    const routeIdentifier: ts.Identifier = <ts.Identifier> findNode(source, ts.SyntaxKind.Identifier, 'routes');
    console.log('routeIdentifier', routeIdentifier);
    return [];
}

export function updateRoutes(options: any): Rule {

    return (tree: Tree) => {
        console.log('options', options);
        const movePath = (options.flat) ?
            normalize(options.path) :
            normalize(options.path + '/' + strings.dasherize(options.name));
        const routingModulePath = movePath + '-routing.module.ts';
        const source = readIntoSourceFile(tree, routingModulePath);

        const changes = getUpdateRoutesChanges(source);
        const recorder = tree.beginUpdate(routingModulePath);

        for (let change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        tree.commitUpdate(recorder);
        return tree;
    };
}