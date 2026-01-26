/**
 * Promps Phase 6 - Main JavaScript
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
 * Validate DSL sequence for grammar errors
 */
async function validateDsl(input) {
    try {
        const result = await invoke('validate_dsl_sequence', { input });
        console.log('Validation result:', result);
        return result;
    } catch (error) {
        console.error('Failed to validate DSL:', error);
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
        // Clear validation display
        if (window.validationUI) {
            window.validationUI.clear();
        }
        return;
    }

    try {
        // Generate prompt from DSL code
        const prompt = await generatePrompt(dslCode);

        // Update preview
        previewDiv.textContent = prompt;

        // Validate DSL sequence
        const validationResult = await validateDsl(dslCode);

        // Display validation result
        if (window.validationUI) {
            window.validationUI.displayResult(validationResult);

            // Build block positions and highlight errors
            const blockPositions = window.validationUI.buildBlockPositions();
            window.validationUI.highlightBlocks(validationResult, blockPositions);
        }

        // Analyze patterns and show suggestions (Phase 6 Step 3)
        if (window.patternUI) {
            await window.patternUI.analyzeCurrent(dslCode);
        }
    } catch (error) {
        previewDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    }
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', async (e) => {
        // Ctrl+N: New Project
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            if (window.projectManager) {
                await window.projectManager.newProject();
            }
        }

        // Ctrl+O: Open Project
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            if (window.projectManager) {
                await window.projectManager.loadProject();
            }
        }

        // Ctrl+S: Save Project
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            if (window.projectManager) {
                await window.projectManager.saveProject(false);
            }
        }

        // Ctrl+Shift+S: Save As
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            if (window.projectManager) {
                await window.projectManager.saveProject(true);
            }
        }
    });

    console.log('Keyboard shortcuts initialized');
}

/**
 * Initialize toolbar button event listeners
 */
function initToolbarButtons() {
    // New button
    const btnNew = document.getElementById('btnNew');
    if (btnNew) {
        btnNew.addEventListener('click', async () => {
            if (window.projectManager) {
                await window.projectManager.newProject();
            }
        });
    }

    // Open button
    const btnOpen = document.getElementById('btnOpen');
    if (btnOpen) {
        btnOpen.addEventListener('click', async () => {
            if (window.projectManager) {
                await window.projectManager.loadProject();
            }
        });
    }

    // Save button
    const btnSave = document.getElementById('btnSave');
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            if (window.projectManager) {
                await window.projectManager.saveProject(false);
            }
        });
    }

    // Save As button
    const btnSaveAs = document.getElementById('btnSaveAs');
    if (btnSaveAs) {
        btnSaveAs.addEventListener('click', async () => {
            if (window.projectManager) {
                await window.projectManager.saveProject(true);
            }
        });
    }

    console.log('Toolbar buttons initialized');
}

/**
 * Handle beforeunload event (warn about unsaved changes)
 */
function initBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
        if (window.projectManager && window.projectManager.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });
}

/**
 * Initialize application
 */
async function init() {
    console.log('Promps Phase 6 initialized');

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

    // Initialize Project Manager
    if (window.projectManager && typeof window.projectManager.init === 'function') {
        await window.projectManager.init();
    }

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();

    // Initialize toolbar buttons
    initToolbarButtons();

    // Initialize beforeunload handler
    initBeforeUnload();

    // Load pattern templates (Phase 6 Step 3)
    if (window.patternUI && typeof window.patternUI.loadPatterns === 'function') {
        await window.patternUI.loadPatterns();
        console.log('Pattern templates loaded');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
