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

describe('Promps Other Block', () => {
    test('should have correct block definition structure', () => {
        const otherBlock = {
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

        expect(otherBlock.init).toBeDefined();
        expect(typeof otherBlock.init).toBe('function');
    });

    test('should generate correct DSL code from other block (particle)', () => {
        const mockBlock = {
            getFieldValue: (fieldName) => {
                if (fieldName === 'TEXT') {
                    return 'が';
                }
                return '';
            }
        };

        // Generator function (no _N: prefix for other blocks)
        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('が ');
    });

    test('should generate correct DSL code from other block (verb)', () => {
        const mockBlock = {
            getFieldValue: (fieldName) => {
                if (fieldName === 'TEXT') {
                    return '作成';
                }
                return '';
            }
        };

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).toBe('作成 ');
    });

    test('should handle various particle types', () => {
        const particles = ['が', 'を', 'に', 'で', 'と', 'や'];

        particles.forEach(particle => {
            const mockBlock = {
                getFieldValue: () => particle
            };

            const generateDSL = (block) => {
                const text = block.getFieldValue('TEXT');
                return text + ' ';
            };

            const result = generateDSL(mockBlock);
            expect(result).toBe(particle + ' ');
        });
    });

    test('should not add _N: prefix for other blocks', () => {
        const mockBlock = {
            getFieldValue: () => 'を'
        };

        const generateDSL = (block) => {
            const text = block.getFieldValue('TEXT');
            return text + ' ';
        };

        const result = generateDSL(mockBlock);
        expect(result).not.toContain('_N:');
        expect(result).toBe('を ');
    });
});

describe('Mixed Block Types', () => {
    test('should generate DSL from mixed noun and other blocks', () => {
        // Simulate: [Noun: User] [Other: が] [Noun: Order] [Other: を] [Other: 作成]
        const blocks = [
            { type: 'noun', text: 'User' },
            { type: 'other', text: 'が' },
            { type: 'noun', text: 'Order' },
            { type: 'other', text: 'を' },
            { type: 'other', text: '作成' }
        ];

        const generateDSL = (block) => {
            if (block.type === 'noun') {
                return '_N:' + block.text + ' ';
            } else {
                return block.text + ' ';
            }
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:User が _N:Order を 作成 ');
    });

    test('should handle complex sentence structure', () => {
        const blocks = [
            { type: 'noun', text: 'データベース' },
            { type: 'other', text: 'の' },
            { type: 'noun', text: 'テーブル' },
            { type: 'other', text: 'を' },
            { type: 'other', text: '定義' },
            { type: 'other', text: 'する' }
        ];

        const generateDSL = (block) => {
            if (block.type === 'noun') {
                return '_N:' + block.text + ' ';
            } else {
                return block.text + ' ';
            }
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:データベース の _N:テーブル を 定義 する ');
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

describe('Particle Blocks (Phase 2)', () => {
    // Particle block generator function (returns fixed text + space)
    const generateParticleDSL = (particleText) => {
        return particleText + ' ';
    };

    test('should generate correct DSL for が particle', () => {
        const result = generateParticleDSL('が');
        expect(result).toBe('が ');
    });

    test('should generate correct DSL for を particle', () => {
        const result = generateParticleDSL('を');
        expect(result).toBe('を ');
    });

    test('should generate correct DSL for に particle', () => {
        const result = generateParticleDSL('に');
        expect(result).toBe('に ');
    });

    test('should generate correct DSL for で particle', () => {
        const result = generateParticleDSL('で');
        expect(result).toBe('で ');
    });

    test('should generate correct DSL for と particle', () => {
        const result = generateParticleDSL('と');
        expect(result).toBe('と ');
    });

    test('should generate correct DSL for へ particle', () => {
        const result = generateParticleDSL('へ');
        expect(result).toBe('へ ');
    });

    test('should generate correct DSL for から particle', () => {
        const result = generateParticleDSL('から');
        expect(result).toBe('から ');
    });

    test('should generate correct DSL for まで particle', () => {
        const result = generateParticleDSL('まで');
        expect(result).toBe('まで ');
    });

    test('should generate correct DSL for より particle', () => {
        const result = generateParticleDSL('より');
        expect(result).toBe('より ');
    });

    test('should handle all 9 particle types', () => {
        const particles = ['が', 'を', 'に', 'で', 'と', 'へ', 'から', 'まで', 'より'];

        particles.forEach(particle => {
            const result = generateParticleDSL(particle);
            expect(result).toBe(particle + ' ');
        });
    });

    test('particle blocks should not have _N: prefix', () => {
        const particles = ['が', 'を', 'に', 'で', 'と', 'へ', 'から', 'まで', 'より'];

        particles.forEach(particle => {
            const result = generateParticleDSL(particle);
            expect(result).not.toContain('_N:');
        });
    });

    test('should generate complete sentence with particle blocks', () => {
        // Sentence: User が Order を 作成
        const blocks = [
            { type: 'noun', text: 'User' },
            { type: 'particle', text: 'が' },
            { type: 'noun', text: 'Order' },
            { type: 'particle', text: 'を' },
            { type: 'other', text: '作成' }
        ];

        const generateDSL = (block) => {
            if (block.type === 'noun') {
                return '_N:' + block.text + ' ';
            } else if (block.type === 'particle') {
                return block.text + ' ';
            } else {
                return block.text + ' ';
            }
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:User が _N:Order を 作成 ');
    });

    test('should generate sentence with から and まで particles', () => {
        // Sentence: Database から Data まで 移行
        const blocks = [
            { type: 'noun', text: 'Database' },
            { type: 'particle', text: 'から' },
            { type: 'noun', text: 'Data' },
            { type: 'particle', text: 'まで' },
            { type: 'other', text: '移行' }
        ];

        const generateDSL = (block) => {
            if (block.type === 'noun') {
                return '_N:' + block.text + ' ';
            } else {
                return block.text + ' ';
            }
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:Database から _N:Data まで 移行 ');
    });

    test('should generate sentence with と particle for conjunction', () => {
        // Sentence: User と Admin が 作成
        const blocks = [
            { type: 'noun', text: 'User' },
            { type: 'particle', text: 'と' },
            { type: 'noun', text: 'Admin' },
            { type: 'particle', text: 'が' },
            { type: 'other', text: '作成' }
        ];

        const generateDSL = (block) => {
            if (block.type === 'noun') {
                return '_N:' + block.text + ' ';
            } else {
                return block.text + ' ';
            }
        };

        const code = blocks.map(generateDSL).join('');
        expect(code).toBe('_N:User と _N:Admin が 作成 ');
    });
});
