/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const app = document.getElementById('app') as HTMLDivElement;
const API_KEY = process.env.API_KEY;

// Dil çevirileri
const translations = {
    tr: {
        mainTitle: "Duygudurum Farkındalığı",
        welcomeMessage: "Merhaba🌸",
        reportTitle: "Analiz Rapon",
        preRatingQuestion: "Sosyal medya kullanmadan önce nasıl hissettiğini yanıtlar mısın?",
        ratingScale: "1 (Çok Kötü) - 10 (Çok İyi)",
        timerTitle: "Sosyal Medyada Geçirdiğin Süre",
        totalTime: "Toplam Süre:",
        minutes: "dakika",
        startButton: "Başlat",
        stopButton: "Durdur",
        saveButton: "Kaydet",
        resetButton: "Sıfırla",
        postRatingQuestion: "Sosyal medyadan sonra kendini nasıl hissediyorsun?",
        feelingsQuestion: "Sosyal medyada geçirdiğin süre boyunca nasıl hissettin?",
        feelingsPlaceholder: "İçini dök...",
        contentQuestion: "Aklında kalan içerikler nelerdi? Sana nasıl hissettirdiler?",
        contentPlaceholder: "Örn: Komik bir video, ilham verici bir paylaşım...",
        adsQuestion: "Aklında kalan reklamlar veya tanıtımlar var mı? Bunlar seni etkiledi mi?",
        adsPlaceholder: "Örn: Bir ürün reklamı, bir kampanya...",
        getReportButton: "Rapor Al",
        emotionalImpactTitle: "Duygusal Etki Hesabı",
        impactNegative: "negatif",
        impactPositive: "pozitif",
        impactNeutral: "nötr",
        impactSuffix: "etki",
        reportSummary: "Başlamadan önce <strong>{pre}</strong> modundaydın, sosyal medyada <strong>{time}</strong> dakika geçirdin ve şu anda <strong>{post}</strong> modundasın.",
        aiAnalysisTitle: "AI Yorum ve Öneriler",
        breathingExerciseTitle: "Rahatlama Egzersizi: 4-7-8 Tekniği",
        breathingExerciseDesc: "Zihnini sakinleştirmek ve ana dönmek için bu basit nefes egzersizini deneyebilirsin.",
        breathingStart: "Başla",
        breathingStop: "Durdur",
        breathingInhale: "Nefes Al...",
        breathingHold: "Tut...",
        breathingExhale: "Nefes Ver...",
        downloadReportButton: "Raporu İndir (.txt)",
        newAnalysisButton: "Yeni Analiz Başlat",
        apiError: "Üzgünüm, şu anda bir sorun oluştu ve raporunu oluşturamadım. Lütfen daha sonra tekrar dene.",
        downloadFileName: "duygudurum-raporu.txt",
        txtReportTitle: "Duygudurum Farkındalığı Raporu",
        txtReportOverview: "GENEL BAKIŞ",
        txtReportPreMood: "- Başlangıç Modu:",
        txtReportPostMood: "- Bitiş Modu:",
        txtReportTotalTime: "- Toplam Süre:",
        txtReportImpact: "- Duygusal Etki:",
        txtReportYourNotes: "SENİN NOTLARIN",
        txtReportFeelings: "- Kullanım Sırasındaki Hissiyatın:",
        txtReportContent: "- Aklında Kalan İçerikler ve Etkileri:",
        txtReportAds: "- Aklında Kalan Reklamlar ve Etkileri:",
        txtReportNotSpecified: "Belirtilmedi.",
        txtReportAiAnalysis: "YAPAY ZEKA ANALİZİ VE ÖNERİLERİ",
        aiPrompt: `
    Bir sosyal medya farkındalık asistanı olarak, aşağıdaki verileri analiz et ve kullanıcıya birinci tekil şahıs ağzından ("Seni anlıyorum", "Gördüğüm kadarıyla..." gibi) empatik ve yol gösterici bir rapor sun. Cevabında markdown kullanarak başlıkları **kalın** yap.

    **Kullanıcı Verileri:**
    - Sosyal Medya Öncesi Mod Puanı (1-10): {oncesi_mod_puani}
    - Sosyal Medya Sonrası Mod Puanı (1-10): {sonrasi_mod_puani}
    - Sosyal Medyada Geçirilen Toplam Süre (dakika): {totalMinutesForReport}
    - Kullanım Sırasındaki Hissiyatı: "{duygu_yazisi}"
    - Aklında Kalan İçerikler ve Etkileri: "{icerik_yazisi}"
    - Aklında Kalan Reklamlar ve Etkileri: "{reklam_yazisi}"

    **Rapor İçeriği:**
    1.  **Giriş:** "Merhaba, verilerini inceledim ve senin için bir analiz hazırladım. Gördüğüm kadarıyla..." gibi bir girişle başla.
    2.  **Duygusal Değişim Analizi:** Mod puanlarındaki değişimi yorumla. Bu değişimin, kullanıcının yazdığı metinlerle (hisler, içerikler) nasıl ilişkili olabileceğini tahmin et. Örneğin, "Mod puanının düşmesi, belki de gördüğün X içeriğinin seni etkilemesinden kaynaklanıyor olabilir." gibi.
    3.  **İçerik Etkisi:** Kullanıcının bahsettiği içeriklerin duygusal durumuna olası etkilerini belirt.
    4.  **Reklam Uyarısı:** Eğer reklamlardan bahsedilmişse, "Bu reklamların ilgini çekmesi normal, ancak bu ürünü gerçekten isteyip istemediğine karar vermek için kendine zaman tanımanı öneririm." gibi nazik bir uyarı ekle.
    5.  **Nötrleyici Öneriler:** Duygusal durumu dengelemek için 2-3 adet somut ve uygulanabilir öneri sun. Örnekler: "Şimdi birkaç dakika derin nefes egzersizi yapmaya ne dersin?", "Ekrandan uzaklaşıp kısa bir yürüyüş yapmak sana iyi gelebilir.", "Sevdiğin, sakinleştirici bir müziği açabilirsin."
    6.  **Kapanış:** Destekleyici ve pozitif bir cümleyle bitir.
    
    Lütfen cevabı sadece bu analizi içerecek şekilde, düz metin olarak, paragraflar arasında bir satır boşluk bırakarak oluştur. Samimi, anlayışlı ama yol gösterici ol.
    `,
    },
    en: {
        mainTitle: "Mood Awareness",
        welcomeMessage: "Hello🌸",
        reportTitle: "Your Analysis Report",
        preRatingQuestion: "Could you answer how you feel before using social media?",
        ratingScale: "1 (Very Bad) - 10 (Very Good)",
        timerTitle: "Time Spent on Social Media",
        totalTime: "Total Time:",
        minutes: "minutes",
        startButton: "Start",
        stopButton: "Stop",
        saveButton: "Save",
        resetButton: "Reset",
        postRatingQuestion: "How do you feel after using social media?",
        feelingsQuestion: "How did you feel during your time on social media?",
        feelingsPlaceholder: "Let it all out...",
        contentQuestion: "What content stuck with you? How did it make you feel?",
        contentPlaceholder: "e.g., A funny video, an inspiring post...",
        adsQuestion: "Are there any ads or promotions you remember? Did they affect you?",
        adsPlaceholder: "e.g., A product ad, a campaign...",
        getReportButton: "Get Report",
        emotionalImpactTitle: "Emotional Impact Calculation",
        impactNegative: "negative",
        impactPositive: "positive",
        impactNeutral: "neutral",
        impactSuffix: "impact",
        reportSummary: "You were in a <strong>{pre}</strong> mood before you started, spent <strong>{time}</strong> minutes on social media, and are now in a <strong>{post}</strong> mood.",
        aiAnalysisTitle: "AI Comments and Suggestions",
        breathingExerciseTitle: "Relaxation Exercise: 4-7-8 Technique",
        breathingExerciseDesc: "You can try this simple breathing exercise to calm your mind and return to the present moment.",
        breathingStart: "Start",
        breathingStop: "Stop",
        breathingInhale: "Inhale...",
        breathingHold: "Hold...",
        breathingExhale: "Exhale...",
        downloadReportButton: "Download Report (.txt)",
        newAnalysisButton: "Start New Analysis",
        apiError: "Sorry, an error occurred and I couldn't generate your report. Please try again later.",
        downloadFileName: "mood-awareness-report.txt",
        txtReportTitle: "Mood Awareness Report",
        txtReportOverview: "OVERVIEW",
        txtReportPreMood: "- Starting Mood:",
        txtReportPostMood: "- Ending Mood:",
        txtReportTotalTime: "- Total Time:",
        txtReportImpact: "- Emotional Impact:",
        txtReportYourNotes: "YOUR NOTES",
        txtReportFeelings: "- Feelings During Use:",
        txtReportContent: "- Memorable Content and Its Effects:",
        txtReportAds: "- Memorable Ads and Their Effects:",
        txtReportNotSpecified: "Not specified.",
        txtReportAiAnalysis: "AI ANALYSIS AND SUGGESTIONS",
        aiPrompt: `
    As a social media awareness assistant, analyze the following data and provide an empathetic and guiding report to the user in the first person (e.g., "I understand you," "From what I see..."). Use markdown to make headings **bold** in your response.

    **User Data:**
    - Pre-Social Media Mood Score (1-10): {oncesi_mod_puani}
    - Post-Social Media Mood Score (1-10): {sonrasi_mod_puani}
    - Total Time Spent on Social Media (minutes): {totalMinutesForReport}
    - Feelings During Use: "{duygu_yazisi}"
    - Memorable Content and Its Effects: "{icerik_yazisi}"
    - Memorable Ads and Their Effects: "{reklam_yazisi}"

    **Report Content:**
    1.  **Introduction:** Start with an introduction like, "Hello, I've reviewed your data and prepared an analysis for you. From what I see..."
    2.  **Emotional Change Analysis:** Comment on the change in mood scores. Predict how this change might relate to the user's written texts (feelings, content). For example, "The drop in your mood score might be due to the X content you saw affecting you."
    3.  **Content Impact:** Mention the possible effects of the content the user mentioned on their emotional state.
    4.  **Advisory on Ads:** If ads were mentioned, add a gentle warning like, "It's normal for these ads to catch your attention, but I suggest you take some time to decide if you really want this product."
    5.  **Neutralizing Suggestions:** Provide 2-3 concrete and actionable suggestions to balance the emotional state. Examples: "How about doing a few minutes of deep breathing exercises now?", "Stepping away from the screen for a short walk might do you good.", "You could listen to some of your favorite calming music."
    6.  **Closing:** End with a supportive and positive sentence.
    
    Please generate the response containing only this analysis, as plain text, with one line break between paragraphs. Be sincere, understanding, but also guiding.
    `,
    }
};

