/**
 * Promps - Blockly.js Configuration
 *
 * This file defines custom blocks and initializes the Blockly workspace.
 */

// Global workspace variable
let workspace = null;

// Create JavaScript generator
const javascriptGenerator = Blockly.JavaScript || new Blockly.Generator('JavaScript');

/**
 * Define custom "Noun" block
 */
Blockly.Blocks['promps_noun'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("名詞:")
            .appendField(new Blockly.FieldTextInput("User"), "TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120); // Green color
        this.setTooltip("名詞ブロック (_N: プレフィックス付き)");
        this.setHelpUrl("");
    }
};

/**
 * Generate DSL code from Noun block
 */
javascriptGenerator.forBlock['promps_noun'] = function(block, generator) {
    const text = block.getFieldValue('TEXT');
    // Add _N: prefix for noun marking
    return '_N:' + text + ' ';
};

/**
 * Define custom "Other" block
 * For particles, verbs, adjectives, and connectives
 */
Blockly.Blocks['promps_other'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("その他:")
            .appendField(new Blockly.FieldTextInput("が"), "TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230); // Blue color
        this.setTooltip("その他ブロック (助詞、動詞、形容詞、接続詞など)");
        this.setHelpUrl("");
    }
};

/**
 * Generate DSL code from Other block
 */
javascriptGenerator.forBlock['promps_other'] = function(block, generator) {
    const text = block.getFieldValue('TEXT');
    // No prefix for other blocks
    return text + ' ';
};

/**
 * Initialize Blockly workspace
 */
function initBlockly() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    // Remove placeholder
    blocklyDiv.innerHTML = '';

    // Toolbox definition
    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
            {
                "kind": "category",
                "name": "基本ブロック",
                "colour": "120",
                "contents": [
                    {
                        "kind": "block",
                        "type": "promps_noun"
                    },
                    {
                        "kind": "block",
                        "type": "promps_other"
                    }
                ]
            }
        ]
    };

    // Workspace options
    const options = {
        toolbox: toolbox,
        collapse: false,
        comments: false,
        disable: false,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://unpkg.com/blockly/media/',
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        }
    };

    // Inject Blockly workspace
    workspace = Blockly.inject(blocklyDiv, options);

    // Add change listener for real-time preview
    workspace.addChangeListener(onBlocklyChange);

    console.log('Blockly workspace initialized');
}

/**
 * Handle Blockly workspace changes
 */
function onBlocklyChange(event) {
    // Ignore UI events
    if (event.type === Blockly.Events.UI) {
        return;
    }

    // Generate DSL code
    const code = javascriptGenerator.workspaceToCode(workspace);

    // Update preview (will be implemented in main.js)
    if (typeof updatePreview === 'function') {
        updatePreview(code.trim());
    }
}

/**
 * Get DSL code from current workspace
 */
function getWorkspaceCode() {
    if (!workspace) {
        return '';
    }
    return javascriptGenerator.workspaceToCode(workspace).trim();
}
