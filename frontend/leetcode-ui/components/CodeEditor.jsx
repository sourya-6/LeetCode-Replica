// components/CodeEditor.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
      <Editor
        height="600px"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          // General
          fontSize: 14,
          fontLigatures: true,
          lineHeight: 24,
          lineNumbers: 'on',
          scrollBeyondLastLine: true,
          readOnly: false,

          // Code Appearance
          wordWrap: 'on',
          wrappingIndent: 'same',
          formatOnType: true,
          formatOnPaste: true,
          renderWhitespace: 'all',
          renderControlCharacters: true,

          // Cursor & Editing
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: true,
          cursorStyle: 'line',
          cursorWidth: 2,

          // Brackets & Indentation
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'full',
          matchBrackets: 'always',
          tabSize: 2,
          insertSpaces: true,

          // Suggestions & IntelliSense
          quickSuggestions: { other: true, comments: true, strings: true },
          suggestOnTriggerCharacters: true,
          snippetSuggestions: 'inline',
          suggestSelection: 'first',
          wordBasedSuggestions: true,
          parameterHints: { enabled: true },

          // Minimaps & Gutter
          minimap: {
            enabled: true,
            side: 'right',
            size: 'proportional',
            renderCharacters: true,
          },
          glyphMargin: true,
          folding: true,
          foldingStrategy: 'auto',
          showFoldingControls: 'always',

          // Scroll & Layout
          smoothScrolling: true,
          scrollbar: {
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14,
          },
          fixedOverflowWidgets: true,

          // Accessibility & Misc
          accessibilitySupport: 'auto',
          codeLens: true,
          inlayHints: {
            enabled: 'on',
          },
          hover: {
            enabled: true,
            delay: 300,
            sticky: true,
          },
          lightbulb: {
            enabled: true,
          },
          links: true,

          // Others
          detectIndentation: true,
          copyWithSyntaxHighlighting: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
