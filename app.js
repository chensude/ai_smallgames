/**
 * Easy Game Find - 主要JavaScript应用逻辑
 * 
 * 本文件包含Easy Game Find应用的核心功能，包括：
 * - 游戏数据加载和管理
 * - 用户界面交互处理
 * - 游戏过滤和搜索功能
 * - 游戏收藏和历史记录功能
 * - 本地存储数据持久化
 * 
 * 代码遵循ES6+标准，使用了现代JavaScript特性，如Promises、
 * arrow functions、template literals和localStorage API等。
 * 
 * @version 1.0.0
 * @license MIT
 * @author Easy Game Find Team
 */

// Game data cache
let allGames = [];
let filteredGames = [];
let categories = {};
let featuredGame = null;

// DOM Elements
const popularGamesContainer = document.getElementById('popular-games');
const newGamesContainer = document.getElementById('new-games');
const gameModal = document.getElementById('game-modal');
const gameIframe = document.getElementById('game-iframe');
const searchInput = document.getElementById('search-input');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Fetch games data
    fetchGamesData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize search functionality
    initSearch();
});

/**
 * Fetch games data from API
 */
function fetchGamesData() {
    fetch('url.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(games => {
            // Store all games
            allGames = games;
            filteredGames = games;
            
            // Extract categories from games
            extractCategories();
            
            // Set featured game
            setFeaturedGame();
            
            // Render games
            renderPopularGames();
            renderNewGames();
            
            // Remove loading states
            removeLoadingStates();
        })
        .catch(error => {
            console.error('Error fetching games data:', error);
            showErrorMessage('Failed to load games. Please try again later.');
        });
}

/**
 * Extract unique categories from game tags
 */
function extractCategories() {
    allGames.forEach(game => {
        if (game.tags) {
            const tags = game.tags.split(',');
            tags.forEach(tag => {
                const trimmedTag = tag.trim();
                if (!categories[trimmedTag]) {
                    categories[trimmedTag] = 0;
                }
                categories[trimmedTag]++;
            });
        }
    });
}

/**
 * Set featured game (randomly select from top 5 popular games)
 */
function setFeaturedGame() {
    // Sort games by popularity (assuming we have a popularity metric)
    // For now, just pick a random game from the first 5
    const randomIndex = Math.floor(Math.random() * Math.min(5, allGames.length));
    featuredGame = allGames[randomIndex];
    
    // Update featured game section
    updateFeaturedGameSection();
}

/**
 * Update featured game section with selected game
 */
function updateFeaturedGameSection() {
    if (!featuredGame) return;
    
    const featuredGameTitle = document.getElementById('featured-game-title');
    const featuredGameDescription = document.getElementById('featured-game-description');
    const featuredGameImage = document.getElementById('featured-game-image');
    const featuredGameTags = document.getElementById('featured-game-tags');
    const playFeaturedButton = document.getElementById('play-featured');
    
    // Update content
    featuredGameTitle.textContent = featuredGame.title;
    featuredGameDescription.textContent = featuredGame.description;
    featuredGameImage.innerHTML = `
        <img src="${featuredGame.image}" alt="${featuredGame.title}" class="w-full h-full object-cover">
    `;
    
    // Clear existing tags
    featuredGameTags.innerHTML = '';
    
    // Add tags
    if (featuredGame.tags) {
        const tags = featuredGame.tags.split(',');
        tags.forEach(tag => {
            const trimmedTag = tag.trim();
            const tagElement = document.createElement('span');
            tagElement.className = 'px-3 py-1 bg-apple-gray-200 text-apple-gray-700 rounded-full text-sm';
            tagElement.textContent = trimmedTag;
            featuredGameTags.appendChild(tagElement);
        });
    }
    
    // Set up play button
    playFeaturedButton.onclick = () => openGameModal(featuredGame);
}

/**
 * Render popular games section
 */
function renderPopularGames() {
    if (!popularGamesContainer) return;
    
    // Clear container
    popularGamesContainer.innerHTML = '';
    
    // Get popular games (first 8)
    const popularGames = filteredGames.slice(0, 8);
    
    // Render each game card
    popularGames.forEach(game => {
        const gameCard = createGameCard(game);
        popularGamesContainer.appendChild(gameCard);
    });
}

/**
 * Render new games section
 */
function renderNewGames() {
    if (!newGamesContainer) return;
    
    // Clear container
    newGamesContainer.innerHTML = '';
    
    // Get new games (next 8 games)
    const newGames = filteredGames.slice(8, 16);
    
    // Render each game card
    newGames.forEach(game => {
        const gameCard = createGameCard(game);
        newGamesContainer.appendChild(gameCard);
    });
}

