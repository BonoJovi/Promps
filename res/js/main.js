/**
 * Promps Phase 1 - Main JavaScript
 *
 * This file handles frontend logic and Tauri command invocation.
 */

// Tauri API will be available after window loads
let invoke;

/**
 * Test Tauri connection
 */
async function testConnection() {
    try {
        const result = await invoke('greet', { name: 'Tauri' });
        console.log('Connection test result:', result);
        alert(result);
    } catch (error) {
        console.error('Failed to invoke command:', error);
        alert('Error: ' + error);
    }
}

/**
 * Generate prompt from DSL text
 */
async function generatePrompt(input) {
    try {
        const result = await invoke('generate_prompt_from_text', { input });
        console.log('Generated prompt:', result);
        return result;
    } catch (error) {
        console.error('Failed to generate prompt:', error);
        throw error;
    }
}

/**
 * Update preview pane with generated prompt
 */
async function updatePreview(dslCode) {
    const previewDiv = document.getElementById('promptPreview');

    if (!dslCode || dslCode.trim() === '') {
        previewDiv.innerHTML = '<p class="placeholder">Generated prompt will appear here.</p>';
        return;
    }

    try {
        // Generate prompt from DSL code
        const prompt = await generatePrompt(dslCode);

        // Update preview
        previewDiv.textContent = prompt;
    } catch (error) {
        previewDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    }
}

/**
 * Initialize application
 */
async function init() {
    console.log('Promps Phase 1 initialized');

    // Initialize Tauri API (v2 compatible)
    if (window.__TAURI_INTERNALS__) {
        // Tauri v2
        invoke = window.__TAURI_INTERNALS__.invoke;
        console.log('Tauri API v2 loaded successfully');
    } else if (window.__TAURI__) {
        // Tauri v1 (fallback)
        invoke = window.__TAURI__.invoke;
        console.log('Tauri API v1 loaded successfully');
    } else {
        console.error('Tauri API not available');
        console.log('Available globals:', Object.keys(window).filter(k => k.includes('TAURI')));
        // Continue anyway to initialize Blockly
    }

    // Test button event listener
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', testConnection);
    }

    // Initialize Blockly.js workspace
    if (typeof initBlockly === 'function') {
        initBlockly();
        console.log('Blockly workspace initialized');
    } else {
        console.error('initBlockly function not found');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
