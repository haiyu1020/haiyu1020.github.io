const popup = document.querySelector('#popup');
const popupContent = document.querySelector('#popup-content');
const popupImage = document.querySelector('#popup-image');
const popupText = document.querySelector('#popup-text');
const dom = document.querySelector('svg');

dom.addEventListener('mouseover', (e) => {
    if (['海洋', '国界', '省界'].includes(e.target.id)) {
        return;
    }
    e.target.style.fill = '#3b7efc';
    console.log(e.screenX, e.screenY);

    // 设置弹窗内容：文本和图片
    const id = e.target.id || '无名称';
    const name = e.target.dataset.name || '无数据';
    const image = e.target.dataset.image;
    popupText.innerText = `${id} (${name})`;
    if (image) {
        popupImage.src = image;
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
    e.target.style.fill = '#eee';
    popup.style.display = 'none';
});