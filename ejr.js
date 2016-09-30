const fs = require('fs');
const vm = require("vm");
const path = require('path');

/**
 * @param {string} file1 - some file path
 * @param {string} file2 - some other file path relative to first file's path
 */
function getRelativePath(file1, file2) {
  var dirname = path.dirname(file1);
  return path.join(dirname, file2);
}

/**
 * @param {Object} ctx - context to bind the function
 * @param {string} filePath - absolute path where this include functio is being used
 * @description Bind a _include function inside given scopre to render another partial
 */
function bindInclude(ctx, filePath) {
  
  /**
  * @param {string} file - file to include, relative to this file path
  * @param {Object} options - object with the context to be used inside the partial
  * @returns {Object} rendered partial json
  */
  ctx._include = function _include(file, options) {
    return renderSync( getRelativePath( filePath, file ), options );
  }
}

/**
 * @param {string} filePath - absolute path of the view
 * @param {Object} options - context variables to be interpolated on the render
 * @return {Object} rendered json
 */
function renderSync(filePath, options) {
  var content = fs.readFileSync(filePath);
  var wrapped = `var render = ${content}`;
  var ctx = options;
  
  bindInclude(ctx, filePath);
  
  ctx.require = require; // bind require
  ctx.console = console; // bind console
  ctx.process = process; // bind process
  
  vm.createContext(ctx);
  vm.runInNewContext(wrapped, ctx, { displayErrors: true });
  
  return ctx.render;
}

/**
 * @param {string} filePath - absolute path of the view
 * @param {Object} options - context variables to be interpolated on the render
 * @param {function} callback - callback fn called with the any errors during render and the render result as string
 */
module.exports = function render(filePath, options, callback) {
  try {
    var json = renderSync(filePath, options);
    callback( null, JSON.stringify(json) ); 
  } catch (e) {
    callback( e, null );
  }
};
