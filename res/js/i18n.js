/**
 * Promps - Internationalization (i18n) Module
 *
 * Provides UI translation support for Japanese/English switching.
 * In Japanese mode: generates Japanese prompts with particles and verbs
 * In English mode: generates English prompts with English grammar
 */

/**
 * Translation data for all supported languages
 */
const TRANSLATIONS = {
    ja: {
        // Header & Toolbar
        'app.subtitle': 'ビジュアルプロンプト言語ジェネレーター',
        'toolbar.new': '新規',
        'toolbar.new.title': '新規プロジェクト (Ctrl+N)',
        'toolbar.open': '開く',
        'toolbar.open.title': 'プロジェクトを開く (Ctrl+O)',
        'toolbar.save': '保存',
        'toolbar.save.title': 'プロジェクトを保存 (Ctrl+S)',
        'toolbar.saveAs': '名前を付けて保存',
        'toolbar.saveAs.title': '名前を付けて保存 (Ctrl+Shift+S)',
        'toolbar.theme': 'テーマ',
        'toolbar.theme.title.toDark': 'ダークモードへ切替',
        'toolbar.theme.title.toLight': 'ライトモードへ切替',
        'toolbar.lang': 'JA',
        'toolbar.lang.title': 'Switch to English',

        // Workspace & Preview
        'workspace.title': 'ワークスペース',
        'workspace.loading': 'Blocklyワークスペースを読み込み中...',
        'preview.title': '生成されたプロンプト',
        'preview.placeholder': '生成されたプロンプトがここに表示されます。',
        // Validation
        'validation.passed': '文法チェック OK',
        'validation.error': 'エラー',
        'validation.errors': 'エラー',
        'validation.warning': '警告',
        'validation.warnings': '警告',

        // Pattern Templates (Phase 6)
        'pattern.header': 'パターンテンプレート',
        'pattern.apply': '適用',
        'pattern.example': '例',
        'suggestion.header': 'おすすめパターン',
        'suggestion.complete': '完成',
        'suggestion.apply': '適用',

        // Blockly Category Names
        'blockly.category.noun': '名詞',
        'blockly.category.particle': '助詞',
        'blockly.category.article': '冠詞',
        'blockly.category.verb': '動詞',
        'blockly.category.punctuation': '句読点',
        'blockly.category.other': 'その他',

        // Template (Macro) Feature
        'toolbox.myTemplates': 'マイテンプレート',
        'template.saveAs': 'テンプレートとして保存',
        'template.enterName': 'テンプレート名を入力:',
        'template.empty': '保存されたテンプレートはありません',
        'template.delete': '削除',
        'template.deleteConfirm': 'このテンプレートを削除しますか？',

        // Blockly Block Labels (displayed on blocks)
        'blockly.noun.label': '名詞:',
        'blockly.other.label': 'その他:',
        'blockly.verb.label': '動詞:',

        // Particle Labels
        'blockly.particle.ga.label': 'が',
        'blockly.particle.wo.label': 'を',
        'blockly.particle.ni.label': 'に',
        'blockly.particle.de.label': 'で',
        'blockly.particle.to.label': 'と',
        'blockly.particle.he.label': 'へ',
        'blockly.particle.kara.label': 'から',
        'blockly.particle.made.label': 'まで',
        'blockly.particle.yori.label': 'より',

        // Particle DSL Output
        'blockly.particle.ga.output': 'が ',
        'blockly.particle.wo.output': 'を ',
        'blockly.particle.ni.output': 'に ',
        'blockly.particle.de.output': 'で ',
        'blockly.particle.to.output': 'と ',
        'blockly.particle.he.output': 'へ ',
        'blockly.particle.kara.output': 'から ',
        'blockly.particle.made.output': 'まで ',
        'blockly.particle.yori.output': 'より ',

        // Article Labels (English mode only, but keys needed for consistency)
        'blockly.article.a.label': 'a',
        'blockly.article.an.label': 'an',
        'blockly.article.the.label': 'the',
        'blockly.article.this.label': 'this',
        'blockly.article.that.label': 'that',
        'blockly.article.please.label': 'please',

        // Article DSL Output
        'blockly.article.a.output': 'a ',
        'blockly.article.an.output': 'an ',
        'blockly.article.the.output': 'the ',
        'blockly.article.this.output': 'this ',
        'blockly.article.that.output': 'that ',
        'blockly.article.please.output': 'please ',

        // Article Tooltips
        'blockly.article.a.tooltip': '不定冠詞（子音で始まる単数名詞用）',
        'blockly.article.an.tooltip': '不定冠詞（母音で始まる単数名詞用）',
        'blockly.article.the.tooltip': '定冠詞（特定の名詞用）',
        'blockly.article.this.tooltip': '指示詞（近くのもの）',
        'blockly.article.that.tooltip': '指示詞（遠くのもの）',
        'blockly.article.please.tooltip': '丁寧な依頼',

        // Verb Labels
        'blockly.verb.analyze.label': '分析して',
        'blockly.verb.summarize.label': '要約して',
        'blockly.verb.translate.label': '翻訳して',
        'blockly.verb.create.label': '作成して',
        'blockly.verb.generate.label': '生成して',
        'blockly.verb.convert.label': '変換して',
        'blockly.verb.delete.label': '削除して',
        'blockly.verb.update.label': '更新して',
        'blockly.verb.extract.label': '抽出して',
        'blockly.verb.explain.label': '説明して',
        'blockly.verb.describe.label': '解説して',
        'blockly.verb.teach.label': '教えて',
        'blockly.verb.custom.default': '作成して',

        // Verb DSL Output
        'blockly.verb.analyze.output': '分析して ',
        'blockly.verb.summarize.output': '要約して ',
        'blockly.verb.translate.output': '翻訳して ',
        'blockly.verb.create.output': '作成して ',
        'blockly.verb.generate.output': '生成して ',
        'blockly.verb.convert.output': '変換して ',
        'blockly.verb.delete.output': '削除して ',
        'blockly.verb.update.output': '更新して ',
        'blockly.verb.extract.output': '抽出して ',
        'blockly.verb.explain.output': '説明して ',
        'blockly.verb.describe.output': '解説して ',
        'blockly.verb.teach.output': '教えて ',

        // Punctuation Labels & Output (same in both modes)
        'blockly.punct.touten.label': '、',
        'blockly.punct.kuten.label': '。',
        'blockly.punct.exclaim.label': '！',
        'blockly.punct.question.label': '？',
        'blockly.punct.dquote.label': '"',
        'blockly.punct.squote.label': "'",
        'blockly.punct.comma.label': ',',
        'blockly.punct.slash.label': '/',
        'blockly.punct.amp.label': '&',
        'blockly.punct.touten.output': '、 ',
        'blockly.punct.kuten.output': '。 ',
        'blockly.punct.exclaim.output': '！ ',
        'blockly.punct.question.output': '？ ',
        'blockly.punct.dquote.output': '" ',
        'blockly.punct.squote.output': "' ",
        'blockly.punct.comma.output': ', ',
        'blockly.punct.slash.output': '/ ',
        'blockly.punct.amp.output': '& ',
        'blockly.punct.period.label': '.',
        'blockly.punct.period.output': '. ',
        'blockly.punct.period.tooltip': '句読点: ピリオド（.）',

        // Blockly Block Tooltips
        'blockly.noun.tooltip': '名詞ブロック (_N: プレフィックス付き)',
        'blockly.other.tooltip': 'その他ブロック (助詞、動詞、形容詞、接続詞など)',
        'blockly.particle.ga.tooltip': '助詞: が（主語を示す）',
        'blockly.particle.wo.tooltip': '助詞: を（目的語を示す）',
        'blockly.particle.ni.tooltip': '助詞: に（方向・対象を示す）',
        'blockly.particle.de.tooltip': '助詞: で（手段・場所を示す）',
        'blockly.particle.to.tooltip': '助詞: と（並列・共同を示す）',
        'blockly.particle.he.tooltip': '助詞: へ（方向を示す）',
        'blockly.particle.kara.tooltip': '助詞: から（起点を示す）',
        'blockly.particle.made.tooltip': '助詞: まで（終点を示す）',
        'blockly.particle.yori.tooltip': '助詞: より（比較を示す）',
        'blockly.verb.analyze.tooltip': '動詞: 分析して',
        'blockly.verb.summarize.tooltip': '動詞: 要約して',
        'blockly.verb.translate.tooltip': '動詞: 翻訳して',
        'blockly.verb.create.tooltip': '動詞: 作成して',
        'blockly.verb.generate.tooltip': '動詞: 生成して',
        'blockly.verb.convert.tooltip': '動詞: 変換して',
        'blockly.verb.delete.tooltip': '動詞: 削除して',
        'blockly.verb.update.tooltip': '動詞: 更新して',
        'blockly.verb.extract.tooltip': '動詞: 抽出して',
        'blockly.verb.explain.tooltip': '動詞: 説明して',
        'blockly.verb.describe.tooltip': '動詞: 解説して',
        'blockly.verb.teach.tooltip': '動詞: 教えて',
        'blockly.verb.custom.tooltip': 'カスタム動詞ブロック',
        'blockly.punct.touten.tooltip': '句読点: 読点（、）',
        'blockly.punct.kuten.tooltip': '句読点: 句点（。）',
        'blockly.punct.exclaim.tooltip': '句読点: 感嘆符（！）',
        'blockly.punct.question.tooltip': '句読点: 疑問符（？）',
        'blockly.punct.dquote.tooltip': '句読点: 二重引用符（"）',
        'blockly.punct.squote.tooltip': "句読点: 引用符（'）",
        'blockly.punct.comma.tooltip': '句読点: カンマ（,）',
        'blockly.punct.slash.tooltip': '句読点: スラッシュ（/）',
        'blockly.punct.amp.tooltip': '句読点: アンパサンド（&）',

        // Validation Error Messages - English Grammar (displayed in Japanese UI)
        'validation.en.articleNotBeforeNoun': '冠詞の後に名詞がありません',
        'validation.en.consecutiveArticles': '冠詞が連続しています',
        'validation.en.prepositionWithoutObject': '前置詞の後に名詞がありません',
        'validation.en.pleasePosition': '「please」は文頭または動詞の前に置いてください',
        'validation.en.periodNotAtEnd': 'ピリオドは文末に置いてください',
        'validation.en.missingVerb': '文に動詞がありません',

        // Project Manager
        'project.unsaved.title': '未保存の変更',
        'project.unsaved.message': '未保存の変更があります。破棄しますか？',
        'project.save.failed': 'プロジェクトの保存に失敗しました',
        'project.load.failed': 'プロジェクトの読み込みに失敗しました',

        // Footer
        'footer.version': 'Promps v1.0.1 - 日英対応'
    },

    en: {
        // Header & Toolbar
        'app.subtitle': 'Visual Prompt Language Generator',
        'toolbar.new': 'New',
        'toolbar.new.title': 'New Project (Ctrl+N)',
        'toolbar.open': 'Open',
        'toolbar.open.title': 'Open Project (Ctrl+O)',
        'toolbar.save': 'Save',
        'toolbar.save.title': 'Save Project (Ctrl+S)',
        'toolbar.saveAs': 'Save As',
        'toolbar.saveAs.title': 'Save As (Ctrl+Shift+S)',
        'toolbar.theme': 'Theme',
        'toolbar.theme.title.toDark': 'Switch to Dark Mode',
        'toolbar.theme.title.toLight': 'Switch to Light Mode',
        'toolbar.lang': 'EN',
        'toolbar.lang.title': '日本語に切り替え',

        // Workspace & Preview
        'workspace.title': 'Workspace',
        'workspace.loading': 'Loading Blockly workspace...',
        'preview.title': 'Generated Prompt',
        'preview.placeholder': 'Generated prompt will appear here.',
        // Validation
        'validation.passed': 'Grammar check passed',
        'validation.error': 'error',
        'validation.errors': 'errors',
        'validation.warning': 'warning',
        'validation.warnings': 'warnings',

        // Pattern Templates (Phase 6)
        'pattern.header': 'Pattern Templates',
        'pattern.apply': 'Apply',
        'pattern.example': 'Example',
        'suggestion.header': 'Recommended Patterns',
        'suggestion.complete': 'Complete',
        'suggestion.apply': 'Apply',

        // Blockly Category Names
        'blockly.category.noun': 'Noun',
        'blockly.category.particle': 'Connector',
        'blockly.category.article': 'Article',
        'blockly.category.verb': 'Action',
        'blockly.category.punctuation': 'Punctuation',
        'blockly.category.other': 'Other',

        // Template (Macro) Feature
        'toolbox.myTemplates': 'My Templates',
        'template.saveAs': 'Save as Template',
        'template.enterName': 'Enter template name:',
        'template.empty': 'No templates saved',
        'template.delete': 'Delete',
        'template.deleteConfirm': 'Delete this template?',

        // Blockly Block Labels (displayed on blocks)
        'blockly.noun.label': 'Noun:',
        'blockly.other.label': 'Other:',
        'blockly.verb.label': 'Action:',

        // Connector Labels (English equivalents of Japanese particles)
        'blockly.particle.ga.label': '(subject)',
        'blockly.particle.wo.label': '(object)',
        'blockly.particle.ni.label': 'to',
        'blockly.particle.de.label': 'with',
        'blockly.particle.to.label': 'and',
        'blockly.particle.he.label': 'toward',
        'blockly.particle.kara.label': 'from',
        'blockly.particle.made.label': 'until',
        'blockly.particle.yori.label': 'than',

        // Connector DSL Output (empty for subject/object markers, English for others)
        'blockly.particle.ga.output': '',
        'blockly.particle.wo.output': '',
        'blockly.particle.ni.output': 'to ',
        'blockly.particle.de.output': 'with ',
        'blockly.particle.to.output': 'and ',
        'blockly.particle.he.output': 'toward ',
        'blockly.particle.kara.output': 'from ',
        'blockly.particle.made.output': 'until ',
        'blockly.particle.yori.output': 'than ',

        // Article Labels (English mode only)
        'blockly.article.a.label': 'a',
        'blockly.article.an.label': 'an',
        'blockly.article.the.label': 'the',
        'blockly.article.this.label': 'this',
        'blockly.article.that.label': 'that',
        'blockly.article.please.label': 'please',

        // Article DSL Output
        'blockly.article.a.output': 'a ',
        'blockly.article.an.output': 'an ',
        'blockly.article.the.output': 'the ',
        'blockly.article.this.output': 'this ',
        'blockly.article.that.output': 'that ',
        'blockly.article.please.output': 'please ',

        // Article Tooltips
        'blockly.article.a.tooltip': 'Indefinite article for singular nouns starting with consonant sound',
        'blockly.article.an.tooltip': 'Indefinite article for singular nouns starting with vowel sound',
        'blockly.article.the.tooltip': 'Definite article for specific nouns',
        'blockly.article.this.tooltip': 'Demonstrative for nearby objects',
        'blockly.article.that.tooltip': 'Demonstrative for distant objects',
        'blockly.article.please.tooltip': 'Polite request marker',

        // Action Labels
        'blockly.verb.analyze.label': 'analyze',
        'blockly.verb.summarize.label': 'summarize',
        'blockly.verb.translate.label': 'translate',
        'blockly.verb.create.label': 'create',
        'blockly.verb.generate.label': 'generate',
        'blockly.verb.convert.label': 'convert',
        'blockly.verb.delete.label': 'delete',
        'blockly.verb.update.label': 'update',
        'blockly.verb.extract.label': 'extract',
        'blockly.verb.explain.label': 'explain',
        'blockly.verb.describe.label': 'describe',
        'blockly.verb.teach.label': 'teach',
        'blockly.verb.custom.default': 'process',

        // Action DSL Output
        'blockly.verb.analyze.output': 'analyze ',
        'blockly.verb.summarize.output': 'summarize ',
        'blockly.verb.translate.output': 'translate ',
        'blockly.verb.create.output': 'create ',
        'blockly.verb.generate.output': 'generate ',
        'blockly.verb.convert.output': 'convert ',
        'blockly.verb.delete.output': 'delete ',
        'blockly.verb.update.output': 'update ',
        'blockly.verb.extract.output': 'extract ',
        'blockly.verb.explain.output': 'explain ',
        'blockly.verb.describe.output': 'describe ',
        'blockly.verb.teach.output': 'teach ',

        // Punctuation Labels & Output
        'blockly.punct.touten.label': ',',
        'blockly.punct.kuten.label': '.',
        'blockly.punct.exclaim.label': '!',
        'blockly.punct.question.label': '?',
        'blockly.punct.dquote.label': '"',
        'blockly.punct.squote.label': "'",
        'blockly.punct.comma.label': ',',
        'blockly.punct.slash.label': '/',
        'blockly.punct.amp.label': '&',
        'blockly.punct.touten.output': ', ',
        'blockly.punct.kuten.output': '. ',
        'blockly.punct.exclaim.output': '! ',
        'blockly.punct.question.output': '? ',
        'blockly.punct.dquote.output': '" ',
        'blockly.punct.squote.output': "' ",
        'blockly.punct.comma.output': ', ',
        'blockly.punct.slash.output': '/ ',
        'blockly.punct.amp.output': '& ',
        'blockly.punct.period.label': '.',
        'blockly.punct.period.output': '. ',
        'blockly.punct.period.tooltip': 'Punctuation: period',

        // Blockly Block Tooltips
        'blockly.noun.tooltip': 'Noun block - marks important terms (_N: prefix)',
        'blockly.other.tooltip': 'Other block - for custom text',
        'blockly.particle.ga.tooltip': 'Subject marker - indicates the subject (can be omitted in English)',
        'blockly.particle.wo.tooltip': 'Object marker - indicates the object (can be omitted in English)',
        'blockly.particle.ni.tooltip': 'Direction marker - equivalent to "to"',
        'blockly.particle.de.tooltip': 'Means marker - equivalent to "with" or "by"',
        'blockly.particle.to.tooltip': 'Conjunction - equivalent to "and" or "with"',
        'blockly.particle.he.tooltip': 'Direction marker - equivalent to "toward"',
        'blockly.particle.kara.tooltip': 'Origin marker - equivalent to "from"',
        'blockly.particle.made.tooltip': 'Limit marker - equivalent to "until"',
        'blockly.particle.yori.tooltip': 'Comparison marker - equivalent to "than"',
        'blockly.verb.analyze.tooltip': 'Action: analyze',
        'blockly.verb.summarize.tooltip': 'Action: summarize',
        'blockly.verb.translate.tooltip': 'Action: translate',
        'blockly.verb.create.tooltip': 'Action: create',
        'blockly.verb.generate.tooltip': 'Action: generate',
        'blockly.verb.convert.tooltip': 'Action: convert',
        'blockly.verb.delete.tooltip': 'Action: delete',
        'blockly.verb.update.tooltip': 'Action: update',
        'blockly.verb.extract.tooltip': 'Action: extract',
        'blockly.verb.explain.tooltip': 'Action: explain',
        'blockly.verb.describe.tooltip': 'Action: describe',
        'blockly.verb.teach.tooltip': 'Action: teach',
        'blockly.verb.custom.tooltip': 'Custom action block',
        'blockly.punct.touten.tooltip': 'Punctuation: comma',
        'blockly.punct.kuten.tooltip': 'Punctuation: period',
        'blockly.punct.exclaim.tooltip': 'Punctuation: exclamation mark',
        'blockly.punct.question.tooltip': 'Punctuation: question mark',
        'blockly.punct.dquote.tooltip': 'Punctuation: double quote',
        'blockly.punct.squote.tooltip': 'Punctuation: single quote',
        'blockly.punct.comma.tooltip': 'Punctuation: comma',
        'blockly.punct.slash.tooltip': 'Punctuation: slash',
        'blockly.punct.amp.tooltip': 'Punctuation: ampersand',

        // Validation Error Messages - English Grammar
        'validation.en.articleNotBeforeNoun': 'Article must be followed by a noun',
        'validation.en.consecutiveArticles': 'Consecutive articles not allowed',
        'validation.en.prepositionWithoutObject': 'Preposition must be followed by a noun',
        'validation.en.pleasePosition': '"please" should be at start or before verb',
        'validation.en.periodNotAtEnd': 'Period should be at end of sentence',
        'validation.en.missingVerb': 'Sentence has no verb (action)',

        // Project Manager
        'project.unsaved.title': 'Unsaved Changes',
        'project.unsaved.message': 'You have unsaved changes. Do you want to discard them?',
        'project.save.failed': 'Failed to save project',
        'project.load.failed': 'Failed to load project',

        // Footer
        'footer.version': 'Promps v1.0.1 - Bilingual'
    }
};

