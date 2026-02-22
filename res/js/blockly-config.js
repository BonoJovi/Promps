/**
 * Promps - Blockly.js Configuration
 *
 * This file defines custom blocks and initializes the Blockly workspace.
 * Includes full i18n support for block labels, outputs, and tooltips.
 *
 * Japanese mode: generates Japanese prompts (SOV with particles)
 * English mode: generates English prompts (SVO)
 */

// Global workspace variable
let workspace = null;

// ========================================================================
// Template Manager - Save and reuse block groups (macros)
// ========================================================================

/**
 * Template Manager for saving and loading block templates
 * Stores templates in localStorage for persistence
 */
const templateManager = {
    STORAGE_KEY: 'promps-templates',

    /**
     * Get all saved templates
     * @returns {Array} Array of template objects
     */
    getTemplates() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Save a block chain as a template
     * @param {string} name - Template name
     * @param {Blockly.Block} block - Starting block of the chain
     */
    saveTemplate(name, block) {
        const templates = this.getTemplates();
        const blockJson = Blockly.serialization.blocks.save(block);

        templates.push({
            id: Date.now().toString(),
            name: name,
            blocks: blockJson,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
        this.refreshToolbox();
    },

    /**
     * Delete a template by ID
     * @param {string} id - Template ID
     */
    deleteTemplate(id) {
        const templates = this.getTemplates().filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));

        // Close the flyout first, then refresh toolbox
        if (workspace) {
            const toolbox = workspace.getToolbox();
            if (toolbox) {
                toolbox.clearSelection();  // Close the flyout
            }
        }
        this.refreshToolbox();
    },

    /**
     * Insert a template into the workspace at center of visible area
     * @param {string} id - Template ID
     */
    _removeBlockIds(blockData) {
        if (!blockData || typeof blockData !== 'object') return;
        delete blockData.id;
        if (blockData.next && blockData.next.block) {
            this._removeBlockIds(blockData.next.block);
        }
        if (blockData.inputs) {
            for (const inputName in blockData.inputs) {
                const input = blockData.inputs[inputName];
                if (input && input.block) {
                    this._removeBlockIds(input.block);
                }
            }
        }
    },

    /**
     * Get a template by ID
     * @param {string} id - Template ID
     * @returns {Object|undefined} Template object
     */
    getTemplateById(id) {
        return this.getTemplates().find(t => t.id === id);
    },

    /**
     * Refresh the toolbox to show updated templates
     */
    refreshToolbox() {
        if (workspace) {
            // Re-register button callbacks for new templates
            this.registerButtonCallbacks();
            // Update the toolbox
            workspace.updateToolbox(buildToolbox());
        }
    },

    /**
     * Register button callbacks for all templates
     * Called during workspace initialization and after template changes
     */
    registerButtonCallbacks() {
        if (!workspace) return;

        this.getTemplates().forEach(template => {
            workspace.registerButtonCallback(`delete_template_${template.id}`, () => {
                const confirmMsg = tt('template.deleteConfirm', 'Delete this template?');
                if (confirm(`${confirmMsg}\n${template.name}`)) {
                    this.deleteTemplate(template.id);
                }
            });
        });
    }
};

// Export to global scope
window.templateManager = templateManager;

// Create JavaScript generator
const javascriptGenerator = Blockly.JavaScript || new Blockly.Generator('JavaScript');

/**
 * Helper function to get translation with fallback
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if t() not available
 * @returns {string} Translated text
 */
function tt(key, fallback) {
    if (typeof window.t === 'function') {
        return window.t(key);
    }
    return fallback;
}

/**
 * Register all block definitions with current locale translations
 * This function can be called multiple times to update block labels
 */
