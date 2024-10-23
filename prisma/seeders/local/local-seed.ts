import { seedLocalCharacterClass } from "./seed-character-class";
import { seedLocalCharacters } from "./seed-characters";
import { seedLocalTraits } from "./seed-traits";
import { seedLocalUsers } from "./seed-users";
import { seedLocalWeaponBase } from "./seed-weapon-base";
import { seedLocalWeaponCriticalSpecialization } from "./seed-weapon-critical-specialization";
import { seedLocalWeaponGroup } from "./seed-weapon-group";

export const seedLocal = async () => {
  await seedLocalUsers();
  await seedLocalCharacterClass();
  await seedLocalCharacters();
  await seedLocalWeaponCriticalSpecialization();
  await seedLocalWeaponGroup();
  await seedLocalTraits();
  await seedLocalWeaponBase();
};
