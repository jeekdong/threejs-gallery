import * as THREE from 'three';
import CameraControls from 'camera-controls'

class KeyEvent {
  camera: THREE.Camera;
  cameraControls: CameraControls;
  domElement: HTMLElement;
  forward: boolean = false;
  back: boolean = false;
  left: boolean = false;
  right: boolean = false;
  speed = 5;

  constructor(
    camera: any,
    cameraControls: any,
    domElement: any,
  ) {
    this.camera = camera;
    this.cameraControls = cameraControls;
    this.domElement = domElement;
    this.initEvent()
  }

  initEvent() {
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'KeyW') {
      this.forward = true;
    } else if (event.code === 'KeyS') {
      this.back = true;
    } else if (event.code === 'KeyA') {
      this.left = true;
    } else if (event.code === 'KeyD') {
      this.right = true;
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'KeyW') {
      this.forward = false;
    } else if (event.code === 'KeyS') {
      this.back = false;
    } else if (event.code === 'KeyA') {
      this.left = false;
    } else if (event.code === 'KeyD') {
      this.right = false;
    }
  }

  update = (delta: number) => {
    if (this.forward) {
      this.cameraControls.forward(delta * this.speed, true)
    }
    if (this.back) {
      this.cameraControls.forward(-delta * this.speed, true)
    }
    if (this.left) {
      this.cameraControls.truck(-delta * this.speed, 0, true)
    }
    if (this.right) {
      this.cameraControls.truck(delta * this.speed, 0, true)
    }
  }
}
export default KeyEvent;