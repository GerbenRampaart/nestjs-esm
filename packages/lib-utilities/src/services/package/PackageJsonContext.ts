import { PackageJson } from 'type-fest';

export interface PackageJsonContext {
  productPath: string;
  productPj: PackageJson;
  appPj: PackageJson;
  appPath: string;
  smPj: PackageJson;
  smPath: string;
  webPj?: PackageJson;
  webPath?: string;
}
