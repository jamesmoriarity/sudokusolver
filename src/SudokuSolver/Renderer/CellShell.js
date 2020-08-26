/// <reference types="react" />
/// <reference types="react-dom" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CellShell = /** @class */ (function (_super) {
    __extends(CellShell, _super);
    function CellShell(props) {
        var _this = _super.call(this, props) || this;
        _this.getProps = function () {
            return _this.props;
        };
        _this.getHTML = function () {
            var c = "cell_shell " + _this.getClasses();
            return React.createElement("div", { "class": c },
                React.createElement("input", { id: "cell_" + _this.getProps().index, value: "" + _this.getProps().value, onChange: function (ev) { return _this.getProps().onCellChange(ev, _this.getProps().index); }, type: "text", maxlength: "1" }));
        };
        _this.getClasses = function () {
            var classes = [];
            var colIndex = _this.getProps().index % 9;
            var rowIndex = Math.floor(_this.getProps().index / 9);
            if (_this.getProps().isHinted) {
                classes.push("hintedCell");
            }
            else {
                if (_this.renderClient.state.patternMap && _this.renderClient.state.patternMap["hintBackgroundCells"]) {
                    var isHintBackgroundCell = _this.renderClient.state.patternMap["hintBackgroundCells"].includes(_this.getProps().index);
                    if (isHintBackgroundCell) {
                        classes.push("hintBackgroundCell");
                    }
                    else {
                        var isHintValueRelatedCell = _this.renderClient.state.patternMap["hintValueRelatedCells"].includes(_this.getProps().index);
                        if (isHintValueRelatedCell) {
                            classes.push("hintValueRelatedCell");
                        }
                    }
                }
            }
            if (_this.isSideOfBox(colIndex))
                classes.push("column-right");
            if (_this.isBottomOfBox(rowIndex))
                classes.push("row-bottom");
            if (_this.isInvalidCell(_this.getProps().index))
                classes.push("invalidCell");
            return classes.join(" ");
        };
        _this.isBottomOfBox = function (rowIndex) {
            return (rowIndex == 2 || rowIndex == 5);
        };
        _this.isSideOfBox = function (colIndex) {
            return (colIndex == 2 || colIndex == 5);
        };
        _this.isInvalidCell = function (index) {
            var b = _this.renderClient.state.validationErrors.includes(index);
            return b;
        };
        _this.renderClient = props.renderClient;
        return _this;
    }
    CellShell.prototype.render = function () {
        return this.getHTML();
    };
    return CellShell;
}(React.Component));
