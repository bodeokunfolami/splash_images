const dropArea = document.querySelector('#drop-area');
const fileInput = document.querySelector('#id_file');
const progress = document.querySelector('.progress');

const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal-body');
const imgPreview = document.querySelector('.preview');
const gallary = document.querySelector('.gallary');

const directionLeft = document.querySelector('.direction.left');
const directionRight = document.querySelector('.direction.right');

const imgs = document.querySelectorAll('.img');

const imgArray = [];

imgs.forEach(img => {
    const url = `${window.location.origin}/${img.dataset.src}`
    imgArray.push(url);
});

function onImgClick(e) {
    imgPreview.src = e.target.dataset.src;
    modal.classList.remove('dis-none');
}

function outsideClick(e) {
    if (e.target == modal) {
        modal.classList.add('dis-none');
    }
}

function onDirectionLeftClick(e) {
    const prevIndex = imgArray.indexOf(imgPreview.src) - 1;
    if (prevIndex < 0) return;
    const src = imgArray[prevIndex]
    imgPreview.src = src;
}

function onDirectionRightClick(e) {
    const nextIndex = imgArray.indexOf(imgPreview.src) + 1;
    if (nextIndex > imgArray.length - 1) return;
    const src = imgArray[nextIndex]
    imgPreview.src = src;
}

function createPlaceholderElement() {
    const column = document.createElement('div');
    const div = document.createElement('div');
    column.className = 'column'
    div.className = 'placeholder';
    column.appendChild(div);
    return column;
}

function createDivColumn(thumbnailUrl, url) {
    const divColumn = document.createElement('div');
    const img = document.createElement('img');

    divColumn.className = "column";
    img.className = "img";

    img.src = thumbnailUrl;

    img.setAttribute('data-src', url);

    img.addEventListener('click', onImgClick);

    divColumn.append(img);

    return divColumn;
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleFileDrop(e) {
    const file = e.dataTransfer.files[0];
    uploadFile(file);
}

async function uploadFile(file) {
    let percent;

    const formData = new FormData();
    formData.append('file', file);

    const config = {
        onUploadProgress: (progressEvent) => {
            percent = progressEvent.loaded * 100 / progressEvent.total;
            progress.style.width = `${percent}%`;
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    try {
        const response = await axios.post('/api/upload', formData, config);
        const filename = response.data.filename;

        const placeholderElement = createPlaceholderElement();

        if (progress.style.width === "100%") {
            progress.style.width = 0;
            gallary.prepend(placeholderElement);
        };

        const thumbnail = await axios.get(`/api/thumbnail?filename=${filename}&path=/public/assets/${filename}`)
        const url = `${window.location.origin}/static/assets/${filename}`
        const thumbnailUrl = `${window.location.origin}/static/assets/${thumbnail.data.filename}`

        const divColumn = createDivColumn(thumbnailUrl, url);

        divColumn.firstChild.onload = () => {
            gallary.replaceChild(divColumn, placeholderElement);
            imgArray.unshift(url);
        }


    } catch (err) {
        console.log(err);
    }

}

fileInput.addEventListener('change', (e) => uploadFile(e.target.files[0]));

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults);
});

imgs.forEach((img) => {
    img.addEventListener('click', onImgClick);
});

directionLeft.addEventListener('click', onDirectionLeftClick);
directionRight.addEventListener('click', onDirectionRightClick);

dropArea.addEventListener('drop', handleFileDrop);

window.addEventListener('click', outsideClick);