function registerBlockDefinitions() {
    // ========================================================================
    // Noun Block
    // ========================================================================
    Blockly.Blocks['promps_noun'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(tt('blockly.noun.label', 'Noun:'))
                .appendField(new Blockly.FieldTextInput("User"), "TEXT");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip(() => tt('blockly.noun.tooltip', 'Noun block (_N: prefix)'));
            this.setHelpUrl("");
        }
    };

    javascriptGenerator.forBlock['promps_noun'] = function(block, generator) {
        const text = block.getFieldValue('TEXT');
        return '_N:' + text + ' ';
    };

    // ========================================================================
    // Other Block
    // ========================================================================
    Blockly.Blocks['promps_other'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(tt('blockly.other.label', 'Other:'))
                .appendField(new Blockly.FieldTextInput("text"), "TEXT");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.other.tooltip', 'Other block'));
            this.setHelpUrl("");
        }
    };

    javascriptGenerator.forBlock['promps_other'] = function(block, generator) {
        const text = block.getFieldValue('TEXT');
        return text + ' ';
    };

    // ========================================================================
    // Particle Blocks
    // ========================================================================

    // が (subject marker)
    Blockly.Blocks['promps_particle_ga'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.ga.label', 'が')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.ga.tooltip', 'Subject marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_ga'] = function(block, generator) {
        return tt('blockly.particle.ga.output', 'が ');
    };

    // を (object marker)
    Blockly.Blocks['promps_particle_wo'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.wo.label', 'を')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.wo.tooltip', 'Object marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_wo'] = function(block, generator) {
        return tt('blockly.particle.wo.output', 'を ');
    };

    // に (direction/target marker)
    Blockly.Blocks['promps_particle_ni'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.ni.label', 'に')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.ni.tooltip', 'Direction marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_ni'] = function(block, generator) {
        return tt('blockly.particle.ni.output', 'に ');
    };

    // で (means/location marker)
    Blockly.Blocks['promps_particle_de'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.de.label', 'で')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.de.tooltip', 'Means marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_de'] = function(block, generator) {
        return tt('blockly.particle.de.output', 'で ');
    };

    // と (and/with marker)
    Blockly.Blocks['promps_particle_to'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.to.label', 'と')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.to.tooltip', 'And/with marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_to'] = function(block, generator) {
        return tt('blockly.particle.to.output', 'と ');
    };

    // へ (direction marker)
    Blockly.Blocks['promps_particle_he'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.he.label', 'へ')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.he.tooltip', 'Direction marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_he'] = function(block, generator) {
        return tt('blockly.particle.he.output', 'へ ');
    };

    // から (from marker)
    Blockly.Blocks['promps_particle_kara'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.kara.label', 'から')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.kara.tooltip', 'From marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_kara'] = function(block, generator) {
        return tt('blockly.particle.kara.output', 'から ');
    };

    // まで (until marker)
    Blockly.Blocks['promps_particle_made'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.made.label', 'まで')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.made.tooltip', 'Until marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_made'] = function(block, generator) {
        return tt('blockly.particle.made.output', 'まで ');
    };

    // より (comparison marker)
    Blockly.Blocks['promps_particle_yori'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.particle.yori.label', 'より')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip(() => tt('blockly.particle.yori.tooltip', 'Comparison marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_particle_yori'] = function(block, generator) {
        return tt('blockly.particle.yori.output', 'より ');
    };

    // ========================================================================
    // Article Blocks (English mode only)
    // ========================================================================

    // a (indefinite article)
    Blockly.Blocks['promps_article_a'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.a.label', 'a')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.a.tooltip', 'Indefinite article'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_a'] = function(block, generator) {
        return tt('blockly.article.a.output', 'a ');
    };

    // an (indefinite article for vowels)
    Blockly.Blocks['promps_article_an'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.an.label', 'an')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.an.tooltip', 'Indefinite article for vowels'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_an'] = function(block, generator) {
        return tt('blockly.article.an.output', 'an ');
    };

    // the (definite article)
    Blockly.Blocks['promps_article_the'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.the.label', 'the')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.the.tooltip', 'Definite article'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_the'] = function(block, generator) {
        return tt('blockly.article.the.output', 'the ');
    };

    // this (demonstrative)
    Blockly.Blocks['promps_article_this'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.this.label', 'this')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.this.tooltip', 'Demonstrative for nearby'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_this'] = function(block, generator) {
        return tt('blockly.article.this.output', 'this ');
    };

    // that (demonstrative)
    Blockly.Blocks['promps_article_that'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.that.label', 'that')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.that.tooltip', 'Demonstrative for distant'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_that'] = function(block, generator) {
        return tt('blockly.article.that.output', 'that ');
    };

    // please (polite marker)
    Blockly.Blocks['promps_article_please'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.article.please.label', 'please')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(() => tt('blockly.article.please.tooltip', 'Polite request marker'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_article_please'] = function(block, generator) {
        return tt('blockly.article.please.output', 'please ');
    };

    // ========================================================================
    // Verb Blocks
    // ========================================================================

    // 分析して (analyze)
    Blockly.Blocks['promps_verb_analyze'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.analyze.label', '分析して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.analyze.tooltip', 'Verb: analyze'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_analyze'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.analyze.output', '分析して ');
    };

    // 要約して (summarize)
    Blockly.Blocks['promps_verb_summarize'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.summarize.label', '要約して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.summarize.tooltip', 'Verb: summarize'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_summarize'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.summarize.output', '要約して ');
    };

    // 翻訳して (translate)
    Blockly.Blocks['promps_verb_translate'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.translate.label', '翻訳して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.translate.tooltip', 'Verb: translate'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_translate'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.translate.output', '翻訳して ');
    };

    // 作成して (create)
    Blockly.Blocks['promps_verb_create'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.create.label', '作成して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.create.tooltip', 'Verb: create'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_create'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.create.output', '作成して ');
    };

    // 生成して (generate)
    Blockly.Blocks['promps_verb_generate'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.generate.label', '生成して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.generate.tooltip', 'Verb: generate'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_generate'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.generate.output', '生成して ');
    };

    // 変換して (convert)
    Blockly.Blocks['promps_verb_convert'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.convert.label', '変換して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.convert.tooltip', 'Verb: convert'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_convert'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.convert.output', '変換して ');
    };

    // 削除して (delete)
    Blockly.Blocks['promps_verb_delete'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.delete.label', '削除して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.delete.tooltip', 'Verb: delete'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_delete'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.delete.output', '削除して ');
    };

    // 更新して (update)
    Blockly.Blocks['promps_verb_update'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.update.label', '更新して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.update.tooltip', 'Verb: update'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_update'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.update.output', '更新して ');
    };

    // 抽出して (extract)
    Blockly.Blocks['promps_verb_extract'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.extract.label', '抽出して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.extract.tooltip', 'Verb: extract'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_extract'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.extract.output', '抽出して ');
    };

    // 説明して (explain)
    Blockly.Blocks['promps_verb_explain'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.explain.label', '説明して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.explain.tooltip', 'Verb: explain'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_explain'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.explain.output', '説明して ');
    };

    // 解説して (describe)
    Blockly.Blocks['promps_verb_describe'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.describe.label', '解説して')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.describe.tooltip', 'Verb: describe'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_describe'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.describe.output', '解説して ');
    };

    // 教えて (teach)
    Blockly.Blocks['promps_verb_teach'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.verb.teach.label', '教えて')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.teach.tooltip', 'Verb: teach'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_teach'] = function(block, generator) {
        return '_V:' + tt('blockly.verb.teach.output', '教えて ');
    };

    // Custom Verb (user input)
    Blockly.Blocks['promps_verb_custom'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(tt('blockly.verb.label', '動詞:'))
                .appendField(new Blockly.FieldTextInput(tt('blockly.verb.custom.default', '作成して')), "TEXT");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip(() => tt('blockly.verb.custom.tooltip', 'Custom verb block'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_verb_custom'] = function(block, generator) {
        const text = block.getFieldValue('TEXT');
        return '_V:' + text + ' ';
    };

    // ========================================================================
    // Punctuation Blocks
    // ========================================================================

    // 、(touten - comma)
    Blockly.Blocks['promps_punct_touten'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.touten.label', '、')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.touten.tooltip', 'Punctuation: comma'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_touten'] = function(block, generator) {
        return tt('blockly.punct.touten.output', '、 ');
    };

    // 。(kuten - period)
    Blockly.Blocks['promps_punct_kuten'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.kuten.label', '。')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.kuten.tooltip', 'Punctuation: period'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_kuten'] = function(block, generator) {
        return tt('blockly.punct.kuten.output', '。 ');
    };

    // ！(exclamation)
    Blockly.Blocks['promps_punct_exclaim'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.exclaim.label', '！')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.exclaim.tooltip', 'Punctuation: exclamation'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_exclaim'] = function(block, generator) {
        return tt('blockly.punct.exclaim.output', '！ ');
    };

    // ？(question)
    Blockly.Blocks['promps_punct_question'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.question.label', '？')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.question.tooltip', 'Punctuation: question'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_question'] = function(block, generator) {
        return tt('blockly.punct.question.output', '？ ');
    };

    // "(double quote)
    Blockly.Blocks['promps_punct_dquote'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.dquote.label', '"')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.dquote.tooltip', 'Punctuation: double quote'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_dquote'] = function(block, generator) {
        return tt('blockly.punct.dquote.output', '" ');
    };

    // '(single quote)
    Blockly.Blocks['promps_punct_squote'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.squote.label', "'")));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.squote.tooltip', 'Punctuation: single quote'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_squote'] = function(block, generator) {
        return tt('blockly.punct.squote.output', "' ");
    };

    // ,(comma)
    Blockly.Blocks['promps_punct_comma'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.comma.label', ',')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.comma.tooltip', 'Punctuation: comma'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_comma'] = function(block, generator) {
        return tt('blockly.punct.comma.output', ', ');
    };

    // /(slash)
    Blockly.Blocks['promps_punct_slash'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.slash.label', '/')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.slash.tooltip', 'Punctuation: slash'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_slash'] = function(block, generator) {
        return tt('blockly.punct.slash.output', '/ ');
    };

    // &(ampersand)
    Blockly.Blocks['promps_punct_amp'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.amp.label', '&')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.amp.tooltip', 'Punctuation: ampersand'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_amp'] = function(block, generator) {
        return tt('blockly.punct.amp.output', '& ');
    };

    // . (period)
    Blockly.Blocks['promps_punct_period'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(tt('blockly.punct.period.label', '.')));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(() => tt('blockly.punct.period.tooltip', 'Punctuation: period'));
            this.setHelpUrl("");
        }
    };
    javascriptGenerator.forBlock['promps_punct_period'] = function(block, generator) {
        return tt('blockly.punct.period.output', '. ');
    };

    console.log('Block definitions registered');
}

