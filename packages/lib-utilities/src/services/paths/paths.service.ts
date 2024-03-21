import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { cwd } from 'process';
import { AppLoggerService } from '../logger/app-logger.service.js';
import { processEnv } from '../../utils/processEnv.js';
import { globSync } from 'glob';

@Injectable()
export class PathsService {
  constructor() {

    // Example output: [ 'package.json', 'src/services/paths/package.json' ]
    const allProjectPackageJson = globSync('**/package.json', { 
      ignore: 'node_modules/**',
      cwd: path,
      debug: processEnv.isDebug,
    });

    // We see the root package.json as the product package.json.
    // If that doesn't exist we're very confused.
    const productPackageJson = allProjectPackageJson.find(p => p === 'package.json');

    if (!productPackageJson) {
      throw new Error(`No product package.json found in the project root. cwd was ${cwd}`);
    }

    const allLibUtilities = globSync('node_modules/@marketplace-esi/lib-*/package.json', { 
      cwd: path,
      debug: processEnv.isDebug,
    });


  }

  public webPath?: string;
  public apiPath: string;
  public productPath: string;
  public sharedModulesPath: string;
  public isTurboApp: boolean;

  public get paths(): { n: string, p: string }[] {
    return [
      {
        n: 'productPath',
        p: this.productPath,
      },
      {
        n: 'app-root-path',
        p: path
      },
      {
        n: 'cwd',
        p: cwd()
      },
      {
        n: '__dirname',
        p: __dirname
      },
      {
        n: '__filename',
        p: __filename
      },
    ]
  }

  public logPaths(l: AppLoggerService): void {
    this.paths.forEach(p => 
      l.log(`${p.n}: ${p.p}`)
    );
  }
}
