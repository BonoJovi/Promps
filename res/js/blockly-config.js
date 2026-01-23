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

// ============================================================================
// Verb Blocks (動詞ブロック)
// ============================================================================

/**
 * Fixed Verb: 分析して (analyze)
 */
Blockly.Blocks['promps_verb_analyze'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("分析して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290); // Red color for verbs
        this.setTooltip("動詞: 分析して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_analyze'] = function(block, generator) {
    return '分析して ';
};

/**
 * Fixed Verb: 要約して (summarize)
 */
Blockly.Blocks['promps_verb_summarize'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("要約して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 要約して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_summarize'] = function(block, generator) {
    return '要約して ';
};

/**
 * Fixed Verb: 翻訳して (translate)
 */
Blockly.Blocks['promps_verb_translate'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("翻訳して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 翻訳して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_translate'] = function(block, generator) {
    return '翻訳して ';
};

/**
 * Custom Verb (user input)
 */
Blockly.Blocks['promps_verb_custom'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("動詞:")
            .appendField(new Blockly.FieldTextInput("作成して"), "TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("カスタム動詞ブロック");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_custom'] = function(block, generator) {
    const text = block.getFieldValue('TEXT');
    return text + ' ';
};

// ============================================================================
// Additional Verb Blocks (追加動詞ブロック) - Phase 3-2
// ============================================================================

/**
 * Fixed Verb: 作成して (create)
 */
Blockly.Blocks['promps_verb_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("作成して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 作成して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_create'] = function(block, generator) {
    return '作成して ';
};

/**
 * Fixed Verb: 生成して (generate)
 */
Blockly.Blocks['promps_verb_generate'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("生成して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 生成して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_generate'] = function(block, generator) {
    return '生成して ';
};

/**
 * Fixed Verb: 変換して (convert)
 */
Blockly.Blocks['promps_verb_convert'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("変換して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 変換して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_convert'] = function(block, generator) {
    return '変換して ';
};

/**
 * Fixed Verb: 削除して (delete)
 */
Blockly.Blocks['promps_verb_delete'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("削除して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 削除して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_delete'] = function(block, generator) {
    return '削除して ';
};

/**
 * Fixed Verb: 更新して (update)
 */
Blockly.Blocks['promps_verb_update'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("更新して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 更新して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_update'] = function(block, generator) {
    return '更新して ';
};

/**
 * Fixed Verb: 抽出して (extract)
 */
Blockly.Blocks['promps_verb_extract'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("抽出して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 抽出して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_extract'] = function(block, generator) {
    return '抽出して ';
};

/**
 * Fixed Verb: 説明して (explain)
 */
Blockly.Blocks['promps_verb_explain'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("説明して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 説明して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_explain'] = function(block, generator) {
    return '説明して ';
};

/**
 * Fixed Verb: 解説して (describe)
 */
Blockly.Blocks['promps_verb_describe'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("解説して"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 解説して");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_describe'] = function(block, generator) {
    return '解説して ';
};

/**
 * Fixed Verb: 教えて (teach)
 */
Blockly.Blocks['promps_verb_teach'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel("教えて"));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("動詞: 教えて");
        this.setHelpUrl("");
    }
};
javascriptGenerator.forBlock['promps_verb_teach'] = function(block, generator) {
    return '教えて ';
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
            // Verb category (collapsible)
            {
                "kind": "category",
                "name": "動詞",
                "colour": "290",
                "contents": [
                    // 分析系
                    {
                        "kind": "block",
                        "type": "promps_verb_analyze"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_summarize"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_translate"
                    },
                    // 変換・生成系
                    {
                        "kind": "block",
                        "type": "promps_verb_create"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_generate"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_convert"
                    },
                    // 操作系
                    {
                        "kind": "block",
                        "type": "promps_verb_delete"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_update"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_extract"
                    },
                    // 説明系
                    {
                        "kind": "block",
                        "type": "promps_verb_explain"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_describe"
                    },
                    {
                        "kind": "block",
                        "type": "promps_verb_teach"
                    },
                    // カスタム
                    {
                        "kind": "block",
                        "type": "promps_verb_custom"
                    }
                ]
            },
            // Other category (for backward compatibility)
            {
                "kind": "category",
                "name": "その他",
                "colour": "20",
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
    if (event.isUiEvent) {
        return;
    }

    // Only process events from main workspace
    if (!workspace || event.workspaceId !== workspace.id) {
        return;
    }

    let shouldMarkDirty = false;

    // Track newly created blocks (from flyout)
    // Map: blockId -> timerId (null if no timer yet)
    if (!window._newlyCreatedBlocks) {
        window._newlyCreatedBlocks = new Map();
    }

    // Create event - track as newly created
    if (event.type === Blockly.Events.BLOCK_CREATE) {
        window._newlyCreatedBlocks.set(event.blockId, null);
    }

    // Move event
    if (event.type === Blockly.Events.BLOCK_MOVE) {
        if (window._newlyCreatedBlocks.has(event.blockId)) {
            // Newly created block is being moved - schedule dirty after delay
            const existingTimer = window._newlyCreatedBlocks.get(event.blockId);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }
            const timerId = setTimeout(() => {
                if (window._newlyCreatedBlocks.has(event.blockId)) {
                    window._newlyCreatedBlocks.delete(event.blockId);
                    const block = workspace.getBlockById(event.blockId);
                    if (block && window.projectManager && typeof window.projectManager.markDirty === 'function') {
                        window.projectManager.markDirty();
                    }
                }
            }, 150);
            window._newlyCreatedBlocks.set(event.blockId, timerId);
        } else {
            // Existing block was moved
            shouldMarkDirty = true;
        }
    }

    // Delete event
    if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (window._newlyCreatedBlocks.has(event.blockId)) {
            // Cancel any pending timer - this was a cancelled drag
            const timerId = window._newlyCreatedBlocks.get(event.blockId);
            if (timerId) {
                clearTimeout(timerId);
            }
            window._newlyCreatedBlocks.delete(event.blockId);
        } else {
            // Real deletion of existing block
            shouldMarkDirty = true;
        }
    }

    // Field change event - always mark dirty
    if (event.type === Blockly.Events.BLOCK_CHANGE) {
        shouldMarkDirty = true;
    }

    if (shouldMarkDirty) {
        if (window.projectManager && typeof window.projectManager.markDirty === 'function') {
            window.projectManager.markDirty();
        }
    }

    // Generate DSL code only from connected block chains
    let code = '';
    const topBlocks = workspace.getTopBlocks(true);

    for (const block of topBlocks) {
        // Only process blocks that are part of a chain (have at least one connected block)
        // A standalone block (no next connection) is ignored
        if (block.getNextBlock() !== null) {
            code += javascriptGenerator.blockToCode(block);
        }
    }

    // Update preview (will be implemented in main.js)
    if (typeof updatePreview === 'function') {
        updatePreview(code.trim());
    }
}

/**
 * Get DSL code from current workspace (only from connected block chains)
 */
function getWorkspaceCode() {
    if (!workspace) {
        return '';
    }

    let code = '';
    const topBlocks = workspace.getTopBlocks(true);

    for (const block of topBlocks) {
        // Only process blocks that are part of a chain (have at least one connected block)
        if (block.getNextBlock() !== null) {
            code += javascriptGenerator.blockToCode(block);
        }
    }

    return code.trim();
}