// Register blocks on initial load
registerBlockDefinitions();

/**
 * Build toolbox definition with translated category names
 * @returns {Object} Toolbox definition
 */
function buildToolbox() {
    return {
        "kind": "categoryToolbox",
        "contents": [
            // Noun category
            {
                "kind": "category",
                "name": tt('blockly.category.noun', 'Noun'),
                "colour": "120",
                "contents": [
                    { "kind": "block", "type": "promps_noun" }
                ]
            },
            // Particle/Connector category
            {
                "kind": "category",
                "name": tt('blockly.category.particle', 'Particle'),
                "colour": "230",
                "contents": (function() {
                    const isJapanese = typeof window.getLocale === 'function' && window.getLocale() === 'ja';
                    const particles = [];
                    // Subject/object markers only shown in Japanese mode
                    if (isJapanese) {
                        particles.push({ "kind": "block", "type": "promps_particle_ga" });
                        particles.push({ "kind": "block", "type": "promps_particle_wo" });
                    }
                    // Other particles shown in both modes
                    particles.push({ "kind": "block", "type": "promps_particle_ni" });
                    particles.push({ "kind": "block", "type": "promps_particle_de" });
                    particles.push({ "kind": "block", "type": "promps_particle_to" });
                    particles.push({ "kind": "block", "type": "promps_particle_he" });
                    particles.push({ "kind": "block", "type": "promps_particle_kara" });
                    particles.push({ "kind": "block", "type": "promps_particle_made" });
                    particles.push({ "kind": "block", "type": "promps_particle_yori" });
                    return particles;
                })()
            },
            // Article category (English mode only)
            ...(function() {
                const isEnglish = typeof window.getLocale === 'function' && window.getLocale() === 'en';
                if (!isEnglish) return [];
                return [{
                    "kind": "category",
                    "name": tt('blockly.category.article', 'Article'),
                    "colour": "180",
                    "contents": [
                        { "kind": "block", "type": "promps_article_a" },
                        { "kind": "block", "type": "promps_article_an" },
                        { "kind": "block", "type": "promps_article_the" },
                        { "kind": "block", "type": "promps_article_this" },
                        { "kind": "block", "type": "promps_article_that" },
                        { "kind": "block", "type": "promps_article_please" }
                    ]
                }];
            })(),
            // Verb/Action category
            {
                "kind": "category",
                "name": tt('blockly.category.verb', 'Verb'),
                "colour": "290",
                "contents": [
                    { "kind": "block", "type": "promps_verb_analyze" },
                    { "kind": "block", "type": "promps_verb_summarize" },
                    { "kind": "block", "type": "promps_verb_translate" },
                    { "kind": "block", "type": "promps_verb_create" },
                    { "kind": "block", "type": "promps_verb_generate" },
                    { "kind": "block", "type": "promps_verb_convert" },
                    { "kind": "block", "type": "promps_verb_delete" },
                    { "kind": "block", "type": "promps_verb_update" },
                    { "kind": "block", "type": "promps_verb_extract" },
                    { "kind": "block", "type": "promps_verb_explain" },
                    { "kind": "block", "type": "promps_verb_describe" },
                    { "kind": "block", "type": "promps_verb_teach" },
                    { "kind": "block", "type": "promps_verb_custom" }
                ]
            },
            // Punctuation category
            {
                "kind": "category",
                "name": tt('blockly.category.punctuation', 'Punctuation'),
                "colour": "60",
                "contents": [
                    { "kind": "block", "type": "promps_punct_touten" },
                    { "kind": "block", "type": "promps_punct_kuten" },
                    { "kind": "block", "type": "promps_punct_exclaim" },
                    { "kind": "block", "type": "promps_punct_question" },
                    { "kind": "block", "type": "promps_punct_dquote" },
                    { "kind": "block", "type": "promps_punct_squote" },
                    { "kind": "block", "type": "promps_punct_comma" },
                    { "kind": "block", "type": "promps_punct_slash" },
                    { "kind": "block", "type": "promps_punct_amp" },
                    { "kind": "block", "type": "promps_punct_period" }
                ]
            },
            // Other category
            {
                "kind": "category",
                "name": tt('blockly.category.other', 'Other'),
                "colour": "20",
                "contents": [
                    { "kind": "block", "type": "promps_other" }
                ]
            },
            // My Templates category (dynamic)
            {
                "kind": "category",
                "name": tt('toolbox.myTemplates', 'My Templates'),
                "colour": "330",
                "custom": "MY_TEMPLATES"
            }
        ]
    };
}

