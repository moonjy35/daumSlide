/*jshint browser: true
*/
/*global slide:true, Class, gesture, clay, util, daumtools, dongtl*/

(function(exports){
    'use strict';

    /**
     * 3d gpu 가속 여부를 사용할수 있는지 판단한다.
     */
    var ua = exports.ua;
    var os = ua.os;
    var browser = ua.browser;
    var browserVersion = browser.version;

    var isTransformEnabled = exports.isTransformEnabled =  (function () {
        var isOverIcs = (function () {
            if (browser.android) {
                var major = parseInt(browserVersion.major, 10);
                return major > 3;
            }
            return false;
        })();
        return !!(isOverIcs || os.ios || browser.safari || browser.chrome);
    })();
    exports.hardwareAccelStyle = isTransformEnabled ? '-webkit-transform:translate3d(0,0,0);' : '';
    // transition-timing-function 적용. (default: ease)
    // exports.hardwareAccelStyle += exports.isTransformEnabled ? '-webkit-transition-timing-function:linear;' : '';

    var isSwipeEnabled = exports.isSwipeEnabled =  (function () {
        return (os.android || os.ios || browser.safari || browser.firefox || browser.dolfin || browser.opera ||
                (ua.platform === "pc" && browser.msie && browserVersion.major >= 8)) && !browser.polaris;
    })();

    /**
     * ics 4.0.3 이상 버젼 대응.
     */
    var isUsingClone = exports.isUsingClone =  (function () {
        var major = parseInt(browserVersion.major, 10);
        var minor = parseInt(browserVersion.minor, 10);
        var patch = parseInt(browserVersion.patch, 10);
        var isOverIcs4_0_3 = browser.android &&
                (major > 4 ||
                (major === 4 && minor > 0) ||
                (major === 4 && minor === 0 && patch >= 3));
        return isOverIcs4_0_3;
    })();

    // progressive Container setting
    exports.Container = (function () {
        var BasicContainer = exports.BasicContainer = exports.Class.extend(exports.basicContainerObj);
        var MiddleContainer = exports.MiddleContainer = BasicContainer.extend(exports.middleContainerObj);
        var AdvanceContainer = exports.AdvanceContainer = MiddleContainer.extend(exports.advanceContainerObj);
        var CloneAdvanceContainer = exports.CloneAdvanceContainer = AdvanceContainer.extend(exports.cloneAdvanceContainerObj);

        return (isUsingClone ? CloneAdvanceContainer : isTransformEnabled ? AdvanceContainer : isSwipeEnabled ? MiddleContainer : BasicContainer);
    })();

    // progressive Slide setting
    exports.Slide = (function () {
        var BasicSlide = exports.BasicSlide = exports.Observable.extend(exports.basicSlideObj);
        var MiddleSlide = exports.MiddleSlide = BasicSlide.extend(exports.middleSlideObj);
        var AdvanceSlide = exports.AdvanceSlide = MiddleSlide.extend(exports.advanceSlideObj);

        return (isTransformEnabled ? AdvanceSlide : isSwipeEnabled ? MiddleSlide : BasicSlide);
    })();
}(window.slide = (typeof slide === 'undefined') ? {} : slide));