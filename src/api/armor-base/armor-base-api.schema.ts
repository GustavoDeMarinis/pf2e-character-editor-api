import { ArmorCategory, ItemRarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonArmorBaseProperties = {
  name: {
    description: "Armor Base Name",
    type: "string",
  },
  description: {
    description: "Armor Base Description",
    type: "string",
  },
  rarity: {
    description: "Item Rarity",
    type: "string",
    enum: Object.values(ItemRarity),
  },
  category: {
    description: "Armor Base Category",
    type: "string",
    enum: Object.values(ArmorCategory),
  },
  armorClass: {
    description: "Amount Of Armor Class Bonus",
    type: "number",
  },
  dexCap: {
    description:
      "Most AC Dexterity Can Grant To a Character While Using This Armor",
    type: "number",
  },
  checkPenalty: {
    description:
      "Amount Of Penalty An Armor Gives To Strength & Skills If The Character Does Not Have The Required Strength",
    type: "number",
  },
  speedPenalty: {
    description:
      "Amount Of Penalty An Armor Gives To A Character Movement Speed",
    type: "number",
  },
  bulk: {
    description: "Amount of Bulks The Armor Weights",
    type: "string",
  },
  strengthReq: {
    description: "Strength Required To Use Armor Without Penalties",
    type: "number",
  },
  price: {
    description: "Armor Price",
    type: "number",
  },
} as const;

export const armorBaseSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            description: "Armor Base Id",
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
          deletedAt: {
            type: "string",
            format: "date-time-nullable",
          },
          armorGroup: {
            type: "object",
            properties: {
              name: {
                description: "Armor Group Name",
                type: "string",
              },
              description: {
                description: "Armor Group Description",
                type: "string",
              },
            },
            additionalProperties: false,
            required: ["name", "description"],
          },
          traits: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  description: "Armor Trait Name",
                  type: "string",
                },
                description: {
                  description: "Armor Trait Description",
                  type: "string",
                },
              },
              additionalProperties: false,
              required: ["name", "description"],
            },
          },
          ...commonArmorBaseProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "rarity",
          "category",
          "armorClass",
          "armorGroup",
          "traits",
          "dexCap",
          "checkPenalty",
          "speedPenalty",
          "bulk",
          "strengthReq",
          "price",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const armorBaseSearchRequestQuerySchema = {
  type: "object",
  properties: {
    category: {
      description: "Armor Base Category",
      type: "string",
      enum: Object.values(ArmorCategory),
    },
    //TODO possible traits array search filter
    isActive: {
      type: "boolean",
      description: "Is The Armor Base Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const armorBaseRequestParamsSchema = {
  type: "object",
  properties: {
    armorBaseId: {
      description: "Armor Base Id",
      type: "string",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: ["armorBaseId"],
} as const;

export const armorBasePostGetResponseSchema = {
  type: "object",
  properties: {
    ...commonArmorBaseProperties,
    armorGroup: {
      type: "object",
      properties: {
        name: {
          description: "Armor Group Name",
          type: "string",
        },
        description: {
          description: "Armor Group Description",
          type: "string",
        },
      },
      additionalProperties: false,
      required: ["name", "description"],
    },
    traits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            description: "Armor Trait Name",
            type: "string",
          },
          description: {
            description: "Armor Trait Description",
            type: "string",
          },
        },
        additionalProperties: false,
        required: ["name", "description"],
      },
    },
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "rarity",
    "category",
    "armorClass",
    "armorGroup",
    "traits",
    "dexCap",
    "checkPenalty",
    "speedPenalty",
    "bulk",
    "strengthReq",
    "price",
  ],
  additionalProperties: false,
} as const;

export const armorBasePostRequestBodySchema = {
  type: "object",
  properties: {
    ...commonArmorBaseProperties,
    armorGroupId: {
      description: "Armor Base Group Id",
      type: "string",
      checkIdIsCuid: true,
    },
    traitIds: {
      description: "Armor Base Trait Ids",
      type: "array",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
  },
  additionalProperties: false,
  required: [
    "name",
    "description",
    "rarity",
    "category",
    "armorClass",
    "armorGroupId",
    "traitIds",
    "dexCap",
    "checkPenalty",
    "speedPenalty",
    "bulk",
    "strengthReq",
    "price",
  ],
} as const;

export const armorBasePatchRequestBodySchema = {
  type: "object",
  properties: {
    ...commonArmorBaseProperties,
    armorGroupId: {
      description: "Armor Base Group Id",
      type: "string",
      checkIdIsCuid: true,
    },
    traitIds: {
      description: "Armor Base Trait Ids",
      type: "array",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rarity"] },
    { required: ["category"] },
    { required: ["armorClass"] },
    { required: ["armorGroup"] },
    { required: ["traits"] },
    { required: ["dexCap"] },
    { required: ["checkPenalty"] },
    { required: ["speedPenalty"] },
    { required: ["bulk"] },
    { required: ["strengthReq"] },
    { required: ["price"] },
    { required: ["armorGroupId"] },
    { required: ["traitIds"] },
  ],
} as const;
