const fs = require('fs');
const vm = require("vm");
const path = require('path');
const extend = require('util')._extend;

// function ctxExtend(ctx, options = { }) {
//   var newCtx = extend({ }, ctx);
//   console.log(newCtx)
//   Object.keys(options).forEach( k => {
//     delete newCtx[k];
//     newCtx[k] = options[k];
//   });
//   return newCtx;
// }

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
    return renderSync( getRelativePath( filePath, file ), extend(extend({ }, ctx), options) );
  }
}

/**
 * Bind global function to context
 */
function bindGlobal(ctx) {
  ctx.require = require; // bind require
  ctx.console = console; // bind console
}

/**
 * @param {string} filePath - absolute path of the view
 * @param {Object} options - context variables to be interpolated on the render
 * @return {Object} rendered json
 */
function renderSync( filePath, context = {} ) {
  const content = fs.readFileSync( filePath );
  const script = `var render = ${content}`;
  const ctx = context;

  bindGlobal( ctx );
  bindInclude( ctx, filePath );
  
  vm.createContext( ctx );
  vm.runInNewContext( script, ctx, { displayErrors: true } );
  
  return ctx.render;
}

/**
 * @param {string} filePath - absolute path of the view
 * @param {Object} context - context variables to be interpolated on the render
 * @param {function} callback - callback fn called with the any errors during render and the render result as string
 */
module.exports = async ( filePath, context = {}, callback ) => {
  try {
    const result = JSON.stringify( renderSync( filePath, context ) );
    if ( typeof callback === 'function' ) {
      callback( null, result );
    } else {
      return result;
    }
  } catch ( error ) {
    console.log( { error } );
    if ( typeof callback === 'function' ) {
      callback( error, null );
    } else {
      throw error;
    }
  }
};
