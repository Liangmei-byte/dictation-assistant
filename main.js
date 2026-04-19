// 全局变量
let words = [];
let currentIndex = 0;
let isRunning = false;

// 更新词语列表
function updateWordList() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';
    const inputWords = document.getElementById('words').value.split(' ').filter(word => word.trim() !== '');
    inputWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);
    });
}

// 打乱词语顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 下一个词语
function nextWord() {
    currentIndex++;
    
    if (currentIndex < words.length) {
        document.getElementById('currentStatus').textContent = '听写中';
        speak(words[currentIndex]);
        startTimer(nextWord);
    } else {
        document.getElementById('currentStatus').textContent = '听写完成！';
        document.getElementById('inputSection').style.display = 'block';
        document.getElementById('wordListContainer').style.display = 'block';
        document.getElementById('timer').style.display = 'none';
        saveDictationHistory(words);
        isRunning = false;
    }
}

// 开始听写
function startDictation() {
    if (isRunning) return;
    
    const inputWords = document.getElementById('words').value.split(' ').filter(word => word.trim() !== '');
    if (inputWords.length === 0) {
        alert('请输入要听写的词语！');
        return;
    }
    
    words = shuffleArray([...inputWords]);
    currentIndex = 0;
    isRunning = true;
    
    // 隐藏输入模块和词语列表，显示计时器
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('wordListContainer').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('currentStatus').textContent = '准备开始';
    
    // 播报准备开始
    speak('5秒钟后开始听写');
    
    // 5秒倒计时
    let countdown = 5;
    document.getElementById('timer').textContent = countdown;
    
    const preparationInterval = setInterval(() => {
        countdown--;
        document.getElementById('timer').textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(preparationInterval);
            // 开始听写
            document.getElementById('currentStatus').textContent = '听写中';
            speak(words[currentIndex]);
            startTimer(nextWord);
        }
    }, 1000);
}

// 停止听写
function stopDictation() {
    if (!isRunning) return;
    
    stopTimer();
    isRunning = false;
    document.getElementById('currentStatus').textContent = '已停止';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('wordListContainer').style.display = 'block';
}

// 重置听写
function resetDictation() {
    stopTimer();
    resetTimer();
    isRunning = false;
    currentIndex = 0;
    document.getElementById('currentStatus').textContent = '准备开始';
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('wordListContainer').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
}

// 显示历史记录
async function showHistory() {
    // 隐藏主界面，显示历史记录界面
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('status-section').style.display = 'none';
    document.getElementById('wordListContainer').style.display = 'none';
    document.getElementById('historySection').style.display = 'block';
    
    // 加载历史记录
    const history = await getDictationHistory();
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p>暂无历史记录</p>';
        return;
    }
    
    // 倒序显示历史记录（最新的在前）
    history.reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        // 格式化日期
        const date = new Date(item.createdAt || item.date).toLocaleDateString();
        historyItem.innerHTML = `
            <div class="date">${date}</div>
            <div class="words">${item.words.join(' ')}</div>
            <div class="count">共 ${item.count} 个词语</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// 显示主界面
function showMain() {
    // 隐藏历史记录界面，显示主界面
    document.getElementById('historySection').style.display = 'none';
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('status-section').style.display = 'block';
    document.getElementById('wordListContainer').style.display = 'block';
}

// 检查登录状态
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        const parsedUser = JSON.parse(user);
        document.getElementById('usernameDisplay').textContent = `欢迎，${parsedUser.username}`;
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
    } else {
        document.getElementById('usernameDisplay').textContent = '';
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('registerBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

// 登出
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
}

// 保存听写历史
async function saveDictationHistory(words) {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await fetch('http://localhost:5000/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ words })
            });
        } catch (error) {
            console.error('保存历史记录失败:', error);
            // 失败时使用本地存储作为备份
            saveHistory(words);
        }
    } else {
        // 未登录时使用本地存储
        saveHistory(words);
    }
}

// 获取听写历史
async function getDictationHistory() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('http://localhost:5000/api/history', {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取历史记录失败:', error);
            // 失败时使用本地存储
            return getHistory();
        }
    } else {
        // 未登录时使用本地存储
        return getHistory();
    }
}

// 初始化
function init() {
    // 检查登录状态
    checkAuth();
    // 加载设置
    const settings = getSettings();
    // 初始化词语列表
    updateWordList();
    // 监听输入变化
    document.getElementById('words').addEventListener('input', updateWordList);
}

// 页面加载完成后初始化
window.onload = init;
