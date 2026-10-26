# Template-new

**Dernière MAJ : 20/05/2026**

Thème enfant WordPress basé sur **Hello Elementor**, conçu comme une base de départ réutilisable pour produire des sites WordPress / Elementor plus légers, maintenables et mieux structurés.

Ce thème sert de template agence : il centralise une base SCSS, des comportements JavaScript globaux, une logique d’enqueue propre côté WordPress et une stratégie de chargement conditionnel des assets spécifiques aux pages ou sections.

---

## Objectifs du thème

- Fournir une base propre pour démarrer rapidement un nouveau site WordPress / Elementor.
- Garder un thème léger : charger uniquement les assets nécessaires.
- Éviter les dépendances globales inutiles, notamment jQuery côté thème.
- Organiser le SCSS selon une logique claire : global, composants, layouts, pages.
- Permettre le chargement conditionnel de CSS de page ou de section.
- Charger GSAP uniquement lorsque des animations en ont besoin.
- Garder une structure compréhensible pour les futurs développeurs de l’agence.

---

## Prérequis

- WordPress
- Thème parent : `hello-elementor`
- Node.js récent, idéalement Node 18+
- npm

Installation des dépendances :

```bash
npm install
```

---

## Commandes disponibles

```bash
npm run webpack
```

Lance Webpack en mode développement avec surveillance des fichiers.

```bash
npm run build
```

Compile les assets en mode production.

Avant une mise en ligne, toujours exécuter :

```bash
npm run build
```

Le mode développement génère des fichiers plus lourds avec sourcemaps et `eval()`. Le mode production est indispensable pour obtenir des fichiers optimisés.

---

## Structure générale

```txt
template/
├── assets/
│   ├── dist/                 # Fichiers compilés par Webpack
│   │   ├── css/
│   │   ├── js/
│   │   └── fonts/
│   ├── fonts/                # Polices sources
│   ├── js/                   # Sources JavaScript
│   │   ├── index.js
│   │   └── global/
│   │       ├── global.js
│   │       └── functions/
│   └── sass/                 # Sources SCSS
│       ├── abstracts/
│       ├── base/
│       ├── components/
│       ├── layout/
│       ├── pages/
│       ├── utilities/
│       ├── vendors/
│       └── main.scss
├── functions.php
├── package.json
├── style.css
└── webpack.config.js
```

---

## Philosophie d’architecture

La règle principale du thème est la suivante :

> Un fichier global doit être utile partout. Un fichier spécifique doit être chargé uniquement là où il est nécessaire.

Cela s’applique au SCSS, au JavaScript et aux dépendances lourdes comme GSAP.

---

## Webpack

La configuration Webpack génère les fichiers dans :

```txt
assets/dist/
```

Entrées principales actuelles :

```js
entry: {
  bundle: path.resolve(__dirname, "assets/js/index.js"),
  accueil: path.resolve(__dirname, "assets/sass/pages/accueil.scss"),
}
```

Ce qui produit notamment :

```txt
assets/dist/js/bundle.js
assets/dist/css/bundle.css
assets/dist/css/accueil.css
```

Le plugin `webpack-remove-empty-scripts` est utilisé pour éviter de générer des fichiers JS vides lorsque l’entrée Webpack est uniquement un fichier SCSS.

### Ajouter une nouvelle entrée CSS de page

Exemple pour une page ou section `nos-metiers` :

```js
entry: {
  bundle: path.resolve(__dirname, "assets/js/index.js"),
  accueil: path.resolve(__dirname, "assets/sass/pages/accueil.scss"),
  "nos-metiers": path.resolve(__dirname, "assets/sass/pages/nos-metiers.scss"),
}
```

Webpack générera :

```txt
assets/dist/css/nos-metiers.css
```

---

## SCSS

### Structure

```txt
assets/sass/
├── abstracts/      # Outils Sass uniquement : mixins, fonctions, breakpoints
├── base/           # Base CSS : reset, typographie, variables CSS, styles HTML globaux
├── components/     # Composants réutilisables
├── layout/         # Header, footer, navigation, structure globale
├── pages/          # Styles spécifiques à une page ou une section
├── utilities/      # Classes utilitaires
├── vendors/        # Overrides Elementor / librairies tierces
└── main.scss       # Point d’entrée global
```

### Rôle de `main.scss`

`main.scss` compile le CSS global du thème :

