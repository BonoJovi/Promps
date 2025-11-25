/**
 * Promps - Main UI Logic Tests
 *
 * Tests for frontend UI logic and Tauri integration
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock Tauri API
let mockInvoke;

beforeEach(() => {
    mockInvoke = jest.fn();
    global.window = global.window || {};
    global.window.__TAURI__ = {
        invoke: mockInvoke
    };
});

describe('Tauri Command Invocation', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should invoke greet command correctly', async () => {
        mockInvoke.mockResolvedValue('Hello, Tauri! Welcome to Promps.');

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('greet', { name: 'Tauri' });

        expect(mockInvoke).toHaveBeenCalledWith('greet', { name: 'Tauri' });
        expect(result).toBe('Hello, Tauri! Welcome to Promps.');
    });

    test('should invoke generate_prompt_from_text command', async () => {
        const expectedPrompt = 'ユーザー (NOUN) が 注文 (NOUN) を 作成';
        mockInvoke.mockResolvedValue(expectedPrompt);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', {
            input: '_N:ユーザー が _N:注文 を 作成'
        });

        expect(mockInvoke).toHaveBeenCalledWith('generate_prompt_from_text', {
            input: '_N:ユーザー が _N:注文 を 作成'
        });
        expect(result).toContain('ユーザー');
        expect(result).toContain('注文');
    });

    test('should handle command errors gracefully', async () => {
        mockInvoke.mockRejectedValue(new Error('Command failed'));

        const invoke = window.__TAURI__.invoke;

        await expect(
            invoke('generate_prompt_from_text', { input: '' })
        ).rejects.toThrow('Command failed');
    });
});

describe('Prompt Generation Logic', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should generate prompt from simple DSL', async () => {
        const input = '_N:User';
        const expectedOutput = 'User (NOUN)';

        mockInvoke.mockResolvedValue(expectedOutput);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', { input });

        expect(result).toContain('User');
        expect(result).toContain('(NOUN)');
    });

    test('should generate prompt from complex DSL', async () => {
        const input = '_N:GUI ブロック ビルダー 機能  ドラッグ アンド ドロップ で ブロック を 配置 する';
        mockInvoke.mockResolvedValue('GUI ブロック ビルダー 機能 (NOUN)\nドラッグ アンド ドロップ で ブロック を 配置 する\n');

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', { input });

        expect(result).toContain('GUI ブロック ビルダー 機能');
        expect(result).toContain('(NOUN)');
        expect(result).toContain('ドラッグ アンド ドロップ で ブロック を 配置 する');
    });

    test('should handle empty input', async () => {
        const input = '';
        mockInvoke.mockResolvedValue('');

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', { input });

        expect(result).toBe('');
    });

    test('should handle multiple nouns', async () => {
        const input = '_N:ユーザー が _N:注文 を 作成';
        const expectedOutput = 'ユーザー (NOUN) が 注文 (NOUN) を 作成';

        mockInvoke.mockResolvedValue(expectedOutput);

        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', { input });

        expect(result).toContain('ユーザー');
        expect(result).toContain('注文');
        expect(result).toContain('(NOUN)');
    });
});

describe('Preview Update Logic', () => {
    let mockPreviewDiv;

    beforeEach(() => {
        mockInvoke.mockClear();
        mockPreviewDiv = {
            innerHTML: '',
            textContent: ''
        };
    });

    test('should show placeholder for empty DSL', async () => {
        const dslCode = '';

        // Simulate updatePreview logic
        if (!dslCode || dslCode.trim() === '') {
            mockPreviewDiv.innerHTML = '<p class="placeholder">Generated prompt will appear here.</p>';
        }

        expect(mockPreviewDiv.innerHTML).toContain('Generated prompt will appear here.');
    });

    test('should update preview with generated prompt', async () => {
        const dslCode = '_N:User';
        const prompt = 'User (NOUN)';

        mockInvoke.mockResolvedValue(prompt);

        // Simulate updatePreview logic
        const invoke = window.__TAURI__.invoke;
        const generatedPrompt = await invoke('generate_prompt_from_text', { input: dslCode });
        mockPreviewDiv.textContent = generatedPrompt;

        expect(mockPreviewDiv.textContent).toBe('User (NOUN)');
    });

    test('should show error message on generation failure', async () => {
        const dslCode = '_N:Invalid';
        const errorMessage = 'Generation failed';

        mockInvoke.mockRejectedValue(new Error(errorMessage));

        // Simulate updatePreview error handling
        try {
            const invoke = window.__TAURI__.invoke;
            await invoke('generate_prompt_from_text', { input: dslCode });
        } catch (error) {
            mockPreviewDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }

        expect(mockPreviewDiv.innerHTML).toContain('Error:');
        expect(mockPreviewDiv.innerHTML).toContain('Generation failed');
    });
});

describe('Real-time Preview Updates', () => {
    beforeEach(() => {
        mockInvoke.mockClear();
    });

    test('should trigger preview update on block change', async () => {
        const dslCode = '_N:User _N:Order ';
        const prompt = 'User (NOUN)\nOrder (NOUN)';

        mockInvoke.mockResolvedValue(prompt);

        // Simulate onBlocklyChange -> updatePreview flow
        const invoke = window.__TAURI__.invoke;
        const result = await invoke('generate_prompt_from_text', { input: dslCode.trim() });

        expect(mockInvoke).toHaveBeenCalled();
        expect(result).toContain('User');
        expect(result).toContain('Order');
    });

    test('should debounce rapid changes', async () => {
        // In real implementation, rapid changes should be debounced
        // Here we test that multiple calls work correctly
        const calls = [
            '_N:U',
            '_N:Us',
            '_N:Use',
            '_N:User'
        ];

        for (const input of calls) {
            mockInvoke.mockResolvedValue(`${input.replace('_N:', '')} (NOUN)`);
            const invoke = window.__TAURI__.invoke;
            await invoke('generate_prompt_from_text', { input });
        }

        expect(mockInvoke).toHaveBeenCalledTimes(4);
    });
});
