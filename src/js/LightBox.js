import { gsap } from "gsap";

// LIGHTBOX
export default class LightBox {
  constructor(wrapper, images = []) {
    this.wrapper = wrapper;
    this.images = images;
    this.container = this.wrapper.querySelector(".lightbox__item");
    this.metaContainer = this.wrapper.querySelector('.lightbox__meta');
    this.backdrop = this.wrapper.querySelector(".backdrop");

    this.init();
  }

  init() {
    this.backdrop.addEventListener("click", (e) => {
      this.close();
    });
  }

  setImage(image) {
    this.container.innerHTML = '';
    this.image = image.cloneNode();
    this.container.appendChild(this.image);
  }

  setMeta(text) {
    this.metaContainer.innerHTML = `taken by ${text}`;
  }

  setImageIndex(index) {
    this.index = index;
    this.setImage(this.images[index]);
  }

  open() {
    this.wrapper.style.zIndex = "0";
    gsap.fromTo(
      this.wrapper.style,
      {
        opacity: 0.0,
      },
      {
        opacity: 1.0,
        duration: 0.5,
        ease: "power4.out",
      }
    );
  }

  close() {
    gsap.fromTo(
      this.wrapper.style,
      {
        opacity: 1.0,
      },
      {
        opacity: 0.0,
        duration: 0.5,
        ease: "power4.out",
        onComplete: () => {
          this.wrapper.style.zIndex = "-1";
        },
      }
    );
  }
}
