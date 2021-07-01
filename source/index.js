import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import 'material-icons/iconfont/material-icons.scss';
import './styles.scss';
import 'leaflet-providers';
import {v4 as uuidv4} from 'uuid';
var L = require('leaflet');

const KEY = '04cbc75c-2a5a-405c-8d4a-1f353e7f50b9';
const KEY_SERVER = 'http://localhost:8181';
const ICON_SIZE = 42;

const template = document.createElement('template');
template.innerHTML = `
     <div class="card">
       <div class="card-image">
         <img src="ed_lletres.jpg">
         <span class="card-title"></span>
       </div>
       <div class="card-content">
         <p class="text"></p>
         <ul>
           <li class="address hover tooltip" data-tooltip="Get directions" data-position="top"></li>
           <li class="phone hover tooltip" data-tooltip="Call us" data-position="top"></li>
           <li class="email hover tooltip" data-tooltip="Write to us" data-position="top"></li>
         </ul>
       </div>
     </div>
`;

var AUTOINCREMENT = 0;

function autoid() {
  return AUTOINCREMENT += 1;
}


class Panel {
  constructor(className, parent) {
    this.id = 'location-map-object-' + autoid();
    this.parent = parent;
    this.container = document.createElement('div');
    this.container.setAttribute('id', this.id);
    this.container.classList.add(className);
  }
}


class MapPanel extends Panel {
  constructor(className, parent) {
    super(className, parent);
  }

  init(params) {
    this.params = params;
    const map_properties = {minZoom: 1};
    this.leaflet = L.map(this.id, map_properties);
    L.tileLayer.provider('CartoDB.Voyager').addTo(this.leaflet);
    this.leaflet.setView(params.view.center, params.view.zoom);

    var myIcon = L.divIcon({
      className: 'location-icon',
      html: '<div><span class="material-icons">business</span></div>',
      iconSize: [ICON_SIZE, ICON_SIZE],
      iconAnchor: [ICON_SIZE / 2, ICON_SIZE],
      titol: 'HGola'
    });
    var myMarker = L.marker(params.view.center, {icon: myIcon}).addTo(this.leaflet);
    this.container.querySelectorAll('.location-icon').forEach(icon => {
      icon.addEventListener('pointerup', event => {
        this.parent.info.openPopup(event);
      });
    });

    this.leaflet.on('click', event => {
      this.parent.info.closePopup();
    });

    this.parent.resizer();
  }
}


class InfoPanel extends Panel {
  constructor(className, parent) {
    super(className, parent);
    this.container.classList.add('z-depth-3');
  }
  init(params) {
  }
  openPopup(event) {
    var icon = event.target;
    L.DomEvent.disableClickPropagation(icon);
    this.parent.resizer();
    this.container.parentElement.classList.add('active');
    window.setTimeout(() => {
      const main = document.querySelector('#' + this.id).parentElement;
      const data = main.querySelector('data');
      main.querySelector('.info .card-title').innerHTML = data.querySelector('title').innerText;
      if (data.querySelector('content') && data.querySelector('content').innerText !== '') {
        main.querySelector('.info .card-content p.text').innerHTML = data.querySelector('content').innerText;
      }
      if (data.querySelector('address') && data.querySelector('address').innerText !== '') {
        main.querySelector('.info .card li.address').innerHTML = data.querySelector('address').innerText;
        main.querySelector('.info .card li.address').addEventListener('pointerup', event => {
          open('https://www.google.com/maps/dir//' + data.querySelector('address').innerText + '/@' + this.parent.getAttribute('data-latitude') + ',' + this.parent.getAttribute('data-longitude'));
        })
      }
      if (data.querySelector('phone') && data.querySelector('phone').innerText !== '') {
        main.querySelector('.info .card li.phone').innerHTML = `<a target="_blank" href="tel:${data.querySelector('phone').innerText}">${data.querySelector('phone').innerText}</a>`;
        main.querySelector('.info .card li.phone').addEventListener('pointerup', event => {
          location = 'tel:' + data.querySelector('phone').innerText;
        })
      }
      if (data.querySelector('email') && data.querySelector('email').innerText !== '') {
        main.querySelector('.info .card li.email').innerHTML = `<a target="_blank"  href="mailto:${data.querySelector('email').innerText}">${data.querySelector('email').innerText}</a>`;
        main.querySelector('.info .card li.email').addEventListener('pointerup', event => {
          open('mailto:' + data.querySelector('email').innerText);
        });
      }
      document.querySelectorAll('.material-tooltip').forEach(tooltip => {
        tooltip.remove();
      });
      M.AutoInit();
      this.parent.querySelectorAll('.tooltip').forEach(tooltip => {
        var node = document.createElement('span');
        node.classList.add('tooltiptext');
        node.innerText = tooltip.getAttribute('data-tooltip');
        var position = tooltip.getAttribute('data-position') ? tooltip.getAttribute('data-position') : 'top';
        node.classList.add(position);
        tooltip.append(node);
      });
    }, 200);
    var info = this.container.parentElement.querySelector('.info');
    info.classList.add('active');
    info.innerHTML = '';
    var content = template.content.cloneNode(true);
    info.appendChild(content);
    // M.AutoInit();
    this.parent.querySelector('.close-tab').addEventListener('pointerup', event => {
      this.closePopup();
    });
  }
  closePopup() {
    window.setTimeout(() => {
      this.container.parentElement.classList.remove('active');
      this.parent.resizer();
    }, 1);
    var info = this.container.parentElement.querySelector('.info');
    info.classList.remove('active');
  }
}

