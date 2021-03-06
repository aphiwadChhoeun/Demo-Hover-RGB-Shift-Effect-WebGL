import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import RGBShift from '../shader/RGBShift.glsl';

// EFFECT SHELL
export default class EffectShell {
  constructor(container, images = []) {
    this.container = container;
    this.images = images;
    this.textures = [];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.viewport.aspectRatio,
      1,
      1000
    );
    this.camera.position.z = 6;

    this.effectPosition = {
      x: 0,
      y: 0,
    };
    this.mousePosition = {
      x: 0,
      y: 0,
    };
    this.mouseSpeed = {
      x: 0.0,
      y: 0.0,
    };

    window.addEventListener("resize", this.onResize.bind(this));
    document.addEventListener("mousemove", (e) => {
      this.onMouseMove(e);
    });

    this.loadTextures();
  }

  loadTextures() {
    let textureLoader = new THREE.TextureLoader();
    this.images.forEach((image) => {
      let texture = textureLoader.load(image.getAttribute("src"));
      this.textures.push(texture);
    });

    this.onTexturesLoaded();
  }

  onTexturesLoaded() {
    console.log("textures loaded");
    let geometry = new THREE.PlaneBufferGeometry(
      800 * (this.viewSize.width / this.viewport.width),
      520 * (this.viewSize.height / this.viewport.height),
      32,
      32
    );
    let material = new THREE.MeshBasicMaterial({ map: this.textures[0] });
    this.plane = new THREE.Mesh(geometry, material);

    this.scene.add(this.plane);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.uniforms = {
      tDiffuse: {
        value: null,
      },
      uAmount: {
        value: 0.02,
      },
      uMouse: {
        value: new THREE.Vector2(0.5, 0.5),
      },
      uTime: {
        value: 0.0
      }
    };
    let vertexShader = `
        varying vec2 vUv;
  
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1.0 );
        }
      `;
    let fragmentShader = RGBShift;
    this.effectPass = new ShaderPass({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.effectPass.renderToScreen = true;
    this.composer.addPass(this.effectPass);

    this.animate();
  }

  setTextureIndex(index) {
    this.plane.material.map = this.textures[index];
    this.plane.material.map.needsUpdate = true;
    this.render();
  }

  render() {
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }

  animate() {
    this.mouseSpeed.x = (this.mousePosition.x - this.effectPosition.x) * 0.08;
    this.mouseSpeed.y = (this.mousePosition.y - this.effectPosition.y) * 0.08;

    this.effectPass.uniforms.uMouse.value.x = this.effectPosition.x / this.viewport.width;
    this.effectPass.uniforms.uMouse.value.y = 1.- this.effectPosition.y / this.viewport.height;

    this.effectPosition.x += this.mouseSpeed.x;
    this.effectPosition.y += this.mouseSpeed.y;

    this.render();

    requestAnimationFrame(this.animate.bind(this));
  }

  onResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  onMouseMove(e) {
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;

    // console.log(this.effectPass.uniforms.uMouse.value);
  }

  get viewport() {
    let width = this.container.clientWidth;
    let height = this.container.clientHeight;
    let aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  get viewSize() {
    // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

    let distance = this.camera.position.z;
    let vFov = (this.camera.fov * Math.PI) / 180;
    let height = 2 * Math.tan(vFov / 2) * distance;
    let width = height * this.viewport.aspectRatio;
    return { width, height, vFov };
  }
}
