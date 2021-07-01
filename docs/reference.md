# Location Web Component Reference

Add the `leaflet-location-component.js` at the top of your file and then add a `<location-map>` tag inside your content.

`<location-map></location-map>`

## Attributes

### Required

This tag requires the following attributes:

- **data-longitude**: A decimal number indicating the center's longitude of the initial map view.
- **data-latitude**: A decimal number indicating the center's latitude of the initial map view.
- **data-zoom**: An integer number indicating the zoom level of the initial map view.

It also requires the container to have a size defined, but you will do that with standard CSS:

```
<style>
location-map {
  width: 100%;
  height: 300px;
}
</style>
```

Or

```
<style>
location-map#my_id {
  width: 100%;
  height: 300px;
}
</style>
```

### Optional

#### data-basemap

Indicate the type of basemap to use (defaults to *carto.streets*).

*Possible options are:
carto.streets, carto.bright, carto.dark, osm.streets, osm.topo, stamen.bright, stamen.handdrawn, stamen.terrain*

```
<location-map data-basemap="stamen.terrain"
    ...
    ...>
</location-map>
```

#### data-autoopen

Set it to true (defaults to *false*) to open the info popup automatically when loading the map.

*Possible options are:
true, false*

```
<location-map data-autoopen="true"
    ...
    ...>
</location-map>
```
