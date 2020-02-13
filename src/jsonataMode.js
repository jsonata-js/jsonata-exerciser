/**
 * © Copyright IBM Corp. 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

function registerJsonata(monaco) {
    // Register a new language
    monaco.languages.register({ id: 'jsonata' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('jsonata', {
        tokenizer: {
            root: [
                [/\/\*.*\*\//, "jsonata-comment"],
                [/'.*'/, "jsonata-string"],
                [/".*"/, "jsonata-string"],
                [/\$[a-zA-Z0-9_]*/, "jsonata-variable"],
                [/[a-zA-Z0-9_]+/, "jsonata-names"],
            ]
        }
    });

    const brackets = [
        {open: '(', close: ')'},
        {open: '[', close: ']'},
        {open: '{', close: '}'},
        {open: '"', close: '"'},
        {open: '\'', close: '\''},
        {open: '`', close: '`'},
    ];
    monaco.languages.setLanguageConfiguration('jsonata', {
        brackets: [['(', ')'], ['[', ']'], ['{', '}']],
        autoClosingPairs: brackets,
        surroundingPairs: brackets,
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[}\])].*$/,
            // ^.*\{[^}"']*$
            increaseIndentPattern: /^((?!\/\/).)*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/
        },
        insertSpaces: true,
        tabSize: 2
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('jsonataTheme', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'jsonata-string', foreground: 'a00000' },
            { token: 'jsonata-comment', foreground: '008000' },
            { token: 'jsonata-variable', foreground: 'ff4000' },
            { token: 'jsonata-names', foreground: '0000c0' },
        ],
        colors: {
            "editor.background": '#fffffb'
        }
    });
}

export default registerJsonata;