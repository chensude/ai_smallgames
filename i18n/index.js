/**
 * I18n Internationalization System
 * 支持多语言切换，语言设置持久化，自动检测浏览器语言
 */

// 导入语言包
import es from './es.js';
import it from './it.js';
import en from './en.js';
import de from './de.js';
import fr from './fr.js';
import ja from './ja.js';
import zhCN from './zh-CN.js';

// 所有支持的语言
const supportedLanguages = {
  'en': {
    name: 'English',
    flag: '🇺🇸',
    data: en
  },
  'de': {
    name: 'Deutsch',
    flag: '🇩🇪',
    data: de
  },
  'it': {
    name: 'Italiano',
    flag: '🇮🇹',
    data: it
  },
  'fr': {
    name: 'Français',
    flag: '🇫🇷',
    data: fr
  },
  'ja': {
    name: '日本語',
    flag: '🇯🇵',
    data: ja
  },
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳',
    data: zhCN
  },
  'es': {
    name: 'Español',
    flag: '🇪🇸',
    data: es
  }
};

// 默认语言
const DEFAULT_LANGUAGE = 'en';

// 当前使用的语言
let currentLanguage = DEFAULT_LANGUAGE;

/**
 * 初始化国际化系统
 */
function initI18n() {
  // 1. 从localStorage获取用户选择的语言
  const savedLanguage = localStorage.getItem('language');
  
  // 2. 如果没有保存的语言，检测浏览器语言
  if (!savedLanguage) {
    const browserLang = detectBrowserLanguage();
    currentLanguage = supportedLanguages[browserLang] ? browserLang : DEFAULT_LANGUAGE;
  } else {
    currentLanguage = savedLanguage;
  }
  
  // 3. 应用语言
  applyLanguage(currentLanguage);
  
  // 4. 设置语言选择器
  setupLanguageSelector();
  
  // 5. 添加URL处理
  handleUrlLanguage();
  
  // 6. 确保语言选择器显示正确的当前语言
  updateLanguageSelector(currentLanguage);
  
  // 7. 修复布局问题
  fixLayoutIssues();
}

/**
 * 检测浏览器语言
 * @returns {string} 语言代码
 */
