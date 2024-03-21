import { ConfigService } from "@nestjs/config";
import { SharedConfigSchema, SharedConfigSchemaKeys } from "./shared-config.schema";
import Joi from "joi";

// Can't make these two types merge so I just keep them here for easy maintenance.
// (not many will be added though)
// Maybe someone in the future knowns enough typescript kung-fu to merge these.
export type SupportedTypes = string | boolean | number | Date | URL;
export type SupportedTypesString = 'string' | 'boolean' | 'number' | 'Date' | 'URL';

export class SharedConfigItem {
  constructor(
    private readonly cfg: ConfigService,
    public readonly env: keyof typeof SharedConfigSchemaKeys
  ) {
    this.raw = this.cfg.get(env);
    this.rule = SharedConfigSchema.extract(env).describe();
    this.err = (target: string) => `process.env.${this.env} with value '${String(this.raw)}' could not be converted to type '${target}'.`;
  }

  public raw: string | undefined;
  public rule: Joi.Description;
  private err: (target: string) => string;

  public get has(): boolean {
    return (this.raw !== undefined);
  }

  // Tried to solve the below functions with zod but ad-hoc conversion is just more practical.
  public get asString(): string {
    if (!this.raw) throw new Error(this.err('string'));
    return this.raw;
  }

  public get asBoolean(): boolean {
    if (!this.raw) throw new Error(this.err('boolean'));

    const val = this.raw.trim().toLowerCase();

    if (val === 'true') return true;
    if (val === 'false') return false;

    throw new Error(this.err('boolean'));
  }

  public get asNumber(): number {
    if (!this.raw) throw new Error(this.err('number'));
    const val = parseInt(this.raw);

    if (isNaN(val)) {
      throw new Error(this.err('number'));
    }

    return val;
  }

  public get asDate(): Date {
    if (!this.raw) throw new Error(this.err('Date'));

    const val = new Date(this.raw);
    const valid = val instanceof Date && !isNaN(val.getTime());

    if (!valid) {
      throw new Error(this.err('Date'));
    }

    return val;
  }

  public get asUrl(): URL {
    let u: URL | undefined = undefined;
    if (!this.raw) throw new Error(this.err('URL'));
    return new URL(this.raw); // will already throw if not valid url.
  }

  public asType<T extends SupportedTypes>(
    type: SupportedTypesString
  ): T {
    switch (type) {
      case 'string':
        return this.asString as T;
      case 'boolean':
        return this.asBoolean as T;
      case 'number':
        return this.asNumber as T;
      case 'Date':
        return this.asDate as T;
      case 'URL':
        return this.asUrl as T;
      default:
        throw new Error(this.err(type));
    }
  }
}