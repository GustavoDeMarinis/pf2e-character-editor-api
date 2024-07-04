import { Request, Response } from "express";
import {
  deleteCharacter,
  getCharacter,
  insertCharacter,
  searchCharacters,
  updateCharacter,
} from "./character";
import { StatusCodes } from "http-status-codes";

export const handleSearchCharacter = async (req: Request, res: Response) => {
  const result = await searchCharacters();
  return res.status(StatusCodes.OK).json(result);
};

export const handleGetCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const result = await getCharacter({ id: characterId });

  return res.status(StatusCodes.OK).json(result);
};

export const handlePostCharacter = async (req: Request, res: Response) => {
  const body = req.body;
  const result = await insertCharacter(body);

  return res.status(StatusCodes.OK).json(result);
};

export const handlePatchCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const body = req.body;
  const result = await updateCharacter({ id: characterId }, body);
  return res.status(StatusCodes.OK).json(result);
};

export const handleDeleteCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const result = await deleteCharacter({ id: characterId });

  return res.status(StatusCodes.OK).json(result);
};
