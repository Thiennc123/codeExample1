import L from 'leaflet';

export const IconTask = () => {
  var icon = new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,%0A%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2260px%22%20width%3D%2244px%22%3E%0A%20%20%20%20%3Cg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20transform%3D%22translate(22%2052.5)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M%200%200%20h%2034%20v%2012%20H%200%20z%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20none%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200)%20translate(-17%2C%20-6)%20%22%20stroke-linecap%3D%22round%22%2F%3E%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2216%22%20ry%3D%225%22%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%2010%3B%20fill%3A%20rgb(68%2C68%2C68)%3B%20fill-opacity%3A%200.3%3B%20fill-rule%3A%20evenodd%3B%20opacity%3A%201%3B%22%20transform%3D%22translate(0%200.1)%22%2F%3E%3C%2Fg%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20fill%3D%22%231A3C2A%22%20d%3D%22M8.396%2038.117A21.205%2021.205%200%200%201%200%2021.177C0%209.482%209.402%200%2021%200c11.6%200%2021%209.482%2021%2021.177a21.2%2021.2%200%200%201-8.398%2016.94L21.002%2048%208.395%2038.117z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M21%2039c9.942%200%2018-8.06%2018-18S30.942%203%2021%203C11.06%203%203%2011.06%203%2021s8.06%2018%2018%2018%22%2F%3E%3Cpath%20fill%3D%22%231A3C2A%22%20d%3D%22M18.207%2016l13.19%2013.19a.501.501%200%200%201%200%20.706l-2.5%202.5a.5.5%200%200%201-.707%200L15%2019.206%2018.207%2016zM8.147%2016.146l7-7a.502.502%200%200%201%20.708%200c1.163%201.164%203.128%201.165%204.292%200A.512.512%200%200%201%2020.502%209c.132%200%20.26.052.353.146l1%201a.5.5%200%200%201%200%20.708l-9.5%209.5a.5.5%200%200%201-.707%200l-3.5-3.5a.499.499%200%200%201%200-.708z%22%2F%3E%3C%2Fg%3E%0A%20%20%3C%2Fsvg%3E%0A',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    className: 'custom-icon-marker task-marker'
  });

  return icon;
};