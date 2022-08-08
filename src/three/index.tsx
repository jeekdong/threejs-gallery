// @ts-nocheck
import React, { useState } from 'react'
import ReactDom from 'react-dom'
import * as THREE from 'three'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Mesh,
  AmbientLight,
  TextureLoader,
  CubeTextureLoader,
  RepeatWrapping,
  DoubleSide,
  FrontSide,
  Clock
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// TODO: 这个库的问题
import { Interaction } from 'three.interaction/src/index';

import KeyEvent from './key-event'

import CameraControls from 'camera-controls';

// UI 部分
import { Button, Modal } from '@douyinfe/semi-ui';



CameraControls.install( { THREE: THREE } );

const IMAGE_URL = [
  'https://images.unsplash.com/photo-1555439878-0c9661247d7a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1601956409197-edfd9028c2ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1636719613501-e8e7d55ce5fc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1641495378215-b441708e20fb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1598886221171-8e62de2c4e35?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1605962567298-1b407a7e351d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzAwMDk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1531256164036-664c057227d7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzA3MDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1601956409343-a61004fff5cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzA3MzM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1588180856293-c3a249ea0f37?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzA3NjU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000',
  'https://images.unsplash.com/photo-1599908232382-6fdc239728f2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8dHx8fHx8fDE2NTkzNzA3ODU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1000'
]

let isViewWork = false
let first = true
const MAX_WORK_COUNT = IMAGE_URL.length
const IMG_LIST: {
  [key: string]: {
    mesh: any;
    imgUrl: any;
  }
} = {}


const loadTexture = () => {
  const textureLoader = new TextureLoader()

  return new Promise<any>((resolve, reject) => {
    textureLoader.load('assets/floor3.jpg', (texture) => {
      resolve(texture)
    })
  })
}
const loadWallTexture = () => {
  const textureLoader = new TextureLoader()

  return new Promise<any>((resolve, reject) => {
    textureLoader.load('assets/wall6.jpg', (texture) => {
      resolve(texture)
    })
  })
}

const loadWorkTexture = () => {
  const textureLoader = new TextureLoader()

  return new Promise<any>((resolve, reject) => {
    textureLoader.load(IMAGE_URL[Math.floor(Math.random() * MAX_WORK_COUNT)], (texture) => {
      resolve(texture)
    })
  })
}

const loadWorks = async () => {

  const workTexture: any[] = []
  for (let i = 0; i < MAX_WORK_COUNT; i++) {
    let texture = await loadWorkTexture()
    workTexture.push(texture)
  }
  return workTexture
}

const loadWorkTexture2 = () => {
  const textureLoader = new TextureLoader()

  return new Promise<any>((resolve, reject) => {
    textureLoader.load('https://images.unsplash.com/photo-1656936632107-0bfa69ea06de?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1000&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1OTI1ODk0MQ&ixlib=rb-1.2.1&q=80&w=1000', (texture) => {
      resolve(texture)
    })
  })
}

const loadSkyTexture = () => {
  const textureLoader = new CubeTextureLoader()

  return new Promise<any>((resolve, reject) => {
    textureLoader.load([
      'assets/right.jpg',
      'assets/left.jpg',
      'assets/top.jpg',
      'assets/bottom.jpg',
      'assets/front.jpg',
      'assets/back.jpg'
    ], (texture) => {
      resolve(texture)
    })
  })
}

function getCenterPoint(mesh) {
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = new THREE.Vector3();
  geometry.boundingBox.getCenter( center );
  mesh.localToWorld( center );
  return center;
}

