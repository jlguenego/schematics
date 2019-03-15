import { Rule, Tree } from "@angular-devkit/schematics";
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from "@schematics/angular/utility/find-module";
import { InsertChange } from "@schematics/angular/utility/change";
import { strings } from "@angular-devkit/core";

import { readIntoSourceFile } from "./common";

export interface MyOptions {
    modulePath: string; // path of the module
    importedModulePath: string; // path of the imported module
    importedModuleName: string; // name of the class of the imported module
}

export function addImportToNgModule(options: MyOptions): Rule {
    return (host: Tree) => {

        const modulePath = options.modulePath;
        const importedModulePath = options.importedModulePath;
        const source = readIntoSourceFile(host, modulePath);
        const relativePath = buildRelativePath(modulePath, importedModulePath);

        const changes = addImportToModule(
            source,
            modulePath,
            strings.classify(options.importedModuleName),
            relativePath);
        const recorder = host.beginUpdate(modulePath);

        for (let change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