/**
 * Generate dynamic content for My Templates category
 * @param {Blockly.Workspace} ws - The workspace
 * @returns {Array} Array of toolbox items
 */
function generateTemplateCategory(ws) {
    const templates = templateManager.getTemplates();
    const blockList = [];

    if (templates.length === 0) {
        blockList.push({
            kind: 'label',
            text: tt('template.empty', 'No templates saved')
        });
    } else {
        // Add template blocks (draggable)
        templates.forEach(template => {
            const blockType = registerTemplateBlock(template);
            blockList.push({
                kind: 'block',
                type: blockType
            });
        });

        // Separator
        blockList.push({
            kind: 'label',
            text: '──────────'
        });

        // Add delete buttons for each template
        templates.forEach(template => {
            blockList.push({
                kind: 'button',
                text: `${tt('template.delete', 'Delete')}: ${template.name}`,
                callbackKey: `delete_template_${template.id}`
            });
        });
    }

    return blockList;
}

/**
 * Show template name input modal and call onConfirm with the entered name
 */
function showTemplateNameModal(onConfirm) {
    var modal = document.getElementById('templateNameModal');
    var input = document.getElementById('templateNameInput');
    var btnSave = document.getElementById('btnSaveTemplateName');
    var btnCancel = document.getElementById('btnCancelTemplateName');
    var btnClose = document.getElementById('btnCloseTemplateNameModal');

    if (!modal || !input) return;

    input.value = '';
    modal.classList.add('modal-visible');
    input.focus();

    function cleanup() {
        modal.classList.remove('modal-visible');
        btnSave.removeEventListener('click', handleSave);
        btnCancel.removeEventListener('click', handleCancel);
        btnClose.removeEventListener('click', handleCancel);
        modal.removeEventListener('click', handleOverlay);
        input.removeEventListener('keydown', handleKeydown);
    }

    function handleSave() {
        var name = input.value;
        cleanup();
        if (onConfirm) onConfirm(name);
    }

    function handleCancel() {
        cleanup();
    }

    function handleOverlay(e) {
        if (e.target === modal) cleanup();
    }

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }

    btnSave.addEventListener('click', handleSave);
    btnCancel.addEventListener('click', handleCancel);
    btnClose.addEventListener('click', handleCancel);
    modal.addEventListener('click', handleOverlay);
    input.addEventListener('keydown', handleKeydown);
}

