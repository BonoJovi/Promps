/**
 * Promps Phase 5 - Validation UI
 *
 * This file handles displaying validation results in the UI
 * and highlighting blocks with errors.
 */

/**
 * Validation UI Manager
 */
const validationUI = {
    /**
     * Display validation result in the UI
     * @param {Object} result - ValidationResult from backend
     */
    displayResult: function(result) {
        const container = document.getElementById('validationResult');
        if (!container) {
            console.warn('Validation result container not found');
            return;
        }

        // Clear previous content
        container.innerHTML = '';

        if (result.isValid && result.warningCount === 0) {
            // Success state
            container.className = 'validation-result validation-success';
            container.innerHTML = '<span class="validation-icon">&#10003;</span> Grammar check passed';
        } else if (result.errorCount > 0) {
            // Error state
            container.className = 'validation-result validation-error';
            this.renderErrors(container, result);
        } else if (result.warningCount > 0) {
            // Warning only state
            container.className = 'validation-result validation-warning';
            this.renderErrors(container, result);
        }
    },

    /**
     * Render error list
     * @param {HTMLElement} container - Container element
     * @param {Object} result - ValidationResult
     */
    renderErrors: function(container, result) {
        // Summary line
        const summary = document.createElement('div');
        summary.className = 'validation-summary';

        const parts = [];
        if (result.errorCount > 0) {
            parts.push(`${result.errorCount} error${result.errorCount > 1 ? 's' : ''}`);
        }
        if (result.warningCount > 0) {
            parts.push(`${result.warningCount} warning${result.warningCount > 1 ? 's' : ''}`);
        }

        const icon = result.errorCount > 0 ? '&#10007;' : '&#9888;';
        summary.innerHTML = `<span class="validation-icon">${icon}</span> ${parts.join(', ')}`;
        container.appendChild(summary);

        // Error list
        const list = document.createElement('ul');
        list.className = 'validation-error-list';

        for (const error of result.errors) {
            const item = document.createElement('li');
            item.className = `validation-item validation-${error.severity}`;

            // Message
            const message = document.createElement('span');
            message.className = 'validation-message';
            message.textContent = error.message;
            item.appendChild(message);

            // Suggestion (if available)
            if (error.suggestion) {
                const suggestion = document.createElement('span');
                suggestion.className = 'validation-suggestion';
                suggestion.textContent = ` → ${error.suggestion}`;
                item.appendChild(suggestion);
            }

            list.appendChild(item);
        }

        container.appendChild(list);
    },

    /**
     * Clear validation display
     */
    clear: function() {
        const container = document.getElementById('validationResult');
        if (container) {
            container.className = 'validation-result';
            container.innerHTML = '';
        }

        // Clear any block highlights
        this.clearBlockHighlights();
    },

    /**
     * Highlight blocks with errors in the Blockly workspace
     * @param {Object} result - ValidationResult from backend
     * @param {Array} blockPositions - Map of token positions to block IDs
     */
    highlightBlocks: function(result, blockPositions) {
        // Clear existing highlights
        this.clearBlockHighlights();

        if (!workspace || !result.errors || result.errors.length === 0) {
            return;
        }

        for (const error of result.errors) {
            const blockId = blockPositions[error.position];
            if (blockId) {
                const block = workspace.getBlockById(blockId);
                if (block) {
                    // Set warning text on block
                    block.setWarningText(error.message);

                    // Add CSS class for visual highlight
                    const svgRoot = block.getSvgRoot();
                    if (svgRoot) {
                        if (error.severity === 'error') {
                            svgRoot.classList.add('validation-block-error');
                        } else {
                            svgRoot.classList.add('validation-block-warning');
                        }
                    }
                }
            }
        }
    },

    /**
     * Clear all block highlights
     */
    clearBlockHighlights: function() {
        if (!workspace) {
            return;
        }

        const allBlocks = workspace.getAllBlocks(false);
        for (const block of allBlocks) {
            // Clear warning text
            block.setWarningText(null);

            // Remove CSS classes
            const svgRoot = block.getSvgRoot();
            if (svgRoot) {
                svgRoot.classList.remove('validation-block-error');
                svgRoot.classList.remove('validation-block-warning');
            }
        }
    },

    /**
     * Build block position mapping from workspace
     * Maps token positions to block IDs for error highlighting
     * @returns {Object} Map of position -> blockId
     */
    buildBlockPositions: function() {
        if (!workspace) {
            return {};
        }

        const positions = {};
        const topBlocks = workspace.getTopBlocks(true);
        let position = 0;

        for (const topBlock of topBlocks) {
            let block = topBlock;
            while (block) {
                // Each block represents one token position
                positions[position] = block.id;
                position++;
                block = block.getNextBlock();
            }
        }

        return positions;
    }
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.validationUI = validationUI;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validationUI };
}
