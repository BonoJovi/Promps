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
 * Initialize application
 */
async function init() {
    console.log('Promps Phase 1 initialized');

    // Initialize Tauri API
    if (window.__TAURI__) {
        invoke = window.__TAURI__.invoke;
        console.log('Tauri API loaded successfully');
    } else {
        console.error('Tauri API not available');
        return;
    }

    // Test button event listener
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', testConnection);
    }

    // TODO: Initialize Blockly.js workspace (Phase 1)
    // TODO: Setup block change listeners
    // TODO: Implement real-time preview
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