// Durum (State) Yönetimi
let state = {
    oncesi_mod_puani: null as number | null,
    sonrasi_mod_puani: null as number | null,
    toplam_sure: 0, // Saniye cinsinden tutulacak
    duygu_yazisi: '',
    icerik_yazisi: '',
    reklam_yazisi: '',
    currentView: 'form' as 'form' | 'report',
    currentLanguage: 'tr' as 'tr' | 'en',
    timerSeconds: 0,
    timerInterval: null as number | null,
    isTimerRunning: false,
    isGeneratingReport: false,
    aiReport: '',
};

// Çeviri yardımcısı fonksiyonu
const t = (key: keyof typeof translations.tr, substitutions: Record<string, string | number> = {}) => {
    let text = translations[state.currentLanguage][key] || key;
    for (const placeholder in substitutions) {
        text = text.replace(`{${placeholder}}`, String(substitutions[placeholder]));
    }
    return text;
};

// Nefes egzersizi durumu (DOM'u doğrudan yönettiği için ana state dışında)
let breathingTimeout: number | null = null;
let isBreathingActive = false;


// Gemini API
const ai = new GoogleGenAI({ apiKey: API_KEY });

const render = () => {
    if (!app) return;
    app.innerHTML = ''; // Her render'da temizle

    if (state.currentView === 'form') {
        app.innerHTML = renderFormView();
    } else {
        app.innerHTML = renderReportView();
    }
    addEventListeners();
};

