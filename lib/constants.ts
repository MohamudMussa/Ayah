export const TOTAL_AYAHS = 6236

export const API_BASE = 'https://api.alquran.cloud/v1'

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
  { id: 'ar.abdulsamad', name: 'Abdul Samad' },
  { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy' },
  { id: 'ar.maaboralem', name: 'Maher Al Muaiqly' },
] as const

export const TRANSLATIONS = [
  { id: 'en.sahih', name: 'Sahih International', language: 'English' },
  { id: 'en.yusufali', name: 'Yusuf Ali', language: 'English' },
  { id: 'en.pickthall', name: 'Pickthall', language: 'English' },
  { id: 'en.asad', name: 'Muhammad Asad', language: 'English' },
  { id: 'fr.hamidullah', name: 'Hamidullah', language: 'French' },
  { id: 'ur.jalandhry', name: 'Jalandhry', language: 'Urdu' },
  { id: 'tr.diyanet', name: 'Diyanet Isleri', language: 'Turkish' },
  { id: 'id.indonesian', name: 'Indonesian Ministry', language: 'Indonesian' },
  { id: 'bn.bengali', name: 'Muhiuddin Khan', language: 'Bengali' },
  { id: 'es.cortes', name: 'Julio Cortes', language: 'Spanish' },
  { id: 'de.aburida', name: 'Abu Rida', language: 'German' },
  { id: 'so.abduh', name: 'Mahmud Muhammad Abduh', language: 'Somali' },
] as const

export const TAFSIR_EDITIONS = [
  { id: 'en.maududi', name: 'Maududi (English)' },
] as const

export const BACKGROUNDS = [
  // Original
  'bb.jpg', 'dark.jpg', 'image00.jpg', 'image1.jpg', 'image2.jpg',
  'image3.jpg', 'image4.jpg', 'image5.jpg', 'image55.jpg', 'image6.jpg',
  'image66.jpg', 'image77.jpg', 'image8.jpg', 'image88.jpg', 'image9.jpg',
  'image99.jpg', 'pinkUs.jpg', 'sunset.jpg', 'palmm.jpg', 'IMG_3151.jpg',
  // Skies
  'sky_golden.jpg', 'sky_purple.jpg', 'sky_blue.jpg', 'sky_orange.jpg',
  'sky_pink.jpg', 'sky_dramatic.jpg', 'sky_aurora.jpg', 'sky_twilight.jpg',
  'sky_fire.jpg', 'sky_pastel.jpg', 'sky_milkyway.jpg', 'sky_clouds_pink.jpg',
  // Mountains
  'mountain_misty.jpg', 'mountain_snow.jpg', 'mountain_lake.jpg',
  'mountain_sunset.jpg', 'mountain_fog.jpg', 'mountain_alpine.jpg',
  'mountain_ridge.jpg', 'mountain_dawn.jpg',
  // Water
  'ocean_calm.jpg', 'ocean_sunset.jpg', 'ocean_waves.jpg', 'ocean_aerial.jpg',
  'lake_reflection.jpg', 'lake_mountain.jpg', 'waterfall.jpg',
  'turquoise_water.jpg', 'frozen_lake.jpg', 'sea_rocks.jpg', 'coral_sea.jpg',
  'river_canyon.jpg',
  // Forests & Nature
  'forest_misty.jpg', 'forest_light.jpg', 'forest_autumn.jpg',
  'forest_path.jpg', 'forest_sunlight.jpg', 'field_golden.jpg',
  'lavender.jpg', 'misty_pines.jpg', 'autumn_trees.jpg', 'bamboo.jpg',
  'cherry_blossom.jpg', 'meadow_green.jpg',
  // Sunsets
  'sunset_clouds.jpg', 'sunset_ocean2.jpg', 'beach_sunset.jpg',
  'savanna_sunset.jpg', 'red_sky.jpg', 'rainbow_sky.jpg',
  // Night
  'stars_galaxy.jpg', 'stars_mountain.jpg', 'moon_clouds.jpg',
  'northern_lights.jpg',
  // Landscapes
  'desert_dunes.jpg', 'tropical_beach.jpg', 'canyon.jpg', 'salt_flats.jpg',
  'fjord.jpg', 'dolomites.jpg', 'sahara.jpg', 'iceland_moss.jpg',
  'rice_terraces.jpg', 'glacier.jpg', 'cliff_ocean.jpg', 'volcano.jpg',
  'snow_trees.jpg', 'storm_sky.jpg', 'rolling_hills.jpg',
]

export type ReciterId = typeof RECITERS[number]['id']
export type TranslationId = typeof TRANSLATIONS[number]['id']
