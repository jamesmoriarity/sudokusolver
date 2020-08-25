var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.log("CellShell");

var CellShell = function (_React$Component) {
	_inherits(CellShell, _React$Component);

	function CellShell(props) {
		_classCallCheck(this, CellShell);

		var _this = _possibleConstructorReturn(this, (CellShell.__proto__ || Object.getPrototypeOf(CellShell)).call(this, props));

		_this.getHTML = function () {
			return React.createElement(
				"div",
				{ "class": "cell_shell " + _this.getClasses() },
				React.createElement("input", {
					id: "cell_" + _this.props.index,
					value: "" + _this.props.value,
					onChange: function onChange(ev) {
						return _this.props.onCellChange(ev, _this.props.index);
					},
					type: "text", maxlength: "1" })
			);
		};

		_this.getClasses = function () {
			var classes = [];
			var colIndex = _this.props.index % 9;
			var rowIndex = Math.floor(_this.props.index / 9);
			if (_this.props.isHinted) {
				classes.push("hintedCell");
			} else {
				if (_this.renderClient.state.patternMap && _this.renderClient.state.patternMap["hintBackgroundCells"]) {
					var isHintBackgroundCell = _this.renderClient.state.patternMap["hintBackgroundCells"].includes(_this.props.index);
					if (isHintBackgroundCell) {
						classes.push("hintBackgroundCell");
					} else {
						var isHintValueRelatedCell = _this.renderClient.state.patternMap["hintValueRelatedCells"].includes(_this.props.index);
						if (isHintValueRelatedCell) {
							classes.push("hintValueRelatedCell");
						}
					}
				}
			}
			if (colIndex == 2 || colIndex == 5) classes.push("column-right");
			if (rowIndex == 2 || rowIndex == 5) classes.push("row-bottom");
			if (!_this.isListItemValid(_this.props.index)) classes.push("invalidCell");
			return classes.join(" ");
		};

		_this.isListItemValid = function (index) {
			var b = !_this.renderClient.state.validationErrors.includes(index);
			return b;
		};

		_this.renderClient = props.renderClient;
		return _this;
	}

	_createClass(CellShell, [{
		key: "render",
		value: function render() {
			return this.getHTML();
		}
	}]);

	return CellShell;
}(React.Component);