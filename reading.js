const fs = require('fs').promises;
const path = require('path');

async function readWallData() {
    try {
        const filePath = path.join(__dirname, 'wall.json');
        const jsonData = await fs.readFile(filePath, 'utf8');
        const wallData = JSON.parse(jsonData);

        // اعتبارسنجی داده‌های ورودی
        validateWallData(wallData);

        // محاسبه اطلاعات اضافی برای هر دیوار
        return processWallData(wallData);
    } catch (error) {
        console.error('خطا در خواندن فایل wall.json:', error);
        throw error;
    }
}

function validateWallData(wallData) {
    if (!wallData || !wallData.walls || !Array.isArray(wallData.walls)) {
        throw new Error('ساختار فایل JSON نامعتبر است');
    }

    wallData.walls.forEach((wall, index) => {
        if (!wall.start || !wall.end || 
            typeof wall.start.x !== 'number' || 
            typeof wall.start.y !== 'number' ||
            typeof wall.end.x !== 'number' ||
            typeof wall.end.y !== 'number') {
            throw new Error(`دیوار شماره ${index + 1} دارای مختصات نامعتبر است`);
        }
    });
}

function processWallData(wallData) {
    // اضافه کردن اطلاعات محاسبه شده برای هر دیوار
    wallData.walls = wallData.walls.map((wall, index) => {
        return {
            ...wall,
            id: index + 1,
            length: calculateWallLength(wall),
            angle: calculateWallAngle(wall)
        };
    });

    return wallData;
}

function calculateWallLength(wall) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateWallAngle(wall) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
}

module.exports = {
    readWallData
};
