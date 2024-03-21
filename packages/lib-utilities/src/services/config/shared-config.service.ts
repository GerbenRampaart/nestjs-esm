import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LevelWithSilent } from 'pino';
import * as env from './Environment';
import { SharedConfigItem, SupportedTypes, SupportedTypesString } from './SharedConfigItem';
import { SharedConfigSchemaKeys } from './shared-config.schema';

@Injectable()
export class SharedConfigService {
  constructor(public readonly cfg: ConfigService) {
    const keys = Object.keys(SharedConfigSchemaKeys);
    for (let idx = 0; idx < keys.length; idx++) {
      const env = keys[idx];
      this.loadItem(env);
    }
  }

  public items: SharedConfigItem[] = [];

  /**
   * This also caches the items items preventing lots of hits to process.env.{ENVVAR}
   * which is notoriously slow. This should not be needed if you enabled 'cache: true'
   * on the ConfigModule.
   */
  private loadItem(env: string): SharedConfigItem {
    let item = this.items.find(sci => sci.env === env);

    if (!item) {
      item = new SharedConfigItem(
        this.cfg, 
        env as keyof typeof SharedConfigSchemaKeys
      );
      this.items.push(item);
    }

    return item;
  }

  public get<T extends SupportedTypes>(
    env: keyof typeof SharedConfigSchemaKeys,
    type: SupportedTypesString,
  ): T | undefined {
    const item = this.loadItem(env);

    try {
      return item.asType<T>(type);
    } catch (error) {
      return undefined;
    }
  }

  public getOrThrow<T extends SupportedTypes>(
    env: keyof typeof SharedConfigSchemaKeys,
    type: SupportedTypesString,
  ): T {
    const item = this.loadItem(env);
    return item.asType<T>(type);
  }

  get bitbucketBaseUrl(): URL {
    return this.getOrThrow<URL>('BITBUCKET_BASEURL', 'URL');
  }

  get bitbucketUsername(): string | undefined {
    return this.get<string>('BITBUCKET_USERNAME', 'string');
  }

  get bitbucketPassword(): string | undefined {
    return this.get<string>('BITBUCKET_PASSWORD', 'string');
  }

  get amesiHost(): string | undefined {
    return this.get<string>('AMESI_HOST', 'string');
  }

  get amesiEnvironment(): string | undefined {
    return this.get<string>('AMESI_ENVIRONMENT', 'string');
  }

  get dpmHttpRequestBaseUrl(): URL {
    return this.getOrThrow<URL>('DPM_HTTP_REQUEST_BASEURL', 'URL');
  }

