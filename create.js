import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class WallRenderer {
    constructor() {
        // تنظیمات اولیه Three.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xf0f0f0); // رنگ پس‌زمینه خاکستری روشن
        document.body.appendChild(this.renderer.domElement);

        // اضافه کردن کنترل‌های دوربین
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // تنظیم موقعیت اولیه دوربین
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // اضافه کردن نور محیطی
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // اضافه کردن نور جهت‌دار
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);

        // اضافه کردن گرید راهنما
        const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x444444);
        this.scene.add(gridHelper);

        // شروع حلقه رندر
        this.animate();

        // مدیریت تغییر سایز پنجره
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    createWalls(wallData) {
        try {
            wallData.walls.forEach(wall => {
                this.createWall(wall);
            });
        } catch (error) {
            console.error('خطا در ایجاد دیوارها:', error);
            throw error;
        }
    }

    createWall(wall) {
        // محاسبه طول و جهت دیوار
        const start = new THREE.Vector3(wall.start.x, 0, wall.start.y);
        const end = new THREE.Vector3(wall.end.x, 0, wall.end.y);
        const wallLength = start.distanceTo(end);

        // ایجاد geometry دیوار
        const wallGeometry = new THREE.BoxGeometry(wallLength, 10, 0.5); // ارتفاع دیوار 10 واحد
        const wallMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xcccccc,
            flatShading: true
        });

        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

        // چرخش و موقعیت‌دهی دیوار
        const direction = end.sub(start).normalize();
        const angle = Math.atan2(direction.z, direction.x);
        wallMesh.rotation.y = angle;

        // تنظیم موقعیت دیوار
        wallMesh.position.set(
            (wall.start.x + wall.end.x) / 2,
            5, // نصف ارتفاع دیوار
            (wall.start.y + wall.end.y) / 2
        );

        this.scene.add(wallMesh);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

export { WallRenderer };