var counter = 0;

class CompanyMap extends HTMLElement {
  constructor(a) {
    super();
  }
  resizer() {
    var resizer = window.setInterval(() => {
      this.map.leaflet.invalidateSize();
      this.map.leaflet.panTo(this.map.params.view.center);
      counter += 1;
      if (counter > 250) {
        window.clearInterval(resizer);
        counter = 0;
      }
    }, 1);
  }
  buildUI() {
    // Create a shadow root
    // this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
    this.info = new InfoPanel('info', this);
    this.map = new MapPanel('map', this);
    // Create some CSS to apply to the shadow dom
    // const style = document.createElement('style');
    // style.textContent = '.wrapper {' +
    // CSS truncated for brevity

    // attach the created elements to the shadow DOM
    this.appendChild(this.map.container);
    this.appendChild(this.info.container);
    // this.shadowRoot.append(wrapper);
  }
  init() {
    this.map.init({
      'basemap': this.getAttribute('data-basemap'),
      'view': {
        'center': [parseFloat(this.getAttribute('data-latitude')), parseFloat(this.getAttribute('data-longitude'))],
        'zoom': this.getAttribute('data-zoom')
      }
    });
    this.watchResize();
    this.checkResize();
    var button = document.createElement('a');
    var icon = 'arrow_forward_ios';
    button.innerHTML = '<a class="close-tab halfway-fab hoverable z-depth-2"><i class="material-icons tooltip"  data-tooltip="Hide" data-position="left"> ' + icon + '</i></a>';
    this.appendChild(button.querySelector('.close-tab'));
  }
  watchResize() {
    window.addEventListener('resize', event => {
      this.checkResize();
    });
  }
  checkResize() {
    if (this.offsetWidth <= 450) {
      this.classList.add('mobile');
      this.classList.remove('tablet');
    }
    else if (this.offsetWidth <= 900) {
      this.classList.add('tablet');
      this.classList.remove('mobile');
    }
    else {
      this.classList.remove('mobile');
      this.classList.remove('tablet');
    }
  }
  connectedCallback() {
    // Load web component child nodes
    // var observer = new MutationObserver(mutations => {
    //   mutations.forEach(mutation => {
    //     if (mutation.addedNodes.length) {
    //       mutation.addedNodes.forEach(node => {
    //         if (node.nodeType !== 3) console.info('Node added: ', node);
    //       })
    //     }
    //   })
    // });
    // observer.observe(this, { childList: true })
    this.buildUI();
    this.init();
  }
}

window.customElements.define('simple-html-map', CompanyMap);