"use strict";

class Node {
    constructor(path = "", onNode) {
        this.path = path;
        this.name = '';
        this.children = [];
        this.onNode = () => onNode && onNode(this);
    }
}

/**
 * fill
 * Recursively fill the tree structure based on paths.
 *
 * @param {Node} node The current node.
 * @param {Array} paths An array of paths.
 * @param {String} delimiter The delimiter character.
 * @param {Function} onNode An optional function called when the node is created.
 * @throws {Error} Throws an error if input paths are invalid.
 * @returns {Node} The filled node.
 */
function fill(node, paths, delimiter, onNode) {
    if (!Array.isArray(paths)) {
        throw new Error("Invalid input: paths must be an array.");
    }

    const cMap = {};

    paths.forEach(file => {
        const parts = file.split(delimiter);

        if (!cMap[parts[0]]) {
            const fullPath = node.path + delimiter + parts[0];
            cMap[parts[0]] = {
                paths: [],
                obj: new Node(fullPath, onNode)
            };
        }

        cMap[parts[0]].obj.name = parts[0];
        if (parts.length !== 1) {
            const dir = parts.shift(),
                rest = parts.join(delimiter);
            cMap[dir].paths.push(rest);
        }
    });

    const keys = Object.keys(cMap);
    keys.sort().forEach(function (key) {
        const parent = cMap[key].obj;
        parent.onNode();
        fill(parent, cMap[key].paths, delimiter, onNode);

        const child = cMap[key].obj;
        child.onNode();

        node.children.push(child);
    });
    return node;
}

/**
 * paths2tree
 * Convert a list of paths into a tree.
 *
 * @param {Array} paths An array of paths.
 * @param {String} delimiter The delimiter character.
 * @param {Function} onNode An optional function called when the node is created.
 * @throws {Error} Throws an error if input paths or delimiter is invalid.
 * @returns {Object} The path tree.
 */
module.exports = function paths2tree(paths = [], delimiter = "/", onNode) {
    if (typeof delimiter !== "string" || delimiter.length !== 1) {
        throw new Error("Invalid input: delimiter must be a single character string.");
    }

    const root = new Node("", onNode);
    root.onNode();
    return fill(root, paths, delimiter, onNode);
}

/**
 * Example Usage:
 * const tree = paths2tree(['dir1/file1', 'dir1/file2', 'dir2/file3'], '/');
 * console.log(tree);
 */