/**
 * Register custom context menu for saving blocks as templates
 */
function registerTemplateContextMenu() {
    // Ensure Blockly is loaded
    if (typeof Blockly === 'undefined' || !Blockly.ContextMenuRegistry) {
        console.error('Blockly not loaded, cannot register context menu');
        return;
    }

    // Check if already registered to avoid duplicate registration
    try {
        if (Blockly.ContextMenuRegistry.registry.getItem('save_as_template')) {
            console.log('Template context menu already registered');
            return;
        }
    } catch (e) {
        // Item doesn't exist, continue with registration
    }

    try {
        Blockly.ContextMenuRegistry.registry.register({
            id: 'save_as_template',
            weight: 10,  // Low weight = appears near top of menu
            displayText: function() {
                return tt('template.saveAs', 'Save as Template');
            },
            preconditionFn: function(scope) {
                // Only show for blocks in the main workspace (not flyout)
                if (scope.block && !scope.block.isInFlyout) {
                    return 'enabled';
                }
                return 'hidden';
            },
            callback: function(scope) {
                // Use custom modal instead of native prompt() to avoid
                // Blockly context menu cleanup issues in Tauri WebView
                setTimeout(function() {
                    showTemplateNameModal(function(name) {
                        if (name && name.trim()) {
                            templateManager.saveTemplate(name.trim(), scope.block);
                        }
                    });
                }, 0);
            },
            scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK
        });
        console.log('Template context menu registered successfully');
    } catch (e) {
        console.error('Failed to register template context menu:', e);
    }
}

