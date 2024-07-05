import Ajv, { Schema } from "ajv";
import { AjvValidationsError } from "./ajv-validator-error";
import addFormats from "ajv-formats";
import cuid from "cuid";

const ajv = new Ajv({
  coerceTypes: "array",
  allErrors: true,
  allowUnionTypes: true,
});
addFormats(ajv);

export enum ValidatorData {
  body = "body",
  params = "params",
  query = "query",
}

export function validateJSONSchemaObject<ObjectType>(
  schema: Schema,
  object: unknown
): ObjectType {
  const validator = ajv.compile<ObjectType>(schema);
  if (validator(object)) {
    return object;
  } else {
    throw new AjvValidationsError(validator.errors);
  }
}

const checkIdIsCuid = (_schema: unknown, data: string) => {
  return cuid.isCuid(data);
};

ajv.addKeyword({
  keyword: "checkIdIsCuid",
  type: "string",
  validate: checkIdIsCuid,
});