const renderLanguageSwitcher = () => {
    return `
        <div id="language-switcher">
            <button class="lang-btn ${state.currentLanguage === 'tr' ? 'active' : ''}" data-lang="tr">TR</button>
            <button class="lang-btn ${state.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        </div>
    `;
};

const renderFormView = () => {
    const totalMinutes = Math.floor(state.toplam_sure / 60);
    return `
        <div id="form-view">
            ${renderLanguageSwitcher()}
            <h1>${t('mainTitle')}</h1>
            <h2 class="page-subtitle">${t('welcomeMessage')}</h2>
            
            <!-- Bölüm 1: Sosyal Medya Öncesi -->
            <div class="section">
                <h2>${t('preRatingQuestion')}</h2>
                <p>${t('ratingScale')}</p>
                <div class="rating-buttons" id="pre-rating">
                    ${[...Array(10)].map((_, i) => `<button class="rating-btn ${state.oncesi_mod_puani === i + 1 ? 'active' : ''}" data-value="${i + 1}">${i + 1}</button>`).join('')}
                </div>
            </div>

            <!-- Bölüm 2: Sosyal Medya Kullanımı -->
            <div class="section timer-section">
                <h2>${t('timerTitle')}</h2>
                <div id="timer-display">${formatTime(state.timerSeconds)}</div>
                <div id="total-time-display">${t('totalTime')} ${totalMinutes} ${t('minutes')}</div>
                <div class="timer-controls">
                    <button id="start-btn">${t('startButton')}</button>
                    <button id="stop-btn">${t('stopButton')}</button>
                    <button id="save-btn">${t('saveButton')}</button>
                    <button id="reset-btn">${t('resetButton')}</button>
                </div>
            </div>
            
            <!-- Bölüm 3: Sosyal Medya Sonrası -->
            <div class="section">
                <h2>${t('postRatingQuestion')}</h2>
                <p>${t('ratingScale')}</p>
                <div class="rating-buttons" id="post-rating">
                    ${[...Array(10)].map((_, i) => `<button class="rating-btn ${state.sonrasi_mod_puani === i + 1 ? 'active' : ''}" data-value="${i + 1}">${i + 1}</button>`).join('')}
                </div>

                <div class="input-group">
                    <h3>${t('feelingsQuestion')}</h3>
                    <textarea id="duygu_yazisi" placeholder="${t('feelingsPlaceholder')}">${state.duygu_yazisi}</textarea>
                </div>
                <div class="input-group">
                    <h3>${t('contentQuestion')}</h3>
                    <textarea id="icerik_yazisi" placeholder="${t('contentPlaceholder')}">${state.icerik_yazisi}</textarea>
                </div>
                <div class="input-group">
                    <h3>${t('adsQuestion')}</h3>
                    <textarea id="reklam_yazisi" placeholder="${t('adsPlaceholder')}">${state.reklam_yazisi}</textarea>
                </div>
            </div>

            <div class="main-action-wrapper">
                <button id="get-report-btn" class="main-action-btn" ${state.oncesi_mod_puani === null || state.sonrasi_mod_puani === null ? 'disabled' : ''}>${t('getReportButton')}</button>
            </div>
        </div>
    `;
};

