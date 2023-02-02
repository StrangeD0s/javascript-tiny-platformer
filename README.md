# Readme

Simple JS platformer to modify and extend.

## Welche VS Code Extensions sollten installiert sein

- Better Comments
- Color Highlight
- Atom One Dark Theme
- Material Icon Theme

## Grundideen

- Camera Setup kann ich erstmal auslassen. Dann mache ich stattdessen single rooms (vgl. Lykia).
- Overworld und Levels?
- Character selection?
- Inventory System mit durchsuchbaren Kisten, Content bleibt erhalten.
- Auflösung von Gameboy, GBC, Game Gear ist 160 × 144 pixel.
- Sprite Animation kann ich genauso machen wie bei Pico-8 (<https://nerdyteachers.com/Explain/AnimateSprite/>, <https://www.youtube.com/watch?v=rtWGZ1uiBLY>)!
- Setting ist ein Space Adventure. Mit einem Raumschiff kann man viele verschiedene Umgebungen erreichen (Dschungel, Techno, Unterwasser, Höhlen,...)
- Commander Keen trifft Metroidvania (mit ein bisschen Subnautica?)

## Todo

- [ ] Refactor code. Alles sortieren (Helper, Utils, Functions, Main Function, Objects usw.)
- [ ] Allgemeine btn() Funktion bauen, angelehnt an Pico-8.
- [x] Robuste collision checks und collision maps bauen
- [ ] Bessere flags bauen
- [x] Irgendeine Art Dev Function bauen, die mir übersichtliche console logs ausgibt.
- [ ] Alle Variablen und Funktionen, die nicht Platformer-spezifisch sind, als Engine auslagern.
- [ ] "Doors" System entwickeln.
- [ ] Die Camera funktioniert in Level2 noch nicht mit Begrenzung nach Rechts und Unten.
- [x] Pause Function
- [x] Sprite Animation (<https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript>)

## Sprites

- Chest closed: 388, chest open: 389
-

### Welche Assets nutze ich

- "Grotto Escape Pack" by Ansimuz
- "8-Bit Cave Loop" by Wolfgang

## Feature Roadmap

- [x] zweite Map
  - [x] Variablen für alle Props, die die Map betreffen (MAP.tw/.th, Scaling, HUD-Scaling, TileAtlas)
- [x] Alphabet TileMap (oder font!)
- [ ] Map Layers (CollisionLayer, Background, Foreground, Object-Layer) inkl. Anleitung für Tiled
- [ ] Map Transitions (mit einem Doors Object)
- [ ] Sprite Flags (gerade wird bei den Tiles nur nach cell 0 und !0 unterschieden)
  - [ ] oder: Ich arbeite mit mehreren Map Layers. Dann brauche ich nur einen Layer für Collision (das funktioniert ja schon) und Layer für Background und Foreground. Traps usw. kann ich genau wie Monster und Treasure handlen.
- [ ] Global Player Object
- [ ] Inventory System
- [ ] CameraBox

## Story

Biff Bolton, sidekick to intergalactic space adventurer Ace Hunter, is stranded on a strange planet after several parts of his ship fail and he has to make an emergency landing. To repair his ship he must explore the planet and delve deep into its mysterious caves and catacombs.
