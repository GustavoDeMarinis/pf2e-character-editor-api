import { Request, Response } from "express";
import { searchCharacters } from "./character";
import { StatusCodes } from "http-status-codes";

export async function handleSearchCharacter(req: Request, res: Response) {
  console.log("PEPE");
  const result = await searchCharacters();

  return res.status(StatusCodes.OK).json(result);
}