const formatAiResponse = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **text** -> <strong>text</strong>
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line}</p>`)
        .join('');
};

const renderReportView = () => {
    const fark = (state.sonrasi_mod_puani ?? 0) - (state.oncesi_mod_puani ?? 0);
    const etki_orani = Math.round((Math.abs(fark) / 10) * 100);
    const etki_tipi_key = fark < 0 ? 'impactNegative' : (fark > 0 ? 'impactPositive' : 'impactNeutral');
    const etki_tipi = t(etki_tipi_key as keyof typeof translations.tr);

    let pieChartStyle = '';
    if (etki_tipi_key === 'impactNegative') {
        pieChartStyle = `background-image: conic-gradient(var(--danger-red) 0% ${etki_orani}%, #ddd ${etki_orani}% 100%);`;
    } else if (etki_tipi_key === 'impactPositive') {
        pieChartStyle = `background-image: conic-gradient(var(--success-green) 0% ${etki_orani}%, #ddd ${etki_orani}% 100%);`;
    } else {
        pieChartStyle = `background-image: conic-gradient(#ddd 0% 100%);`;
    }
    
    const totalMinutesForReport = Math.round(state.toplam_sure / 60);

    return `
        <div id="report-view">
            ${renderLanguageSwitcher()}
            <h1>${t('mainTitle')}</h1>
            <h2 class="page-subtitle">${t('reportTitle')}</h2>
            <div class="report-summary">
                <h2>${t('emotionalImpactTitle')}</h2>
                <div class="pie-chart" style="${pieChartStyle}"></div>
                <div class="impact-score ${etki_tipi_key === 'impactNegative' ? 'negative' : 'positive'}">
                    %${etki_orani} ${etki_tipi} ${t('impactSuffix')}
                </div>
                <p>
                   ${t('reportSummary', { pre: state.oncesi_mod_puani, time: totalMinutesForReport, post: state.sonrasi_mod_puani })}
                </p>
            </div>
            
            <div class="report-summary">
                <h2>${t('aiAnalysisTitle')}</h2>
                <div id="ai-analysis">
                    ${state.isGeneratingReport ? '<div class="loader"></div>' : formatAiResponse(state.aiReport)}
                </div>
            </div>

             <div class="report-summary">
                <h2>${t('breathingExerciseTitle')}</h2>
                <p>${t('breathingExerciseDesc')}</p>
                <div class="breathing-anim-container">
                    <div id="breathing-circle" class="idle"></div>
                    <p id="breathing-text">${t('breathingStart')}</p>
                </div>
                <div class="main-action-wrapper">
                    <button id="breathing-toggle-btn" class="main-action-btn">${t('breathingStart')}</button>
                </div>
            </div>
            
            <div class="main-action-wrapper">
                 <button id="download-report-btn" class="main-action-btn secondary-action-btn">${t('downloadReportButton')}</button>
                <button id="new-analysis-btn" class="main-action-btn">${t('newAnalysisButton')}</button>
            </div>
        </div>
    `;
};

