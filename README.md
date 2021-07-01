# html-location Web Component

Defines a single point location HTML Web Component. The component draws a map using Leaflet and centers its view in a point marker. When clicking the point marker a panel slides in to show additional data about this point.

Intended for use as the traditional "About us/Contact" map in a business or organization website.

## Features

- Simple HTML component. Load the JavaScript file and use with HTML.
- Material Design based UI.
- Transitional animations to improve UX.
- Responsive both to the screen size and component size.
- Different base map styles to choose from.
- Option to auto-open info window on loading.

## Dependencies

The component integrates Leaflet JS, but you still need to manually add its stylesheet to your HTML.

`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />`

## Software used

It uses Leaflet as a map framework and MaterializeCSS as a UI framework. Both are integrated into the final JavaScript bundle.

## Development environment

1. Install NPM if you don't have it.
2. Clone this repository and move into the folder created.
3. Install dependencies.
`npm install`
4. Run development server.
`npm run dev`

## Install on production server

1. At the development environment, build the compiled files:
`npm run build`
2. Go to the directory `dist` and copy the following files to your server:
```
leaflet-location-component.min.js
leaflet-location-component.min.css
```
3. Edit the HTML page where you want to show the map and put the JavaScript file and the CSSs on the head section:
```
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="leaflet-location-component.min.css" />
    <script src="leaflet-location-component.min.js"></script>
```
4. Go the to place in the HTML body where you want to embed the map and add a new component:

```
<location-map
    data-longitude="2.827728" data-latitude="41.985081" data-zoom="14"
    style="width: 100%; height: 100%;">
  <data>
    <title>Girona</title>
    <content><em>This is our headquarters!</em></content>
    <address>Plaça Ferrater i Mora 1, 17004</address>
    <phone>+34 888888888</phone>
    <email>someone@example.com</email>
  </data>
</location-map>
```

The JavaScript we add on the top creates a custom Web Component. This means it creates a new HTML object that has its own UI and behavior. The new tag is:
```
<location-map></location-map>
```

This tag has its own attributes and childs that will provide the required input data to customize it. Check the reference.md file in the docs.

## Future

### Improve code

- Converge naming of package, module, class and HTMLElement.

### Improve documentation

- ~~Make a proper REFERENCE.md file with all the attributes required and optional.~~
- Add screenshots.
- Make a demo on GitHub pages.

### Improve performance

- ~~Minimize CSS used from MaterializeCSS~~
- ~~Remove Leaflet providers dependency~~

### Improve HTMLElement interface (more tag attributes/childs)

- ~~**data-autoopen**: Auto open info panel on component visible (on scroll).~~
- ~~**data-basemap**: Basemap alternatives.~~
- ~~**data.image**: image to show on the info window~~.
- **data-marker-icon**: image or a material icon?.
- **data-panel-position**: right, left, top, bottom, popup?.
- **data-color-scheme**: set up a color scheme (need to refactor all styling into JS?)
- **data-popup-on-view**: open the popup info window when the component scrolls into view.

### Others

- Make a highly customizable info panel.
- Extend it for other purposes.
- Define a usage metrics system. Tokens, Domains, #seats?
