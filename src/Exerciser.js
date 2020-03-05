/**
 * © Copyright IBM Corp. 2016, 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

import React from 'react';
import SplitPane from 'react-split-pane'
import MonacoEditor from 'react-monaco-editor';
import format from './images/format.png';
import sample from './sample';
import logo from './images/JSONata-white-38.png';
import share from './images/share.svg';
import docs from './images/docs-white-32.png';
import twitter from './images/twitter-white.png';
import slack from './images/Slack_Mark_Monochrome_White.svg';
import stackoverflow from './images/so-white-32.png';
import github from './images/GitHub-Mark-Light-32px.png';
import ReCAPTCHA from "react-google-recaptcha";
import Modal from 'react-modal';
import jsonataMode from './jsonataMode';
import jsonparse from './json-parse';
import Highlighter from './highlighters';

Modal.setAppElement('#root');

const recaptchaRef = React.createRef();
const baseUri = 'https://c40c296d.us-south.apigw.appdomain.cloud/api/';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        width                 : '400px',
        height                : '230px',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        borderRadius          : '10px',
        background            :  '-webkit-linear-gradient(#fff, #999)'
    }
};

let debugEvents = [];
let debugInputIndex = [];
let debugResultsIndex = [];
let debugEventGroups = new Map();

class Exerciser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            json: JSON.stringify(sample.Invoice.json, null, 2),
            jsonata: sample.Invoice.jsonata,
            result: '',
            saveModal: false,
            slackModal: false
        };
        this.handleOpenSaveModal = this.handleOpenSaveModal.bind(this);
        this.handleOpenSlackModal = this.handleOpenSlackModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenSaveModal (e) {
        e.preventDefault();
        this.setState({ saveModal: true });
    }

    handleOpenSlackModal (e) {
        e.preventDefault();
        this.setState({ slackModal: true });
    }

    handleCloseModal (e) {
        e.preventDefault();
        this.setState({ saveModal: false, slackModal: false });
    }

    componentDidMount() {
        this.loadJSONata();
        fetch(baseUri + 'versions')
          .then(res => res.json())
          .then(
            result => {
                if(process.env.NODE_ENV === 'development') {
                    result.versions.unshift('local')
                }
                const select = document.getElementById('version-select');
                result.versions.forEach(function(tag) {
                    const option = document.createElement("option");
                    option.text = tag;
                    option.value = tag;
                    select.add(option);
                });
                this.loadJSONata(result.versions[0]);
            },
            error => {
                console.log(error);
            }
          );

        if(this.props.data) {
            this.setState({json: 'Loading...', jsonata: 'Loading...'});
            // load the data
            fetch(baseUri + 'shared?id=' + this.props.data)
              .then(res => res.json())
              .then(
                result => {
                    this.setState({
                        json: JSON.stringify(result.json, null, 2),
                        jsonata: result.jsonata,
                        result: ''
                    });
                    this.eval();
                },
                error => {
                    console.log(error);
                    // this.setState({
                    //     json: error
                    // });
                }
              )
        } else {
            this.eval();
        }
    }

    jsonEditorDidMount(editor, monaco) {
        //editor.focus();
        this.inputHighligher = new Highlighter(editor, monaco, () => this.state.json, 'jsonataDebugMarker', 'jsonataDebugMargin');
        this.inputErrorHighligher = new Highlighter(editor, monaco, () => this.state.json, 'jsonataErrorMarker', 'jsonataErrorMargin');
        editor.onMouseDown(this.inputDebugHandler.bind(this));
    }

    jsonataEditorDidMount(editor, monaco) {
        this.monaco = monaco;
        this.expressionEditor = editor;
        editor.focus();
        this.expressionHighligher = new Highlighter(editor, monaco, () => this.state.jsonata, 'jsonataDebugMarker', 'jsonataDebugMargin');
        this.expressionErrorHighligher = new Highlighter(editor, monaco, () => this.state.jsonata, 'jsonataErrorMarker', 'jsonataErrorMargin');

        editor.addAction({
            id: 'jsonata-lambda',
            label: 'Lambda',
            keybindings: [ monaco.KeyCode.F11 ],
            run: function(ed) {
                ed.trigger('keyboard', 'type', {text: "λ"});
                return null;
            }
        });
        const loader = this.loadJSONata.bind(this);
        editor.addAction({
            id: 'jsonata-local',
            label: 'Local Mode',
            keybindings: [ monaco.KeyCode.F7 ],
            run: function(ed) {
                loader("local");
                return null;
            }
        });
        editor.onMouseDown(this.expressionDebugHandler.bind(this));
        editor.onMouseMove(this.expressionMouseMoveHandler.bind(this));
        this.expressionMousePosition = {};

        // monaco.languages.registerHoverProvider('jsonata', {
        //     provideHover: this.jsonataHoverProvider.bind(this)
        // });
    }

    resultsEditorDidMount(editor, monaco) {
        this.resultsHighligher = new Highlighter(editor, monaco, () => this.state.result, 'jsonataDebugMarker', 'jsonataDebugMargin');
        editor.onMouseDown(this.resultsDebugHandler.bind(this));
    }

    inputDebugHandler(event) {
        const position = event.target.position;
        const index = this.positionToIndex(position, this.state.json);
        this.clearMarkers();
        // find and highlight it in the input pane
        for(let i = 0; i < debugInputIndex.length; i++) {
            const item = debugInputIndex[i];
            if (index >= item.start && index <= item.end) {
                this.highlightSourceAndTargetById(i);
                this.highlightExpressionById(i);
                break;
            }
        }
    }

    highlightSourceAndTargetById(id) {
        const item = debugInputIndex[id];
        if(item) {
            this.inputHighligher.addMarker(item.start, item.end);
        }
        // find and highlight all occurrences of this value in the results pane
        debugResultsIndex.filter(res => res.sourceId === id).forEach(res => {
            this.resultsHighligher.addMarker(res.target.start, res.target.end);
        });
    }

    highlightExpressionById(id) {
        for (let i = 0; i < debugEvents.length; i++) {
            const item = debugEvents[i];
            if(item.result._jsonata_id === id) {
                this.expressionHighligher.addMarker(item.position.start, item.position.end);
            }
        }
    }

    expressionDebugHandler(event) {
        console.log(event.target);
        const position = event.target.position;
        if(position && event.target.type === 6) {
            const index = this.positionToIndex(position, this.state.jsonata) + 1;
            this.clearMarkers();
            this.debugExpressionList = Array.from(debugEventGroups.keys())
              .filter(expr => expr.span && index >= expr.span.start && index <= expr.span.end)
              .sort((a, b) => (a.span.end - a.span.start) - (b.span.end - b.span.start));

            const content = `
<div id="accordion">${ 
                this.debugExpressionList.map((expr, i) => {
                    return `
     <div class="panel">
          <div class="header debugExpr" id="expr${i}">${this.state.jsonata.substring(expr.span.start, expr.span.end)}</div>
          <div class="body"><ul>${
                        debugEventGroups.get(expr).map(item => `<li id="res${item.result._jsonata_id}">${JSON.stringify(item.result)}</li>`).join('')
                    }
          </ul></div>
     </div>`
                 }).join('')}
</div>`;

            //when panel is clicked, handlePanelClick is called.
            function handlePanelClick(event){
                showPanel(event.currentTarget);
            }

            //Hide currentPanel and show new panel.
            function showPanel(panel){
                //Hide current one. First time it will be null.
                const accordionElem = document.getElementById("accordion");
                var expandedPanel = accordionElem.querySelector(".active");
                if (expandedPanel){
                    expandedPanel.classList.remove("active");
                }

                //Show new one
                panel.classList.add("active");

            }

            function initAccordion() {
                const accordionElem = document.getElementById("accordion");
                var allPanelElems = accordionElem.querySelectorAll(".panel");
                for (var i = 0, len = allPanelElems.length; i < len; i++) {
                    allPanelElems[i].addEventListener("click", handlePanelClick);
                }
                showPanel(allPanelElems[0])
            }


            console.log(content);

            const editor = this.expressionEditor;
            if(this.expressionDebugOverlay) {
                editor.removeContentWidget(this.expressionDebugOverlay);
            }

            this.expressionDebugOverlay = {
                domNode: null,
                allowEditorOverflow: true,
                getId: function() {
                    return 'my.content.widget';
                },
                getDomNode: function() {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div');
                        this.domNode.className += "debugPopup";
                        this.domNode.innerHTML = content;
                    }
                    console.log(this.domNode);
                    return this.domNode;
                },
                getPosition: function() {
                    console.log('getPosition', position);
                    return {
                        position: {
                            lineNumber: position.lineNumber,
                            column: position.column
                        },
                        // preference: [editor.ContentWidgetPositionPreference.BELOW, editor.ContentWidgetPositionPreference.ABOVE]
                        preference: [2, 1]
                    };
                }
            };
            editor.addContentWidget(this.expressionDebugOverlay);
            initAccordion();

        } else if(event.target.type !== 9 && this.expressionDebugOverlay) {
            this.expressionEditor.removeContentWidget(this.expressionDebugOverlay);
        }

    }

    expressionMouseMoveHandler(event) {
        let expr;
        if(event.target.type === 9) {
            // popup
            const id = event.target.element.id;
            if(id.startsWith('res')) {
                const jsonata_id = Number.parseInt(id.substring(3));
                if (this.debugFocus !== jsonata_id) {
                    this.debugFocus = jsonata_id;
                    console.log(id, jsonata_id);
                    this.inputHighligher.clearMarkers();
                    this.resultsHighligher.clearMarkers();
                    this.highlightSourceAndTargetById(jsonata_id);
                }
                return;
            } else if(id.startsWith('expr')) {
                console.log(event.target.element.id);
                const index = Number.parseInt(id.substring(4));
                expr = this.debugExpressionList[index];
            }
        } else {
            const position = event.target.position;
            if (position) {
                if (!(this.expressionMousePosition.lineNumber === position.lineNumber
                  && this.expressionMousePosition.column === position.column)) {
                    this.expressionMousePosition = position;
                    const index = this.positionToIndex(position, this.state.jsonata) + 1;

                    console.log(position, index);

                    const exprs = Array.from(debugEventGroups.keys())
                      .filter(expr => expr.span && index >= expr.span.start && index <= expr.span.end)
                      .sort((a, b) => (a.span.end - a.span.start) - (b.span.end - b.span.start));
                    console.log(exprs);
                    if (exprs.length > 0) {
                        expr = exprs[0];
                    }
                }
            }
        }
        if(expr) {
            console.log('Expr Marker: ', expr);
            this.clearMarkers();
            this.expressionHighligher.addMarker(expr.span.start + 1, expr.span.end + 1);
            debugEventGroups.get(expr)
              .forEach(item => {
                  if (item.result && typeof item.result._jsonata_id === 'number') {
                      this.highlightSourceAndTargetById(item.result._jsonata_id);
                  }
              });
        }
    }

    resultsDebugHandler(event) {
        const position = event.target.position;
        const index = this.positionToIndex(position, this.state.result);
        this.clearMarkers();
        for (let i = 0; i < debugResultsIndex.length; i++) {
            const item = debugResultsIndex[i];
            if (index >= item.target.start && index <= item.target.end) {
                const source = debugInputIndex[item.sourceId];
                if(source) {
                    this.inputHighligher.addMarker(source.start, source.end);
                }
                this.resultsHighligher.addMarker(item.target.start, item.target.end);
                this.highlightExpressionById(item.sourceId);
                return;
            }
        }
    }

    jsonataHoverProvider(document, position, token) {
        const index = this.positionToIndex(position, this.state.jsonata) + 1;
        const exprs = Array.from(debugEventGroups.keys())
          .filter(expr => expr.span && index >= expr.span.start && index <= expr.span.end)
          .sort((a, b) => (a.span.end - a.span.start) - (b.span.end - b.span.start));
        const contents = exprs.map(expr => {
            return {value:
                '[link](ref)\n' +
                '**`'
                + this.state.jsonata.substring(expr.span.start, expr.span.end)
                + '`**\n- `'
                + debugEventGroups.get(expr).map(item => JSON.stringify(item.result)).join('`\n- `')
                + '`'
            }
        });
        console.log(contents);
        return {
            range: new this.monaco.Range(1, 1, document.getLineCount(), document.getLineMaxColumn(document.getLineCount())),
            contents: contents
        };
    }

    positionToIndex(position, buffer) {
        let index = 0, line = 1;
        while (line < position.lineNumber && index < buffer.length) {
            index = buffer.indexOf('\n', index) + 1;
            line++;
        }
        index += position.column - 1;
        return index;
    }

    onChangeData(newValue, e) {
        this.setState({json: newValue});
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 500);
        this.clearMarkers();
    }

    onChangeExpression(newValue, e) {
        this.setState({jsonata: newValue});
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 500);
        this.clearMarkers();
    }

    format() {
        const formatted = JSON.stringify(JSON.parse(this.state.json), null, 2);
        this.setState({json: formatted});
    }

    changeVersion(event) {
        this.loadJSONata(event.target.value, false);
        this.timer = setTimeout(this.eval.bind(this), 100);
        this.clearMarkers();
    }

    loadJSONata(version, isBranch)
    {
        const head= document.getElementsByTagName('head')[0];
        const script= document.createElement('script');
        const label = document.getElementById('version-label');
        script.type= 'text/javascript';
        if(version === 'local') {
            script.src = 'http://localhost:3009/jsonata.js';
            label.innerHTML = '** Local **';
            this.local = true;
        } else if(isBranch) {
            script.src = 'https://rawgit.com/jsonata-js/jsonata/' + version + '/jsonata.js';
            label.innerHTML = '** ' + version + ' **';
        } else {
            version = version ? '@' + version : "";
            script.src = 'https://cdn.jsdelivr.net/npm/jsonata' + version + '/jsonata.min.js';
            label.innerHTML = version;
            this.local = false;
        }
        head.appendChild(script);
    }


    changeSample(event) {
        const data = sample[event.target.value];
        this.setState({
            json: JSON.stringify(data.json, null, 2),
            jsonata: data.jsonata
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 100);
        this.clearMarkers();
    }

    eval() {
        let input, jsonataResult;

        if(typeof window.jsonata === 'undefined') {
            this.timer = setTimeout(this.eval.bind(this), 500);
            return;
        }

        try {
            //input = JSON.parse(this.state.json);
            const source = jsonparse.parse(this.state.json);
            input = source.value;
            debugInputIndex = source.idIndex;
            console.log(debugInputIndex);
        } catch (err) {
            console.log(err);
            this.setState({result: 'ERROR IN INPUT DATA: ' + err.message});
            const pos = err.message.indexOf('at position ');
            if(pos !== -1) {
                console.log(err);
                const start = parseInt(err.message.substr(pos+12))+1;
                this.inputErrorHighligher.addMarker(start, start + 1);
            }
            return;
        }

        try {
            if (this.state.jsonata !== "") {
                jsonataResult = this.evalJsonata(input);
                this.setState({result: jsonataResult});
            }
        } catch (err) {
            this.setState({result: err.message || String(err)});
            console.log(err);
            const end = err.position + 1;
            const start = end - (err.token ? err.token.length : 1);
            this.expressionErrorHighligher.addMarker(start, end);
        }
    }

    highlightSource(result) {
        const expr = window.jsonata('$.**[]');
        const content = expr.evaluate(result);
        if(Array.isArray(content)) {
            content
              .filter(val => typeof val === 'object' && val !== null && typeof val._jsonata_id === 'number')
              .forEach(val => {
                  const source = debugInputIndex[val._jsonata_id];
                  if(source) {
                      this.inputHighligher.addMarker(source.start, source.end);
                  }
              })
        }
    }

    clearMarkers() {
        this.expressionHighligher.clearMarkers();
        this.inputHighligher.clearMarkers();
        this.resultsHighligher.clearMarkers();
        this.inputErrorHighligher.clearMarkers();
        this.expressionErrorHighligher.clearMarkers();
    }

    evalJsonata(input) {
        const expr = window.jsonata(this.state.jsonata);

        expr.assign('trace', function(arg) {
            console.log(arg);
        });

        // expr.registerFunction('sin', x => Math.sin(x), '<n-:n>');
        // expr.registerFunction('cos', x => Math.cos(x), '<n-:n>');

        if(!this.local) {
            this.timeboxExpression(expr, 1000, 500);
        }

        //let pathresult = expr.evaluate(input);
        debugEventGroups = new Map();
        debugEvents = [];

        const debug = expr.debug(input);
        while (!debug.done()) {
            const info = debug.value();
            let result = info.result;
            if(result && typeof result._jsonata_id === 'undefined') {
                result = this.wrapValue(result);
                info.result = result;
            }
            if(info.expr) {
                if(debugEventGroups.get(info.expr)) {
                    debugEventGroups.get(info.expr).push(info)
                } else {
                    debugEventGroups.set(info.expr, [info]);
                }
            }
            debugEvents.push({
                position: {
                    start: info.expr.span ? info.expr.span.start + 1 : info.expr.position - (info.expr.value ? info.expr.value.length : 0) + 1,
                    end: info.expr.span ? info.expr.span.end + 1 : info.expr.position + 1
                },
                result: info.result,
                expr: info.expr,
                context: info.input._jsonata_id
            });
            debug.step(result);
        }
        // table.forEach((value, key) => {
        //     debugEvents.push({
        //         position: {
        //             start: key.span ? key.span.start + 1 : key.position - (key.value ? key.value.length : 0) + 1,
        //             end: key.span ? key.span.end + 1 : key.position + 1
        //         },
        //         results: value.map(val => val.result)
        //     });
        // });
        console.log(debugEvents);

        let pathresult = debug.value();

        this.highlightSource(pathresult);
        if (typeof pathresult === 'undefined') {
            pathresult = '** no match **';
        } else {
            const ser = jsonparse.stringify(pathresult);
            pathresult = ser.output;
            debugResultsIndex = ser.metadata;
            // pathresult = JSON.stringify(pathresult, function (key, val) {
            //     return (typeof val !== 'undefined' && val !== null && val.toPrecision) ? Number(val.toPrecision(13)) :
            //       (val && (val._jsonata_lambda === true || val._jsonata_function === true)) ? '{function:' + (val.signature ? val.signature.definition : "") + '}' :
            //         (typeof val === 'function') ? '<native function>#' + val.length  : val;
            // }, 2);
        }
        return pathresult;
    }

    wrapValue(value) {
        let result = value;
        switch(typeof value) {
            case 'string':
                result = new String(value);
                break;
            case 'number':
                result = new Number(value);
                break;
            case 'boolean':
                result = new Boolean(value);
                break;
            default: {
                result = value;
            }
        }
        if(result) {
            Object.defineProperty(result, '_jsonata_id', {
                value: debugInputIndex.length
            });
            debugInputIndex.push(result);
        }
        return result;
    }

    timeboxExpression(expr, timeout, maxDepth) {
        let depth = 0;
        const time = Date.now();

        const checkRunnaway = function() {
            if(depth > maxDepth) {
                // stack too deep
                // eslint-disable-next-line  no-throw-literal
                throw {
                    code: 'U1001',
                    message: 'Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.',
                    stack: (new Error()).stack
                };
            }
            if(Date.now() - time > timeout) {
                // expression has run for too long
                // eslint-disable-next-line  no-throw-literal
                throw {
                    code: 'U1002',
                    message: "Expression evaluation timeout: Check for infinite loop",
                    stack: (new Error()).stack
                };
            }

        };

        // register callbacks
        expr.assign('__evaluate_entry', function(expr, input, environment) {
            depth++;
            checkRunnaway();
        });
        expr.assign('__evaluate_exit', function(expr, input, environment, result) {
            depth--;
            checkRunnaway();
        });
    }

    save(resp) {
        // post the input data and jsonata
        let input;
        try {
            input = JSON.parse(this.state.json);
        } catch(err) {}
        const body = {
            input: input,
            jsonata: this.state.jsonata,
            recaptcha: resp
        };
        if(typeof this.state.result !== 'undefined') {
            body.result = this.state.result;
        }
        // if(typeof jsonataError !== 'undefined') {
        //     body.error = jsonataError;
        // }

        const url = baseUri + 'save';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)})
          .then(res => res.json())
          .then(response => {
            const location = "https://try.jsonata.org/" + response.id;
            const msg = 'Share this link: <a href="' + location + '">' + location + '</a>';
            document.getElementById("share-msg").innerHTML = msg;
            document.getElementById("share-title").innerHTML = 'Expression saved!';
            document.getElementsByClassName("verify")[0].style.display = 'none';
            //document.getElementsByClassName("verify")[1].style.display = 'none';
        }).catch(error => console.error(error));
    }

    slack(resp) {
        let email;
        try {
            email = document.getElementById("slack-email").value;
        } catch(err) {}
        const body = {
            email: email,
            recaptcha: resp
        };

        const url = baseUri + 'slack';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)})
          .then(res => res.json())
          .then(response => {
            document.getElementById("slack-title").innerHTML = 'Invitation sent!';
            document.getElementsByClassName("verify")[0].style.display = 'none';
            //document.getElementsByClassName("verify")[1].style.display = 'none';
        }).catch(error => {
            document.getElementById("slack-title").innerHTML = 'Error: ' + error.message;
        });
    }

    render() {
        const options = {
            minimap: {enabled: false},
            lineNumbers: 'off',
            contextmenu: false,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            extraEditorClassName: 'editor-pane'
        };

        return <div className="App">
            <header className="App-header">
                <div id="banner">
                    <div id="logo"><a href="http://jsonata.org"><img src={logo} alt={"JSONata"}/></a></div>
                    <div id="banner-strip" className="bannerpart">
                        <div id="banner1">JSONata Exerciser</div>
                        <div id="banner4">
                            <a href="#share" onClick={this.handleOpenSaveModal.bind(this)}><img src={share} alt="Save and Share"/></a>
                            <a href="http://docs.jsonata.org"><img src={docs} alt="Documentation"/></a>
                            <a
                              href="http://twitter.com/intent/tweet?status=JSONata:  The JSON query and transformation language.+http://jsonata.org"><img
                              id="t-icon" src={twitter} alt={"Twitter"}/></a>
                            <a href="#slack" onClick={this.handleOpenSlackModal.bind(this)}><img src={slack} alt={"Join us on Slack"}/></a>
                            <a href="http://stackoverflow.com/search?q=JSONata"><img src={stackoverflow} alt={"StackOverflow"}/></a>
                            <a href="https://github.com/jsonata-js/jsonata"><img src={github} alt={"GitHub"}/></a>
                        </div>
                    </div>
                </div>
            </header>

            <SplitPane split="vertical" minSize={100} defaultSize={'50%'}>
                <div className="pane">
                    <MonacoEditor
                      language="json"
                      theme="jsonataTheme"
                      value={this.state.json}
                      options={options}
                      onChange={this.onChangeData.bind(this)}
                      editorDidMount={this.jsonEditorDidMount.bind(this)}
                    />
                    <div id="json-label" className="label">JSON</div>
                    <img src={format} id="json-format" title="Format" onClick={this.format.bind(this)} alt={"Format"}/>
                    <select id="sample-data" onChange={this.changeSample.bind(this)}>
                        <option value="Invoice">Invoice</option>
                        <option value="Address">Address</option>
                        <option value="Schema">Schema</option>
                        <option value="Library">Library</option>
                    </select>
                </div>
                <SplitPane split="horizontal" minSize={50} defaultSize={170}>
                    <div className="pane">
                        <MonacoEditor
                          language="jsonata"
                          theme="jsonataTheme"
                          value={this.state.jsonata}
                          options={options}
                          onChange={this.onChangeExpression.bind(this)}
                          editorWillMount={jsonataMode.bind(this)}
                          editorDidMount={this.jsonataEditorDidMount.bind(this)}
                        />
                        <div id="jsonata-label" className="label">JSONata</div>
                        <select id="version-select" onChange={this.changeVersion.bind(this)}></select>
                        <div id="version-label" className="label"></div>
                    </div>
                    <MonacoEditor
                      language="json"
                      theme="jsonataTheme"
                      value={this.state.result}
                      options={{
                          lineNumbers: 'off',
                          minimap: {enabled: false},
                          automaticLayout: true,
                          contextmenu: false,
                          scrollBeyondLastLine: false,
                          readOnly: true,
                          extraEditorClassName: 'result-pane'
                      }}
                      editorDidMount={this.resultsEditorDidMount.bind(this)}
                    />
                </SplitPane>
            </SplitPane>
            <Modal
              isOpen={this.state.saveModal}
              onRequestClose={this.handleCloseModal.bind(this)}
              style={customStyles}
              contentLabel="Save and Share"
            >
                <div>
                    <a href="#close" title="Close" className="close"
                       onClick={this.handleCloseModal.bind(this)}>&times;</a>
                    <h2 id="share-title">Save expression</h2>
                    <p id="share-msg">Save and share your JSONata expression.</p>
                    <p className="verify">Please check the box below to get a URL to your saved expression...</p>
                    <form onSubmit={this.onSubmit} >
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey="6LdOEBkUAAAAAB0ADgy0xeUOtVWfSjj3cuhPFqbt"
                          onChange={this.save.bind(this)}
                        />
                    </form>
                </div>
            </Modal>
            <Modal
              isOpen={this.state.slackModal}
              onRequestClose={this.handleCloseModal.bind(this)}
              style={customStyles}
              contentLabel="Slack Invite"
            >
                <div>
                    <a href="#close" title="Close" className="close"
                       onClick={this.handleCloseModal.bind(this)}>&times;</a>
                    <h2 id="slack-title">Join us on Slack</h2>
                    <p><input id="slack-email" placeholder="Enter your email"/></p>
                    <p className="verify">Please check the box below to get an invitation...</p>
                    <form onSubmit={this.onSubmit} >
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey="6LdOEBkUAAAAAB0ADgy0xeUOtVWfSjj3cuhPFqbt"
                          onChange={this.slack.bind(this)}
                        />
                    </form>
                </div>
            </Modal>
        </div>;
    }
}

export default Exerciser;