/**
 * Register a dynamic block type for a template (drag-and-drop from toolbox)
 * @param {Object} template - Template object
 * @returns {string} The registered block type name
 */
function registerTemplateBlock(template) {
    const blockType = `promps_template_${template.id}`;

    // Delete old registration if exists (to allow updates)
    if (Blockly.Blocks[blockType]) {
        delete Blockly.Blocks[blockType];
    }

    const displayText = `\u{1F4CB} ${template.name}`;

    // Register the block
    Blockly.Blocks[blockType] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldLabel(displayText));
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(330);
            this.setTooltip(displayText);
            this.setHelpUrl("");

            // Store template ID for expansion
            this._templateId = template.id;
        }
    };

    // Register the generator - returns empty string since this block will be expanded
    javascriptGenerator.forBlock[blockType] = function(block, generator) {
        return '';
    };

    return blockType;
}

/**
 * Expand a template block into its component blocks
 * Called when a template block is dropped into the workspace
 * @param {Blockly.Block} templateBlock - The template block to expand
 */
function expandTemplateBlock(templateBlock) {
    const templateId = templateBlock._templateId;
    if (!templateId) return;

    const template = templateManager.getTemplateById(templateId);
    if (!template) return;

    // Get position of template block
    const position = templateBlock.getRelativeToSurfaceXY();

    // Clone template block data
    const blockData = JSON.parse(JSON.stringify(template.blocks));
    blockData.x = position.x;
    blockData.y = position.y;

    // Remove block IDs for unique generation
    templateManager._removeBlockIds(blockData);

    // Disable all events during the manipulation
    Blockly.Events.disable();
    try {
        // Delete the template block
        templateBlock.dispose(false, false);

        // Insert the actual template blocks
        Blockly.serialization.blocks.append(blockData, workspace);
    } finally {
        Blockly.Events.enable();
    }

    // Trigger preview update
    setTimeout(() => {
        if (typeof updatePreview === 'function') {
            const code = getWorkspaceCode();
            updatePreview(code);
        }
    }, 100);
}

