// 语音朗读功能
function speak(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'zh-CN';
        
        // 获取可用的语音列表
        const voices = speechSynthesis.getVoices();
        
        // 优先选择中文语音，并且选择更柔和的声线
        let selectedVoice = null;
        for (const voice of voices) {
            if (voice.lang === 'zh-CN' && (voice.name.includes('Xiaoxiao') || voice.name.includes('Microsoft Yaoyao') || voice.name.includes('Google 中文'))) {
                selectedVoice = voice;
                break;
            }
        }
        
        // 如果没有找到指定的中文语音，使用默认语音
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        // 设置语音参数，使声音更柔和有感情
        utterance.rate = 0.9; // 语速稍慢
        utterance.pitch = 1.1; // 音调稍高
        utterance.volume = 0.9; // 音量适中
        
        speechSynthesis.speak(utterance);
    }
}

// 初始化语音列表
window.speechSynthesis.onvoiceschanged = function() {
    // 语音列表加载完成
};