  get frGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('FR_GSREST_ENDPOINT', 'URL');
  }

  get passportGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('PASSPORT_GSREST_ENDPOINT', 'URL');
  }

  get ukGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('UK_GSREST_ENDPOINT', 'URL');
  }

  get itGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('IT_GSREST_ENDPOINT', 'URL');
  }

  get nlGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('NL_GSREST_ENDPOINT', 'URL');
  }

  get latamGsrestEndpoint(): URL {
    return this.getOrThrow<URL>('LATAM_GSREST_ENDPOINT', 'URL');
  }

  get nexoEndpoint(): URL {
    return this.getOrThrow<URL>('NEXO_ENDPOINT', 'URL');
  }

  get nexoToken(): string | undefined {
    return this.getOrThrow<string>('NEXO_TOKEN', 'string');
  }

  get port(): number {
    return this.getOrThrow<number>('PORT', 'number');
  }

  get environment(): env.Environment {
    return (<never>env.Environment)[this.getOrThrow('NODE_ENV', 'string') as env.Environment];
  }

  get logLevel(): LevelWithSilent {
    return this.getOrThrow('LOG_LEVEL', 'string') as LevelWithSilent;
  }

  get dpmHttpRequestTimeout(): number {
    return this.getOrThrow<number>('DPM_HTTP_REQUEST_TIMEOUT', 'number');
  }

  get dpmHttpMaxRedirects(): number {
    return this.getOrThrow<number>('DPM_HTTP_MAX_REDIRECTS', 'number');
  }

  get gsrestHttpRequestTimeout(): number {
    return this.getOrThrow<number>('GSREST_HTTP_REQUEST_TIMEOUT', 'number');
  }

  get gsrestHttpMaxRedirects(): number {
    return this.getOrThrow<number>('GSREST_HTTP_MAX_REDIRECTS', 'number');
  }

  get dpmId(): number {
    return this.getOrThrow<number>('DPM_ID', 'number');
  }

  get dpmUser(): string {
    return this.getOrThrow<string>('DPM_USER', 'string');
  }

  get dpmPass(): string {
    return this.getOrThrow<string>('DPM_PASS', 'string');
  }

  get statusMonitor(): boolean {
    return this.getOrThrow<boolean>('STATUS_MONITOR', 'boolean');
  }

  get dpmIdForSorEndpoints(): number {
    return this.getOrThrow<number>('DPM_ID_SOR_ENDPOINTS', 'number');
  }

  get mongoUsername(): string | undefined {
    return this.get<string>('MONGO_USERNAME', 'string');
  }

  get mongoPassword(): string | undefined {
    return this.get<string>('MONGO_PASSWORD', 'string');
  }

  get mongoUri(): string | undefined {
    return this.get<string>('MONGO_URI', 'string');
  }

  get mongoDatabase(): string | undefined {
    return this.get<string>('MONGO_DATABASE', 'string');
  }

  get mongoCollectionAuthResources(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_AUTHRESOURCES', 'string');
  }

  get mongoCollectionEventTypes(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_EVENTTYPES', 'string');
  }

  get mongoCollectionNotifications(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_NOTIFICATIONS', 'string');
  }

  get mongoCollectionNotificationSubscriptions(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_NOTIFICATIONSUBSCRIPTIONS', 'string');
  }

  get mongoCollectionSorConfig(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_SORCONFIG', 'string');
  }

  get mongoCollectionAmesiConsumers(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_AMESICONSUMERS', 'string');
  }

  get mongoCollectionDpmBackup(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_DPMBACKUP', 'string');
  }

  get mongoCollectionBusinessUnits(): string {
    return this.getOrThrow<string>('MONGO_COLLECTION_BUSINESSUNITS', 'string');
  }

  get redisHost(): string | undefined {
    return this.get<string>('REDIS_HOST', 'string');
  }

  get redisPort(): number {
    return this.getOrThrow<number>('REDIS_PORT', 'number');
  }

  get cacheSecondsDefault(): number {
    return this.getOrThrow<number>('CACHE_SECONDS_DEFAULT', 'number');
  }

  get useAllowList(): boolean {
    return this.getOrThrow<boolean>('USE_ALLOWLIST', 'boolean');
  }

  get apolloDebug(): boolean {
    return this.getOrThrow<boolean>('APOLLO_DEBUG', 'boolean');
  }

  get apolloIntrospection(): boolean {
    return this.getOrThrow<boolean>('APOLLO_INTROSPECTION', 'boolean');
  }

  get apolloPlayground(): boolean {
    return this.getOrThrow<boolean>('APOLLO_PLAYGROUND', 'boolean');
  }

  get apolloTracing(): boolean {
    return this.getOrThrow<boolean>('APOLLO_TRACING', 'boolean');
  }

  get carUri(): URL {
    return this.getOrThrow<URL>('CAR_URI', 'URL');
  }

  get emailHost(): string {
    return this.getOrThrow<string>('EMAIL_HOST', 'string');
  }

  get emailPort(): number {
    return this.getOrThrow<number>('EMAIL_PORT', 'number');
  }

  get awsPostgresNonProd(): string | undefined {
    return this.get<string>('AWS_POSTGRES_NONPROD', 'string');
  }

  get awsPostgresProd(): string | undefined {
    return this.get<string>('AWS_POSTGRES_PROD', 'string');
  }

  get cluster(): string | undefined {
    return this.get<string>('AMESI_CONTEXT_CLUSTER', 'string');
  }

  get branch(): string | undefined {
    return this.get<string>('AMESI_CONTEXT_BRANCH', 'string');
  }

  get namespace(): string | undefined {
    return this.get<string>('AMESI_CONTEXT_NAMESPACE', 'string');
  }

  get ocpCluster(): string | undefined {
    return this.get<string>('OCP_CLUSTER', 'string');
  }

  get ocpUsername(): string | undefined {
    return this.get<string>('OCP_USERNAME', 'string');
  }

  get ocpPassword(): string | undefined {
    return this.get<string>('OCP_PASSWORD', 'string');
  }
}
