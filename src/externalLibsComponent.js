import React, { Component } from "react";

// eslint-disable-next-line no-mixed-operators
function uuid(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid) }

export default class ExternalLibsComponent extends Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
        this.state = {
            loading: false,
            error:"",
            url: "",
            moduleName: "",
            externalLibs: props.externalLibs
        };
    }

    loadLibrary() {
        if (!this.form.current.reportValidity()) { return; };

        this.setState({ loading: true });

        const moduleName = this.state.moduleName;
        const url = this.state.url;

        fetch(url)
            .then((res) => {
                if (!res.ok) { throw res }
                return res.text();
            }).then(libFileText => {
                try {
                    const libraryContext = getLibraryHandle(libFileText, moduleName);
                    const newId = uuid();
                    const newExternalLibs = [...this.state.externalLibs, { url: url, id: newId, moduleName, libraryContext: { [moduleName]: libraryContext } }];
                    this.setState({
                        externalLibs: newExternalLibs
                    });
                    console.log(newExternalLibs);
                    this.props.onChange && this.props.onChange(newExternalLibs);

                } catch (error) {
                    console.error("Could not load library from " + url)
                    console.error(error);
                    this.setError("Could not load library from " + url, error);
                }

            }).catch((error => {
                console.error("Could not load library from " + url)
                console.error(error);
                this.setError("Could not load library from " + url, error);
            }))
            .finally(() => {
                this.setState({ loading: false, url: '', moduleName: '' });
            });
    }

    setError(message, error){
        this.setState({ error:`${message}\n\n${error}` });
        setTimeout(() => {
            this.setState({ error: ""});
        }, 3000);
    }

    removeLibrary(id) {
        const newExternalLibs = this.state.externalLibs.filter(lib => lib.id !== id)
        this.setState({
            externalLibs: newExternalLibs
        });
        this.props.onChange && this.props.onChange(newExternalLibs);
    }

    render() {
        return (
            <div className="container">
                {this.state.externalLibs.map((lib, index) => (
                    <div className="libs-container" key={lib.id}>
                        <div className="flex-5">{lib.moduleName}</div>
                        <div className="flex-5">{lib.url}</div>
                        <div className="remove-button flex-1" onClick={this.removeLibrary.bind(this, lib.id)}>🗑</div>
                    </div>
                ))}

                <div className="libs-header ">
                    <label className="libs-header-cell flex-2">Module Name</label>
                    <label className="libs-header-cell flex-6">Url:</label>
                    <label className="libs-header-cell flex-1"></label>
                </div>
                <form ref={this.form} onSubmit={e => e.preventDefault()}>
                    <div  className="libs-container">
                        <input className="flex-2 lib-input" value={this.state.moduleName} onChange={(e) => this.setState({ moduleName: e.target.value })} required />
                        <input className="flex-6 lib-input"  value={this.state.url} onChange={(e) => this.setState({ url: e.target.value })} required />
                        <button className="button flex-1" onClick={this.loadLibrary.bind(this)}>Add</button>
                    </div>
                </form>
                <div className="error-message">
                    {this.state.error}
                </div>

                <div className="loader" style={{ visibility: this.state.loading ? "visible" : "hidden", display: "grid", placeItems: "center" }}>
                    <div className="loader-icon"></div>
                </div>
            </div>
        )
    }

}

export function getLibraryHandle(libFileText, moduleName) {
    const _this = Object.create({});
    function require(name) {
        // based on https://michelenasti.com/2018/10/02/let-s-write-a-simple-version-of-the-require-function.html
        if (!(name in _this)) {
            let module = { exports: {} };
            _this[name] = module;
            // eslint-disable-next-line no-new-func
            let wrapper = Function("require, exports, module", libFileText);
            wrapper(require, module.exports, module);
        }
        return _this[name].exports;
    }

    const libraryContext = require(moduleName);
    return libraryContext;
}