/**
 * Create a game card element
 * @param {Object} game - Game data object
 * @returns {HTMLElement} Game card element
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-smooth';
    
    // Create card HTML
    card.innerHTML = `
        <div class="relative h-40 bg-apple-gray-300">
            <img src="${game.image}" alt="${game.title}" class="game-card-image w-full h-full object-cover transition-smooth">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div class="p-4 text-white">
                    <h3 class="font-bold">${game.title}</h3>
                </div>
            </div>
        </div>
        <div class="p-4">
            <p class="text-apple-gray-700 text-sm h-12 overflow-hidden">${game.description.substring(0, 60)}${game.description.length > 60 ? '...' : ''}</p>
            <button class="play-button mt-3 w-full px-4 py-2 bg-apple-blue text-white rounded-full font-medium hover:bg-blue-600 transition-smooth flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                Play Now
            </button>
        </div>
    `;
    
    // Add click event to play button
    card.querySelector('.play-button').addEventListener('click', () => {
        openGameModal(game);
    });
    
    return card;
}

/**
 * Open game modal to play a game
 * @param {Object} game - Game data object
 */
function openGameModal(game) {
    if (!gameModal || !gameIframe) return;
    
    // Update modal title
    document.getElementById('modal-game-title').textContent = game.title;
    
    // Set iframe source
    gameIframe.src = game.embed;
    
    // Show modal
    gameModal.classList.remove('hidden');
    gameModal.classList.add('game-modal-container');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add structured data for the game (for SEO)
    addGameStructuredData(game);
}

/**
 * Close game modal
 */
function closeGameModal() {
    if (!gameModal || !gameIframe) return;
    
    // Clear iframe source to stop the game
    gameIframe.src = '';
    
    // Hide modal
    gameModal.classList.add('hidden');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Remove structured data
    removeGameStructuredData();
}

/**
 * Add structured data for a game (for SEO)
 * @param {Object} game - Game data object
 */
function addGameStructuredData(game) {
    // Remove any existing structured data
    removeGameStructuredData();
    
    // Create structured data script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'game-structured-data';
    
    // Create structured data object
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        'name': game.title,
        'description': game.description,
        'image': game.image,
        'playMode': 'SinglePlayer',
        'applicationCategory': 'Browser Game',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock'
        }
    };
    
    // Add genre if tags are available
    if (game.tags) {
        const tags = game.tags.split(',');
        structuredData.genre = tags.map(tag => tag.trim());
    }
    
    // Set script content
    script.textContent = JSON.stringify(structuredData);
    
    // Add to document head
    document.head.appendChild(script);
}

/**
 * Remove game structured data
 */
function removeGameStructuredData() {
    const existingScript = document.getElementById('game-structured-data');
    if (existingScript) {
        existingScript.remove();
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Reset to all games
            filteredGames = allGames;
        } else {
            // Filter games by title and description
            filteredGames = allGames.filter(game => {
                return (
                    game.title.toLowerCase().includes(searchTerm) ||
                    game.description.toLowerCase().includes(searchTerm) ||
                    (game.tags && game.tags.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        // Re-render game sections
        renderPopularGames();
        renderNewGames();
    }, 300));
}

/**
 * Filter games by category
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
    if (category === 'all') {
        filteredGames = allGames;
    } else {
        filteredGames = allGames.filter(game => {
            return game.tags && game.tags.toLowerCase().includes(category.toLowerCase());
        });
    }
    
    // Re-render game sections
    renderPopularGames();
    renderNewGames();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Close modal button
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeGameModal);
    }
    
    // Category links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Handle escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGameModal();
        }
    });
}

/**
 * Remove loading states from the UI
 */
function removeLoadingStates() {
    // Remove loading classes and placeholders
    document.querySelectorAll('.animate-pulse').forEach(el => {
        el.classList.remove('animate-pulse');
    });
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-apple-red/10 border border-apple-red text-apple-red px-4 py-3 rounded-lg my-4';
    errorElement.textContent = message;
    
    // Add to containers
    if (popularGamesContainer) {
        popularGamesContainer.innerHTML = '';
        popularGamesContainer.appendChild(errorElement.cloneNode(true));
    }
    
    if (newGamesContainer) {
        newGamesContainer.innerHTML = '';
        newGamesContainer.appendChild(errorElement);
    }
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 