const addEventListeners = () => {
    document.getElementById('language-switcher')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('lang-btn')) {
            const lang = target.dataset.lang as 'tr' | 'en';
            if (lang && lang !== state.currentLanguage) {
                state.currentLanguage = lang;
                render();
            }
        }
    });

    if (state.currentView === 'form') {
        document.getElementById('pre-rating')?.addEventListener('click', (e) => handleRatingClick(e, 'oncesi'));
        document.getElementById('post-rating')?.addEventListener('click', (e) => handleRatingClick(e, 'sonrasi'));
        document.getElementById('start-btn')?.addEventListener('click', startTimer);
        document.getElementById('stop-btn')?.addEventListener('click', stopTimer);
        document.getElementById('save-btn')?.addEventListener('click', saveTime);
        document.getElementById('reset-btn')?.addEventListener('click', resetTimer);
        document.getElementById('duygu_yazisi')?.addEventListener('input', handleTextareaInput);
        document.getElementById('icerik_yazisi')?.addEventListener('input', handleTextareaInput);
        document.getElementById('reklam_yazisi')?.addEventListener('input', handleTextareaInput);
        document.getElementById('get-report-btn')?.addEventListener('click', generateReport);
    } else {
        document.getElementById('new-analysis-btn')?.addEventListener('click', startNewAnalysis);
        document.getElementById('breathing-toggle-btn')?.addEventListener('click', toggleBreathingExercise);
        document.getElementById('download-report-btn')?.addEventListener('click', downloadReport);
    }
};

const handleRatingClick = (e: Event, type: 'oncesi' | 'sonrasi') => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains('rating-btn')) {
        const value = parseInt(target.dataset.value || '0', 10);
        if (type === 'oncesi') {
            state.oncesi_mod_puani = value;
        } else {
            state.sonrasi_mod_puani = value;
        }
        render();
    }
};

const handleTextareaInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const id = target.id as 'duygu_yazisi' | 'icerik_yazisi' | 'reklam_yazisi';
    state[id] = target.value;
};

// Timer Fonksiyonları
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const startTimer = () => {
    if (state.isTimerRunning) return;
    state.isTimerRunning = true;
    state.timerInterval = window.setInterval(() => {
        state.timerSeconds++;
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(state.timerSeconds);
        }
    }, 1000);
};

const stopTimer = () => {
    state.isTimerRunning = false;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
};

const saveTime = () => {
    stopTimer();
    state.toplam_sure += state.timerSeconds;
    state.timerSeconds = 0;
    render();
};

const resetTimer = () => {
    stopTimer();
    state.timerSeconds = 0;
    render();
};

// Breathing Exercise Functions
const updateBreathingUI = (stage: 'idle' | 'inhale' | 'hold' | 'exhale', textKey: keyof typeof translations.tr) => {
    const circle = document.getElementById('breathing-circle');
    const instruction = document.getElementById('breathing-text');
    if (circle) circle.className = stage;
    if (instruction) instruction.textContent = t(textKey);
};

