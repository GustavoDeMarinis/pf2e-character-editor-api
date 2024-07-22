import { seedLocalCharacterClass } from "./seed-character-class";
import { seedLocalCharacters } from "./seed-characters";
import { seedLocalUsers } from "./seed-users";

export const seedLocal = async () => {
  await seedLocalUsers();
  await seedLocalCharacterClass();
  await seedLocalCharacters();
};
