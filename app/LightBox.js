import { gsap } from "gsap";

// LIGHTBOX
export default class LightBox {
  constructor(wrapper, images = []) {
    this.wrapper = wrapper;
    this.images = images;
    this.container = this.wrapper.querySelector(".lightbox__item");
    this.metaContainer = this.container.querySelector('.meta');
    this.backdrop = this.wrapper.querySelector(".backdrop");
    this.closeBtn = this.wrapper.querySelector(".lightbox__close");

    this.init();
  }

  init() {
    this.backdrop.addEventListener("click", (e) => {
      this.close();
    });

    this.closeBtn.addEventListener("click", (e) => {
      this.close();
    });
  }

  setImage(image) {
    if (this.image) {
      this.container.removeChild(this.image);
    }
    this.image = image.cloneNode();
    this.container.insertBefore(this.image, this.metaContainer);
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