```scss
@use "base" as *;
@use "layout" as *;
@use "components" as *;
@use "vendors" as *;
@use "utilities" as *;
```

Ne pas importer `pages` dans `main.scss`.

Mauvais exemple :

```scss
@use "pages" as *;
```

Cela compilerait tous les styles de pages dans `bundle.css`, même lorsqu’ils ne sont pas nécessaires.

### Règle pour `abstracts`

Le dossier `abstracts` doit contenir uniquement des outils Sass :

- mixins
- fonctions
- breakpoints
- placeholders éventuels

Il ne doit pas générer de CSS directement.

Bon exemple :

```scss
@use "../abstracts" as *;

.card {
  @include globalShadow;
}
```

Mauvais exemple dans `abstracts` :

```scss
:root {
  --color: red;
}
```

Les custom properties globales doivent rester dans `base/_custom-properties.scss`.

---

## CSS de page ou de section

Les styles spécifiques doivent être placés dans :

```txt
assets/sass/pages/
```

Exemple :

```txt
assets/sass/pages/accueil.scss
assets/sass/pages/search.scss
assets/sass/pages/template.scss
assets/sass/pages/nos-metiers.scss
```

Une page spécifique peut utiliser les outils Sass :

```scss
@use "../abstracts" as *;

.page-nos-metiers {
  padding-block: rem(80);
}
```

Elle ne doit pas réimporter `base`, `layout`, `components`, `vendors` ou `utilities`, sinon le CSS global risque d’être dupliqué.

---

## Enqueue WordPress

('strategy' => 'defer' disponible sur >= WP 6.3)

Les assets globaux sont chargés dans `functions.php` avec `child_enqueue()` :

```php
wp_enqueue_style(
  'bundle-css',
  $theme_dist_uri . '/css/bundle.css',
  array(),
  template_asset_version($theme_dist_path . '/css/bundle.css'),
  'all'
);

wp_enqueue_script(
  'bundle-script',
  $theme_dist_uri . '/js/bundle.js',
  array(),
  template_asset_version($theme_dist_path . '/js/bundle.js'),
  array(
    'in_footer' => true,
    'strategy'  => 'defer',
  )
);
```

La fonction `template_asset_version()` utilise `filemtime()` pour éviter les problèmes de cache après compilation.

```php
function template_asset_version($file_path)
{
  return file_exists($file_path) ? filemtime($file_path) : THEME_VERSION;
}
```

### Charger un CSS spécifique

La fonction utilitaire :

```php
function template_enqueue_dist_style($handle, $filename, $dependencies = array('bundle-css'))
```

charge un fichier situé dans :

```txt
assets/dist/css/{filename}.css
```

Elle vérifie l’existence du fichier avant de l’enqueue. Si le fichier n’existe pas, elle retourne `false` et ne provoque pas d’erreur.

Exemple pour la page d’accueil :

```php
if (is_front_page()) {
  template_enqueue_dist_style('accueil-css', 'accueil');
}
```

Important : le deuxième paramètre doit correspondre au nom du fichier généré par Webpack, sans `.css`.

Exemple :

```js
entry: {
  accueil: path.resolve(__dirname, "assets/sass/pages/accueil.scss"),
}
```

produit :

```txt
assets/dist/css/accueil.css
```

Donc l’appel correct est :

```php
template_enqueue_dist_style('accueil-css', 'accueil');
```

---

## Charger le CSS d’une section et de ses enfants

Le thème contient une fonction :

```php
is_page_or_descendant_of('slug-parent')
```

Elle retourne `true` si la page courante est la page donnée ou l’un de ses descendants.

Exemple pour une section `nos-metiers` :

```php
if (is_page_or_descendant_of('nos-metiers')) {
  template_enqueue_dist_style('nos-metiers-css', 'nos-metiers');
}
```

Cela chargera :

```txt
assets/dist/css/nos-metiers.css
```

sur :

```txt
/nos-metiers/
/nos-metiers/page-enfant/
/nos-metiers/page-enfant/sous-page/
```

---

## Classes automatiques sur le body

Le thème ajoute des classes utiles au `<body>` pour cibler les pages et sections.

Exemple pour une page racine :

```txt
page-nos-metiers
page-slug-nos-metiers
page-depth-0
has-child-pages
is-root-page
```

Exemple pour une page enfant :

