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

- [x] Refactor code. Alles sortieren (Helper, Utils, Functions, Main Function, Objects usw.)
- [x] Robuste collision checks und collision maps bauen
- [x] Irgendeine Art Dev Function bauen, die mir übersichtliche console logs ausgibt.
- [x] "Doors" System entwickeln.
- [x] Die Camera funktioniert in Level2 noch nicht mit Begrenzung nach Rechts und Unten. Liegt das am Level selbst?
- [x] Pause Function
- [x] Sprite Animation (<https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript>)
- [x] Maps umrüsten auf 16x16 px tiles. Ist in den Variablen schon vorbereitet, muss nur die Maps noch mal aus Tiled exportieren
  - [x] Aus Tiled werden die Custom Properties nicht richtig exportiert
  - [x] "type" muss ich ändern in "class" in der setup Funktion
  - [x] Die properties werden als Array exportiert. Da brauche ich in der setup Funktion noch eine Function um die zu Konviertieren.
- [x] Globales Objekt bauen mit einem einzigen Wert ("life = 3" z.B.), den ich immer Anzeige und der über die Level hinaus bestehen bleibt.
- [ ] Gravity Variable für verschiedene Umgebungen (Land, Wasser, Space)
- [ ] Verschiedene Biomes
  - [ ] Ice World
  - [ ] Desert World
  - [ ] Lava World
  - [ ] Underwater
  - [ ] Forest World
  - [ ] Techno World
- [ ] Fix Scaling bei verschiedenen Level-Größen (protrait ist broken)

### Welche Assets nutze ich

- "Grotto Escape Pack" by Ansimuz
- "8-Bit Cave Loop" by Wolfgang

## Welche Tools nutze ich

- Beepbox für Musik <https://www.beepbox.co/>
- Tiled für Sprites und Maps <https://www.mapeditor.org/>

### Tiled

Map Setup:

- Orthogonal
- CSV
- Left Down (! das ist wichtig)

Layer in folgender Reihenfolge:

- foreground
- Object Layer 1
- tileLayer
- background

Export als ".tmj"

## Feature Roadmap

- [x] zweite Map
  - [x] Variablen für alle Props, die die Map betreffen (MAP.tw/.th, Scaling, HUD-Scaling, TileAtlas)
- [x] Alphabet TileMap (oder font!)
- [x] Map Layers (CollisionLayer, Background, Foreground, Object-Layer) inkl. Anleitung für Tiled
- [x] Map Transitions (mit einem Doors Object)
- [x] Map Layers
- [x] Global Player Object
- [x] Shooting
- [x] Swimming
- [x] Ammo
- [ ] mehr Weapons
- [ ] animated Tiles
- [ ] mehr Enemy Types (flying, wallcrawler, shooting)
- [ ] Upgrades/Powerups
- [ ] Destructibles (haben eigenes "destructibles = {}" Objekt wie monsters oder treasure und haben hitpoints, eigener Layer oder gehören die zu Objects?)
- [ ] Ladders/Poles
- [ ] Game Start/Game Over Screen
- [ ] Inventory System
- [ ] CameraBox
- [ ] Sprites
  - [ ] Player
  - [ ] Enemies
  - [ ] Items
  - [ ] Map

## Possible Story

Biff Bolton, sidekick to intergalactic space adventurer Ace Hunter, is stranded on a strange planet after several parts of his ship fail and he has to make an emergency landing. To repair his ship he must explore the planet and delve deep into its mysterious caves and catacombs.