const breathingCycle = (currentStage: 'idle' | 'inhale' | 'hold' | 'exhale' = 'exhale') => {
    if (!isBreathingActive) {
        updateBreathingUI('idle', 'breathingStart');
        return;
    }

    let nextStage: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let nextTextKey: keyof typeof translations.tr = 'breathingInhale';
    let duration = 0;

    switch (currentStage) {
        case 'exhale':
            nextStage = 'inhale';
            nextTextKey = 'breathingInhale';
            duration = 4000;
            break;
        case 'inhale':
            nextStage = 'hold';
            nextTextKey = 'breathingHold';
            duration = 7000;
            break;
        case 'hold':
            nextStage = 'exhale';
            nextTextKey = 'breathingExhale';
            duration = 8000;
            break;
    }
    updateBreathingUI(nextStage, nextTextKey);
    breathingTimeout = window.setTimeout(() => breathingCycle(nextStage), duration);
};

const toggleBreathingExercise = () => {
    isBreathingActive = !isBreathingActive;
    const button = document.getElementById('breathing-toggle-btn');
    if (button) {
        button.textContent = isBreathingActive ? t('breathingStop') : t('breathingStart');
    }

    if (isBreathingActive) {
        breathingCycle();
    } else {
        if (breathingTimeout) clearTimeout(breathingTimeout);
        breathingTimeout = null;
        updateBreathingUI('idle', 'breathingStart');
    }
};

const downloadReport = () => {
    const totalMinutesForReport = Math.round(state.toplam_sure / 60);
    const fark = (state.sonrasi_mod_puani ?? 0) - (state.oncesi_mod_puani ?? 0);
    const etki_orani = Math.round((Math.abs(fark) / 10) * 100);
    const etki_tipi_key = fark < 0 ? 'impactNegative' : (fark > 0 ? 'impactPositive' : 'impactNeutral');
    const etki_tipi = t(etki_tipi_key as keyof typeof translations.tr);

    const reportContent = `
${t('txtReportTitle')}
==================================

${t('txtReportOverview')}
----------------------------------
${t('txtReportPreMood')} ${state.oncesi_mod_puani}/10
${t('txtReportPostMood')} ${state.sonrasi_mod_puani}/10
${t('txtReportTotalTime')} ${totalMinutesForReport} ${t('minutes')}
${t('txtReportImpact')} %${etki_orani} ${etki_tipi}

${t('txtReportYourNotes')}
----------------------------------
${t('txtReportFeelings')}
${state.duygu_yazisi.trim() || t('txtReportNotSpecified')}

${t('txtReportContent')}
${state.icerik_yazisi.trim() || t('txtReportNotSpecified')}

${t('txtReportAds')}
${state.reklam_yazisi.trim() || t('txtReportNotSpecified')}

${t('txtReportAiAnalysis')}
----------------------------------
${state.aiReport.trim()}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = t('downloadFileName');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
};


const startNewAnalysis = () => {
    if (breathingTimeout) clearTimeout(breathingTimeout);
    breathingTimeout = null;
    isBreathingActive = false;
    
    // Dil ayarını koru
    const lang = state.currentLanguage;
    state = {
        oncesi_mod_puani: null,
        sonrasi_mod_puani: null,
        toplam_sure: 0,
        duygu_yazisi: '',
        icerik_yazisi: '',
        reklam_yazisi: '',
        currentView: 'form',
        currentLanguage: lang,
        timerSeconds: 0,
        timerInterval: null,
        isTimerRunning: false,
        isGeneratingReport: false,
        aiReport: '',
    };
    render();
};

const generateReport = async () => {
    if (state.oncesi_mod_puani === null || state.sonrasi_mod_puani === null) return;

    state.currentView = 'report';
    state.isGeneratingReport = true;
    render();

    const totalMinutesForReport = Math.round(state.toplam_sure / 60);
    const prompt = t('aiPrompt', {
        oncesi_mod_puani: state.oncesi_mod_puani,
        sonrasi_mod_puani: state.sonrasi_mod_puani,
        totalMinutesForReport: totalMinutesForReport,
        duygu_yazisi: state.duygu_yazisi || t('txtReportNotSpecified'),
        icerik_yazisi: state.icerik_yazisi || t('txtReportNotSpecified'),
        reklam_yazisi: state.reklam_yazisi || t('txtReportNotSpecified'),
    });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        state.aiReport = response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        state.aiReport = t('apiError');
    } finally {
        state.isGeneratingReport = false;
        render();
    }
};


// İlk render
render();