Cinematic Intro images — Hariom Enterprises
===========================================

Drop your 6 Mandla photos into THIS folder using exactly these file names:

  01-mandla.jpg          — Scene 1 · "Welcome to Mandla"
  02-fort.jpg            — Scene 2 · "Mandla Fort"
  03-sahastradhara.jpg   — Scene 3 · "Sahastradhara"
  04-kanha.jpg           — Scene 4 · "Kanha National Park"
  05-ghat.jpg            — Scene 5 · "Maa Narmada Ghat"
  06-heritage.jpg        — Scene 6 · "Rani Durgavati Smarak"

Tips
----
- Landscape orientation, ideally 1920×1080 or larger.
- JPG or WEBP. If WEBP, change the extension in src/lib/introScenes.js.
- Until a photo is added, that scene shows a premium gradient with the
  caption — so the intro never looks broken.
- Titles, subtitles, order, animation and timing are all editable in
  src/lib/introScenes.js.

Reset the intro while testing (it only shows once per browser):
  In DevTools console run:  localStorage.removeItem('introSeen')
  then reload.
