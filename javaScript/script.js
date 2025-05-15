
const popup = document.querySelector('#popup');
const popupContent = document.querySelector('#popup-content');
const popupImage = document.querySelector('#popup-image');
const popupText = document.querySelector('#popup-text');
const dom = document.querySelector('svg');

// 初始化 popupNames
const popupNames = document.createElement('div');
popupNames.id = 'popupNames';
popupText.parentElement.appendChild(popupNames);

// 存储 JSON 数据
let mapData = {};

// 加载 JSON 数据
async function loadMapData() {
    try {
        // 修改为相对路径
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error('无法加载数据文件');
        mapData = await response.json();
        console.log('数据加载成功:', mapData); // 添加这行来调试
    } catch (error) {
        console.error('加载数据失败:', error);
        mapData = {}; // 提供空对象作为 fallback
    }
}
// 初始化时加载数据
loadMapData().then(() => {
    dom.addEventListener('mouseover', (e) => {
        if (['海洋', '国界', '省界'].includes(e.target.id)) {
            return;
        }
        e.target.style.fill = '#3b7efc';

        // 设置弹窗内容：文本和图片
        const id = e.target.id || '';
        const data = mapData[id] || { names: ['无数据'], image: null };
        popupText.innerText = `${id}`;
        console.log(e.screenX, e.screenY, mapData[id] || { names: ['无数据'], image: null });

        // 生成名称列表
        popupNames.innerHTML = '';
        const nameList = document.createElement('ul');
        data.names.forEach(name => {
            const li = document.createElement('li');
            li.innerText = name;
            nameList.appendChild(li);
        });
        popupNames.appendChild(nameList);

        if (data.image) {
            popupImage.src = data.image;
            popupImage.style.display = 'block';
        } else {
            popupImage.style.display = 'none';
            popupImage.src = '';
        }

        // 设置弹窗位置，偏移量为 5px
        const offsetX = 5, offsetY = 5;
        const maxX = window.innerWidth - popup.offsetWidth;
        const maxY = window.innerHeight - popup.offsetHeight;
        popup.style.left = `${Math.min(e.clientX + offsetX, maxX)}px`;
        popup.style.top = `${Math.min(e.clientY + offsetY, maxY)}px`;
        popup.style.display = 'block';
    });
});
dom.addEventListener('mouseout', (e) => {
    if (['海洋', '国界', '省界'].includes(e.target.id)) {
        return;
    }
    e.target.style.fill = '#eee';
    popup.style.display = 'none';
});