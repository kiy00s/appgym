export interface DefaultExerciseDef {
  name: string;
  category: string;
  equipment: string;
}

export const DEFAULT_EXERCISES: DefaultExerciseDef[] = [
  // Klatka piersiowa
  { name: 'Wyciskanie sztangi na ławce poziomej', category: 'Klatka', equipment: 'Sztanga' },
  { name: 'Wyciskanie hantli na ławce skośnej dodatniej', category: 'Klatka', equipment: 'Hantle' },
  { name: 'Wyciskanie hantli na ławce poziomej', category: 'Klatka', equipment: 'Hantle' },
  { name: 'Wyciskanie sztangi na skosie dodatnim', category: 'Klatka', equipment: 'Sztanga' },
  { name: 'Dipsy na poręczach (pompki szwedzkie)', category: 'Klatka', equipment: 'Masa ciała' },
  { name: 'Rozpiętki z hantlami na ławce', category: 'Klatka', equipment: 'Hantle' },
  { name: 'Rozpiętki na maszynie (Butterfly)', category: 'Klatka', equipment: 'Maszyna' },
  { name: 'Krzyżowanie linek wyciągu w bramie', category: 'Klatka', equipment: 'Wyciąg' },
  { name: 'Wyciskanie na maszynie siedząc (Chest Press)', category: 'Klatka', equipment: 'Maszyna' },

  // Plecy
  { name: 'Martwy ciąg klasyczny', category: 'Plecy', equipment: 'Sztanga' },
  { name: 'Podciąganie na drążku nachwytem', category: 'Plecy', equipment: 'Masa ciała' },
  { name: 'Podciąganie na drążku podchwytem', category: 'Plecy', equipment: 'Masa ciała' },
  { name: 'Wiosłowanie sztangą w opadzie tułowia', category: 'Plecy', equipment: 'Sztanga' },
  { name: 'Wiosłowanie hantlem w oparciu o ławkę', category: 'Plecy', equipment: 'Hantle' },
  { name: 'Ściąganie drążka wyciągu górnego do klatki', category: 'Plecy', equipment: 'Wyciąg' },
  { name: 'Przyciąganie uchwytu wyciągu poziomego', category: 'Plecy', equipment: 'Wyciąg' },
  { name: 'Wiosłowanie na maszynie T-Bar', category: 'Plecy', equipment: 'Maszyna' },
  { name: 'Szrugsy ze sztangą / hantlami', category: 'Plecy', equipment: 'Sztanga' },
  { name: 'Prostowanie grzbietu na ławce rzymskiej', category: 'Plecy', equipment: 'Masa ciała' },

  // Nogi
  { name: 'Przysiad ze sztangą na plecach (Back Squat)', category: 'Nogi', equipment: 'Sztanga' },
  { name: 'Przysiad ze sztangą z przodu (Front Squat)', category: 'Nogi', equipment: 'Sztanga' },
  { name: 'Wyciskanie na suwnicy (Leg Press)', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Rumuński martwy ciąg (RDL)', category: 'Nogi', equipment: 'Sztanga' },
  { name: 'Rumuński martwy ciąg z hantlami', category: 'Nogi', equipment: 'Hantle' },
  { name: 'Hack przysiady na maszynie', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Wykroki chodzone z hantlami', category: 'Nogi', equipment: 'Hantle' },
  { name: 'Wyprosty nóg na maszynie siedząc', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Uginanie nóg na maszynie leżąc', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Wspięcia na palce stojąc na maszynie', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Wspięcia na palce siedząc', category: 'Nogi', equipment: 'Maszyna' },
  { name: 'Hip Thrust (Wypychanie bioder ze sztangą)', category: 'Nogi', equipment: 'Sztanga' },

  // Barki
  { name: 'Wyciskanie żołnierskie (OHP)', category: 'Barki', equipment: 'Sztanga' },
  { name: 'Wyciskanie hantli nad głowę siedząc', category: 'Barki', equipment: 'Hantle' },
  { name: 'Wznosy hantli bokiem stojąc', category: 'Barki', equipment: 'Hantle' },
  { name: 'Wznosy hantli w opadzie tułowia', category: 'Barki', equipment: 'Hantle' },
  { name: 'Face Pulls na wyciągu', category: 'Barki', equipment: 'Wyciąg' },
  { name: 'Odwrotne rozpiętki na maszynie (Rear Delt)', category: 'Barki', equipment: 'Maszyna' },
  { name: 'Wznosy ramion bokiem na wyciągu', category: 'Barki', equipment: 'Wyciąg' },

  // Ramiona (Biceps i Triceps)
  { name: 'Uginanie przedramion ze sztangą prostą/łamaną', category: 'Ramiona', equipment: 'Sztanga' },
  { name: 'Uginanie przedramion z hantlami z supinacją', category: 'Ramiona', equipment: 'Hantle' },
  { name: 'Uginanie młotkowe z hantlami', category: 'Ramiona', equipment: 'Hantle' },
  { name: 'Uginanie przedramion na modlitewniku', category: 'Ramiona', equipment: 'Sztanga' },
  { name: 'Prostowanie ramion na wyciągu (Triceps Pushdown)', category: 'Ramiona', equipment: 'Wyciąg' },
  { name: 'Wyciskanie francuskie ze sztangą leżąc', category: 'Ramiona', equipment: 'Sztanga' },
  { name: 'Wyciskanie wąskim chwytem na klatkę', category: 'Ramiona', equipment: 'Sztanga' },
  { name: 'Wyprosty ramion z linką wyciągu zza głowy', category: 'Ramiona', equipment: 'Wyciąg' },
  { name: 'Pompki na poręczach z naciskiem na triceps', category: 'Ramiona', equipment: 'Masa ciała' },

  // Brzuch
  { name: 'Unoszenie nóg w zwisie na drążku', category: 'Brzuch', equipment: 'Masa ciała' },
  { name: 'Allahy (spięcia brzucha na wyciągu klęcząc)', category: 'Brzuch', equipment: 'Wyciąg' },
  { name: 'Deska (Plank)', category: 'Brzuch', equipment: 'Masa ciała' },
  { name: 'Spięcia brzucha na maszynie (Ab Crunch)', category: 'Brzuch', equipment: 'Maszyna' },
  { name: 'Kółko gimnastyczne (Ab Wheel Rollout)', category: 'Brzuch', equipment: 'Masa ciała' },
];
