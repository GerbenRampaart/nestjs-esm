import * as Joi from 'joi';
import { URL } from 'url';
import * as env from './Environment';
import { AppLoggerService } from '../logger/app-logger.service';
import { pinoLevels } from '../logger/levels';

const uriValidator: Joi.CustomValidator<string> = (
  v: string,
  helpers: Joi.CustomHelpers<string>,
): string | Joi.ErrorReport => {
  try {
    new URL(v);
  } catch (error) {
    return helpers.error('custom.uri.invalid', { v });
  }

  return v;
};

export const SharedConfigSchemaKeys = {
  PORT: Joi.string().default('8080'),
  NODE_ENV: Joi.string()
    .valid(...Object.keys(env.Environment))
    .default(env.Environment[env.Environment.development]),
  LOG_LEVEL: Joi.string()
    .valid(...pinoLevels)
    .default('info'),
  DPM_HTTP_REQUEST_BASEURL: Joi.string().default(
    'http://intranet-ipc.esi.adp.com',
  ),
  DPM_HTTP_REQUEST_TIMEOUT: Joi.string().default('30000'),
  DPM_HTTP_MAX_REDIRECTS: Joi.string().default('30'),
  DPM_ID: Joi.string().optional(),
  DPM_USER: Joi.string().optional(),
  DPM_PASS: Joi.string().optional(),
  STATUS_MONITOR: Joi.string().default('false'),
  DPM_ID_SOR_ENDPOINTS: Joi.string().default('7012'),
  MONGO_USERNAME: Joi.string().optional(),
  MONGO_URI: Joi.string().optional(),
  MONGO_DATABASE: Joi.string().optional(),
  MONGO_PASSWORD: Joi.string().optional(),
  CACHE_SECONDS_DEFAULT: Joi.string().default(3600 * 1000), // default: 1 hour
  REDIS_HOST: Joi.string().default('amesi-redis-dev.yqlikx.ng.0001.euc1.cache.amazonaws.com'),
  REDIS_PORT: Joi.string().default('6379'),
  USE_ALLOWLIST: Joi.string().default('false'),
  APOLLO_DEBUG: Joi.string().default('false'),
  APOLLO_INTROSPECTION: Joi.string().default('false'),
  APOLLO_PLAYGROUND: Joi.string().default('false'),
  APOLLO_TRACING: Joi.string().default('false'),
  MONGO_COLLECTION_AUTHRESOURCES: Joi.string().default('authResources'),
  MONGO_COLLECTION_EVENTTYPES: Joi.string().default('eventTypes'),
  MONGO_COLLECTION_NOTIFICATIONS: Joi.string().default('notifications'),
  MONGO_COLLECTION_NOTIFICATIONSUBSCRIPTIONS: Joi.string().default(
    'notificationSubscriptions',
  ),
  MONGO_COLLECTION_SORCONFIG: Joi.string().default('sorConfig'),
  MONGO_COLLECTION_AMESICONSUMERS: Joi.string().default('amesiConsumers'),
  MONGO_COLLECTION_DPMBACKUP: Joi.string().default('dpmBackup'),
  MONGO_COLLECTION_BUSINESSUNITS: Joi.string().default('businessUnits'),
  GSREST_HTTP_REQUEST_TIMEOUT: Joi.string().default('30000'),
  GSREST_HTTP_MAX_REDIRECTS: Joi.string().default('30'),
  AMESI_ENVIRONMENT: Joi.string().optional(),
  UK_GSREST_ENDPOINT: Joi.string().default('http://11.129.44.248:8281').custom(uriValidator),
  IT_GSREST_ENDPOINT: Joi.string().default('http://itgsrestfront01int-dc1.ad.esi.adp.com:8290').custom(uriValidator),
  NL_GSREST_ENDPOINT: Joi.string().default('http://das.test.adp.nl:8080').custom(uriValidator),
  PASSPORT_GSREST_ENDPOINT: Joi.string().default('http://gsrest-xx.dev.esi.adp.com:8286').custom(uriValidator),
  LATAM_GSREST_ENDPOINT: Joi.string().default('http://10.203.38.222:8127').custom(uriValidator),
  FR_GSREST_ENDPOINT: Joi.string().default('http://gsrest.dev.esi.adp.com:8280/').custom(uriValidator),
  NEXO_ENDPOINT: Joi.string()
    .default(`http://nexo-internal-api-gateway.dev.emea.caas.oneadp.com/api`)
    .custom(uriValidator),
  NEXO_TOKEN: Joi.string()
    .default('bWFya2V0cGxhY2U6YldGeS9hMlY6MGNHeGhZNTQyVUsK'),
  NEXO_USERNAME: Joi.string().optional(),
  NEXO_PASSWORD: Joi.string().optional(),
  AMESI_HOST: Joi.string().default('marketplace-esi.emea.caas.oneadp.com'),
  BITBUCKET_BASEURL: Joi.string().default('https://bitbucket.es.ad.adp.com/rest'),
  BITBUCKET_USERNAME: Joi.string().optional(),
  BITBUCKET_PASSWORD: Joi.string().optional(),
  CAR_URI: Joi.string().default(
    'http://mkplproxy-dit.nj.adp.com',
  ).custom(uriValidator),
  EMAIL_HOST: Joi.string().default('smtp-dc4.ehc.adp.com'),
  EMAIL_PORT: Joi.string().default('25'),
  AWS_POSTGRES_NONPROD: Joi.string().optional(),
  AWS_POSTGRES_PROD: Joi.string().optional(),
  AMESI_CONTEXT_CLUSTER: Joi.string().optional(),
  AMESI_CONTEXT_BRANCH: Joi.string().optional(),
  AMESI_CONTEXT_NAMESPACE: Joi.string().optional(),
  OCP_CLUSTER: Joi.string().optional(),
  OCP_USERNAME: Joi.string().optional(),
  OCP_PASSWORD: Joi.string().optional(),
};

export const SharedConfigSchema = Joi.object(SharedConfigSchemaKeys);