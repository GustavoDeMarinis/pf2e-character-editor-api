import { ErrorObject } from "ajv";
export class AjvValidationsError extends Error {
  errors:
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined;
  constructor(errors: ErrorObject[] | undefined | null) {
    let message = "";
    let instancePath: any[] = [];
    if (errors) {
      errors.forEach((element, index) => {
        if (element.instancePath !== "") {
          instancePath = element.instancePath.split("/");
        }

        message =
          message +
          (index === 0 ? "" : " ") +
          instancePath[instancePath.length - 1] +
          " " +
          element.message +
          ".";
      });
    }

    super();
    this.errors = errors;
    this.message = message;
  }
}
