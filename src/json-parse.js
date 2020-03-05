/**
 * © Copyright IBM Corp. 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const jsonParser = (() => {
    'use strict';

    function tokeniser(buffer) {
        let position = 0;
        const length = buffer.length;

        function next(...expected) {
            if (position >= length) return null;
            let currentChar = buffer.charAt(position);
            // skip whitespace
            while (position < length && ' \t\n\r\v'.indexOf(currentChar) > -1) {
                position++;
                currentChar = buffer.charAt(position);
            }

            let token, value;
            let startPosition = position;

            switch (currentChar) {
                case '{':
                case '}':
                case '[':
                case ']':
                case ':':
                case ',':
                    token = currentChar;
                    position++;
                    break;
                case '"': {
                    token = 'string';
                    // scan ahead to extract the string
                    // careful of escape sequences
                    position++;
                    startPosition = position;
                    currentChar = buffer.charAt(position);
                    while (currentChar !== '"') {
                        if (currentChar === '\\') {
                            position++;
                        }
                        position++;
                        currentChar = buffer.charAt(position);
                    }
                    value = buffer.substring(startPosition, position);
                    position++;
                    break;
                }
                case '-': case '0': case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': case '9': {
                    token = 'number';
                    while (currentChar === '0' || currentChar === '1' || currentChar === '2' ||
                    currentChar === '3' || currentChar === '4' || currentChar === '5' ||
                    currentChar === '6' || currentChar === '7' || currentChar === '8' ||
                    currentChar === '9' || currentChar === '.' || currentChar === 'e' ||
                    currentChar === 'E' || currentChar === '+' || currentChar === '-') {
                        position++;
                        currentChar = buffer.charAt(position);
                    }
                    value = parseFloat(buffer.substring(startPosition, position));
                    break;
                }
                default:
                    // none of the above
                    if(buffer.startsWith("true", position)) {
                        token ='true';
                        position += 4;
                    } else if(buffer.startsWith("false", position)) {
                        token = 'false';
                        position += 5;
                    } else if(buffer.startsWith("null", position)) {
                        token = 'null';
                        position += 4;
                    } else {
                        // invalid
                    }

            }
            if(expected.length > 0 && !expected.includes(token)) {
                throw {
                    message: 'expected ' + expected + ', got ' + token + ' at position ' + position,
                    position: position
                }
            }
            return {
                type: token,
                value: value,
                position: {start: startPosition+1, end: position+1}
            }
        }

        function pos() {
            return position;
        }

        return {
            next, pos
        }
    }

    const JsonValue = function(token) {
        this.token = token;
    };

    JsonValue.prototype.position = function() {
        return this.token.position;
    };

    JsonValue.prototype.valueOf = function() {
        return this.token.value;
    };

    JsonValue.prototype.toString = function() {
        return this.token.toString();
    };

    function parse(data) {
        let id = 0;
        let idIndex = [];
        const scanner = tokeniser(data);

        function parseValue() {
            let token = scanner.next();
            let result;
            const start = scanner.pos();
            switch (token.type) {
                case '{':  // it's an object
                    result = {};
                    // next token MUST be a string or '}'
                    let next = scanner.next('string', '}');
                    while (next.type !== '}') {
                        const key = next.value;
                        // next token MUST be a colon
                        next = scanner.next(':');
                        // then get the value
                        result[key] = parseValue();
                        // next token MUST be a ',' or '}'
                        next = scanner.next(',', '}');
                        if (next.type === ',') {
                            next = scanner.next('string');
                        }
                    }
                    idIndex.push({start: start, end: scanner.pos()+1});
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
                case '[':  // it's an array
                    result = [];
                    let value = parseValue();
                    while (typeof value !== 'undefined') {
                        result.push(value);
                        const next = scanner.next(',', ']');
                        if (next.type === ']') {
                            break;
                        }
                        value = parseValue();
                    }
                    idIndex.push({start: start, end: scanner.pos()});
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
                case 'string':
                    result = new String(token.value);
                    idIndex.push(token.position);
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
                case 'number':
                    result = new Number(token.value);
                    idIndex.push(token.position);
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
                case 'null':
                    result = null; // TODO wrap this
                    break;
                case 'true':
                    result = new Boolean(true);
                    idIndex.push(token.position);
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
                case 'false':
                    result = new Boolean(false);
                    idIndex.push(token.position);
                    Object.defineProperty(result, '_jsonata_id', {
                        value: id++
                    });
                    break;
            }
            return result;
        }
        return {value: parseValue(), idIndex: idIndex};
    }

    function stringify(input) {
        let pos = 0;
        let output = '';
        let indent = '';
        let metadata = [];

        const serialize = value => {
            switch (typeof value) {
                case 'string':
                    output += '"';
                    output += value;
                    output += '"';
                    pos = output.length;
                    break;
                case 'number':
                    output += Number(value.toPrecision(13)).toString();
                    pos = output.length;
                    break;
                case 'boolean':
                    output += value.toString();
                    pos = output.length;
                    break;
                case 'object':
                    if (value instanceof String) {
                        if (typeof value._jsonata_id !== 'undefined') {
                            metadata.push({
                                target: {
                                    start: pos + 2,
                                    end: pos + value.length + 2
                                },
                                sourceId: value._jsonata_id
                            });
                        }
                        output += '"';
                        output += value;
                        output += '"';
                        pos = output.length;
                    } else if (value instanceof Number) {
                        const num = Number(value.toPrecision(13)).toString();
                        if (typeof value._jsonata_id !== 'undefined') {
                            metadata.push({
                                target: {
                                    start: pos + 1,
                                    end: pos + num.length + 1
                                },
                                sourceId: value._jsonata_id
                            });
                        }
                        output += num;
                        pos = output.length;
                    } else if (value instanceof Boolean) {
                        if (typeof value._jsonata_id !== 'undefined') {
                            metadata.push({
                                target: {
                                    start: pos + 1,
                                    end: pos + value.length + 1
                                },
                                sourceId: value._jsonata_id
                            });
                        }
                        output += value.toString();
                        pos = output.length;
                    } else if (value === null) {
                        output += 'null';
                        pos = output.length;
                    } else if (Array.isArray(value)) {
                        let meta;
                        if (typeof value._jsonata_id !== 'undefined') {
                            meta = {
                                target: {
                                    start: pos + 1
                                },
                                sourceId: value._jsonata_id
                            };
                        }
                        if (value.length === 0) {
                            output += '[]';
                            pos = output.length;
                        } else {
                            output += '[\n';
                            indent += '  ';


                            value.forEach((item, i) => {
                                output += indent;
                                pos = output.length;
                                serialize(item);
                                if(i < value.length - 1) {
                                    output += ',\n';
                                }
                            });

                            indent = indent.substr(2);
                            output += '\n' + indent + ']';
                            pos = output.length;
                        }

                        if (typeof value._jsonata_id !== 'undefined') {
                            meta.target.end = pos + 1;
                            metadata.push(meta);
                        }
                    } else {
                        let meta;
                        if (typeof value._jsonata_id !== 'undefined') {
                            meta = {
                                target: {
                                    start: pos + 1
                                },
                                sourceId: value._jsonata_id
                            };
                        }
                        const properties = Object.entries(value);
                        if (properties.length === 0) {
                            output += '{}';
                            pos = output.length;
                        } else {
                            output += '{\n';
                            indent += '  ';

                            properties.forEach((property, i) => {
                                output += indent;
                                pos = output.length;
                                serialize(property[0]);
                                output += ': ';
                                pos = output.length;
                                serialize(property[1]);
                                if(i < properties.length - 1) {
                                    output += ',\n';
                                }
                            });

                            indent = indent.substr(2);
                            output += '\n' + indent + '}';
                            pos = output.length;
                        }

                        if (typeof value._jsonata_id !== 'undefined') {
                            meta.target.end = pos + 1;
                            metadata.push(meta);
                        }

                    }
            }
        };

        serialize(input);
        console.log(metadata);
        return { output, metadata: metadata};
    }


    return { parse, stringify };
})();

module.exports = jsonParser;