function detectBrowserLanguage() {
  const browserLang = navigator.language.toLowerCase();
  
  // 检查完整匹配
  if (supportedLanguages[browserLang]) {
    return browserLang;
  }
  
  // 检查语言前缀匹配（如zh-CN只匹配zh）
  const prefix = browserLang.split('-')[0];
  
  // 如果是中文，默认使用zh-CN
  if (prefix === 'zh') {
    return 'zh-CN';
  }
  
  // 寻找支持的语言
  for (const lang in supportedLanguages) {
    if (lang.startsWith(prefix)) {
      return lang;
    }
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * 切换语言
 * @param {string} langCode 语言代码
 */
function changeLanguage(langCode) {
  // 检查语言是否支持
  if (!supportedLanguages[langCode]) {
    console.warn(`语言 ${langCode} 不受支持，使用默认语言`);
    langCode = DEFAULT_LANGUAGE;
  }
  
  // 保存用户语言选择
  localStorage.setItem('language', langCode);
  currentLanguage = langCode;
  
  // 应用新的语言
  applyLanguage(langCode);
  
  // 更新URL
  updateUrlLanguage(langCode);
  
  // 更新语言选择器
  updateLanguageSelector(langCode);
  
  // 如果有原始游戏数据，重新处理本地化并重新渲染
  if (window.originalGames && Array.isArray(window.originalGames) && window.localizeGamesData) {
    console.log('重新处理本地化游戏数据');
    // 确保window.allGames是一个数组
    if (!Array.isArray(window.allGames)) {
      window.allGames = [];
    }
    
    try {
      window.allGames = window.localizeGamesData(window.originalGames);
      console.log('本地化游戏数据处理完成');
      
      // 重新加载收藏和最近玩过的游戏
      if (window.loadFavoriteGames) window.loadFavoriteGames();
      if (window.loadRecentlyPlayedGames) window.loadRecentlyPlayedGames();
      
      // 重新渲染游戏
      if (window.renderAllGames) window.renderAllGames();
    } catch (error) {
      console.error('处理本地化游戏数据时出错:', error);
    }
  }
}

/**
 * 应用语言到DOM
 * @param {string} langCode 语言代码
 */
function applyLanguage(langCode) {
  const langData = supportedLanguages[langCode]?.data || supportedLanguages[DEFAULT_LANGUAGE].data;
  
  // 设置HTML lang属性
  document.documentElement.setAttribute('lang', langCode);
  document.documentElement.setAttribute('data-lang', langCode);
  
  // 翻译所有带有data-i18n属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(langData, key);
    
    if (translation) {
      // 如果是输入框，设置placeholder
      if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', translation);
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // 翻译title
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = getTranslation(langData, key);
    
    if (translation) {
      element.setAttribute('title', translation);
    }
  });
  
  // 翻译页面标题
  const titleKey = document.querySelector('title')?.getAttribute('data-i18n-title');
  if (titleKey) {
    const titleTranslation = getTranslation(langData, titleKey);
    if (titleTranslation) {
      document.title = titleTranslation;
    }
  }
  
  // 翻译游戏标题
  document.querySelectorAll('.game-title').forEach(element => {
    const gameCard = element.closest('.game-card');
    if (gameCard) {
      // 尝试从游戏卡片中获取游戏对象
      const gameIndex = Array.from(gameCard.parentNode.children).indexOf(gameCard);
      const currentCategory = document.querySelector('.sidebar-icon.active')?.getAttribute('data-category') || 'all';
      
      let game;
      try {
        if (currentCategory === 'all') {
          game = window.allGames && Array.isArray(window.allGames) && window.allGames[gameIndex];
        } else if (currentCategory === 'favorite') {
          game = window.favoriteGames && Array.isArray(window.favoriteGames) && window.favoriteGames[gameIndex];
        } else if (currentCategory === 'recent') {
          game = window.recentlyPlayedGames && Array.isArray(window.recentlyPlayedGames) && window.recentlyPlayedGames[gameIndex];
        } else {
          // 过滤的游戏
          const filteredGames = window.allGames && Array.isArray(window.allGames) ? 
            window.allGames.filter(g => {
              if (!g || !g.tags) return false;
              const gameTags = g.tags.toLowerCase();
              const searchTags = currentCategory.toLowerCase().split(',');
              return searchTags.some(t => gameTags.includes(t));
            }) : [];
          game = filteredGames && filteredGames[gameIndex];
        }
        
        if (game && game.localizedTitles && game.localizedTitles[langCode]) {
          element.textContent = game.localizedTitles[langCode];
        }
      } catch (error) {
        console.error('翻译游戏标题时出错:', error);
      }
    }
  });
  
  // 如果存在游戏卡片，重新渲染它们
  if (window.originalGames && window.localizeGamesData) {
    // 重新处理本地化游戏数据
    if (window.allGames) {
      window.allGames = window.localizeGamesData(window.originalGames);
    }
    
    // 重新加载收藏和最近玩过的游戏
    if (window.loadFavoriteGames) window.loadFavoriteGames();
    if (window.loadRecentlyPlayedGames) window.loadRecentlyPlayedGames();
    
    // 重新渲染游戏
    if (window.renderAllGames) window.renderAllGames();
  }
  
  // 修复页面布局问题
  setTimeout(() => {
    fixLayoutIssues();
  }, 100);
}

/**
 * 从嵌套对象中获取翻译
 * @param {Object} langData 语言数据
 * @param {string} key 点分隔的键
 * @returns {string|undefined} 翻译文本
 */
function getTranslation(langData, key) {
  if (!key || !langData) return undefined;
  
  const parts = key.split('.');
  let result = langData;
  
  for (const part of parts) {
    if (result[part] === undefined) {
      // 不输出警告，静默返回undefined
      return undefined;
    }
    result = result[part];
  }
  
  return result;
}

/**
 * 获取当前语言的翻译
 * @param {string} key 翻译键
 * @returns {string|undefined} 翻译文本
 */
function getCurrentTranslation(key) {
  const langCode = currentLanguage;
  const langData = supportedLanguages[langCode]?.data || supportedLanguages[DEFAULT_LANGUAGE].data;
  return getTranslation(langData, key);
}

/**
 * 设置语言选择器
 */
function setupLanguageSelector() {
  // 添加语言选择器样式
  addLanguageSelectorStyles();
  
  // 为语言菜单项添加点击事件
  const languageMenu = document.getElementById('language-menu');
  if (languageMenu) {
    languageMenu.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // 获取语言下拉菜单
      const languageSelector = document.getElementById('language-selector');
      if (languageSelector) {
        // 切换下拉菜单的显示状态
        languageSelector.classList.toggle('active');
        console.log('语言选择器状态切换:', languageSelector.classList.contains('active'));
      } else {
        console.error('找不到语言选择器元素 #language-selector');
      }
    });
  } else {
    console.error('找不到语言菜单按钮 #language-menu');
  }
  
  // 为语言选项添加点击事件
  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const langCode = this.getAttribute('data-lang');
      console.log('选择语言:', langCode);
      
      // 立即更新语言选择器显示
      const currentLanguageFlag = document.getElementById('current-language-flag');
      const currentLanguageName = document.getElementById('current-language-name');
      
      if (currentLanguageFlag && currentLanguageName && supportedLanguages[langCode]) {
        currentLanguageFlag.textContent = supportedLanguages[langCode].flag;
        currentLanguageName.textContent = supportedLanguages[langCode].name;
      }
      
      // 更改语言
      changeLanguage(langCode);
      
      // 关闭选择器
      const languageSelector = document.getElementById('language-selector');
      if (languageSelector) {
        languageSelector.classList.remove('active');
      }
    });
  });
  
  // 关闭按钮事件
  const closeLanguageSelector = document.getElementById('close-language-selector');
  if (closeLanguageSelector) {
    closeLanguageSelector.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const languageSelector = document.getElementById('language-selector');
      if (languageSelector) {
        languageSelector.classList.remove('active');
      }
    });
  } else {
    console.warn('找不到关闭语言选择器按钮 #close-language-selector');
  }
  
  // 点击外部关闭选择器
  document.addEventListener('click', function(e) {
    const selector = document.getElementById('language-selector');
    const langMenu = document.getElementById('language-menu');
    
    if (selector && selector.classList.contains('active') && 
        !selector.contains(e.target) && (!langMenu || !langMenu.contains(e.target))) {
      selector.classList.remove('active');
    }
  });
  
  // 更新选择器显示当前语言
  updateLanguageSelector(currentLanguage);
}

