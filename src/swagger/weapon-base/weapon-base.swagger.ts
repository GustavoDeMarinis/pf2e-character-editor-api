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
    "**Postman:** [GET Search Weapon Base Class](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-eb8c6626-e34d-4d20-92f8-a45e963fa0e6)",
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
    "**Postman:** [GET Get a Weapon Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-eb322668-7bd8-4352-b727-79a2ccd9ea3a)",
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
    "**Postman:** [POST Create a Weapon Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-ae48adcb-f012-4bb9-83a8-d125bd7aae5a)",
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
    "**Postman:** [PATCH Update a Weapon Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-83a75179-4633-400b-b1f2-15d5f001a1ff)",
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
    "**Postman:** [DELETE Delete a Weapon Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-20f07cf9-c79d-4b9b-b1a2-e77a565adae2)",
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
  "/weapon-base": {
    post: insertWeaponBase,
    get: searchWeaponBase,
  },
  "/weapon-base/{weaponBaseId}": {
    get: getWeaponBase,
    patch: updateWeaponBase,
    delete: deleteWeaponBase,
    ...parameterId,
  },
};
