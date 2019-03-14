import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { buildRelativePath } from "@schematics/angular/utility/find-module";
import { InsertChange } from "@schematics/angular/utility/change";
import { strings } from "@angular-devkit/core";

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
    const text = host.read(modulePath);
    if (text === null) {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export interface MyOptions {
    modulePath: string; // path of the module
    importedModulePath: string; // path of the imported module
    importedModuleName: string; // name of the class of the imported module
}

export function addImportToNgModule(options: MyOptions): Rule {
    console.log('add import rule');
    return (host: Tree) => {

        const modulePath = options.modulePath;
        const importedModulePath = options.importedModulePath;
        console.log('about to read source file');
        const source = readIntoSourceFile(host, modulePath);
        console.log('source file read done.');
        const relativePath = buildRelativePath(modulePath, importedModulePath);

        const changes = addImportToModule(
            source,
            modulePath,
            strings.classify(options.importedModuleName),
            relativePath);
        const recorder = host.beginUpdate(modulePath);
        console.log('recorder');

        for (let change of changes) {
            if (change instanceof InsertChange) {
                console.log('insert');
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
