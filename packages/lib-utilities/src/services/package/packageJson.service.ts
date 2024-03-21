import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { PackageJsonContext } from './PackageJsonContext';
import { PathsService } from '../paths/paths.service';
import { PackageJson } from 'type-fest';

@Injectable()
export class AppPackageJsonService {
  constructor(
    private readonly p: PathsService,
  ) {
    const pr = this.loadPj(this.p.productPath);
    const app = this.loadPj(this.p.apiPath);
    const sm = this.loadPj(this.p.sharedModulesPath);
    const web = this.loadPj(this.p.webPath, false);
    
    this.ctx = {
      productPath: pr.p!,
      productPj: pr.pj!,
      appPath: app.p!,
      appPj: app.pj!,
      smPath: sm.p!,
      smPj: sm.pj!,
      webPath: web.p,
      webPj: web.pj,
    };
  }

  public ctx: PackageJsonContext;

  private loadPj(root: string | undefined, thr = true): {
    pj: PackageJson | undefined;
    p: string | undefined;
  } {
    if (!root) return { pj: undefined, p: undefined };
    let pjContent: string | undefined = undefined;
    let pj: PackageJson | undefined = undefined;
    let p = join(root, 'package.json');

    if (existsSync(p)) {
      pjContent = readFileSync(p, {
        encoding: 'utf-8',
      });
    } else {
      if (thr) {
        throw new Error(`No package.json found on path ${p}`);
      }
    }

    if (pjContent) {
      pj = JSON.parse(pjContent);
    }

    return { pj, p };
  }

  /**
   * Returns the full path of the main entry file (for NestJs this is main.js) for the currently loaded app.
   */
  get appMainJs(): string | undefined {
    if (!this.ctx.appPj.main) {
      return undefined;
    }

    const p = this.ctx.appPath;
    const mainDir = dirname(p);
    return join(mainDir, this.ctx.appPj.main);
  }
}
