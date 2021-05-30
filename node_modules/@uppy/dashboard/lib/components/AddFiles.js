function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

var AddFiles = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AddFiles, _Component);

  function AddFiles() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this.triggerFileInputClick = function () {
      _this.fileInput.click();
    };

    _this.onFileInputChange = function (event) {
      _this.props.handleInputChange(event); // We clear the input after a file is selected, because otherwise
      // change event is not fired in Chrome and Safari when a file
      // with the same name is selected.
      // ___Why not use value="" on <input/> instead?
      //    Because if we use that method of clearing the input,
      //    Chrome will not trigger change if we drop the same file twice (Issue #768).


      event.target.value = null;
    };

    _this.renderHiddenFileInput = function () {
      return h("input", {
        class: "uppy-Dashboard-input",
        hidden: true,
        "aria-hidden": "true",
        tabindex: -1,
        type: "file",
        name: "files[]",
        multiple: _this.props.maxNumberOfFiles !== 1,
        onchange: _this.onFileInputChange,
        accept: _this.props.allowedFileTypes,
        ref: function ref(_ref) {
          _this.fileInput = _ref;
        }
      });
    };

    _this.renderMyDeviceAcquirer = function () {
      return h("div", {
        class: "uppy-DashboardTab",
        role: "presentation"
      }, h("button", {
        type: "button",
        class: "uppy-DashboardTab-btn",
        role: "tab",
        tabindex: 0,
        "data-uppy-super-focusable": true,
        onclick: _this.triggerFileInputClick
      }, h("svg", {
        "aria-hidden": "true",
        focusable: "false",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32"
      }, h("g", {
        fill: "none",
        "fill-rule": "evenodd"
      }, h("rect", {
        width: "32",
        height: "32",
        rx: "16",
        fill: "#2275D7"
      }), h("path", {
        d: "M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z",
        fill: "#FFF"
      }))), h("div", {
        class: "uppy-DashboardTab-name"
      }, _this.props.i18n('myDevice'))));
    };

    _this.renderDropPasteBrowseTagline = function () {
      var numberOfAcquirers = _this.props.acquirers.length;
      var browse = h("button", {
        type: "button",
        class: "uppy-u-reset uppy-Dashboard-browse",
        onclick: _this.triggerFileInputClick,
        "data-uppy-super-focusable": numberOfAcquirers === 0
      }, _this.props.i18n('browse'));
      return h("div", {
        class: "uppy-Dashboard-AddFiles-title"
      }, numberOfAcquirers > 0 ? _this.props.i18nArray('dropPasteImport', {
        browse: browse
      }) : _this.props.i18nArray('dropPaste', {
        browse: browse
      }));
    };

    _this.renderAcquirer = function (acquirer) {
      return h("div", {
        class: "uppy-DashboardTab",
        role: "presentation"
      }, h("button", {
        type: "button",
        class: "uppy-DashboardTab-btn",
        role: "tab",
        tabindex: 0,
        "aria-controls": "uppy-DashboardContent-panel--" + acquirer.id,
        "aria-selected": _this.props.activePickerPanel.id === acquirer.id,
        "data-uppy-super-focusable": true,
        onclick: function onclick() {
          return _this.props.showPanel(acquirer.id);
        }
      }, acquirer.icon(), h("div", {
        class: "uppy-DashboardTab-name"
      }, acquirer.name)));
    };

    _this.renderAcquirers = function (acquirers) {
      // Group last two buttons, so we don’t end up with
      // just one button on a new line
      var acquirersWithoutLastTwo = [].concat(acquirers);
      var lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
      return h("div", {
        class: "uppy-Dashboard-AddFiles-list",
        role: "tablist"
      }, _this.renderMyDeviceAcquirer(), acquirersWithoutLastTwo.map(function (acquirer) {
        return _this.renderAcquirer(acquirer);
      }), h("span", {
        role: "presentation",
        style: "white-space: nowrap;"
      }, lastTwoAcquirers.map(function (acquirer) {
        return _this.renderAcquirer(acquirer);
      })));
    };

    return _this;
  }

  var _proto = AddFiles.prototype;

  _proto.renderPoweredByUppy = function renderPoweredByUppy() {
    var uppyBranding = h("span", null, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon uppy-Dashboard-poweredByIcon",
      width: "11",
      height: "11",
      viewBox: "0 0 11 11"
    }, h("path", {
      d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
      "fill-rule": "evenodd"
    })), h("span", {
      class: "uppy-Dashboard-poweredByUppy"
    }, "Uppy")); // Support both the old word-order-insensitive string `poweredBy` and the new word-order-sensitive string `poweredBy2`

    var linkText = this.props.i18nArray('poweredBy2', {
      backwardsCompat: this.props.i18n('poweredBy'),
      uppy: uppyBranding
    });
    return h("a", {
      tabindex: "-1",
      href: "https://uppy.io",
      rel: "noreferrer noopener",
      target: "_blank",
      class: "uppy-Dashboard-poweredBy"
    }, linkText);
  };

  _proto.render = function render() {
    return h("div", {
      class: "uppy-Dashboard-AddFiles"
    }, this.renderHiddenFileInput(), this.renderDropPasteBrowseTagline(), this.props.acquirers.length > 0 && this.renderAcquirers(this.props.acquirers), h("div", {
      class: "uppy-Dashboard-AddFiles-info"
    }, this.props.note && h("div", {
      class: "uppy-Dashboard-note"
    }, this.props.note), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy(this.props)));
  };

  return AddFiles;
}(Component);

module.exports = AddFiles;