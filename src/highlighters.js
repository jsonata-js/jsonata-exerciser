/**
 * © Copyright IBM Corp. 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

class Highlighter {
    constructor(editor, monaco, buffer, inlineStyle, marginStyle) {
        this.editor = editor;
        this.monaco = monaco;
        this.markers = [];
        this.decorations = [];
        this.buffer = buffer;
        this.inlineStyle = inlineStyle;
        this.marginStyle = marginStyle;
    }

    addMarker(start, end) {
        const buffer = this.buffer();
        const resolve = offset => {
            let line = 1;
            let column = 1;
            let position = 1;
            while (position < offset) {
                if (buffer.charAt(position) === '\n') {
                    line++;
                    column = 0;
                } else {
                    column++;
                }
                position++;
            }
            return {line, column};
        };
        const from = resolve(start);
        let to = resolve(end);

        this.markers.push({ range: new this.monaco.Range(from.line, from.column, to.line, to.column), options: { inlineClassName: this.inlineStyle }});
        if(to.column === 0 && to.line > from.line) {
            to = resolve(end - 1);
        }
        this.markers.push({ range: new this.monaco.Range(from.line,1,to.line,1), options: { isWholeLine: true, linesDecorationsClassName: this.marginStyle, overviewRuler: {position: 4, color: 'rgba(100, 0, 0, 0.5)'} }});
        this.redrawMarkers();
    }

    clearMarkers() {
        this.markers = [];
        this.redrawMarkers();
    }

    redrawMarkers() {
        this.decorations = this.editor.deltaDecorations(this.decorations, this.markers);
    }
}

export default Highlighter;