/**
 * Register the dynamic template category callback
 */
function registerTemplateCategory() {
    if (!workspace) return;

    workspace.registerToolboxCategoryCallback('MY_TEMPLATES', generateTemplateCategory);
    templateManager.registerButtonCallbacks();

    console.log('Template category registered');
}

/**
 * Get CSS custom property value from the document root
 */
function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Create Blockly dark theme
 */
function createDarkTheme() {
    return Blockly.Theme.defineTheme('dark', {
        'base': Blockly.Themes.Classic,
        'componentStyles': {
            'workspaceBackgroundColour': getCSSVar('--bg-primary'),
            'toolboxBackgroundColour': getCSSVar('--blockly-toolbox-bg'),
            'toolboxForegroundColour': getCSSVar('--text-primary'),
            'flyoutBackgroundColour': getCSSVar('--blockly-flyout-bg'),
            'flyoutForegroundColour': getCSSVar('--text-primary'),
            'flyoutOpacity': 1,
            'scrollbarColour': getCSSVar('--scrollbar-thumb'),
            'scrollbarOpacity': 0.8,
            'insertionMarkerColour': getCSSVar('--blockly-insertion-marker-color'),
            'insertionMarkerOpacity': 0.3,
            'cursorColour': getCSSVar('--blockly-cursor-color')
        },
        'fontStyle': {
            'family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'weight': 'normal',
            'size': 12
        }
    });
}

/**
 * Get current theme based on data-theme attribute
 */
function getCurrentBlocklyTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        return createDarkTheme();
    }
    return Blockly.Themes.Classic;
}

/**
 * Update Blockly theme when app theme changes
 */
function updateBlocklyTheme() {
    if (workspace) {
        workspace.setTheme(getCurrentBlocklyTheme());
    }
}

/**
 * Initialize Blockly workspace
 */
