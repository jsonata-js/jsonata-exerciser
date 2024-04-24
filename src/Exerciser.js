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
import ExternalLibsComponent, { getLibraryHandle } from './externalLibsComponent';

Modal.setAppElement('#root');

const recaptchaRef = React.createRef();

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: '400px',
        height: '230px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        background: '-webkit-linear-gradient(#fff, #999)'
    }
};
const externalLibsModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        width: '60%',
        margin: '20px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
    }
};

class Exerciser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            json: JSON.stringify(sample.Invoice.json, null, 2),
            jsonata: sample.Invoice.jsonata,
            bindings: sample.Invoice.bindings,
            result: '',
            saveModal: false,
            slackModal: false,
            externalLibsModal: false,
            panelStates: {
                bindings: 'hidden'
            },
            externalLibs: []
        };
        this.handleOpenSaveModal = this.handleOpenSaveModal.bind(this);
        this.handleOpenSlackModal = this.handleOpenSlackModal.bind(this);
        this.handleOpenExternalLibsModal = this.handleOpenExternalLibsModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenSaveModal(e) {
        e.preventDefault();
        this.setState({ saveModal: true });
    }

    setPanelState(panel, state) {
        this.setState({ panelStates: { ...this.state.panelStates, [panel]: state } });
    }

    handleOpenSlackModal(e) {
        e.preventDefault();
        this.setState({ slackModal: true });
    }
    handleOpenExternalLibsModal(e) {
        e.preventDefault();
        this.setState({ externalLibsModal: true });
    }

    handleCloseModal(e) {
        e.preventDefault();
        this.setState({ saveModal: false, slackModal: false, externalLibsModal: false });
    }

    componentDidMount() {
        this.loadJSONata();
        fetch('https://jsonata-versions.1g5lolddjght.us-east.codeengine.appdomain.cloud')
            .then(res => res.json())
            .then(
                result => {
                    console.log(result);
                    if (process.env.NODE_ENV === 'development') {
                        result.versions.unshift('local')
                    }
                    const select = document.getElementById('version-select');
                    result.versions.forEach(function (tag) {
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

        console.log(this.props.data);
        if (this.props.data) {
            this.setState({ json: 'Loading...', jsonata: 'Loading...' });
            const self = this;
            // load the data
            fetch('https://get-shared.1g5lolddjght.us-east.codeengine.appdomain.cloud?id=' + this.props.data)
                .then(res => res.json())
                .then(result =>{
                    return Promise.all([Promise.resolve(result), this.getExternalLibsInitialized(result.externalLibs)])
                })
                .then(
                    async ([result, externalLibs]) => {
                        console.log(result);
                        this.setState({
                            json: (typeof result.json === 'undefined') ? '' : JSON.stringify(result.json, null, 2),
                            jsonata: result.jsonata,
                            bindings: result.bindings !== undefined ? result.bindings : '{\n  // name: value\n}',
                            externalLibs: externalLibs,
                            result: ''
                        });
                        await self.eval();
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

    getExternalLibsInitialized(externalLibs = []) {
        const allPromises = externalLibs.map(lib => {
            return fetch(lib.url)
                .then((res) => {
                    if (!res.ok) {
                        console.error(res)
                        return Promise.resolve(undefined);
                    }
                    return res.text();
                }).then(libFileText => {
                    if (!libFileText) {
                        console.error("Could not load library from " + lib.url)
                        return Promise.resolve(undefined);
                    }
                    const libraryContext = getLibraryHandle(libFileText, lib.moduleName);
                    return Promise.resolve({ ...lib, libraryContext: { [lib.moduleName]: libraryContext } })
                })
        });

        return Promise.all(allPromises);
    }

    jsonEditorDidMount(editor, monaco) {
        this.jsonEditor = editor;
        editor.decorations = [];
        //editor.focus();
    }

    bindingsEditorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        this.bindingsEditor = editor;
        editor.decorations = [];
    }

    jsonataEditorDidMount(editor, monaco) {
        this.monaco = monaco;
        this.jsonataEditor = editor;
        editor.decorations = [];

        editor.addAction({
            id: 'jsonata-lambda',
            label: 'Lambda',
            keybindings: [monaco.KeyCode.F11],
            run: function (ed) {
                ed.trigger('keyboard', 'type', { text: "λ" });
                return null;
            }
        });
        const loader = this.loadJSONata.bind(this);
        editor.addAction({
            id: 'jsonata-local',
            label: 'Local Mode',
            keybindings: [monaco.KeyCode.F7],
            run: function (ed) {
                loader("local");
                return null;
            }
        });
    }

    onChangeData(newValue, e) {
        this.setState({json: newValue});
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 500);
        this.clearMarkers();
    }
    onChangeBindings(newValue, e) {
        this.setState({ bindings: newValue });
        console.log('onChangeBindings', newValue, e);
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

    onChangeExternalLibraries(libs) {
        this.setState({ externalLibs: libs });
        console.log('onChangeExternalLibraries', libs);
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 500);
        this.clearMarkers();
    }

    format() {
        const formatted = JSON.stringify(JSON.parse(this.state.json), null, 2);
        this.setState({ json: formatted });
    }

    changeVersion(event) {
        this.loadJSONata(event.target.value, false);
        this.timer = setTimeout(this.eval.bind(this), 100);
        this.clearMarkers();
    }

    loadJSONata(version, isBranch) {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        const label = document.getElementById('version-label');
        script.type = 'text/javascript';
        if (version === 'local') {
            script.src = 'http://localhost:3009/jsonata.js';
            label.innerHTML = '** Local **';
            this.local = true;
        } else if (isBranch) {
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
            jsonata: data.jsonata,
            bindings: data.bindings
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(this.eval.bind(this), 100);
        this.clearMarkers();
    }

    async eval() {
        let input, jsonataResult, bindings;

        if (typeof window.jsonata === 'undefined') {
            this.timer = setTimeout(this.eval.bind(this), 500);
            return;
        }

        try {
            if (typeof this.state.json !== 'undefined' && this.state.json !== '') {
                input = JSON.parse(this.state.json);
            } else {
                input = undefined;
            }
        } catch (err) {
            console.log(err);
            this.setState({ result: 'ERROR IN INPUT DATA: ' + err.message });
            const pos = err.message.indexOf('at position ');
            console.log('pos=', pos);
            if (pos !== -1) {
                console.log(err);
                const start = parseInt(err.message.substr(pos + 12)) + 1;
                this.errorMarker(start, start + 1, this.jsonEditor, this.state.json);
            }
            return;
        }


        let externalLibs = {};

        if (this.state.externalLibs) {
            for (const lib of this.state.externalLibs) {
                externalLibs = { ...externalLibs, ...lib.libraryContext }
            }
        }

        try {
            const args = Object.keys(externalLibs);
            // eslint-disable-next-line no-new-func
            bindings = new Function(...args, `return (${this.state.bindings})`)(...(args.map(a => externalLibs[a])));
        } catch (err) {
            console.log(err);
            this.setState({ result: 'ERROR IN BINDINGS: ' + err.message });
            return;
        }

        try {
            if (this.state.jsonata !== '') {
                const allBindings = { ...bindings, ...externalLibs };
                jsonataResult = await this.evalJsonata(input, allBindings);
            } else {
                jsonataResult = '^^ Enter a JSONata expression in the box above ^^'
            }
            this.setState({result: jsonataResult});
        } catch (err) {
            this.setState({ result: err.message || String(err) });
            console.log(err);
            const end = err.position + 1;
            const start = end - (err.token ? err.token.length : 1);
            this.errorMarker(start, end, this.jsonataEditor, this.state.jsonata);
        }
    }

    errorMarker(start, end, editor, buffer) {
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
            return { line, column };
        };
        const from = resolve(start);
        const to = resolve(end);
        editor.decorations = editor.deltaDecorations(editor.decorations, [
            { range: new this.monaco.Range(from.line, from.column, to.line, to.column), options: { inlineClassName: 'jsonataErrorMarker' } },
            { range: new this.monaco.Range(from.line, 1, to.line, 1), options: { isWholeLine: true, linesDecorationsClassName: 'jsonataErrorMargin' } },
        ]);
    }

    clearMarkers() {
        this.jsonataEditor.decorations = this.jsonataEditor.deltaDecorations(this.jsonataEditor.decorations, []);
        this.jsonEditor.decorations = this.jsonEditor.deltaDecorations(this.jsonEditor.decorations, []);
    }

    async evalJsonata(input, bindings) {
        const expr = window.jsonata(this.state.jsonata);

        expr.assign('trace', function (arg) {
            console.log(arg);
        });

        // expr.registerFunction('sin', x => Math.sin(x), '<n-:n>');
        // expr.registerFunction('cos', x => Math.cos(x), '<n-:n>');

        if (!this.local) {
            this.timeboxExpression(expr, 1000, 500);
        }

        let pathresult = await expr.evaluate(input, bindings);
        if (typeof pathresult === 'undefined') {
            pathresult = '** no match **';
        } else {
            pathresult = JSON.stringify(pathresult, function (key, val) {
                return (typeof val !== 'undefined' && val !== null && val.toPrecision) ? Number(val.toPrecision(13)) :
                    (val && (val._jsonata_lambda === true || val._jsonata_function === true)) ? '{function:' + (val.signature ? val.signature.definition : "") + '}' :
                        (typeof val === 'function') ? '<native function>#' + val.length : val;
            }, 2);
        }
        return pathresult;
    }

    timeboxExpression(expr, timeout, maxDepth) {
        let depth = 0;
        const time = Date.now();

        const checkRunnaway = function () {
            if (depth > maxDepth) {
                // stack too deep
                // eslint-disable-next-line  no-throw-literal
                throw {
                    code: 'U1001',
                    message: 'Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.',
                    stack: (new Error()).stack
                };
            }
            if (Date.now() - time > timeout) {
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
        expr.assign('__evaluate_entry', function (expr, input, environment) {
            depth++;
            checkRunnaway();
        });
        expr.assign('__evaluate_exit', function (expr, input, environment, result) {
            depth--;
            checkRunnaway();
        });
    }

    save(resp) {
        // post the input data and jsonata
        let input;
        try {
            input = JSON.parse(this.state.json);
        } catch (err) { }
        const body = {
            input: input,
            jsonata: this.state.jsonata,
            bindings: this.state.bindings,
            externalLibs: this.state.externalLibs,
            recaptcha: resp
        };
        if (typeof this.state.result !== 'undefined') {
            body.result = this.state.result;
        }
        // if(typeof jsonataError !== 'undefined') {
        //     body.error = jsonataError;
        // }

        console.log("save:", body);
        const url = 'https://save.1g5lolddjght.us-east.codeengine.appdomain.cloud';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(
                response => {
                    console.log(response);
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
            console.log(email)
        } catch (err) { }
        const body = {
            email: email,
            recaptcha: resp
        };

        const url = 'https://slack-invite.1g5lolddjght.us-east.codeengine.appdomain.cloud';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(
                response => {
                    console.log(response);
                    document.getElementById("slack-title").innerHTML = 'Invitation sent!';
                    document.getElementsByClassName("verify")[0].style.display = 'none';
                    //document.getElementsByClassName("verify")[1].style.display = 'none';
                }).catch(error => {
                    console.error(error);
                    document.getElementById("slack-title").innerHTML = 'Error: ' + error.message;
                });
    }

    render() {
        const options = {
            minimap: { enabled: false },
            lineNumbers: 'off',
            contextmenu: false,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            extraEditorClassName: 'editor-pane'
        };

        return <div className="App">
            <header className="App-header">
                <div id="banner">
                    <div id="logo"><a href="http://jsonata.org"><img src={logo} alt={"JSONata"} /></a></div>
                    <div id="banner-strip" className="bannerpart">
                        <div id="banner1">JSONata Exerciser</div>
                        <div id="banner4">
                            <a href="#share" onClick={this.handleOpenSaveModal.bind(this)}><img src={share} alt="Save and Share" /></a>
                            <a href="http://docs.jsonata.org"><img src={docs} alt="Documentation" /></a>
                            <a
                                href="http://twitter.com/intent/tweet?status=JSONata:  The JSON query and transformation language.+http://jsonata.org"><img
                                    id="t-icon" src={twitter} alt={"Twitter"} /></a>
                            <a href="#slack" onClick={this.handleOpenSlackModal.bind(this)}><img src={slack} alt={"Join us on Slack"} /></a>
                            <a href="http://stackoverflow.com/search?q=JSONata"><img src={stackoverflow} alt={"StackOverflow"} /></a>
                            <a href="https://github.com/jsonata-js/jsonata"><img src={github} alt={"GitHub"} /></a>
                        </div>
                    </div>
                </div>
            </header>

            <SplitPane split="vertical" minSize={100} defaultSize={'50%'}>
                <SplitPane split="horizontal" minSize={100} size={this.state.panelStates.bindings === "visible" ? '30%' : '20px'} primary="second" allowResize={this.state.panelStates.bindings === "visible"}>
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
                        <img src={format} id="json-format" title="Format" onClick={this.format.bind(this)} alt={"Format"} />
                        <select id="sample-data" onChange={this.changeSample.bind(this)}>
                            <option value="Invoice">Invoice</option>
                            <option value="Address">Address</option>
                            <option value="Schema">Schema</option>
                            <option value="Library">Library</option>
                            <option value="Bindings">Bindings</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <div className="pane-heading" onClick={
                            () => this.setPanelState("bindings", this.state.panelStates.bindings === "visible" ? 'hidden' : 'visible')
                        }>
                            <span>{this.state.panelStates.bindings !== "visible" ? "►" : "▼"}&nbsp;Bindings</span>
                        </div>
                        <div className="pane" hidden={this.state.panelStates.bindings !== "visible"}>
                            <MonacoEditor
                                language="javascript"
                                value={this.state.bindings}
                                options={options}
                                onChange={this.onChangeBindings.bind(this)}
                                editorDidMount={this.bindingsEditorDidMount.bind(this)}
                            />
                            <button id="add-libraries" onClick={this.handleOpenExternalLibsModal.bind(this)}>Add/Remove external libraries</button>
                        </div>
                    </div>
                </SplitPane>
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
                            minimap: { enabled: false },
                            automaticLayout: true,
                            contextmenu: false,
                            scrollBeyondLastLine: false,
                            readOnly: true,
                            extraEditorClassName: 'result-pane'
                        }}
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
                    <p><input id="slack-email" placeholder="Enter your email" /></p>
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
            <Modal
                isOpen={this.state.externalLibsModal}
                onRequestClose={this.handleCloseModal.bind(this)}
                style={externalLibsModalStyle}
                contentLabel="Add/Remove external libraries"
            >
                <div>
                    <a href="#close" title="Close" className="close"
                        onClick={this.handleCloseModal.bind(this)}>&times;</a>
                    <h3 id="slack-title">Add/Remove external libraries</h3>
                    <ExternalLibsComponent onChange={this.onChangeExternalLibraries.bind(this)} externalLibs={this.state.externalLibs} />
                </div>
            </Modal>
        </div>;
    }
}

export default Exerciser;