export async function createThree() {
  const scene = new Scene()
  const camera = new PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
  )

  const renderer = new WebGLRenderer({
    // 设置抗锯齿
    antialias: true
  });
  renderer.setSize( window.innerWidth, window.innerHeight );

  const interaction = new Interaction(renderer, scene, camera);


  // const controls = new OrbitControls( camera, renderer.domElement )
  // controls.enableZoom = false
  // controls.update();
  const clock = new Clock();
  const cameraControls = new CameraControls( camera, renderer.domElement );
  window.cameraControls = cameraControls

  cameraControls.addEventListener('rest', () => {
    console.log('移动结束')
    cameraControls.setOrbitPoint(camera.position.x, camera.position.y - 0.0001, camera.position.z)
    if (isViewWork) {
      isViewWork = false
      document.getElementById('detail-container')!.style.display = 'block'
    } else {
      document.getElementById('detail-container')!.style.display = 'none'
    }
  })

  cameraControls.setLookAt(0, 3, 0, 0, 3, 1)

  const keyEvent = new KeyEvent(
    camera,
    cameraControls,
    document.getElementById('three-el')
  )
  


  const ambient = new AmbientLight(0xffffff)
  scene.add(ambient);

  let texture = await loadTexture()
  let wallTexture = await loadWallTexture()
  const skyTexture = await loadSkyTexture()

  const workTexture = await loadWorks()
  console.log(workTexture)

  scene.background = skyTexture

  const loader = new GLTFLoader();

  loader.load( 'assets/scene3.gltf', function ( gltf ) {
    gltf.scene.traverse(child => {
      if (child.name === 'floor') {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        // uv两个方向纹理重复数量
        texture.repeat.set(20, 20)
        child.material = new MeshLambertMaterial({ 
          map: texture
        })
        child.material.roughness = 0.5
        child.material.metalness = 0.6
      } else if(child.name === 'qiang') {
        wallTexture.wrapS = RepeatWrapping;
        wallTexture.wrapT = RepeatWrapping;
        // uv两个方向纹理重复数量
        wallTexture.repeat.set(100, 40)
        child.material = new MeshLambertMaterial({ 
          map: wallTexture
        })
        child.material.roughness = 0.5
        child.material.metalness = 0.6
        console.log('qiang', child)
      } else if (child.name.includes('work')) {
        child.children[1].rotateZ ( Math.PI )
        child.children[1].translateX(-0.02)
        child.on('click', (ev) => {
          let target = ev.target

          console.log('target', target)
          cameraControls.fitToBox( target , true, { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 } )
          cameraControls.rotateAzimuthTo(Math.PI / 2 + target.rotation.z, true)
          isViewWork = true
        })
        console.log(child.children[1])
        if (child.children && child.children[0]) {
          let index = Math.floor(Math.random() * MAX_WORK_COUNT)
          // 存储
          IMG_LIST[child.name] = {
            mesh: child,
            imgUrl: workTexture[index].image
          }
          workTexture[index].wrapS = RepeatWrapping;
          workTexture[index].wrapT = RepeatWrapping;
          workTexture[index].rotation = Math.PI
          // uv两个方向纹理重复数量
          workTexture[index].repeat.set(1, 1)
          child.children[1].material = new MeshBasicMaterial({ 
            map: workTexture[index],
            side: FrontSide
          })
          // child.children[1].material.roughness = 0.5
          // child.children[1].material.metalness = 0.6
        }
      }
    })
    createUI(IMG_LIST, cameraControls)
    scene.add( gltf.scene )
  }, undefined, function ( error ) {
    console.error( error );
  });

  function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    cameraControls.update( delta );
    keyEvent.update( delta )
    renderer.render( scene, camera );
  }

  const app = document.getElementById('three-el')
  if (app) {
    if (WebGL.isWebGLAvailable()) {
      // Initiate function or other initializations here
      animate();
      app.appendChild(renderer.domElement)
    } else {
      const warning = WebGL.getWebGLErrorMessage();
      app.appendChild(warning);
    }
  }
}

const createUI = (imgObj, cameraControls) => {
  console.log(imgObj)
  return (
    ReactDom.render(
      <div className="ui-container" style={{
        position: 'fixed',
        bottom: '8px',
        height: '110px',
        display: 'flex', 
        width: '100vw',
        overflowX: 'scroll'
      }}>
        {
          Object.keys(imgObj).map((item) => {
            return (
              <img 
                style={{
                  width: '100px', 
                  height: '100px',
                  marginLeft: '10px',
                  cursor: 'pointer'
                }} 
                src={imgObj[item].imgUrl.currentSrc} 
                onClick={() => {
                  cameraControls.fitToBox( imgObj[item].mesh , true, { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 } )
                  cameraControls.rotateAzimuthTo(Math.PI / 2 + imgObj[item].mesh.rotation.z, true)
                  isViewWork = true
                }}
              />
            )
          })
        }
      </div>
    , document.getElementById('ui-container'))
  )
}

export function CreateDetailUI() {
  const [visible, setVisible] = useState(false)
  return (
      <div style={{ 
        position: 'fixed',
        top: '40px',
        width: '100vw',
        textAlign: 'center',
      }}>
        <Button theme="solid" type="primary" size="large" onClick={() => {setVisible(true)}}>查看详情</Button>
        <Modal
          visible={visible}
          title="作品详情"
          onOk={() => {setVisible(false)}}
          onCancel={() => {setVisible(false)}}
          maskClosable={false}
          style={{
            maxWidth: '90vw'
          }}
        >
          <iframe
            src="https://www.lofter.com/cms/147056/jhy.html"
            width={375}
            height={450}
          ></iframe>
        </Modal>
      </div>
    )
}

function destroyDetailUI() {
  ReactDom.unmountComponentAtNode(document.getElementById('detail-container')!)
}