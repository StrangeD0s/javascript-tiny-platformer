# Javascript Tiny-Platformer

A very minimal javascript platform game

- [play the game](http://codeincomplete.com/projects/tiny-platformer/index.html)
- read the [original article](http://codeincomplete.com/posts/2013/5/27/tiny_platformer/)
- read a [follow up article](http://codeincomplete.com/posts/2013/6/2/tiny_platformer_revisited/) about adding monsters and treasure
- view the [source](https://github.com/jakesgordon/javascript-tiny-platformer)

Just a sinple example of how to have a tiny rectangle run around some rectangle platforms,
collecting rectangular gold and avoiding rectangular monsters.

# SUPPORTED BROWSERS

Should work in any modern browser with canvas support

# DEVELOPMENT

The game is 100% client side javascript, html and css. It should run when served up by any web server.

# License

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.

---

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

## Todo

- [ ] Refactor code. Alles sortieren (Helper, Utils, Functions, Main Function, Objects usw.)
- [ ] Allgemeine btn() Funktion bauen, angelehnt an Pico-8.
- [ ] Robuste collision checks und collision maps bauen
- [ ] Bessere flags bauen
- [x] Irgendeine Art Dev Function bauen, die mir übersichtliche console logs ausgibt.
- [ ] Alle Variablen und Funktionen, die nicht Platformer-spezifisch sind, als Engine auslagern.
- [ ] "Doors" System entwickeln.
- [x] Pause Function
