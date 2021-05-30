import L from 'leaflet';
import _ from 'lodash';
import { objectColors } from '@iso/constants/objectColors';

export const IconMob = (color) => {
  var mob_color = '';
  _.forEach(objectColors, (color_obj, index) => {
      if(color_obj.value === color){
        mob_color = color_obj.color;
      }
  })
  var icon = new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%20%3F%3E%0A%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20width%3D%2277%22%20height%3D%2288%22%20viewBox%3D%220%200%2077%2088%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cdesc%3ECreated%20with%20Fabric.js%201.7.22%3C%2Fdesc%3E%0A%3Cdefs%3E%0A%3C%2Fdefs%3E%0A%3Cg%20transform%3D%22translate(38%2082.5)%22%20style%3D%22%22%3E%0A%09%3Cpath%20d%3D%22M%200%200%20h%2034%20v%2012%20H%200%20z%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20none%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200)%20translate(-17%2C%20-6)%20%22%20stroke-linecap%3D%22round%22%20%2F%3E%0A%09%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2216%22%20ry%3D%225%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(68%2C68%2C68)%3B%20fill-opacity%3A%200.3%3B%20fill-rule%3A%20evenodd%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200.1)%22%2F%3E%0A%3C%2Fg%3E%0A%3Cg%20transform%3D%22translate(38%2047.5)%22%20style%3D%22%22%3E%0A%09%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%2225%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(255%2C255%2C255)%3B%20fill-rule%3A%20evenodd%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%20-4)%20%22%2F%3E%0A%09%3Cpath%20d%3D%22M%2029%201%20C%2013.537%201%201%2013.642%201%2029.236%20a%2028.27%2028.27%200%200%200%2011.196%2022.587%20L%2029%2065%20l%2016.802%20-13.177%20A%2028.265%2028.265%200%200%200%2057%2029.236%20C%2057%2013.642%2044.464%201%2029%201%20z%20m%200%2052%20C%2015.745%2053%205%2042.255%205%2029%20S%2015.745%205%2029%205%20s%2024%2010.745%2024%2024%20s%20-10.745%2024%20-24%2024%20z%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(0%2C0%2C0)%3B%20fill-rule%3A%20evenodd%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200)%20translate(-29.000000964370482%2C%20-33)%20%22%20stroke-linecap%3D%22round%22%20%2F%3E%0A%09%3Cpath%20d%3D%22M%2019.084%2020.107%20s%200.077%20-0.71%201.845%20-0.828%20c%200%200%201.469%200.079%202.185%200.987%20c%200%200%201.582%200.236%200.978%201.223%20c%200%200%200.678%200.906%202.523%201.222%20c%200%200%201.92%200.554%206.891%200.514%20c%200%200%202.825%200.039%204.255%201.657%20c%200%200%200.792%200.749%200.979%201.854%20c%200%200%200.151%200.238%200.265%200.749%20c%200%200%200.3%200.197%200.3%200.75%20c%200%200%200.301%202.408%20-0.904%202.052%20c%200%200%200%201.736%200.227%201.933%20c%200%200%200.79%200.553%200.414%201.579%20c%200%200%20-0.074%201.657%200.15%202.328%20c%200%200%200.302%200.986%20-0.263%200.709%20c%200%200%20-0.037%200.474%20-0.339%200.198%20l%20-0.037%200.789%20s%20-0.979%200.434%20-1.696%200.079%20c%200%200%20-0.264%200%20-0.036%20-0.671%20c%200%200%200.074%20-0.591%200.375%20-0.869%20c%200%200%200.602%20-1.854%200.113%20-2.524%20c%200%200%20-0.303%20-0.711%20-0.717%20-0.751%20c%200%200%20-0.677%20-0.434%20-0.677%20-0.59%20c%200%200%20-0.038%200.867%200.301%201.261%20c%200%200%200.339%200.71%20-0.149%201.105%20c%200%200%20-0.83%201.025%20-0.981%201.144%20c%200%200%20-0.488%201.42%20-0.677%201.737%20c%200%200%20-0.489%200.315%20-0.677%200.237%20c%200%200%20-0.188%200.434%20-0.451%200.59%20c%200%200%20-0.49%200.355%20-1.507%20-0.039%20c%200%200%20-0.113%20-0.236%200.339%20-0.947%20c%200%200%200.3%20-0.67%200.978%20-1.341%20c%200%200%201.018%20-0.829%200.678%20-2.605%20c%200%200%20-1.054%20-0.906%20-1.468%20-1.814%20c%200%200%20-2.863%200.869%20-4.18%20-0.434%20c%200%200%20-0.753%20-0.396%20-0.791%200.512%20c%200%200%20-0.188%201.027%20-0.339%201.224%20c%200%200%20-0.188%201.579%200%202.092%20c%200%200%20-0.301%200.157%20-0.301%200.433%20c%200%200%200.377%201.145%20-0.112%201.105%20c%200%200%20-0.491%20-0.079%20-0.453%200.078%20c%200%200%200.414%200.513%20-0.338%200.79%20c%200%200%20-1.883%200.394%20-1.432%20-0.434%20c%200%200%200.527%20-1.38%200.527%20-1.618%20c%200%200%200.15%20-0.473%200.301%20-0.71%20c%200%200%200.038%20-0.908%20-0.339%20-1.658%20c%200%200%20-0.15%20-0.749%20-0.076%20-1.143%20c%200%200%20-1.13%20-1.302%20-1.166%20-1.5%20c%200%200%20-1.356%20-1.026%20-1.507%20-1.814%20c%200%200%20-1.111%20-1.311%20-2.137%20-3.734%20c%200%200%20-0.988%200.459%20-1.252%20-0.015%20c%200%200%20-0.265%20-0.079%20-0.415%20-0.474%20c%200%200%20-0.375%20-0.472%20-0.074%20-1.143%20c%200%200%200.375%20-0.789%200.414%20-1.222%20c%200%200%20-0.039%20-0.554%20-0.226%20-0.633%20c%200%200%20-0.868%200.04%20-1.47%20-0.592%20c%200%200%20-0.716%20-0.434%200.151%20-0.868%20c%200.003%200.002%200.492%20-0.274%201.998%200.04%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(8%2C45%2C30)%3B%20fill-rule%3A%20evenodd%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(-1%20-4)%20translate(-27.99780727734625%2C%20-28.9984136653933)%20%20matrix(1%200%200%201%200%200)%20%22%20stroke-linecap%3D%22round%22%20%2F%3E%0A%3C%2Fg%3E%0A%3Cg%20transform%3D%22translate(8.5%2035.5)%22%20style%3D%22%22%3E%0A%09%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%227.5%22%20style%3D%22stroke%3A%20'+mob_color+'%3B%20stroke-width%3A%202%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20'+mob_color+'%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200)%20%22%2F%3E%0A%09%09%3Cg%20transform%3D%22translate(0%200)%22%3E%0A%09%09%3Ctext%20xml%3Aspace%3D%22preserve%22%20font-family%3D%22arial%22%20font-size%3D%228%22%20font-weight%3D%22normal%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(0%2C0%2C0)%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%20white-space%3A%20pre%3B%22%20%3E%0A%09%09%09%3Ctspan%20x%3D%22-1%22%20y%3D%222.52%22%20fill%3D%22%23000000%22%3E%3C%2Ftspan%3E%0A%09%09%3C%2Ftext%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3Cg%3E%3Cdesc%3Ee5b5ae60-d6e7-11ea-8d7d-d5d078bf2c1f_SHEEP%3C%2Fdesc%3E%3C%2Fg%3E%3C%2Fsvg%3E',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    className: 'custom-icon-marker mob'
  });

  return icon;
};