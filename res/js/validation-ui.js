/**
 * Promps Phase 5-6 - Validation UI
 *
 * This file handles displaying validation results in the UI,
 * highlighting blocks with errors, and applying auto-fixes.
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

            // Auto-fix button (if available)
            if (error.autofix) {
                const fixBtn = document.createElement('button');
                fixBtn.className = 'validation-fix-btn';
                fixBtn.textContent = error.autofix.label;
                fixBtn.addEventListener('click', () => {
                    this.applyAutoFix(error.autofix);
                });
                item.appendChild(fixBtn);
            } else if (error.suggestion) {
                // Suggestion text (only if no autofix)
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
    },

    /**
     * Apply an auto-fix action
     * @param {Object} autofix - AutoFixAction from backend
     */
    applyAutoFix: function(autofix) {
        if (!workspace) {
            console.warn('Workspace not available for auto-fix');
            return;
        }

        try {
            // IMPORTANT: Build block positions BEFORE creating the new block
            const blockPositions = this.buildBlockPositions();
            const targetBlockId = blockPositions[autofix.targetPosition];

            // Create the new block
            const newBlock = workspace.newBlock(autofix.blockType);
            newBlock.initSvg();
            newBlock.render();

            if (targetBlockId) {
                const targetBlock = workspace.getBlockById(targetBlockId);
                if (targetBlock) {
                    if (autofix.actionType === 'insert_before') {
                        this.insertBlockBefore(newBlock, targetBlock);
                    } else if (autofix.actionType === 'insert_after') {
                        this.insertBlockAfter(newBlock, targetBlock);
                    }
                } else {
                    // Target block not found, place at workspace origin
                    this.placeBlockAtOrigin(newBlock);
                }
            } else {
                // No blocks in workspace, place at origin
                this.placeBlockAtOrigin(newBlock);
            }

            // Trigger workspace change event to update preview
            workspace.fireChangeListener(new Blockly.Events.BlockCreate(newBlock));

        } catch (error) {
            console.error('Failed to apply auto-fix:', error);
        }
    },

    /**
     * Insert a new block before a target block
     * @param {Blockly.Block} newBlock - Block to insert
     * @param {Blockly.Block} targetBlock - Block to insert before
     */
    insertBlockBefore: function(newBlock, targetBlock) {
        // Get the previous block (if any)
        const previousBlock = targetBlock.getPreviousBlock();

        // First, disconnect target from its previous block
        if (targetBlock.previousConnection && targetBlock.previousConnection.isConnected()) {
            targetBlock.previousConnection.disconnect();
        }

        // Position the new block near the target
        const targetXY = targetBlock.getRelativeToSurfaceXY();
        newBlock.moveBy(targetXY.x, targetXY.y);

        // Connect new block to target (new block's next -> target's previous)
        if (newBlock.nextConnection && targetBlock.previousConnection) {
            newBlock.nextConnection.connect(targetBlock.previousConnection);
        }

        // Connect previous block to new block (if there was one)
        if (previousBlock && previousBlock.nextConnection && newBlock.previousConnection) {
            previousBlock.nextConnection.connect(newBlock.previousConnection);
        }
    },

    /**
     * Insert a new block after a target block
     * @param {Blockly.Block} newBlock - Block to insert
     * @param {Blockly.Block} targetBlock - Block to insert after
     */
    insertBlockAfter: function(newBlock, targetBlock) {
        // Get the next block (if any)
        const nextBlock = targetBlock.getNextBlock();

        // First, disconnect target from its next block
        if (targetBlock.nextConnection && targetBlock.nextConnection.isConnected()) {
            targetBlock.nextConnection.disconnect();
        }

        // Position the new block near the target
        const targetXY = targetBlock.getRelativeToSurfaceXY();
        newBlock.moveBy(targetXY.x, targetXY.y + 40);

        // Connect target to new block (target's next -> new block's previous)
        if (targetBlock.nextConnection && newBlock.previousConnection) {
            targetBlock.nextConnection.connect(newBlock.previousConnection);
        }

        // Connect new block to original next block (if there was one)
        if (nextBlock && newBlock.nextConnection && nextBlock.previousConnection) {
            newBlock.nextConnection.connect(nextBlock.previousConnection);
        }
    },

    /**
     * Place a block at the workspace origin
     * @param {Blockly.Block} block - Block to place
     */
    placeBlockAtOrigin: function(block) {
        block.moveBy(50, 50);
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