function initBlockly() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    // Remove placeholder
    blocklyDiv.innerHTML = '';

    // Build toolbox with translated category names
    const toolbox = buildToolbox();

    // Workspace options
    const options = {
        toolbox: toolbox,
        theme: getCurrentBlocklyTheme(),
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
            colour: getCSSVar('--blockly-grid-color'),
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

    // Register template context menu (global, only once)
    registerTemplateContextMenu();

    // Register dynamic template category (must be after workspace creation)
    registerTemplateCategory();

    // Add change listener for real-time preview
    workspace.addChangeListener(onBlocklyChange);

    // Set initial scroll position to top-left (deferred for metrics calculation)
    requestAnimationFrame(() => {
        const metrics = workspace.getMetrics();
        workspace.scroll(-metrics.scrollLeft, -metrics.scrollTop);
    });


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
    if (!window._newlyCreatedBlocks) {
        window._newlyCreatedBlocks = new Map();
    }

    // Create event - track as newly created
    if (event.type === Blockly.Events.BLOCK_CREATE) {
        window._newlyCreatedBlocks.set(event.blockId, null);

        // Template block - track for expansion on drop
        const block = workspace.getBlockById(event.blockId);
        if (block && block.type && block.type.startsWith('promps_template_') && block._templateId) {
            window._pendingTemplateExpansion = event.blockId;
            return; // Don't process further - expansion will happen on BLOCK_MOVE
        }
    }

    // Template block expansion after drop
    if (event.type === Blockly.Events.BLOCK_MOVE && window._pendingTemplateExpansion) {
        const blockId = window._pendingTemplateExpansion;
        if (event.blockId === blockId) {
            window._pendingTemplateExpansion = null;
            const templateBlock = workspace.getBlockById(blockId);
            if (templateBlock && !templateBlock.isInFlyout) {
                // Use setTimeout to ensure the block is fully placed
                setTimeout(() => {
                    const block = workspace.getBlockById(blockId);
                    if (block) {
                        expandTemplateBlock(block);
                    }
                }, 50);
            }
            return; // Don't process further - expansion will handle everything
        }
    }

    // Move event
    if (event.type === Blockly.Events.BLOCK_MOVE) {
        if (window._newlyCreatedBlocks.has(event.blockId)) {
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
            shouldMarkDirty = true;
        }
    }

    // Delete event
    if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (window._newlyCreatedBlocks.has(event.blockId)) {
            const timerId = window._newlyCreatedBlocks.get(event.blockId);
            if (timerId) {
                clearTimeout(timerId);
            }
            window._newlyCreatedBlocks.delete(event.blockId);
        } else {
            shouldMarkDirty = true;
        }
    }

    // Field change event
    if (event.type === Blockly.Events.BLOCK_CHANGE) {
        shouldMarkDirty = true;
    }

    if (shouldMarkDirty) {
        if (window.projectManager && typeof window.projectManager.markDirty === 'function') {
            window.projectManager.markDirty();
        }
    }

    // Generate DSL code from all blocks
    let code = '';
    const topBlocks = workspace.getTopBlocks(true);

    for (const block of topBlocks) {
        code += javascriptGenerator.blockToCode(block);
    }

    // Update preview
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

    let code = '';
    const topBlocks = workspace.getTopBlocks(true);

    for (const block of topBlocks) {
        code += javascriptGenerator.blockToCode(block);
    }

    return code.trim();
}

/**
 * Reinitialize Blockly workspace (called when language changes)
 * Clears workspace and rebuilds with new language-specific toolbox
 */
function reinitializeBlockly() {
    if (!workspace) {
        console.warn('Workspace not initialized, cannot reinitialize');
        return;
    }

    try {
        // Get the blockly div
        const blocklyDiv = document.getElementById('blocklyDiv');

        // Dispose of the old workspace
        workspace.dispose();
        workspace = null;

        // Clear the container
        blocklyDiv.innerHTML = '';

        // Re-register block definitions with new translations
        registerBlockDefinitions();

        // Build new toolbox with updated translations
        const toolbox = buildToolbox();

        // Workspace options
        const options = {
            toolbox: toolbox,
            theme: getCurrentBlocklyTheme(),
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
                colour: getCSSVar('--blockly-grid-color'),
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

        // Inject new workspace (empty - cleared on language change)
        workspace = Blockly.inject(blocklyDiv, options);

        // Re-register dynamic template category
        registerTemplateCategory();

        // Re-add change listener
        workspace.addChangeListener(onBlocklyChange);

        // Reset project manager dirty state (since workspace is now empty)
        if (window.projectManager && typeof window.projectManager.resetDirtyState === 'function') {
            window.projectManager.resetDirtyState();
        }

        // Set initial scroll position to top-left (deferred for metrics calculation)
        requestAnimationFrame(() => {
            const metrics = workspace.getMetrics();
            workspace.scroll(-metrics.scrollLeft, -metrics.scrollTop);
        });

        console.log('Blockly workspace reinitialized with new language (workspace cleared)');

        // Clear preview
        if (typeof updatePreview === 'function') {
            updatePreview('');
        }

    } catch (error) {
        console.error('Failed to reinitialize Blockly:', error);
    }
}
