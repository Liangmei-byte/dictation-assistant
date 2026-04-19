// 本地存储功能
function saveSettings(settings) {
    localStorage.setItem('dictationSettings', JSON.stringify(settings));
}

function getSettings() {
    const settings = localStorage.getItem('dictationSettings');
    return settings ? JSON.parse(settings) : {
        interval: 10,
        voice: 'zh-CN',
        theme: 'light'
    };
}

function saveHistory(words) {
    const history = getHistory();
    history.push({
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        words: words,
        count: words.length
    });
    localStorage.setItem('dictationHistory', JSON.stringify(history));
}

function getHistory() {
    const history = localStorage.getItem('dictationHistory');
    return history ? JSON.parse(history) : [];
}