/**
 * 添加语言选择器样式
 */
function addLanguageSelectorStyles() {
  // 检查是否已存在样式
  if (document.getElementById('language-selector-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'language-selector-styles';
  style.textContent = `
    /* 语言选择器样式已在主CSS中定义，这里只添加可能缺失的样式 */
    .language-selector-container {
      position: relative;
    }
    
    .language-dropdown.active {
      max-height: 300px;
      opacity: 1;
      visibility: visible;
    }
  `;
  document.head.appendChild(style);
}

/**
 * 切换语言选择器显示状态
 * @param {boolean|undefined} forceState 强制设置状态
 */
function toggleLanguageSelector(forceState) {
  const selector = document.getElementById('language-selector');
  if (!selector) return;
  
  if (forceState !== undefined) {
    selector.classList.toggle('active', forceState);
  } else {
    selector.classList.toggle('active');
  }
}

/**
 * 更新语言选择器以反映当前选择的语言
 * @param {string} langCode 语言代码
 */
function updateLanguageSelector(langCode) {
  // 移除所有active类
  document.querySelectorAll('.language-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // 为当前语言添加active类
  const currentOption = document.querySelector(`.language-option[data-lang="${langCode}"]`);
  if (currentOption) {
    currentOption.classList.add('active');
  }
  
  // 更新顶部语言按钮显示
  const currentLanguageFlag = document.getElementById('current-language-flag');
  const currentLanguageName = document.getElementById('current-language-name');
  
  if (currentLanguageFlag && currentLanguageName && supportedLanguages[langCode]) {
    currentLanguageFlag.textContent = supportedLanguages[langCode].flag;
    currentLanguageName.textContent = supportedLanguages[langCode].name;
  }
  
  // 确保页脚和侧边栏正确显示
  setTimeout(() => {
    fixLayoutIssues();
  }, 100);
}

/**
 * 处理URL中的语言参数
 */
function handleUrlLanguage() {
  // 检查URL是否包含语言参数
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && supportedLanguages[langParam]) {
    // URL指定了支持的语言
    changeLanguage(langParam);
    // 确保更新了语言选择器
    updateLanguageSelector(langParam);
  } else {
    // 没有指定语言，使用当前语言更新URL
    updateUrlLanguage(currentLanguage);
  }
}

/**
 * 更新URL中的语言参数
 * @param {string} langCode 语言代码
 */
function updateUrlLanguage(langCode) {
  // 避免在初始化时修改历史记录
  if (!window.history) return;
  
  const url = new URL(window.location);
  url.searchParams.set('lang', langCode);
  
  try {
    history.replaceState({}, '', url);
  } catch (e) {
    console.warn('无法更新URL语言参数:', e);
  }
}

/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @param {Object} options 格式化选项
 * @returns {string} 格式化后的日期
 */
function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString(currentLanguage, options);
}

/**
 * 格式化数字
 * @param {number} number 数字
 * @param {Object} options 格式化选项
 * @returns {string} 格式化后的数字
 */
function formatNumber(number, options = {}) {
  return new Intl.NumberFormat(currentLanguage, options).format(number);
}

// 将changeLanguage和getTranslation函数暴露到全局作用域
window.changeLanguage = changeLanguage;
window.getTranslation = getCurrentTranslation;

// 添加调试函数，确保语言选择器正确显示
window.debugLanguageSelector = function() {
  console.log('当前语言:', currentLanguage);
  console.log('localStorage语言:', localStorage.getItem('language'));
  console.log('HTML lang属性:', document.documentElement.getAttribute('lang'));
  console.log('HTML data-lang属性:', document.documentElement.getAttribute('data-lang'));
  
  const currentFlag = document.getElementById('current-language-flag');
  const currentName = document.getElementById('current-language-name');
  const languageSelector = document.getElementById('language-selector');
  
  if (currentFlag && currentName) {
    console.log('当前显示的语言标志:', currentFlag.textContent);
    console.log('当前显示的语言名称:', currentName.textContent);
  } else {
    console.error('找不到语言标志或名称元素');
  }
  
  if (languageSelector) {
    console.log('语言选择器状态:', languageSelector.classList.contains('active') ? '激活' : '未激活');
    console.log('语言选择器可见性:', window.getComputedStyle(languageSelector).visibility);
    console.log('语言选择器不透明度:', window.getComputedStyle(languageSelector).opacity);
    console.log('语言选择器最大高度:', window.getComputedStyle(languageSelector).maxHeight);
  } else {
    console.error('找不到语言选择器元素');
  }
  
  // 强制更新语言选择器
  updateLanguageSelector(currentLanguage);
  
  // 尝试切换语言选择器
  if (languageSelector) {
    languageSelector.classList.add('active');
    console.log('已强制激活语言选择器');
  }
  
  return '语言选择器已更新并激活';
};

// 添加全局切换语言选择器函数
window.toggleLanguageDropdown = function() {
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.classList.toggle('active');
    console.log('手动切换语言选择器状态:', languageSelector.classList.contains('active') ? '激活' : '未激活');
    return true;
  }
  console.error('找不到语言选择器元素');
  return false;
};

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initI18n();
  
  // 确保语言选择器正确显示
  setTimeout(function() {
    updateLanguageSelector(currentLanguage);
    console.log('语言初始化完成，当前语言:', currentLanguage);
  }, 500);
});

