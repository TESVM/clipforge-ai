/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/ffprobe-static";
exports.ids = ["vendor-chunks/ffprobe-static"];
exports.modules = {

/***/ "(rsc)/./node_modules/ffprobe-static/index.js":
/*!**********************************************!*\
  !*** ./node_modules/ffprobe-static/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("//\n// With credits to https://github.com/eugeneware/ffmpeg-static\n//\nvar os = __webpack_require__(/*! os */ \"os\");\nvar path = __webpack_require__(/*! path */ \"path\");\n\nvar platform = os.platform();\nif (platform !== 'darwin' && platform !=='linux' && platform !== 'win32') {\n  console.error('Unsupported platform.');\n  process.exit(1);\n}\n\nvar arch = os.arch();\nif (platform === 'darwin' && arch !== 'x64' && arch !== 'arm64') {\n  console.error('Unsupported architecture.');\n  process.exit(1);\n}\n\nvar ffprobePath = path.join(\n  __dirname,\n  'bin',\n  platform,\n  arch,\n  platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'\n);\n\nexports.path = ffprobePath;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZmZwcm9iZS1zdGF0aWMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLGNBQUk7QUFDckIsV0FBVyxtQkFBTyxDQUFDLGtCQUFNOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSIsInNvdXJjZXMiOlsiL1VzZXJzL3Rlcy9jbGlwZm9yZ2UtYWkvbm9kZV9tb2R1bGVzL2ZmcHJvYmUtc3RhdGljL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vXG4vLyBXaXRoIGNyZWRpdHMgdG8gaHR0cHM6Ly9naXRodWIuY29tL2V1Z2VuZXdhcmUvZmZtcGVnLXN0YXRpY1xuLy9cbnZhciBvcyA9IHJlcXVpcmUoJ29zJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIHBsYXRmb3JtID0gb3MucGxhdGZvcm0oKTtcbmlmIChwbGF0Zm9ybSAhPT0gJ2RhcndpbicgJiYgcGxhdGZvcm0gIT09J2xpbnV4JyAmJiBwbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBwbGF0Zm9ybS4nKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufVxuXG52YXIgYXJjaCA9IG9zLmFyY2goKTtcbmlmIChwbGF0Zm9ybSA9PT0gJ2RhcndpbicgJiYgYXJjaCAhPT0gJ3g2NCcgJiYgYXJjaCAhPT0gJ2FybTY0Jykge1xuICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBhcmNoaXRlY3R1cmUuJyk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxudmFyIGZmcHJvYmVQYXRoID0gcGF0aC5qb2luKFxuICBfX2Rpcm5hbWUsXG4gICdiaW4nLFxuICBwbGF0Zm9ybSxcbiAgYXJjaCxcbiAgcGxhdGZvcm0gPT09ICd3aW4zMicgPyAnZmZwcm9iZS5leGUnIDogJ2ZmcHJvYmUnXG4pO1xuXG5leHBvcnRzLnBhdGggPSBmZnByb2JlUGF0aDtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/ffprobe-static/index.js\n");

/***/ })

};
;