```txt
is-child-page
is-direct-child-of-nos-metiers
page-parent-nos-metiers
is-child-of-nos-metiers
page-ancestor-nos-metiers
is-in-section-nos-metiers
page-root-nos-metiers
```

Ces classes peuvent servir en CSS ou en JS, mais l’enqueue des fichiers spécifiques doit rester côté PHP lorsque c’est possible.

---

## JavaScript

Le point d’entrée principal est :

```txt
assets/js/index.js
```

Il importe :

```js
import "./global/global.js";
import "../sass/main.scss";
```

Les comportements globaux sont lancés dans :

```txt
assets/js/global/global.js
```

Modules actuels :

```txt
assets/js/global/functions/headerScroll.js
assets/js/global/functions/top.js
assets/js/global/functions/darkMode.js
assets/js/global/functions/scrollIndicator.js
assets/js/global/functions/clickableElts.js
assets/js/global/functions/gsapTranslate.js
```

Chaque module JS doit être défensif : il doit vérifier que les éléments ciblés existent avant de s’exécuter.

Bon principe :

```js
export default function moduleName() {
  const element = document.querySelector(".my-element");

  if (!element) {
    return;
  }

  // logique du module
}
```

---

## jQuery

Le thème ne dépend plus de jQuery pour ses scripts globaux.

Ne pas désenregistrer jQuery globalement dans WordPress : Elementor, WordPress ou des plugins peuvent encore en avoir besoin.

La règle est simplement :

```txt
WordPress / Elementor peuvent utiliser jQuery.
Le bundle du thème ne doit pas dépendre de jQuery si son code n’en a pas besoin.
```

Donc `bundle-script` est chargé sans dépendance jQuery :

```php
array()
```

au lieu de :

```php
array('jquery')
```

---

## GSAP

GSAP est installé via npm et chargé dynamiquement uniquement si nécessaire.

Dans `global.js` :

```js
const shouldLoadGSAP = document.querySelector(
  ".gsap-x-right, .gsap-x-left, .gsap-y-top, .gsap-y-bottom",
);

if (shouldLoadGSAP) {
  import("./functions/gsapTranslate").then(({ default: gsapTranslate }) => {
    gsapTranslate();
  });
}
```

Résultat :

```txt
Page sans animation GSAP :
- bundle.js uniquement

Page avec animation GSAP :
- bundle.js
- chunk GSAP dynamique
- chunk gsapTranslate dynamique
```

---

## Polices

Les polices sources sont dans :

```txt
assets/fonts/
```

Les polices compilées sont copiées dans :

```txt
assets/dist/fonts/
```

Les `@font-face` sont générés via une mixin Sass dans `base/_typography.scss`.

Les fichiers `.woff2` sont à privilégier pour le web.

Les règles actuelles utilisent `font-display: swap`, ce qui permet au texte de rester visible pendant le chargement des polices.

Bonne pratique : ne conserver que les graisses réellement utilisées sur le site.

---

## Bonnes pratiques avant livraison

Avant mise en production :

```bash
npm run build
```

Puis vérifier :

- aucun fichier JS de développement avec `eval()` n’est livré ;
- `assets/dist/css/bundle.css` existe ;
- `assets/dist/js/bundle.js` existe ;
- les CSS spécifiques nécessaires sont bien générés ;
- les CSS spécifiques sont bien enqueued dans `functions.php` ;
- le site fonctionne sans dépendance jQuery côté thème ;
- les pages sans animation ne chargent pas GSAP ;
- les fonts inutilisées sont supprimées ou non déclarées ;
- les images Elementor sont optimisées en WebP / AVIF quand possible ;
- PageSpeed Insights est testé sur mobile et desktop.

---

## Règles de maintenance

1. Ne jamais importer `pages` dans `main.scss`.
2. Ne jamais placer du CSS généré dans `abstracts`.
3. Ne jamais ajouter jQuery comme dépendance du bundle si le thème n’en a pas besoin.
4. Ne jamais charger GSAP globalement pour une animation utilisée sur quelques pages seulement.
5. Toujours ajouter une entrée Webpack pour un CSS spécifique.
6. Toujours enqueue un CSS spécifique via `template_enqueue_dist_style()`.
7. Toujours lancer `npm run build` avant livraison.
8. Toujours garder la même logique de nommage entre l’entrée Webpack et le fichier enqueued côté PHP.

## Notes de version

Version actuelle : `1.0.0`

Base : thème enfant de `hello-elementor`.
