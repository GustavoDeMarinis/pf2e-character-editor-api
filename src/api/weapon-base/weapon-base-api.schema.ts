import { WeaponCategory, WeaponDamageType, WeaponHands } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonWeaponBaseProperties = {
  id: {
    description: "Weapon Base Id",
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
  name: {
    description: "Weapon Base Name",
    type: "string",
  },
  description: {
    description: "Weapon Base Description",
    type: "string",
  },
  category: {
    description: "Weapon Base Category",
    type: "string",
    enum: Object.values(WeaponCategory),
  },
  damageTypes: {
    description: "Weapon Damage Types",
    type: "array",
    items: {
      type: "string",
      enum: Object.values(WeaponDamageType),
    },
  },
  diceAmount: {
    description: "Number Of Damage Dice",
    type: "integer",
  },
  diceSize: {
    description: "Size of Damage Dice",
    type: "integer",
  },
  criticalDiceAmount: {
    description: "Number Of Damage Dice On A Critical Hit",
    type: "integer",
    nullable: true,
  },
  criticalDiceSize: {
    description: "Size of Damage Dice On A Critical Hit",
    type: "integer",
    nullable: true,
  },
  weaponGroup: {
    type: "object",
    properties: {
      name: {
        description: "Weapon Group Name",
        type: "string",
      },
      description: {
        description: "Weapon Group Description",
        type: "string",
      },
      criticalSpecialization: {
        type: "object",
        properties: {
          name: {
            description: "Weapon Critical Specialization Name",
            type: "string",
          },
          description: {
            description: "Weapon Critical Specialization Description",
            type: "string",
          },
        },
        additionalProperties: false,
        required: ["name", "description"],
      },
    },
    additionalProperties: false,
    required: ["name", "description", "criticalSpecialization"],
  },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          description: "Weapon Trait Name",
          type: "string",
        },
        description: {
          description: "Weapon Trait Description",
          type: "string",
        },
      },
      additionalProperties: false,
      required: ["name", "description"],
    },
  },
  hands: {
    description: "Weapon Base Hands Options",
    type: "array",
    items: {
      type: "string",
      enum: Object.values(WeaponHands),
    },
  },
  range: {
    description: "Weapon Range",
    type: "integer",
  },
  bulk: {
    description: "Weapon Amount of Bulks To Carry",
    type: "string",
  },
} as const;

export const weaponBaseSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...commonWeaponBaseProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "category",
          "damageTypes",
          "diceAmount",
          "diceSize",
          "criticalDiceAmount",
          "criticalDiceSize",
          "weaponGroup",
          "traits",
          "hands",
          "range",
          "bulk",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const weaponBaseSearchRequestQuerySchema = {
  type: "object",
  properties: {
    category: {
      description: "Weapon Base Category",
      type: "string",
      enum: Object.values(WeaponCategory),
    },
    damageTypes: {
      description: "Weapon Damage Types",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(WeaponDamageType),
      },
    },
    //TODO possible traits array search filter
    isActive: {
      type: "boolean",
      description: "Is The Weapon Base Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const weaponBaseRequestParamsSchema = {
  type: "object",
  properties: {
    weaponBaseId: {
      description: "Weapon Base Id",
      type: "string",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: ["weaponBaseId"],
} as const;

export const weaponBasePostGetResponseSchema = {
  type: "object",
  properties: {
    ...commonWeaponBaseProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "category",
    "damageTypes",
    "diceAmount",
    "diceSize",
    "criticalDiceAmount",
    "criticalDiceSize",
    "weaponGroup",
    "traits",
    "hands",
    "range",
    "bulk",
  ],
  additionalProperties: false,
} as const;

export const weaponBasePostRequestBodySchema = {
  type: "object",
  properties: {
    name: {
      description: "Weapon Base Name",
      type: "string",
    },
    description: {
      description: "Weapon Base Description",
      type: "string",
      nullable: true,
    },
    category: {
      description: "Weapon Base Category",
      type: "string",
      enum: Object.values(WeaponCategory),
    },
    damageTypes: {
      description: "Weapon Base Damage Types",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(WeaponDamageType),
      },
    },
    diceAmount: {
      description: "Number Of Damage Dice",
      type: "integer",
    },
    diceSize: {
      description: "Size of Damage Dice",
      type: "integer",
    },
    criticalDiceAmount: {
      description: "Number Of Damage Dice On A Critical Hit",
      type: "integer",
      nullable: true,
    },
    criticalDiceSize: {
      description: "Size of Damage Dice On A Critical Hit",
      type: "integer",
      nullable: true,
    },
    weaponGroupId: {
      description: "Weapon Base Group Id",
      type: "string",
      checkIdIsCuid: true,
    },
    traitIds: {
      description: "Weapon Base Trait Ids",
      type: "array",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
    hands: {
      description: "Weapon Base Hands Options",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(WeaponHands),
      },
    },
    range: {
      description: "Weapon Range",
      type: "integer",
      nullable: true,
    },
    bulk: {
      description: "Weapon Amount of Bulks To Carry",
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
  required: [
    "name",
    "description",
    "category",
    "damageTypes",
    "diceAmount",
    "diceSize",
    "criticalDiceAmount",
    "criticalDiceSize",
    "weaponGroupId",
    "traitIds",
    "hands",
    "range",
    "bulk",
  ],
} as const;

export const weaponBasePatchRequestBodySchema = {
  type: "object",
  properties: {
    name: {
      description: "Weapon Base Name",
      type: "string",
    },
    description: {
      description: "Weapon Base Description",
      type: "string",
    },
    category: {
      description: "Weapon Base Category",
      type: "string",
      enum: Object.values(WeaponCategory),
    },
    damageTypes: {
      description: "Weapon Base Damage Types",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(WeaponDamageType),
      },
    },
    diceAmount: {
      description: "Number Of Damage Dice",
      type: "integer",
    },
    diceSize: {
      description: "Size of Damage Dice",
      type: "integer",
    },
    criticalDiceAmount: {
      description: "Number Of Damage Dice On A Critical Hit",
      type: "integer",
      nullable: true,
    },
    criticalDiceSize: {
      description: "Size of Damage Dice On A Critical Hit",
      type: "integer",
      nullable: true,
    },
    weaponGroupId: {
      description: "Weapon Base Group Id",
      type: "string",
      checkIdIsCuid: true,
    },
    traitIds: {
      description: "Weapon Base Trait Ids",
      type: "array",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
    hands: {
      description: "Weapon Base Hands Options",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(WeaponHands),
      },
    },
    range: {
      description: "Weapon Range",
      type: "integer",
      nullable: true,
    },
    bulk: {
      description: "Weapon Amount of Bulks To Carry",
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["category"] },
    { required: ["damageTypes"] },
    { required: ["diceAmount"] },
    { required: ["diceSize"] },
    { required: ["criticalDiceAmount"] },
    { required: ["criticalDiceSize"] },
    { required: ["weaponGroupId"] },
    { required: ["traitIds"] },
    { required: ["hands"] },
    { required: ["range"] },
    { required: ["bulk"] },
  ],
} as const;
