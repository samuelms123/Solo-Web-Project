'use strict';

window.addEventListener('scroll', function () {
  let header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('header-moving');
  } else {
    header.classList.remove('header-moving');
  }
});

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);

map.setView([60, 24], 7);
