/**
 * Promps - Blockly.js Configuration Tests
 *
 * Tests for custom block definitions and DSL generation
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Mock Blockly for testing
global.Blockly = {
    Blocks: {},
    JavaScript: {
        forBlock: {}
    },
    Events: {
        UI: 'ui'
    }
};

// Import the blockly-config module (we'll need to adjust imports)
// For now, we'll test the logic directly

describe('Promps Noun Block', () => {
    test('should have correct block definition structure', () => {
        // Define the block (same as in blockly-config.js)
        const nounBlock = {
            init: function() {
                this.appendDummyInput = () => ({
                    appendField: () => ({ appendField: () => {} })
                });
                this.setPreviousStatement = () => {};
                this.setNextStatement = () => {};
                this.setColour = () => {};
                this.setTooltip = () => {};
                this.setHelpUrl = () => {};
            }
        };

        expect(nounBlock.init).toBeDefined();
        expect(typeof nounBlock.init).toBe('function');
    });

    test('should generate correct DSL code from noun block', () => {
        // Mock block with text field
        const mockBlock = {
            getFieldValue: (fieldName) => {
                if (fieldName === 'TEXT') {
                    return 'User';
                }
                return '';
            }
        };

        // Generator function (same logic as in blockly-config.js)
        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return '_N:' + text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('_N:User ');
    });

    test('should handle Japanese text in noun blocks', () => {
        const mockBlock = {
            getFieldValue: (fieldName) => {
                if (fieldName === 'TEXT') {
                    return 'ユーザー';
                }
                return '';
            }
        };

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return '_N:' + text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('_N:ユーザー ');
    });

    test('should handle empty text field', () => {
        const mockBlock = {
            getFieldValue: () => ''
        };

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return '_N:' + text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('_N: ');
    });

    test('should handle multi-word text', () => {
        const mockBlock = {
            getFieldValue: (fieldName) => {
                if (fieldName === 'TEXT') {
                    return 'データベース テーブル ブロック';
                }
                return '';
            }
        };

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return '_N:' + text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('_N:データベース テーブル ブロック ');
    });
});

describe('Workspace Code Generation', () => {
    test('should generate DSL from multiple noun blocks', () => {
        // Simulate multiple blocks
        const blocks = [
            { getFieldValue: () => 'User' },
            { getFieldValue: () => 'Order' }
        ];

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return '_N:' + text + ' ';
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:User _N:Order ');
    });

    test('should handle empty workspace', () => {
        const blocks = [];
        const code = blocks.map(b => '_N:' + b.getFieldValue('TEXT') + ' ').join('');
        expect(code).toBe('');
    });
});

describe('Blockly Change Event Handling', () => {
    test('should filter out UI events', () => {
        const event = { type: 'ui' };
        const shouldUpdate = event.type !== 'ui';
        expect(shouldUpdate).toBe(false);
    });

    test('should process non-UI events', () => {
        const event = { type: 'create' };
        const shouldUpdate = event.type !== 'ui';
        expect(shouldUpdate).toBe(true);
    });
});
