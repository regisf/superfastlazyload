/**
 * LazyLoad - a really fast lazy loading images
 * Copyright (c) 2013 Régis FLORET 
 *
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 */
var LazyLoad = (function() {
    /**
     * Main Function.
     * @param {string} datatype The datatype. You should use something like
     *                           data-lazyload instead of CSS classes.
     * @param {boolean} convertDt Convert datatype. Because the polyfill don't
                                  understand the bracket closure [data-something]
     */
    function LazyLoad(datatype, convertDt) {
        // Declare all variables
        this._images = [];
        this._datatype = null;
        
        // Prepare default arguments
        if (datatype === undefined) {
            datatype = 'data-lazyload';
        }
        
        if (convertDt === undefined) {
            convertDt = true;
        }
        
        // Call the "constructor"
        this._init(datatype, !!convertDt);
    }

    /**
     * Pseudo-contructor (called in LazyLoad function
     * @param {string} datatype The datatype. You should use something like
     *                           data-lazyload instead of CSS classes.
     * @param {boolean} convertDt Convert datatype. Because the polyfill don't
     *                           understand the bracket closure [data-something]
     */
    LazyLoad.prototype._init = function(datatype, convertDt) {
        this._installPolyfill();

        if (true === this._qsa_native && true === convertDt) {
            datatype = '[' + datatype + ']';
        }
        this._datatype = datatype;
        if (document.addEventListener) {
            document.addEventListener('scroll', this._computeIsVisible.bind(this), false);
        } else {
            document.attachEvent('onscroll', this._computeIsVisible.bind(this));
        }
        this.refresh();
    };

    /**
     * Install polyfill for querySelectorAll
     * If the method is not present add it to the document
     * this is really rare now days IE < 8
     *
     */
    LazyLoad.prototype._installPolyfill = function() {
        this._qsa_native = !!document.querySelectorAll;
        if (!this._qsa_native) {
            document.querySelectorAll = function (attribute)
            {
              var allElements = document.getElementsByTagName('*'),
                  matchingElements = [];
              for (var i = 0; i < allElements.length; i++)
              {
                if (allElements[i].getAttribute(attribute))
                {
                  // Element exists with attribute. Add to array.
                  matchingElements.push(allElements[i]);
                }
              }
              return matchingElements;
            }
        }
    };

    /** Refresh the entire view.
     * In this._images we store all images and their top position,
     * that's why this library is so fast.
     */
    LazyLoad.prototype.refresh = function() {
        var images = document.querySelectorAll(this._datatype);
        this._images = [];
        for (var i = 0, _len = images.length; i < _len; i++) {
            this._images.push({
                top: images[i].getBoundingClientRect().top,
                image: images[i],
                visible: false
            });
        }
        this._computeIsVisible();
    };

    /** Test if images are visible
     */
    LazyLoad.prototype._computeIsVisible = function() {
        var currentTop = window.pageYOffset || document.documentElement.scrollTop,
            currentBottom = currentTop + window.innerHeight,
            image=null;

        for (var i=0, _len=this._images.length; i < _len;  i++) {
            image = this._images[i];
            if (image.visible === true) {
                continue;
            }

            // If images are outside the browser window,
            // stop the computation
            if (image.top > currentBottom) {
                break;
            }

            if (image.top > currentTop && image.top <= currentBottom) {
                image.image.setAttribute("src", image.image.getAttribute("data-src"));
                image.image.onerror = function() { image.visible = false; }
                image.visible = true;
            }
        }
    };
    return LazyLoad;
})();