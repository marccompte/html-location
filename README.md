# html-location Web Component

Defines a single point location HTML Web Component. The component draws a map using Leaflet and centers its view in a point marker. When clicking the point marker a panel slides in to show additional data about this point.

Intended for use as the traditional "About us/Contact" map in a business or organization website.

## Features

- Simple HTML component. Load the JavaScript file and use with HTML.
- Material Design based UI.
- Transitional animations to improve UX.
- Responsive both to the screen size and component size.
- Different base map styles to choose from.

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

### Explanation

The JavaScript we add on the top creates a custom Web Component. This means it creates a new HTML object that has its own UI and behavior. The new tag is:
```
<location-map></location-map>
```

This tag has its own attributes and childs that will provide the required input data to customize it.

#### location-map attributes

There are four required attributes:

- **data-longitude** and **data-latitude** are the center of the initial view and the place where the marker will be plotted
- **data-zoom** is the level of zoom we want to use on the initial view.
- We also need to set its dimensions, this can be done with standard CSS.

```
<location-map
    data-longitude="2.827728" data-latitude="41.985081" data-zoom="14"
    style="width: 895px; height: 600px;">
</location-map>
```

There is also an optional attribute:

- **data-basemap** to choose a different basemap style. *Options available: osm.streets, osm.topo, carto.streets, carto.bright, carto.dark.*

In addition to those, another object `<data>` must be included inside the location-map tag. This object includes the data we want to show about that location:

```
<location-map
    data-longitude="2.827728" data-latitude="41.985081" data-zoom="14"
    style="width: 895px; height: 600px;">
  <data>
    <title>Girona</title>
    <content><em>This is our headquarters!</em></content>
    <address>Plaça Ferrater i Mora 1, 17004</address>
    <phone>+34 888888888</phone>
    <email>someone@example.com</email>
  </data>
</location-map>
```

## Future

### Improve documentation

- Make a proper REFERENCE.md file with all the attributes required and optional.
- Add screenshots.
- Make a demo on GitHub pages.

### Improve performance

- ~~Minimize CSS used from MaterializeCSS~~
- ~~Remove Leaflet providers dependency~~

### Improve HTMLElement interface (more tag attributes/childs)

- ~~**data-autoopen**: Auto open info panel on component visible (on scroll).~~
- ~~**data-basemap**: Basemap alternatives.~~
- **data-marker-icon**: image or a material icon?.
- **data-panel-position**: right, left, top, bottom, popup?.
- **data-color-scheme**: set up a color scheme (need to refactor all styling into JS?)

### Others

- Make a highly customizable info panel.
- Extend it for other purposes.
