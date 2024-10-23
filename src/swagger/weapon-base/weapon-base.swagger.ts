import {
  weaponBasePostGetResponseSchema,
  weaponBasePostRequestBodySchema,
  weaponBaseRequestParamsSchema,
  weaponBaseSearchRequestQuerySchema,
  weaponBaseSearchResponseSchema,
} from "../../api/weapon-base/weapon-base-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchWeaponBase = {
  tags: ["Weapon Base"],
  description:
    "## Search Weapon Base\n" +
    "**Postman:** [GET Search Weapon Base Class](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-33effc6c-17ac-4f61-8eb1-af846a63c660)",
  operationId: "searchWeaponBase",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: weaponBaseSearchRequestQuerySchema.properties.pageOffset,
      description:
        weaponBaseSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: weaponBaseSearchRequestQuerySchema.properties.pageLimit,
      description:
        weaponBaseSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "category",
      schema: weaponBaseSearchRequestQuerySchema.properties.category,
      description:
        weaponBaseSearchRequestQuerySchema.properties.category.description,
    },
    {
      in: "query",
      name: "damageTypes",
      schema: weaponBaseSearchRequestQuerySchema.properties.damageTypes,
      description:
        weaponBaseSearchRequestQuerySchema.properties.damageTypes.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: weaponBaseSearchRequestQuerySchema.properties.isActive,
      description:
        weaponBaseSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: weaponBaseSearchRequestQuerySchema.properties.sort,
      description:
        weaponBaseSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Weapon Base search",
      content: {
        "application/json": {
          schema: weaponBaseSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const getWeaponBase = {
  tags: ["Weapon Base"],
  description:
    "## Get a Weapon Base\n" +
    "**Postman:** [GET Get a Weapon Base record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-e22f2f5d-9719-40d8-98c8-e0a3058385f7)",
  operationId: "getWeaponBase",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Weapon Base retrieval",
      content: {
        "application/json": {
          schema: weaponBasePostGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertWeaponBase = {
  tags: ["Weapon Base"],
  description:
    "## Create a Weapon Base record\n" +
    "**Postman:** [POST Create a Weapon Base record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-474a9614-c2f7-4085-8613-cf6fcaf90586)",
  operationId: "insertWeaponBase",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: weaponBasePostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Weapon Base creation",
      content: {
        "application/json": {
          schema: weaponBasePostGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateWeaponBase = {
  tags: ["Weapon Base"],
  description:
    "## Update a Weapon Base record\n" +
    "**Postman:** [PATCH Update a Weapon Base record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-ac57516d-37d3-4f12-892f-d01296d09e03)",
  operationId: "updateWeaponBase",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: weaponBaseRequestParamsSchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Weapon Base update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteWeaponBase = {
  tags: ["Weapon Base"],
  description:
    "## Delete a Weapon Base record\n" +
    "**Postman:** [DELETE Delete a Weapon Base record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-ac1df5eb-731d-4ef1-94df-76d1dce43556)",
  operationId: "deleteWeaponBase",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Weapon Base delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "weaponBaseId",
      required: true,
      schema: weaponBaseRequestParamsSchema.properties.weaponBaseId,
      style: "simple",
    },
  ],
};

export const weaponBasePaths = {
  "/weaponBase": {
    post: insertWeaponBase,
    get: searchWeaponBase,
  },
  "/weaponBase/{weaponBaseId}": {
    get: getWeaponBase,
    patch: updateWeaponBase,
    delete: deleteWeaponBase,
    ...parameterId,
  },
};
