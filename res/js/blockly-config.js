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

// ============================================================================
// Particle Blocks (助詞ブロック)
// ============================================================================

/**
 * Particle: が (subject marker)
 */
Blockly.Blocks['promps_particle_ga'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("が"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: が（主語を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_ga'] = function(block, generator) {
    return 'が ';
};

/**
 * Particle: を (object marker)
 */
Blockly.Blocks['promps_particle_wo'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("を"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: を（目的語を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_wo'] = function(block, generator) {
    return 'を ';
};

/**
 * Particle: に (direction/target marker)
 */
Blockly.Blocks['promps_particle_ni'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("に"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: に（方向・対象を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_ni'] = function(block, generator) {
    return 'に ';
};

/**
 * Particle: で (means/location marker)
 */
Blockly.Blocks['promps_particle_de'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("で"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: で（手段・場所を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_de'] = function(block, generator) {
    return 'で ';
};

/**
 * Particle: と (and/with marker)
 */
Blockly.Blocks['promps_particle_to'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("と"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: と（並列・共同を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_to'] = function(block, generator) {
    return 'と ';
};

/**
 * Particle: へ (direction marker)
 */
Blockly.Blocks['promps_particle_he'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("へ"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: へ（方向を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_he'] = function(block, generator) {
    return 'へ ';
};

/**
 * Particle: から (from marker)
 */
Blockly.Blocks['promps_particle_kara'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("から"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: から（起点を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_kara'] = function(block, generator) {
    return 'から ';
};

/**
 * Particle: まで (until marker)
 */
Blockly.Blocks['promps_particle_made'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("まで"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: まで（終点を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_made'] = function(block, generator) {
    return 'まで ';
};

/**
 * Particle: より (comparison marker)
 */
Blockly.Blocks['promps_particle_yori'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("より"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("助詞: より（比較を示す）");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_particle_yori'] = function(block, generator) {
    return 'より ';
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
            // Noun category
            {
                "kind": "category",
                "name": "名詞",
                "colour": "120",
                "contents": [
                    {
                        "kind": "block",
                        "type": "promps_noun"
                    }
                ]
            },
            // Particle category (collapsible)
            {
                "kind": "category",
                "name": "助詞",
                "colour": "230",
                "contents": [
                    {
                        "kind": "block",
                        "type": "promps_particle_ga"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_wo"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_ni"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_de"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_to"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_he"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_kara"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_made"
                    },
                    {
                        "kind": "block",
                        "type": "promps_particle_yori"
                    }
                ]
            },
            // Other category (for backward compatibility)
            {
                "kind": "category",
                "name": "その他",
                "colour": "290",
                "contents": [
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