/**
 * Current locale (default: Japanese)
 */
let currentLocale = localStorage.getItem('promps-lang') || 'ja';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated text or key if not found
 */
function t(key, params = {}) {
    const translations = TRANSLATIONS[currentLocale] || TRANSLATIONS.ja;
    let text = translations[key];

    if (text === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }

    // Simple parameter interpolation: {paramName}
    for (const [paramKey, paramValue] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
    }

    return text;
}

/**
 * Get current locale
 * @returns {string} Current locale code ('ja' or 'en')
 */
function getLocale() {
    return currentLocale;
}

/**
 * Set locale and update UI
 * @param {string} lang - Language code ('ja' or 'en')
 */
function setLocale(lang) {
    if (!TRANSLATIONS[lang]) {
        console.warn(`Unsupported locale: ${lang}`);
        return;
    }

    currentLocale = lang;
    localStorage.setItem('promps-lang', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    updateUIText();

    // Dispatch custom event for other modules to react
    window.dispatchEvent(new CustomEvent('localechange', {
        detail: { locale: lang }
    }));

    console.log(`Locale changed to: ${lang}`);
}

/**
 * Toggle between Japanese and English
 */
function toggleLocale() {
    const newLocale = currentLocale === 'ja' ? 'en' : 'ja';
    setLocale(newLocale);
}

/**
 * Update all elements with data-i18n attribute
 */
function updateUIText() {
    // Update elements with data-i18n attribute (text content)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Update elements with data-i18n-title attribute (title/tooltip)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });

    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

/**
 * Initialize i18n module
 * Called automatically on load
 */
function initI18n() {
    // Ensure HTML lang attribute matches current locale
    document.documentElement.lang = currentLocale;

    // Update UI text
    updateUIText();

    console.log(`i18n initialized with locale: ${currentLocale}`);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

// Export to global scope
window.i18n = {
    t,
    getLocale,
    setLocale,
    toggleLocale,
    updateUIText,
    TRANSLATIONS
};

// Convenience global functions
window.t = t;
window.getLocale = getLocale;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, getLocale, setLocale, toggleLocale, updateUIText, TRANSLATIONS };
}
