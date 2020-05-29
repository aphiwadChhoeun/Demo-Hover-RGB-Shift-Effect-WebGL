import './index.scss';
import * as THREE from "three";
import LightBox from "./LightBox";
import EffectShell from "./EffectShell";


// START HERE
let items = document.querySelectorAll(".gallery__wrapper .item");
let images = document.querySelectorAll(".gallery__wrapper .item img");
let canvasContainer = document.querySelector('.canvas__container');
let lightbox = new LightBox(document.querySelector(".lightbox"), images);
let effectShell = new EffectShell(canvasContainer, images);

items.forEach((item, index) => {
  item.addEventListener("click", e => onItemClicked(item, index));
});

function onItemClicked(item, index) {
  lightbox.setImageIndex(index);
  lightbox.setMeta(item.dataset.author);
  effectShell.setTextureIndex(index);
  lightbox.open();
  
  canvasContainer.style.display = "block";
  effectShell.onResize();
}
