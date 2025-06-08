import { readWallData } from './reading.js';
import { WallRenderer } from './create.js';

async function init() {
    try {
        // خواندن داده‌های دیوار
        const wallData = await readWallData();

        // ایجاد رندرر دیوار
        const wallRenderer = new WallRenderer();

        // ساخت دیوارها
        wallRenderer.createWalls(wallData);

    } catch (error) {
        console.error('خطا در راه‌اندازی برنامه:', error);
    }
}

init();
