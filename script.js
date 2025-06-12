// 更新时间与日期
function updateTime() {
    const now = new Date();

    // 格式化时间
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;

    // 格式化日期
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    document.getElementById('date').textContent = `${month}-${day} ${weekday}`;
}

// 获取 Hitokoto 一言
function fetchHitokoto() {
    fetch('https://v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
            document.getElementById('hitokoto-text').textContent = data.hitokoto;
            if (data.from_who) {
                document.getElementById('hitokoto-from').textContent = `—— ${data.from_who}「${data.from}」`;
            } else {
                document.getElementById('hitokoto-from').textContent = `—— 「${data.from}」`;
            }
        })
        .catch(error => {
            console.error('获取一言失败:', error);
            document.getElementById('hitokoto-text').textContent = '人生如逆旅，我亦是行人。';
            document.getElementById('hitokoto-from').textContent = '—— 苏轼';
        });
}

// 初始化时间与定时更新
updateTime();
setInterval(updateTime, 60000);

// 初始化一言与定时更新
fetchHitokoto();
setInterval(fetchHitokoto, 3600000);

// 移动微信图标到最前面
window.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.querySelector('.app-grid');
    const wechatItem = Array.from(document.querySelectorAll('.app-item')).find(item =>
        item.querySelector('p')?.textContent === '微信'
    );
    if (wechatItem && appGrid) {
        appGrid.prepend(wechatItem);
    }
});

// 搜索功能实现
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
let searchResultsVisible = false;

function createSearchResults() {
    let searchResults = document.getElementById('search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'search-results';

        const searchBoxContainer = document.querySelector('.search-box');
        searchBoxContainer.parentNode.insertBefore(searchResults, document.querySelector('.hitokoto-container'));
    }
    return searchResults;
}

function clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchResultsVisible = false;
    }
}

function performSearch() {
    const query = searchBox.value.trim().toLowerCase();
    if (!query) {
        clearSearchResults();
        return;
    }

    const searchResults = createSearchResults();
    searchResults.innerHTML = '';
    const appItems = document.querySelectorAll('.app-item');
    let matchCount = 0;

    appItems.forEach(item => {
        const appName = item.querySelector('p')?.textContent.toLowerCase();
        if (appName && appName.includes(query)) {
            matchCount++;

            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';

            const iconClone = item.querySelector('.app-icon').cloneNode(true);
            const nameElem = document.createElement('p');
            nameElem.textContent = item.querySelector('p').textContent;

            resultItem.appendChild(iconClone);
            resultItem.appendChild(nameElem);

            resultItem.addEventListener('click', () => {
                item.click();
                clearSearchResults();
                searchBox.value = '';
            });

            searchResults.appendChild(resultItem);
        }
    });

    if (matchCount > 0) {
        searchResults.style.display = 'block';
        searchResultsVisible = true;
    } else {
        const noResult = document.createElement('div');
        noResult.className = 'no-result';
        noResult.textContent = '未找到匹配的应用';
        searchResults.appendChild(noResult);
        searchResults.style.display = 'block';
        searchResultsVisible = true;
    }
}

searchButton.addEventListener('click', performSearch);
searchBox.addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch();
});
searchBox.addEventListener('input', performSearch);

document.addEventListener('click', e => {
    if (
        searchResultsVisible &&
        !e.target.closest('.search-box') &&
        !e.target.closest('#search-results')
    ) {
        clearSearchResults();
    }
});

// 创建 Toast 提示
function createToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
}

function showToast(message, duration = 2000) {
    const toast = createToast();
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// 应用点击处理逻辑
const appItems = document.querySelectorAll('.app-item');

appItems.forEach(item => {
    item.addEventListener('click', () => {
        const nameElem = item.querySelector('p');
        if (!nameElem) return;

        const appName = nameElem.textContent.trim().toLowerCase();

        // 特别处理“微信”
        if (appName === '微信' || appName.includes('wechat')) {
            $('#wechatModal').modal('show');
            return;
        }

        // 默认提示
        showToast(`您点击了 ${nameElem.textContent}`);
    });
});

// 模拟 Bootstrap 模态框行为（备用方案）
function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// 绑定关闭按钮
document.querySelector('#wechatModal .close')?.addEventListener('click', () => {
    hideModal('wechatModal');
});

// 点击遮罩层关闭
document.getElementById('wechatModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        hideModal('wechatModal');
    }
});