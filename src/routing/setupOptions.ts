import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, ProjectType } from '@schematics/angular/utility/workspace-models';

export function setupOptions(host: Tree, options: any): Tree {
    console.log('start');
    console.log('start01');
    const workspace = getWorkspace(host);
    console.log('start1');
    if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
    }
    console.log('start2');
    const project = workspace.projects[options.project];
    console.log('start3');
    if (options.path === undefined) {
        options.path = buildDefaultPath(<WorkspaceProject<ProjectType.Application>>project);
    }
    console.log('start4x', options.path, options.name, options);
    if (options.name === undefined) {
        options.name = 'titi';
    }
    const parsedPath = parseName(options.path, options.name);
    console.log('start5');
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    console.log('end');
    return host;
}
