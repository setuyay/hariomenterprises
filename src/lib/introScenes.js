// Cinematic intro scene configuration.
//
// Drop your 6 Mandla photos into  public/intro/  using the file names below
// (any are optional — a premium gradient scene shows as a graceful fallback).
//
//   public/intro/01-mandla.jpg
//   public/intro/02-fort.jpg
//   public/intro/03-sahastradhara.jpg
//   public/intro/04-kanha.jpg
//   public/intro/05-ghat.jpg
//   public/intro/06-heritage.jpg
//
// `anim` ∈ kenburns-in · kenburns-out · pan-left · pan-right · parallax · fade

export const INTRO_SCENES = [
  {
    src: '/intro/01-mandla.jpg',
    title: 'Welcome to Mandla',
    subtitle: 'The Heart of Nature & Heritage',
    anim: 'kenburns-in',
    duration: 2000,
    bg: 'radial-gradient(120% 120% at 30% 20%, #2f4a32 0%, #1c2f20 55%, #0e1712 100%)',
  },
  {
    src: '/intro/02-fort.jpg',
    title: 'Mandla Fort',
    subtitle: 'Where the Narmada guards history',
    anim: 'pan-left',
    duration: 1500,
    bg: 'radial-gradient(120% 120% at 70% 30%, #5a4327 0%, #3a2c1a 55%, #1a130c 100%)',
  },
  {
    src: '/intro/03-sahastradhara.jpg',
    title: 'Sahastradhara',
    subtitle: 'A thousand streams of the sacred Narmada',
    anim: 'kenburns-out',
    duration: 1500,
    bg: 'radial-gradient(120% 120% at 40% 40%, #1f5e63 0%, #143f44 55%, #0a2124 100%)',
  },
  {
    src: '/intro/04-kanha.jpg',
    title: 'Kanha National Park',
    subtitle: 'Land of the tiger, soul of the jungle',
    anim: 'parallax',
    duration: 1500,
    bg: 'radial-gradient(120% 120% at 50% 30%, #38531f 0%, #233714 55%, #111c0a 100%)',
  },
  {
    src: '/intro/05-ghat.jpg',
    title: 'Maa Narmada Ghat',
    subtitle: 'Faith and stillness on the riverbank',
    anim: 'pan-right',
    duration: 1500,
    bg: 'radial-gradient(120% 120% at 60% 70%, #7a5526 0%, #4d3717 55%, #221809 100%)',
  },
  {
    src: '/intro/06-heritage.jpg',
    title: 'Rani Durgavati Smarak',
    subtitle: 'The pride of Gondwana',
    anim: 'kenburns-in',
    duration: 1500,
    bg: 'radial-gradient(120% 120% at 40% 30%, #3a2c55 0%, #261c3a 55%, #120d1c 100%)',
  },
];

export const INTRO_BRAND = {
  name: 'Hariom Enterprises',
  tagline: 'Har Deewar Se Jude Jazbaat Aur Rang',
  duration: 2200,
};

export const INTRO_STORAGE_KEY = 'introSeen';
