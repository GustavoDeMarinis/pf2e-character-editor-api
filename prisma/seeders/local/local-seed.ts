import { seedLocalAncestries } from "./seed-ancestry";
import { seedLocalArmorBase } from "./seed-armor-base";
import { seedLocalArmorGroup } from "./seed-armor-group";
import { seedLocalCharacterClass } from "./seed-character-class";
import { seedLocalCharacters } from "./seed-characters";
import { seedLocalLanguages } from "./seed-languages";
import { seedLocalTraits } from "./seed-traits";
import { seedLocalUsers } from "./seed-users";
import { seedLocalWeaponBase } from "./seed-weapon-base";
import { seedLocalWeaponCriticalSpecialization } from "./seed-weapon-critical-specialization";
import { seedLocalWeaponGroup } from "./seed-weapon-group";

export const seedLocal = async () => {
  await seedLocalUsers();
  await seedLocalTraits();
  await seedLocalLanguages();
  await seedLocalAncestries();
  await seedLocalCharacterClass();
  await seedLocalCharacters();
  await seedLocalWeaponCriticalSpecialization();
  await seedLocalWeaponGroup();
  await seedLocalWeaponBase();
  await seedLocalArmorGroup();
  await seedLocalArmorBase();
};
