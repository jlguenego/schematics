import { Rule, Tree } from "@angular-devkit/schematics";
import { readIntoSourceFile } from "./common";
import { InsertChange, Change } from "@schematics/angular/utility/change";
import * as ts from 'typescript';
import { normalize, strings } from "@angular-devkit/core";
import { findNode, insertImport } from "@schematics/angular/utility/ast-utils";
import { buildRelativePath } from "@schematics/angular/utility/find-module";

function getUpdateRoutesChanges(source: ts.SourceFile, options: UpdateRoutesOptions): Change[] {
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
    let separator = ',';
    if ((<ts.ArrayLiteralExpression>initializer).elements.length === 0) {
        separator = '';
    }
    const path = options.url || 'TBD';
    const component = strings.classify(options.componentName) + 'Component';
    return [new InsertChange(source.text, lastChild.end, `${separator}{path: "${path}", component: ${component}}`)];
}

export interface UpdateRoutesOptions {
    flat?: boolean;
    path: string; // path of the routing module
    name: string; // name of the module (and routing module)
    componentName: string; // name of the component
    componentPath: string; // path of the component
    url: string; // url of the route component (route.path)
}

export function updateRoutes(options: any): Rule {
    return (tree: Tree) => {
        const path = (options.flat && options.name !== 'app') ?
            normalize(options.path) :
            normalize(options.path + '/' + strings.dasherize(options.name));
        const routingModulePath = path + '-routing.module.ts';
        const source = readIntoSourceFile(tree, routingModulePath);
        const changes = getUpdateRoutesChanges(source, options);
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

export function insertImportToModule(options: UpdateRoutesOptions): Rule {
    return (tree: Tree) => {
        const path = (options.flat && options.name !== 'app') ?
            normalize(options.path) :
            normalize(options.path + '/' + strings.dasherize(options.name));
        const routingModulePath = path + '-routing.module.ts';
        const source = readIntoSourceFile(tree, routingModulePath);
        const component = strings.classify(options.componentName) + 'Component';
        const componentPath = normalize(options.componentPath + '/' + options.componentName + '/' + options.componentName + '.component');
        const relativePath = buildRelativePath(routingModulePath, componentPath);
        const change = insertImport(
            source,
            routingModulePath,
            component,
            relativePath);
        const recorder = tree.beginUpdate(routingModulePath);


        if (change instanceof InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }

        tree.commitUpdate(recorder);
        return tree;
    };
}