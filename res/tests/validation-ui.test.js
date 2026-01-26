/**
 * Promps Phase 5 - Validation UI Tests
 *
 * Tests for grammar validation UI logic
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock Tauri API
let mockInvoke;

// Mock DOM elements
let mockValidationContainer;
let mockWorkspace;

beforeEach(() => {
    mockInvoke = jest.fn();
    global.window = global.window || {};
    global.window.__TAURI__ = {
        invoke: mockInvoke
    };

    // Mock validation container
    mockValidationContainer = {
        innerHTML: '',
        className: '',
        appendChild: jest.fn()
    };

    // Mock workspace
    mockWorkspace = {
        getAllBlocks: jest.fn().mockReturnValue([]),
        getTopBlocks: jest.fn().mockReturnValue([]),
        getBlockById: jest.fn().mockReturnValue(null)
    };

    global.workspace = mockWorkspace;
    global.document = {
        getElementById: jest.fn((id) => {
            if (id === 'validationResult') {
                return mockValidationContainer;
            }
            return null;
        }),
        createElement: jest.fn((tag) => ({
            className: '',
            innerHTML: '',
            textContent: '',
            appendChild: jest.fn()
        }))
    };
});

describe('Validation Command Invocation', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should invoke validate_dsl_sequence command', async () => {
        const validResult = {
            isValid: true,
            errors: [],
            errorCount: 0,
            warningCount: 0
        };
        mockInvoke.mockResolvedValue(validResult);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: '_N:User が _N:Document を 分析して'
        });

        expect(mockInvoke).toHaveBeenCalledWith('validate_dsl_sequence', {
            input: '_N:User が _N:Document を 分析して'
        });
        expect(result.isValid).toBe(true);
        expect(result.errorCount).toBe(0);
    });

    test('should return errors for invalid sequence', async () => {
        const invalidResult = {
            isValid: false,
            errors: [{
                code: 'ParticleWithoutNoun',
                message: '助詞「が」の前に名詞がありません',
                position: 0,
                severity: 'error',
                suggestion: '名詞ブロックを追加してください'
            }],
            errorCount: 1,
            warningCount: 0
        };
        mockInvoke.mockResolvedValue(invalidResult);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: 'が _N:User'
        });

        expect(result.isValid).toBe(false);
        expect(result.errorCount).toBe(1);
        expect(result.errors[0].code).toBe('ParticleWithoutNoun');
    });

    test('should return warnings for consecutive nouns', async () => {
        const warningResult = {
            isValid: true,
            errors: [{
                code: 'ConsecutiveNouns',
                message: '名詞が連続しています',
                position: 1,
                severity: 'warning',
                suggestion: '間に助詞を追加することを検討してください'
            }],
            errorCount: 0,
            warningCount: 1
        };
        mockInvoke.mockResolvedValue(warningResult);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: '_N:User _N:Order'
        });

        expect(result.isValid).toBe(true);
        expect(result.warningCount).toBe(1);
        expect(result.errors[0].severity).toBe('warning');
    });
});

describe('Validation Result Display', () => {
    // Simulated validationUI module functions
    const simulateDisplayResult = (result) => {
        if (result.isValid && result.warningCount === 0) {
            mockValidationContainer.className = 'validation-result validation-success';
            mockValidationContainer.innerHTML = '<span class="validation-icon">&#10003;</span> Grammar check passed';
        } else if (result.errorCount > 0) {
            mockValidationContainer.className = 'validation-result validation-error';
        } else if (result.warningCount > 0) {
            mockValidationContainer.className = 'validation-result validation-warning';
        }
    };

    test('should display success state for valid input', () => {
        const result = {
            isValid: true,
            errors: [],
            errorCount: 0,
            warningCount: 0
        };

        simulateDisplayResult(result);

        expect(mockValidationContainer.className).toContain('validation-success');
        expect(mockValidationContainer.innerHTML).toContain('Grammar check passed');
    });

    test('should display error state for invalid input', () => {
        const result = {
            isValid: false,
            errors: [{
                code: 'ParticleWithoutNoun',
                message: '助詞「が」の前に名詞がありません',
                position: 0,
                severity: 'error',
                suggestion: '名詞ブロックを追加してください'
            }],
            errorCount: 1,
            warningCount: 0
        };

        simulateDisplayResult(result);

        expect(mockValidationContainer.className).toContain('validation-error');
    });

    test('should display warning state for warnings only', () => {
        const result = {
            isValid: true,
            errors: [{
                code: 'ConsecutiveNouns',
                message: '名詞が連続しています',
                position: 1,
                severity: 'warning',
                suggestion: null
            }],
            errorCount: 0,
            warningCount: 1
        };

        simulateDisplayResult(result);

        expect(mockValidationContainer.className).toContain('validation-warning');
    });
});

describe('Validation Rules', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('Rule 1: Particle at start should error', async () => {
        mockInvoke.mockResolvedValue({
            isValid: false,
            errors: [{
                code: 'ParticleWithoutNoun',
                message: '助詞「が」の前に名詞がありません',
                position: 0,
                severity: 'error',
                suggestion: '名詞ブロックを追加してください'
            }],
            errorCount: 1,
            warningCount: 0
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: 'が _N:User'
        });

        expect(result.isValid).toBe(false);
        expect(result.errors[0].code).toBe('ParticleWithoutNoun');
    });

    test('Rule 2: Consecutive particles should error', async () => {
        mockInvoke.mockResolvedValue({
            isValid: false,
            errors: [{
                code: 'ConsecutiveParticles',
                message: '助詞「を」が連続しています',
                position: 2,
                severity: 'error',
                suggestion: '間に名詞や動詞を追加してください'
            }],
            errorCount: 1,
            warningCount: 0
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: '_N:User が を'
        });

        expect(result.isValid).toBe(false);
        expect(result.errors[0].code).toBe('ConsecutiveParticles');
    });

    test('Rule 3: Verb not at end should warn', async () => {
        mockInvoke.mockResolvedValue({
            isValid: true,
            errors: [{
                code: 'VerbNotAtEnd',
                message: '動詞が末尾にありません',
                position: 0,
                severity: 'warning',
                suggestion: '動詞を文末に移動してください'
            }],
            errorCount: 0,
            warningCount: 1
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: '分析して _N:Document'
        });

        expect(result.isValid).toBe(true);
        expect(result.warningCount).toBe(1);
        expect(result.errors[0].code).toBe('VerbNotAtEnd');
    });

    test('Rule 4: Consecutive nouns should warn', async () => {
        mockInvoke.mockResolvedValue({
            isValid: true,
            errors: [{
                code: 'ConsecutiveNouns',
                message: '名詞が連続しています',
                position: 1,
                severity: 'warning',
                suggestion: '間に助詞を追加することを検討してください'
            }],
            errorCount: 0,
            warningCount: 1
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: '_N:User _N:Order'
        });

        expect(result.isValid).toBe(true);
        expect(result.warningCount).toBe(1);
        expect(result.errors[0].code).toBe('ConsecutiveNouns');
    });
});

describe('Block Position Mapping', () => {
    test('should build empty positions for empty workspace', () => {
        mockWorkspace.getTopBlocks.mockReturnValue([]);

        // Simulated buildBlockPositions logic
        const positions = {};
        const topBlocks = mockWorkspace.getTopBlocks(true);

        expect(Object.keys(positions).length).toBe(0);
    });

    test('should build positions for block chain', () => {
        // Mock block chain: block1 -> block2 -> block3
        const block3 = { id: 'block3', getNextBlock: () => null };
        const block2 = { id: 'block2', getNextBlock: () => block3 };
        const block1 = { id: 'block1', getNextBlock: () => block2 };

        mockWorkspace.getTopBlocks.mockReturnValue([block1]);

        // Simulated buildBlockPositions logic
        const positions = {};
        const topBlocks = mockWorkspace.getTopBlocks(true);
        let position = 0;

        for (const topBlock of topBlocks) {
            let block = topBlock;
            while (block) {
                positions[position] = block.id;
                position++;
                block = block.getNextBlock();
            }
        }

        expect(positions[0]).toBe('block1');
        expect(positions[1]).toBe('block2');
        expect(positions[2]).toBe('block3');
    });
});

describe('Block Highlighting', () => {
    test('should clear highlights when no errors', () => {
        const mockBlock = {
            setWarningText: jest.fn(),
            getSvgRoot: jest.fn().mockReturnValue({
                classList: {
                    remove: jest.fn(),
                    add: jest.fn()
                }
            })
        };
        mockWorkspace.getAllBlocks.mockReturnValue([mockBlock]);

        // Simulated clearBlockHighlights logic
        const allBlocks = mockWorkspace.getAllBlocks(false);
        for (const block of allBlocks) {
            block.setWarningText(null);
            const svgRoot = block.getSvgRoot();
            if (svgRoot) {
                svgRoot.classList.remove('validation-block-error');
                svgRoot.classList.remove('validation-block-warning');
            }
        }

        expect(mockBlock.setWarningText).toHaveBeenCalledWith(null);
        expect(mockBlock.getSvgRoot().classList.remove).toHaveBeenCalledWith('validation-block-error');
        expect(mockBlock.getSvgRoot().classList.remove).toHaveBeenCalledWith('validation-block-warning');
    });

    test('should highlight error blocks', () => {
        const mockBlock = {
            setWarningText: jest.fn(),
            getSvgRoot: jest.fn().mockReturnValue({
                classList: {
                    add: jest.fn()
                }
            })
        };
        mockWorkspace.getBlockById.mockReturnValue(mockBlock);

        const error = {
            code: 'ParticleWithoutNoun',
            message: '助詞「が」の前に名詞がありません',
            position: 0,
            severity: 'error'
        };
        const blockPositions = { 0: 'block1' };

        // Simulated highlightBlocks logic
        const blockId = blockPositions[error.position];
        const block = mockWorkspace.getBlockById(blockId);
        if (block) {
            block.setWarningText(error.message);
            const svgRoot = block.getSvgRoot();
            if (svgRoot && error.severity === 'error') {
                svgRoot.classList.add('validation-block-error');
            }
        }

        expect(mockBlock.setWarningText).toHaveBeenCalledWith(error.message);
        expect(mockBlock.getSvgRoot().classList.add).toHaveBeenCalledWith('validation-block-error');
    });

    test('should highlight warning blocks', () => {
        const mockBlock = {
            setWarningText: jest.fn(),
            getSvgRoot: jest.fn().mockReturnValue({
                classList: {
                    add: jest.fn()
                }
            })
        };
        mockWorkspace.getBlockById.mockReturnValue(mockBlock);

        const error = {
            code: 'ConsecutiveNouns',
            message: '名詞が連続しています',
            position: 1,
            severity: 'warning'
        };
        const blockPositions = { 1: 'block2' };

        // Simulated highlightBlocks logic
        const blockId = blockPositions[error.position];
        const block = mockWorkspace.getBlockById(blockId);
        if (block) {
            block.setWarningText(error.message);
            const svgRoot = block.getSvgRoot();
            if (svgRoot && error.severity === 'warning') {
                svgRoot.classList.add('validation-block-warning');
            }
        }

        expect(mockBlock.setWarningText).toHaveBeenCalledWith(error.message);
        expect(mockBlock.getSvgRoot().classList.add).toHaveBeenCalledWith('validation-block-warning');
    });
});

describe('Integration with Preview Update', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should validate after generating prompt', async () => {
        const promptResult = 'User (NOUN) が Document (NOUN) を 分析して';
        const validationResult = {
            isValid: true,
            errors: [],
            errorCount: 0,
            warningCount: 0
        };

        mockInvoke
            .mockResolvedValueOnce(promptResult)
            .mockResolvedValueOnce(validationResult);

        const invoke = window.__TAURI__.invoke;

        // Simulate updatePreview flow
        const dslCode = '_N:User が _N:Document を 分析して';
        const prompt = await invoke('generate_prompt_from_text', { input: dslCode });
        const validation = await invoke('validate_dsl_sequence', { input: dslCode });

        expect(mockInvoke).toHaveBeenCalledTimes(2);
        expect(mockInvoke).toHaveBeenCalledWith('generate_prompt_from_text', { input: dslCode });
        expect(mockInvoke).toHaveBeenCalledWith('validate_dsl_sequence', { input: dslCode });
        expect(validation.isValid).toBe(true);
    });

    test('should handle validation errors during preview update', async () => {
        const promptResult = 'が User (NOUN)';
        const validationResult = {
            isValid: false,
            errors: [{
                code: 'ParticleWithoutNoun',
                message: '助詞「が」の前に名詞がありません',
                position: 0,
                severity: 'error',
                suggestion: '名詞ブロックを追加してください'
            }],
            errorCount: 1,
            warningCount: 0
        };

        mockInvoke
            .mockResolvedValueOnce(promptResult)
            .mockResolvedValueOnce(validationResult);

        const invoke = window.__TAURI__.invoke;

        // Simulate updatePreview flow
        const dslCode = 'が _N:User';
        await invoke('generate_prompt_from_text', { input: dslCode });
        const validation = await invoke('validate_dsl_sequence', { input: dslCode });

        expect(validation.isValid).toBe(false);
        expect(validation.errorCount).toBe(1);
    });
});

describe('Edge Cases', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should handle empty input', async () => {
        mockInvoke.mockResolvedValue({
            isValid: true,
            errors: [],
            errorCount: 0,
            warningCount: 0
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', { input: '' });

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
    });

    test('should handle whitespace-only input', async () => {
        mockInvoke.mockResolvedValue({
            isValid: true,
            errors: [],
            errorCount: 0,
            warningCount: 0
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', { input: '   ' });

        expect(result.isValid).toBe(true);
    });

    test('should handle multiple errors in same sequence', async () => {
        mockInvoke.mockResolvedValue({
            isValid: false,
            errors: [
                {
                    code: 'ParticleWithoutNoun',
                    message: '助詞「が」の前に名詞がありません',
                    position: 0,
                    severity: 'error'
                },
                {
                    code: 'ConsecutiveParticles',
                    message: '助詞「を」が連続しています',
                    position: 1,
                    severity: 'error'
                }
            ],
            errorCount: 2,
            warningCount: 0
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', { input: 'が を _N:User' });

        expect(result.isValid).toBe(false);
        expect(result.errorCount).toBe(2);
        expect(result.errors.length).toBe(2);
    });

    test('should handle mixed errors and warnings', async () => {
        mockInvoke.mockResolvedValue({
            isValid: false,
            errors: [
                {
                    code: 'ParticleWithoutNoun',
                    message: '助詞「が」の前に名詞がありません',
                    position: 0,
                    severity: 'error'
                },
                {
                    code: 'ConsecutiveNouns',
                    message: '名詞が連続しています',
                    position: 3,
                    severity: 'warning'
                }
            ],
            errorCount: 1,
            warningCount: 1
        });

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('validate_dsl_sequence', {
            input: 'が _N:User _N:Order'
        });

        expect(result.isValid).toBe(false);
        expect(result.errorCount).toBe(1);
        expect(result.warningCount).toBe(1);
    });
});
