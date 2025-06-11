// 时间和日期显示功能
function updateTime() {
    const now = new Date();
    
    // 更新时间
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;
    
    // 更新日期
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
    document.getElementById('date').textContent = `${month}-${day} ${weekday}`;
}

// 获取一言
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

// 初始化时间显示并每分钟更新一次
updateTime();
setInterval(updateTime, 60000);

// 初始化一言并每小时更新一次
fetchHitokoto();
setInterval(fetchHitokoto, 3600000);

// 搜索功能
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
let searchResultsVisible = false;

// 创建搜索结果容器
function createSearchResults() {
    // 检查是否已存在搜索结果容器
    let searchResults = document.getElementById('search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'search-results';
        
        // 将搜索结果容器插入到搜索栏和一言之间
        const searchBox = document.querySelector('.search-box');
        searchBox.parentNode.insertBefore(searchResults, document.querySelector('.hitokoto-container'));
    }
    return searchResults;
}

// 清除搜索结果
function clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchResultsVisible = false;
    }
}

// 执行搜索功能
function performSearch() {
    const query = searchBox.value.trim().toLowerCase();
    
    // 如果搜索框为空，清除搜索结果
    if (!query) {
        clearSearchResults();
        return;
    }
    
    // 创建或获取搜索结果容器
    const searchResults = createSearchResults();
    searchResults.innerHTML = ''; // 清空之前的结果
    
    // 获取所有应用元素
    const appItems = document.querySelectorAll('.app-item');
    let matchCount = 0;
    
    // 遍历所有应用，查找匹配项
    appItems.forEach(item => {
        const appName = item.querySelector('p').textContent.toLowerCase();
        
        // 检查应用名称是否包含搜索关键词
        if (appName.includes(query)) {
            matchCount++;
            
            // 创建搜索结果项
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            // 复制应用图标
            const iconClone = item.querySelector('.app-icon').cloneNode(true);
            
            // 创建应用名称元素
            const nameElem = document.createElement('p');
            nameElem.textContent = item.querySelector('p').textContent;
            
            // 添加到结果项中
            resultItem.appendChild(iconClone);
            resultItem.appendChild(nameElem);
            
            // 添加点击事件，点击搜索结果时模拟点击原应用
            resultItem.addEventListener('click', () => {
                item.click();
                clearSearchResults();
                searchBox.value = '';
            });
            
            // 添加到搜索结果容器
            searchResults.appendChild(resultItem);
        }
    });
    
    // 显示搜索结果或"无结果"提示
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

// 添加搜索按钮和回车事件监听
searchButton.addEventListener('click', performSearch);
searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 添加输入事件监听，实时搜索
searchBox.addEventListener('input', performSearch);

// 点击页面其他区域时隐藏搜索结果
document.addEventListener('click', (e) => {
    if (searchResultsVisible && 
        !e.target.closest('.search-box') && 
        !e.target.closest('#search-results')) {
        clearSearchResults();
    }
});

// 创建弹窗元素
function createToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
}

// 显示弹窗提示
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

// 应用点击功能和跳转链接
const appItems = document.querySelectorAll('.app-item');
const appLinks = {
    'bilibili': 'https://www.bilibili.com',
    'Jellyfin': 'https://jellyfin.org',
    'iKuai': 'https://www.ikuai8.com',
    'Navidrome': 'https://www.navidrome.org',
    'ubuntu': 'https://ubuntu.com',
    'VSCode': 'https://code.visualstudio.com',
    '讯息': '#',
    'windows': 'https://www.microsoft.com/windows',
    'WeChat': 'https://u.wechat.com/MKfJdmPyCBZB7Bb84ABiy0U?s=2',
    'QQ': 'https://im.qq.com',
    'OpenWRT': 'https://openwrt.org',
    'Blog': '#',
    'Portainer': 'https://www.portainer.io',
    'JD': 'https://www.jd.com',
    'PostgresqI': 'https://www.postgresql.org',
    'Sun-Panel': '#',
    'Nextcloud': 'https://nextcloud.com',
    'Nginx': 'https://nginx.org',
    'Docker': 'https://www.docker.com',
    'HomeAssistant': 'https://www.home-assistant.io'
};

appItems.forEach(item => {
    item.addEventListener('click', () => {
        const appName = item.querySelector('p').textContent;
        const appUrl = appLinks[appName] || '#';
        
        // 显示跳转提示
        showToast(`正在跳转到 ${appName}...`);
        
        // 延迟一小段时间后跳转，看到提示
        setTimeout(() => {
            window.open(appUrl, '_blank');
        }, 1200);
    });
});

console.log( "妈的法克!" );