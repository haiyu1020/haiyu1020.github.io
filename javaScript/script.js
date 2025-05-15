
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

// 加载 JSON 数据并设置默认颜色
async function loadMapData() {
    try {
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error('无法加载数据文件');
        mapData = await response.json();
        console.log('数据加载成功:', mapData);

        // 设置默认颜色
        const paths = dom.querySelectorAll('path');
        paths.forEach(path => {
            const id = path.id;
            if (['海洋', '国界', '省界'].includes(id)) {
                path.style.fill = '#eee'; // 特殊区域默认颜色
                return;
            }
            const data = mapData[id] || { names: ['无数据'] };
            const hasValidNames = data.names && data.names.length > 0 && !(data.names.length === 1 && data.names[0] === '无数据');
            const defaultFill = hasValidNames ? '#ff69b4' : '#eee';
            path.style.fill = defaultFill;
            path.dataset.defaultFill = defaultFill; // 存储默认颜色
        });
    } catch (error) {
        console.error('加载数据失败:', error);
        mapData = {};
        // 如果数据加载失败，所有 path 使用默认颜色
        dom.querySelectorAll('path').forEach(path => {
            path.style.fill = '#eee';
            path.dataset.defaultFill = '#eee';
        });
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

        if (data.image && /\.(jpg|png|gif)$/i.test(data.image)) {
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
    dom.addEventListener('mouseout', (e) => {
    if (['海洋', '国界', '省界'].includes(e.target.id)) {
        return;
    }
    e.target.style.fill = e.target.dataset.defaultFill || '#eee';
    popup.style.display = 'none';
});
});