/**
 * 修复页面布局问题，确保页脚和侧边栏正确显示
 */
function fixLayoutIssues() {
  try {
    console.log('正在修复布局问题...');
    
    // 修复页脚与内容的衔接问题
    const mainContent = document.querySelector('.main-content');
    const container = document.querySelector('.container');
    const siteFooter = document.querySelector('.site-footer');
    
    if (mainContent && siteFooter && container) {
      // 确保页脚不在main-content内部
      if (mainContent.contains(siteFooter)) {
        // 将页脚移到container外部
        container.parentNode.insertBefore(siteFooter, container.nextSibling);
        console.log('已将页脚移到container外部');
      }
      
      // 调整页脚上边距，确保与内容有适当间距
      siteFooter.style.marginTop = '60px';
    }
    
    // 修复侧边栏显示问题
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      // 确保侧边栏高度正确
      sidebar.style.height = '100vh';
      
      // 刷新侧边栏状态
      const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
      
      // 刷新侧边栏切换按钮状态
      const sidebarToggle = document.getElementById('sidebar-toggle');
      if (sidebarToggle) {
        if (sidebarCollapsed) {
          sidebarToggle.classList.remove('expanded');
        } else {
          sidebarToggle.classList.add('expanded');
        }
      }
    }
    
    // 修复语言选择器问题
    const languageSelector = document.getElementById('language-selector');
    const languageOptions = document.querySelector('.language-options');
    
    if (languageSelector && languageOptions) {
      // 确保语言选择器正确显示
      const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
      
      // 移除所有active类
      document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
      });
      
      // 为当前语言添加active类
      const currentOption = document.querySelector(`.language-option[data-lang="${currentLang}"]`);
      if (currentOption) {
        currentOption.classList.add('active');
      }
      
      // 更新顶部语言按钮显示
      const currentLanguageFlag = document.getElementById('current-language-flag');
      const currentLanguageName = document.getElementById('current-language-name');
      
      if (currentLanguageFlag && currentLanguageName && supportedLanguages[currentLang]) {
        currentLanguageFlag.textContent = supportedLanguages[currentLang].flag;
        currentLanguageName.textContent = supportedLanguages[currentLang].name;
      }
    }
    
    // 强制重新计算布局
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    console.log('布局修复完成');
  } catch (error) {
    console.error('修复布局时出错:', error);
  }
}

// 导出国际化函数
export {
  changeLanguage,
  formatDate,
  formatNumber,
  getTranslation,
  currentLanguage
}; 