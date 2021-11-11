/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts
Released under the MIT license
 */;

(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form:not([data-turbo=true])',
        formInputClickSelector: 'form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var nonce;

      nonce = null;

      Rails.loadCSPNonce = function() {
        var ref;
        return nonce = (ref = document.querySelector("meta[name=csp-nonce]")) != null ? ref.content : void 0;
      };

      Rails.cspNonce = function() {
        return nonce != null ? nonce : Rails.loadCSPNonce();
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          CSRFProtection(xhr);
        }
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'fieldset[disabled] *')) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      Rails.confirm = function(message, element) {
        return confirm(message);
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = Rails.confirm(message, element);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, isXhrRedirect, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        if (e instanceof Event) {
          if (isXhrRedirect(e)) {
            return;
          }
          element = e.target;
        } else {
          element = e;
        }
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        if (getData(element, 'ujs:disabled')) {
          return;
        }
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        if (getData(element, 'ujs:disabled')) {
          return;
        }
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

      isXhrRedirect = function(event) {
        var ref, xhr;
        xhr = (ref = event.detail) != null ? ref[0] : void 0;
        return (xhr != null ? xhr.getResponseHeader("X-Xhr-Redirect") : void 0) != null;
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.preventInsignificantClick = function(e) {
        var data, insignificantMetaClick, link, metaClick, method, nonPrimaryMouseClick;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        insignificantMetaClick = metaClick && method === 'GET' && !data;
        nonPrimaryMouseClick = (e.button != null) && e.button !== 0;
        if (nonPrimaryMouseClick || insignificantMetaClick) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMethod, handleRemote, loadCSPNonce, preventInsignificantClick, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, loadCSPNonce = Rails.loadCSPNonce, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, preventInsignificantClick = Rails.preventInsignificantClick, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
        if (jQuery.rails) {
          throw new Error('If you load both jquery_ujs and rails-ujs, use rails-ujs only.');
        }
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', preventInsignificantClick);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        document.addEventListener('DOMContentLoaded', loadCSPNonce);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActiveStorage = {});
})(this, function(exports) {
  "use strict";
  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var sparkMd5 = createCommonjsModule(function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined) {
      var hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592") ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex) {
        var bytes = [], length = hex.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD5() {
        this.reset();
      }
      SparkMD5.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD5.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD5.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash
        };
      };
      SparkMD5.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD5.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD5.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD5.hash = function(str, raw) {
        return SparkMD5.hashBinary(toUtf8(str), raw);
      };
      SparkMD5.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD5.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD5.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD5.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ];
        return this;
      };
      SparkMD5.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD5.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD5.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD5.prototype.setState.call(this, state);
      };
      SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
      SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
      SparkMD5.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD5;
    });
  });
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = function() {
    createClass(FileChecksum, null, [ {
      key: "create",
      value: function create(file, callback) {
        var instance = new FileChecksum(file);
        instance.create(callback);
      }
    } ]);
    function FileChecksum(file) {
      classCallCheck(this, FileChecksum);
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    createClass(FileChecksum, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        this.callback = callback;
        this.md5Buffer = new sparkMd5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.fileReader.addEventListener("load", function(event) {
          return _this.fileReaderDidLoad(event);
        });
        this.fileReader.addEventListener("error", function(event) {
          return _this.fileReaderDidError(event);
        });
        this.readNextChunk();
      }
    }, {
      key: "fileReaderDidLoad",
      value: function fileReaderDidLoad(event) {
        this.md5Buffer.append(event.target.result);
        if (!this.readNextChunk()) {
          var binaryDigest = this.md5Buffer.end(true);
          var base64digest = btoa(binaryDigest);
          this.callback(null, base64digest);
        }
      }
    }, {
      key: "fileReaderDidError",
      value: function fileReaderDidError(event) {
        this.callback("Error reading " + this.file.name);
      }
    }, {
      key: "readNextChunk",
      value: function readNextChunk() {
        if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
          var start = this.chunkIndex * this.chunkSize;
          var end = Math.min(start + this.chunkSize, this.file.size);
          var bytes = fileSlice.call(this.file, start, end);
          this.fileReader.readAsArrayBuffer(bytes);
          this.chunkIndex++;
          return true;
        } else {
          return false;
        }
      }
    } ]);
    return FileChecksum;
  }();
  function getMetaValue(name) {
    var element = findElement(document.head, 'meta[name="' + name + '"]');
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    var elements = root.querySelectorAll(selector);
    return toArray$1(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent(element, type) {
    var eventInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var disabled = element.disabled;
    var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
    var event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray$1(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = function() {
    function BlobRecord(file, checksum, url) {
      var _this = this;
      classCallCheck(this, BlobRecord);
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type || "application/octet-stream",
        byte_size: file.size,
        checksum: checksum
      };
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      var csrfToken = getMetaValue("csrf-token");
      if (csrfToken != undefined) {
        this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobRecord, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(JSON.stringify({
          blob: this.attributes
        }));
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        if (this.status >= 200 && this.status < 300) {
          var response = this.response;
          var direct_upload = response.direct_upload;
          delete response.direct_upload;
          this.attributes = response;
          this.directUploadData = direct_upload;
          this.callback(null, this.toJSON());
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var result = {};
        for (var key in this.attributes) {
          result[key] = this.attributes[key];
        }
        return result;
      }
    }, {
      key: "status",
      get: function get$$1() {
        return this.xhr.status;
      }
    }, {
      key: "response",
      get: function get$$1() {
        var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
        if (responseType == "json") {
          return response;
        } else {
          return JSON.parse(response);
        }
      }
    } ]);
    return BlobRecord;
  }();
  var BlobUpload = function() {
    function BlobUpload(blob) {
      var _this = this;
      classCallCheck(this, BlobUpload);
      this.blob = blob;
      this.file = blob.file;
      var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url, true);
      this.xhr.responseType = "text";
      for (var key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", function(event) {
        return _this.requestDidLoad(event);
      });
      this.xhr.addEventListener("error", function(event) {
        return _this.requestDidError(event);
      });
    }
    createClass(BlobUpload, [ {
      key: "create",
      value: function create(callback) {
        this.callback = callback;
        this.xhr.send(this.file.slice());
      }
    }, {
      key: "requestDidLoad",
      value: function requestDidLoad(event) {
        var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
        if (status >= 200 && status < 300) {
          this.callback(null, response);
        } else {
          this.requestDidError(event);
        }
      }
    }, {
      key: "requestDidError",
      value: function requestDidError(event) {
        this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
      }
    } ]);
    return BlobUpload;
  }();
  var id = 0;
  var DirectUpload = function() {
    function DirectUpload(file, url, delegate) {
      classCallCheck(this, DirectUpload);
      this.id = ++id;
      this.file = file;
      this.url = url;
      this.delegate = delegate;
    }
    createClass(DirectUpload, [ {
      key: "create",
      value: function create(callback) {
        var _this = this;
        FileChecksum.create(this.file, function(error, checksum) {
          if (error) {
            callback(error);
            return;
          }
          var blob = new BlobRecord(_this.file, checksum, _this.url);
          notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
          blob.create(function(error) {
            if (error) {
              callback(error);
            } else {
              var upload = new BlobUpload(blob);
              notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
              upload.create(function(error) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, blob.toJSON());
                }
              });
            }
          });
        });
      }
    } ]);
    return DirectUpload;
  }();
  function notify(object, methodName) {
    if (object && typeof object[methodName] == "function") {
      for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        messages[_key - 2] = arguments[_key];
      }
      return object[methodName].apply(object, messages);
    }
  }
  var DirectUploadController = function() {
    function DirectUploadController(input, file) {
      classCallCheck(this, DirectUploadController);
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this);
      this.dispatch("initialize");
    }
    createClass(DirectUploadController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = this.input.name;
        this.input.insertAdjacentElement("beforebegin", hiddenInput);
        this.dispatch("start");
        this.directUpload.create(function(error, attributes) {
          if (error) {
            hiddenInput.parentNode.removeChild(hiddenInput);
            _this.dispatchError(error);
          } else {
            hiddenInput.value = attributes.signed_id;
          }
          _this.dispatch("end");
          callback(error);
        });
      }
    }, {
      key: "uploadRequestDidProgress",
      value: function uploadRequestDidProgress(event) {
        var progress = event.loaded / event.total * 100;
        if (progress) {
          this.dispatch("progress", {
            progress: progress
          });
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        detail.file = this.file;
        detail.id = this.directUpload.id;
        return dispatchEvent(this.input, "direct-upload:" + name, {
          detail: detail
        });
      }
    }, {
      key: "dispatchError",
      value: function dispatchError(error) {
        var event = this.dispatch("error", {
          error: error
        });
        if (!event.defaultPrevented) {
          alert(error);
        }
      }
    }, {
      key: "directUploadWillCreateBlobWithXHR",
      value: function directUploadWillCreateBlobWithXHR(xhr) {
        this.dispatch("before-blob-request", {
          xhr: xhr
        });
      }
    }, {
      key: "directUploadWillStoreFileWithXHR",
      value: function directUploadWillStoreFileWithXHR(xhr) {
        var _this2 = this;
        this.dispatch("before-storage-request", {
          xhr: xhr
        });
        xhr.upload.addEventListener("progress", function(event) {
          return _this2.uploadRequestDidProgress(event);
        });
      }
    }, {
      key: "url",
      get: function get$$1() {
        return this.input.getAttribute("data-direct-upload-url");
      }
    } ]);
    return DirectUploadController;
  }();
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = function() {
    function DirectUploadsController(form) {
      classCallCheck(this, DirectUploadsController);
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter(function(input) {
        return input.files.length;
      });
    }
    createClass(DirectUploadsController, [ {
      key: "start",
      value: function start(callback) {
        var _this = this;
        var controllers = this.createDirectUploadControllers();
        var startNextController = function startNextController() {
          var controller = controllers.shift();
          if (controller) {
            controller.start(function(error) {
              if (error) {
                callback(error);
                _this.dispatch("end");
              } else {
                startNextController();
              }
            });
          } else {
            callback();
            _this.dispatch("end");
          }
        };
        this.dispatch("start");
        startNextController();
      }
    }, {
      key: "createDirectUploadControllers",
      value: function createDirectUploadControllers() {
        var controllers = [];
        this.inputs.forEach(function(input) {
          toArray$1(input.files).forEach(function(file) {
            var controller = new DirectUploadController(input, file);
            controllers.push(controller);
          });
        });
        return controllers;
      }
    }, {
      key: "dispatch",
      value: function dispatch(name) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return dispatchEvent(this.form, "direct-uploads:" + name, {
          detail: detail
        });
      }
    } ]);
    return DirectUploadsController;
  }();
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = new WeakMap();
  var started = false;
  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    var target = event.target;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    var form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    var controller = new DirectUploadsController(form);
    var inputs = controller.inputs;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start(function(error) {
        form.removeAttribute(processingAttribute);
        if (error) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      var _button = button, disabled = _button.disabled;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start();
    }
  }
  setTimeout(autostart, 1);
  exports.start = start;
  exports.DirectUpload = DirectUpload;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=29)}([function(e,t,n){"use strict";e.exports=n(14)},function(e,t,n){"use strict";function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}n.d(t,"a",(function(){return r}))},function(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}n.d(t,"a",(function(){return r}))},function(e,t,n){"use strict";function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,r(e,t)}n.d(t,"a",(function(){return o}))},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE){0;try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}}(),e.exports=n(15)},function(e,t,n){e.exports=n(18)()},function(e,t,n){"use strict";var r=n(20),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},s={};function l(e){return r.isMemo(e)?a:s[e.$$typeof]||o}s[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},s[r.Memo]=a;var u=Object.defineProperty,c=Object.getOwnPropertyNames,f=Object.getOwnPropertySymbols,p=Object.getOwnPropertyDescriptor,d=Object.getPrototypeOf,h=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(h){var o=d(n);o&&o!==h&&e(t,o,r)}var a=c(n);f&&(a=a.concat(f(n)));for(var s=l(t),m=l(n),g=0;g<a.length;++g){var v=a[g];if(!(i[v]||r&&r[v]||m&&m[v]||s&&s[v])){var y=p(n,v);try{u(t,v,y)}catch(e){}}}}return t}},,function(e,t,n){var r=n(23);e.exports=d,e.exports.parse=i,e.exports.compile=function(e,t){return s(i(e,t),t)},e.exports.tokensToFunction=s,e.exports.tokensToRegExp=p;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function i(e,t){for(var n,r=[],i=0,a=0,s="",c=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(s+=e.slice(a,d),a=d+f.length,p)s+=p[1];else{var h=e[a],m=n[2],g=n[3],v=n[4],y=n[5],b=n[6],w=n[7];s&&(r.push(s),s="");var E=null!=m&&null!=h&&h!==m,x="+"===b||"*"===b,_="?"===b||"*"===b,k=n[2]||c,C=v||y;r.push({name:g||i++,prefix:m||"",delimiter:k,optional:_,repeat:x,partial:E,asterisk:!!w,pattern:C?u(C):w?".*":"[^"+l(k)+"]+?"})}}return a<e.length&&(s+=e.substr(a)),s&&r.push(s),r}function a(e){return encodeURI(e).replace(/[\/?#]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}))}function s(e,t){for(var n=new Array(e.length),o=0;o<e.length;o++)"object"==typeof e[o]&&(n[o]=new RegExp("^(?:"+e[o].pattern+")$",f(t)));return function(t,o){for(var i="",s=t||{},l=(o||{}).pretty?a:encodeURIComponent,u=0;u<e.length;u++){var c=e[u];if("string"!=typeof c){var f,p=s[c.name];if(null==p){if(c.optional){c.partial&&(i+=c.prefix);continue}throw new TypeError('Expected "'+c.name+'" to be defined')}if(r(p)){if(!c.repeat)throw new TypeError('Expected "'+c.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(c.optional)continue;throw new TypeError('Expected "'+c.name+'" to not be empty')}for(var d=0;d<p.length;d++){if(f=l(p[d]),!n[u].test(f))throw new TypeError('Expected all "'+c.name+'" to match "'+c.pattern+'", but received `'+JSON.stringify(f)+"`");i+=(0===d?c.prefix:c.delimiter)+f}}else{if(f=c.asterisk?encodeURI(p).replace(/[?#]/g,(function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})):l(p),!n[u].test(f))throw new TypeError('Expected "'+c.name+'" to match "'+c.pattern+'", but received "'+f+'"');i+=c.prefix+f}}else i+=c}return i}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function f(e){return e&&e.sensitive?"":"i"}function p(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,i=!1!==n.end,a="",s=0;s<e.length;s++){var u=e[s];if("string"==typeof u)a+=l(u);else{var p=l(u.prefix),d="(?:"+u.pattern+")";t.push(u),u.repeat&&(d+="(?:"+p+d+")*"),a+=d=u.optional?u.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var h=l(n.delimiter||"/"),m=a.slice(-h.length)===h;return o||(a=(m?a.slice(0,-h.length):a)+"(?:"+h+"(?=$))?"),a+=i?"$":o&&m?"":"(?="+h+"|$)",c(new RegExp("^"+a,f(n)),t)}function d(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);return c(new RegExp("(?:"+r.join("|")+")",f(n)),t)}(e,t,n):function(e,t,n){return p(i(e,n),t,n)}(e,t,n)}},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function a(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,s,l=a(e),u=1;u<arguments.length;u++){for(var c in n=Object(arguments[u]))o.call(n,c)&&(l[c]=n[c]);if(r){s=r(n);for(var f=0;f<s.length;f++)i.call(n,s[f])&&(l[s[f]]=n[s[f]])}}return l}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";e.exports=n(22)},function(e,t,n){"use strict";(function(e){var r=n(0),o=n.n(r),i=n(3),a=n(5),s=n.n(a),l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==e?e:{};function u(e){var t=[];return{on:function(e){t.push(e)},off:function(e){t=t.filter((function(t){return t!==e}))},get:function(){return e},set:function(n,r){e=n,t.forEach((function(t){return t(e,r)}))}}}var c=o.a.createContext||function(e,t){var n,o,a,c="__create-react-context-"+((l[a="__global_unique_id__"]=(l[a]||0)+1)+"__"),f=function(e){function n(){var t;return(t=e.apply(this,arguments)||this).emitter=u(t.props.value),t}Object(i.a)(n,e);var r=n.prototype;return r.getChildContext=function(){var e;return(e={})[c]=this.emitter,e},r.componentWillReceiveProps=function(e){if(this.props.value!==e.value){var n,r=this.props.value,o=e.value;((i=r)===(a=o)?0!==i||1/i==1/a:i!=i&&a!=a)?n=0:(n="function"==typeof t?t(r,o):1073741823,0!==(n|=0)&&this.emitter.set(e.value,n))}var i,a},r.render=function(){return this.props.children},n}(r.Component);f.childContextTypes=((n={})[c]=s.a.object.isRequired,n);var p=function(t){function n(){var e;return(e=t.apply(this,arguments)||this).state={value:e.getValue()},e.onUpdate=function(t,n){0!=((0|e.observedBits)&n)&&e.setState({value:e.getValue()})},e}Object(i.a)(n,t);var r=n.prototype;return r.componentWillReceiveProps=function(e){var t=e.observedBits;this.observedBits=null==t?1073741823:t},r.componentDidMount=function(){this.context[c]&&this.context[c].on(this.onUpdate);var e=this.props.observedBits;this.observedBits=null==e?1073741823:e},r.componentWillUnmount=function(){this.context[c]&&this.context[c].off(this.onUpdate)},r.getValue=function(){return this.context[c]?this.context[c].get():e},r.render=function(){return(e=this.props.children,Array.isArray(e)?e[0]:e)(this.state.value);var e},n}(r.Component);return p.contextTypes=((o={})[c]=s.a.object,o),{Provider:f,Consumer:p}};t.a=c}).call(this,n(10))},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function i(e,t){i.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function a(e,t){a.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function s(e,t,n){s.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function u(e){var t=void 0===e?"undefined":_(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function c(e,t,n,r,f,p,d){d=d||[];var h=(f=f||[]).slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":_(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var m=r.normalize(h,p,e,t);m&&(e=m[0],t=m[1])}}}h.push(p)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var g=void 0===e?"undefined":_(e),v=void 0===t?"undefined":_(t),y="undefined"!==g||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==v||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!y&&b)n(new i(h,t));else if(!b&&y)n(new a(h,e));else if(u(e)!==u(t))n(new o(h,e,t));else if("date"===u(e)&&e-t!=0)n(new o(h,e,t));else if("object"===g&&null!==e&&null!==t)if(d.filter((function(t){return t.lhs===e})).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var w;for(e.length,w=0;w<e.length;w++)w>=t.length?n(new s(h,w,new a(void 0,e[w]))):c(e[w],t[w],n,r,h,w,d);for(;w<t.length;)n(new s(h,w,new i(void 0,t[w++])))}else{var E=Object.keys(e),x=Object.keys(t);E.forEach((function(o,i){var a=x.indexOf(o);a>=0?(c(e[o],t[o],n,r,h,o,d),x=l(x,a)):c(e[o],void 0,n,r,h,o,d)})),x.forEach((function(e){c(void 0,t[e],n,r,h,e,d)}))}d.length=d.length-1}else e!==t&&("number"===g&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],c(e,t,(function(e){e&&r.push(e)}),n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,i=n.path?n.path.length-1:0;++o<i;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":delete i[r.path[o]];break;case"E":case"N":i[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=l(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e){return"color: "+S[e].color+"; font-weight: bold"}function h(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach((function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+i+"]",a];default:return[]}}(e);n.log.apply(n,["%c "+S[t].text,d(t)].concat(k(r)))})):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function m(e,t,n,r){switch(void 0===e?"undefined":_(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,k(n)):e[r];case"function":return e(t);default:return e}}function g(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,i=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+r),n&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}(t):o,a=t.collapsed,s=t.colors,l=t.level,u=t.diff,c=void 0===t.titleFormatter;e.forEach((function(o,f){var p=o.started,d=o.startedTime,g=o.action,v=o.prevState,y=o.error,b=o.took,w=o.nextState,x=e[f+1];x&&(w=x.prevState,b=x.started-p);var _=r(g),k="function"==typeof a?a((function(){return w}),g,o):a,C=E(d),S=s.title?"color: "+s.title(_)+";":"",O=["color: gray; font-weight: lighter;"];O.push(S),t.timestamp&&O.push("color: gray; font-weight: lighter;"),t.duration&&O.push("color: gray; font-weight: lighter;");var P=i(_,C,b);try{k?s.title&&c?n.groupCollapsed.apply(n,["%c "+P].concat(O)):n.groupCollapsed(P):s.title&&c?n.group.apply(n,["%c "+P].concat(O)):n.group(P)}catch(e){n.log(P)}var T=m(l,_,[v],"prevState"),L=m(l,_,[_],"action"),N=m(l,_,[y,v],"error"),M=m(l,_,[w],"nextState");if(T)if(s.prevState){var j="color: "+s.prevState(v)+"; font-weight: bold";n[T]("%c prev state",j,v)}else n[T]("prev state",v);if(L)if(s.action){var D="color: "+s.action(_)+"; font-weight: bold";n[L]("%c action    ",D,_)}else n[L]("action    ",_);if(y&&N)if(s.error){var A="color: "+s.error(y,v)+"; font-weight: bold;";n[N]("%c error     ",A,y)}else n[N]("error     ",y);if(M)if(s.nextState){var R="color: "+s.nextState(w)+"; font-weight: bold";n[M]("%c next state",R,w)}else n[M]("next state",w);u&&h(v,w,n,k);try{n.groupEnd()}catch(e){n.log("—— log end ——")}}))}function v(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},O,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,s=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(u){if("function"==typeof i&&!i(n,u))return e(u);var c={};l.push(c),c.started=x.now(),c.startedTime=new Date,c.prevState=r(n()),c.action=u;var f=void 0;if(a)try{f=e(u)}catch(e){c.error=o(e)}else f=e(u);c.took=x.now()-c.started,c.nextState=r(n());var p=t.diff&&"function"==typeof s?s(n,u):t.diff;if(g(l,Object.assign({},t,{diff:p})),l.length=0,c.error)throw c.error;return f}}}}var y,b,w=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},E=function(e){return w(e.getHours(),2)+":"+w(e.getMinutes(),2)+":"+w(e.getSeconds(),2)+"."+w(e.getMilliseconds(),3)},x="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},k=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},C=[];y="object"===(void 0===e?"undefined":_(e))&&e?e:"undefined"!=typeof window?window:{},(b=y.DeepDiff)&&C.push((function(){void 0!==b&&y.DeepDiff===f&&(y.DeepDiff=b,b=void 0)})),n(o,r),n(i,r),n(a,r),n(s,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:c,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&c(e,t,(function(r){n&&!n(e,t,r)||p(e,t,r)}))},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,i=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===i[n.path[r]]&&(i[n.path[r]]={}),i=i[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":case"E":i[r.path[o]]=r.lhs;break;case"N":delete i[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=l(t,n)}return t}(i[n.path[r]],n.index,n.item);break;case"D":case"E":i[n.path[r]]=n.lhs;break;case"N":delete i[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==b},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach((function(e){e()})),C=null),f},enumerable:!0}});var S={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},O={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},P=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?v()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=O,t.createLogger=v,t.logger=P,t.default=P,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(10))},function(e,t,n){"use strict";
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(9),o=60103,i=60106;t.Fragment=60107,t.StrictMode=60108,t.Profiler=60114;var a=60109,s=60110,l=60112;t.Suspense=60113;var u=60115,c=60116;if("function"==typeof Symbol&&Symbol.for){var f=Symbol.for;o=f("react.element"),i=f("react.portal"),t.Fragment=f("react.fragment"),t.StrictMode=f("react.strict_mode"),t.Profiler=f("react.profiler"),a=f("react.provider"),s=f("react.context"),l=f("react.forward_ref"),t.Suspense=f("react.suspense"),u=f("react.memo"),c=f("react.lazy")}var p="function"==typeof Symbol&&Symbol.iterator;function d(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},m={};function g(e,t,n){this.props=e,this.context=t,this.refs=m,this.updater=n||h}function v(){}function y(e,t,n){this.props=e,this.context=t,this.refs=m,this.updater=n||h}g.prototype.isReactComponent={},g.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(d(85));this.updater.enqueueSetState(this,e,t,"setState")},g.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},v.prototype=g.prototype;var b=y.prototype=new v;b.constructor=y,r(b,g.prototype),b.isPureReactComponent=!0;var w={current:null},E=Object.prototype.hasOwnProperty,x={key:!0,ref:!0,__self:!0,__source:!0};function _(e,t,n){var r,i={},a=null,s=null;if(null!=t)for(r in void 0!==t.ref&&(s=t.ref),void 0!==t.key&&(a=""+t.key),t)E.call(t,r)&&!x.hasOwnProperty(r)&&(i[r]=t[r]);var l=arguments.length-2;if(1===l)i.children=n;else if(1<l){for(var u=Array(l),c=0;c<l;c++)u[c]=arguments[c+2];i.children=u}if(e&&e.defaultProps)for(r in l=e.defaultProps)void 0===i[r]&&(i[r]=l[r]);return{$$typeof:o,type:e,key:a,ref:s,props:i,_owner:w.current}}function k(e){return"object"==typeof e&&null!==e&&e.$$typeof===o}var C=/\/+/g;function S(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}(""+e.key):t.toString(36)}function O(e,t,n,r,a){var s=typeof e;"undefined"!==s&&"boolean"!==s||(e=null);var l=!1;if(null===e)l=!0;else switch(s){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case o:case i:l=!0}}if(l)return a=a(l=e),e=""===r?"."+S(l,0):r,Array.isArray(a)?(n="",null!=e&&(n=e.replace(C,"$&/")+"/"),O(a,t,n,"",(function(e){return e}))):null!=a&&(k(a)&&(a=function(e,t){return{$$typeof:o,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(a,n+(!a.key||l&&l.key===a.key?"":(""+a.key).replace(C,"$&/")+"/")+e)),t.push(a)),1;if(l=0,r=""===r?".":r+":",Array.isArray(e))for(var u=0;u<e.length;u++){var c=r+S(s=e[u],u);l+=O(s,t,n,c,a)}else if("function"==typeof(c=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=p&&e[p]||e["@@iterator"])?e:null}(e)))for(e=c.call(e),u=0;!(s=e.next()).done;)l+=O(s=s.value,t,n,c=r+S(s,u++),a);else if("object"===s)throw t=""+e,Error(d(31,"[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t));return l}function P(e,t,n){if(null==e)return e;var r=[],o=0;return O(e,r,"","",(function(e){return t.call(n,e,o++)})),r}function T(e){if(-1===e._status){var t=e._result;t=t(),e._status=0,e._result=t,t.then((function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)}),(function(t){0===e._status&&(e._status=2,e._result=t)}))}if(1===e._status)return e._result;throw e._result}var L={current:null};function N(){var e=L.current;if(null===e)throw Error(d(321));return e}var M={ReactCurrentDispatcher:L,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:w,IsSomeRendererActing:{current:!1},assign:r};t.Children={map:P,forEach:function(e,t,n){P(e,(function(){t.apply(this,arguments)}),n)},count:function(e){var t=0;return P(e,(function(){t++})),t},toArray:function(e){return P(e,(function(e){return e}))||[]},only:function(e){if(!k(e))throw Error(d(143));return e}},t.Component=g,t.PureComponent=y,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=M,t.cloneElement=function(e,t,n){if(null==e)throw Error(d(267,e));var i=r({},e.props),a=e.key,s=e.ref,l=e._owner;if(null!=t){if(void 0!==t.ref&&(s=t.ref,l=w.current),void 0!==t.key&&(a=""+t.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(c in t)E.call(t,c)&&!x.hasOwnProperty(c)&&(i[c]=void 0===t[c]&&void 0!==u?u[c]:t[c])}var c=arguments.length-2;if(1===c)i.children=n;else if(1<c){u=Array(c);for(var f=0;f<c;f++)u[f]=arguments[f+2];i.children=u}return{$$typeof:o,type:e.type,key:a,ref:s,props:i,_owner:l}},t.createContext=function(e,t){return void 0===t&&(t=null),(e={$$typeof:s,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:a,_context:e},e.Consumer=e},t.createElement=_,t.createFactory=function(e){var t=_.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:l,render:e}},t.isValidElement=k,t.lazy=function(e){return{$$typeof:c,_payload:{_status:-1,_result:e},_init:T}},t.memo=function(e,t){return{$$typeof:u,type:e,compare:void 0===t?null:t}},t.useCallback=function(e,t){return N().useCallback(e,t)},t.useContext=function(e,t){return N().useContext(e,t)},t.useDebugValue=function(){},t.useEffect=function(e,t){return N().useEffect(e,t)},t.useImperativeHandle=function(e,t,n){return N().useImperativeHandle(e,t,n)},t.useLayoutEffect=function(e,t){return N().useLayoutEffect(e,t)},t.useMemo=function(e,t){return N().useMemo(e,t)},t.useReducer=function(e,t,n){return N().useReducer(e,t,n)},t.useRef=function(e){return N().useRef(e)},t.useState=function(e){return N().useState(e)},t.version="17.0.2"},function(e,t,n){"use strict";
/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(0),o=n(9),i=n(16);function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!r)throw Error(a(227));var s=new Set,l={};function u(e,t){c(e,t),c(e+"Capture",t)}function c(e,t){for(l[e]=t,e=0;e<t.length;e++)s.add(t[e])}var f=!("undefined"==typeof window||void 0===window.document||void 0===window.document.createElement),p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,d=Object.prototype.hasOwnProperty,h={},m={};function g(e,t,n,r,o,i,a){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=a}var v={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach((function(e){v[e]=new g(e,0,!1,e,null,!1,!1)})),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach((function(e){var t=e[0];v[t]=new g(t,1,!1,e[1],null,!1,!1)})),["contentEditable","draggable","spellCheck","value"].forEach((function(e){v[e]=new g(e,2,!1,e.toLowerCase(),null,!1,!1)})),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach((function(e){v[e]=new g(e,2,!1,e,null,!1,!1)})),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach((function(e){v[e]=new g(e,3,!1,e.toLowerCase(),null,!1,!1)})),["checked","multiple","muted","selected"].forEach((function(e){v[e]=new g(e,3,!0,e,null,!1,!1)})),["capture","download"].forEach((function(e){v[e]=new g(e,4,!1,e,null,!1,!1)})),["cols","rows","size","span"].forEach((function(e){v[e]=new g(e,6,!1,e,null,!1,!1)})),["rowSpan","start"].forEach((function(e){v[e]=new g(e,5,!1,e.toLowerCase(),null,!1,!1)}));var y=/[\-:]([a-z])/g;function b(e){return e[1].toUpperCase()}function w(e,t,n,r){var o=v.hasOwnProperty(t)?v[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null==t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!d.call(m,e)||!d.call(h,e)&&(p.test(e)?m[e]=!0:(h[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach((function(e){var t=e.replace(y,b);v[t]=new g(t,1,!1,e,null,!1,!1)})),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach((function(e){var t=e.replace(y,b);v[t]=new g(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)})),["xml:base","xml:lang","xml:space"].forEach((function(e){var t=e.replace(y,b);v[t]=new g(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)})),["tabIndex","crossOrigin"].forEach((function(e){v[e]=new g(e,1,!1,e.toLowerCase(),null,!1,!1)})),v.xlinkHref=new g("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach((function(e){v[e]=new g(e,1,!1,e.toLowerCase(),null,!0,!0)}));var E=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,x=60103,_=60106,k=60107,C=60108,S=60114,O=60109,P=60110,T=60112,L=60113,N=60120,M=60115,j=60116,D=60121,A=60128,R=60129,I=60130,z=60131;if("function"==typeof Symbol&&Symbol.for){var B=Symbol.for;x=B("react.element"),_=B("react.portal"),k=B("react.fragment"),C=B("react.strict_mode"),S=B("react.profiler"),O=B("react.provider"),P=B("react.context"),T=B("react.forward_ref"),L=B("react.suspense"),N=B("react.suspense_list"),M=B("react.memo"),j=B("react.lazy"),D=B("react.block"),B("react.scope"),A=B("react.opaque.id"),R=B("react.debug_trace_mode"),I=B("react.offscreen"),z=B("react.legacy_hidden")}var U,H="function"==typeof Symbol&&Symbol.iterator;function F(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=H&&e[H]||e["@@iterator"])?e:null}function W(e){if(void 0===U)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);U=t&&t[1]||""}return"\n"+U+e}var $=!1;function q(e,t){if(!e||$)return"";$=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),"object"==typeof Reflect&&Reflect.construct){try{Reflect.construct(t,[])}catch(e){var r=e}Reflect.construct(e,[],t)}else{try{t.call()}catch(e){r=e}e.call(t.prototype)}else{try{throw Error()}catch(e){r=e}e()}}catch(e){if(e&&r&&"string"==typeof e.stack){for(var o=e.stack.split("\n"),i=r.stack.split("\n"),a=o.length-1,s=i.length-1;1<=a&&0<=s&&o[a]!==i[s];)s--;for(;1<=a&&0<=s;a--,s--)if(o[a]!==i[s]){if(1!==a||1!==s)do{if(a--,0>--s||o[a]!==i[s])return"\n"+o[a].replace(" at new "," at ")}while(1<=a&&0<=s);break}}}finally{$=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?W(e):""}function V(e){switch(e.tag){case 5:return W(e.type);case 16:return W("Lazy");case 13:return W("Suspense");case 19:return W("SuspenseList");case 0:case 2:case 15:return e=q(e.type,!1);case 11:return e=q(e.type.render,!1);case 22:return e=q(e.type._render,!1);case 1:return e=q(e.type,!0);default:return""}}function Q(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case k:return"Fragment";case _:return"Portal";case S:return"Profiler";case C:return"StrictMode";case L:return"Suspense";case N:return"SuspenseList"}if("object"==typeof e)switch(e.$$typeof){case P:return(e.displayName||"Context")+".Consumer";case O:return(e._context.displayName||"Context")+".Provider";case T:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case M:return Q(e.type);case D:return Q(e._render);case j:t=e._payload,e=e._init;try{return Q(e(t))}catch(e){}}return null}function K(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function Y(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function X(e){e._valueTracker||(e._valueTracker=function(e){var t=Y(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,i.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function G(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Y(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}function Z(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}function J(e,t){var n=t.checked;return o({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function ee(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=K(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function te(e,t){null!=(t=t.checked)&&w(e,"checked",t,!1)}function ne(e,t){te(e,t);var n=K(t.value),r=t.type;if(null!=n)"number"===r?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if("submit"===r||"reset"===r)return void e.removeAttribute("value");t.hasOwnProperty("value")?oe(e,t.type,n):t.hasOwnProperty("defaultValue")&&oe(e,t.type,K(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function re(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!("submit"!==r&&"reset"!==r||void 0!==t.value&&null!==t.value))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,""!==n&&(e.name=n)}function oe(e,t,n){"number"===t&&Z(e.ownerDocument)===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function ie(e,t){return e=o({children:void 0},t),(t=function(e){var t="";return r.Children.forEach(e,(function(e){null!=e&&(t+=e)})),t}(t.children))&&(e.children=t),e}function ae(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+K(n),t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function se(e,t){if(null!=t.dangerouslySetInnerHTML)throw Error(a(91));return o({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function le(e,t){var n=t.value;if(null==n){if(n=t.children,t=t.defaultValue,null!=n){if(null!=t)throw Error(a(92));if(Array.isArray(n)){if(!(1>=n.length))throw Error(a(93));n=n[0]}t=n}null==t&&(t=""),n=t}e._wrapperState={initialValue:K(n)}}function ue(e,t){var n=K(t.value),r=K(t.defaultValue);null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&e.defaultValue!==n&&(e.defaultValue=n)),null!=r&&(e.defaultValue=""+r)}function ce(e){var t=e.textContent;t===e._wrapperState.initialValue&&""!==t&&null!==t&&(e.value=t)}var fe="http://www.w3.org/1999/xhtml",pe="http://www.w3.org/2000/svg";function de(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function he(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?de(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var me,ge=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction((function(){return e(t,n)}))}:e}((function(e,t){if(e.namespaceURI!==pe||"innerHTML"in e)e.innerHTML=t;else{for((me=me||document.createElement("div")).innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=me.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}}));function ve(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var ye={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},be=["Webkit","ms","Moz","O"];function we(e,t,n){return null==t||"boolean"==typeof t||""===t?"":n||"number"!=typeof t||0===t||ye.hasOwnProperty(e)&&ye[e]?(""+t).trim():t+"px"}function Ee(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=we(n,t[n],r);"float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(ye).forEach((function(e){be.forEach((function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ye[t]=ye[e]}))}));var xe=o({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function _e(e,t){if(t){if(xe[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML))throw Error(a(137,e));if(null!=t.dangerouslySetInnerHTML){if(null!=t.children)throw Error(a(60));if("object"!=typeof t.dangerouslySetInnerHTML||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(null!=t.style&&"object"!=typeof t.style)throw Error(a(62))}}function ke(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function Ce(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}var Se=null,Oe=null,Pe=null;function Te(e){if(e=Zr(e)){if("function"!=typeof Se)throw Error(a(280));var t=e.stateNode;t&&(t=eo(t),Se(e.stateNode,e.type,t))}}function Le(e){Oe?Pe?Pe.push(e):Pe=[e]:Oe=e}function Ne(){if(Oe){var e=Oe,t=Pe;if(Pe=Oe=null,Te(e),t)for(e=0;e<t.length;e++)Te(t[e])}}function Me(e,t){return e(t)}function je(e,t,n,r,o){return e(t,n,r,o)}function De(){}var Ae=Me,Re=!1,Ie=!1;function ze(){null===Oe&&null===Pe||(De(),Ne())}function Be(e,t){var n=e.stateNode;if(null===n)return null;var r=eo(n);if(null===r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}if(e)return null;if(n&&"function"!=typeof n)throw Error(a(231,t,typeof n));return n}var Ue=!1;if(f)try{var He={};Object.defineProperty(He,"passive",{get:function(){Ue=!0}}),window.addEventListener("test",He,He),window.removeEventListener("test",He,He)}catch(e){Ue=!1}function Fe(e,t,n,r,o,i,a,s,l){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(e){this.onError(e)}}var We=!1,$e=null,qe=!1,Ve=null,Qe={onError:function(e){We=!0,$e=e}};function Ke(e,t,n,r,o,i,a,s,l){We=!1,$e=null,Fe.apply(Qe,arguments)}function Ye(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do{0!=(1026&(t=e).flags)&&(n=t.return),e=t.return}while(e)}return 3===t.tag?n:null}function Xe(e){if(13===e.tag){var t=e.memoizedState;if(null===t&&(null!==(e=e.alternate)&&(t=e.memoizedState)),null!==t)return t.dehydrated}return null}function Ge(e){if(Ye(e)!==e)throw Error(a(188))}function Ze(e){if(!(e=function(e){var t=e.alternate;if(!t){if(null===(t=Ye(e)))throw Error(a(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(null===o)break;var i=o.alternate;if(null===i){if(null!==(r=o.return)){n=r;continue}break}if(o.child===i.child){for(i=o.child;i;){if(i===n)return Ge(o),e;if(i===r)return Ge(o),t;i=i.sibling}throw Error(a(188))}if(n.return!==r.return)n=o,r=i;else{for(var s=!1,l=o.child;l;){if(l===n){s=!0,n=o,r=i;break}if(l===r){s=!0,r=o,n=i;break}l=l.sibling}if(!s){for(l=i.child;l;){if(l===n){s=!0,n=i,r=o;break}if(l===r){s=!0,r=i,n=o;break}l=l.sibling}if(!s)throw Error(a(189))}}if(n.alternate!==r)throw Error(a(190))}if(3!==n.tag)throw Error(a(188));return n.stateNode.current===n?e:t}(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function Je(e,t){for(var n=e.alternate;null!==t;){if(t===e||t===n)return!0;t=t.return}return!1}var et,tt,nt,rt,ot=!1,it=[],at=null,st=null,lt=null,ut=new Map,ct=new Map,ft=[],pt="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function dt(e,t,n,r,o){return{blockedOn:e,domEventName:t,eventSystemFlags:16|n,nativeEvent:o,targetContainers:[r]}}function ht(e,t){switch(e){case"focusin":case"focusout":at=null;break;case"dragenter":case"dragleave":st=null;break;case"mouseover":case"mouseout":lt=null;break;case"pointerover":case"pointerout":ut.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ct.delete(t.pointerId)}}function mt(e,t,n,r,o,i){return null===e||e.nativeEvent!==i?(e=dt(t,n,r,o,i),null!==t&&(null!==(t=Zr(t))&&tt(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,null!==o&&-1===t.indexOf(o)&&t.push(o),e)}function gt(e){var t=Gr(e.target);if(null!==t){var n=Ye(t);if(null!==n)if(13===(t=n.tag)){if(null!==(t=Xe(n)))return e.blockedOn=t,void rt(e.lanePriority,(function(){i.unstable_runWithPriority(e.priority,(function(){nt(n)}))}))}else if(3===t&&n.stateNode.hydrate)return void(e.blockedOn=3===n.tag?n.stateNode.containerInfo:null)}e.blockedOn=null}function vt(e){if(null!==e.blockedOn)return!1;for(var t=e.targetContainers;0<t.length;){var n=Zt(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(null!==n)return null!==(t=Zr(n))&&tt(t),e.blockedOn=n,!1;t.shift()}return!0}function yt(e,t,n){vt(e)&&n.delete(t)}function bt(){for(ot=!1;0<it.length;){var e=it[0];if(null!==e.blockedOn){null!==(e=Zr(e.blockedOn))&&et(e);break}for(var t=e.targetContainers;0<t.length;){var n=Zt(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(null!==n){e.blockedOn=n;break}t.shift()}null===e.blockedOn&&it.shift()}null!==at&&vt(at)&&(at=null),null!==st&&vt(st)&&(st=null),null!==lt&&vt(lt)&&(lt=null),ut.forEach(yt),ct.forEach(yt)}function wt(e,t){e.blockedOn===t&&(e.blockedOn=null,ot||(ot=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,bt)))}function Et(e){function t(t){return wt(t,e)}if(0<it.length){wt(it[0],e);for(var n=1;n<it.length;n++){var r=it[n];r.blockedOn===e&&(r.blockedOn=null)}}for(null!==at&&wt(at,e),null!==st&&wt(st,e),null!==lt&&wt(lt,e),ut.forEach(t),ct.forEach(t),n=0;n<ft.length;n++)(r=ft[n]).blockedOn===e&&(r.blockedOn=null);for(;0<ft.length&&null===(n=ft[0]).blockedOn;)gt(n),null===n.blockedOn&&ft.shift()}function xt(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var _t={animationend:xt("Animation","AnimationEnd"),animationiteration:xt("Animation","AnimationIteration"),animationstart:xt("Animation","AnimationStart"),transitionend:xt("Transition","TransitionEnd")},kt={},Ct={};function St(e){if(kt[e])return kt[e];if(!_t[e])return e;var t,n=_t[e];for(t in n)if(n.hasOwnProperty(t)&&t in Ct)return kt[e]=n[t];return e}f&&(Ct=document.createElement("div").style,"AnimationEvent"in window||(delete _t.animationend.animation,delete _t.animationiteration.animation,delete _t.animationstart.animation),"TransitionEvent"in window||delete _t.transitionend.transition);var Ot=St("animationend"),Pt=St("animationiteration"),Tt=St("animationstart"),Lt=St("transitionend"),Nt=new Map,Mt=new Map,jt=["abort","abort",Ot,"animationEnd",Pt,"animationIteration",Tt,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart","lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lt,"transitionEnd","waiting","waiting"];function Dt(e,t){for(var n=0;n<e.length;n+=2){var r=e[n],o=e[n+1];o="on"+(o[0].toUpperCase()+o.slice(1)),Mt.set(r,t),Nt.set(r,o),u(o,[r])}}(0,i.unstable_now)();var At=8;function Rt(e){if(0!=(1&e))return At=15,1;if(0!=(2&e))return At=14,2;if(0!=(4&e))return At=13,4;var t=24&e;return 0!==t?(At=12,t):0!=(32&e)?(At=11,32):0!==(t=192&e)?(At=10,t):0!=(256&e)?(At=9,256):0!==(t=3584&e)?(At=8,t):0!=(4096&e)?(At=7,4096):0!==(t=4186112&e)?(At=6,t):0!==(t=62914560&e)?(At=5,t):67108864&e?(At=4,67108864):0!=(134217728&e)?(At=3,134217728):0!==(t=805306368&e)?(At=2,t):0!=(1073741824&e)?(At=1,1073741824):(At=8,e)}function It(e,t){var n=e.pendingLanes;if(0===n)return At=0;var r=0,o=0,i=e.expiredLanes,a=e.suspendedLanes,s=e.pingedLanes;if(0!==i)r=i,o=At=15;else if(0!==(i=134217727&n)){var l=i&~a;0!==l?(r=Rt(l),o=At):0!==(s&=i)&&(r=Rt(s),o=At)}else 0!==(i=n&~a)?(r=Rt(i),o=At):0!==s&&(r=Rt(s),o=At);if(0===r)return 0;if(r=n&((0>(r=31-Wt(r))?0:1<<r)<<1)-1,0!==t&&t!==r&&0==(t&a)){if(Rt(t),o<=At)return t;At=o}if(0!==(t=e.entangledLanes))for(e=e.entanglements,t&=r;0<t;)o=1<<(n=31-Wt(t)),r|=e[n],t&=~o;return r}function zt(e){return 0!==(e=-1073741825&e.pendingLanes)?e:1073741824&e?1073741824:0}function Bt(e,t){switch(e){case 15:return 1;case 14:return 2;case 12:return 0===(e=Ut(24&~t))?Bt(10,t):e;case 10:return 0===(e=Ut(192&~t))?Bt(8,t):e;case 8:return 0===(e=Ut(3584&~t))&&(0===(e=Ut(4186112&~t))&&(e=512)),e;case 2:return 0===(t=Ut(805306368&~t))&&(t=268435456),t}throw Error(a(358,e))}function Ut(e){return e&-e}function Ht(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ft(e,t,n){e.pendingLanes|=t;var r=t-1;e.suspendedLanes&=r,e.pingedLanes&=r,(e=e.eventTimes)[t=31-Wt(t)]=n}var Wt=Math.clz32?Math.clz32:function(e){return 0===e?32:31-($t(e)/qt|0)|0},$t=Math.log,qt=Math.LN2;var Vt=i.unstable_UserBlockingPriority,Qt=i.unstable_runWithPriority,Kt=!0;function Yt(e,t,n,r){Re||De();var o=Gt,i=Re;Re=!0;try{je(o,e,t,n,r)}finally{(Re=i)||ze()}}function Xt(e,t,n,r){Qt(Vt,Gt.bind(null,e,t,n,r))}function Gt(e,t,n,r){var o;if(Kt)if((o=0==(4&t))&&0<it.length&&-1<pt.indexOf(e))e=dt(null,e,t,n,r),it.push(e);else{var i=Zt(e,t,n,r);if(null===i)o&&ht(e,r);else{if(o){if(-1<pt.indexOf(e))return e=dt(i,e,t,n,r),void it.push(e);if(function(e,t,n,r,o){switch(t){case"focusin":return at=mt(at,e,t,n,r,o),!0;case"dragenter":return st=mt(st,e,t,n,r,o),!0;case"mouseover":return lt=mt(lt,e,t,n,r,o),!0;case"pointerover":var i=o.pointerId;return ut.set(i,mt(ut.get(i)||null,e,t,n,r,o)),!0;case"gotpointercapture":return i=o.pointerId,ct.set(i,mt(ct.get(i)||null,e,t,n,r,o)),!0}return!1}(i,e,t,n,r))return;ht(e,r)}Lr(e,t,r,null,n)}}}function Zt(e,t,n,r){var o=Ce(r);if(null!==(o=Gr(o))){var i=Ye(o);if(null===i)o=null;else{var a=i.tag;if(13===a){if(null!==(o=Xe(i)))return o;o=null}else if(3===a){if(i.stateNode.hydrate)return 3===i.tag?i.stateNode.containerInfo:null;o=null}else i!==o&&(o=null)}}return Lr(e,t,r,o,n),null}var Jt=null,en=null,tn=null;function nn(){if(tn)return tn;var e,t,n=en,r=n.length,o="value"in Jt?Jt.value:Jt.textContent,i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var a=r-e;for(t=1;t<=a&&n[r-t]===o[i-t];t++);return tn=o.slice(e,1<t?1-t:void 0)}function rn(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}function on(){return!0}function an(){return!1}function sn(e){function t(t,n,r,o,i){for(var a in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=o,this.target=i,this.currentTarget=null,e)e.hasOwnProperty(a)&&(t=e[a],this[a]=t?t(o):o[a]);return this.isDefaultPrevented=(null!=o.defaultPrevented?o.defaultPrevented:!1===o.returnValue)?on:an,this.isPropagationStopped=an,this}return o(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=on)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=on)},persist:function(){},isPersistent:on}),t}var ln,un,cn,fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},pn=sn(fn),dn=o({},fn,{view:0,detail:0}),hn=sn(dn),mn=o({},dn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Sn,button:0,buttons:0,relatedTarget:function(e){return void 0===e.relatedTarget?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==cn&&(cn&&"mousemove"===e.type?(ln=e.screenX-cn.screenX,un=e.screenY-cn.screenY):un=ln=0,cn=e),ln)},movementY:function(e){return"movementY"in e?e.movementY:un}}),gn=sn(mn),vn=sn(o({},mn,{dataTransfer:0})),yn=sn(o({},dn,{relatedTarget:0})),bn=sn(o({},fn,{animationName:0,elapsedTime:0,pseudoElement:0})),wn=sn(o({},fn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}})),En=sn(o({},fn,{data:0})),xn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},_n={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kn={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=kn[e])&&!!t[e]}function Sn(){return Cn}var On=sn(o({},dn,{key:function(e){if(e.key){var t=xn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=rn(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?_n[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Sn,charCode:function(e){return"keypress"===e.type?rn(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?rn(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}})),Pn=sn(o({},mn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Tn=sn(o({},dn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Sn})),Ln=sn(o({},fn,{propertyName:0,elapsedTime:0,pseudoElement:0})),Nn=sn(o({},mn,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Mn=[9,13,27,32],jn=f&&"CompositionEvent"in window,Dn=null;f&&"documentMode"in document&&(Dn=document.documentMode);var An=f&&"TextEvent"in window&&!Dn,Rn=f&&(!jn||Dn&&8<Dn&&11>=Dn),In=String.fromCharCode(32),zn=!1;function Bn(e,t){switch(e){case"keyup":return-1!==Mn.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Un(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var Hn=!1;var Fn={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Fn[e.type]:"textarea"===t}function $n(e,t,n,r){Le(r),0<(t=Mr(t,"onChange")).length&&(n=new pn("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var qn=null,Vn=null;function Qn(e){kr(e,0)}function Kn(e){if(G(Jr(e)))return e}function Yn(e,t){if("change"===e)return t}var Xn=!1;if(f){var Gn;if(f){var Zn="oninput"in document;if(!Zn){var Jn=document.createElement("div");Jn.setAttribute("oninput","return;"),Zn="function"==typeof Jn.oninput}Gn=Zn}else Gn=!1;Xn=Gn&&(!document.documentMode||9<document.documentMode)}function er(){qn&&(qn.detachEvent("onpropertychange",tr),Vn=qn=null)}function tr(e){if("value"===e.propertyName&&Kn(Vn)){var t=[];if($n(t,Vn,e,Ce(e)),e=Qn,Re)e(t);else{Re=!0;try{Me(e,t)}finally{Re=!1,ze()}}}}function nr(e,t,n){"focusin"===e?(er(),Vn=n,(qn=t).attachEvent("onpropertychange",tr)):"focusout"===e&&er()}function rr(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Kn(Vn)}function or(e,t){if("click"===e)return Kn(t)}function ir(e,t){if("input"===e||"change"===e)return Kn(t)}var ar="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},sr=Object.prototype.hasOwnProperty;function lr(e,t){if(ar(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!sr.call(t,n[r])||!ar(e[n[r]],t[n[r]]))return!1;return!0}function ur(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function cr(e,t){var n,r=ur(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ur(r)}}function fr(){for(var e=window,t=Z();t instanceof e.HTMLIFrameElement;){try{var n="string"==typeof t.contentWindow.location.href}catch(e){n=!1}if(!n)break;t=Z((e=t.contentWindow).document)}return t}function pr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}var dr=f&&"documentMode"in document&&11>=document.documentMode,hr=null,mr=null,gr=null,vr=!1;function yr(e,t,n){var r=n.window===n?n.document:9===n.nodeType?n:n.ownerDocument;vr||null==hr||hr!==Z(r)||("selectionStart"in(r=hr)&&pr(r)?r={start:r.selectionStart,end:r.selectionEnd}:r={anchorNode:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection()).anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset},gr&&lr(gr,r)||(gr=r,0<(r=Mr(mr,"onSelect")).length&&(t=new pn("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=hr)))}Dt("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),0),Dt("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1),Dt(jt,2);for(var br="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),wr=0;wr<br.length;wr++)Mt.set(br[wr],0);c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Er="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xr=new Set("cancel close invalid load scroll toggle".split(" ").concat(Er));function _r(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,function(e,t,n,r,o,i,s,l,u){if(Ke.apply(this,arguments),We){if(!We)throw Error(a(198));var c=$e;We=!1,$e=null,qe||(qe=!0,Ve=c)}}(r,t,void 0,e),e.currentTarget=null}function kr(e,t){t=0!=(4&t);for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var a=r.length-1;0<=a;a--){var s=r[a],l=s.instance,u=s.currentTarget;if(s=s.listener,l!==i&&o.isPropagationStopped())break e;_r(o,s,u),i=l}else for(a=0;a<r.length;a++){if(l=(s=r[a]).instance,u=s.currentTarget,s=s.listener,l!==i&&o.isPropagationStopped())break e;_r(o,s,u),i=l}}}if(qe)throw e=Ve,qe=!1,Ve=null,e}function Cr(e,t){var n=to(t),r=e+"__bubble";n.has(r)||(Tr(t,e,2,!1),n.add(r))}var Sr="_reactListening"+Math.random().toString(36).slice(2);function Or(e){e[Sr]||(e[Sr]=!0,s.forEach((function(t){xr.has(t)||Pr(t,!1,e,null),Pr(t,!0,e,null)})))}function Pr(e,t,n,r){var o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,i=n;if("selectionchange"===e&&9!==n.nodeType&&(i=n.ownerDocument),null!==r&&!t&&xr.has(e)){if("scroll"!==e)return;o|=2,i=r}var a=to(i),s=e+"__"+(t?"capture":"bubble");a.has(s)||(t&&(o|=4),Tr(i,e,o,t),a.add(s))}function Tr(e,t,n,r){var o=Mt.get(t);switch(void 0===o?2:o){case 0:o=Yt;break;case 1:o=Xt;break;default:o=Gt}n=o.bind(null,t,n,e),o=void 0,!Ue||"touchstart"!==t&&"touchmove"!==t&&"wheel"!==t||(o=!0),r?void 0!==o?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):void 0!==o?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function Lr(e,t,n,r,o){var i=r;if(0==(1&t)&&0==(2&t)&&null!==r)e:for(;;){if(null===r)return;var a=r.tag;if(3===a||4===a){var s=r.stateNode.containerInfo;if(s===o||8===s.nodeType&&s.parentNode===o)break;if(4===a)for(a=r.return;null!==a;){var l=a.tag;if((3===l||4===l)&&((l=a.stateNode.containerInfo)===o||8===l.nodeType&&l.parentNode===o))return;a=a.return}for(;null!==s;){if(null===(a=Gr(s)))return;if(5===(l=a.tag)||6===l){r=i=a;continue e}s=s.parentNode}}r=r.return}!function(e,t,n){if(Ie)return e(t,n);Ie=!0;try{Ae(e,t,n)}finally{Ie=!1,ze()}}((function(){var r=i,o=Ce(n),a=[];e:{var s=Nt.get(e);if(void 0!==s){var l=pn,u=e;switch(e){case"keypress":if(0===rn(n))break e;case"keydown":case"keyup":l=On;break;case"focusin":u="focus",l=yn;break;case"focusout":u="blur",l=yn;break;case"beforeblur":case"afterblur":l=yn;break;case"click":if(2===n.button)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":l=gn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":l=vn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":l=Tn;break;case Ot:case Pt:case Tt:l=bn;break;case Lt:l=Ln;break;case"scroll":l=hn;break;case"wheel":l=Nn;break;case"copy":case"cut":case"paste":l=wn;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":l=Pn}var c=0!=(4&t),f=!c&&"scroll"===e,p=c?null!==s?s+"Capture":null:s;c=[];for(var d,h=r;null!==h;){var m=(d=h).stateNode;if(5===d.tag&&null!==m&&(d=m,null!==p&&(null!=(m=Be(h,p))&&c.push(Nr(h,m,d)))),f)break;h=h.return}0<c.length&&(s=new l(s,u,null,n,o),a.push({event:s,listeners:c}))}}if(0==(7&t)){if(l="mouseout"===e||"pointerout"===e,(!(s="mouseover"===e||"pointerover"===e)||0!=(16&t)||!(u=n.relatedTarget||n.fromElement)||!Gr(u)&&!u[Yr])&&(l||s)&&(s=o.window===o?o:(s=o.ownerDocument)?s.defaultView||s.parentWindow:window,l?(l=r,null!==(u=(u=n.relatedTarget||n.toElement)?Gr(u):null)&&(u!==(f=Ye(u))||5!==u.tag&&6!==u.tag)&&(u=null)):(l=null,u=r),l!==u)){if(c=gn,m="onMouseLeave",p="onMouseEnter",h="mouse","pointerout"!==e&&"pointerover"!==e||(c=Pn,m="onPointerLeave",p="onPointerEnter",h="pointer"),f=null==l?s:Jr(l),d=null==u?s:Jr(u),(s=new c(m,h+"leave",l,n,o)).target=f,s.relatedTarget=d,m=null,Gr(o)===r&&((c=new c(p,h+"enter",u,n,o)).target=d,c.relatedTarget=f,m=c),f=m,l&&u)e:{for(p=u,h=0,d=c=l;d;d=jr(d))h++;for(d=0,m=p;m;m=jr(m))d++;for(;0<h-d;)c=jr(c),h--;for(;0<d-h;)p=jr(p),d--;for(;h--;){if(c===p||null!==p&&c===p.alternate)break e;c=jr(c),p=jr(p)}c=null}else c=null;null!==l&&Dr(a,s,l,c,!1),null!==u&&null!==f&&Dr(a,f,u,c,!0)}if("select"===(l=(s=r?Jr(r):window).nodeName&&s.nodeName.toLowerCase())||"input"===l&&"file"===s.type)var g=Yn;else if(Wn(s))if(Xn)g=ir;else{g=rr;var v=nr}else(l=s.nodeName)&&"input"===l.toLowerCase()&&("checkbox"===s.type||"radio"===s.type)&&(g=or);switch(g&&(g=g(e,r))?$n(a,g,n,o):(v&&v(e,s,r),"focusout"===e&&(v=s._wrapperState)&&v.controlled&&"number"===s.type&&oe(s,"number",s.value)),v=r?Jr(r):window,e){case"focusin":(Wn(v)||"true"===v.contentEditable)&&(hr=v,mr=r,gr=null);break;case"focusout":gr=mr=hr=null;break;case"mousedown":vr=!0;break;case"contextmenu":case"mouseup":case"dragend":vr=!1,yr(a,n,o);break;case"selectionchange":if(dr)break;case"keydown":case"keyup":yr(a,n,o)}var y;if(jn)e:{switch(e){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else Hn?Bn(e,n)&&(b="onCompositionEnd"):"keydown"===e&&229===n.keyCode&&(b="onCompositionStart");b&&(Rn&&"ko"!==n.locale&&(Hn||"onCompositionStart"!==b?"onCompositionEnd"===b&&Hn&&(y=nn()):(en="value"in(Jt=o)?Jt.value:Jt.textContent,Hn=!0)),0<(v=Mr(r,b)).length&&(b=new En(b,e,null,n,o),a.push({event:b,listeners:v}),y?b.data=y:null!==(y=Un(n))&&(b.data=y))),(y=An?function(e,t){switch(e){case"compositionend":return Un(t);case"keypress":return 32!==t.which?null:(zn=!0,In);case"textInput":return(e=t.data)===In&&zn?null:e;default:return null}}(e,n):function(e,t){if(Hn)return"compositionend"===e||!jn&&Bn(e,t)?(e=nn(),tn=en=Jt=null,Hn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Rn&&"ko"!==t.locale?null:t.data;default:return null}}(e,n))&&(0<(r=Mr(r,"onBeforeInput")).length&&(o=new En("onBeforeInput","beforeinput",null,n,o),a.push({event:o,listeners:r}),o.data=y))}kr(a,t)}))}function Nr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Mr(e,t){for(var n=t+"Capture",r=[];null!==e;){var o=e,i=o.stateNode;5===o.tag&&null!==i&&(o=i,null!=(i=Be(e,n))&&r.unshift(Nr(e,i,o)),null!=(i=Be(e,t))&&r.push(Nr(e,i,o))),e=e.return}return r}function jr(e){if(null===e)return null;do{e=e.return}while(e&&5!==e.tag);return e||null}function Dr(e,t,n,r,o){for(var i=t._reactName,a=[];null!==n&&n!==r;){var s=n,l=s.alternate,u=s.stateNode;if(null!==l&&l===r)break;5===s.tag&&null!==u&&(s=u,o?null!=(l=Be(n,i))&&a.unshift(Nr(n,l,s)):o||null!=(l=Be(n,i))&&a.push(Nr(n,l,s))),n=n.return}0!==a.length&&e.push({event:t,listeners:a})}function Ar(){}var Rr=null,Ir=null;function zr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function Br(e,t){return"textarea"===e||"option"===e||"noscript"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&null!=t.dangerouslySetInnerHTML.__html}var Ur="function"==typeof setTimeout?setTimeout:void 0,Hr="function"==typeof clearTimeout?clearTimeout:void 0;function Fr(e){1===e.nodeType?e.textContent="":9===e.nodeType&&(null!=(e=e.body)&&(e.textContent=""))}function Wr(e){for(;null!=e;e=e.nextSibling){var t=e.nodeType;if(1===t||3===t)break}return e}function $r(e){e=e.previousSibling;for(var t=0;e;){if(8===e.nodeType){var n=e.data;if("$"===n||"$!"===n||"$?"===n){if(0===t)return e;t--}else"/$"===n&&t++}e=e.previousSibling}return null}var qr=0;var Vr=Math.random().toString(36).slice(2),Qr="__reactFiber$"+Vr,Kr="__reactProps$"+Vr,Yr="__reactContainer$"+Vr,Xr="__reactEvents$"+Vr;function Gr(e){var t=e[Qr];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Yr]||n[Qr]){if(n=t.alternate,null!==t.child||null!==n&&null!==n.child)for(e=$r(e);null!==e;){if(n=e[Qr])return n;e=$r(e)}return t}n=(e=n).parentNode}return null}function Zr(e){return!(e=e[Qr]||e[Yr])||5!==e.tag&&6!==e.tag&&13!==e.tag&&3!==e.tag?null:e}function Jr(e){if(5===e.tag||6===e.tag)return e.stateNode;throw Error(a(33))}function eo(e){return e[Kr]||null}function to(e){var t=e[Xr];return void 0===t&&(t=e[Xr]=new Set),t}var no=[],ro=-1;function oo(e){return{current:e}}function io(e){0>ro||(e.current=no[ro],no[ro]=null,ro--)}function ao(e,t){ro++,no[ro]=e.current,e.current=t}var so={},lo=oo(so),uo=oo(!1),co=so;function fo(e,t){var n=e.type.contextTypes;if(!n)return so;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,i={};for(o in n)i[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function po(e){return null!=(e=e.childContextTypes)}function ho(){io(uo),io(lo)}function mo(e,t,n){if(lo.current!==so)throw Error(a(168));ao(lo,t),ao(uo,n)}function go(e,t,n){var r=e.stateNode;if(e=t.childContextTypes,"function"!=typeof r.getChildContext)return n;for(var i in r=r.getChildContext())if(!(i in e))throw Error(a(108,Q(t)||"Unknown",i));return o({},n,r)}function vo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||so,co=lo.current,ao(lo,e),ao(uo,uo.current),!0}function yo(e,t,n){var r=e.stateNode;if(!r)throw Error(a(169));n?(e=go(e,t,co),r.__reactInternalMemoizedMergedChildContext=e,io(uo),io(lo),ao(lo,e)):io(uo),ao(uo,n)}var bo=null,wo=null,Eo=i.unstable_runWithPriority,xo=i.unstable_scheduleCallback,_o=i.unstable_cancelCallback,ko=i.unstable_shouldYield,Co=i.unstable_requestPaint,So=i.unstable_now,Oo=i.unstable_getCurrentPriorityLevel,Po=i.unstable_ImmediatePriority,To=i.unstable_UserBlockingPriority,Lo=i.unstable_NormalPriority,No=i.unstable_LowPriority,Mo=i.unstable_IdlePriority,jo={},Do=void 0!==Co?Co:function(){},Ao=null,Ro=null,Io=!1,zo=So(),Bo=1e4>zo?So:function(){return So()-zo};function Uo(){switch(Oo()){case Po:return 99;case To:return 98;case Lo:return 97;case No:return 96;case Mo:return 95;default:throw Error(a(332))}}function Ho(e){switch(e){case 99:return Po;case 98:return To;case 97:return Lo;case 96:return No;case 95:return Mo;default:throw Error(a(332))}}function Fo(e,t){return e=Ho(e),Eo(e,t)}function Wo(e,t,n){return e=Ho(e),xo(e,t,n)}function $o(){if(null!==Ro){var e=Ro;Ro=null,_o(e)}qo()}function qo(){if(!Io&&null!==Ao){Io=!0;var e=0;try{var t=Ao;Fo(99,(function(){for(;e<t.length;e++){var n=t[e];do{n=n(!0)}while(null!==n)}})),Ao=null}catch(t){throw null!==Ao&&(Ao=Ao.slice(e+1)),xo(Po,$o),t}finally{Io=!1}}}var Vo=E.ReactCurrentBatchConfig;function Qo(e,t){if(e&&e.defaultProps){for(var n in t=o({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}return t}var Ko=oo(null),Yo=null,Xo=null,Go=null;function Zo(){Go=Xo=Yo=null}function Jo(e){var t=Ko.current;io(Ko),e.type._context._currentValue=t}function ei(e,t){for(;null!==e;){var n=e.alternate;if((e.childLanes&t)===t){if(null===n||(n.childLanes&t)===t)break;n.childLanes|=t}else e.childLanes|=t,null!==n&&(n.childLanes|=t);e=e.return}}function ti(e,t){Yo=e,Go=Xo=null,null!==(e=e.dependencies)&&null!==e.firstContext&&(0!=(e.lanes&t)&&(Ma=!0),e.firstContext=null)}function ni(e,t){if(Go!==e&&!1!==t&&0!==t)if("number"==typeof t&&1073741823!==t||(Go=e,t=1073741823),t={context:e,observedBits:t,next:null},null===Xo){if(null===Yo)throw Error(a(308));Xo=t,Yo.dependencies={lanes:0,firstContext:t,responders:null}}else Xo=Xo.next=t;return e._currentValue}var ri=!1;function oi(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}function ii(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function ai(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function si(e,t){if(null!==(e=e.updateQueue)){var n=(e=e.shared).pending;null===n?t.next=t:(t.next=n.next,n.next=t),e.pending=t}}function li(e,t){var n=e.updateQueue,r=e.alternate;if(null!==r&&n===(r=r.updateQueue)){var o=null,i=null;if(null!==(n=n.firstBaseUpdate)){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};null===i?o=i=a:i=i.next=a,n=n.next}while(null!==n);null===i?o=i=t:i=i.next=t}else o=i=t;return n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:i,shared:r.shared,effects:r.effects},void(e.updateQueue=n)}null===(e=n.lastBaseUpdate)?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ui(e,t,n,r){var i=e.updateQueue;ri=!1;var a=i.firstBaseUpdate,s=i.lastBaseUpdate,l=i.shared.pending;if(null!==l){i.shared.pending=null;var u=l,c=u.next;u.next=null,null===s?a=c:s.next=c,s=u;var f=e.alternate;if(null!==f){var p=(f=f.updateQueue).lastBaseUpdate;p!==s&&(null===p?f.firstBaseUpdate=c:p.next=c,f.lastBaseUpdate=u)}}if(null!==a){for(p=i.baseState,s=0,f=c=u=null;;){l=a.lane;var d=a.eventTime;if((r&l)===l){null!==f&&(f=f.next={eventTime:d,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var h=e,m=a;switch(l=t,d=n,m.tag){case 1:if("function"==typeof(h=m.payload)){p=h.call(d,p,l);break e}p=h;break e;case 3:h.flags=-4097&h.flags|64;case 0:if(null==(l="function"==typeof(h=m.payload)?h.call(d,p,l):h))break e;p=o({},p,l);break e;case 2:ri=!0}}null!==a.callback&&(e.flags|=32,null===(l=i.effects)?i.effects=[a]:l.push(a))}else d={eventTime:d,lane:l,tag:a.tag,payload:a.payload,callback:a.callback,next:null},null===f?(c=f=d,u=p):f=f.next=d,s|=l;if(null===(a=a.next)){if(null===(l=i.shared.pending))break;a=l.next,l.next=null,i.lastBaseUpdate=l,i.shared.pending=null}}null===f&&(u=p),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=f,Ds|=s,e.lanes=s,e.memoizedState=p}}function ci(e,t,n){if(e=t.effects,t.effects=null,null!==e)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(null!==o){if(r.callback=null,r=n,"function"!=typeof o)throw Error(a(191,o));o.call(r)}}}var fi=(new r.Component).refs;function pi(e,t,n,r){n=null==(n=n(r,t=e.memoizedState))?t:o({},t,n),e.memoizedState=n,0===e.lanes&&(e.updateQueue.baseState=n)}var di={isMounted:function(e){return!!(e=e._reactInternals)&&Ye(e)===e},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=il(),o=al(e),i=ai(r,o);i.payload=t,null!=n&&(i.callback=n),si(e,i),sl(e,o,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=il(),o=al(e),i=ai(r,o);i.tag=1,i.payload=t,null!=n&&(i.callback=n),si(e,i),sl(e,o,r)},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=il(),r=al(e),o=ai(n,r);o.tag=2,null!=t&&(o.callback=t),si(e,o),sl(e,r,n)}};function hi(e,t,n,r,o,i,a){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,i,a):!t.prototype||!t.prototype.isPureReactComponent||(!lr(n,r)||!lr(o,i))}function mi(e,t,n){var r=!1,o=so,i=t.contextType;return"object"==typeof i&&null!==i?i=ni(i):(o=po(t)?co:lo.current,i=(r=null!=(r=t.contextTypes))?fo(e,o):so),t=new t(n,i),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=di,e.stateNode=t,t._reactInternals=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=i),t}function gi(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&di.enqueueReplaceState(t,t.state,null)}function vi(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs=fi,oi(e);var i=t.contextType;"object"==typeof i&&null!==i?o.context=ni(i):(i=po(t)?co:lo.current,o.context=fo(e,i)),ui(e,n,o,r),o.state=e.memoizedState,"function"==typeof(i=t.getDerivedStateFromProps)&&(pi(e,t,i,n),o.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(t=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),t!==o.state&&di.enqueueReplaceState(o,o.state,null),ui(e,n,o,r),o.state=e.memoizedState),"function"==typeof o.componentDidMount&&(e.flags|=4)}var yi=Array.isArray;function bi(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){if(n=n._owner){if(1!==n.tag)throw Error(a(309));var r=n.stateNode}if(!r)throw Error(a(147,e));var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs;t===fi&&(t=r.refs={}),null===e?delete t[o]:t[o]=e})._stringRef=o,t)}if("string"!=typeof e)throw Error(a(284));if(!n._owner)throw Error(a(290,e))}return e}function wi(e,t){if("textarea"!==e.type)throw Error(a(31,"[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t))}function Ei(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.flags=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t){return(e=Bl(e,t)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.flags=2,n):r:(t.flags=2,n):n}function s(t){return e&&null===t.alternate&&(t.flags=2),t}function l(e,t,n,r){return null===t||6!==t.tag?((t=Wl(n,e.mode,r)).return=e,t):((t=o(t,n)).return=e,t)}function u(e,t,n,r){return null!==t&&t.elementType===n.type?((r=o(t,n.props)).ref=bi(e,t,n),r.return=e,r):((r=Ul(n.type,n.key,n.props,null,e.mode,r)).ref=bi(e,t,n),r.return=e,r)}function c(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=$l(n,e.mode,r)).return=e,t):((t=o(t,n.children||[])).return=e,t)}function f(e,t,n,r,i){return null===t||7!==t.tag?((t=Hl(n,e.mode,r,i)).return=e,t):((t=o(t,n)).return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Wl(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case x:return(n=Ul(t.type,t.key,t.props,null,e.mode,n)).ref=bi(e,null,t),n.return=e,n;case _:return(t=$l(t,e.mode,n)).return=e,t}if(yi(t)||F(t))return(t=Hl(t,e.mode,n,null)).return=e,t;wi(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case x:return n.key===o?n.type===k?f(e,t,n.props.children,r,o):u(e,t,n,r):null;case _:return n.key===o?c(e,t,n,r):null}if(yi(n)||F(n))return null!==o?null:f(e,t,n,r,null);wi(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return l(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case x:return e=e.get(null===r.key?n:r.key)||null,r.type===k?f(t,e,r.props.children,o,r.key):u(t,e,r,o);case _:return c(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(yi(r)||F(r))return f(t,e=e.get(n)||null,r,o,null);wi(t,r)}return null}function m(o,a,s,l){for(var u=null,c=null,f=a,m=a=0,g=null;null!==f&&m<s.length;m++){f.index>m?(g=f,f=null):g=f.sibling;var v=d(o,f,s[m],l);if(null===v){null===f&&(f=g);break}e&&f&&null===v.alternate&&t(o,f),a=i(v,a,m),null===c?u=v:c.sibling=v,c=v,f=g}if(m===s.length)return n(o,f),u;if(null===f){for(;m<s.length;m++)null!==(f=p(o,s[m],l))&&(a=i(f,a,m),null===c?u=f:c.sibling=f,c=f);return u}for(f=r(o,f);m<s.length;m++)null!==(g=h(f,o,m,s[m],l))&&(e&&null!==g.alternate&&f.delete(null===g.key?m:g.key),a=i(g,a,m),null===c?u=g:c.sibling=g,c=g);return e&&f.forEach((function(e){return t(o,e)})),u}function g(o,s,l,u){var c=F(l);if("function"!=typeof c)throw Error(a(150));if(null==(l=c.call(l)))throw Error(a(151));for(var f=c=null,m=s,g=s=0,v=null,y=l.next();null!==m&&!y.done;g++,y=l.next()){m.index>g?(v=m,m=null):v=m.sibling;var b=d(o,m,y.value,u);if(null===b){null===m&&(m=v);break}e&&m&&null===b.alternate&&t(o,m),s=i(b,s,g),null===f?c=b:f.sibling=b,f=b,m=v}if(y.done)return n(o,m),c;if(null===m){for(;!y.done;g++,y=l.next())null!==(y=p(o,y.value,u))&&(s=i(y,s,g),null===f?c=y:f.sibling=y,f=y);return c}for(m=r(o,m);!y.done;g++,y=l.next())null!==(y=h(m,o,g,y.value,u))&&(e&&null!==y.alternate&&m.delete(null===y.key?g:y.key),s=i(y,s,g),null===f?c=y:f.sibling=y,f=y);return e&&m.forEach((function(e){return t(o,e)})),c}return function(e,r,i,l){var u="object"==typeof i&&null!==i&&i.type===k&&null===i.key;u&&(i=i.props.children);var c="object"==typeof i&&null!==i;if(c)switch(i.$$typeof){case x:e:{for(c=i.key,u=r;null!==u;){if(u.key===c){switch(u.tag){case 7:if(i.type===k){n(e,u.sibling),(r=o(u,i.props.children)).return=e,e=r;break e}break;default:if(u.elementType===i.type){n(e,u.sibling),(r=o(u,i.props)).ref=bi(e,u,i),r.return=e,e=r;break e}}n(e,u);break}t(e,u),u=u.sibling}i.type===k?((r=Hl(i.props.children,e.mode,l,i.key)).return=e,e=r):((l=Ul(i.type,i.key,i.props,null,e.mode,l)).ref=bi(e,r,i),l.return=e,e=l)}return s(e);case _:e:{for(u=i.key;null!==r;){if(r.key===u){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=o(r,i.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=$l(i,e.mode,l)).return=e,e=r}return s(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,i)).return=e,e=r):(n(e,r),(r=Wl(i,e.mode,l)).return=e,e=r),s(e);if(yi(i))return m(e,r,i,l);if(F(i))return g(e,r,i,l);if(c&&wi(e,i),void 0===i&&!u)switch(e.tag){case 1:case 22:case 0:case 11:case 15:throw Error(a(152,Q(e.type)||"Component"))}return n(e,r)}}var xi=Ei(!0),_i=Ei(!1),ki={},Ci=oo(ki),Si=oo(ki),Oi=oo(ki);function Pi(e){if(e===ki)throw Error(a(174));return e}function Ti(e,t){switch(ao(Oi,t),ao(Si,e),ao(Ci,ki),e=t.nodeType){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:he(null,"");break;default:t=he(t=(e=8===e?t.parentNode:t).namespaceURI||null,e=e.tagName)}io(Ci),ao(Ci,t)}function Li(){io(Ci),io(Si),io(Oi)}function Ni(e){Pi(Oi.current);var t=Pi(Ci.current),n=he(t,e.type);t!==n&&(ao(Si,e),ao(Ci,n))}function Mi(e){Si.current===e&&(io(Ci),io(Si))}var ji=oo(0);function Di(e){for(var t=e;null!==t;){if(13===t.tag){var n=t.memoizedState;if(null!==n&&(null===(n=n.dehydrated)||"$?"===n.data||"$!"===n.data))return t}else if(19===t.tag&&void 0!==t.memoizedProps.revealOrder){if(0!=(64&t.flags))return t}else if(null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ai=null,Ri=null,Ii=!1;function zi(e,t){var n=Il(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.flags=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function Bi(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);case 13:default:return!1}}function Ui(e){if(Ii){var t=Ri;if(t){var n=t;if(!Bi(e,t)){if(!(t=Wr(n.nextSibling))||!Bi(e,t))return e.flags=-1025&e.flags|2,Ii=!1,void(Ai=e);zi(Ai,n)}Ai=e,Ri=Wr(t.firstChild)}else e.flags=-1025&e.flags|2,Ii=!1,Ai=e}}function Hi(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&13!==e.tag;)e=e.return;Ai=e}function Fi(e){if(e!==Ai)return!1;if(!Ii)return Hi(e),Ii=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!Br(t,e.memoizedProps))for(t=Ri;t;)zi(e,t),t=Wr(t.nextSibling);if(Hi(e),13===e.tag){if(!(e=null!==(e=e.memoizedState)?e.dehydrated:null))throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(8===e.nodeType){var n=e.data;if("/$"===n){if(0===t){Ri=Wr(e.nextSibling);break e}t--}else"$"!==n&&"$!"!==n&&"$?"!==n||t++}e=e.nextSibling}Ri=null}}else Ri=Ai?Wr(e.stateNode.nextSibling):null;return!0}function Wi(){Ri=Ai=null,Ii=!1}var $i=[];function qi(){for(var e=0;e<$i.length;e++)$i[e]._workInProgressVersionPrimary=null;$i.length=0}var Vi=E.ReactCurrentDispatcher,Qi=E.ReactCurrentBatchConfig,Ki=0,Yi=null,Xi=null,Gi=null,Zi=!1,Ji=!1;function ea(){throw Error(a(321))}function ta(e,t){if(null===t)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ar(e[n],t[n]))return!1;return!0}function na(e,t,n,r,o,i){if(Ki=i,Yi=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Vi.current=null===e||null===e.memoizedState?Pa:Ta,e=n(r,o),Ji){i=0;do{if(Ji=!1,!(25>i))throw Error(a(301));i+=1,Gi=Xi=null,t.updateQueue=null,Vi.current=La,e=n(r,o)}while(Ji)}if(Vi.current=Oa,t=null!==Xi&&null!==Xi.next,Ki=0,Gi=Xi=Yi=null,Zi=!1,t)throw Error(a(300));return e}function ra(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return null===Gi?Yi.memoizedState=Gi=e:Gi=Gi.next=e,Gi}function oa(){if(null===Xi){var e=Yi.alternate;e=null!==e?e.memoizedState:null}else e=Xi.next;var t=null===Gi?Yi.memoizedState:Gi.next;if(null!==t)Gi=t,Xi=e;else{if(null===e)throw Error(a(310));e={memoizedState:(Xi=e).memoizedState,baseState:Xi.baseState,baseQueue:Xi.baseQueue,queue:Xi.queue,next:null},null===Gi?Yi.memoizedState=Gi=e:Gi=Gi.next=e}return Gi}function ia(e,t){return"function"==typeof t?t(e):t}function aa(e){var t=oa(),n=t.queue;if(null===n)throw Error(a(311));n.lastRenderedReducer=e;var r=Xi,o=r.baseQueue,i=n.pending;if(null!==i){if(null!==o){var s=o.next;o.next=i.next,i.next=s}r.baseQueue=o=i,n.pending=null}if(null!==o){o=o.next,r=r.baseState;var l=s=i=null,u=o;do{var c=u.lane;if((Ki&c)===c)null!==l&&(l=l.next={lane:0,action:u.action,eagerReducer:u.eagerReducer,eagerState:u.eagerState,next:null}),r=u.eagerReducer===e?u.eagerState:e(r,u.action);else{var f={lane:c,action:u.action,eagerReducer:u.eagerReducer,eagerState:u.eagerState,next:null};null===l?(s=l=f,i=r):l=l.next=f,Yi.lanes|=c,Ds|=c}u=u.next}while(null!==u&&u!==o);null===l?i=r:l.next=s,ar(r,t.memoizedState)||(Ma=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=l,n.lastRenderedState=r}return[t.memoizedState,n.dispatch]}function sa(e){var t=oa(),n=t.queue;if(null===n)throw Error(a(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,i=t.memoizedState;if(null!==o){n.pending=null;var s=o=o.next;do{i=e(i,s.action),s=s.next}while(s!==o);ar(i,t.memoizedState)||(Ma=!0),t.memoizedState=i,null===t.baseQueue&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function la(e,t,n){var r=t._getVersion;r=r(t._source);var o=t._workInProgressVersionPrimary;if(null!==o?e=o===r:(e=e.mutableReadLanes,(e=(Ki&e)===e)&&(t._workInProgressVersionPrimary=r,$i.push(t))),e)return n(t._source);throw $i.push(t),Error(a(350))}function ua(e,t,n,r){var o=Ss;if(null===o)throw Error(a(349));var i=t._getVersion,s=i(t._source),l=Vi.current,u=l.useState((function(){return la(o,t,n)})),c=u[1],f=u[0];u=Gi;var p=e.memoizedState,d=p.refs,h=d.getSnapshot,m=p.source;p=p.subscribe;var g=Yi;return e.memoizedState={refs:d,source:t,subscribe:r},l.useEffect((function(){d.getSnapshot=n,d.setSnapshot=c;var e=i(t._source);if(!ar(s,e)){e=n(t._source),ar(f,e)||(c(e),e=al(g),o.mutableReadLanes|=e&o.pendingLanes),e=o.mutableReadLanes,o.entangledLanes|=e;for(var r=o.entanglements,a=e;0<a;){var l=31-Wt(a),u=1<<l;r[l]|=e,a&=~u}}}),[n,t,r]),l.useEffect((function(){return r(t._source,(function(){var e=d.getSnapshot,n=d.setSnapshot;try{n(e(t._source));var r=al(g);o.mutableReadLanes|=r&o.pendingLanes}catch(e){n((function(){throw e}))}}))}),[t,r]),ar(h,n)&&ar(m,t)&&ar(p,r)||((e={pending:null,dispatch:null,lastRenderedReducer:ia,lastRenderedState:f}).dispatch=c=Sa.bind(null,Yi,e),u.queue=e,u.baseQueue=null,f=la(o,t,n),u.memoizedState=u.baseState=f),f}function ca(e,t,n){return ua(oa(),e,t,n)}function fa(e){var t=ra();return"function"==typeof e&&(e=e()),t.memoizedState=t.baseState=e,e=(e=t.queue={pending:null,dispatch:null,lastRenderedReducer:ia,lastRenderedState:e}).dispatch=Sa.bind(null,Yi,e),[t.memoizedState,e]}function pa(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},null===(t=Yi.updateQueue)?(t={lastEffect:null},Yi.updateQueue=t,t.lastEffect=e.next=e):null===(n=t.lastEffect)?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function da(e){return e={current:e},ra().memoizedState=e}function ha(){return oa().memoizedState}function ma(e,t,n,r){var o=ra();Yi.flags|=e,o.memoizedState=pa(1|t,n,void 0,void 0===r?null:r)}function ga(e,t,n,r){var o=oa();r=void 0===r?null:r;var i=void 0;if(null!==Xi){var a=Xi.memoizedState;if(i=a.destroy,null!==r&&ta(r,a.deps))return void pa(t,n,i,r)}Yi.flags|=e,o.memoizedState=pa(1|t,n,i,r)}function va(e,t){return ma(516,4,e,t)}function ya(e,t){return ga(516,4,e,t)}function ba(e,t){return ga(4,2,e,t)}function wa(e,t){return"function"==typeof t?(e=e(),t(e),function(){t(null)}):null!=t?(e=e(),t.current=e,function(){t.current=null}):void 0}function Ea(e,t,n){return n=null!=n?n.concat([e]):null,ga(4,2,wa.bind(null,t,e),n)}function xa(){}function _a(e,t){var n=oa();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&ta(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ka(e,t){var n=oa();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&ta(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ca(e,t){var n=Uo();Fo(98>n?98:n,(function(){e(!0)})),Fo(97<n?97:n,(function(){var n=Qi.transition;Qi.transition=1;try{e(!1),t()}finally{Qi.transition=n}}))}function Sa(e,t,n){var r=il(),o=al(e),i={lane:o,action:n,eagerReducer:null,eagerState:null,next:null},a=t.pending;if(null===a?i.next=i:(i.next=a.next,a.next=i),t.pending=i,a=e.alternate,e===Yi||null!==a&&a===Yi)Ji=Zi=!0;else{if(0===e.lanes&&(null===a||0===a.lanes)&&null!==(a=t.lastRenderedReducer))try{var s=t.lastRenderedState,l=a(s,n);if(i.eagerReducer=a,i.eagerState=l,ar(l,s))return}catch(e){}sl(e,o,r)}}var Oa={readContext:ni,useCallback:ea,useContext:ea,useEffect:ea,useImperativeHandle:ea,useLayoutEffect:ea,useMemo:ea,useReducer:ea,useRef:ea,useState:ea,useDebugValue:ea,useDeferredValue:ea,useTransition:ea,useMutableSource:ea,useOpaqueIdentifier:ea,unstable_isNewReconciler:!1},Pa={readContext:ni,useCallback:function(e,t){return ra().memoizedState=[e,void 0===t?null:t],e},useContext:ni,useEffect:va,useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,ma(4,2,wa.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ma(4,2,e,t)},useMemo:function(e,t){var n=ra();return t=void 0===t?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=ra();return t=void 0!==n?n(t):t,r.memoizedState=r.baseState=t,e=(e=r.queue={pending:null,dispatch:null,lastRenderedReducer:e,lastRenderedState:t}).dispatch=Sa.bind(null,Yi,e),[r.memoizedState,e]},useRef:da,useState:fa,useDebugValue:xa,useDeferredValue:function(e){var t=fa(e),n=t[0],r=t[1];return va((function(){var t=Qi.transition;Qi.transition=1;try{r(e)}finally{Qi.transition=t}}),[e]),n},useTransition:function(){var e=fa(!1),t=e[0];return da(e=Ca.bind(null,e[1])),[e,t]},useMutableSource:function(e,t,n){var r=ra();return r.memoizedState={refs:{getSnapshot:t,setSnapshot:null},source:e,subscribe:n},ua(r,e,t,n)},useOpaqueIdentifier:function(){if(Ii){var e=!1,t=function(e){return{$$typeof:A,toString:e,valueOf:e}}((function(){throw e||(e=!0,n("r:"+(qr++).toString(36))),Error(a(355))})),n=fa(t)[1];return 0==(2&Yi.mode)&&(Yi.flags|=516,pa(5,(function(){n("r:"+(qr++).toString(36))}),void 0,null)),t}return fa(t="r:"+(qr++).toString(36)),t},unstable_isNewReconciler:!1},Ta={readContext:ni,useCallback:_a,useContext:ni,useEffect:ya,useImperativeHandle:Ea,useLayoutEffect:ba,useMemo:ka,useReducer:aa,useRef:ha,useState:function(){return aa(ia)},useDebugValue:xa,useDeferredValue:function(e){var t=aa(ia),n=t[0],r=t[1];return ya((function(){var t=Qi.transition;Qi.transition=1;try{r(e)}finally{Qi.transition=t}}),[e]),n},useTransition:function(){var e=aa(ia)[0];return[ha().current,e]},useMutableSource:ca,useOpaqueIdentifier:function(){return aa(ia)[0]},unstable_isNewReconciler:!1},La={readContext:ni,useCallback:_a,useContext:ni,useEffect:ya,useImperativeHandle:Ea,useLayoutEffect:ba,useMemo:ka,useReducer:sa,useRef:ha,useState:function(){return sa(ia)},useDebugValue:xa,useDeferredValue:function(e){var t=sa(ia),n=t[0],r=t[1];return ya((function(){var t=Qi.transition;Qi.transition=1;try{r(e)}finally{Qi.transition=t}}),[e]),n},useTransition:function(){var e=sa(ia)[0];return[ha().current,e]},useMutableSource:ca,useOpaqueIdentifier:function(){return sa(ia)[0]},unstable_isNewReconciler:!1},Na=E.ReactCurrentOwner,Ma=!1;function ja(e,t,n,r){t.child=null===e?_i(t,null,n,r):xi(t,e.child,n,r)}function Da(e,t,n,r,o){n=n.render;var i=t.ref;return ti(t,o),r=na(e,t,n,r,i,o),null===e||Ma?(t.flags|=1,ja(e,t,r,o),t.child):(t.updateQueue=e.updateQueue,t.flags&=-517,e.lanes&=~o,es(e,t,o))}function Aa(e,t,n,r,o,i){if(null===e){var a=n.type;return"function"!=typeof a||zl(a)||void 0!==a.defaultProps||null!==n.compare||void 0!==n.defaultProps?((e=Ul(n.type,null,r,t,t.mode,i)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=a,Ra(e,t,a,r,o,i))}return a=e.child,0==(o&i)&&(o=a.memoizedProps,(n=null!==(n=n.compare)?n:lr)(o,r)&&e.ref===t.ref)?es(e,t,i):(t.flags|=1,(e=Bl(a,r)).ref=t.ref,e.return=t,t.child=e)}function Ra(e,t,n,r,o,i){if(null!==e&&lr(e.memoizedProps,r)&&e.ref===t.ref){if(Ma=!1,0==(i&o))return t.lanes=e.lanes,es(e,t,i);0!=(16384&e.flags)&&(Ma=!0)}return Ba(e,t,n,r,i)}function Ia(e,t,n){var r=t.pendingProps,o=r.children,i=null!==e?e.memoizedState:null;if("hidden"===r.mode||"unstable-defer-without-hiding"===r.mode)if(0==(4&t.mode))t.memoizedState={baseLanes:0},ml(t,n);else{if(0==(1073741824&n))return e=null!==i?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e},ml(t,e),null;t.memoizedState={baseLanes:0},ml(t,null!==i?i.baseLanes:n)}else null!==i?(r=i.baseLanes|n,t.memoizedState=null):r=n,ml(t,r);return ja(e,t,o,n),t.child}function za(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.flags|=128)}function Ba(e,t,n,r,o){var i=po(n)?co:lo.current;return i=fo(t,i),ti(t,o),n=na(e,t,n,r,i,o),null===e||Ma?(t.flags|=1,ja(e,t,n,o),t.child):(t.updateQueue=e.updateQueue,t.flags&=-517,e.lanes&=~o,es(e,t,o))}function Ua(e,t,n,r,o){if(po(n)){var i=!0;vo(t)}else i=!1;if(ti(t,o),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.flags|=2),mi(t,n,r),vi(t,n,r,o),r=!0;else if(null===e){var a=t.stateNode,s=t.memoizedProps;a.props=s;var l=a.context,u=n.contextType;"object"==typeof u&&null!==u?u=ni(u):u=fo(t,u=po(n)?co:lo.current);var c=n.getDerivedStateFromProps,f="function"==typeof c||"function"==typeof a.getSnapshotBeforeUpdate;f||"function"!=typeof a.UNSAFE_componentWillReceiveProps&&"function"!=typeof a.componentWillReceiveProps||(s!==r||l!==u)&&gi(t,a,r,u),ri=!1;var p=t.memoizedState;a.state=p,ui(t,r,a,o),l=t.memoizedState,s!==r||p!==l||uo.current||ri?("function"==typeof c&&(pi(t,n,c,r),l=t.memoizedState),(s=ri||hi(t,n,s,r,p,l,u))?(f||"function"!=typeof a.UNSAFE_componentWillMount&&"function"!=typeof a.componentWillMount||("function"==typeof a.componentWillMount&&a.componentWillMount(),"function"==typeof a.UNSAFE_componentWillMount&&a.UNSAFE_componentWillMount()),"function"==typeof a.componentDidMount&&(t.flags|=4)):("function"==typeof a.componentDidMount&&(t.flags|=4),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=u,r=s):("function"==typeof a.componentDidMount&&(t.flags|=4),r=!1)}else{a=t.stateNode,ii(e,t),s=t.memoizedProps,u=t.type===t.elementType?s:Qo(t.type,s),a.props=u,f=t.pendingProps,p=a.context,"object"==typeof(l=n.contextType)&&null!==l?l=ni(l):l=fo(t,l=po(n)?co:lo.current);var d=n.getDerivedStateFromProps;(c="function"==typeof d||"function"==typeof a.getSnapshotBeforeUpdate)||"function"!=typeof a.UNSAFE_componentWillReceiveProps&&"function"!=typeof a.componentWillReceiveProps||(s!==f||p!==l)&&gi(t,a,r,l),ri=!1,p=t.memoizedState,a.state=p,ui(t,r,a,o);var h=t.memoizedState;s!==f||p!==h||uo.current||ri?("function"==typeof d&&(pi(t,n,d,r),h=t.memoizedState),(u=ri||hi(t,n,u,r,p,h,l))?(c||"function"!=typeof a.UNSAFE_componentWillUpdate&&"function"!=typeof a.componentWillUpdate||("function"==typeof a.componentWillUpdate&&a.componentWillUpdate(r,h,l),"function"==typeof a.UNSAFE_componentWillUpdate&&a.UNSAFE_componentWillUpdate(r,h,l)),"function"==typeof a.componentDidUpdate&&(t.flags|=4),"function"==typeof a.getSnapshotBeforeUpdate&&(t.flags|=256)):("function"!=typeof a.componentDidUpdate||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),"function"!=typeof a.getSnapshotBeforeUpdate||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=256),t.memoizedProps=r,t.memoizedState=h),a.props=r,a.state=h,a.context=l,r=u):("function"!=typeof a.componentDidUpdate||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),"function"!=typeof a.getSnapshotBeforeUpdate||s===e.memoizedProps&&p===e.memoizedState||(t.flags|=256),r=!1)}return Ha(e,t,n,r,i,o)}function Ha(e,t,n,r,o,i){za(e,t);var a=0!=(64&t.flags);if(!r&&!a)return o&&yo(t,n,!1),es(e,t,i);r=t.stateNode,Na.current=t;var s=a&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.flags|=1,null!==e&&a?(t.child=xi(t,e.child,null,i),t.child=xi(t,null,s,i)):ja(e,t,s,i),t.memoizedState=r.state,o&&yo(t,n,!0),t.child}function Fa(e){var t=e.stateNode;t.pendingContext?mo(0,t.pendingContext,t.pendingContext!==t.context):t.context&&mo(0,t.context,!1),Ti(e,t.containerInfo)}var Wa,$a,qa,Va={dehydrated:null,retryLane:0};function Qa(e,t,n){var r,o=t.pendingProps,i=ji.current,a=!1;return(r=0!=(64&t.flags))||(r=(null===e||null!==e.memoizedState)&&0!=(2&i)),r?(a=!0,t.flags&=-65):null!==e&&null===e.memoizedState||void 0===o.fallback||!0===o.unstable_avoidThisFallback||(i|=1),ao(ji,1&i),null===e?(void 0!==o.fallback&&Ui(t),e=o.children,i=o.fallback,a?(e=Ka(t,e,i,n),t.child.memoizedState={baseLanes:n},t.memoizedState=Va,e):"number"==typeof o.unstable_expectedLoadTime?(e=Ka(t,e,i,n),t.child.memoizedState={baseLanes:n},t.memoizedState=Va,t.lanes=33554432,e):((n=Fl({mode:"visible",children:e},t.mode,n,null)).return=t,t.child=n)):(e.memoizedState,a?(o=Xa(e,t,o.children,o.fallback,n),a=t.child,i=e.child.memoizedState,a.memoizedState=null===i?{baseLanes:n}:{baseLanes:i.baseLanes|n},a.childLanes=e.childLanes&~n,t.memoizedState=Va,o):(n=Ya(e,t,o.children,n),t.memoizedState=null,n))}function Ka(e,t,n,r){var o=e.mode,i=e.child;return t={mode:"hidden",children:t},0==(2&o)&&null!==i?(i.childLanes=0,i.pendingProps=t):i=Fl(t,o,0,null),n=Hl(n,o,r,null),i.return=e,n.return=e,i.sibling=n,e.child=i,n}function Ya(e,t,n,r){var o=e.child;return e=o.sibling,n=Bl(o,{mode:"visible",children:n}),0==(2&t.mode)&&(n.lanes=r),n.return=t,n.sibling=null,null!==e&&(e.nextEffect=null,e.flags=8,t.firstEffect=t.lastEffect=e),t.child=n}function Xa(e,t,n,r,o){var i=t.mode,a=e.child;e=a.sibling;var s={mode:"hidden",children:n};return 0==(2&i)&&t.child!==a?((n=t.child).childLanes=0,n.pendingProps=s,null!==(a=n.lastEffect)?(t.firstEffect=n.firstEffect,t.lastEffect=a,a.nextEffect=null):t.firstEffect=t.lastEffect=null):n=Bl(a,s),null!==e?r=Bl(e,r):(r=Hl(r,i,o,null)).flags|=2,r.return=t,n.return=t,n.sibling=r,t.child=n,r}function Ga(e,t){e.lanes|=t;var n=e.alternate;null!==n&&(n.lanes|=t),ei(e.return,t)}function Za(e,t,n,r,o,i){var a=e.memoizedState;null===a?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o,lastEffect:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=o,a.lastEffect=i)}function Ja(e,t,n){var r=t.pendingProps,o=r.revealOrder,i=r.tail;if(ja(e,t,r.children,n),0!=(2&(r=ji.current)))r=1&r|2,t.flags|=64;else{if(null!==e&&0!=(64&e.flags))e:for(e=t.child;null!==e;){if(13===e.tag)null!==e.memoizedState&&Ga(e,n);else if(19===e.tag)Ga(e,n);else if(null!==e.child){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;null===e.sibling;){if(null===e.return||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ao(ji,r),0==(2&t.mode))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;null!==n;)null!==(e=n.alternate)&&null===Di(e)&&(o=n),n=n.sibling;null===(n=o)?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Za(t,!1,o,n,i,t.lastEffect);break;case"backwards":for(n=null,o=t.child,t.child=null;null!==o;){if(null!==(e=o.alternate)&&null===Di(e)){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Za(t,!0,n,null,i,t.lastEffect);break;case"together":Za(t,!1,null,null,void 0,t.lastEffect);break;default:t.memoizedState=null}return t.child}function es(e,t,n){if(null!==e&&(t.dependencies=e.dependencies),Ds|=t.lanes,0!=(n&t.childLanes)){if(null!==e&&t.child!==e.child)throw Error(a(153));if(null!==t.child){for(n=Bl(e=t.child,e.pendingProps),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=Bl(e,e.pendingProps)).return=t;n.sibling=null}return t.child}return null}function ts(e,t){if(!Ii)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;null!==t;)null!==t.alternate&&(n=t),t=t.sibling;null===n?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;null!==n;)null!==n.alternate&&(r=n),n=n.sibling;null===r?t||null===e.tail?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ns(e,t,n){var r=t.pendingProps;switch(t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return po(t.type)&&ho(),null;case 3:return Li(),io(uo),io(lo),qi(),(r=t.stateNode).pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),null!==e&&null!==e.child||(Fi(t)?t.flags|=4:r.hydrate||(t.flags|=256)),null;case 5:Mi(t);var i=Pi(Oi.current);if(n=t.type,null!==e&&null!=t.stateNode)$a(e,t,n,r),e.ref!==t.ref&&(t.flags|=128);else{if(!r){if(null===t.stateNode)throw Error(a(166));return null}if(e=Pi(Ci.current),Fi(t)){r=t.stateNode,n=t.type;var s=t.memoizedProps;switch(r[Qr]=t,r[Kr]=s,n){case"dialog":Cr("cancel",r),Cr("close",r);break;case"iframe":case"object":case"embed":Cr("load",r);break;case"video":case"audio":for(e=0;e<Er.length;e++)Cr(Er[e],r);break;case"source":Cr("error",r);break;case"img":case"image":case"link":Cr("error",r),Cr("load",r);break;case"details":Cr("toggle",r);break;case"input":ee(r,s),Cr("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},Cr("invalid",r);break;case"textarea":le(r,s),Cr("invalid",r)}for(var u in _e(n,s),e=null,s)s.hasOwnProperty(u)&&(i=s[u],"children"===u?"string"==typeof i?r.textContent!==i&&(e=["children",i]):"number"==typeof i&&r.textContent!==""+i&&(e=["children",""+i]):l.hasOwnProperty(u)&&null!=i&&"onScroll"===u&&Cr("scroll",r));switch(n){case"input":X(r),re(r,s,!0);break;case"textarea":X(r),ce(r);break;case"select":case"option":break;default:"function"==typeof s.onClick&&(r.onclick=Ar)}r=e,t.updateQueue=r,null!==r&&(t.flags|=4)}else{switch(u=9===i.nodeType?i:i.ownerDocument,e===fe&&(e=de(n)),e===fe?"script"===n?((e=u.createElement("div")).innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):"string"==typeof r.is?e=u.createElement(n,{is:r.is}):(e=u.createElement(n),"select"===n&&(u=e,r.multiple?u.multiple=!0:r.size&&(u.size=r.size))):e=u.createElementNS(e,n),e[Qr]=t,e[Kr]=r,Wa(e,t),t.stateNode=e,u=ke(n,r),n){case"dialog":Cr("cancel",e),Cr("close",e),i=r;break;case"iframe":case"object":case"embed":Cr("load",e),i=r;break;case"video":case"audio":for(i=0;i<Er.length;i++)Cr(Er[i],e);i=r;break;case"source":Cr("error",e),i=r;break;case"img":case"image":case"link":Cr("error",e),Cr("load",e),i=r;break;case"details":Cr("toggle",e),i=r;break;case"input":ee(e,r),i=J(e,r),Cr("invalid",e);break;case"option":i=ie(e,r);break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=o({},r,{value:void 0}),Cr("invalid",e);break;case"textarea":le(e,r),i=se(e,r),Cr("invalid",e);break;default:i=r}_e(n,i);var c=i;for(s in c)if(c.hasOwnProperty(s)){var f=c[s];"style"===s?Ee(e,f):"dangerouslySetInnerHTML"===s?null!=(f=f?f.__html:void 0)&&ge(e,f):"children"===s?"string"==typeof f?("textarea"!==n||""!==f)&&ve(e,f):"number"==typeof f&&ve(e,""+f):"suppressContentEditableWarning"!==s&&"suppressHydrationWarning"!==s&&"autoFocus"!==s&&(l.hasOwnProperty(s)?null!=f&&"onScroll"===s&&Cr("scroll",e):null!=f&&w(e,s,f,u))}switch(n){case"input":X(e),re(e,r,!1);break;case"textarea":X(e),ce(e);break;case"option":null!=r.value&&e.setAttribute("value",""+K(r.value));break;case"select":e.multiple=!!r.multiple,null!=(s=r.value)?ae(e,!!r.multiple,s,!1):null!=r.defaultValue&&ae(e,!!r.multiple,r.defaultValue,!0);break;default:"function"==typeof i.onClick&&(e.onclick=Ar)}zr(n,r)&&(t.flags|=4)}null!==t.ref&&(t.flags|=128)}return null;case 6:if(e&&null!=t.stateNode)qa(0,t,e.memoizedProps,r);else{if("string"!=typeof r&&null===t.stateNode)throw Error(a(166));n=Pi(Oi.current),Pi(Ci.current),Fi(t)?(r=t.stateNode,n=t.memoizedProps,r[Qr]=t,r.nodeValue!==n&&(t.flags|=4)):((r=(9===n.nodeType?n:n.ownerDocument).createTextNode(r))[Qr]=t,t.stateNode=r)}return null;case 13:return io(ji),r=t.memoizedState,0!=(64&t.flags)?(t.lanes=n,t):(r=null!==r,n=!1,null===e?void 0!==t.memoizedProps.fallback&&Fi(t):n=null!==e.memoizedState,r&&!n&&0!=(2&t.mode)&&(null===e&&!0!==t.memoizedProps.unstable_avoidThisFallback||0!=(1&ji.current)?0===Ns&&(Ns=3):(0!==Ns&&3!==Ns||(Ns=4),null===Ss||0==(134217727&Ds)&&0==(134217727&As)||fl(Ss,Ps))),(r||n)&&(t.flags|=4),null);case 4:return Li(),null===e&&Or(t.stateNode.containerInfo),null;case 10:return Jo(t),null;case 17:return po(t.type)&&ho(),null;case 19:if(io(ji),null===(r=t.memoizedState))return null;if(s=0!=(64&t.flags),null===(u=r.rendering))if(s)ts(r,!1);else{if(0!==Ns||null!==e&&0!=(64&e.flags))for(e=t.child;null!==e;){if(null!==(u=Di(e))){for(t.flags|=64,ts(r,!1),null!==(s=u.updateQueue)&&(t.updateQueue=s,t.flags|=4),null===r.lastEffect&&(t.firstEffect=null),t.lastEffect=r.lastEffect,r=n,n=t.child;null!==n;)e=r,(s=n).flags&=2,s.nextEffect=null,s.firstEffect=null,s.lastEffect=null,null===(u=s.alternate)?(s.childLanes=0,s.lanes=e,s.child=null,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=u.childLanes,s.lanes=u.lanes,s.child=u.child,s.memoizedProps=u.memoizedProps,s.memoizedState=u.memoizedState,s.updateQueue=u.updateQueue,s.type=u.type,e=u.dependencies,s.dependencies=null===e?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ao(ji,1&ji.current|2),t.child}e=e.sibling}null!==r.tail&&Bo()>Bs&&(t.flags|=64,s=!0,ts(r,!1),t.lanes=33554432)}else{if(!s)if(null!==(e=Di(u))){if(t.flags|=64,s=!0,null!==(n=e.updateQueue)&&(t.updateQueue=n,t.flags|=4),ts(r,!0),null===r.tail&&"hidden"===r.tailMode&&!u.alternate&&!Ii)return null!==(t=t.lastEffect=r.lastEffect)&&(t.nextEffect=null),null}else 2*Bo()-r.renderingStartTime>Bs&&1073741824!==n&&(t.flags|=64,s=!0,ts(r,!1),t.lanes=33554432);r.isBackwards?(u.sibling=t.child,t.child=u):(null!==(n=r.last)?n.sibling=u:t.child=u,r.last=u)}return null!==r.tail?(n=r.tail,r.rendering=n,r.tail=n.sibling,r.lastEffect=t.lastEffect,r.renderingStartTime=Bo(),n.sibling=null,t=ji.current,ao(ji,s?1&t|2:1&t),n):null;case 23:case 24:return gl(),null!==e&&null!==e.memoizedState!=(null!==t.memoizedState)&&"unstable-defer-without-hiding"!==r.mode&&(t.flags|=4),null}throw Error(a(156,t.tag))}function rs(e){switch(e.tag){case 1:po(e.type)&&ho();var t=e.flags;return 4096&t?(e.flags=-4097&t|64,e):null;case 3:if(Li(),io(uo),io(lo),qi(),0!=(64&(t=e.flags)))throw Error(a(285));return e.flags=-4097&t|64,e;case 5:return Mi(e),null;case 13:return io(ji),4096&(t=e.flags)?(e.flags=-4097&t|64,e):null;case 19:return io(ji),null;case 4:return Li(),null;case 10:return Jo(e),null;case 23:case 24:return gl(),null;default:return null}}function os(e,t){try{var n="",r=t;do{n+=V(r),r=r.return}while(r);var o=n}catch(e){o="\nError generating stack: "+e.message+"\n"+e.stack}return{value:e,source:t,stack:o}}function is(e,t){try{console.error(t.value)}catch(e){setTimeout((function(){throw e}))}}Wa=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)e.appendChild(n.stateNode);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},$a=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,Pi(Ci.current);var a,s=null;switch(n){case"input":i=J(e,i),r=J(e,r),s=[];break;case"option":i=ie(e,i),r=ie(e,r),s=[];break;case"select":i=o({},i,{value:void 0}),r=o({},r,{value:void 0}),s=[];break;case"textarea":i=se(e,i),r=se(e,r),s=[];break;default:"function"!=typeof i.onClick&&"function"==typeof r.onClick&&(e.onclick=Ar)}for(f in _e(n,r),n=null,i)if(!r.hasOwnProperty(f)&&i.hasOwnProperty(f)&&null!=i[f])if("style"===f){var u=i[f];for(a in u)u.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else"dangerouslySetInnerHTML"!==f&&"children"!==f&&"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(l.hasOwnProperty(f)?s||(s=[]):(s=s||[]).push(f,null));for(f in r){var c=r[f];if(u=null!=i?i[f]:void 0,r.hasOwnProperty(f)&&c!==u&&(null!=c||null!=u))if("style"===f)if(u){for(a in u)!u.hasOwnProperty(a)||c&&c.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in c)c.hasOwnProperty(a)&&u[a]!==c[a]&&(n||(n={}),n[a]=c[a])}else n||(s||(s=[]),s.push(f,n)),n=c;else"dangerouslySetInnerHTML"===f?(c=c?c.__html:void 0,u=u?u.__html:void 0,null!=c&&u!==c&&(s=s||[]).push(f,c)):"children"===f?"string"!=typeof c&&"number"!=typeof c||(s=s||[]).push(f,""+c):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&(l.hasOwnProperty(f)?(null!=c&&"onScroll"===f&&Cr("scroll",e),s||u===c||(s=[])):"object"==typeof c&&null!==c&&c.$$typeof===A?c.toString():(s=s||[]).push(f,c))}n&&(s=s||[]).push("style",n);var f=s;(t.updateQueue=f)&&(t.flags|=4)}},qa=function(e,t,n,r){n!==r&&(t.flags|=4)};var as="function"==typeof WeakMap?WeakMap:Map;function ss(e,t,n){(n=ai(-1,n)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ws||(Ws=!0,$s=r),is(0,t)},n}function ls(e,t,n){(n=ai(-1,n)).tag=3;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var o=t.value;n.payload=function(){return is(0,t),r(o)}}var i=e.stateNode;return null!==i&&"function"==typeof i.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===qs?qs=new Set([this]):qs.add(this),is(0,t));var e=t.stack;this.componentDidCatch(t.value,{componentStack:null!==e?e:""})}),n}var us="function"==typeof WeakSet?WeakSet:Set;function cs(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){jl(e,t)}else t.current=null}function fs(e,t){switch(t.tag){case 0:case 11:case 15:case 22:return;case 1:if(256&t.flags&&null!==e){var n=e.memoizedProps,r=e.memoizedState;t=(e=t.stateNode).getSnapshotBeforeUpdate(t.elementType===t.type?n:Qo(t.type,n),r),e.__reactInternalSnapshotBeforeUpdate=t}return;case 3:return void(256&t.flags&&Fr(t.stateNode.containerInfo));case 5:case 6:case 4:case 17:return}throw Error(a(163))}function ps(e,t,n){switch(n.tag){case 0:case 11:case 15:case 22:if(null!==(t=null!==(t=n.updateQueue)?t.lastEffect:null)){e=t=t.next;do{if(3==(3&e.tag)){var r=e.create;e.destroy=r()}e=e.next}while(e!==t)}if(null!==(t=null!==(t=n.updateQueue)?t.lastEffect:null)){e=t=t.next;do{var o=e;r=o.next,0!=(4&(o=o.tag))&&0!=(1&o)&&(Ll(n,e),Tl(n,e)),e=r}while(e!==t)}return;case 1:return e=n.stateNode,4&n.flags&&(null===t?e.componentDidMount():(r=n.elementType===n.type?t.memoizedProps:Qo(n.type,t.memoizedProps),e.componentDidUpdate(r,t.memoizedState,e.__reactInternalSnapshotBeforeUpdate))),void(null!==(t=n.updateQueue)&&ci(n,t,e));case 3:if(null!==(t=n.updateQueue)){if(e=null,null!==n.child)switch(n.child.tag){case 5:e=n.child.stateNode;break;case 1:e=n.child.stateNode}ci(n,t,e)}return;case 5:return e=n.stateNode,void(null===t&&4&n.flags&&zr(n.type,n.memoizedProps)&&e.focus());case 6:case 4:case 12:return;case 13:return void(null===n.memoizedState&&(n=n.alternate,null!==n&&(n=n.memoizedState,null!==n&&(n=n.dehydrated,null!==n&&Et(n)))));case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(a(163))}function ds(e,t){for(var n=e;;){if(5===n.tag){var r=n.stateNode;if(t)"function"==typeof(r=r.style).setProperty?r.setProperty("display","none","important"):r.display="none";else{r=n.stateNode;var o=n.memoizedProps.style;o=null!=o&&o.hasOwnProperty("display")?o.display:null,r.style.display=we("display",o)}}else if(6===n.tag)n.stateNode.nodeValue=t?"":n.memoizedProps;else if((23!==n.tag&&24!==n.tag||null===n.memoizedState||n===e)&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===e)break;for(;null===n.sibling;){if(null===n.return||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}}function hs(e,t){if(wo&&"function"==typeof wo.onCommitFiberUnmount)try{wo.onCommitFiberUnmount(bo,t)}catch(e){}switch(t.tag){case 0:case 11:case 14:case 15:case 22:if(null!==(e=t.updateQueue)&&null!==(e=e.lastEffect)){var n=e=e.next;do{var r=n,o=r.destroy;if(r=r.tag,void 0!==o)if(0!=(4&r))Ll(t,n);else{r=t;try{o()}catch(e){jl(r,e)}}n=n.next}while(n!==e)}break;case 1:if(cs(t),"function"==typeof(e=t.stateNode).componentWillUnmount)try{e.props=t.memoizedProps,e.state=t.memoizedState,e.componentWillUnmount()}catch(e){jl(t,e)}break;case 5:cs(t);break;case 4:ys(e,t)}}function ms(e){e.alternate=null,e.child=null,e.dependencies=null,e.firstEffect=null,e.lastEffect=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.return=null,e.updateQueue=null}function gs(e){return 5===e.tag||3===e.tag||4===e.tag}function vs(e){e:{for(var t=e.return;null!==t;){if(gs(t))break e;t=t.return}throw Error(a(160))}var n=t;switch(t=n.stateNode,n.tag){case 5:var r=!1;break;case 3:case 4:t=t.containerInfo,r=!0;break;default:throw Error(a(161))}16&n.flags&&(ve(t,""),n.flags&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||gs(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag&&18!==n.tag;){if(2&n.flags)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.flags)){n=n.stateNode;break e}}r?function e(t,n,r){var o=t.tag,i=5===o||6===o;if(i)t=i?t.stateNode:t.stateNode.instance,n?8===r.nodeType?r.parentNode.insertBefore(t,n):r.insertBefore(t,n):(8===r.nodeType?(n=r.parentNode).insertBefore(t,r):(n=r).appendChild(t),null!==(r=r._reactRootContainer)&&void 0!==r||null!==n.onclick||(n.onclick=Ar));else if(4!==o&&null!==(t=t.child))for(e(t,n,r),t=t.sibling;null!==t;)e(t,n,r),t=t.sibling}(e,n,t):function e(t,n,r){var o=t.tag,i=5===o||6===o;if(i)t=i?t.stateNode:t.stateNode.instance,n?r.insertBefore(t,n):r.appendChild(t);else if(4!==o&&null!==(t=t.child))for(e(t,n,r),t=t.sibling;null!==t;)e(t,n,r),t=t.sibling}(e,n,t)}function ys(e,t){for(var n,r,o=t,i=!1;;){if(!i){i=o.return;e:for(;;){if(null===i)throw Error(a(160));switch(n=i.stateNode,i.tag){case 5:r=!1;break e;case 3:case 4:n=n.containerInfo,r=!0;break e}i=i.return}i=!0}if(5===o.tag||6===o.tag){e:for(var s=e,l=o,u=l;;)if(hs(s,u),null!==u.child&&4!==u.tag)u.child.return=u,u=u.child;else{if(u===l)break e;for(;null===u.sibling;){if(null===u.return||u.return===l)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}r?(s=n,l=o.stateNode,8===s.nodeType?s.parentNode.removeChild(l):s.removeChild(l)):n.removeChild(o.stateNode)}else if(4===o.tag){if(null!==o.child){n=o.stateNode.containerInfo,r=!0,o.child.return=o,o=o.child;continue}}else if(hs(e,o),null!==o.child){o.child.return=o,o=o.child;continue}if(o===t)break;for(;null===o.sibling;){if(null===o.return||o.return===t)return;4===(o=o.return).tag&&(i=!1)}o.sibling.return=o.return,o=o.sibling}}function bs(e,t){switch(t.tag){case 0:case 11:case 14:case 15:case 22:var n=t.updateQueue;if(null!==(n=null!==n?n.lastEffect:null)){var r=n=n.next;do{3==(3&r.tag)&&(e=r.destroy,r.destroy=void 0,void 0!==e&&e()),r=r.next}while(r!==n)}return;case 1:return;case 5:if(null!=(n=t.stateNode)){r=t.memoizedProps;var o=null!==e?e.memoizedProps:r;e=t.type;var i=t.updateQueue;if(t.updateQueue=null,null!==i){for(n[Kr]=r,"input"===e&&"radio"===r.type&&null!=r.name&&te(n,r),ke(e,o),t=ke(e,r),o=0;o<i.length;o+=2){var s=i[o],l=i[o+1];"style"===s?Ee(n,l):"dangerouslySetInnerHTML"===s?ge(n,l):"children"===s?ve(n,l):w(n,s,l,t)}switch(e){case"input":ne(n,r);break;case"textarea":ue(n,r);break;case"select":e=n._wrapperState.wasMultiple,n._wrapperState.wasMultiple=!!r.multiple,null!=(i=r.value)?ae(n,!!r.multiple,i,!1):e!==!!r.multiple&&(null!=r.defaultValue?ae(n,!!r.multiple,r.defaultValue,!0):ae(n,!!r.multiple,r.multiple?[]:"",!1))}}}return;case 6:if(null===t.stateNode)throw Error(a(162));return void(t.stateNode.nodeValue=t.memoizedProps);case 3:return void((n=t.stateNode).hydrate&&(n.hydrate=!1,Et(n.containerInfo)));case 12:return;case 13:return null!==t.memoizedState&&(zs=Bo(),ds(t.child,!0)),void ws(t);case 19:return void ws(t);case 17:return;case 23:case 24:return void ds(t,null!==t.memoizedState)}throw Error(a(163))}function ws(e){var t=e.updateQueue;if(null!==t){e.updateQueue=null;var n=e.stateNode;null===n&&(n=e.stateNode=new us),t.forEach((function(t){var r=Al.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))}))}}function Es(e,t){return null!==e&&(null===(e=e.memoizedState)||null!==e.dehydrated)&&(null!==(t=t.memoizedState)&&null===t.dehydrated)}var xs=Math.ceil,_s=E.ReactCurrentDispatcher,ks=E.ReactCurrentOwner,Cs=0,Ss=null,Os=null,Ps=0,Ts=0,Ls=oo(0),Ns=0,Ms=null,js=0,Ds=0,As=0,Rs=0,Is=null,zs=0,Bs=1/0;function Us(){Bs=Bo()+500}var Hs,Fs=null,Ws=!1,$s=null,qs=null,Vs=!1,Qs=null,Ks=90,Ys=[],Xs=[],Gs=null,Zs=0,Js=null,el=-1,tl=0,nl=0,rl=null,ol=!1;function il(){return 0!=(48&Cs)?Bo():-1!==el?el:el=Bo()}function al(e){if(0==(2&(e=e.mode)))return 1;if(0==(4&e))return 99===Uo()?1:2;if(0===tl&&(tl=js),0!==Vo.transition){0!==nl&&(nl=null!==Is?Is.pendingLanes:0),e=tl;var t=4186112&~nl;return 0===(t&=-t)&&(0===(t=(e=4186112&~e)&-e)&&(t=8192)),t}return e=Uo(),0!=(4&Cs)&&98===e?e=Bt(12,tl):e=Bt(e=function(e){switch(e){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}(e),tl),e}function sl(e,t,n){if(50<Zs)throw Zs=0,Js=null,Error(a(185));if(null===(e=ll(e,t)))return null;Ft(e,t,n),e===Ss&&(As|=t,4===Ns&&fl(e,Ps));var r=Uo();1===t?0!=(8&Cs)&&0==(48&Cs)?pl(e):(ul(e,n),0===Cs&&(Us(),$o())):(0==(4&Cs)||98!==r&&99!==r||(null===Gs?Gs=new Set([e]):Gs.add(e)),ul(e,n)),Is=e}function ll(e,t){e.lanes|=t;var n=e.alternate;for(null!==n&&(n.lanes|=t),n=e,e=e.return;null!==e;)e.childLanes|=t,null!==(n=e.alternate)&&(n.childLanes|=t),n=e,e=e.return;return 3===n.tag?n.stateNode:null}function ul(e,t){for(var n=e.callbackNode,r=e.suspendedLanes,o=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes;0<s;){var l=31-Wt(s),u=1<<l,c=i[l];if(-1===c){if(0==(u&r)||0!=(u&o)){c=t,Rt(u);var f=At;i[l]=10<=f?c+250:6<=f?c+5e3:-1}}else c<=t&&(e.expiredLanes|=u);s&=~u}if(r=It(e,e===Ss?Ps:0),t=At,0===r)null!==n&&(n!==jo&&_o(n),e.callbackNode=null,e.callbackPriority=0);else{if(null!==n){if(e.callbackPriority===t)return;n!==jo&&_o(n)}15===t?(n=pl.bind(null,e),null===Ao?(Ao=[n],Ro=xo(Po,qo)):Ao.push(n),n=jo):14===t?n=Wo(99,pl.bind(null,e)):n=Wo(n=function(e){switch(e){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(a(358,e))}}(t),cl.bind(null,e)),e.callbackPriority=t,e.callbackNode=n}}function cl(e){if(el=-1,nl=tl=0,0!=(48&Cs))throw Error(a(327));var t=e.callbackNode;if(Pl()&&e.callbackNode!==t)return null;var n=It(e,e===Ss?Ps:0);if(0===n)return null;var r=n,o=Cs;Cs|=16;var i=bl();for(Ss===e&&Ps===r||(Us(),vl(e,r));;)try{xl();break}catch(t){yl(e,t)}if(Zo(),_s.current=i,Cs=o,null!==Os?r=0:(Ss=null,Ps=0,r=Ns),0!=(js&As))vl(e,0);else if(0!==r){if(2===r&&(Cs|=64,e.hydrate&&(e.hydrate=!1,Fr(e.containerInfo)),0!==(n=zt(e))&&(r=wl(e,n))),1===r)throw t=Ms,vl(e,0),fl(e,n),ul(e,Bo()),t;switch(e.finishedWork=e.current.alternate,e.finishedLanes=n,r){case 0:case 1:throw Error(a(345));case 2:Cl(e);break;case 3:if(fl(e,n),(62914560&n)===n&&10<(r=zs+500-Bo())){if(0!==It(e,0))break;if(((o=e.suspendedLanes)&n)!==n){il(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Ur(Cl.bind(null,e),r);break}Cl(e);break;case 4:if(fl(e,n),(4186112&n)===n)break;for(r=e.eventTimes,o=-1;0<n;){var s=31-Wt(n);i=1<<s,(s=r[s])>o&&(o=s),n&=~i}if(n=o,10<(n=(120>(n=Bo()-n)?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*xs(n/1960))-n)){e.timeoutHandle=Ur(Cl.bind(null,e),n);break}Cl(e);break;case 5:Cl(e);break;default:throw Error(a(329))}}return ul(e,Bo()),e.callbackNode===t?cl.bind(null,e):null}function fl(e,t){for(t&=~Rs,t&=~As,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Wt(t),r=1<<n;e[n]=-1,t&=~r}}function pl(e){if(0!=(48&Cs))throw Error(a(327));if(Pl(),e===Ss&&0!=(e.expiredLanes&Ps)){var t=Ps,n=wl(e,t);0!=(js&As)&&(n=wl(e,t=It(e,t)))}else n=wl(e,t=It(e,0));if(0!==e.tag&&2===n&&(Cs|=64,e.hydrate&&(e.hydrate=!1,Fr(e.containerInfo)),0!==(t=zt(e))&&(n=wl(e,t))),1===n)throw n=Ms,vl(e,0),fl(e,t),ul(e,Bo()),n;return e.finishedWork=e.current.alternate,e.finishedLanes=t,Cl(e),ul(e,Bo()),null}function dl(e,t){var n=Cs;Cs|=1;try{return e(t)}finally{0===(Cs=n)&&(Us(),$o())}}function hl(e,t){var n=Cs;Cs&=-2,Cs|=8;try{return e(t)}finally{0===(Cs=n)&&(Us(),$o())}}function ml(e,t){ao(Ls,Ts),Ts|=t,js|=t}function gl(){Ts=Ls.current,io(Ls)}function vl(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(-1!==n&&(e.timeoutHandle=-1,Hr(n)),null!==Os)for(n=Os.return;null!==n;){var r=n;switch(r.tag){case 1:null!=(r=r.type.childContextTypes)&&ho();break;case 3:Li(),io(uo),io(lo),qi();break;case 5:Mi(r);break;case 4:Li();break;case 13:case 19:io(ji);break;case 10:Jo(r);break;case 23:case 24:gl()}n=n.return}Ss=e,Os=Bl(e.current,null),Ps=Ts=js=t,Ns=0,Ms=null,Rs=As=Ds=0}function yl(e,t){for(;;){var n=Os;try{if(Zo(),Vi.current=Oa,Zi){for(var r=Yi.memoizedState;null!==r;){var o=r.queue;null!==o&&(o.pending=null),r=r.next}Zi=!1}if(Ki=0,Gi=Xi=Yi=null,Ji=!1,ks.current=null,null===n||null===n.return){Ns=1,Ms=t,Os=null;break}e:{var i=e,a=n.return,s=n,l=t;if(t=Ps,s.flags|=2048,s.firstEffect=s.lastEffect=null,null!==l&&"object"==typeof l&&"function"==typeof l.then){var u=l;if(0==(2&s.mode)){var c=s.alternate;c?(s.updateQueue=c.updateQueue,s.memoizedState=c.memoizedState,s.lanes=c.lanes):(s.updateQueue=null,s.memoizedState=null)}var f=0!=(1&ji.current),p=a;do{var d;if(d=13===p.tag){var h=p.memoizedState;if(null!==h)d=null!==h.dehydrated;else{var m=p.memoizedProps;d=void 0!==m.fallback&&(!0!==m.unstable_avoidThisFallback||!f)}}if(d){var g=p.updateQueue;if(null===g){var v=new Set;v.add(u),p.updateQueue=v}else g.add(u);if(0==(2&p.mode)){if(p.flags|=64,s.flags|=16384,s.flags&=-2981,1===s.tag)if(null===s.alternate)s.tag=17;else{var y=ai(-1,1);y.tag=2,si(s,y)}s.lanes|=1;break e}l=void 0,s=t;var b=i.pingCache;if(null===b?(b=i.pingCache=new as,l=new Set,b.set(u,l)):void 0===(l=b.get(u))&&(l=new Set,b.set(u,l)),!l.has(s)){l.add(s);var w=Dl.bind(null,i,u,s);u.then(w,w)}p.flags|=4096,p.lanes=t;break e}p=p.return}while(null!==p);l=Error((Q(s.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.")}5!==Ns&&(Ns=2),l=os(l,s),p=a;do{switch(p.tag){case 3:i=l,p.flags|=4096,t&=-t,p.lanes|=t,li(p,ss(0,i,t));break e;case 1:i=l;var E=p.type,x=p.stateNode;if(0==(64&p.flags)&&("function"==typeof E.getDerivedStateFromError||null!==x&&"function"==typeof x.componentDidCatch&&(null===qs||!qs.has(x)))){p.flags|=4096,t&=-t,p.lanes|=t,li(p,ls(p,i,t));break e}}p=p.return}while(null!==p)}kl(n)}catch(e){t=e,Os===n&&null!==n&&(Os=n=n.return);continue}break}}function bl(){var e=_s.current;return _s.current=Oa,null===e?Oa:e}function wl(e,t){var n=Cs;Cs|=16;var r=bl();for(Ss===e&&Ps===t||vl(e,t);;)try{El();break}catch(t){yl(e,t)}if(Zo(),Cs=n,_s.current=r,null!==Os)throw Error(a(261));return Ss=null,Ps=0,Ns}function El(){for(;null!==Os;)_l(Os)}function xl(){for(;null!==Os&&!ko();)_l(Os)}function _l(e){var t=Hs(e.alternate,e,Ts);e.memoizedProps=e.pendingProps,null===t?kl(e):Os=t,ks.current=null}function kl(e){var t=e;do{var n=t.alternate;if(e=t.return,0==(2048&t.flags)){if(null!==(n=ns(n,t,Ts)))return void(Os=n);if(24!==(n=t).tag&&23!==n.tag||null===n.memoizedState||0!=(1073741824&Ts)||0==(4&n.mode)){for(var r=0,o=n.child;null!==o;)r|=o.lanes|o.childLanes,o=o.sibling;n.childLanes=r}null!==e&&0==(2048&e.flags)&&(null===e.firstEffect&&(e.firstEffect=t.firstEffect),null!==t.lastEffect&&(null!==e.lastEffect&&(e.lastEffect.nextEffect=t.firstEffect),e.lastEffect=t.lastEffect),1<t.flags&&(null!==e.lastEffect?e.lastEffect.nextEffect=t:e.firstEffect=t,e.lastEffect=t))}else{if(null!==(n=rs(t)))return n.flags&=2047,void(Os=n);null!==e&&(e.firstEffect=e.lastEffect=null,e.flags|=2048)}if(null!==(t=t.sibling))return void(Os=t);Os=t=e}while(null!==t);0===Ns&&(Ns=5)}function Cl(e){var t=Uo();return Fo(99,Sl.bind(null,e,t)),null}function Sl(e,t){do{Pl()}while(null!==Qs);if(0!=(48&Cs))throw Error(a(327));var n=e.finishedWork;if(null===n)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(a(177));e.callbackNode=null;var r=n.lanes|n.childLanes,o=r,i=e.pendingLanes&~o;e.pendingLanes=o,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=o,e.mutableReadLanes&=o,e.entangledLanes&=o,o=e.entanglements;for(var s=e.eventTimes,l=e.expirationTimes;0<i;){var u=31-Wt(i),c=1<<u;o[u]=0,s[u]=-1,l[u]=-1,i&=~c}if(null!==Gs&&0==(24&r)&&Gs.has(e)&&Gs.delete(e),e===Ss&&(Os=Ss=null,Ps=0),1<n.flags?null!==n.lastEffect?(n.lastEffect.nextEffect=n,r=n.firstEffect):r=n:r=n.firstEffect,null!==r){if(o=Cs,Cs|=32,ks.current=null,Rr=Kt,pr(s=fr())){if("selectionStart"in s)l={start:s.selectionStart,end:s.selectionEnd};else e:if(l=(l=s.ownerDocument)&&l.defaultView||window,(c=l.getSelection&&l.getSelection())&&0!==c.rangeCount){l=c.anchorNode,i=c.anchorOffset,u=c.focusNode,c=c.focusOffset;try{l.nodeType,u.nodeType}catch(e){l=null;break e}var f=0,p=-1,d=-1,h=0,m=0,g=s,v=null;t:for(;;){for(var y;g!==l||0!==i&&3!==g.nodeType||(p=f+i),g!==u||0!==c&&3!==g.nodeType||(d=f+c),3===g.nodeType&&(f+=g.nodeValue.length),null!==(y=g.firstChild);)v=g,g=y;for(;;){if(g===s)break t;if(v===l&&++h===i&&(p=f),v===u&&++m===c&&(d=f),null!==(y=g.nextSibling))break;v=(g=v).parentNode}g=y}l=-1===p||-1===d?null:{start:p,end:d}}else l=null;l=l||{start:0,end:0}}else l=null;Ir={focusedElem:s,selectionRange:l},Kt=!1,rl=null,ol=!1,Fs=r;do{try{Ol()}catch(e){if(null===Fs)throw Error(a(330));jl(Fs,e),Fs=Fs.nextEffect}}while(null!==Fs);rl=null,Fs=r;do{try{for(s=e;null!==Fs;){var b=Fs.flags;if(16&b&&ve(Fs.stateNode,""),128&b){var w=Fs.alternate;if(null!==w){var E=w.ref;null!==E&&("function"==typeof E?E(null):E.current=null)}}switch(1038&b){case 2:vs(Fs),Fs.flags&=-3;break;case 6:vs(Fs),Fs.flags&=-3,bs(Fs.alternate,Fs);break;case 1024:Fs.flags&=-1025;break;case 1028:Fs.flags&=-1025,bs(Fs.alternate,Fs);break;case 4:bs(Fs.alternate,Fs);break;case 8:ys(s,l=Fs);var x=l.alternate;ms(l),null!==x&&ms(x)}Fs=Fs.nextEffect}}catch(e){if(null===Fs)throw Error(a(330));jl(Fs,e),Fs=Fs.nextEffect}}while(null!==Fs);if(E=Ir,w=fr(),b=E.focusedElem,s=E.selectionRange,w!==b&&b&&b.ownerDocument&&function e(t,n){return!(!t||!n)&&(t===n||(!t||3!==t.nodeType)&&(n&&3===n.nodeType?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}(b.ownerDocument.documentElement,b)){null!==s&&pr(b)&&(w=s.start,void 0===(E=s.end)&&(E=w),"selectionStart"in b?(b.selectionStart=w,b.selectionEnd=Math.min(E,b.value.length)):(E=(w=b.ownerDocument||document)&&w.defaultView||window).getSelection&&(E=E.getSelection(),l=b.textContent.length,x=Math.min(s.start,l),s=void 0===s.end?x:Math.min(s.end,l),!E.extend&&x>s&&(l=s,s=x,x=l),l=cr(b,x),i=cr(b,s),l&&i&&(1!==E.rangeCount||E.anchorNode!==l.node||E.anchorOffset!==l.offset||E.focusNode!==i.node||E.focusOffset!==i.offset)&&((w=w.createRange()).setStart(l.node,l.offset),E.removeAllRanges(),x>s?(E.addRange(w),E.extend(i.node,i.offset)):(w.setEnd(i.node,i.offset),E.addRange(w))))),w=[];for(E=b;E=E.parentNode;)1===E.nodeType&&w.push({element:E,left:E.scrollLeft,top:E.scrollTop});for("function"==typeof b.focus&&b.focus(),b=0;b<w.length;b++)(E=w[b]).element.scrollLeft=E.left,E.element.scrollTop=E.top}Kt=!!Rr,Ir=Rr=null,e.current=n,Fs=r;do{try{for(b=e;null!==Fs;){var _=Fs.flags;if(36&_&&ps(b,Fs.alternate,Fs),128&_){w=void 0;var k=Fs.ref;if(null!==k){var C=Fs.stateNode;switch(Fs.tag){case 5:w=C;break;default:w=C}"function"==typeof k?k(w):k.current=w}}Fs=Fs.nextEffect}}catch(e){if(null===Fs)throw Error(a(330));jl(Fs,e),Fs=Fs.nextEffect}}while(null!==Fs);Fs=null,Do(),Cs=o}else e.current=n;if(Vs)Vs=!1,Qs=e,Ks=t;else for(Fs=r;null!==Fs;)t=Fs.nextEffect,Fs.nextEffect=null,8&Fs.flags&&((_=Fs).sibling=null,_.stateNode=null),Fs=t;if(0===(r=e.pendingLanes)&&(qs=null),1===r?e===Js?Zs++:(Zs=0,Js=e):Zs=0,n=n.stateNode,wo&&"function"==typeof wo.onCommitFiberRoot)try{wo.onCommitFiberRoot(bo,n,void 0,64==(64&n.current.flags))}catch(e){}if(ul(e,Bo()),Ws)throw Ws=!1,e=$s,$s=null,e;return 0!=(8&Cs)||$o(),null}function Ol(){for(;null!==Fs;){var e=Fs.alternate;ol||null===rl||(0!=(8&Fs.flags)?Je(Fs,rl)&&(ol=!0):13===Fs.tag&&Es(e,Fs)&&Je(Fs,rl)&&(ol=!0));var t=Fs.flags;0!=(256&t)&&fs(e,Fs),0==(512&t)||Vs||(Vs=!0,Wo(97,(function(){return Pl(),null}))),Fs=Fs.nextEffect}}function Pl(){if(90!==Ks){var e=97<Ks?97:Ks;return Ks=90,Fo(e,Nl)}return!1}function Tl(e,t){Ys.push(t,e),Vs||(Vs=!0,Wo(97,(function(){return Pl(),null})))}function Ll(e,t){Xs.push(t,e),Vs||(Vs=!0,Wo(97,(function(){return Pl(),null})))}function Nl(){if(null===Qs)return!1;var e=Qs;if(Qs=null,0!=(48&Cs))throw Error(a(331));var t=Cs;Cs|=32;var n=Xs;Xs=[];for(var r=0;r<n.length;r+=2){var o=n[r],i=n[r+1],s=o.destroy;if(o.destroy=void 0,"function"==typeof s)try{s()}catch(e){if(null===i)throw Error(a(330));jl(i,e)}}for(n=Ys,Ys=[],r=0;r<n.length;r+=2){o=n[r],i=n[r+1];try{var l=o.create;o.destroy=l()}catch(e){if(null===i)throw Error(a(330));jl(i,e)}}for(l=e.current.firstEffect;null!==l;)e=l.nextEffect,l.nextEffect=null,8&l.flags&&(l.sibling=null,l.stateNode=null),l=e;return Cs=t,$o(),!0}function Ml(e,t,n){si(e,t=ss(0,t=os(n,t),1)),t=il(),null!==(e=ll(e,1))&&(Ft(e,1,t),ul(e,t))}function jl(e,t){if(3===e.tag)Ml(e,e,t);else for(var n=e.return;null!==n;){if(3===n.tag){Ml(n,e,t);break}if(1===n.tag){var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===qs||!qs.has(r))){var o=ls(n,e=os(t,e),1);if(si(n,o),o=il(),null!==(n=ll(n,1)))Ft(n,1,o),ul(n,o);else if("function"==typeof r.componentDidCatch&&(null===qs||!qs.has(r)))try{r.componentDidCatch(t,e)}catch(e){}break}}n=n.return}}function Dl(e,t,n){var r=e.pingCache;null!==r&&r.delete(t),t=il(),e.pingedLanes|=e.suspendedLanes&n,Ss===e&&(Ps&n)===n&&(4===Ns||3===Ns&&(62914560&Ps)===Ps&&500>Bo()-zs?vl(e,0):Rs|=n),ul(e,t)}function Al(e,t){var n=e.stateNode;null!==n&&n.delete(t),0===(t=0)&&(0==(2&(t=e.mode))?t=1:0==(4&t)?t=99===Uo()?1:2:(0===tl&&(tl=js),0===(t=Ut(62914560&~tl))&&(t=4194304))),n=il(),null!==(e=ll(e,t))&&(Ft(e,t,n),ul(e,n))}function Rl(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.flags=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childLanes=this.lanes=0,this.alternate=null}function Il(e,t,n,r){return new Rl(e,t,n,r)}function zl(e){return!(!(e=e.prototype)||!e.isReactComponent)}function Bl(e,t){var n=e.alternate;return null===n?((n=Il(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=null===t?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ul(e,t,n,r,o,i){var s=2;if(r=e,"function"==typeof e)zl(e)&&(s=1);else if("string"==typeof e)s=5;else e:switch(e){case k:return Hl(n.children,o,i,t);case R:s=8,o|=16;break;case C:s=8,o|=1;break;case S:return(e=Il(12,n,t,8|o)).elementType=S,e.type=S,e.lanes=i,e;case L:return(e=Il(13,n,t,o)).type=L,e.elementType=L,e.lanes=i,e;case N:return(e=Il(19,n,t,o)).elementType=N,e.lanes=i,e;case I:return Fl(n,o,i,t);case z:return(e=Il(24,n,t,o)).elementType=z,e.lanes=i,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case O:s=10;break e;case P:s=9;break e;case T:s=11;break e;case M:s=14;break e;case j:s=16,r=null;break e;case D:s=22;break e}throw Error(a(130,null==e?e:typeof e,""))}return(t=Il(s,n,t,o)).elementType=e,t.type=r,t.lanes=i,t}function Hl(e,t,n,r){return(e=Il(7,e,r,t)).lanes=n,e}function Fl(e,t,n,r){return(e=Il(23,e,r,t)).elementType=I,e.lanes=n,e}function Wl(e,t,n){return(e=Il(6,e,null,t)).lanes=n,e}function $l(e,t,n){return(t=Il(4,null!==e.children?e.children:[],e.key,t)).lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ql(e,t,n){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.pendingContext=this.context=null,this.hydrate=n,this.callbackNode=null,this.callbackPriority=0,this.eventTimes=Ht(0),this.expirationTimes=Ht(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ht(0),this.mutableSourceEagerHydrationData=null}function Vl(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:_,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}function Ql(e,t,n,r){var o=t.current,i=il(),s=al(o);e:if(n){t:{if(Ye(n=n._reactInternals)!==n||1!==n.tag)throw Error(a(170));var l=n;do{switch(l.tag){case 3:l=l.stateNode.context;break t;case 1:if(po(l.type)){l=l.stateNode.__reactInternalMemoizedMergedChildContext;break t}}l=l.return}while(null!==l);throw Error(a(171))}if(1===n.tag){var u=n.type;if(po(u)){n=go(n,u,l);break e}}n=l}else n=so;return null===t.context?t.context=n:t.pendingContext=n,(t=ai(i,s)).payload={element:e},null!==(r=void 0===r?null:r)&&(t.callback=r),si(o,t),sl(o,s,i),s}function Kl(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function Yl(e,t){if(null!==(e=e.memoizedState)&&null!==e.dehydrated){var n=e.retryLane;e.retryLane=0!==n&&n<t?n:t}}function Xl(e,t){Yl(e,t),(e=e.alternate)&&Yl(e,t)}function Gl(e,t,n){var r=null!=n&&null!=n.hydrationOptions&&n.hydrationOptions.mutableSources||null;if(n=new ql(e,t,null!=n&&!0===n.hydrate),t=Il(3,null,null,2===t?7:1===t?3:0),n.current=t,t.stateNode=n,oi(t),e[Yr]=n.current,Or(8===e.nodeType?e.parentNode:e),r)for(e=0;e<r.length;e++){var o=(t=r[e])._getVersion;o=o(t._source),null==n.mutableSourceEagerHydrationData?n.mutableSourceEagerHydrationData=[t,o]:n.mutableSourceEagerHydrationData.push(t,o)}this._internalRoot=n}function Zl(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function Jl(e,t,n,r,o){var i=n._reactRootContainer;if(i){var a=i._internalRoot;if("function"==typeof o){var s=o;o=function(){var e=Kl(a);s.call(e)}}Ql(t,a,e,o)}else{if(i=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new Gl(e,0,t?{hydrate:!0}:void 0)}(n,r),a=i._internalRoot,"function"==typeof o){var l=o;o=function(){var e=Kl(a);l.call(e)}}hl((function(){Ql(t,a,e,o)}))}return Kl(a)}function eu(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!Zl(t))throw Error(a(200));return Vl(e,t,null,n)}Hs=function(e,t,n){var r=t.lanes;if(null!==e)if(e.memoizedProps!==t.pendingProps||uo.current)Ma=!0;else{if(0==(n&r)){switch(Ma=!1,t.tag){case 3:Fa(t),Wi();break;case 5:Ni(t);break;case 1:po(t.type)&&vo(t);break;case 4:Ti(t,t.stateNode.containerInfo);break;case 10:r=t.memoizedProps.value;var o=t.type._context;ao(Ko,o._currentValue),o._currentValue=r;break;case 13:if(null!==t.memoizedState)return 0!=(n&t.child.childLanes)?Qa(e,t,n):(ao(ji,1&ji.current),null!==(t=es(e,t,n))?t.sibling:null);ao(ji,1&ji.current);break;case 19:if(r=0!=(n&t.childLanes),0!=(64&e.flags)){if(r)return Ja(e,t,n);t.flags|=64}if(null!==(o=t.memoizedState)&&(o.rendering=null,o.tail=null,o.lastEffect=null),ao(ji,ji.current),r)break;return null;case 23:case 24:return t.lanes=0,Ia(e,t,n)}return es(e,t,n)}Ma=0!=(16384&e.flags)}else Ma=!1;switch(t.lanes=0,t.tag){case 2:if(r=t.type,null!==e&&(e.alternate=null,t.alternate=null,t.flags|=2),e=t.pendingProps,o=fo(t,lo.current),ti(t,n),o=na(null,t,r,e,o,n),t.flags|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof){if(t.tag=1,t.memoizedState=null,t.updateQueue=null,po(r)){var i=!0;vo(t)}else i=!1;t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null,oi(t);var s=r.getDerivedStateFromProps;"function"==typeof s&&pi(t,r,s,e),o.updater=di,t.stateNode=o,o._reactInternals=t,vi(t,r,e,n),t=Ha(null,t,r,!0,i,n)}else t.tag=0,ja(null,t,o,n),t=t.child;return t;case 16:o=t.elementType;e:{switch(null!==e&&(e.alternate=null,t.alternate=null,t.flags|=2),e=t.pendingProps,o=(i=o._init)(o._payload),t.type=o,i=t.tag=function(e){if("function"==typeof e)return zl(e)?1:0;if(null!=e){if((e=e.$$typeof)===T)return 11;if(e===M)return 14}return 2}(o),e=Qo(o,e),i){case 0:t=Ba(null,t,o,e,n);break e;case 1:t=Ua(null,t,o,e,n);break e;case 11:t=Da(null,t,o,e,n);break e;case 14:t=Aa(null,t,o,Qo(o.type,e),r,n);break e}throw Error(a(306,o,""))}return t;case 0:return r=t.type,o=t.pendingProps,Ba(e,t,r,o=t.elementType===r?o:Qo(r,o),n);case 1:return r=t.type,o=t.pendingProps,Ua(e,t,r,o=t.elementType===r?o:Qo(r,o),n);case 3:if(Fa(t),r=t.updateQueue,null===e||null===r)throw Error(a(282));if(r=t.pendingProps,o=null!==(o=t.memoizedState)?o.element:null,ii(e,t),ui(t,r,null,n),(r=t.memoizedState.element)===o)Wi(),t=es(e,t,n);else{if((i=(o=t.stateNode).hydrate)&&(Ri=Wr(t.stateNode.containerInfo.firstChild),Ai=t,i=Ii=!0),i){if(null!=(e=o.mutableSourceEagerHydrationData))for(o=0;o<e.length;o+=2)(i=e[o])._workInProgressVersionPrimary=e[o+1],$i.push(i);for(n=_i(t,null,r,n),t.child=n;n;)n.flags=-3&n.flags|1024,n=n.sibling}else ja(e,t,r,n),Wi();t=t.child}return t;case 5:return Ni(t),null===e&&Ui(t),r=t.type,o=t.pendingProps,i=null!==e?e.memoizedProps:null,s=o.children,Br(r,o)?s=null:null!==i&&Br(r,i)&&(t.flags|=16),za(e,t),ja(e,t,s,n),t.child;case 6:return null===e&&Ui(t),null;case 13:return Qa(e,t,n);case 4:return Ti(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=xi(t,null,r,n):ja(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,Da(e,t,r,o=t.elementType===r?o:Qo(r,o),n);case 7:return ja(e,t,t.pendingProps,n),t.child;case 8:case 12:return ja(e,t,t.pendingProps.children,n),t.child;case 10:e:{r=t.type._context,o=t.pendingProps,s=t.memoizedProps,i=o.value;var l=t.type._context;if(ao(Ko,l._currentValue),l._currentValue=i,null!==s)if(l=s.value,0===(i=ar(l,i)?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,i):1073741823))){if(s.children===o.children&&!uo.current){t=es(e,t,n);break e}}else for(null!==(l=t.child)&&(l.return=t);null!==l;){var u=l.dependencies;if(null!==u){s=l.child;for(var c=u.firstContext;null!==c;){if(c.context===r&&0!=(c.observedBits&i)){1===l.tag&&((c=ai(-1,n&-n)).tag=2,si(l,c)),l.lanes|=n,null!==(c=l.alternate)&&(c.lanes|=n),ei(l.return,n),u.lanes|=n;break}c=c.next}}else s=10===l.tag&&l.type===t.type?null:l.child;if(null!==s)s.return=l;else for(s=l;null!==s;){if(s===t){s=null;break}if(null!==(l=s.sibling)){l.return=s.return,s=l;break}s=s.return}l=s}ja(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=(i=t.pendingProps).children,ti(t,n),r=r(o=ni(o,i.unstable_observedBits)),t.flags|=1,ja(e,t,r,n),t.child;case 14:return i=Qo(o=t.type,t.pendingProps),Aa(e,t,o,i=Qo(o.type,i),r,n);case 15:return Ra(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Qo(r,o),null!==e&&(e.alternate=null,t.alternate=null,t.flags|=2),t.tag=1,po(r)?(e=!0,vo(t)):e=!1,ti(t,n),mi(t,r,o),vi(t,r,o,n),Ha(null,t,r,!0,e,n);case 19:return Ja(e,t,n);case 23:case 24:return Ia(e,t,n)}throw Error(a(156,t.tag))},Gl.prototype.render=function(e){Ql(e,this._internalRoot,null,null)},Gl.prototype.unmount=function(){var e=this._internalRoot,t=e.containerInfo;Ql(null,e,null,(function(){t[Yr]=null}))},et=function(e){13===e.tag&&(sl(e,4,il()),Xl(e,4))},tt=function(e){13===e.tag&&(sl(e,67108864,il()),Xl(e,67108864))},nt=function(e){if(13===e.tag){var t=il(),n=al(e);sl(e,n,t),Xl(e,n)}},rt=function(e,t){return t()},Se=function(e,t,n){switch(t){case"input":if(ne(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=eo(r);if(!o)throw Error(a(90));G(r),ne(r,o)}}}break;case"textarea":ue(e,n);break;case"select":null!=(t=n.value)&&ae(e,!!n.multiple,t,!1)}},Me=dl,je=function(e,t,n,r,o){var i=Cs;Cs|=4;try{return Fo(98,e.bind(null,t,n,r,o))}finally{0===(Cs=i)&&(Us(),$o())}},De=function(){0==(49&Cs)&&(function(){if(null!==Gs){var e=Gs;Gs=null,e.forEach((function(e){e.expiredLanes|=24&e.pendingLanes,ul(e,Bo())}))}$o()}(),Pl())},Ae=function(e,t){var n=Cs;Cs|=2;try{return e(t)}finally{0===(Cs=n)&&(Us(),$o())}};var tu={Events:[Zr,Jr,eo,Le,Ne,Pl,{current:!1}]},nu={findFiberByHostInstance:Gr,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"},ru={bundleType:nu.bundleType,version:nu.version,rendererPackageName:nu.rendererPackageName,rendererConfig:nu.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:E.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return null===(e=Ze(e))?null:e.stateNode},findFiberByHostInstance:nu.findFiberByHostInstance||function(){return null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var ou=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ou.isDisabled&&ou.supportsFiber)try{bo=ou.inject(ru),wo=ou}catch(e){}}t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tu,t.createPortal=eu,t.findDOMNode=function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternals;if(void 0===t){if("function"==typeof e.render)throw Error(a(188));throw Error(a(268,Object.keys(e)))}return e=null===(e=Ze(t))?null:e.stateNode},t.flushSync=function(e,t){var n=Cs;if(0!=(48&n))return e(t);Cs|=1;try{if(e)return Fo(99,e.bind(null,t))}finally{Cs=n,$o()}},t.hydrate=function(e,t,n){if(!Zl(t))throw Error(a(200));return Jl(null,e,t,!0,n)},t.render=function(e,t,n){if(!Zl(t))throw Error(a(200));return Jl(null,e,t,!1,n)},t.unmountComponentAtNode=function(e){if(!Zl(e))throw Error(a(40));return!!e._reactRootContainer&&(hl((function(){Jl(null,null,e,!1,(function(){e._reactRootContainer=null,e[Yr]=null}))})),!0)},t.unstable_batchedUpdates=dl,t.unstable_createPortal=function(e,t){return eu(e,t,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)},t.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Zl(n))throw Error(a(200));if(null==e||void 0===e._reactInternals)throw Error(a(38));return Jl(e,t,n,!1,r)},t.version="17.0.2"},function(e,t,n){"use strict";e.exports=n(17)},function(e,t,n){"use strict";
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r,o,i,a;if("object"==typeof performance&&"function"==typeof performance.now){var s=performance;t.unstable_now=function(){return s.now()}}else{var l=Date,u=l.now();t.unstable_now=function(){return l.now()-u}}if("undefined"==typeof window||"function"!=typeof MessageChannel){var c=null,f=null,p=function(){if(null!==c)try{var e=t.unstable_now();c(!0,e),c=null}catch(e){throw setTimeout(p,0),e}};r=function(e){null!==c?setTimeout(r,0,e):(c=e,setTimeout(p,0))},o=function(e,t){f=setTimeout(e,t)},i=function(){clearTimeout(f)},t.unstable_shouldYield=function(){return!1},a=t.unstable_forceFrameRate=function(){}}else{var d=window.setTimeout,h=window.clearTimeout;if("undefined"!=typeof console){var m=window.cancelAnimationFrame;"function"!=typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"),"function"!=typeof m&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var g=!1,v=null,y=-1,b=5,w=0;t.unstable_shouldYield=function(){return t.unstable_now()>=w},a=function(){},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<e?Math.floor(1e3/e):5};var E=new MessageChannel,x=E.port2;E.port1.onmessage=function(){if(null!==v){var e=t.unstable_now();w=e+b;try{v(!0,e)?x.postMessage(null):(g=!1,v=null)}catch(e){throw x.postMessage(null),e}}else g=!1},r=function(e){v=e,g||(g=!0,x.postMessage(null))},o=function(e,n){y=d((function(){e(t.unstable_now())}),n)},i=function(){h(y),y=-1}}function _(e,t){var n=e.length;e.push(t);e:for(;;){var r=n-1>>>1,o=e[r];if(!(void 0!==o&&0<S(o,t)))break e;e[r]=t,e[n]=o,n=r}}function k(e){return void 0===(e=e[0])?null:e}function C(e){var t=e[0];if(void 0!==t){var n=e.pop();if(n!==t){e[0]=n;e:for(var r=0,o=e.length;r<o;){var i=2*(r+1)-1,a=e[i],s=i+1,l=e[s];if(void 0!==a&&0>S(a,n))void 0!==l&&0>S(l,a)?(e[r]=l,e[s]=n,r=s):(e[r]=a,e[i]=n,r=i);else{if(!(void 0!==l&&0>S(l,n)))break e;e[r]=l,e[s]=n,r=s}}}return t}return null}function S(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}var O=[],P=[],T=1,L=null,N=3,M=!1,j=!1,D=!1;function A(e){for(var t=k(P);null!==t;){if(null===t.callback)C(P);else{if(!(t.startTime<=e))break;C(P),t.sortIndex=t.expirationTime,_(O,t)}t=k(P)}}function R(e){if(D=!1,A(e),!j)if(null!==k(O))j=!0,r(I);else{var t=k(P);null!==t&&o(R,t.startTime-e)}}function I(e,n){j=!1,D&&(D=!1,i()),M=!0;var r=N;try{for(A(n),L=k(O);null!==L&&(!(L.expirationTime>n)||e&&!t.unstable_shouldYield());){var a=L.callback;if("function"==typeof a){L.callback=null,N=L.priorityLevel;var s=a(L.expirationTime<=n);n=t.unstable_now(),"function"==typeof s?L.callback=s:L===k(O)&&C(O),A(n)}else C(O);L=k(O)}if(null!==L)var l=!0;else{var u=k(P);null!==u&&o(R,u.startTime-n),l=!1}return l}finally{L=null,N=r,M=!1}}var z=a;t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_continueExecution=function(){j||M||(j=!0,r(I))},t.unstable_getCurrentPriorityLevel=function(){return N},t.unstable_getFirstCallbackNode=function(){return k(O)},t.unstable_next=function(e){switch(N){case 1:case 2:case 3:var t=3;break;default:t=N}var n=N;N=t;try{return e()}finally{N=n}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=z,t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=N;N=e;try{return t()}finally{N=n}},t.unstable_scheduleCallback=function(e,n,a){var s=t.unstable_now();switch("object"==typeof a&&null!==a?a="number"==typeof(a=a.delay)&&0<a?s+a:s:a=s,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return e={id:T++,callback:n,priorityLevel:e,startTime:a,expirationTime:l=a+l,sortIndex:-1},a>s?(e.sortIndex=a,_(P,e),null===k(O)&&e===k(P)&&(D?i():D=!0,o(R,a-s))):(e.sortIndex=l,_(O,e),j||M||(j=!0,r(I))),e},t.unstable_wrapCallback=function(e){var t=N;return function(){var n=N;N=t;try{return e.apply(this,arguments)}finally{N=n}}}},function(e,t,n){"use strict";var r=n(19);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,i,a){if(a!==r){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";e.exports=n(21)},function(e,t,n){"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,i=r?Symbol.for("react.portal"):60106,a=r?Symbol.for("react.fragment"):60107,s=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,u=r?Symbol.for("react.provider"):60109,c=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,p=r?Symbol.for("react.concurrent_mode"):60111,d=r?Symbol.for("react.forward_ref"):60112,h=r?Symbol.for("react.suspense"):60113,m=r?Symbol.for("react.suspense_list"):60120,g=r?Symbol.for("react.memo"):60115,v=r?Symbol.for("react.lazy"):60116,y=r?Symbol.for("react.block"):60121,b=r?Symbol.for("react.fundamental"):60117,w=r?Symbol.for("react.responder"):60118,E=r?Symbol.for("react.scope"):60119;function x(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case p:case a:case l:case s:case h:return e;default:switch(e=e&&e.$$typeof){case c:case d:case v:case g:case u:return e;default:return t}}case i:return t}}}function _(e){return x(e)===p}t.AsyncMode=f,t.ConcurrentMode=p,t.ContextConsumer=c,t.ContextProvider=u,t.Element=o,t.ForwardRef=d,t.Fragment=a,t.Lazy=v,t.Memo=g,t.Portal=i,t.Profiler=l,t.StrictMode=s,t.Suspense=h,t.isAsyncMode=function(e){return _(e)||x(e)===f},t.isConcurrentMode=_,t.isContextConsumer=function(e){return x(e)===c},t.isContextProvider=function(e){return x(e)===u},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return x(e)===d},t.isFragment=function(e){return x(e)===a},t.isLazy=function(e){return x(e)===v},t.isMemo=function(e){return x(e)===g},t.isPortal=function(e){return x(e)===i},t.isProfiler=function(e){return x(e)===l},t.isStrictMode=function(e){return x(e)===s},t.isSuspense=function(e){return x(e)===h},t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===a||e===p||e===l||e===s||e===h||e===m||"object"==typeof e&&null!==e&&(e.$$typeof===v||e.$$typeof===g||e.$$typeof===u||e.$$typeof===c||e.$$typeof===d||e.$$typeof===b||e.$$typeof===w||e.$$typeof===E||e.$$typeof===y)},t.typeOf=x},function(e,t,n){"use strict";
/** @license React v17.0.2
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=60103,o=60106,i=60107,a=60108,s=60114,l=60109,u=60110,c=60112,f=60113,p=60120,d=60115,h=60116,m=60121,g=60122,v=60117,y=60129,b=60131;if("function"==typeof Symbol&&Symbol.for){var w=Symbol.for;r=w("react.element"),o=w("react.portal"),i=w("react.fragment"),a=w("react.strict_mode"),s=w("react.profiler"),l=w("react.provider"),u=w("react.context"),c=w("react.forward_ref"),f=w("react.suspense"),p=w("react.suspense_list"),d=w("react.memo"),h=w("react.lazy"),m=w("react.block"),g=w("react.server.block"),v=w("react.fundamental"),y=w("react.debug_trace_mode"),b=w("react.legacy_hidden")}function E(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case r:switch(e=e.type){case i:case s:case a:case f:case p:return e;default:switch(e=e&&e.$$typeof){case u:case c:case h:case d:case l:return e;default:return t}}case o:return t}}}var x=l,_=r,k=c,C=i,S=h,O=d,P=o,T=s,L=a,N=f;t.ContextConsumer=u,t.ContextProvider=x,t.Element=_,t.ForwardRef=k,t.Fragment=C,t.Lazy=S,t.Memo=O,t.Portal=P,t.Profiler=T,t.StrictMode=L,t.Suspense=N,t.isAsyncMode=function(){return!1},t.isConcurrentMode=function(){return!1},t.isContextConsumer=function(e){return E(e)===u},t.isContextProvider=function(e){return E(e)===l},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r},t.isForwardRef=function(e){return E(e)===c},t.isFragment=function(e){return E(e)===i},t.isLazy=function(e){return E(e)===h},t.isMemo=function(e){return E(e)===d},t.isPortal=function(e){return E(e)===o},t.isProfiler=function(e){return E(e)===s},t.isStrictMode=function(e){return E(e)===a},t.isSuspense=function(e){return E(e)===f},t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===i||e===s||e===y||e===a||e===f||e===p||e===b||"object"==typeof e&&null!==e&&(e.$$typeof===h||e.$$typeof===d||e.$$typeof===l||e.$$typeof===u||e.$$typeof===c||e.$$typeof===v||e.$$typeof===m||e[0]===g)},t.typeOf=E},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";e.exports=n(25)},function(e,t,n){"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r="function"==typeof Symbol&&Symbol.for,o=r?Symbol.for("react.element"):60103,i=r?Symbol.for("react.portal"):60106,a=r?Symbol.for("react.fragment"):60107,s=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,u=r?Symbol.for("react.provider"):60109,c=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,p=r?Symbol.for("react.concurrent_mode"):60111,d=r?Symbol.for("react.forward_ref"):60112,h=r?Symbol.for("react.suspense"):60113,m=r?Symbol.for("react.suspense_list"):60120,g=r?Symbol.for("react.memo"):60115,v=r?Symbol.for("react.lazy"):60116,y=r?Symbol.for("react.block"):60121,b=r?Symbol.for("react.fundamental"):60117,w=r?Symbol.for("react.responder"):60118,E=r?Symbol.for("react.scope"):60119;function x(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case o:switch(e=e.type){case f:case p:case a:case l:case s:case h:return e;default:switch(e=e&&e.$$typeof){case c:case d:case v:case g:case u:return e;default:return t}}case i:return t}}}function _(e){return x(e)===p}t.AsyncMode=f,t.ConcurrentMode=p,t.ContextConsumer=c,t.ContextProvider=u,t.Element=o,t.ForwardRef=d,t.Fragment=a,t.Lazy=v,t.Memo=g,t.Portal=i,t.Profiler=l,t.StrictMode=s,t.Suspense=h,t.isAsyncMode=function(e){return _(e)||x(e)===f},t.isConcurrentMode=_,t.isContextConsumer=function(e){return x(e)===c},t.isContextProvider=function(e){return x(e)===u},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.isForwardRef=function(e){return x(e)===d},t.isFragment=function(e){return x(e)===a},t.isLazy=function(e){return x(e)===v},t.isMemo=function(e){return x(e)===g},t.isPortal=function(e){return x(e)===i},t.isProfiler=function(e){return x(e)===l},t.isStrictMode=function(e){return x(e)===s},t.isSuspense=function(e){return x(e)===h},t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===a||e===p||e===l||e===s||e===h||e===m||"object"==typeof e&&null!==e&&(e.$$typeof===v||e.$$typeof===g||e.$$typeof===u||e.$$typeof===c||e.$$typeof===d||e.$$typeof===b||e.$$typeof===w||e.$$typeof===E||e.$$typeof===y)},t.typeOf=x},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==s(e)&&"function"!=typeof e)return{default:e};var t=a();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var i=r?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n(0)),i=(r=n(27))&&r.__esModule?r:{default:r};function a(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return a=function(){return e},e}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var d=function(e){function t(e){var n,r,i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,(n=!(i=c(t).call(this,e))||"object"!==s(i)&&"function"!=typeof i?f(r):i).state={selected:n.parseValue(e.value,e.options)||{label:void 0===e.placeholder?"Select...":e.placeholder,value:""},isOpen:!1},n.dropdownRef=(0,o.createRef)(),n.mounted=!0,n.handleDocumentClick=n.handleDocumentClick.bind(f(n)),n.fireChangeEvent=n.fireChangeEvent.bind(f(n)),n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(t,e),n=t,(r=[{key:"componentDidUpdate",value:function(e){if(this.props.value!==e.value)if(this.props.value){var t=this.parseValue(this.props.value,this.props.options);t!==this.state.selected&&this.setState({selected:t})}else this.setState({selected:{label:void 0===this.props.placeholder?"Select...":this.props.placeholder,value:""}})}},{key:"componentDidMount",value:function(){document.addEventListener("click",this.handleDocumentClick,!1),document.addEventListener("touchend",this.handleDocumentClick,!1)}},{key:"componentWillUnmount",value:function(){this.mounted=!1,document.removeEventListener("click",this.handleDocumentClick,!1),document.removeEventListener("touchend",this.handleDocumentClick,!1)}},{key:"handleMouseDown",value:function(e){this.props.onFocus&&"function"==typeof this.props.onFocus&&this.props.onFocus(this.state.isOpen),"mousedown"===e.type&&0!==e.button||(e.stopPropagation(),e.preventDefault(),this.props.disabled||this.setState({isOpen:!this.state.isOpen}))}},{key:"parseValue",value:function(e,t){var n;if("string"==typeof e)for(var r=0,o=t.length;r<o;r++)if("group"===t[r].type){var i=t[r].items.filter((function(t){return t.value===e}));i.length&&(n=i[0])}else void 0!==t[r].value&&t[r].value===e&&(n=t[r]);return n||e}},{key:"setValue",value:function(e,t){var n={selected:{value:e,label:t},isOpen:!1};this.fireChangeEvent(n),this.setState(n)}},{key:"fireChangeEvent",value:function(e){e.selected!==this.state.selected&&this.props.onChange&&this.props.onChange(e.selected)}},{key:"renderOption",value:function(e){var t,n=e.value;void 0===n&&(n=e.label||e);var r=e.label||e.value||e,a=n===this.state.selected.value||n===this.state.selected,s=(l(t={},"".concat(this.props.baseClassName,"-option"),!0),l(t,e.className,!!e.className),l(t,"is-selected",a),t),u=(0,i.default)(s);return o.default.createElement("div",{key:n,className:u,onMouseDown:this.setValue.bind(this,n,r),onClick:this.setValue.bind(this,n,r),role:"option","aria-selected":a?"true":"false"},r)}},{key:"buildMenu",value:function(){var e=this,t=this.props,n=t.options,r=t.baseClassName,i=n.map((function(t){if("group"===t.type){var n=o.default.createElement("div",{className:"".concat(r,"-title")},t.name),i=t.items.map((function(t){return e.renderOption(t)}));return o.default.createElement("div",{className:"".concat(r,"-group"),key:t.name,role:"listbox",tabIndex:"-1"},n,i)}return e.renderOption(t)}));return i.length?i:o.default.createElement("div",{className:"".concat(r,"-noresults")},"No options found")}},{key:"handleDocumentClick",value:function(e){this.mounted&&(this.dropdownRef.current.contains(e.target)||this.state.isOpen&&this.setState({isOpen:!1}))}},{key:"isValueSelected",value:function(){return"string"==typeof this.state.selected||""!==this.state.selected.value}},{key:"render",value:function(){var e,t,n,r,a,s=this.props,u=s.baseClassName,c=s.controlClassName,f=s.placeholderClassName,p=s.menuClassName,d=s.arrowClassName,h=s.arrowClosed,m=s.arrowOpen,g=s.className,v=this.props.disabled?"Dropdown-disabled":"",y="string"==typeof this.state.selected?this.state.selected:this.state.selected.label,b=(0,i.default)((l(e={},"".concat(u,"-root"),!0),l(e,g,!!g),l(e,"is-open",this.state.isOpen),e)),w=(0,i.default)((l(t={},"".concat(u,"-control"),!0),l(t,c,!!c),l(t,v,!!v),t)),E=(0,i.default)((l(n={},"".concat(u,"-placeholder"),!0),l(n,f,!!f),l(n,"is-selected",this.isValueSelected()),n)),x=(0,i.default)((l(r={},"".concat(u,"-menu"),!0),l(r,p,!!p),r)),_=(0,i.default)((l(a={},"".concat(u,"-arrow"),!0),l(a,d,!!d),a)),k=o.default.createElement("div",{className:E},y),C=this.state.isOpen?o.default.createElement("div",{className:x,"aria-expanded":"true"},this.buildMenu()):null;return o.default.createElement("div",{ref:this.dropdownRef,className:b},o.default.createElement("div",{className:w,onMouseDown:this.handleMouseDown.bind(this),onTouchEnd:this.handleMouseDown.bind(this),"aria-haspopup":"listbox"},k,o.default.createElement("div",{className:"".concat(u,"-arrow-wrapper")},m&&h?this.state.isOpen?m:h:o.default.createElement("span",{className:_}))),C)}}])&&u(n.prototype,r),a&&u(n,a),t}(o.Component);d.defaultProps={baseClassName:"Dropdown"};var h=d;t.default=h},function(e,t,n){var r;
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var i=typeof r;if("string"===i||"number"===i)e.push(r);else if(Array.isArray(r)){if(r.length){var a=o.apply(null,r);a&&e.push(a)}}else if("object"===i)if(r.toString===Object.prototype.toString)for(var s in r)n.call(r,s)&&r[s]&&e.push(s);else e.push(r.toString())}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(r=function(){return o}.apply(t,[]))||(e.exports=r)}()},function(e,t,n){var r;
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */!function(t,n){"use strict";"object"==typeof e.exports?e.exports=t.document?n(t,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return n(e)}:n(t)}("undefined"!=typeof window?window:this,(function(n,o){"use strict";var i=[],a=Object.getPrototypeOf,s=i.slice,l=i.flat?function(e){return i.flat.call(e)}:function(e){return i.concat.apply([],e)},u=i.push,c=i.indexOf,f={},p=f.toString,d=f.hasOwnProperty,h=d.toString,m=h.call(Object),g={},v=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},y=function(e){return null!=e&&e===e.window},b=n.document,w={type:!0,src:!0,nonce:!0,noModule:!0};function E(e,t,n){var r,o,i=(n=n||b).createElement("script");if(i.text=e,t)for(r in w)(o=t[r]||t.getAttribute&&t.getAttribute(r))&&i.setAttribute(r,o);n.head.appendChild(i).parentNode.removeChild(i)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?f[p.call(e)]||"object":typeof e}var _=function(e,t){return new _.fn.init(e,t)};function k(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!v(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}_.fn=_.prototype={jquery:"3.6.0",constructor:_,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=_.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return _.each(this,e)},map:function(e){return this.pushStack(_.map(this,(function(t,n){return e.call(t,n,t)})))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(_.grep(this,(function(e,t){return(t+1)%2})))},odd:function(){return this.pushStack(_.grep(this,(function(e,t){return t%2})))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:i.sort,splice:i.splice},_.extend=_.fn.extend=function(){var e,t,n,r,o,i,a=arguments[0]||{},s=1,l=arguments.length,u=!1;for("boolean"==typeof a&&(u=a,a=arguments[s]||{},s++),"object"==typeof a||v(a)||(a={}),s===l&&(a=this,s--);s<l;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(u&&r&&(_.isPlainObject(r)||(o=Array.isArray(r)))?(n=a[t],i=o&&!Array.isArray(n)?[]:o||_.isPlainObject(n)?n:{},o=!1,a[t]=_.extend(u,i,r)):void 0!==r&&(a[t]=r));return a},_.extend({expando:"jQuery"+("3.6.0"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==p.call(e))&&(!(t=a(e))||"function"==typeof(n=d.call(t,"constructor")&&t.constructor)&&h.call(n)===m)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){E(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(k(e))for(n=e.length;r<n&&!1!==t.call(e[r],r,e[r]);r++);else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(k(Object(e))?_.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:c.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,o=e.length;r<n;r++)e[o++]=t[r];return e.length=o,e},grep:function(e,t,n){for(var r=[],o=0,i=e.length,a=!n;o<i;o++)!t(e[o],o)!==a&&r.push(e[o]);return r},map:function(e,t,n){var r,o,i=0,a=[];if(k(e))for(r=e.length;i<r;i++)null!=(o=t(e[i],i,n))&&a.push(o);else for(i in e)null!=(o=t(e[i],i,n))&&a.push(o);return l(a)},guid:1,support:g}),"function"==typeof Symbol&&(_.fn[Symbol.iterator]=i[Symbol.iterator]),_.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),(function(e,t){f["[object "+t+"]"]=t.toLowerCase()}));var C=
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
function(e){var t,n,r,o,i,a,s,l,u,c,f,p,d,h,m,g,v,y,b,w="sizzle"+1*new Date,E=e.document,x=0,_=0,k=le(),C=le(),S=le(),O=le(),P=function(e,t){return e===t&&(f=!0),0},T={}.hasOwnProperty,L=[],N=L.pop,M=L.push,j=L.push,D=L.slice,A=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",I="[\\x20\\t\\r\\n\\f]",z="(?:\\\\[\\da-fA-F]{1,6}"+I+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",B="\\["+I+"*("+z+")(?:"+I+"*([*^$|!~]?=)"+I+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+z+"))|)"+I+"*\\]",U=":("+z+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+B+")*)|.*)\\)|)",H=new RegExp(I+"+","g"),F=new RegExp("^"+I+"+|((?:^|[^\\\\])(?:\\\\.)*)"+I+"+$","g"),W=new RegExp("^"+I+"*,"+I+"*"),$=new RegExp("^"+I+"*([>+~]|"+I+")"+I+"*"),q=new RegExp(I+"|>"),V=new RegExp(U),Q=new RegExp("^"+z+"$"),K={ID:new RegExp("^#("+z+")"),CLASS:new RegExp("^\\.("+z+")"),TAG:new RegExp("^("+z+"|[*])"),ATTR:new RegExp("^"+B),PSEUDO:new RegExp("^"+U),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+I+"*(even|odd|(([+-]|)(\\d*)n|)"+I+"*(?:([+-]|)"+I+"*(\\d+)|))"+I+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+I+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+I+"*((?:-\\d)?\\d*)"+I+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,X=/^(?:input|select|textarea|button)$/i,G=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+I+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,oe=function(e,t){return t?"\0"===e?"�":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},ie=function(){p()},ae=we((function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()}),{dir:"parentNode",next:"legend"});try{j.apply(L=D.call(E.childNodes),E.childNodes),L[E.childNodes.length].nodeType}catch(e){j={apply:L.length?function(e,t){M.apply(e,D.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}function se(e,t,r,o){var i,s,u,c,f,h,v,y=t&&t.ownerDocument,E=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==E&&9!==E&&11!==E)return r;if(!o&&(p(t),t=t||d,m)){if(11!==E&&(f=J.exec(e)))if(i=f[1]){if(9===E){if(!(u=t.getElementById(i)))return r;if(u.id===i)return r.push(u),r}else if(y&&(u=y.getElementById(i))&&b(t,u)&&u.id===i)return r.push(u),r}else{if(f[2])return j.apply(r,t.getElementsByTagName(e)),r;if((i=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return j.apply(r,t.getElementsByClassName(i)),r}if(n.qsa&&!O[e+" "]&&(!g||!g.test(e))&&(1!==E||"object"!==t.nodeName.toLowerCase())){if(v=e,y=t,1===E&&(q.test(e)||$.test(e))){for((y=ee.test(e)&&ve(t.parentNode)||t)===t&&n.scope||((c=t.getAttribute("id"))?c=c.replace(re,oe):t.setAttribute("id",c=w)),s=(h=a(e)).length;s--;)h[s]=(c?"#"+c:":scope")+" "+be(h[s]);v=h.join(",")}try{return j.apply(r,y.querySelectorAll(v)),r}catch(t){O(e,!0)}finally{c===w&&t.removeAttribute("id")}}}return l(e.replace(F,"$1"),t,r,o)}function le(){var e=[];return function t(n,o){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=o}}function ue(e){return e[w]=!0,e}function ce(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){for(var n=e.split("|"),o=n.length;o--;)r.attrHandle[n[o]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function de(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function he(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function me(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ae(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function ge(e){return ue((function(t){return t=+t,ue((function(n,r){for(var o,i=e([],n.length,t),a=i.length;a--;)n[o=i[a]]&&(n[o]=!(r[o]=n[o]))}))}))}function ve(e){return e&&void 0!==e.getElementsByTagName&&e}for(t in n=se.support={},i=se.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},p=se.setDocument=function(e){var t,o,a=e?e.ownerDocument||e:E;return a!=d&&9===a.nodeType&&a.documentElement?(h=(d=a).documentElement,m=!i(d),E!=d&&(o=d.defaultView)&&o.top!==o&&(o.addEventListener?o.addEventListener("unload",ie,!1):o.attachEvent&&o.attachEvent("onunload",ie)),n.scope=ce((function(e){return h.appendChild(e).appendChild(d.createElement("div")),void 0!==e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length})),n.attributes=ce((function(e){return e.className="i",!e.getAttribute("className")})),n.getElementsByTagName=ce((function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length})),n.getElementsByClassName=Z.test(d.getElementsByClassName),n.getById=ce((function(e){return h.appendChild(e).id=w,!d.getElementsByName||!d.getElementsByName(w).length})),n.getById?(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&m){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(te,ne);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if(void 0!==t.getElementById&&m){var n,r,o,i=t.getElementById(e);if(i){if((n=i.getAttributeNode("id"))&&n.value===e)return[i];for(o=t.getElementsByName(e),r=0;i=o[r++];)if((n=i.getAttributeNode("id"))&&n.value===e)return[i]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],o=0,i=t.getElementsByTagName(e);if("*"===e){for(;n=i[o++];)1===n.nodeType&&r.push(n);return r}return i},r.find.CLASS=n.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&m)return t.getElementsByClassName(e)},v=[],g=[],(n.qsa=Z.test(d.querySelectorAll))&&(ce((function(e){var t;h.appendChild(e).innerHTML="<a id='"+w+"'></a><select id='"+w+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&g.push("[*^$]="+I+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||g.push("\\["+I+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+w+"-]").length||g.push("~="),(t=d.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||g.push("\\["+I+"*name"+I+"*="+I+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||g.push(":checked"),e.querySelectorAll("a#"+w+"+*").length||g.push(".#.+[+~]"),e.querySelectorAll("\\\f"),g.push("[\\r\\n\\f]")})),ce((function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&g.push("name"+I+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&g.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")}))),(n.matchesSelector=Z.test(y=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ce((function(e){n.disconnectedMatch=y.call(e,"*"),y.call(e,"[s!='']:x"),v.push("!=",U)})),g=g.length&&new RegExp(g.join("|")),v=v.length&&new RegExp(v.join("|")),t=Z.test(h.compareDocumentPosition),b=t||Z.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},P=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e==d||e.ownerDocument==E&&b(E,e)?-1:t==d||t.ownerDocument==E&&b(E,t)?1:c?A(c,e)-A(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,o=e.parentNode,i=t.parentNode,a=[e],s=[t];if(!o||!i)return e==d?-1:t==d?1:o?-1:i?1:c?A(c,e)-A(c,t):0;if(o===i)return pe(e,t);for(n=e;n=n.parentNode;)a.unshift(n);for(n=t;n=n.parentNode;)s.unshift(n);for(;a[r]===s[r];)r++;return r?pe(a[r],s[r]):a[r]==E?-1:s[r]==E?1:0},d):d},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(p(e),n.matchesSelector&&m&&!O[t+" "]&&(!v||!v.test(t))&&(!g||!g.test(t)))try{var r=y.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){O(t,!0)}return se(t,d,null,[e]).length>0},se.contains=function(e,t){return(e.ownerDocument||e)!=d&&p(e),b(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=d&&p(e);var o=r.attrHandle[t.toLowerCase()],i=o&&T.call(r.attrHandle,t.toLowerCase())?o(e,t,!m):void 0;return void 0!==i?i:n.attributes||!m?e.getAttribute(t):(i=e.getAttributeNode(t))&&i.specified?i.value:null},se.escape=function(e){return(e+"").replace(re,oe)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,r=[],o=0,i=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(P),f){for(;t=e[i++];)t===e[i]&&(o=r.push(i));for(;o--;)e.splice(r[o],1)}return c=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=o(t);return n},(r=se.selectors={cacheLength:50,createPseudo:ue,match:K,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return K.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&V.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=k[e+" "];return t||(t=new RegExp("(^|"+I+")"+e+"("+I+"|$)"))&&k(e,(function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")}))},ATTR:function(e,t,n){return function(r){var o=se.attr(r,e);return null==o?"!="===t:!t||(o+="","="===t?o===n:"!="===t?o!==n:"^="===t?n&&0===o.indexOf(n):"*="===t?n&&o.indexOf(n)>-1:"$="===t?n&&o.slice(-n.length)===n:"~="===t?(" "+o.replace(H," ")+" ").indexOf(n)>-1:"|="===t&&(o===n||o.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,o){var i="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===o?function(e){return!!e.parentNode}:function(t,n,l){var u,c,f,p,d,h,m=i!==a?"nextSibling":"previousSibling",g=t.parentNode,v=s&&t.nodeName.toLowerCase(),y=!l&&!s,b=!1;if(g){if(i){for(;m;){for(p=t;p=p[m];)if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=m="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?g.firstChild:g.lastChild],a&&y){for(b=(d=(u=(c=(f=(p=g)[w]||(p[w]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===x&&u[1])&&u[2],p=d&&g.childNodes[d];p=++d&&p&&p[m]||(b=d=0)||h.pop();)if(1===p.nodeType&&++b&&p===t){c[e]=[x,d,b];break}}else if(y&&(b=d=(u=(c=(f=(p=t)[w]||(p[w]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===x&&u[1]),!1===b)for(;(p=++d&&p&&p[m]||(b=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==v:1!==p.nodeType)||!++b||(y&&((c=(f=p[w]||(p[w]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[x,b]),p!==t)););return(b-=o)===r||b%r==0&&b/r>=0}}},PSEUDO:function(e,t){var n,o=r.pseudos[e]||r.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return o[w]?o(t):o.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?ue((function(e,n){for(var r,i=o(e,t),a=i.length;a--;)e[r=A(e,i[a])]=!(n[r]=i[a])})):function(e){return o(e,0,n)}):o}},pseudos:{not:ue((function(e){var t=[],n=[],r=s(e.replace(F,"$1"));return r[w]?ue((function(e,t,n,o){for(var i,a=r(e,null,o,[]),s=e.length;s--;)(i=a[s])&&(e[s]=!(t[s]=i))})):function(e,o,i){return t[0]=e,r(t,null,i,n),t[0]=null,!n.pop()}})),has:ue((function(e){return function(t){return se(e,t).length>0}})),contains:ue((function(e){return e=e.replace(te,ne),function(t){return(t.textContent||o(t)).indexOf(e)>-1}})),lang:ue((function(e){return Q.test(e||"")||se.error("unsupported lang: "+e),e=e.replace(te,ne).toLowerCase(),function(t){var n;do{if(n=m?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}})),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:me(!1),disabled:me(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return G.test(e.nodeName)},input:function(e){return X.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ge((function(){return[0]})),last:ge((function(e,t){return[t-1]})),eq:ge((function(e,t,n){return[n<0?n+t:n]})),even:ge((function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e})),odd:ge((function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e})),lt:ge((function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e})),gt:ge((function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e}))}}).pseudos.nth=r.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=de(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=he(t);function ye(){}function be(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function we(e,t,n){var r=t.dir,o=t.next,i=o||r,a=n&&"parentNode"===i,s=_++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||a)return e(t,n,o);return!1}:function(t,n,l){var u,c,f,p=[x,s];if(l){for(;t=t[r];)if((1===t.nodeType||a)&&e(t,n,l))return!0}else for(;t=t[r];)if(1===t.nodeType||a)if(c=(f=t[w]||(t[w]={}))[t.uniqueID]||(f[t.uniqueID]={}),o&&o===t.nodeName.toLowerCase())t=t[r]||t;else{if((u=c[i])&&u[0]===x&&u[1]===s)return p[2]=u[2];if(c[i]=p,p[2]=e(t,n,l))return!0}return!1}}function Ee(e){return e.length>1?function(t,n,r){for(var o=e.length;o--;)if(!e[o](t,n,r))return!1;return!0}:e[0]}function xe(e,t,n,r,o){for(var i,a=[],s=0,l=e.length,u=null!=t;s<l;s++)(i=e[s])&&(n&&!n(i,r,o)||(a.push(i),u&&t.push(s)));return a}function _e(e,t,n,r,o,i){return r&&!r[w]&&(r=_e(r)),o&&!o[w]&&(o=_e(o,i)),ue((function(i,a,s,l){var u,c,f,p=[],d=[],h=a.length,m=i||function(e,t,n){for(var r=0,o=t.length;r<o;r++)se(e,t[r],n);return n}(t||"*",s.nodeType?[s]:s,[]),g=!e||!i&&t?m:xe(m,p,e,s,l),v=n?o||(i?e:h||r)?[]:a:g;if(n&&n(g,v,s,l),r)for(u=xe(v,d),r(u,[],s,l),c=u.length;c--;)(f=u[c])&&(v[d[c]]=!(g[d[c]]=f));if(i){if(o||e){if(o){for(u=[],c=v.length;c--;)(f=v[c])&&u.push(g[c]=f);o(null,v=[],u,l)}for(c=v.length;c--;)(f=v[c])&&(u=o?A(i,f):p[c])>-1&&(i[u]=!(a[u]=f))}}else v=xe(v===a?v.splice(h,v.length):v),o?o(null,a,v,l):j.apply(a,v)}))}function ke(e){for(var t,n,o,i=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],l=a?1:0,c=we((function(e){return e===t}),s,!0),f=we((function(e){return A(t,e)>-1}),s,!0),p=[function(e,n,r){var o=!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,o}];l<i;l++)if(n=r.relative[e[l].type])p=[we(Ee(p),n)];else{if((n=r.filter[e[l].type].apply(null,e[l].matches))[w]){for(o=++l;o<i&&!r.relative[e[o].type];o++);return _e(l>1&&Ee(p),l>1&&be(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(F,"$1"),n,l<o&&ke(e.slice(l,o)),o<i&&ke(e=e.slice(o)),o<i&&be(e))}p.push(n)}return Ee(p)}return ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=se.tokenize=function(e,t){var n,o,i,a,s,l,u,c=C[e+" "];if(c)return t?0:c.slice(0);for(s=e,l=[],u=r.preFilter;s;){for(a in n&&!(o=W.exec(s))||(o&&(s=s.slice(o[0].length)||s),l.push(i=[])),n=!1,(o=$.exec(s))&&(n=o.shift(),i.push({value:n,type:o[0].replace(F," ")}),s=s.slice(n.length)),r.filter)!(o=K[a].exec(s))||u[a]&&!(o=u[a](o))||(n=o.shift(),i.push({value:n,type:a,matches:o}),s=s.slice(n.length));if(!n)break}return t?s.length:s?se.error(e):C(e,l).slice(0)},s=se.compile=function(e,t){var n,o=[],i=[],s=S[e+" "];if(!s){for(t||(t=a(e)),n=t.length;n--;)(s=ke(t[n]))[w]?o.push(s):i.push(s);(s=S(e,function(e,t){var n=t.length>0,o=e.length>0,i=function(i,a,s,l,c){var f,h,g,v=0,y="0",b=i&&[],w=[],E=u,_=i||o&&r.find.TAG("*",c),k=x+=null==E?1:Math.random()||.1,C=_.length;for(c&&(u=a==d||a||c);y!==C&&null!=(f=_[y]);y++){if(o&&f){for(h=0,a||f.ownerDocument==d||(p(f),s=!m);g=e[h++];)if(g(f,a||d,s)){l.push(f);break}c&&(x=k)}n&&((f=!g&&f)&&v--,i&&b.push(f))}if(v+=y,n&&y!==v){for(h=0;g=t[h++];)g(b,w,a,s);if(i){if(v>0)for(;y--;)b[y]||w[y]||(w[y]=N.call(l));w=xe(w)}j.apply(l,w),c&&!i&&w.length>0&&v+t.length>1&&se.uniqueSort(l)}return c&&(x=k,u=E),b};return n?ue(i):i}(i,o))).selector=e}return s},l=se.select=function(e,t,n,o){var i,l,u,c,f,p="function"==typeof e&&e,d=!o&&a(e=p.selector||e);if(n=n||[],1===d.length){if((l=d[0]=d[0].slice(0)).length>2&&"ID"===(u=l[0]).type&&9===t.nodeType&&m&&r.relative[l[1].type]){if(!(t=(r.find.ID(u.matches[0].replace(te,ne),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(l.shift().value.length)}for(i=K.needsContext.test(e)?0:l.length;i--&&(u=l[i],!r.relative[c=u.type]);)if((f=r.find[c])&&(o=f(u.matches[0].replace(te,ne),ee.test(l[0].type)&&ve(t.parentNode)||t))){if(l.splice(i,1),!(e=o.length&&be(l)))return j.apply(n,o),n;break}}return(p||s(e,d))(o,t,!m,n,!t||ee.test(e)&&ve(t.parentNode)||t),n},n.sortStable=w.split("").sort(P).join("")===w,n.detectDuplicates=!!f,p(),n.sortDetached=ce((function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))})),ce((function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")}))||fe("type|href|height|width",(function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)})),n.attributes&&ce((function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}))||fe("value",(function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue})),ce((function(e){return null==e.getAttribute("disabled")}))||fe(R,(function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null})),se}(n);_.find=C,_.expr=C.selectors,_.expr[":"]=_.expr.pseudos,_.uniqueSort=_.unique=C.uniqueSort,_.text=C.getText,_.isXMLDoc=C.isXML,_.contains=C.contains,_.escapeSelector=C.escape;var S=function(e,t,n){for(var r=[],o=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(o&&_(e).is(n))break;r.push(e)}return r},O=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},P=_.expr.match.needsContext;function T(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var L=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function N(e,t,n){return v(t)?_.grep(e,(function(e,r){return!!t.call(e,r,e)!==n})):t.nodeType?_.grep(e,(function(e){return e===t!==n})):"string"!=typeof t?_.grep(e,(function(e){return c.call(t,e)>-1!==n})):_.filter(t,e,n)}_.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?_.find.matchesSelector(r,e)?[r]:[]:_.find.matches(e,_.grep(t,(function(e){return 1===e.nodeType})))},_.fn.extend({find:function(e){var t,n,r=this.length,o=this;if("string"!=typeof e)return this.pushStack(_(e).filter((function(){for(t=0;t<r;t++)if(_.contains(o[t],this))return!0})));for(n=this.pushStack([]),t=0;t<r;t++)_.find(e,o[t],n);return r>1?_.uniqueSort(n):n},filter:function(e){return this.pushStack(N(this,e||[],!1))},not:function(e){return this.pushStack(N(this,e||[],!0))},is:function(e){return!!N(this,"string"==typeof e&&P.test(e)?_(e):e||[],!1).length}});var M,j=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(_.fn.init=function(e,t,n){var r,o;if(!e)return this;if(n=n||M,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:j.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof _?t[0]:t,_.merge(this,_.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:b,!0)),L.test(r[1])&&_.isPlainObject(t))for(r in t)v(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(o=b.getElementById(r[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):v(e)?void 0!==n.ready?n.ready(e):e(_):_.makeArray(e,this)}).prototype=_.fn,M=_(b);var D=/^(?:parents|prev(?:Until|All))/,A={children:!0,contents:!0,next:!0,prev:!0};function R(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}_.fn.extend({has:function(e){var t=_(e,this),n=t.length;return this.filter((function(){for(var e=0;e<n;e++)if(_.contains(this,t[e]))return!0}))},closest:function(e,t){var n,r=0,o=this.length,i=[],a="string"!=typeof e&&_(e);if(!P.test(e))for(;r<o;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&_.find.matchesSelector(n,e))){i.push(n);break}return this.pushStack(i.length>1?_.uniqueSort(i):i)},index:function(e){return e?"string"==typeof e?c.call(_(e),this[0]):c.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(_.uniqueSort(_.merge(this.get(),_(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),_.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return S(e,"parentNode")},parentsUntil:function(e,t,n){return S(e,"parentNode",n)},next:function(e){return R(e,"nextSibling")},prev:function(e){return R(e,"previousSibling")},nextAll:function(e){return S(e,"nextSibling")},prevAll:function(e){return S(e,"previousSibling")},nextUntil:function(e,t,n){return S(e,"nextSibling",n)},prevUntil:function(e,t,n){return S(e,"previousSibling",n)},siblings:function(e){return O((e.parentNode||{}).firstChild,e)},children:function(e){return O(e.firstChild)},contents:function(e){return null!=e.contentDocument&&a(e.contentDocument)?e.contentDocument:(T(e,"template")&&(e=e.content||e),_.merge([],e.childNodes))}},(function(e,t){_.fn[e]=function(n,r){var o=_.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(o=_.filter(r,o)),this.length>1&&(A[e]||_.uniqueSort(o),D.test(e)&&o.reverse()),this.pushStack(o)}}));var I=/[^\x20\t\r\n\f]+/g;function z(e){return e}function B(e){throw e}function U(e,t,n,r){var o;try{e&&v(o=e.promise)?o.call(e).done(t).fail(n):e&&v(o=e.then)?o.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}_.Callbacks=function(e){e="string"==typeof e?function(e){var t={};return _.each(e.match(I)||[],(function(e,n){t[n]=!0})),t}(e):_.extend({},e);var t,n,r,o,i=[],a=[],s=-1,l=function(){for(o=o||e.once,r=t=!0;a.length;s=-1)for(n=a.shift();++s<i.length;)!1===i[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=i.length,n=!1);e.memory||(n=!1),t=!1,o&&(i=n?[]:"")},u={add:function(){return i&&(n&&!t&&(s=i.length-1,a.push(n)),function t(n){_.each(n,(function(n,r){v(r)?e.unique&&u.has(r)||i.push(r):r&&r.length&&"string"!==x(r)&&t(r)}))}(arguments),n&&!t&&l()),this},remove:function(){return _.each(arguments,(function(e,t){for(var n;(n=_.inArray(t,i,n))>-1;)i.splice(n,1),n<=s&&s--})),this},has:function(e){return e?_.inArray(e,i)>-1:i.length>0},empty:function(){return i&&(i=[]),this},disable:function(){return o=a=[],i=n="",this},disabled:function(){return!i},lock:function(){return o=a=[],n||t||(i=n=""),this},locked:function(){return!!o},fireWith:function(e,n){return o||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||l()),this},fire:function(){return u.fireWith(this,arguments),this},fired:function(){return!!r}};return u},_.extend({Deferred:function(e){var t=[["notify","progress",_.Callbacks("memory"),_.Callbacks("memory"),2],["resolve","done",_.Callbacks("once memory"),_.Callbacks("once memory"),0,"resolved"],["reject","fail",_.Callbacks("once memory"),_.Callbacks("once memory"),1,"rejected"]],r="pending",o={state:function(){return r},always:function(){return i.done(arguments).fail(arguments),this},catch:function(e){return o.then(null,e)},pipe:function(){var e=arguments;return _.Deferred((function(n){_.each(t,(function(t,r){var o=v(e[r[4]])&&e[r[4]];i[r[1]]((function(){var e=o&&o.apply(this,arguments);e&&v(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[r[0]+"With"](this,o?[e]:arguments)}))})),e=null})).promise()},then:function(e,r,o){var i=0;function a(e,t,r,o){return function(){var s=this,l=arguments,u=function(){var n,u;if(!(e<i)){if((n=r.apply(s,l))===t.promise())throw new TypeError("Thenable self-resolution");u=n&&("object"==typeof n||"function"==typeof n)&&n.then,v(u)?o?u.call(n,a(i,t,z,o),a(i,t,B,o)):(i++,u.call(n,a(i,t,z,o),a(i,t,B,o),a(i,t,z,t.notifyWith))):(r!==z&&(s=void 0,l=[n]),(o||t.resolveWith)(s,l))}},c=o?u:function(){try{u()}catch(n){_.Deferred.exceptionHook&&_.Deferred.exceptionHook(n,c.stackTrace),e+1>=i&&(r!==B&&(s=void 0,l=[n]),t.rejectWith(s,l))}};e?c():(_.Deferred.getStackHook&&(c.stackTrace=_.Deferred.getStackHook()),n.setTimeout(c))}}return _.Deferred((function(n){t[0][3].add(a(0,n,v(o)?o:z,n.notifyWith)),t[1][3].add(a(0,n,v(e)?e:z)),t[2][3].add(a(0,n,v(r)?r:B))})).promise()},promise:function(e){return null!=e?_.extend(e,o):o}},i={};return _.each(t,(function(e,n){var a=n[2],s=n[5];o[n[1]]=a.add,s&&a.add((function(){r=s}),t[3-e][2].disable,t[3-e][3].disable,t[0][2].lock,t[0][3].lock),a.add(n[3].fire),i[n[0]]=function(){return i[n[0]+"With"](this===i?void 0:this,arguments),this},i[n[0]+"With"]=a.fireWith})),o.promise(i),e&&e.call(i,i),i},when:function(e){var t=arguments.length,n=t,r=Array(n),o=s.call(arguments),i=_.Deferred(),a=function(e){return function(n){r[e]=this,o[e]=arguments.length>1?s.call(arguments):n,--t||i.resolveWith(r,o)}};if(t<=1&&(U(e,i.done(a(n)).resolve,i.reject,!t),"pending"===i.state()||v(o[n]&&o[n].then)))return i.then();for(;n--;)U(o[n],a(n),i.reject);return i.promise()}});var H=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;_.Deferred.exceptionHook=function(e,t){n.console&&n.console.warn&&e&&H.test(e.name)&&n.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},_.readyException=function(e){n.setTimeout((function(){throw e}))};var F=_.Deferred();function W(){b.removeEventListener("DOMContentLoaded",W),n.removeEventListener("load",W),_.ready()}_.fn.ready=function(e){return F.then(e).catch((function(e){_.readyException(e)})),this},_.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--_.readyWait:_.isReady)||(_.isReady=!0,!0!==e&&--_.readyWait>0||F.resolveWith(b,[_]))}}),_.ready.then=F.then,"complete"===b.readyState||"loading"!==b.readyState&&!b.documentElement.doScroll?n.setTimeout(_.ready):(b.addEventListener("DOMContentLoaded",W),n.addEventListener("load",W));var $=function(e,t,n,r,o,i,a){var s=0,l=e.length,u=null==n;if("object"===x(n))for(s in o=!0,n)$(e,t,s,n[s],!0,i,a);else if(void 0!==r&&(o=!0,v(r)||(a=!0),u&&(a?(t.call(e,r),t=null):(u=t,t=function(e,t,n){return u.call(_(e),n)})),t))for(;s<l;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return o?e:u?t.call(e):l?t(e[0],n):i},q=/^-ms-/,V=/-([a-z])/g;function Q(e,t){return t.toUpperCase()}function K(e){return e.replace(q,"ms-").replace(V,Q)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function X(){this.expando=_.expando+X.uid++}X.uid=1,X.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,o=this.cache(e);if("string"==typeof t)o[K(t)]=n;else for(r in t)o[K(r)]=t[r];return o},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][K(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(K):(t=K(t))in r?[t]:t.match(I)||[]).length;for(;n--;)delete r[t[n]]}(void 0===t||_.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!_.isEmptyObject(t)}};var G=new X,Z=new X,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=function(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:J.test(e)?JSON.parse(e):e)}(n)}catch(e){}Z.set(e,t,n)}else n=void 0;return n}_.extend({hasData:function(e){return Z.hasData(e)||G.hasData(e)},data:function(e,t,n){return Z.access(e,t,n)},removeData:function(e,t){Z.remove(e,t)},_data:function(e,t,n){return G.access(e,t,n)},_removeData:function(e,t){G.remove(e,t)}}),_.fn.extend({data:function(e,t){var n,r,o,i=this[0],a=i&&i.attributes;if(void 0===e){if(this.length&&(o=Z.get(i),1===i.nodeType&&!G.get(i,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=K(r.slice(5)),te(i,r,o[r]));G.set(i,"hasDataAttrs",!0)}return o}return"object"==typeof e?this.each((function(){Z.set(this,e)})):$(this,(function(t){var n;if(i&&void 0===t)return void 0!==(n=Z.get(i,e))||void 0!==(n=te(i,e))?n:void 0;this.each((function(){Z.set(this,e,t)}))}),null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each((function(){Z.remove(this,e)}))}}),_.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=G.get(e,t),n&&(!r||Array.isArray(n)?r=G.access(e,t,_.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=_.queue(e,t),r=n.length,o=n.shift(),i=_._queueHooks(e,t);"inprogress"===o&&(o=n.shift(),r--),o&&("fx"===t&&n.unshift("inprogress"),delete i.stop,o.call(e,(function(){_.dequeue(e,t)}),i)),!r&&i&&i.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return G.get(e,n)||G.access(e,n,{empty:_.Callbacks("once memory").add((function(){G.remove(e,[t+"queue",n])}))})}}),_.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?_.queue(this[0],e):void 0===t?this:this.each((function(){var n=_.queue(this,e,t);_._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&_.dequeue(this,e)}))},dequeue:function(e){return this.each((function(){_.dequeue(this,e)}))},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,o=_.Deferred(),i=this,a=this.length,s=function(){--r||o.resolveWith(i,[i])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(n=G.get(i[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),o.promise(t)}});var ne=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,re=new RegExp("^(?:([+-])=|)("+ne+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ie=b.documentElement,ae=function(e){return _.contains(e.ownerDocument,e)},se={composed:!0};ie.getRootNode&&(ae=function(e){return _.contains(e.ownerDocument,e)||e.getRootNode(se)===e.ownerDocument});var le=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ae(e)&&"none"===_.css(e,"display")};function ue(e,t,n,r){var o,i,a=20,s=r?function(){return r.cur()}:function(){return _.css(e,t,"")},l=s(),u=n&&n[3]||(_.cssNumber[t]?"":"px"),c=e.nodeType&&(_.cssNumber[t]||"px"!==u&&+l)&&re.exec(_.css(e,t));if(c&&c[3]!==u){for(l/=2,u=u||c[3],c=+l||1;a--;)_.style(e,t,c+u),(1-i)*(1-(i=s()/l||.5))<=0&&(a=0),c/=i;c*=2,_.style(e,t,c+u),n=n||[]}return n&&(c=+c||+l||0,o=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=u,r.start=c,r.end=o)),o}var ce={};function fe(e){var t,n=e.ownerDocument,r=e.nodeName,o=ce[r];return o||(t=n.body.appendChild(n.createElement(r)),o=_.css(t,"display"),t.parentNode.removeChild(t),"none"===o&&(o="block"),ce[r]=o,o)}function pe(e,t){for(var n,r,o=[],i=0,a=e.length;i<a;i++)(r=e[i]).style&&(n=r.style.display,t?("none"===n&&(o[i]=G.get(r,"display")||null,o[i]||(r.style.display="")),""===r.style.display&&le(r)&&(o[i]=fe(r))):"none"!==n&&(o[i]="none",G.set(r,"display",n)));for(i=0;i<a;i++)null!=o[i]&&(e[i].style.display=o[i]);return e}_.fn.extend({show:function(){return pe(this,!0)},hide:function(){return pe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each((function(){le(this)?_(this).show():_(this).hide()}))}});var de,he,me=/^(?:checkbox|radio)$/i,ge=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,ve=/^$|^module$|\/(?:java|ecma)script/i;de=b.createDocumentFragment().appendChild(b.createElement("div")),(he=b.createElement("input")).setAttribute("type","radio"),he.setAttribute("checked","checked"),he.setAttribute("name","t"),de.appendChild(he),g.checkClone=de.cloneNode(!0).cloneNode(!0).lastChild.checked,de.innerHTML="<textarea>x</textarea>",g.noCloneChecked=!!de.cloneNode(!0).lastChild.defaultValue,de.innerHTML="<option></option>",g.option=!!de.lastChild;var ye={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function be(e,t){var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&T(e,t)?_.merge([e],n):n}function we(e,t){for(var n=0,r=e.length;n<r;n++)G.set(e[n],"globalEval",!t||G.get(t[n],"globalEval"))}ye.tbody=ye.tfoot=ye.colgroup=ye.caption=ye.thead,ye.th=ye.td,g.option||(ye.optgroup=ye.option=[1,"<select multiple='multiple'>","</select>"]);var Ee=/<|&#?\w+;/;function xe(e,t,n,r,o){for(var i,a,s,l,u,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((i=e[d])||0===i)if("object"===x(i))_.merge(p,i.nodeType?[i]:i);else if(Ee.test(i)){for(a=a||f.appendChild(t.createElement("div")),s=(ge.exec(i)||["",""])[1].toLowerCase(),l=ye[s]||ye._default,a.innerHTML=l[1]+_.htmlPrefilter(i)+l[2],c=l[0];c--;)a=a.lastChild;_.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(i));for(f.textContent="",d=0;i=p[d++];)if(r&&_.inArray(i,r)>-1)o&&o.push(i);else if(u=ae(i),a=be(f.appendChild(i),"script"),u&&we(a),n)for(c=0;i=a[c++];)ve.test(i.type||"")&&n.push(i);return f}var _e=/^([^.]*)(?:\.(.+)|)/;function ke(){return!0}function Ce(){return!1}function Se(e,t){return e===function(){try{return b.activeElement}catch(e){}}()==("focus"===t)}function Oe(e,t,n,r,o,i){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Oe(e,s,n,r,t[s],i);return e}if(null==r&&null==o?(o=n,r=n=void 0):null==o&&("string"==typeof n?(o=r,r=void 0):(o=r,r=n,n=void 0)),!1===o)o=Ce;else if(!o)return e;return 1===i&&(a=o,(o=function(e){return _().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=_.guid++)),e.each((function(){_.event.add(this,t,o,r,n)}))}function Pe(e,t,n){n?(G.set(e,t,!1),_.event.add(e,t,{namespace:!1,handler:function(e){var r,o,i=G.get(this,t);if(1&e.isTrigger&&this[t]){if(i.length)(_.event.special[t]||{}).delegateType&&e.stopPropagation();else if(i=s.call(arguments),G.set(this,t,i),r=n(this,t),this[t](),i!==(o=G.get(this,t))||r?G.set(this,t,!1):o={},i!==o)return e.stopImmediatePropagation(),e.preventDefault(),o&&o.value}else i.length&&(G.set(this,t,{value:_.event.trigger(_.extend(i[0],_.Event.prototype),i.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===G.get(e,t)&&_.event.add(e,t,ke)}_.event={global:{},add:function(e,t,n,r,o){var i,a,s,l,u,c,f,p,d,h,m,g=G.get(e);if(Y(e))for(n.handler&&(n=(i=n).handler,o=i.selector),o&&_.find.matchesSelector(ie,o),n.guid||(n.guid=_.guid++),(l=g.events)||(l=g.events=Object.create(null)),(a=g.handle)||(a=g.handle=function(t){return void 0!==_&&_.event.triggered!==t.type?_.event.dispatch.apply(e,arguments):void 0}),u=(t=(t||"").match(I)||[""]).length;u--;)d=m=(s=_e.exec(t[u])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=_.event.special[d]||{},d=(o?f.delegateType:f.bindType)||d,f=_.event.special[d]||{},c=_.extend({type:d,origType:m,data:r,handler:n,guid:n.guid,selector:o,needsContext:o&&_.expr.match.needsContext.test(o),namespace:h.join(".")},i),(p=l[d])||((p=l[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),o?p.splice(p.delegateCount++,0,c):p.push(c),_.event.global[d]=!0)},remove:function(e,t,n,r,o){var i,a,s,l,u,c,f,p,d,h,m,g=G.hasData(e)&&G.get(e);if(g&&(l=g.events)){for(u=(t=(t||"").match(I)||[""]).length;u--;)if(d=m=(s=_e.exec(t[u])||[])[1],h=(s[2]||"").split(".").sort(),d){for(f=_.event.special[d]||{},p=l[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=i=p.length;i--;)c=p[i],!o&&m!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(i,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,g.handle)||_.removeEvent(e,d,g.handle),delete l[d])}else for(d in l)_.event.remove(e,d+t[u],n,r,!0);_.isEmptyObject(l)&&G.remove(e,"handle events")}},dispatch:function(e){var t,n,r,o,i,a,s=new Array(arguments.length),l=_.event.fix(e),u=(G.get(this,"events")||Object.create(null))[l.type]||[],c=_.event.special[l.type]||{};for(s[0]=l,t=1;t<arguments.length;t++)s[t]=arguments[t];if(l.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,l)){for(a=_.event.handlers.call(this,l,u),t=0;(o=a[t++])&&!l.isPropagationStopped();)for(l.currentTarget=o.elem,n=0;(i=o.handlers[n++])&&!l.isImmediatePropagationStopped();)l.rnamespace&&!1!==i.namespace&&!l.rnamespace.test(i.namespace)||(l.handleObj=i,l.data=i.data,void 0!==(r=((_.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,s))&&!1===(l.result=r)&&(l.preventDefault(),l.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,l),l.result}},handlers:function(e,t){var n,r,o,i,a,s=[],l=t.delegateCount,u=e.target;if(l&&u.nodeType&&!("click"===e.type&&e.button>=1))for(;u!==this;u=u.parentNode||this)if(1===u.nodeType&&("click"!==e.type||!0!==u.disabled)){for(i=[],a={},n=0;n<l;n++)void 0===a[o=(r=t[n]).selector+" "]&&(a[o]=r.needsContext?_(o,this).index(u)>-1:_.find(o,this,null,[u]).length),a[o]&&i.push(r);i.length&&s.push({elem:u,handlers:i})}return u=this,l<t.length&&s.push({elem:u,handlers:t.slice(l)}),s},addProp:function(e,t){Object.defineProperty(_.Event.prototype,e,{enumerable:!0,configurable:!0,get:v(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[_.expando]?e:new _.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return me.test(t.type)&&t.click&&T(t,"input")&&Pe(t,"click",ke),!1},trigger:function(e){var t=this||e;return me.test(t.type)&&t.click&&T(t,"input")&&Pe(t,"click"),!0},_default:function(e){var t=e.target;return me.test(t.type)&&t.click&&T(t,"input")&&G.get(t,"click")||T(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},_.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},_.Event=function(e,t){if(!(this instanceof _.Event))return new _.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?ke:Ce,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&_.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[_.expando]=!0},_.Event.prototype={constructor:_.Event,isDefaultPrevented:Ce,isPropagationStopped:Ce,isImmediatePropagationStopped:Ce,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=ke,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=ke,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=ke,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},_.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},_.event.addProp),_.each({focus:"focusin",blur:"focusout"},(function(e,t){_.event.special[e]={setup:function(){return Pe(this,e,Se),!1},trigger:function(){return Pe(this,e),!0},_default:function(){return!0},delegateType:t}})),_.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},(function(e,t){_.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,o=e.relatedTarget,i=e.handleObj;return o&&(o===r||_.contains(r,o))||(e.type=i.origType,n=i.handler.apply(this,arguments),e.type=t),n}}})),_.fn.extend({on:function(e,t,n,r){return Oe(this,e,t,n,r)},one:function(e,t,n,r){return Oe(this,e,t,n,r,1)},off:function(e,t,n){var r,o;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,_(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(o in e)this.off(o,t,e[o]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ce),this.each((function(){_.event.remove(this,e,n,t)}))}});var Te=/<script|<style|<link/i,Le=/checked\s*(?:[^=]|=\s*.checked.)/i,Ne=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Me(e,t){return T(e,"table")&&T(11!==t.nodeType?t:t.firstChild,"tr")&&_(e).children("tbody")[0]||e}function je(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function De(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Ae(e,t){var n,r,o,i,a,s;if(1===t.nodeType){if(G.hasData(e)&&(s=G.get(e).events))for(o in G.remove(t,"handle events"),s)for(n=0,r=s[o].length;n<r;n++)_.event.add(t,o,s[o][n]);Z.hasData(e)&&(i=Z.access(e),a=_.extend({},i),Z.set(t,a))}}function Re(e,t){var n=t.nodeName.toLowerCase();"input"===n&&me.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Ie(e,t,n,r){t=l(t);var o,i,a,s,u,c,f=0,p=e.length,d=p-1,h=t[0],m=v(h);if(m||p>1&&"string"==typeof h&&!g.checkClone&&Le.test(h))return e.each((function(o){var i=e.eq(o);m&&(t[0]=h.call(this,o,i.html())),Ie(i,t,n,r)}));if(p&&(i=(o=xe(t,e[0].ownerDocument,!1,e,r)).firstChild,1===o.childNodes.length&&(o=i),i||r)){for(s=(a=_.map(be(o,"script"),je)).length;f<p;f++)u=o,f!==d&&(u=_.clone(u,!0,!0),s&&_.merge(a,be(u,"script"))),n.call(e[f],u,f);if(s)for(c=a[a.length-1].ownerDocument,_.map(a,De),f=0;f<s;f++)u=a[f],ve.test(u.type||"")&&!G.access(u,"globalEval")&&_.contains(c,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?_._evalUrl&&!u.noModule&&_._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},c):E(u.textContent.replace(Ne,""),u,c))}return e}function ze(e,t,n){for(var r,o=t?_.filter(t,e):e,i=0;null!=(r=o[i]);i++)n||1!==r.nodeType||_.cleanData(be(r)),r.parentNode&&(n&&ae(r)&&we(be(r,"script")),r.parentNode.removeChild(r));return e}_.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,o,i,a,s=e.cloneNode(!0),l=ae(e);if(!(g.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||_.isXMLDoc(e)))for(a=be(s),r=0,o=(i=be(e)).length;r<o;r++)Re(i[r],a[r]);if(t)if(n)for(i=i||be(e),a=a||be(s),r=0,o=i.length;r<o;r++)Ae(i[r],a[r]);else Ae(e,s);return(a=be(s,"script")).length>0&&we(a,!l&&be(e,"script")),s},cleanData:function(e){for(var t,n,r,o=_.event.special,i=0;void 0!==(n=e[i]);i++)if(Y(n)){if(t=n[G.expando]){if(t.events)for(r in t.events)o[r]?_.event.remove(n,r):_.removeEvent(n,r,t.handle);n[G.expando]=void 0}n[Z.expando]&&(n[Z.expando]=void 0)}}}),_.fn.extend({detach:function(e){return ze(this,e,!0)},remove:function(e){return ze(this,e)},text:function(e){return $(this,(function(e){return void 0===e?_.text(this):this.empty().each((function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)}))}),null,e,arguments.length)},append:function(){return Ie(this,arguments,(function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Me(this,e).appendChild(e)}))},prepend:function(){return Ie(this,arguments,(function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Me(this,e);t.insertBefore(e,t.firstChild)}}))},before:function(){return Ie(this,arguments,(function(e){this.parentNode&&this.parentNode.insertBefore(e,this)}))},after:function(){return Ie(this,arguments,(function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)}))},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(_.cleanData(be(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map((function(){return _.clone(this,e,t)}))},html:function(e){return $(this,(function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Te.test(e)&&!ye[(ge.exec(e)||["",""])[1].toLowerCase()]){e=_.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(_.cleanData(be(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)}),null,e,arguments.length)},replaceWith:function(){var e=[];return Ie(this,arguments,(function(t){var n=this.parentNode;_.inArray(this,e)<0&&(_.cleanData(be(this)),n&&n.replaceChild(t,this))}),e)}}),_.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},(function(e,t){_.fn[e]=function(e){for(var n,r=[],o=_(e),i=o.length-1,a=0;a<=i;a++)n=a===i?this:this.clone(!0),_(o[a])[t](n),u.apply(r,n.get());return this.pushStack(r)}}));var Be=new RegExp("^("+ne+")(?!px)[a-z%]+$","i"),Ue=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=n),t.getComputedStyle(e)},He=function(e,t,n){var r,o,i={};for(o in t)i[o]=e.style[o],e.style[o]=t[o];for(o in r=n.call(e),t)e.style[o]=i[o];return r},Fe=new RegExp(oe.join("|"),"i");function We(e,t,n){var r,o,i,a,s=e.style;return(n=n||Ue(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ae(e)||(a=_.style(e,t)),!g.pixelBoxStyles()&&Be.test(a)&&Fe.test(t)&&(r=s.width,o=s.minWidth,i=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=o,s.maxWidth=i)),void 0!==a?a+"":a}function $e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(c){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",ie.appendChild(u).appendChild(c);var e=n.getComputedStyle(c);r="1%"!==e.top,l=12===t(e.marginLeft),c.style.right="60%",a=36===t(e.right),o=36===t(e.width),c.style.position="absolute",i=12===t(c.offsetWidth/3),ie.removeChild(u),c=null}}function t(e){return Math.round(parseFloat(e))}var r,o,i,a,s,l,u=b.createElement("div"),c=b.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",g.clearCloneStyle="content-box"===c.style.backgroundClip,_.extend(g,{boxSizingReliable:function(){return e(),o},pixelBoxStyles:function(){return e(),a},pixelPosition:function(){return e(),r},reliableMarginLeft:function(){return e(),l},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,r,o;return null==s&&(e=b.createElement("table"),t=b.createElement("tr"),r=b.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="border:1px solid",t.style.height="1px",r.style.height="9px",r.style.display="block",ie.appendChild(e).appendChild(t).appendChild(r),o=n.getComputedStyle(t),s=parseInt(o.height,10)+parseInt(o.borderTopWidth,10)+parseInt(o.borderBottomWidth,10)===t.offsetHeight,ie.removeChild(e)),s}}))}();var qe=["Webkit","Moz","ms"],Ve=b.createElement("div").style,Qe={};function Ke(e){var t=_.cssProps[e]||Qe[e];return t||(e in Ve?e:Qe[e]=function(e){for(var t=e[0].toUpperCase()+e.slice(1),n=qe.length;n--;)if((e=qe[n]+t)in Ve)return e}(e)||e)}var Ye=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ge={position:"absolute",visibility:"hidden",display:"block"},Ze={letterSpacing:"0",fontWeight:"400"};function Je(e,t,n){var r=re.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function et(e,t,n,r,o,i){var a="width"===t?1:0,s=0,l=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(l+=_.css(e,n+oe[a],!0,o)),r?("content"===n&&(l-=_.css(e,"padding"+oe[a],!0,o)),"margin"!==n&&(l-=_.css(e,"border"+oe[a]+"Width",!0,o))):(l+=_.css(e,"padding"+oe[a],!0,o),"padding"!==n?l+=_.css(e,"border"+oe[a]+"Width",!0,o):s+=_.css(e,"border"+oe[a]+"Width",!0,o));return!r&&i>=0&&(l+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-i-l-s-.5))||0),l}function tt(e,t,n){var r=Ue(e),o=(!g.boxSizingReliable()||n)&&"border-box"===_.css(e,"boxSizing",!1,r),i=o,a=We(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Be.test(a)){if(!n)return a;a="auto"}return(!g.boxSizingReliable()&&o||!g.reliableTrDimensions()&&T(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===_.css(e,"display",!1,r))&&e.getClientRects().length&&(o="border-box"===_.css(e,"boxSizing",!1,r),(i=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+et(e,t,n||(o?"border":"content"),i,r,a)+"px"}function nt(e,t,n,r,o){return new nt.prototype.init(e,t,n,r,o)}_.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=We(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,i,a,s=K(t),l=Xe.test(t),u=e.style;if(l||(t=Ke(s)),a=_.cssHooks[t]||_.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(o=a.get(e,!1,r))?o:u[t];"string"===(i=typeof n)&&(o=re.exec(n))&&o[1]&&(n=ue(e,t,o),i="number"),null!=n&&n==n&&("number"!==i||l||(n+=o&&o[3]||(_.cssNumber[s]?"":"px")),g.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(l?u.setProperty(t,n):u[t]=n))}},css:function(e,t,n,r){var o,i,a,s=K(t);return Xe.test(t)||(t=Ke(s)),(a=_.cssHooks[t]||_.cssHooks[s])&&"get"in a&&(o=a.get(e,!0,n)),void 0===o&&(o=We(e,t,r)),"normal"===o&&t in Ze&&(o=Ze[t]),""===n||n?(i=parseFloat(o),!0===n||isFinite(i)?i||0:o):o}}),_.each(["height","width"],(function(e,t){_.cssHooks[t]={get:function(e,n,r){if(n)return!Ye.test(_.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?tt(e,t,r):He(e,Ge,(function(){return tt(e,t,r)}))},set:function(e,n,r){var o,i=Ue(e),a=!g.scrollboxSize()&&"absolute"===i.position,s=(a||r)&&"border-box"===_.css(e,"boxSizing",!1,i),l=r?et(e,t,r,s,i):0;return s&&a&&(l-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(i[t])-et(e,t,"border",!1,i)-.5)),l&&(o=re.exec(n))&&"px"!==(o[3]||"px")&&(e.style[t]=n,n=_.css(e,t)),Je(0,n,l)}}})),_.cssHooks.marginLeft=$e(g.reliableMarginLeft,(function(e,t){if(t)return(parseFloat(We(e,"marginLeft"))||e.getBoundingClientRect().left-He(e,{marginLeft:0},(function(){return e.getBoundingClientRect().left})))+"px"})),_.each({margin:"",padding:"",border:"Width"},(function(e,t){_.cssHooks[e+t]={expand:function(n){for(var r=0,o={},i="string"==typeof n?n.split(" "):[n];r<4;r++)o[e+oe[r]+t]=i[r]||i[r-2]||i[0];return o}},"margin"!==e&&(_.cssHooks[e+t].set=Je)})),_.fn.extend({css:function(e,t){return $(this,(function(e,t,n){var r,o,i={},a=0;if(Array.isArray(t)){for(r=Ue(e),o=t.length;a<o;a++)i[t[a]]=_.css(e,t[a],!1,r);return i}return void 0!==n?_.style(e,t,n):_.css(e,t)}),e,t,arguments.length>1)}}),_.Tween=nt,nt.prototype={constructor:nt,init:function(e,t,n,r,o,i){this.elem=e,this.prop=n,this.easing=o||_.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=i||(_.cssNumber[n]?"":"px")},cur:function(){var e=nt.propHooks[this.prop];return e&&e.get?e.get(this):nt.propHooks._default.get(this)},run:function(e){var t,n=nt.propHooks[this.prop];return this.options.duration?this.pos=t=_.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):nt.propHooks._default.set(this),this}},nt.prototype.init.prototype=nt.prototype,nt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=_.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){_.fx.step[e.prop]?_.fx.step[e.prop](e):1!==e.elem.nodeType||!_.cssHooks[e.prop]&&null==e.elem.style[Ke(e.prop)]?e.elem[e.prop]=e.now:_.style(e.elem,e.prop,e.now+e.unit)}}},nt.propHooks.scrollTop=nt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},_.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},_.fx=nt.prototype.init,_.fx.step={};var rt,ot,it=/^(?:toggle|show|hide)$/,at=/queueHooks$/;function st(){ot&&(!1===b.hidden&&n.requestAnimationFrame?n.requestAnimationFrame(st):n.setTimeout(st,_.fx.interval),_.fx.tick())}function lt(){return n.setTimeout((function(){rt=void 0})),rt=Date.now()}function ut(e,t){var n,r=0,o={height:e};for(t=t?1:0;r<4;r+=2-t)o["margin"+(n=oe[r])]=o["padding"+n]=e;return t&&(o.opacity=o.width=e),o}function ct(e,t,n){for(var r,o=(ft.tweeners[t]||[]).concat(ft.tweeners["*"]),i=0,a=o.length;i<a;i++)if(r=o[i].call(n,t,e))return r}function ft(e,t,n){var r,o,i=0,a=ft.prefilters.length,s=_.Deferred().always((function(){delete l.elem})),l=function(){if(o)return!1;for(var t=rt||lt(),n=Math.max(0,u.startTime+u.duration-t),r=1-(n/u.duration||0),i=0,a=u.tweens.length;i<a;i++)u.tweens[i].run(r);return s.notifyWith(e,[u,r,n]),r<1&&a?n:(a||s.notifyWith(e,[u,1,0]),s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:_.extend({},t),opts:_.extend(!0,{specialEasing:{},easing:_.easing._default},n),originalProperties:t,originalOptions:n,startTime:rt||lt(),duration:n.duration,tweens:[],createTween:function(t,n){var r=_.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(o)return this;for(o=!0;n<r;n++)u.tweens[n].run(1);return t?(s.notifyWith(e,[u,1,0]),s.resolveWith(e,[u,t])):s.rejectWith(e,[u,t]),this}}),c=u.props;for(!function(e,t){var n,r,o,i,a;for(n in e)if(o=t[r=K(n)],i=e[n],Array.isArray(i)&&(o=i[1],i=e[n]=i[0]),n!==r&&(e[r]=i,delete e[n]),(a=_.cssHooks[r])&&"expand"in a)for(n in i=a.expand(i),delete e[r],i)n in e||(e[n]=i[n],t[n]=o);else t[r]=o}(c,u.opts.specialEasing);i<a;i++)if(r=ft.prefilters[i].call(u,e,c,u.opts))return v(r.stop)&&(_._queueHooks(u.elem,u.opts.queue).stop=r.stop.bind(r)),r;return _.map(c,ct,u),v(u.opts.start)&&u.opts.start.call(e,u),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always),_.fx.timer(_.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u}_.Animation=_.extend(ft,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,re.exec(t),n),n}]},tweener:function(e,t){v(e)?(t=e,e=["*"]):e=e.match(I);for(var n,r=0,o=e.length;r<o;r++)n=e[r],ft.tweeners[n]=ft.tweeners[n]||[],ft.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,o,i,a,s,l,u,c,f="width"in t||"height"in t,p=this,d={},h=e.style,m=e.nodeType&&le(e),g=G.get(e,"fxshow");for(r in n.queue||(null==(a=_._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always((function(){p.always((function(){a.unqueued--,_.queue(e,"fx").length||a.empty.fire()}))}))),t)if(o=t[r],it.test(o)){if(delete t[r],i=i||"toggle"===o,o===(m?"hide":"show")){if("show"!==o||!g||void 0===g[r])continue;m=!0}d[r]=g&&g[r]||_.style(e,r)}if((l=!_.isEmptyObject(t))||!_.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(u=g&&g.display)&&(u=G.get(e,"display")),"none"===(c=_.css(e,"display"))&&(u?c=u:(pe([e],!0),u=e.style.display||u,c=_.css(e,"display"),pe([e]))),("inline"===c||"inline-block"===c&&null!=u)&&"none"===_.css(e,"float")&&(l||(p.done((function(){h.display=u})),null==u&&(c=h.display,u="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always((function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]}))),l=!1,d)l||(g?"hidden"in g&&(m=g.hidden):g=G.access(e,"fxshow",{display:u}),i&&(g.hidden=!m),m&&pe([e],!0),p.done((function(){for(r in m||pe([e]),G.remove(e,"fxshow"),d)_.style(e,r,d[r])}))),l=ct(m?g[r]:0,r,p),r in g||(g[r]=l.start,m&&(l.end=l.start,l.start=0))}],prefilter:function(e,t){t?ft.prefilters.unshift(e):ft.prefilters.push(e)}}),_.speed=function(e,t,n){var r=e&&"object"==typeof e?_.extend({},e):{complete:n||!n&&t||v(e)&&e,duration:e,easing:n&&t||t&&!v(t)&&t};return _.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in _.fx.speeds?r.duration=_.fx.speeds[r.duration]:r.duration=_.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){v(r.old)&&r.old.call(this),r.queue&&_.dequeue(this,r.queue)},r},_.fn.extend({fadeTo:function(e,t,n,r){return this.filter(le).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var o=_.isEmptyObject(e),i=_.speed(t,n,r),a=function(){var t=ft(this,_.extend({},e),i);(o||G.get(this,"finish"))&&t.stop(!0)};return a.finish=a,o||!1===i.queue?this.each(a):this.queue(i.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&this.queue(e||"fx",[]),this.each((function(){var t=!0,o=null!=e&&e+"queueHooks",i=_.timers,a=G.get(this);if(o)a[o]&&a[o].stop&&r(a[o]);else for(o in a)a[o]&&a[o].stop&&at.test(o)&&r(a[o]);for(o=i.length;o--;)i[o].elem!==this||null!=e&&i[o].queue!==e||(i[o].anim.stop(n),t=!1,i.splice(o,1));!t&&n||_.dequeue(this,e)}))},finish:function(e){return!1!==e&&(e=e||"fx"),this.each((function(){var t,n=G.get(this),r=n[e+"queue"],o=n[e+"queueHooks"],i=_.timers,a=r?r.length:0;for(n.finish=!0,_.queue(this,e,[]),o&&o.stop&&o.stop.call(this,!0),t=i.length;t--;)i[t].elem===this&&i[t].queue===e&&(i[t].anim.stop(!0),i.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish}))}}),_.each(["toggle","show","hide"],(function(e,t){var n=_.fn[t];_.fn[t]=function(e,r,o){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,o)}})),_.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},(function(e,t){_.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}})),_.timers=[],_.fx.tick=function(){var e,t=0,n=_.timers;for(rt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||_.fx.stop(),rt=void 0},_.fx.timer=function(e){_.timers.push(e),_.fx.start()},_.fx.interval=13,_.fx.start=function(){ot||(ot=!0,st())},_.fx.stop=function(){ot=null},_.fx.speeds={slow:600,fast:200,_default:400},_.fn.delay=function(e,t){return e=_.fx&&_.fx.speeds[e]||e,t=t||"fx",this.queue(t,(function(t,r){var o=n.setTimeout(t,e);r.stop=function(){n.clearTimeout(o)}}))},function(){var e=b.createElement("input"),t=b.createElement("select").appendChild(b.createElement("option"));e.type="checkbox",g.checkOn=""!==e.value,g.optSelected=t.selected,(e=b.createElement("input")).value="t",e.type="radio",g.radioValue="t"===e.value}();var pt,dt=_.expr.attrHandle;_.fn.extend({attr:function(e,t){return $(this,_.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each((function(){_.removeAttr(this,e)}))}}),_.extend({attr:function(e,t,n){var r,o,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return void 0===e.getAttribute?_.prop(e,t,n):(1===i&&_.isXMLDoc(e)||(o=_.attrHooks[t.toLowerCase()]||(_.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void _.removeAttr(e,t):o&&"set"in o&&void 0!==(r=o.set(e,n,t))?r:(e.setAttribute(t,n+""),n):o&&"get"in o&&null!==(r=o.get(e,t))?r:null==(r=_.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!g.radioValue&&"radio"===t&&T(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,o=t&&t.match(I);if(o&&1===e.nodeType)for(;n=o[r++];)e.removeAttribute(n)}}),pt={set:function(e,t,n){return!1===t?_.removeAttr(e,n):e.setAttribute(n,n),n}},_.each(_.expr.match.bool.source.match(/\w+/g),(function(e,t){var n=dt[t]||_.find.attr;dt[t]=function(e,t,r){var o,i,a=t.toLowerCase();return r||(i=dt[a],dt[a]=o,o=null!=n(e,t,r)?a:null,dt[a]=i),o}}));var ht=/^(?:input|select|textarea|button)$/i,mt=/^(?:a|area)$/i;function gt(e){return(e.match(I)||[]).join(" ")}function vt(e){return e.getAttribute&&e.getAttribute("class")||""}function yt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(I)||[]}_.fn.extend({prop:function(e,t){return $(this,_.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each((function(){delete this[_.propFix[e]||e]}))}}),_.extend({prop:function(e,t,n){var r,o,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return 1===i&&_.isXMLDoc(e)||(t=_.propFix[t]||t,o=_.propHooks[t]),void 0!==n?o&&"set"in o&&void 0!==(r=o.set(e,n,t))?r:e[t]=n:o&&"get"in o&&null!==(r=o.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=_.find.attr(e,"tabindex");return t?parseInt(t,10):ht.test(e.nodeName)||mt.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),g.optSelected||(_.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),_.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],(function(){_.propFix[this.toLowerCase()]=this})),_.fn.extend({addClass:function(e){var t,n,r,o,i,a,s,l=0;if(v(e))return this.each((function(t){_(this).addClass(e.call(this,t,vt(this)))}));if((t=yt(e)).length)for(;n=this[l++];)if(o=vt(n),r=1===n.nodeType&&" "+gt(o)+" "){for(a=0;i=t[a++];)r.indexOf(" "+i+" ")<0&&(r+=i+" ");o!==(s=gt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,o,i,a,s,l=0;if(v(e))return this.each((function(t){_(this).removeClass(e.call(this,t,vt(this)))}));if(!arguments.length)return this.attr("class","");if((t=yt(e)).length)for(;n=this[l++];)if(o=vt(n),r=1===n.nodeType&&" "+gt(o)+" "){for(a=0;i=t[a++];)for(;r.indexOf(" "+i+" ")>-1;)r=r.replace(" "+i+" "," ");o!==(s=gt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):v(e)?this.each((function(n){_(this).toggleClass(e.call(this,n,vt(this),t),t)})):this.each((function(){var t,o,i,a;if(r)for(o=0,i=_(this),a=yt(e);t=a[o++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else void 0!==e&&"boolean"!==n||((t=vt(this))&&G.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":G.get(this,"__className__")||""))}))},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+gt(vt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;_.fn.extend({val:function(e){var t,n,r,o=this[0];return arguments.length?(r=v(e),this.each((function(n){var o;1===this.nodeType&&(null==(o=r?e.call(this,n,_(this).val()):e)?o="":"number"==typeof o?o+="":Array.isArray(o)&&(o=_.map(o,(function(e){return null==e?"":e+""}))),(t=_.valHooks[this.type]||_.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,o,"value")||(this.value=o))}))):o?(t=_.valHooks[o.type]||_.valHooks[o.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(o,"value"))?n:"string"==typeof(n=o.value)?n.replace(bt,""):null==n?"":n:void 0}}),_.extend({valHooks:{option:{get:function(e){var t=_.find.attr(e,"value");return null!=t?t:gt(_.text(e))}},select:{get:function(e){var t,n,r,o=e.options,i=e.selectedIndex,a="select-one"===e.type,s=a?null:[],l=a?i+1:o.length;for(r=i<0?l:a?i:0;r<l;r++)if(((n=o[r]).selected||r===i)&&!n.disabled&&(!n.parentNode.disabled||!T(n.parentNode,"optgroup"))){if(t=_(n).val(),a)return t;s.push(t)}return s},set:function(e,t){for(var n,r,o=e.options,i=_.makeArray(t),a=o.length;a--;)((r=o[a]).selected=_.inArray(_.valHooks.option.get(r),i)>-1)&&(n=!0);return n||(e.selectedIndex=-1),i}}}}),_.each(["radio","checkbox"],(function(){_.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=_.inArray(_(e).val(),t)>-1}},g.checkOn||(_.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})})),g.focusin="onfocusin"in n;var wt=/^(?:focusinfocus|focusoutblur)$/,Et=function(e){e.stopPropagation()};_.extend(_.event,{trigger:function(e,t,r,o){var i,a,s,l,u,c,f,p,h=[r||b],m=d.call(e,"type")?e.type:e,g=d.call(e,"namespace")?e.namespace.split("."):[];if(a=p=s=r=r||b,3!==r.nodeType&&8!==r.nodeType&&!wt.test(m+_.event.triggered)&&(m.indexOf(".")>-1&&(g=m.split("."),m=g.shift(),g.sort()),u=m.indexOf(":")<0&&"on"+m,(e=e[_.expando]?e:new _.Event(m,"object"==typeof e&&e)).isTrigger=o?2:3,e.namespace=g.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=r),t=null==t?[e]:_.makeArray(t,[e]),f=_.event.special[m]||{},o||!f.trigger||!1!==f.trigger.apply(r,t))){if(!o&&!f.noBubble&&!y(r)){for(l=f.delegateType||m,wt.test(l+m)||(a=a.parentNode);a;a=a.parentNode)h.push(a),s=a;s===(r.ownerDocument||b)&&h.push(s.defaultView||s.parentWindow||n)}for(i=0;(a=h[i++])&&!e.isPropagationStopped();)p=a,e.type=i>1?l:f.bindType||m,(c=(G.get(a,"events")||Object.create(null))[e.type]&&G.get(a,"handle"))&&c.apply(a,t),(c=u&&a[u])&&c.apply&&Y(a)&&(e.result=c.apply(a,t),!1===e.result&&e.preventDefault());return e.type=m,o||e.isDefaultPrevented()||f._default&&!1!==f._default.apply(h.pop(),t)||!Y(r)||u&&v(r[m])&&!y(r)&&((s=r[u])&&(r[u]=null),_.event.triggered=m,e.isPropagationStopped()&&p.addEventListener(m,Et),r[m](),e.isPropagationStopped()&&p.removeEventListener(m,Et),_.event.triggered=void 0,s&&(r[u]=s)),e.result}},simulate:function(e,t,n){var r=_.extend(new _.Event,n,{type:e,isSimulated:!0});_.event.trigger(r,null,t)}}),_.fn.extend({trigger:function(e,t){return this.each((function(){_.event.trigger(e,t,this)}))},triggerHandler:function(e,t){var n=this[0];if(n)return _.event.trigger(e,t,n,!0)}}),g.focusin||_.each({focus:"focusin",blur:"focusout"},(function(e,t){var n=function(e){_.event.simulate(t,e.target,_.event.fix(e))};_.event.special[t]={setup:function(){var r=this.ownerDocument||this.document||this,o=G.access(r,t);o||r.addEventListener(e,n,!0),G.access(r,t,(o||0)+1)},teardown:function(){var r=this.ownerDocument||this.document||this,o=G.access(r,t)-1;o?G.access(r,t,o):(r.removeEventListener(e,n,!0),G.remove(r,t))}}}));var xt=n.location,_t={guid:Date.now()},kt=/\?/;_.parseXML=function(e){var t,r;if(!e||"string"!=typeof e)return null;try{t=(new n.DOMParser).parseFromString(e,"text/xml")}catch(e){}return r=t&&t.getElementsByTagName("parsererror")[0],t&&!r||_.error("Invalid XML: "+(r?_.map(r.childNodes,(function(e){return e.textContent})).join("\n"):e)),t};var Ct=/\[\]$/,St=/\r?\n/g,Ot=/^(?:submit|button|image|reset|file)$/i,Pt=/^(?:input|select|textarea|keygen)/i;function Tt(e,t,n,r){var o;if(Array.isArray(t))_.each(t,(function(t,o){n||Ct.test(e)?r(e,o):Tt(e+"["+("object"==typeof o&&null!=o?t:"")+"]",o,n,r)}));else if(n||"object"!==x(t))r(e,t);else for(o in t)Tt(e+"["+o+"]",t[o],n,r)}_.param=function(e,t){var n,r=[],o=function(e,t){var n=v(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!_.isPlainObject(e))_.each(e,(function(){o(this.name,this.value)}));else for(n in e)Tt(n,e[n],t,o);return r.join("&")},_.fn.extend({serialize:function(){return _.param(this.serializeArray())},serializeArray:function(){return this.map((function(){var e=_.prop(this,"elements");return e?_.makeArray(e):this})).filter((function(){var e=this.type;return this.name&&!_(this).is(":disabled")&&Pt.test(this.nodeName)&&!Ot.test(e)&&(this.checked||!me.test(e))})).map((function(e,t){var n=_(this).val();return null==n?null:Array.isArray(n)?_.map(n,(function(e){return{name:t.name,value:e.replace(St,"\r\n")}})):{name:t.name,value:n.replace(St,"\r\n")}})).get()}});var Lt=/%20/g,Nt=/#.*$/,Mt=/([?&])_=[^&]*/,jt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Dt=/^(?:GET|HEAD)$/,At=/^\/\//,Rt={},It={},zt="*/".concat("*"),Bt=b.createElement("a");function Ut(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,o=0,i=t.toLowerCase().match(I)||[];if(v(n))for(;r=i[o++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function Ht(e,t,n,r){var o={},i=e===It;function a(s){var l;return o[s]=!0,_.each(e[s]||[],(function(e,s){var u=s(t,n,r);return"string"!=typeof u||i||o[u]?i?!(l=u):void 0:(t.dataTypes.unshift(u),a(u),!1)})),l}return a(t.dataTypes[0])||!o["*"]&&a("*")}function Ft(e,t){var n,r,o=_.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((o[n]?e:r||(r={}))[n]=t[n]);return r&&_.extend(!0,e,r),e}Bt.href=xt.href,_.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:xt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(xt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":zt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":_.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Ft(Ft(e,_.ajaxSettings),t):Ft(_.ajaxSettings,e)},ajaxPrefilter:Ut(Rt),ajaxTransport:Ut(It),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var r,o,i,a,s,l,u,c,f,p,d=_.ajaxSetup({},t),h=d.context||d,m=d.context&&(h.nodeType||h.jquery)?_(h):_.event,g=_.Deferred(),v=_.Callbacks("once memory"),y=d.statusCode||{},w={},E={},x="canceled",k={readyState:0,getResponseHeader:function(e){var t;if(u){if(!a)for(a={};t=jt.exec(i);)a[t[1].toLowerCase()+" "]=(a[t[1].toLowerCase()+" "]||[]).concat(t[2]);t=a[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return u?i:null},setRequestHeader:function(e,t){return null==u&&(e=E[e.toLowerCase()]=E[e.toLowerCase()]||e,w[e]=t),this},overrideMimeType:function(e){return null==u&&(d.mimeType=e),this},statusCode:function(e){var t;if(e)if(u)k.always(e[k.status]);else for(t in e)y[t]=[y[t],e[t]];return this},abort:function(e){var t=e||x;return r&&r.abort(t),C(0,t),this}};if(g.promise(k),d.url=((e||d.url||xt.href)+"").replace(At,xt.protocol+"//"),d.type=t.method||t.type||d.method||d.type,d.dataTypes=(d.dataType||"*").toLowerCase().match(I)||[""],null==d.crossDomain){l=b.createElement("a");try{l.href=d.url,l.href=l.href,d.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){d.crossDomain=!0}}if(d.data&&d.processData&&"string"!=typeof d.data&&(d.data=_.param(d.data,d.traditional)),Ht(Rt,d,t,k),u)return k;for(f in(c=_.event&&d.global)&&0==_.active++&&_.event.trigger("ajaxStart"),d.type=d.type.toUpperCase(),d.hasContent=!Dt.test(d.type),o=d.url.replace(Nt,""),d.hasContent?d.data&&d.processData&&0===(d.contentType||"").indexOf("application/x-www-form-urlencoded")&&(d.data=d.data.replace(Lt,"+")):(p=d.url.slice(o.length),d.data&&(d.processData||"string"==typeof d.data)&&(o+=(kt.test(o)?"&":"?")+d.data,delete d.data),!1===d.cache&&(o=o.replace(Mt,"$1"),p=(kt.test(o)?"&":"?")+"_="+_t.guid+++p),d.url=o+p),d.ifModified&&(_.lastModified[o]&&k.setRequestHeader("If-Modified-Since",_.lastModified[o]),_.etag[o]&&k.setRequestHeader("If-None-Match",_.etag[o])),(d.data&&d.hasContent&&!1!==d.contentType||t.contentType)&&k.setRequestHeader("Content-Type",d.contentType),k.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+("*"!==d.dataTypes[0]?", "+zt+"; q=0.01":""):d.accepts["*"]),d.headers)k.setRequestHeader(f,d.headers[f]);if(d.beforeSend&&(!1===d.beforeSend.call(h,k,d)||u))return k.abort();if(x="abort",v.add(d.complete),k.done(d.success),k.fail(d.error),r=Ht(It,d,t,k)){if(k.readyState=1,c&&m.trigger("ajaxSend",[k,d]),u)return k;d.async&&d.timeout>0&&(s=n.setTimeout((function(){k.abort("timeout")}),d.timeout));try{u=!1,r.send(w,C)}catch(e){if(u)throw e;C(-1,e)}}else C(-1,"No Transport");function C(e,t,a,l){var f,p,b,w,E,x=t;u||(u=!0,s&&n.clearTimeout(s),r=void 0,i=l||"",k.readyState=e>0?4:0,f=e>=200&&e<300||304===e,a&&(w=function(e,t,n){for(var r,o,i,a,s=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(o in s)if(s[o]&&s[o].test(r)){l.unshift(o);break}if(l[0]in n)i=l[0];else{for(o in n){if(!l[0]||e.converters[o+" "+l[0]]){i=o;break}a||(a=o)}i=i||a}if(i)return i!==l[0]&&l.unshift(i),n[i]}(d,k,a)),!f&&_.inArray("script",d.dataTypes)>-1&&_.inArray("json",d.dataTypes)<0&&(d.converters["text script"]=function(){}),w=function(e,t,n,r){var o,i,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];for(i=c.shift();i;)if(e.responseFields[i]&&(n[e.responseFields[i]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=i,i=c.shift())if("*"===i)i=l;else if("*"!==l&&l!==i){if(!(a=u[l+" "+i]||u["* "+i]))for(o in u)if((s=o.split(" "))[1]===i&&(a=u[l+" "+s[0]]||u["* "+s[0]])){!0===a?a=u[o]:!0!==u[o]&&(i=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e.throws)t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+l+" to "+i}}}return{state:"success",data:t}}(d,w,k,f),f?(d.ifModified&&((E=k.getResponseHeader("Last-Modified"))&&(_.lastModified[o]=E),(E=k.getResponseHeader("etag"))&&(_.etag[o]=E)),204===e||"HEAD"===d.type?x="nocontent":304===e?x="notmodified":(x=w.state,p=w.data,f=!(b=w.error))):(b=x,!e&&x||(x="error",e<0&&(e=0))),k.status=e,k.statusText=(t||x)+"",f?g.resolveWith(h,[p,x,k]):g.rejectWith(h,[k,x,b]),k.statusCode(y),y=void 0,c&&m.trigger(f?"ajaxSuccess":"ajaxError",[k,d,f?p:b]),v.fireWith(h,[k,x]),c&&(m.trigger("ajaxComplete",[k,d]),--_.active||_.event.trigger("ajaxStop")))}return k},getJSON:function(e,t,n){return _.get(e,t,n,"json")},getScript:function(e,t){return _.get(e,void 0,t,"script")}}),_.each(["get","post"],(function(e,t){_[t]=function(e,n,r,o){return v(n)&&(o=o||r,r=n,n=void 0),_.ajax(_.extend({url:e,type:t,dataType:o,data:n,success:r},_.isPlainObject(e)&&e))}})),_.ajaxPrefilter((function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")})),_._evalUrl=function(e,t,n){return _.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){_.globalEval(e,t,n)}})},_.fn.extend({wrapAll:function(e){var t;return this[0]&&(v(e)&&(e=e.call(this[0])),t=_(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map((function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e})).append(this)),this},wrapInner:function(e){return v(e)?this.each((function(t){_(this).wrapInner(e.call(this,t))})):this.each((function(){var t=_(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)}))},wrap:function(e){var t=v(e);return this.each((function(n){_(this).wrapAll(t?e.call(this,n):e)}))},unwrap:function(e){return this.parent(e).not("body").each((function(){_(this).replaceWith(this.childNodes)})),this}}),_.expr.pseudos.hidden=function(e){return!_.expr.pseudos.visible(e)},_.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},_.ajaxSettings.xhr=function(){try{return new n.XMLHttpRequest}catch(e){}};var Wt={0:200,1223:204},$t=_.ajaxSettings.xhr();g.cors=!!$t&&"withCredentials"in $t,g.ajax=$t=!!$t,_.ajaxTransport((function(e){var t,r;if(g.cors||$t&&!e.crossDomain)return{send:function(o,i){var a,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(a in e.xhrFields)s[a]=e.xhrFields[a];for(a in e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||o["X-Requested-With"]||(o["X-Requested-With"]="XMLHttpRequest"),o)s.setRequestHeader(a,o[a]);t=function(e){return function(){t&&(t=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?i(0,"error"):i(s.status,s.statusText):i(Wt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=t(),r=s.onerror=s.ontimeout=t("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&n.setTimeout((function(){t&&r()}))},t=t("abort");try{s.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}})),_.ajaxPrefilter((function(e){e.crossDomain&&(e.contents.script=!1)})),_.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return _.globalEval(e),e}}}),_.ajaxPrefilter("script",(function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")})),_.ajaxTransport("script",(function(e){var t,n;if(e.crossDomain||e.scriptAttrs)return{send:function(r,o){t=_("<script>").attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),b.head.appendChild(t[0])},abort:function(){n&&n()}}}));var qt,Vt=[],Qt=/(=)\?(?=&|$)|\?\?/;_.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Vt.pop()||_.expando+"_"+_t.guid++;return this[e]=!0,e}}),_.ajaxPrefilter("json jsonp",(function(e,t,r){var o,i,a,s=!1!==e.jsonp&&(Qt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return o=e.jsonpCallback=v(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(Qt,"$1"+o):!1!==e.jsonp&&(e.url+=(kt.test(e.url)?"&":"?")+e.jsonp+"="+o),e.converters["script json"]=function(){return a||_.error(o+" was not called"),a[0]},e.dataTypes[0]="json",i=n[o],n[o]=function(){a=arguments},r.always((function(){void 0===i?_(n).removeProp(o):n[o]=i,e[o]&&(e.jsonpCallback=t.jsonpCallback,Vt.push(o)),a&&v(i)&&i(a[0]),a=i=void 0})),"script"})),g.createHTMLDocument=((qt=b.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===qt.childNodes.length),_.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(g.createHTMLDocument?((r=(t=b.implementation.createHTMLDocument("")).createElement("base")).href=b.location.href,t.head.appendChild(r)):t=b),i=!n&&[],(o=L.exec(e))?[t.createElement(o[1])]:(o=xe([e],t,i),i&&i.length&&_(i).remove(),_.merge([],o.childNodes)));var r,o,i},_.fn.load=function(e,t,n){var r,o,i,a=this,s=e.indexOf(" ");return s>-1&&(r=gt(e.slice(s)),e=e.slice(0,s)),v(t)?(n=t,t=void 0):t&&"object"==typeof t&&(o="POST"),a.length>0&&_.ajax({url:e,type:o||"GET",dataType:"html",data:t}).done((function(e){i=arguments,a.html(r?_("<div>").append(_.parseHTML(e)).find(r):e)})).always(n&&function(e,t){a.each((function(){n.apply(this,i||[e.responseText,t,e])}))}),this},_.expr.pseudos.animated=function(e){return _.grep(_.timers,(function(t){return e===t.elem})).length},_.offset={setOffset:function(e,t,n){var r,o,i,a,s,l,u=_.css(e,"position"),c=_(e),f={};"static"===u&&(e.style.position="relative"),s=c.offset(),i=_.css(e,"top"),l=_.css(e,"left"),("absolute"===u||"fixed"===u)&&(i+l).indexOf("auto")>-1?(a=(r=c.position()).top,o=r.left):(a=parseFloat(i)||0,o=parseFloat(l)||0),v(t)&&(t=t.call(e,n,_.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+o),"using"in t?t.using.call(e,f):c.css(f)}},_.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each((function(t){_.offset.setOffset(this,e,t)}));var t,n,r=this[0];return r?r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],o={top:0,left:0};if("fixed"===_.css(r,"position"))t=r.getBoundingClientRect();else{for(t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&"static"===_.css(e,"position");)e=e.parentNode;e&&e!==r&&1===e.nodeType&&((o=_(e).offset()).top+=_.css(e,"borderTopWidth",!0),o.left+=_.css(e,"borderLeftWidth",!0))}return{top:t.top-o.top-_.css(r,"marginTop",!0),left:t.left-o.left-_.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map((function(){for(var e=this.offsetParent;e&&"static"===_.css(e,"position");)e=e.offsetParent;return e||ie}))}}),_.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},(function(e,t){var n="pageYOffset"===t;_.fn[e]=function(r){return $(this,(function(e,r,o){var i;if(y(e)?i=e:9===e.nodeType&&(i=e.defaultView),void 0===o)return i?i[t]:e[r];i?i.scrollTo(n?i.pageXOffset:o,n?o:i.pageYOffset):e[r]=o}),e,r,arguments.length)}})),_.each(["top","left"],(function(e,t){_.cssHooks[t]=$e(g.pixelPosition,(function(e,n){if(n)return n=We(e,t),Be.test(n)?_(e).position()[t]+"px":n}))})),_.each({Height:"height",Width:"width"},(function(e,t){_.each({padding:"inner"+e,content:t,"":"outer"+e},(function(n,r){_.fn[r]=function(o,i){var a=arguments.length&&(n||"boolean"!=typeof o),s=n||(!0===o||!0===i?"margin":"border");return $(this,(function(t,n,o){var i;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===o?_.css(t,n,s):_.style(t,n,o,s)}),t,a?o:void 0,a)}}))})),_.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],(function(e,t){_.fn[t]=function(e){return this.on(t,e)}})),_.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),_.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),(function(e,t){_.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}));var Kt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;_.proxy=function(e,t){var n,r,o;if("string"==typeof t&&(n=e[t],t=e,e=n),v(e))return r=s.call(arguments,2),(o=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||_.guid++,o},_.holdReady=function(e){e?_.readyWait++:_.ready(!0)},_.isArray=Array.isArray,_.parseJSON=JSON.parse,_.nodeName=T,_.isFunction=v,_.isWindow=y,_.camelCase=K,_.type=x,_.now=Date.now,_.isNumeric=function(e){var t=_.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},_.trim=function(e){return null==e?"":(e+"").replace(Kt,"")},void 0===(r=function(){return _}.apply(t,[]))||(e.exports=r);var Yt=n.jQuery,Xt=n.$;return _.noConflict=function(e){return n.$===_&&(n.$=Xt),e&&n.jQuery===_&&(n.jQuery=Yt),_},void 0===o&&(n.jQuery=n.$=_),_}))},function(e,t,n){"use strict";n.r(t);var r={};n.r(r),n.d(r,"top",(function(){return zo})),n.d(r,"bottom",(function(){return Bo})),n.d(r,"right",(function(){return Uo})),n.d(r,"left",(function(){return Ho})),n.d(r,"auto",(function(){return Fo})),n.d(r,"basePlacements",(function(){return Wo})),n.d(r,"start",(function(){return $o})),n.d(r,"end",(function(){return qo})),n.d(r,"clippingParents",(function(){return Vo})),n.d(r,"viewport",(function(){return Qo})),n.d(r,"popper",(function(){return Ko})),n.d(r,"reference",(function(){return Yo})),n.d(r,"variationPlacements",(function(){return Xo})),n.d(r,"placements",(function(){return Go})),n.d(r,"beforeRead",(function(){return Zo})),n.d(r,"read",(function(){return Jo})),n.d(r,"afterRead",(function(){return ei})),n.d(r,"beforeMain",(function(){return ti})),n.d(r,"main",(function(){return ni})),n.d(r,"afterMain",(function(){return ri})),n.d(r,"beforeWrite",(function(){return oi})),n.d(r,"write",(function(){return ii})),n.d(r,"afterWrite",(function(){return ai})),n.d(r,"modifierPhases",(function(){return si})),n.d(r,"applyStyles",(function(){return di})),n.d(r,"arrow",(function(){return Ni})),n.d(r,"computeStyles",(function(){return Ai})),n.d(r,"eventListeners",(function(){return Ii})),n.d(r,"flip",(function(){return Gi})),n.d(r,"hide",(function(){return ea})),n.d(r,"offset",(function(){return ta})),n.d(r,"popperOffsets",(function(){return na})),n.d(r,"preventOverflow",(function(){return ra})),n.d(r,"popperGenerator",(function(){return la})),n.d(r,"detectOverflow",(function(){return Xi})),n.d(r,"createPopperBase",(function(){return ua})),n.d(r,"createPopper",(function(){return ca})),n.d(r,"createPopperLite",(function(){return fa}));var o=n(0),i=n.n(o),a=n(4),s=n.n(a),l=n(3),u=(n(5),n(1));function c(e){return"/"===e.charAt(0)}function f(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}var p=function(e,t){void 0===t&&(t="");var n,r=e&&e.split("/")||[],o=t&&t.split("/")||[],i=e&&c(e),a=t&&c(t),s=i||a;if(e&&c(e)?o=r:r.length&&(o.pop(),o=o.concat(r)),!o.length)return"/";if(o.length){var l=o[o.length-1];n="."===l||".."===l||""===l}else n=!1;for(var u=0,p=o.length;p>=0;p--){var d=o[p];"."===d?f(o,p):".."===d?(f(o,p),u++):u&&(f(o,p),u--)}if(!s)for(;u--;u)o.unshift("..");!s||""===o[0]||o[0]&&c(o[0])||o.unshift("");var h=o.join("/");return n&&"/"!==h.substr(-1)&&(h+="/"),h};function d(e){return e.valueOf?e.valueOf():Object.prototype.valueOf.call(e)}var h=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every((function(t,r){return e(t,n[r])}));if("object"==typeof t||"object"==typeof n){var r=d(t),o=d(n);return r!==t||o!==n?e(r,o):Object.keys(Object.assign({},t,n)).every((function(r){return e(t[r],n[r])}))}return!1},m="Invariant failed";function g(e,t){if(!e)throw new Error(m)}function v(e){return"/"===e.charAt(0)?e:"/"+e}function y(e){return"/"===e.charAt(0)?e.substr(1):e}function b(e,t){return function(e,t){return 0===e.toLowerCase().indexOf(t.toLowerCase())&&-1!=="/?#".indexOf(e.charAt(t.length))}(e,t)?e.substr(t.length):e}function w(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e}function E(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}function x(e,t,n,r){var o;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=Object(u.a)({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=p(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o}function _(){var e=null;var t=[];return{setPrompt:function(t){return e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,o):o(!0):o(!1!==i)}else o(!0)},appendListener:function(e){var n=!0;function r(){n&&e.apply(void 0,arguments)}return t.push(r),function(){n=!1,t=t.filter((function(e){return e!==r}))}},notifyListeners:function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach((function(e){return e.apply(void 0,n)}))}}}var k=!("undefined"==typeof window||!window.document||!window.document.createElement);function C(e,t){t(window.confirm(e))}function S(){try{return window.history.state||{}}catch(e){return{}}}function O(e){void 0===e&&(e={}),k||g(!1);var t,n=window.history,r=(-1===(t=window.navigator.userAgent).indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&window.history&&"pushState"in window.history,o=!(-1===window.navigator.userAgent.indexOf("Trident")),i=e,a=i.forceRefresh,s=void 0!==a&&a,l=i.getUserConfirmation,c=void 0===l?C:l,f=i.keyLength,p=void 0===f?6:f,d=e.basename?w(v(e.basename)):"";function h(e){var t=e||{},n=t.key,r=t.state,o=window.location,i=o.pathname+o.search+o.hash;return d&&(i=b(i,d)),x(i,r,n)}function m(){return Math.random().toString(36).substr(2,p)}var y=_();function O(e){Object(u.a)(B,e),B.length=n.length,y.notifyListeners(B.location,B.action)}function P(e){(function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")})(e)||N(h(e.state))}function T(){N(h(S()))}var L=!1;function N(e){if(L)L=!1,O();else{y.confirmTransitionTo(e,"POP",c,(function(t){t?O({action:"POP",location:e}):function(e){var t=B.location,n=j.indexOf(t.key);-1===n&&(n=0);var r=j.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(L=!0,A(o))}(e)}))}}var M=h(S()),j=[M.key];function D(e){return d+E(e)}function A(e){n.go(e)}var R=0;function I(e){1===(R+=e)&&1===e?(window.addEventListener("popstate",P),o&&window.addEventListener("hashchange",T)):0===R&&(window.removeEventListener("popstate",P),o&&window.removeEventListener("hashchange",T))}var z=!1;var B={length:n.length,action:"POP",location:M,createHref:D,push:function(e,t){var o=x(e,t,m(),B.location);y.confirmTransitionTo(o,"PUSH",c,(function(e){if(e){var t=D(o),i=o.key,a=o.state;if(r)if(n.pushState({key:i,state:a},null,t),s)window.location.href=t;else{var l=j.indexOf(B.location.key),u=j.slice(0,l+1);u.push(o.key),j=u,O({action:"PUSH",location:o})}else window.location.href=t}}))},replace:function(e,t){var o=x(e,t,m(),B.location);y.confirmTransitionTo(o,"REPLACE",c,(function(e){if(e){var t=D(o),i=o.key,a=o.state;if(r)if(n.replaceState({key:i,state:a},null,t),s)window.location.replace(t);else{var l=j.indexOf(B.location.key);-1!==l&&(j[l]=o.key),O({action:"REPLACE",location:o})}else window.location.replace(t)}}))},go:A,goBack:function(){A(-1)},goForward:function(){A(1)},block:function(e){void 0===e&&(e=!1);var t=y.setPrompt(e);return z||(I(1),z=!0),function(){return z&&(z=!1,I(-1)),t()}},listen:function(e){var t=y.appendListener(e);return I(1),function(){I(-1),t()}}};return B}var P={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+y(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:y,decodePath:v},slash:{encodePath:v,decodePath:v}};function T(e){var t=e.indexOf("#");return-1===t?e:e.slice(0,t)}function L(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)}function N(e){window.location.replace(T(window.location.href)+"#"+e)}function M(e){void 0===e&&(e={}),k||g(!1);var t=window.history,n=(window.navigator.userAgent.indexOf("Firefox"),e),r=n.getUserConfirmation,o=void 0===r?C:r,i=n.hashType,a=void 0===i?"slash":i,s=e.basename?w(v(e.basename)):"",l=P[a],c=l.encodePath,f=l.decodePath;function p(){var e=f(L());return s&&(e=b(e,s)),x(e)}var d=_();function h(e){Object(u.a)(B,e),B.length=t.length,d.notifyListeners(B.location,B.action)}var m=!1,y=null;function S(){var e,t,n=L(),r=c(n);if(n!==r)N(r);else{var i=p(),a=B.location;if(!m&&(t=i,(e=a).pathname===t.pathname&&e.search===t.search&&e.hash===t.hash))return;if(y===E(i))return;y=null,function(e){if(m)m=!1,h();else{d.confirmTransitionTo(e,"POP",o,(function(t){t?h({action:"POP",location:e}):function(e){var t=B.location,n=D.lastIndexOf(E(t));-1===n&&(n=0);var r=D.lastIndexOf(E(e));-1===r&&(r=0);var o=n-r;o&&(m=!0,A(o))}(e)}))}}(i)}}var O=L(),M=c(O);O!==M&&N(M);var j=p(),D=[E(j)];function A(e){t.go(e)}var R=0;function I(e){1===(R+=e)&&1===e?window.addEventListener("hashchange",S):0===R&&window.removeEventListener("hashchange",S)}var z=!1;var B={length:t.length,action:"POP",location:j,createHref:function(e){var t=document.querySelector("base"),n="";return t&&t.getAttribute("href")&&(n=T(window.location.href)),n+"#"+c(s+E(e))},push:function(e,t){var n=x(e,void 0,void 0,B.location);d.confirmTransitionTo(n,"PUSH",o,(function(e){if(e){var t=E(n),r=c(s+t);if(L()!==r){y=t,function(e){window.location.hash=e}(r);var o=D.lastIndexOf(E(B.location)),i=D.slice(0,o+1);i.push(t),D=i,h({action:"PUSH",location:n})}else h()}}))},replace:function(e,t){var n=x(e,void 0,void 0,B.location);d.confirmTransitionTo(n,"REPLACE",o,(function(e){if(e){var t=E(n),r=c(s+t);L()!==r&&(y=t,N(r));var o=D.indexOf(E(B.location));-1!==o&&(D[o]=t),h({action:"REPLACE",location:n})}}))},go:A,goBack:function(){A(-1)},goForward:function(){A(1)},block:function(e){void 0===e&&(e=!1);var t=d.setPrompt(e);return z||(I(1),z=!0),function(){return z&&(z=!1,I(-1)),t()}},listen:function(e){var t=d.appendListener(e);return I(1),function(){I(-1),t()}}};return B}function j(e,t,n){return Math.min(Math.max(e,t),n)}function D(e){void 0===e&&(e={});var t=e,n=t.getUserConfirmation,r=t.initialEntries,o=void 0===r?["/"]:r,i=t.initialIndex,a=void 0===i?0:i,s=t.keyLength,l=void 0===s?6:s,c=_();function f(e){Object(u.a)(v,e),v.length=v.entries.length,c.notifyListeners(v.location,v.action)}function p(){return Math.random().toString(36).substr(2,l)}var d=j(a,0,o.length-1),h=o.map((function(e){return x(e,void 0,"string"==typeof e?p():e.key||p())})),m=E;function g(e){var t=j(v.index+e,0,v.entries.length-1),r=v.entries[t];c.confirmTransitionTo(r,"POP",n,(function(e){e?f({action:"POP",location:r,index:t}):f()}))}var v={length:h.length,action:"POP",location:h[d],index:d,entries:h,createHref:m,push:function(e,t){var r=x(e,t,p(),v.location);c.confirmTransitionTo(r,"PUSH",n,(function(e){if(e){var t=v.index+1,n=v.entries.slice(0);n.length>t?n.splice(t,n.length-t,r):n.push(r),f({action:"PUSH",location:r,index:t,entries:n})}}))},replace:function(e,t){var r=x(e,t,p(),v.location);c.confirmTransitionTo(r,"REPLACE",n,(function(e){e&&(v.entries[v.index]=r,f({action:"REPLACE",location:r}))}))},go:g,goBack:function(){g(-1)},goForward:function(){g(1)},canGo:function(e){var t=v.index+e;return t>=0&&t<v.entries.length},block:function(e){return void 0===e&&(e=!1),c.setPrompt(e)},listen:function(e){return c.appendListener(e)}};return v}var A=n(12),R=n(8),I=n.n(R),z=(n(24),n(2)),B=n(6),U=n.n(B),H=function(e){var t=Object(A.a)();return t.displayName=e,t},F=H("Router-History"),W=H("Router"),q=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={location:t.history.location},n._isMounted=!1,n._pendingLocation=null,t.staticContext||(n.unlisten=t.history.listen((function(e){n._isMounted?n.setState({location:e}):n._pendingLocation=e}))),n}Object(l.a)(t,e),t.computeRootMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}};var n=t.prototype;return n.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},n.componentWillUnmount=function(){this.unlisten&&(this.unlisten(),this._isMounted=!1,this._pendingLocation=null)},n.render=function(){return i.a.createElement(W.Provider,{value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}},i.a.createElement(F.Provider,{children:this.props.children||null,value:this.props.history}))},t}(i.a.Component);i.a.Component;var V=function(e){function t(){return e.apply(this,arguments)||this}Object(l.a)(t,e);var n=t.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(e){this.props.onUpdate&&this.props.onUpdate.call(this,this,e)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},t}(i.a.Component);var Q={},K=0;function Y(e,t){return void 0===e&&(e="/"),void 0===t&&(t={}),"/"===e?e:function(e){if(Q[e])return Q[e];var t=I.a.compile(e);return K<1e4&&(Q[e]=t,K++),t}(e)(t,{pretty:!0})}function X(e){var t=e.computedMatch,n=e.to,r=e.push,o=void 0!==r&&r;return i.a.createElement(W.Consumer,null,(function(e){e||g(!1);var r=e.history,a=e.staticContext,s=o?r.push:r.replace,l=x(t?"string"==typeof n?Y(n,t.params):Object(u.a)({},n,{pathname:Y(n.pathname,t.params)}):n);return a?(s(l),null):i.a.createElement(V,{onMount:function(){s(l)},onUpdate:function(e,t){var n,r,o=x(t.to);n=o,r=Object(u.a)({},l,{key:o.key}),n.pathname===r.pathname&&n.search===r.search&&n.hash===r.hash&&n.key===r.key&&h(n.state,r.state)||s(l)},to:n})}))}var G={},Z=0;function J(e,t){void 0===t&&(t={}),("string"==typeof t||Array.isArray(t))&&(t={path:t});var n=t,r=n.path,o=n.exact,i=void 0!==o&&o,a=n.strict,s=void 0!==a&&a,l=n.sensitive,u=void 0!==l&&l;return[].concat(r).reduce((function(t,n){if(!n&&""!==n)return null;if(t)return t;var r=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=G[n]||(G[n]={});if(r[e])return r[e];var o=[],i={regexp:I()(e,o,t),keys:o};return Z<1e4&&(r[e]=i,Z++),i}(n,{end:i,strict:s,sensitive:u}),o=r.regexp,a=r.keys,l=o.exec(e);if(!l)return null;var c=l[0],f=l.slice(1),p=e===c;return i&&!p?null:{path:n,url:"/"===n&&""===c?"/":c,isExact:p,params:a.reduce((function(e,t,n){return e[t.name]=f[n],e}),{})}}),null)}var ee=function(e){function t(){return e.apply(this,arguments)||this}return Object(l.a)(t,e),t.prototype.render=function(){var e=this;return i.a.createElement(W.Consumer,null,(function(t){t||g(!1);var n=e.props.location||t.location,r=e.props.computedMatch?e.props.computedMatch:e.props.path?J(n.pathname,e.props):t.match,o=Object(u.a)({},t,{location:n,match:r}),a=e.props,s=a.children,l=a.component,c=a.render;return Array.isArray(s)&&function(e){return 0===i.a.Children.count(e)}(s)&&(s=null),i.a.createElement(W.Provider,{value:o},o.match?s?"function"==typeof s?s(o):s:l?i.a.createElement(l,o):c?c(o):null:"function"==typeof s?s(o):null)}))},t}(i.a.Component);function te(e){return"/"===e.charAt(0)?e:"/"+e}function ne(e,t){if(!e)return t;var n=te(e);return 0!==t.pathname.indexOf(n)?t:Object(u.a)({},t,{pathname:t.pathname.substr(n.length)})}function re(e){return"string"==typeof e?e:E(e)}function oe(e){return function(){g(!1)}}function ie(){}i.a.Component;var ae=function(e){function t(){return e.apply(this,arguments)||this}return Object(l.a)(t,e),t.prototype.render=function(){var e=this;return i.a.createElement(W.Consumer,null,(function(t){t||g(!1);var n,r,o=e.props.location||t.location;return i.a.Children.forEach(e.props.children,(function(e){if(null==r&&i.a.isValidElement(e)){n=e;var a=e.props.path||e.props.from;r=a?J(o.pathname,Object(u.a)({},e.props,{path:a})):t.match}})),r?i.a.cloneElement(n,{location:o,computedMatch:r}):null}))},t}(i.a.Component);function se(e){var t="withRouter("+(e.displayName||e.name)+")",n=function(t){var n=t.wrappedComponentRef,r=Object(z.a)(t,["wrappedComponentRef"]);return i.a.createElement(W.Consumer,null,(function(t){return t||g(!1),i.a.createElement(e,Object(u.a)({},r,t,{ref:n}))}))};return n.displayName=t,n.WrappedComponent=e,U()(n,e)}i.a.useContext;i.a.Component;var le=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(t=e.call.apply(e,[this].concat(r))||this).history=M(t.props),t}return Object(l.a)(t,e),t.prototype.render=function(){return i.a.createElement(q,{history:this.history,children:this.props.children})},t}(i.a.Component);var ue=function(e,t){return"function"==typeof e?e(t):e},ce=function(e,t){return"string"==typeof e?x(e,null,null,t):e},fe=function(e){return e},pe=i.a.forwardRef;void 0===pe&&(pe=fe);var de=pe((function(e,t){var n=e.innerRef,r=e.navigate,o=e.onClick,a=Object(z.a)(e,["innerRef","navigate","onClick"]),s=a.target,l=Object(u.a)({},a,{onClick:function(e){try{o&&o(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||s&&"_self"!==s||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)||(e.preventDefault(),r())}});return l.ref=fe!==pe&&t||n,i.a.createElement("a",l)}));var he=pe((function(e,t){var n=e.component,r=void 0===n?de:n,o=e.replace,a=e.to,s=e.innerRef,l=Object(z.a)(e,["component","replace","to","innerRef"]);return i.a.createElement(W.Consumer,null,(function(e){e||g(!1);var n=e.history,c=ce(ue(a,e.location),e.location),f=c?n.createHref(c):"",p=Object(u.a)({},l,{href:f,navigate:function(){var t=ue(a,e.location),r=E(e.location)===E(ce(t));(o||r?n.replace:n.push)(t)}});return fe!==pe?p.ref=t||s:p.innerRef=s,i.a.createElement(r,p)}))})),me=function(e){return e},ge=i.a.forwardRef;void 0===ge&&(ge=me);ge((function(e,t){var n=e["aria-current"],r=void 0===n?"page":n,o=e.activeClassName,a=void 0===o?"active":o,s=e.activeStyle,l=e.className,c=e.exact,f=e.isActive,p=e.location,d=e.sensitive,h=e.strict,m=e.style,v=e.to,y=e.innerRef,b=Object(z.a)(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return i.a.createElement(W.Consumer,null,(function(e){e||g(!1);var n=p||e.location,o=ce(ue(v,n),n),w=o.pathname,E=w&&w.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),x=E?J(n.pathname,{path:E,exact:c,sensitive:d,strict:h}):null,_=!!(f?f(x,n):x),k="function"==typeof l?l(_):l,C="function"==typeof m?m(_):m;_&&(k=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return e})).join(" ")}(k,a),C=Object(u.a)({},C,s));var S=Object(u.a)({"aria-current":_&&r||null,className:k,style:C,to:o},b);return me!==ge?S.ref=t||y:S.innerRef=y,i.a.createElement(he,S)}))}));var ve=i.a.createContext(null);var ye=function(e){e()};function be(){var e=ye,t=null,n=null;return{clear:function(){t=null,n=null},notify:function(){e((function(){for(var e=t;e;)e.callback(),e=e.next}))},get:function(){for(var e=[],n=t;n;)e.push(n),n=n.next;return e},subscribe:function(e){var r=!0,o=n={callback:e,next:null,prev:n};return o.prev?o.prev.next=o:t=o,function(){r&&null!==t&&(r=!1,o.next?o.next.prev=o.prev:n=o.prev,o.prev?o.prev.next=o.next:t=o.next)}}}}var we={notify:function(){},get:function(){return[]}};function Ee(e,t){var n,r=we;function o(){a.onStateChange&&a.onStateChange()}function i(){n||(n=t?t.addNestedSub(o):e.subscribe(o),r=be())}var a={addNestedSub:function(e){return i(),r.subscribe(e)},notifyNestedSubs:function(){r.notify()},handleChangeWrapper:o,isSubscribed:function(){return Boolean(n)},trySubscribe:i,tryUnsubscribe:function(){n&&(n(),n=void 0,r.clear(),r=we)},getListeners:function(){return r}};return a}var xe="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?o.useLayoutEffect:o.useEffect;var _e=function(e){var t=e.store,n=e.context,r=e.children,a=Object(o.useMemo)((function(){var e=Ee(t);return e.onStateChange=e.notifyNestedSubs,{store:t,subscription:e}}),[t]),s=Object(o.useMemo)((function(){return t.getState()}),[t]);xe((function(){var e=a.subscription;return e.trySubscribe(),s!==t.getState()&&e.notifyNestedSubs(),function(){e.tryUnsubscribe(),e.onStateChange=null}}),[a,s]);var l=n||ve;return i.a.createElement(l.Provider,{value:a},r)},ke=n(11),Ce=["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"],Se=["reactReduxForwardedRef"],Oe=[],Pe=[null,null];function Te(e,t){var n=e[1];return[t.payload,n+1]}function Le(e,t,n){xe((function(){return e.apply(void 0,t)}),n)}function Ne(e,t,n,r,o,i,a){e.current=r,t.current=o,n.current=!1,i.current&&(i.current=null,a())}function Me(e,t,n,r,o,i,a,s,l,u){if(e){var c=!1,f=null,p=function(){if(!c){var e,n,p=t.getState();try{e=r(p,o.current)}catch(e){n=e,f=e}n||(f=null),e===i.current?a.current||l():(i.current=e,s.current=e,a.current=!0,u({type:"STORE_UPDATED",payload:{error:n}}))}};n.onStateChange=p,n.trySubscribe(),p();return function(){if(c=!0,n.tryUnsubscribe(),n.onStateChange=null,f)throw f}}}var je=function(){return[null,0]};function De(e,t){void 0===t&&(t={});var n=t,r=n.getDisplayName,a=void 0===r?function(e){return"ConnectAdvanced("+e+")"}:r,s=n.methodName,l=void 0===s?"connectAdvanced":s,c=n.renderCountProp,f=void 0===c?void 0:c,p=n.shouldHandleStateChanges,d=void 0===p||p,h=n.storeKey,m=void 0===h?"store":h,g=(n.withRef,n.forwardRef),v=void 0!==g&&g,y=n.context,b=void 0===y?ve:y,w=Object(z.a)(n,Ce),E=b;return function(t){var n=t.displayName||t.name||"Component",r=a(n),s=Object(u.a)({},w,{getDisplayName:a,methodName:l,renderCountProp:f,shouldHandleStateChanges:d,storeKey:m,displayName:r,wrappedComponentName:n,WrappedComponent:t}),c=w.pure;var p=c?o.useMemo:function(e){return e()};function h(n){var r=Object(o.useMemo)((function(){var e=n.reactReduxForwardedRef,t=Object(z.a)(n,Se);return[n.context,e,t]}),[n]),a=r[0],l=r[1],c=r[2],f=Object(o.useMemo)((function(){return a&&a.Consumer&&Object(ke.isContextConsumer)(i.a.createElement(a.Consumer,null))?a:E}),[a,E]),h=Object(o.useContext)(f),m=Boolean(n.store)&&Boolean(n.store.getState)&&Boolean(n.store.dispatch);Boolean(h)&&Boolean(h.store);var g=m?n.store:h.store,v=Object(o.useMemo)((function(){return function(t){return e(t.dispatch,s)}(g)}),[g]),y=Object(o.useMemo)((function(){if(!d)return Pe;var e=Ee(g,m?null:h.subscription),t=e.notifyNestedSubs.bind(e);return[e,t]}),[g,m,h]),b=y[0],w=y[1],x=Object(o.useMemo)((function(){return m?h:Object(u.a)({},h,{subscription:b})}),[m,h,b]),_=Object(o.useReducer)(Te,Oe,je),k=_[0][0],C=_[1];if(k&&k.error)throw k.error;var S=Object(o.useRef)(),O=Object(o.useRef)(c),P=Object(o.useRef)(),T=Object(o.useRef)(!1),L=p((function(){return P.current&&c===O.current?P.current:v(g.getState(),c)}),[g,k,c]);Le(Ne,[O,S,T,c,L,P,w]),Le(Me,[d,g,b,v,O,S,T,P,w,C],[g,b,v]);var N=Object(o.useMemo)((function(){return i.a.createElement(t,Object(u.a)({},L,{ref:l}))}),[l,t,L]);return Object(o.useMemo)((function(){return d?i.a.createElement(f.Provider,{value:x},N):N}),[f,N,x])}var g=c?i.a.memo(h):h;if(g.WrappedComponent=t,g.displayName=h.displayName=r,v){var y=i.a.forwardRef((function(e,t){return i.a.createElement(g,Object(u.a)({},e,{reactReduxForwardedRef:t}))}));return y.displayName=r,y.WrappedComponent=t,U()(y,t)}return U()(g,t)}}function Ae(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function Re(e,t){if(Ae(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!Object.prototype.hasOwnProperty.call(t,n[o])||!Ae(e[n[o]],t[n[o]]))return!1;return!0}function Ie(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function ze(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function Be(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=ze(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=ze(o),o=r(t,n)),o},r}}var Ue=[function(e){return"function"==typeof e?Be(e):void 0},function(e){return e?void 0:Ie((function(e){return{dispatch:e}}))},function(e){return e&&"object"==typeof e?Ie((function(t){return function(e,t){var n={},r=function(r){var o=e[r];"function"==typeof o&&(n[r]=function(){return t(o.apply(void 0,arguments))})};for(var o in e)r(o);return n}(e,t)})):void 0}];var He=[function(e){return"function"==typeof e?Be(e):void 0},function(e){return e?void 0:Ie((function(){return{}}))}];function Fe(e,t,n){return Object(u.a)({},n,e,t)}var We=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r,o=n.pure,i=n.areMergedPropsEqual,a=!1;return function(t,n,s){var l=e(t,n,s);return a?o&&i(l,r)||(r=l):(a=!0,r=l),r}}}(e):void 0},function(e){return e?void 0:function(){return Fe}}];var $e=["initMapStateToProps","initMapDispatchToProps","initMergeProps"];function qe(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function Ve(e,t,n,r,o){var i,a,s,l,u,c=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1;function h(o,d){var h,m,g=!f(d,a),v=!c(o,i);return i=o,a=d,g&&v?(s=e(i,a),t.dependsOnOwnProps&&(l=t(r,a)),u=n(s,l,a)):g?(e.dependsOnOwnProps&&(s=e(i,a)),t.dependsOnOwnProps&&(l=t(r,a)),u=n(s,l,a)):v?(h=e(i,a),m=!p(h,s),s=h,m&&(u=n(s,l,a)),u):u}return function(o,c){return d?h(o,c):(s=e(i=o,a=c),l=t(r,a),u=n(s,l,a),d=!0,u)}}function Qe(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,i=Object(z.a)(t,$e),a=n(e,i),s=r(e,i),l=o(e,i);return(i.pure?Ve:qe)(a,s,l,e,i)}var Ke=["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"];function Ye(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function Xe(e,t){return e===t}function Ge(e){var t=void 0===e?{}:e,n=t.connectHOC,r=void 0===n?De:n,o=t.mapStateToPropsFactories,i=void 0===o?He:o,a=t.mapDispatchToPropsFactories,s=void 0===a?Ue:a,l=t.mergePropsFactories,c=void 0===l?We:l,f=t.selectorFactory,p=void 0===f?Qe:f;return function(e,t,n,o){void 0===o&&(o={});var a=o,l=a.pure,f=void 0===l||l,d=a.areStatesEqual,h=void 0===d?Xe:d,m=a.areOwnPropsEqual,g=void 0===m?Re:m,v=a.areStatePropsEqual,y=void 0===v?Re:v,b=a.areMergedPropsEqual,w=void 0===b?Re:b,E=Object(z.a)(a,Ke),x=Ye(e,i,"mapStateToProps"),_=Ye(t,s,"mapDispatchToProps"),k=Ye(n,c,"mergeProps");return r(p,Object(u.a)({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:x,initMapDispatchToProps:_,initMergeProps:k,pure:f,areStatesEqual:h,areOwnPropsEqual:g,areStatePropsEqual:y,areMergedPropsEqual:w},E))}}var Ze=Ge();var Je;Je=a.unstable_batchedUpdates,ye=Je;var et=function(e){return{type:"RECEIVE_HOME",home:e}},tt=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/homes",data:{searchParams:e}})}(e).then((function(e){return t(function(e){return{type:"RECEIVE_HOMES",homes:e}}(e))}))}},nt=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/homes/".concat(e)})}(e).then((function(e){return t(et(e))}))}},rt=function(e){return function(t){return function(e){return $.ajax({method:"post",url:"/api/homes",data:{home:e}})}(e).then((function(e){return t(et(e))}))}},ot=function(e){return function(t){return function(e){return $.ajax({method:"patch",url:"/api/homes/".concat(e.id),data:{home:e}})}(e).then((function(e){return t(et(e))}))}},it=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"api/reviews",data:{review:e}})}(e).then((function(e){return t(function(e){return{type:"RECEIVE_REVIEW",review:e}}(e))}),(function(e){return t(receiveReviewErrors(e.responseJSON))}))}},at=function(e){return function(t){return function(e){return $.ajax({method:"GET",url:"/api/reviews",data:{homeId:e}})}(e).then((function(e){return t(function(e){return{type:"RECEIVE_REVIEWS",reviews:e}}(e))}))}};function st(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var lt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_HOMES":return Object.assign({},e,t.homes);case"RECEIVE_HOME":return Object.assign({},e,st({},t.home.id,t.home));default:return e}};function ut(e){return(ut="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ct(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ft(e,t){return(ft=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function pt(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=mt(e);if(t){var o=mt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return dt(this,n)}}function dt(e,t){if(t&&("object"===ut(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return ht(e)}function ht(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function mt(e){return(mt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var gt=se(function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ft(e,t)}(a,e);var t,n,r,o=pt(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).handleClick=t.handleClick.bind(ht(t)),t}return t=a,(n=[{key:"handleClick",value:function(){this.props.history.push("/homes/".concat(this.props.home.id))}},{key:"showHome",value:function(){var e=[5,4.9,4.3,4.8,3.7,4.8,4.1,3.8,4.6,4.7][Math.floor(10*Math.random())],t=["Entire Apartment","Studio","Private Room","Shared Room","Entire Cabin","Farm Stay"][Math.floor(6*Math.random())],n=["https://aa-homes-dev.s3.ca-central-1.amazonaws.com/chicago.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/dallas.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/houston.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/nj.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/nyc.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/sanfran.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/vancouver.jpg","https://aa-homes-dev.s3.ca-central-1.amazonaws.com/toronto.jpg"][Math.floor(8*Math.random())],r=[1,2,3,4,5][Math.floor(5*Math.random())],o=this.props.home,a=o.home_name,s=o.price;return o.city,i.a.createElement("div",{className:"indiv-home"},i.a.createElement("div",{className:"indiv-home-container"},i.a.createElement("div",{className:"indiv-home-photo"},i.a.createElement("img",{src:n,className:"indiv-photo-index"})),i.a.createElement("div",{className:"details"},i.a.createElement("div",{className:"inner-details"},i.a.createElement("div",{className:"home-type"},t),i.a.createElement("ul",{className:"rating-home"},i.a.createElement("li",{className:"stars"},i.a.createElement("div",{className:"star"},i.a.createElement("i",{className:"fas fa-star"})),i.a.createElement("div",null,e)))),i.a.createElement("div",{className:"home-name",onClick:this.handleClick},i.a.createElement("h3",null,a)),i.a.createElement("div",{className:"home-info"},i.a.createElement("div",{className:"home-basic-info"},r," guests • ",r," bedroom • ",r," beds • ",r," bath"),i.a.createElement("div",{className:"home-basic-amenities"},"Wifi • Air conditioning • Washer • Free parking • Kitchen")))),i.a.createElement("div",{className:"home-price"},i.a.createElement("span",null,"$",s),"/night"))}},{key:"render",value:function(){return i.a.createElement("div",null,this.showHome())}}])&&ct(t.prototype,n),r&&ct(t,r),a}(i.a.Component)),vt=function(e,t,n,r,o,i,a,s){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var u=[n,r,o,i,a,s],c=0;(l=new Error(t.replace(/%s/g,(function(){return u[c++]})))).name="Invariant Violation"}throw l.framesToPop=1,l}};const yt=Object(o.createContext)(null);const bt=(e,t,n,r)=>{const o={};return function(e,t){Object.keys(e).forEach((function(n){return t(e[n],n)}))}(e,(e,i)=>{const a=n[i];a!==t[i]&&(o[i]=a,e(r,a))}),o};function wt(e,t,n){return((e,t,n)=>Object.keys(e).reduce((function(n,r){return t(n,e[r],r)}),n))(n,(function(n,r,o){return"function"==typeof e[o]&&n.push(google.maps.event.addListener(t,r,e[o])),n}),[])}function Et(e){google.maps.event.removeListener(e)}function xt(e=[]){e.forEach(Et)}function _t({updaterMap:e,eventMap:t,prevProps:n,nextProps:r,instance:o}){const i=wt(r,o,t);return bt(e,n,r,o),i}const kt={onDblClick:"dblclick",onDragEnd:"dragend",onDragStart:"dragstart",onMapTypeIdChanged:"maptypeid_changed",onMouseMove:"mousemove",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseDown:"mousedown",onMouseUp:"mouseup",onRightClick:"rightclick",onTilesLoaded:"tilesloaded",onBoundsChanged:"bounds_changed",onCenterChanged:"center_changed",onClick:"click",onDrag:"drag",onHeadingChanged:"heading_changed",onIdle:"idle",onProjectionChanged:"projection_changed",onResize:"resize",onTiltChanged:"tilt_changed",onZoomChanged:"zoom_changed"},Ct={extraMapTypes(e,t){t.forEach((function(t,n){e.mapTypes.set(String(n),t)}))},center(e,t){e.setCenter(t)},clickableIcons(e,t){e.setClickableIcons(t)},heading(e,t){e.setHeading(t)},mapTypeId(e,t){e.setMapTypeId(t)},options(e,t){e.setOptions(t)},streetView(e,t){e.setStreetView(t)},tilt(e,t){e.setTilt(t)},zoom(e,t){e.setZoom(t)}};class St extends o.PureComponent{constructor(){super(...arguments),this.state={map:null},this.registeredEvents=[],this.mapRef=null,this.getInstance=()=>null===this.mapRef?null:new google.maps.Map(this.mapRef,this.props.options),this.panTo=e=>{const t=this.getInstance();t&&t.panTo(e)},this.setMapCallback=()=>{null!==this.state.map&&this.props.onLoad&&this.props.onLoad(this.state.map)},this.getRef=e=>{this.mapRef=e}}componentDidMount(){const e=this.getInstance();this.registeredEvents=_t({updaterMap:Ct,eventMap:kt,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{map:e}}),this.setMapCallback)}componentDidUpdate(e){null!==this.state.map&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Ct,eventMap:kt,prevProps:e,nextProps:this.props,instance:this.state.map}))}componentWillUnmount(){null!==this.state.map&&(this.props.onUnmount&&this.props.onUnmount(this.state.map),xt(this.registeredEvents))}render(){return o.createElement("div",{id:this.props.id,ref:this.getRef,style:this.props.mapContainerStyle,className:this.props.mapContainerClassName},o.createElement(yt.Provider,{value:this.state.map},null!==this.state.map?this.props.children:o.createElement(o.Fragment,null)))}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function Ot(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}function Pt(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{l(r.next(e))}catch(e){i(e)}}function s(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}l((r=r.apply(e,t||[])).next())}))}const Tt="undefined"!=typeof document,Lt=({url:e,id:t,nonce:n})=>Tt?new Promise((function(r,o){const i=document.getElementById(t),a=window;if(i){const n=i.getAttribute("data-state");if(i.src===e&&"error"!==n){if("ready"===n)return r(t);{const e=a.initMap,n=i.onerror;return a.initMap=function(){e&&e(),r(t)},void(i.onerror=function(e){n&&n(e),o(e)})}}i.remove()}const s=document.createElement("script");s.type="text/javascript",s.src=e,s.id=t,s.async=!0,s.nonce=n,s.onerror=function(e){s.setAttribute("data-state","error"),o(e)},a.initMap=function(){s.setAttribute("data-state","ready"),r(t)},document.head.appendChild(s)})).catch(e=>{throw console.error("injectScript error: ",e),e}):Promise.reject(new Error("document is undefined")),Nt=e=>!(!e.href||0!==e.href.indexOf("https://fonts.googleapis.com/css?family=Roboto"))||("style"===e.tagName.toLowerCase()&&e.styleSheet&&e.styleSheet.cssText&&0===e.styleSheet.cssText.replace("\r\n","").indexOf(".gm-style")?(e.styleSheet.cssText="",!0):"style"===e.tagName.toLowerCase()&&e.innerHTML&&0===e.innerHTML.replace("\r\n","").indexOf(".gm-style")?(e.innerHTML="",!0):"style"===e.tagName.toLowerCase()&&!e.styleSheet&&!e.innerHTML),Mt=()=>{const e=document.getElementsByTagName("head")[0],t=e.insertBefore.bind(e);e.insertBefore=function(n,r){Nt(n)||Reflect.apply(t,e,[n,r])};const n=e.appendChild.bind(e);e.appendChild=function(t){Nt(t)||Reflect.apply(n,e,[t])}};function jt({googleMapsApiKey:e,googleMapsClientId:t,version:n="weekly",language:r,region:o,libraries:i,channel:a,mapIds:s}){const l=[];return vt(e&&t||!(e&&t),"You need to specify either googleMapsApiKey or googleMapsClientId for @react-google-maps/api load script to work. You cannot use both at the same time."),e?l.push("key="+e):t&&l.push("client="+t),n&&l.push("v="+n),r&&l.push("language="+r),o&&l.push("region="+o),i&&i.length&&l.push("libraries="+i.sort().join(",")),a&&l.push("channel="+a),s&&s.length&&l.push("map_ids="+s.join(",")),l.push("callback=initMap"),"https://maps.googleapis.com/maps/api/js?"+l.join("&")}let Dt=!1;function At(){return o.createElement("div",null,"Loading...")}const Rt={id:"script-loader",version:"weekly"};class It extends o.PureComponent{constructor(){super(...arguments),this.check=o.createRef(),this.state={loaded:!1},this.cleanupCallback=()=>{delete window.google.maps,this.injectScript()},this.isCleaningUp=()=>Pt(this,void 0,void 0,(function*(){return new Promise((function(e){if(Dt){if(Tt){const t=window.setInterval((function(){Dt||(window.clearInterval(t),e())}),1)}}else e()}))})),this.cleanup=()=>{Dt=!0;const e=document.getElementById(this.props.id);e&&e.parentNode&&e.parentNode.removeChild(e),Array.prototype.slice.call(document.getElementsByTagName("script")).filter((function(e){return"string"==typeof e.src&&e.src.includes("maps.googleapis")})).forEach((function(e){e.parentNode&&e.parentNode.removeChild(e)})),Array.prototype.slice.call(document.getElementsByTagName("link")).filter((function(e){return"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans"===e.href})).forEach((function(e){e.parentNode&&e.parentNode.removeChild(e)})),Array.prototype.slice.call(document.getElementsByTagName("style")).filter((function(e){return void 0!==e.innerText&&e.innerText.length>0&&e.innerText.includes(".gm-")})).forEach((function(e){e.parentNode&&e.parentNode.removeChild(e)}))},this.injectScript=()=>{this.props.preventGoogleFontsLoading&&Mt(),vt(!!this.props.id,'LoadScript requires "id" prop to be a string: %s',this.props.id);const e={id:this.props.id,nonce:this.props.nonce,url:jt(this.props)};Lt(e).then(()=>{this.props.onLoad&&this.props.onLoad(),this.setState((function(){return{loaded:!0}}))}).catch(e=>{this.props.onError&&this.props.onError(e),console.error(`\n          There has been an Error with loading Google Maps API script, please check that you provided correct google API key (${this.props.googleMapsApiKey||"-"}) or Client ID (${this.props.googleMapsClientId||"-"}) to <LoadScript />\n          Otherwise it is a Network issue.\n        `)})}}componentDidMount(){if(Tt){if(window.google&&window.google.maps&&!Dt)return void console.error("google api is already presented");this.isCleaningUp().then(this.injectScript).catch((function(e){console.error("Error at injecting script after cleaning up: ",e)}))}}componentDidUpdate(e){this.props.libraries!==e.libraries&&console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables"),Tt&&e.language!==this.props.language&&(this.cleanup(),this.setState((function(){return{loaded:!1}}),this.cleanupCallback))}componentWillUnmount(){if(Tt){this.cleanup();const e=()=>{this.check.current||(delete window.google,Dt=!1)};window.setTimeout(e,1),this.props.onUnmount&&this.props.onUnmount()}}render(){return o.createElement(o.Fragment,null,o.createElement("div",{ref:this.check}),this.state.loaded?this.props.children:this.props.loadingElement||o.createElement(At,null))}}let zt;It.defaultProps=Rt;const Bt=o.createElement(At,null);o.memo((function(e){var{loadingElement:t,onLoad:n,onError:r,onUnmount:i,children:a}=e,s=Ot(e,["loadingElement","onLoad","onError","onUnmount","children"]);const{isLoaded:l,loadError:u}=function({id:e=Rt.id,version:t=Rt.version,nonce:n,googleMapsApiKey:r,googleMapsClientId:i,language:a,region:s,libraries:l,preventGoogleFontsLoading:u,channel:c,mapIds:f}){const p=o.useRef(!1),[d,h]=o.useState(!1),[m,g]=o.useState(void 0);o.useEffect((function(){return p.current=!0,()=>{p.current=!1}}),[]),o.useEffect((function(){Tt&&u&&Mt()}),[u]),o.useEffect((function(){d&&vt(!!window.google,"useLoadScript was marked as loaded, but window.google is not present. Something went wrong.")}),[d]);const v=jt({version:t,googleMapsApiKey:r,googleMapsClientId:i,language:a,region:s,libraries:l,channel:c,mapIds:f});o.useEffect((function(){function t(){p.current&&(h(!0),zt=v)}Tt&&(window.google&&window.google.maps&&zt===v?t():Lt({id:e,url:v,nonce:n}).then(t).catch((function(e){p.current&&g(e),console.warn(`\n        There has been an Error with loading Google Maps API script, please check that you provided correct google API key (${r||"-"}) or Client ID (${i||"-"})\n        Otherwise it is a Network issue.\n      `),console.error(e)})))}),[e,v,n]);const y=o.useRef();return o.useEffect((function(){y.current&&l!==y.current&&console.warn("Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables"),y.current=l}),[l]),{isLoaded:d,loadError:m,url:v}}(s);return o.useEffect((function(){l&&"function"==typeof n&&n()}),[l,n]),o.useEffect((function(){u&&"function"==typeof r&&r(u)}),[u,r]),o.useEffect((function(){return()=>{i&&i()}}),[i]),l?a:t||Bt}));const Ut={},Ht={options(e,t){e.setOptions(t)}};class Ft extends o.PureComponent{constructor(){super(...arguments),this.state={trafficLayer:null},this.setTrafficLayerCallback=()=>{null!==this.state.trafficLayer&&this.props.onLoad&&this.props.onLoad(this.state.trafficLayer)},this.registeredEvents=[]}componentDidMount(){const e=new google.maps.TrafficLayer(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:Ht,eventMap:Ut,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{trafficLayer:e}}),this.setTrafficLayerCallback)}componentDidUpdate(e){null!==this.state.trafficLayer&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Ht,eventMap:Ut,prevProps:e,nextProps:this.props,instance:this.state.trafficLayer}))}componentWillUnmount(){null!==this.state.trafficLayer&&(this.props.onUnmount&&this.props.onUnmount(this.state.trafficLayer),xt(this.registeredEvents),this.state.trafficLayer.setMap(null))}render(){return null}}Ft.contextType=yt;class Wt extends o.PureComponent{constructor(){super(...arguments),this.state={bicyclingLayer:null},this.setBicyclingLayerCallback=()=>{null!==this.state.bicyclingLayer&&(this.state.bicyclingLayer.setMap(this.context),this.props.onLoad&&this.props.onLoad(this.state.bicyclingLayer))}}componentDidMount(){const e=new google.maps.BicyclingLayer;this.setState((function(){return{bicyclingLayer:e}}),this.setBicyclingLayerCallback)}componentWillUnmount(){null!==this.state.bicyclingLayer&&(this.props.onUnmount&&this.props.onUnmount(this.state.bicyclingLayer),this.state.bicyclingLayer.setMap(null))}render(){return null}}Wt.contextType=yt;class $t extends o.PureComponent{constructor(){super(...arguments),this.state={transitLayer:null},this.setTransitLayerCallback=()=>{null!==this.state.transitLayer&&(this.state.transitLayer.setMap(this.context),this.props.onLoad&&this.props.onLoad(this.state.transitLayer))}}componentDidMount(){const e=new google.maps.TransitLayer;this.setState((function(){return{transitLayer:e}}),this.setTransitLayerCallback)}componentWillUnmount(){null!==this.state.transitLayer&&(this.props.onUnmount&&this.props.onUnmount(this.state.transitLayer),this.state.transitLayer.setMap(null))}render(){return null}}$t.contextType=yt;const qt={onCircleComplete:"circlecomplete",onMarkerComplete:"markercomplete",onOverlayComplete:"overlaycomplete",onPolygonComplete:"polygoncomplete",onPolylineComplete:"polylinecomplete",onRectangleComplete:"rectanglecomplete"},Vt={drawingMode(e,t){e.setDrawingMode(t)},options(e,t){e.setOptions(t)}};class Qt extends o.PureComponent{constructor(e){super(e),this.registeredEvents=[],this.state={drawingManager:null},this.setDrawingManagerCallback=()=>{null!==this.state.drawingManager&&this.props.onLoad&&this.props.onLoad(this.state.drawingManager)},vt(!!google.maps.drawing,"Did you include prop libraries={['drawing']} in the URL? %s",google.maps.drawing)}componentDidMount(){const e=new google.maps.drawing.DrawingManager(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:Vt,eventMap:qt,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{drawingManager:e}}),this.setDrawingManagerCallback)}componentDidUpdate(e){null!==this.state.drawingManager&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Vt,eventMap:qt,prevProps:e,nextProps:this.props,instance:this.state.drawingManager}))}componentWillUnmount(){null!==this.state.drawingManager&&(this.props.onUnmount&&this.props.onUnmount(this.state.drawingManager),xt(this.registeredEvents),this.state.drawingManager.setMap(null))}render(){return o.createElement(o.Fragment,null)}}Qt.contextType=yt;const Kt={onAnimationChanged:"animation_changed",onClick:"click",onClickableChanged:"clickable_changed",onCursorChanged:"cursor_changed",onDblClick:"dblclick",onDrag:"drag",onDragEnd:"dragend",onDraggableChanged:"draggable_changed",onDragStart:"dragstart",onFlatChanged:"flat_changed",onIconChanged:"icon_changed",onMouseDown:"mousedown",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onPositionChanged:"position_changed",onRightClick:"rightclick",onShapeChanged:"shape_changed",onTitleChanged:"title_changed",onVisibleChanged:"visible_changed",onZindexChanged:"zindex_changed"},Yt={animation(e,t){e.setAnimation(t)},clickable(e,t){e.setClickable(t)},cursor(e,t){e.setCursor(t)},draggable(e,t){e.setDraggable(t)},icon(e,t){e.setIcon(t)},label(e,t){e.setLabel(t)},map(e,t){e.setMap(t)},opacity(e,t){e.setOpacity(t)},options(e,t){e.setOptions(t)},position(e,t){e.setPosition(t)},shape(e,t){e.setShape(t)},title(e,t){e.setTitle(t)},visible(e,t){e.setVisible(t)},zIndex(e,t){e.setZIndex(t)}};class Xt extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[]}componentDidMount(){const e=Object.assign(Object.assign(Object.assign({},this.props.options||{}),this.props.clusterer?{}:{map:this.context}),{position:this.props.position});this.marker=new google.maps.Marker(e),this.props.clusterer?this.props.clusterer.addMarker(this.marker,!!this.props.noClustererRedraw):this.marker.setMap(this.context),this.registeredEvents=_t({updaterMap:Yt,eventMap:Kt,prevProps:{},nextProps:this.props,instance:this.marker}),this.props.onLoad&&this.props.onLoad(this.marker)}componentDidUpdate(e){this.marker&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Yt,eventMap:Kt,prevProps:e,nextProps:this.props,instance:this.marker}))}componentWillUnmount(){this.marker&&(this.props.onUnmount&&this.props.onUnmount(this.marker),xt(this.registeredEvents),this.props.clusterer?this.props.clusterer.removeMarker(this.marker,!!this.props.noClustererRedraw):this.marker&&this.marker.setMap(null))}render(){let e=null;return this.props.children&&(e=o.Children.map(this.props.children,e=>{if(!o.isValidElement(e))return e;let t=e;return o.cloneElement(t,{anchor:this.marker})})),e||null}}Xt.contextType=yt;var Gt=function(){function e(t,n){t.getClusterer().extend(e,google.maps.OverlayView),this.cluster=t,this.className=this.cluster.getClusterer().getClusterClass(),this.styles=n,this.center=void 0,this.div=null,this.sums=null,this.visible=!1,this.boundsChangedListener=null,this.url="",this.height=0,this.width=0,this.anchorText=[0,0],this.anchorIcon=[0,0],this.textColor="black",this.textSize=11,this.textDecoration="none",this.fontWeight="bold",this.fontStyle="normal",this.fontFamily="Arial,sans-serif",this.backgroundPosition="0 0",this.setMap(t.getMap())}return e.prototype.onAdd=function(){var e,t,n=this;this.div=document.createElement("div"),this.div.className=this.className,this.visible&&this.show(),this.getPanes().overlayMouseTarget.appendChild(this.div),this.boundsChangedListener=google.maps.event.addListener(this.getMap(),"boundschanged",(function(){t=e})),google.maps.event.addDomListener(this.div,"mousedown",(function(){e=!0,t=!1})),google.maps.event.addDomListener(this.div,"click",(function(r){if(e=!1,!t){var o=n.cluster.getClusterer();if(google.maps.event.trigger(o,"click",n.cluster),google.maps.event.trigger(o,"clusterclick",n.cluster),o.getZoomOnClick()){var i=o.getMaxZoom(),a=n.cluster.getBounds();o.getMap().fitBounds(a),setTimeout((function(){o.getMap().fitBounds(a),null!==i&&o.getMap().getZoom()>i&&o.getMap().setZoom(i+1)}),100)}r.cancelBubble=!0,r.stopPropagation&&r.stopPropagation()}})),google.maps.event.addDomListener(this.div,"mouseover",(function(){google.maps.event.trigger(n.cluster.getClusterer(),"mouseover",n.cluster)})),google.maps.event.addDomListener(this.div,"mouseout",(function(){google.maps.event.trigger(n.cluster.getClusterer(),"mouseout",n.cluster)}))},e.prototype.onRemove=function(){this.div&&this.div.parentNode&&(this.hide(),null!==this.boundsChangedListener&&google.maps.event.removeListener(this.boundsChangedListener),google.maps.event.clearInstanceListeners(this.div),this.div.parentNode.removeChild(this.div),this.div=null)},e.prototype.draw=function(){if(this.visible&&null!==this.div&&this.center){var e=this.getPosFromLatLng(this.center),t=e.x,n=e.y;this.div.style.top=n+"px",this.div.style.left=t+"px"}},e.prototype.hide=function(){this.div&&(this.div.style.display="none"),this.visible=!1},e.prototype.show=function(){if(this.div&&this.center){var e="",t="",n=this.backgroundPosition.split(" "),r=parseInt(n[0].replace(/^\s+|\s+$/g,""),10),o=parseInt(n[1].replace(/^\s+|\s+$/g,""),10),i=this.getPosFromLatLng(this.center);t=null===this.sums||void 0===this.sums.title||""===this.sums.title?this.cluster.getClusterer().getTitle():this.sums.title,this.div.style.cssText=this.createCss(i),e="<img alt='"+t+"' src='"+this.url+"' style='position: absolute; top: "+o+"px; left: "+r+"px; ",this.cluster.getClusterer().enableRetinaIcons||(e+="clip: rect("+-1*o+"px, "+(-1*r+this.width)+"px, "+(-1*o+this.height)+"px, "+-1*r+"px);"),e+="'>",this.div.innerHTML=e+"<div style='position: absolute;top: "+this.anchorText[0]+"px;left: "+this.anchorText[1]+"px;color: "+this.textColor+";font-size: "+this.textSize+"px;font-family: "+this.fontFamily+";font-weight: "+this.fontWeight+";font-style: "+this.fontStyle+";text-decoration: "+this.textDecoration+";text-align: center;width: "+this.width+"px;line-height:"+this.height+"px;'>"+this.sums.text+"</div>",this.div.title=t,this.div.style.display=""}this.visible=!0},e.prototype.useStyle=function(e){this.sums=e;var t=this.styles[Math.min(this.styles.length-1,Math.max(0,e.index-1))];this.url=t.url,this.height=t.height,this.width=t.width,t.className&&(this.className=this.className+" "+t.className),this.anchorText=t.anchorText||[0,0],this.anchorIcon=t.anchorIcon||[this.height/2,this.width/2],this.textColor=t.textColor||"black",this.textSize=t.textSize||11,this.textDecoration=t.textDecoration||"none",this.fontWeight=t.fontWeight||"bold",this.fontStyle=t.fontStyle||"normal",this.fontFamily=t.fontFamily||"Arial,sans-serif",this.backgroundPosition=t.backgroundPosition||"0 0"},e.prototype.setCenter=function(e){this.center=e},e.prototype.createCss=function(e){var t=[];return t.push("cursor: pointer;"),t.push("position: absolute; top: "+e.y+"px; left: "+e.x+"px;"),t.push("width: "+this.width+"px; height: "+this.height+"px;"),t.join("")},e.prototype.getPosFromLatLng=function(e){var t=this.getProjection().fromLatLngToDivPixel(e);return t.x-=this.anchorIcon[1],t.y-=this.anchorIcon[0],t},e}(),Zt=function(){function e(e){this.markerClusterer=e,this.map=this.markerClusterer.getMap(),this.gridSize=this.markerClusterer.getGridSize(),this.minClusterSize=this.markerClusterer.getMinimumClusterSize(),this.averageCenter=this.markerClusterer.getAverageCenter(),this.markers=[],this.center=void 0,this.bounds=null,this.clusterIcon=new Gt(this,this.markerClusterer.getStyles())}return e.prototype.getSize=function(){return this.markers.length},e.prototype.getMarkers=function(){return this.markers},e.prototype.getCenter=function(){return this.center},e.prototype.getMap=function(){return this.map},e.prototype.getClusterer=function(){return this.markerClusterer},e.prototype.getBounds=function(){for(var e=new google.maps.LatLngBounds(this.center,this.center),t=this.getMarkers(),n=0;n<t.length;n++){var r=t[n].getPosition();r&&e.extend(r)}return e},e.prototype.remove=function(){this.clusterIcon.setMap(null),this.markers=[],delete this.markers},e.prototype.addMarker=function(e){if(this.isMarkerAlreadyAdded(e))return!1;var t;if(this.center){if(this.averageCenter&&(t=e.getPosition())){var n=this.markers.length+1;this.center=new google.maps.LatLng((this.center.lat()*(n-1)+t.lat())/n,(this.center.lng()*(n-1)+t.lng())/n),this.calculateBounds()}}else(t=e.getPosition())&&(this.center=t,this.calculateBounds());e.isAdded=!0,this.markers.push(e);var r=this.markers.length,o=this.markerClusterer.getMaxZoom(),i=this.map.getZoom();if(null!==o&&void 0!==i&&i>o)e.getMap()!==this.map&&e.setMap(this.map);else if(r<this.minClusterSize)e.getMap()!==this.map&&e.setMap(this.map);else if(r===this.minClusterSize)for(var a=0;a<r;a++)this.markers[a].setMap(null);else e.setMap(null);return!0},e.prototype.isMarkerInClusterBounds=function(e){if(null!==this.bounds){var t=e.getPosition();if(t)return this.bounds.contains(t)}return!1},e.prototype.calculateBounds=function(){this.bounds=this.markerClusterer.getExtendedBounds(new google.maps.LatLngBounds(this.center,this.center))},e.prototype.updateIcon=function(){var e=this.markers.length,t=this.markerClusterer.getMaxZoom(),n=this.map.getZoom();null!==t&&void 0!==n&&n>t||e<this.minClusterSize?this.clusterIcon.hide():(this.center&&this.clusterIcon.setCenter(this.center),this.clusterIcon.useStyle(this.markerClusterer.getCalculator()(this.markers,this.markerClusterer.getStyles().length)),this.clusterIcon.show())},e.prototype.isMarkerAlreadyAdded=function(e){if(this.markers.includes)return this.markers.includes(e);for(var t=0;t<this.markers.length;t++)if(e===this.markers[t])return!0;return!1},e}(),Jt=function(e,t){var n=e.length,r=n.toString().length,o=Math.min(r,t);return{text:n.toString(),index:o,title:""}},en=[53,56,66,78,90],tn=function(){function e(t,n,r){void 0===n&&(n=[]),void 0===r&&(r={}),this.extend(e,google.maps.OverlayView),this.markers=[],this.clusters=[],this.listeners=[],this.activeMap=null,this.ready=!1,this.gridSize=r.gridSize||60,this.minClusterSize=r.minimumClusterSize||2,this.maxZoom=r.maxZoom||null,this.styles=r.styles||[],this.title=r.title||"",this.zoomOnClick=!0,void 0!==r.zoomOnClick&&(this.zoomOnClick=r.zoomOnClick),this.averageCenter=!1,void 0!==r.averageCenter&&(this.averageCenter=r.averageCenter),this.ignoreHidden=!1,void 0!==r.ignoreHidden&&(this.ignoreHidden=r.ignoreHidden),this.enableRetinaIcons=!1,void 0!==r.enableRetinaIcons&&(this.enableRetinaIcons=r.enableRetinaIcons),this.imagePath=r.imagePath||"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",this.imageExtension=r.imageExtension||"png",this.imageSizes=r.imageSizes||en,this.calculator=r.calculator||Jt,this.batchSize=r.batchSize||2e3,this.batchSizeIE=r.batchSizeIE||500,this.clusterClass=r.clusterClass||"cluster",-1!==navigator.userAgent.toLowerCase().indexOf("msie")&&(this.batchSize=this.batchSizeIE),this.timerRefStatic=null,this.setupStyles(),this.addMarkers(n,!0),this.setMap(t)}return e.prototype.onAdd=function(){var e=this;this.activeMap=this.getMap(),this.ready=!0,this.repaint(),this.listeners=[google.maps.event.addListener(this.getMap(),"zoom_changed",(function(){e.resetViewport(!1),e.getMap().getZoom()!==(e.get("minZoom")||0)&&e.getMap().getZoom()!==e.get("maxZoom")||google.maps.event.trigger(e,"idle")})),google.maps.event.addListener(this.getMap(),"idle",(function(){e.redraw()}))]},e.prototype.onRemove=function(){for(var e=0;e<this.markers.length;e++)this.markers[e].getMap()!==this.activeMap&&this.markers[e].setMap(this.activeMap);for(e=0;e<this.clusters.length;e++)this.clusters[e].remove();this.clusters=[];for(e=0;e<this.listeners.length;e++)google.maps.event.removeListener(this.listeners[e]);this.listeners=[],this.activeMap=null,this.ready=!1},e.prototype.draw=function(){},e.prototype.setupStyles=function(){if(!(this.styles.length>0))for(var e=0;e<this.imageSizes.length;e++)this.styles.push({url:this.imagePath+(e+1)+"."+this.imageExtension,height:this.imageSizes[e],width:this.imageSizes[e]})},e.prototype.fitMapToMarkers=function(){for(var e=this.getMarkers(),t=new google.maps.LatLngBounds,n=0;n<e.length;n++){var r=e[n].getPosition();r&&t.extend(r)}this.getMap().fitBounds(t)},e.prototype.getGridSize=function(){return this.gridSize},e.prototype.setGridSize=function(e){this.gridSize=e},e.prototype.getMinimumClusterSize=function(){return this.minClusterSize},e.prototype.setMinimumClusterSize=function(e){this.minClusterSize=e},e.prototype.getMaxZoom=function(){return this.maxZoom},e.prototype.setMaxZoom=function(e){this.maxZoom=e},e.prototype.getStyles=function(){return this.styles},e.prototype.setStyles=function(e){this.styles=e},e.prototype.getTitle=function(){return this.title},e.prototype.setTitle=function(e){this.title=e},e.prototype.getZoomOnClick=function(){return this.zoomOnClick},e.prototype.setZoomOnClick=function(e){this.zoomOnClick=e},e.prototype.getAverageCenter=function(){return this.averageCenter},e.prototype.setAverageCenter=function(e){this.averageCenter=e},e.prototype.getIgnoreHidden=function(){return this.ignoreHidden},e.prototype.setIgnoreHidden=function(e){this.ignoreHidden=e},e.prototype.getEnableRetinaIcons=function(){return this.enableRetinaIcons},e.prototype.setEnableRetinaIcons=function(e){this.enableRetinaIcons=e},e.prototype.getImageExtension=function(){return this.imageExtension},e.prototype.setImageExtension=function(e){this.imageExtension=e},e.prototype.getImagePath=function(){return this.imagePath},e.prototype.setImagePath=function(e){this.imagePath=e},e.prototype.getImageSizes=function(){return this.imageSizes},e.prototype.setImageSizes=function(e){this.imageSizes=e},e.prototype.getCalculator=function(){return this.calculator},e.prototype.setCalculator=function(e){this.calculator=e},e.prototype.getBatchSizeIE=function(){return this.batchSizeIE},e.prototype.setBatchSizeIE=function(e){this.batchSizeIE=e},e.prototype.getClusterClass=function(){return this.clusterClass},e.prototype.setClusterClass=function(e){this.clusterClass=e},e.prototype.getMarkers=function(){return this.markers},e.prototype.getTotalMarkers=function(){return this.markers.length},e.prototype.getClusters=function(){return this.clusters},e.prototype.getTotalClusters=function(){return this.clusters.length},e.prototype.addMarker=function(e,t){this.pushMarkerTo(e),t||this.redraw()},e.prototype.addMarkers=function(e,t){for(var n in e)e.hasOwnProperty(n)&&this.pushMarkerTo(e[n]);t||this.redraw()},e.prototype.pushMarkerTo=function(e){var t=this;e.getDraggable()&&google.maps.event.addListener(e,"dragend",(function(){t.ready&&(e.isAdded=!1,t.repaint())})),e.isAdded=!1,this.markers.push(e)},e.prototype.removeMarker_=function(e){var t=-1;if(this.markers.indexOf)t=this.markers.indexOf(e);else for(var n=0;n<this.markers.length;n++)if(e===this.markers[n]){t=n;break}return-1!==t&&(e.setMap(null),this.markers.splice(t,1),!0)},e.prototype.removeMarker=function(e,t){var n=this.removeMarker_(e);return!t&&n&&this.repaint(),n},e.prototype.removeMarkers=function(e,t){for(var n=!1,r=0;r<e.length;r++)n=n||this.removeMarker_(e[r]);return!t&&n&&this.repaint(),n},e.prototype.clearMarkers=function(){this.resetViewport(!0),this.markers=[]},e.prototype.repaint=function(){var e=this.clusters.slice();this.clusters=[],this.resetViewport(!1),this.redraw(),setTimeout((function(){for(var t=0;t<e.length;t++)e[t].remove()}),0)},e.prototype.getExtendedBounds=function(e){var t=this.getProjection(),n=t.fromLatLngToDivPixel(new google.maps.LatLng(e.getNorthEast().lat(),e.getNorthEast().lng()));n.x+=this.gridSize,n.y-=this.gridSize;var r=t.fromLatLngToDivPixel(new google.maps.LatLng(e.getSouthWest().lat(),e.getSouthWest().lng()));return r.x-=this.gridSize,r.y+=this.gridSize,e.extend(t.fromDivPixelToLatLng(n)),e.extend(t.fromDivPixelToLatLng(r)),e},e.prototype.redraw=function(){this.createClusters(0)},e.prototype.resetViewport=function(e){for(var t=0;t<this.clusters.length;t++)this.clusters[t].remove();this.clusters=[];for(t=0;t<this.markers.length;t++){var n=this.markers[t];n.isAdded=!1,e&&n.setMap(null)}},e.prototype.distanceBetweenPoints=function(e,t){var n=(t.lat()-e.lat())*Math.PI/180,r=(t.lng()-e.lng())*Math.PI/180,o=Math.sin(n/2)*Math.sin(n/2)+Math.cos(e.lat()*Math.PI/180)*Math.cos(t.lat()*Math.PI/180)*Math.sin(r/2)*Math.sin(r/2);return 2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))*6371},e.prototype.isMarkerInBounds=function(e,t){var n=e.getPosition();return!!n&&t.contains(n)},e.prototype.addToClosestCluster=function(e){for(var t,n=4e4,r=null,o=0;o<this.clusters.length;o++){var i=(t=this.clusters[o]).getCenter(),a=e.getPosition();if(i&&a){var s=this.distanceBetweenPoints(i,a);s<n&&(n=s,r=t)}}r&&r.isMarkerInClusterBounds(e)?r.addMarker(e):((t=new Zt(this)).addMarker(e),this.clusters.push(t))},e.prototype.createClusters=function(e){var t=this;if(this.ready){0===e&&(google.maps.event.trigger(this,"clusteringbegin",this),null!==this.timerRefStatic&&(window.clearTimeout(this.timerRefStatic),delete this.timerRefStatic));for(var n=this.getMap().getZoom()>3?new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),this.getMap().getBounds().getNorthEast()):new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472,-178.48388434375),new google.maps.LatLng(-85.08136444384544,178.00048865625)),r=this.getExtendedBounds(n),o=Math.min(e+this.batchSize,this.markers.length),i=e;i<o;i++){var a=this.markers[i];!a.isAdded&&this.isMarkerInBounds(a,r)&&(!this.ignoreHidden||this.ignoreHidden&&a.getVisible())&&this.addToClosestCluster(a)}if(o<this.markers.length)this.timerRefStatic=window.setTimeout((function(){t.createClusters(o)}),0);else{this.timerRefStatic=null,google.maps.event.trigger(this,"clusteringend",this);for(i=0;i<this.clusters.length;i++)this.clusters[i].updateIcon()}}},e.prototype.extend=function(e,t){return function(e){for(var t in e.prototype)this.prototype[t]=e.prototype[t];return this}.apply(e,[t])},e}();const nn={onClick:"click",onClusteringBegin:"clusteringbegin",onClusteringEnd:"clusteringend",onMouseOut:"mouseout",onMouseOver:"mouseover"},rn={averageCenter(e,t){e.setAverageCenter(t)},batchSizeIE(e,t){e.setBatchSizeIE(t)},calculator(e,t){e.setCalculator(t)},clusterClass(e,t){e.setClusterClass(t)},enableRetinaIcons(e,t){e.setEnableRetinaIcons(t)},gridSize(e,t){e.setGridSize(t)},ignoreHidden(e,t){e.setIgnoreHidden(t)},imageExtension(e,t){e.setImageExtension(t)},imagePath(e,t){e.setImagePath(t)},imageSizes(e,t){e.setImageSizes(t)},maxZoom(e,t){e.setMaxZoom(t)},minimumClusterSize(e,t){e.setMinimumClusterSize(t)},styles(e,t){e.setStyles(t)},title(e,t){e.setTitle(t)},zoomOnClick(e,t){e.setZoomOnClick(t)}};class on extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={markerClusterer:null},this.setClustererCallback=()=>{null!==this.state.markerClusterer&&this.props.onLoad&&this.props.onLoad(this.state.markerClusterer)}}componentDidMount(){if(this.context){const e=new tn(this.context,[],this.props.options);this.registeredEvents=_t({updaterMap:rn,eventMap:nn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{markerClusterer:e}}),this.setClustererCallback)}}componentDidUpdate(e){this.state.markerClusterer&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:rn,eventMap:nn,prevProps:e,nextProps:this.props,instance:this.state.markerClusterer}))}componentWillUnmount(){null!==this.state.markerClusterer&&(this.props.onUnmount&&this.props.onUnmount(this.state.markerClusterer),xt(this.registeredEvents),this.state.markerClusterer.setMap(null))}render(){return null!==this.state.markerClusterer?this.props.children(this.state.markerClusterer):null}}on.contextType=yt;var an=function(){function e(t){void 0===t&&(t={}),this.extend(e,google.maps.OverlayView),this.content=t.content||"",this.disableAutoPan=t.disableAutoPan||!1,this.maxWidth=t.maxWidth||0,this.pixelOffset=t.pixelOffset||new google.maps.Size(0,0),this.position=t.position||new google.maps.LatLng(0,0),this.zIndex=t.zIndex||null,this.boxClass=t.boxClass||"infoBox",this.boxStyle=t.boxStyle||{},this.closeBoxMargin=t.closeBoxMargin||"2px",this.closeBoxURL=t.closeBoxURL||"http://www.google.com/intl/en_us/mapfiles/close.gif",""===t.closeBoxURL&&(this.closeBoxURL=""),this.infoBoxClearance=t.infoBoxClearance||new google.maps.Size(1,1),void 0===t.visible&&(void 0===t.isHidden?t.visible=!0:t.visible=!t.isHidden),this.isHidden=!t.visible,this.alignBottom=t.alignBottom||!1,this.pane=t.pane||"floatPane",this.enableEventPropagation=t.enableEventPropagation||!1,this.div=null,this.closeListener=null,this.moveListener=null,this.mapListener=null,this.contextListener=null,this.eventListeners=null,this.fixedWidthSet=null}return e.prototype.createInfoBoxDiv=function(){var e=this;function t(e){e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()}if(!this.div){if(this.div=document.createElement("div"),this.setBoxStyle(),"string"==typeof this.content?this.div.innerHTML=this.getCloseBoxImg()+this.content:(this.div.innerHTML=this.getCloseBoxImg(),this.div.appendChild(this.content)),this.getPanes()[this.pane].appendChild(this.div),this.addClickHandler(),this.div.style.width)this.fixedWidthSet=!0;else if(0!==this.maxWidth&&this.div.offsetWidth>this.maxWidth)this.div.style.width=this.maxWidth+"px",this.fixedWidthSet=!0;else{var n=this.getBoxWidths();this.div.style.width=this.div.offsetWidth-n.left-n.right+"px",this.fixedWidthSet=!1}if(this.panBox(this.disableAutoPan),!this.enableEventPropagation){this.eventListeners=[];for(var r=["mousedown","mouseover","mouseout","mouseup","click","dblclick","touchstart","touchend","touchmove"],o=0;o<r.length;o++)this.eventListeners.push(google.maps.event.addDomListener(this.div,r[o],t));this.eventListeners.push(google.maps.event.addDomListener(this.div,"mouseover",(function(){e.div&&(e.div.style.cursor="default")})))}this.contextListener=google.maps.event.addDomListener(this.div,"contextmenu",(function(n){n.returnValue=!1,n.preventDefault&&n.preventDefault(),e.enableEventPropagation||t(n)})),google.maps.event.trigger(this,"domready")}},e.prototype.getCloseBoxImg=function(){var e="";return""!==this.closeBoxURL&&(e='<img alt=""',e+=' aria-hidden="true"',e+=" src='"+this.closeBoxURL+"'",e+=" align=right",e+=" style='",e+=" position: relative;",e+=" cursor: pointer;",e+=" margin: "+this.closeBoxMargin+";",e+="'>"),e},e.prototype.addClickHandler=function(){if(this.div&&this.div.firstChild&&""!==this.closeBoxURL){var e=this.div.firstChild;this.closeListener=google.maps.event.addDomListener(e,"click",this.getCloseClickHandler())}else this.closeListener=null},e.prototype.getCloseClickHandler=function(){var e=this;return function(t){t.cancelBubble=!0,t.stopPropagation&&t.stopPropagation(),google.maps.event.trigger(e,"closeclick"),e.close()}},e.prototype.panBox=function(e){if(this.div&&!e){var t=this.getMap();if(t instanceof google.maps.Map){var n=0,r=0,o=t.getBounds();o&&!o.contains(this.position)&&t.setCenter(this.position);var i=t.getDiv(),a=i.offsetWidth,s=i.offsetHeight,l=this.pixelOffset.width,u=this.pixelOffset.height,c=this.div.offsetWidth,f=this.div.offsetHeight,p=this.infoBoxClearance.width,d=this.infoBoxClearance.height,h=this.getProjection().fromLatLngToContainerPixel(this.position);null!==h&&(h.x<-l+p?n=h.x+l-p:h.x+c+l+p>a&&(n=h.x+c+l+p-a),this.alignBottom?h.y<-u+d+f?r=h.y+u-d-f:h.y+u+d>s&&(r=h.y+u+d-s):h.y<-u+d?r=h.y+u-d:h.y+f+u+d>s&&(r=h.y+f+u+d-s)),0===n&&0===r||t.panBy(n,r)}}},e.prototype.setBoxStyle=function(){if(this.div){this.div.className=this.boxClass,this.div.style.cssText="";var e=this.boxStyle;for(var t in e)e.hasOwnProperty(t)&&(this.div.style[t]=e[t]);if(this.div.style.webkitTransform="translateZ(0)",void 0!==this.div.style.opacity&&""!==this.div.style.opacity){var n=parseFloat(this.div.style.opacity||"");this.div.style.msFilter='"progid:DXImageTransform.Microsoft.Alpha(Opacity='+100*n+')"',this.div.style.filter="alpha(opacity="+100*n+")"}this.div.style.position="absolute",this.div.style.visibility="hidden",null!==this.zIndex&&(this.div.style.zIndex=this.zIndex+""),this.div.style.overflow||(this.div.style.overflow="auto")}},e.prototype.getBoxWidths=function(){var e={top:0,bottom:0,left:0,right:0};if(!this.div)return e;if(document.defaultView&&document.defaultView.getComputedStyle){var t=this.div.ownerDocument,n=t&&t.defaultView?t.defaultView.getComputedStyle(this.div,""):null;n&&(e.top=parseInt(n.borderTopWidth||"",10)||0,e.bottom=parseInt(n.borderBottomWidth||"",10)||0,e.left=parseInt(n.borderLeftWidth||"",10)||0,e.right=parseInt(n.borderRightWidth||"",10)||0)}else if(document.documentElement.currentStyle){var r=this.div.currentStyle;r&&(e.top=parseInt(r.borderTopWidth||"",10)||0,e.bottom=parseInt(r.borderBottomWidth||"",10)||0,e.left=parseInt(r.borderLeftWidth||"",10)||0,e.right=parseInt(r.borderRightWidth||"",10)||0)}return e},e.prototype.onRemove=function(){this.div&&this.div.parentNode&&(this.div.parentNode.removeChild(this.div),this.div=null)},e.prototype.draw=function(){if(this.createInfoBoxDiv(),this.div){var e=this.getProjection().fromLatLngToDivPixel(this.position);null!==e&&(this.div.style.left=e.x+this.pixelOffset.width+"px",this.alignBottom?this.div.style.bottom=-(e.y+this.pixelOffset.height)+"px":this.div.style.top=e.y+this.pixelOffset.height+"px"),this.isHidden?this.div.style.visibility="hidden":this.div.style.visibility="visible"}},e.prototype.setOptions=function(e){void 0===e&&(e={}),void 0!==e.boxClass&&(this.boxClass=e.boxClass,this.setBoxStyle()),void 0!==e.boxStyle&&(this.boxStyle=e.boxStyle,this.setBoxStyle()),void 0!==e.content&&this.setContent(e.content),void 0!==e.disableAutoPan&&(this.disableAutoPan=e.disableAutoPan),void 0!==e.maxWidth&&(this.maxWidth=e.maxWidth),void 0!==e.pixelOffset&&(this.pixelOffset=e.pixelOffset),void 0!==e.alignBottom&&(this.alignBottom=e.alignBottom),void 0!==e.position&&this.setPosition(e.position),void 0!==e.zIndex&&this.setZIndex(e.zIndex),void 0!==e.closeBoxMargin&&(this.closeBoxMargin=e.closeBoxMargin),void 0!==e.closeBoxURL&&(this.closeBoxURL=e.closeBoxURL),void 0!==e.infoBoxClearance&&(this.infoBoxClearance=e.infoBoxClearance),void 0!==e.isHidden&&(this.isHidden=e.isHidden),void 0!==e.visible&&(this.isHidden=!e.visible),void 0!==e.enableEventPropagation&&(this.enableEventPropagation=e.enableEventPropagation),this.div&&this.draw()},e.prototype.setContent=function(e){this.content=e,this.div&&(this.closeListener&&(google.maps.event.removeListener(this.closeListener),this.closeListener=null),this.fixedWidthSet||(this.div.style.width=""),"string"==typeof e?this.div.innerHTML=this.getCloseBoxImg()+e:(this.div.innerHTML=this.getCloseBoxImg(),this.div.appendChild(e)),this.fixedWidthSet||(this.div.style.width=this.div.offsetWidth+"px","string"==typeof e?this.div.innerHTML=this.getCloseBoxImg()+e:(this.div.innerHTML=this.getCloseBoxImg(),this.div.appendChild(e))),this.addClickHandler()),google.maps.event.trigger(this,"content_changed")},e.prototype.setPosition=function(e){this.position=e,this.div&&this.draw(),google.maps.event.trigger(this,"position_changed")},e.prototype.setVisible=function(e){this.isHidden=!e,this.div&&(this.div.style.visibility=this.isHidden?"hidden":"visible")},e.prototype.setZIndex=function(e){this.zIndex=e,this.div&&(this.div.style.zIndex=e+""),google.maps.event.trigger(this,"zindex_changed")},e.prototype.getContent=function(){return this.content},e.prototype.getPosition=function(){return this.position},e.prototype.getZIndex=function(){return this.zIndex},e.prototype.getVisible=function(){var e=this.getMap();return null!=e&&!this.isHidden},e.prototype.show=function(){this.isHidden=!1,this.div&&(this.div.style.visibility="visible")},e.prototype.hide=function(){this.isHidden=!0,this.div&&(this.div.style.visibility="hidden")},e.prototype.open=function(e,t){var n=this;t&&(this.position=t.getPosition(),this.moveListener=google.maps.event.addListener(t,"position_changed",(function(){var e=t.getPosition();n.setPosition(e)})),this.mapListener=google.maps.event.addListener(t,"map_changed",(function(){n.setMap(t.map)}))),this.setMap(e),this.div&&this.panBox()},e.prototype.close=function(){if(this.closeListener&&(google.maps.event.removeListener(this.closeListener),this.closeListener=null),this.eventListeners){for(var e=0;e<this.eventListeners.length;e++)google.maps.event.removeListener(this.eventListeners[e]);this.eventListeners=null}this.moveListener&&(google.maps.event.removeListener(this.moveListener),this.moveListener=null),this.mapListener&&(google.maps.event.removeListener(this.mapListener),this.mapListener=null),this.contextListener&&(google.maps.event.removeListener(this.contextListener),this.contextListener=null),this.setMap(null)},e.prototype.extend=function(e,t){return function(e){for(var t in e.prototype)this.prototype.hasOwnProperty(t)||(this.prototype[t]=e.prototype[t]);return this}.apply(e,[t])},e}();const sn={onCloseClick:"closeclick",onContentChanged:"content_changed",onDomReady:"domready",onPositionChanged:"position_changed",onZindexChanged:"zindex_changed"},ln={options(e,t){e.setOptions(t)},position(e,t){t instanceof google.maps.LatLng?e.setPosition(t):e.setPosition(new google.maps.LatLng(t.lat,t.lng))},visible(e,t){e.setVisible(t)},zIndex(e,t){e.setZIndex(t)}};class un extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.containerElement=null,this.state={infoBox:null},this.open=(e,t)=>{t?e.open(this.context,t):e.getPosition()?e.open(this.context):vt(!1,"You must provide either an anchor or a position prop for <InfoBox>.")},this.setInfoBoxCallback=()=>{const{anchor:e,onLoad:t}=this.props,{infoBox:n}=this.state;null!==n&&null!==this.containerElement&&(n.setContent(this.containerElement),this.open(n,e),t&&t(n))}}componentDidMount(){const{options:e}=this.props,t=e||{},{position:n}=t,r=Ot(t,["position"]);let o;!n||n instanceof google.maps.LatLng||(o=new google.maps.LatLng(n.lat,n.lng));const i=new an(Object.assign(Object.assign({},r),o?{position:o}:{}));this.containerElement=document.createElement("div"),this.registeredEvents=_t({updaterMap:ln,eventMap:sn,prevProps:{},nextProps:this.props,instance:i}),this.setState({infoBox:i},this.setInfoBoxCallback)}componentDidUpdate(e){const{infoBox:t}=this.state;null!==t&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:ln,eventMap:sn,prevProps:e,nextProps:this.props,instance:t}))}componentWillUnmount(){const{onUnmount:e}=this.props,{infoBox:t}=this.state;null!==t&&(e&&e(t),xt(this.registeredEvents),t.close())}render(){return this.containerElement?a.createPortal(o.Children.only(this.props.children),this.containerElement):null}}un.contextType=yt;const cn={onCloseClick:"closeclick",onContentChanged:"content_changed",onDomReady:"domready",onPositionChanged:"position_changed",onZindexChanged:"zindex_changed"},fn={options(e,t){e.setOptions(t)},position(e,t){e.setPosition(t)},zIndex(e,t){e.setZIndex(t)}};class pn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.containerElement=null,this.state={infoWindow:null},this.open=(e,t)=>{t?e.open(this.context,t):e.getPosition()?e.open(this.context):vt(!1,"You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoWindow>.")},this.setInfoWindowCallback=()=>{null!==this.state.infoWindow&&null!==this.containerElement&&(this.state.infoWindow.setContent(this.containerElement),this.open(this.state.infoWindow,this.props.anchor),this.props.onLoad&&this.props.onLoad(this.state.infoWindow))}}componentDidMount(){const e=new google.maps.InfoWindow(Object.assign({},this.props.options||{}));this.containerElement=document.createElement("div"),this.registeredEvents=_t({updaterMap:fn,eventMap:cn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{infoWindow:e}}),this.setInfoWindowCallback)}componentDidUpdate(e){null!==this.state.infoWindow&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:fn,eventMap:cn,prevProps:e,nextProps:this.props,instance:this.state.infoWindow}))}componentWillUnmount(){null!==this.state.infoWindow&&(xt(this.registeredEvents),this.state.infoWindow.close())}render(){return this.containerElement?a.createPortal(o.Children.only(this.props.children),this.containerElement):o.createElement(o.Fragment,null)}}pn.contextType=yt;const dn={onClick:"click",onDblClick:"dblclick",onDrag:"drag",onDragEnd:"dragend",onDragStart:"dragstart",onMouseDown:"mousedown",onMouseMove:"mousemove",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onRightClick:"rightclick"},hn={draggable(e,t){e.setDraggable(t)},editable(e,t){e.setEditable(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)},path(e,t){e.setPath(t)},visible(e,t){e.setVisible(t)}};class mn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={polyline:null},this.setPolylineCallback=()=>{null!==this.state.polyline&&this.props.onLoad&&this.props.onLoad(this.state.polyline)}}componentDidMount(){const e=new google.maps.Polyline(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:hn,eventMap:dn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{polyline:e}}),this.setPolylineCallback)}componentDidUpdate(e){null!==this.state.polyline&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:hn,eventMap:dn,prevProps:e,nextProps:this.props,instance:this.state.polyline}))}componentWillUnmount(){null!==this.state.polyline&&(this.props.onUnmount&&this.props.onUnmount(this.state.polyline),xt(this.registeredEvents),this.state.polyline.setMap(null))}render(){return o.createElement(o.Fragment,null)}}mn.contextType=yt;const gn={onClick:"click",onDblClick:"dblclick",onDrag:"drag",onDragEnd:"dragend",onDragStart:"dragstart",onMouseDown:"mousedown",onMouseMove:"mousemove",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onRightClick:"rightclick"},vn={draggable(e,t){e.setDraggable(t)},editable(e,t){e.setEditable(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)},path(e,t){e.setPath(t)},paths(e,t){e.setPaths(t)},visible(e,t){e.setVisible(t)}};class yn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={polygon:null},this.setPolygonCallback=()=>{null!==this.state.polygon&&this.props.onLoad&&this.props.onLoad(this.state.polygon)}}componentDidMount(){const e=new google.maps.Polygon(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:vn,eventMap:gn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{polygon:e}}),this.setPolygonCallback)}componentDidUpdate(e){null!==this.state.polygon&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:vn,eventMap:gn,prevProps:e,nextProps:this.props,instance:this.state.polygon}))}componentWillUnmount(){null!==this.state.polygon&&(this.props.onUnmount&&this.props.onUnmount(this.state.polygon),xt(this.registeredEvents),this.state.polygon&&this.state.polygon.setMap(null))}render(){return null}}yn.contextType=yt;const bn={onBoundsChanged:"bounds_changed",onClick:"click",onDblClick:"dblclick",onDrag:"drag",onDragEnd:"dragend",onDragStart:"dragstart",onMouseDown:"mousedown",onMouseMove:"mousemove",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onRightClick:"rightclick"},wn={bounds(e,t){e.setBounds(t)},draggable(e,t){e.setDraggable(t)},editable(e,t){e.setEditable(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)},visible(e,t){e.setVisible(t)}};class En extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={rectangle:null},this.setRectangleCallback=()=>{null!==this.state.rectangle&&this.props.onLoad&&this.props.onLoad(this.state.rectangle)}}componentDidMount(){const e=new google.maps.Rectangle(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:wn,eventMap:bn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{rectangle:e}}),this.setRectangleCallback)}componentDidUpdate(e){null!==this.state.rectangle&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:wn,eventMap:bn,prevProps:e,nextProps:this.props,instance:this.state.rectangle}))}componentWillUnmount(){null!==this.state.rectangle&&(this.props.onUnmount&&this.props.onUnmount(this.state.rectangle),xt(this.registeredEvents),this.state.rectangle.setMap(null))}render(){return o.createElement(o.Fragment,null)}}En.contextType=yt;const xn={onCenterChanged:"center_changed",onClick:"click",onDblClick:"dblclick",onDrag:"drag",onDragEnd:"dragend",onDragStart:"dragstart",onMouseDown:"mousedown",onMouseMove:"mousemove",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onRadiusChanged:"radius_changed",onRightClick:"rightclick"},_n={center(e,t){e.setCenter(t)},draggable(e,t){e.setDraggable(t)},editable(e,t){e.setEditable(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)},radius(e,t){e.setRadius(t)},visible(e,t){e.setVisible(t)}};class kn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={circle:null},this.setCircleCallback=()=>{null!==this.state.circle&&this.props.onLoad&&this.props.onLoad(this.state.circle)}}componentDidMount(){const e=new google.maps.Circle(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:_n,eventMap:xn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{circle:e}}),this.setCircleCallback)}componentDidUpdate(e){null!==this.state.circle&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:_n,eventMap:xn,prevProps:e,nextProps:this.props,instance:this.state.circle}))}componentWillUnmount(){null!==this.state.circle&&(this.props.onUnmount&&this.props.onUnmount(this.state.circle),xt(this.registeredEvents),this.state.circle&&this.state.circle.setMap(null))}render(){return o.createElement(o.Fragment,null)}}kn.contextType=yt;const Cn={onAddFeature:"addfeature",onClick:"click",onDblClick:"dblclick",onMouseDown:"mousedown",onMouseOut:"mouseout",onMouseOver:"mouseover",onMouseUp:"mouseup",onRemoveFeature:"removefeature",onRemoveProperty:"removeproperty",onRightClick:"rightclick",onSetGeometry:"setgeometry",onSetProperty:"setproperty"},Sn={add(e,t){e.add(t)},addgeojson(e,t,n){e.addGeoJson(t,n)},contains(e,t){e.contains(t)},foreach(e,t){e.forEach(t)},loadgeojson(e,t,n,r){e.loadGeoJson(t,n,r)},overridestyle(e,t,n){e.overrideStyle(t,n)},remove(e,t){e.remove(t)},revertstyle(e,t){e.revertStyle(t)},controlposition(e,t){e.setControlPosition(t)},controls(e,t){e.setControls(t)},drawingmode(e,t){e.setDrawingMode(t)},map(e,t){e.setMap(t)},style(e,t){e.setStyle(t)},togeojson(e,t){e.toGeoJson(t)}};class On extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={data:null},this.setDataCallback=()=>{null!==this.state.data&&this.props.onLoad&&this.props.onLoad(this.state.data)}}componentDidMount(){const e=new google.maps.Data(Object.assign(Object.assign({},this.props.options||{}),{map:this.context}));this.registeredEvents=_t({updaterMap:Sn,eventMap:Cn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{data:e}}),this.setDataCallback)}componentDidUpdate(e){null!==this.state.data&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Sn,eventMap:Cn,prevProps:e,nextProps:this.props,instance:this.state.data}))}componentWillUnmount(){null!==this.state.data&&(this.props.onUnmount&&this.props.onUnmount(this.state.data),xt(this.registeredEvents),this.state.data&&this.state.data.setMap(null))}render(){return null}}On.contextType=yt;const Pn={onClick:"click",onDefaultViewportChanged:"defaultviewport_changed",onStatusChanged:"status_changed"},Tn={options(e,t){e.setOptions(t)},url(e,t){e.setUrl(t)},zIndex(e,t){e.setZIndex(t)}};class Ln extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={kmlLayer:null},this.setKmlLayerCallback=()=>{null!==this.state.kmlLayer&&this.props.onLoad&&this.props.onLoad(this.state.kmlLayer)}}componentDidMount(){const e=new google.maps.KmlLayer(Object.assign(Object.assign({},this.props.options),{map:this.context}));this.registeredEvents=_t({updaterMap:Tn,eventMap:Pn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{kmlLayer:e}}),this.setKmlLayerCallback)}componentDidUpdate(e){null!==this.state.kmlLayer&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Tn,eventMap:Pn,prevProps:e,nextProps:this.props,instance:this.state.kmlLayer}))}componentWillUnmount(){null!==this.state.kmlLayer&&(this.props.onUnmount&&this.props.onUnmount(this.state.kmlLayer),xt(this.registeredEvents),this.state.kmlLayer.setMap(null))}render(){return null}}Ln.contextType=yt;const Nn=(e,t)=>new t(e.lat,e.lng),Mn=(e,t)=>new t(new google.maps.LatLng(e.ne.lat,e.ne.lng),new google.maps.LatLng(e.sw.lat,e.sw.lng)),jn=(e,t,n)=>e instanceof t?e:n(e,t);function Dn(e){if(!e)return"";return(e instanceof google.maps.LatLng?e:new google.maps.LatLng(e.lat,e.lng))+""}function An(e){if(!e)return"";return(e instanceof google.maps.LatLngBounds?e:new google.maps.LatLngBounds(new google.maps.LatLng(e.south,e.east),new google.maps.LatLng(e.north,e.west)))+""}class Rn extends o.PureComponent{constructor(e){super(e),this.state={paneEl:null,containerStyle:{position:"absolute"}},this.updatePane=()=>{const e=this.props.mapPaneName,t=this.overlayView.getPanes();vt(!!e,"OverlayView requires props.mapPaneName but got %s",e),t?this.setState({paneEl:t[e]}):this.setState({paneEl:null})},this.onAdd=()=>{var e,t;this.updatePane(),null===(t=(e=this.props).onLoad)||void 0===t||t.call(e,this.overlayView)},this.onPositionElement=()=>{var e,t;const n=((e,t,n,r)=>void 0!==n?((e,t,n)=>{const r=e&&e.fromLatLngToDivPixel(n.getNorthEast()),o=e&&e.fromLatLngToDivPixel(n.getSouthWest());return r&&o?{left:o.x+t.x+"px",top:r.y+t.y+"px",width:r.x-o.x-t.x+"px",height:o.y-r.y-t.y+"px"}:{left:"-9999px",top:"-9999px"}})(e,t,jn(n,google.maps.LatLngBounds,Mn)):((e,t,n)=>{const r=e&&e.fromLatLngToDivPixel(n);if(r){const{x:e,y:n}=r;return{left:e+t.x+"px",top:n+t.y+"px"}}return{left:"-9999px",top:"-9999px"}})(e,t,jn(r,google.maps.LatLng,Nn)))(this.overlayView.getProjection(),Object.assign({x:0,y:0},this.containerRef.current?(e=this.containerRef.current,"function"==typeof(t=this.props.getPixelPositionOffset)?t(e.offsetWidth,e.offsetHeight):{}):{}),this.props.bounds,this.props.position),{left:r,top:o,width:i,height:a}=this.state.containerStyle;var s,l;l={left:r,top:o,width:i,height:a},((s=n).left!==l.left||s.top!==l.top||s.width!==l.height||s.height!==l.height)&&this.setState({containerStyle:Object.assign(Object.assign({},n),{position:"absolute"})})},this.draw=()=>{this.onPositionElement()},this.onRemove=()=>{var e,t;this.setState(()=>({paneEl:null})),null===(t=(e=this.props).onUnmount)||void 0===t||t.call(e,this.overlayView)},this.containerRef=o.createRef();const t=new google.maps.OverlayView;t.onAdd=this.onAdd,t.draw=this.draw,t.onRemove=this.onRemove,this.overlayView=t}componentDidMount(){this.overlayView.setMap(this.context)}componentDidUpdate(e){const t=Dn(e.position),n=Dn(this.props.position),r=An(e.bounds),o=An(this.props.bounds);t===n&&r===o||this.overlayView.draw(),e.mapPaneName!==this.props.mapPaneName&&this.updatePane()}componentWillUnmount(){this.overlayView.setMap(null)}render(){const e=this.state.paneEl;return e?a.createPortal(o.createElement("div",{ref:this.containerRef,style:this.state.containerStyle},o.Children.only(this.props.children)),e):null}}Rn.FLOAT_PANE="floatPane",Rn.MAP_PANE="mapPane",Rn.MARKER_LAYER="markerLayer",Rn.OVERLAY_LAYER="overlayLayer",Rn.OVERLAY_MOUSE_TARGET="overlayMouseTarget",Rn.contextType=yt;const In={onDblClick:"dblclick",onClick:"click"},zn={opacity(e,t){e.setOpacity(t)}};class Bn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={groundOverlay:null},this.setGroundOverlayCallback=()=>{null!==this.state.groundOverlay&&this.props.onLoad&&this.props.onLoad(this.state.groundOverlay)}}componentDidMount(){vt(!!this.props.url||!!this.props.bounds,"For GroundOverlay, url and bounds are passed in to constructor and are immutable after instantiated. This is the behavior of Google Maps JavaScript API v3 ( See https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay) Hence, use the corresponding two props provided by `react-google-maps-api`, url and bounds. In some cases, you'll need the GroundOverlay component to reflect the changes of url and bounds. You can leverage the React's key property to remount the component. Typically, just `key={url}` would serve your need. See https://github.com/tomchentw/react-google-maps/issues/655");const e=new google.maps.GroundOverlay(this.props.url,this.props.bounds,Object.assign(Object.assign({},this.props.options),{map:this.context}));this.registeredEvents=_t({updaterMap:zn,eventMap:In,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{groundOverlay:e}}),this.setGroundOverlayCallback)}componentDidUpdate(e){null!==this.state.groundOverlay&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:zn,eventMap:In,prevProps:e,nextProps:this.props,instance:this.state.groundOverlay}))}componentWillUnmount(){this.state.groundOverlay&&(this.props.onUnmount&&this.props.onUnmount(this.state.groundOverlay),this.state.groundOverlay.setMap(null))}render(){return null}}Bn.defaultProps={onLoad:function(){}},Bn.contextType=yt;const Un={},Hn={data(e,t){e.setData(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)}};class Fn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={heatmapLayer:null},this.setHeatmapLayerCallback=()=>{null!==this.state.heatmapLayer&&this.props.onLoad&&this.props.onLoad(this.state.heatmapLayer)}}componentDidMount(){vt(!!google.maps.visualization,'Did you include prop libraries={["visualization"]} to <LoadScript />? %s',google.maps.visualization),vt(!!this.props.data,"data property is required in HeatmapLayer %s",this.props.data);const e=new google.maps.visualization.HeatmapLayer(Object.assign(Object.assign({},this.props.options||{}),{data:this.props.data,map:this.context}));this.registeredEvents=_t({updaterMap:Hn,eventMap:Un,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{heatmapLayer:e}}),this.setHeatmapLayerCallback)}componentDidUpdate(e){xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Hn,eventMap:Un,prevProps:e,nextProps:this.props,instance:this.state.heatmapLayer})}componentWillUnmount(){null!==this.state.heatmapLayer&&(this.props.onUnmount&&this.props.onUnmount(this.state.heatmapLayer),xt(this.registeredEvents),this.state.heatmapLayer.setMap(null))}render(){return null}}Fn.contextType=yt;const Wn={onCloseClick:"closeclick",onPanoChanged:"pano_changed",onPositionChanged:"position_changed",onPovChanged:"pov_changed",onResize:"resize",onStatusChanged:"status_changed",onVisibleChanged:"visible_changed",onZoomChanged:"zoom_changed"},$n={register(e,t,n){e.registerPanoProvider(t,n)},links(e,t){e.setLinks(t)},motionTracking(e,t){e.setMotionTracking(t)},options(e,t){e.setOptions(t)},pano(e,t){e.setPano(t)},position(e,t){e.setPosition(t)},pov(e,t){e.setPov(t)},visible(e,t){e.setVisible(t)},zoom(e,t){e.setZoom(t)}};class qn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={streetViewPanorama:null},this.setStreetViewPanoramaCallback=()=>{null!==this.state.streetViewPanorama&&this.props.onLoad&&this.props.onLoad(this.state.streetViewPanorama)}}componentDidMount(){const e=this.context.getStreetView();this.registeredEvents=_t({updaterMap:$n,eventMap:Wn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{streetViewPanorama:e}}),this.setStreetViewPanoramaCallback)}componentDidUpdate(e){null!==this.state.streetViewPanorama&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:$n,eventMap:Wn,prevProps:e,nextProps:this.props,instance:this.state.streetViewPanorama}))}componentWillUnmount(){null!==this.state.streetViewPanorama&&(this.props.onUnmount&&this.props.onUnmount(this.state.streetViewPanorama),xt(this.registeredEvents),this.state.streetViewPanorama.setVisible(!1))}render(){return null}}qn.contextType=yt;class Vn extends o.PureComponent{constructor(){super(...arguments),this.state={streetViewService:null},this.setStreetViewServiceCallback=()=>{null!==this.state.streetViewService&&this.props.onLoad&&this.props.onLoad(this.state.streetViewService)}}componentDidMount(){const e=new google.maps.StreetViewService;this.setState((function(){return{streetViewService:e}}),this.setStreetViewServiceCallback)}componentWillUnmount(){null!==this.state.streetViewService&&this.props.onUnmount&&this.props.onUnmount(this.state.streetViewService)}render(){return null}}Vn.contextType=yt;o.PureComponent;const Qn={onDirectionsChanged:"directions_changed"},Kn={directions(e,t){e.setDirections(t)},map(e,t){e.setMap(t)},options(e,t){e.setOptions(t)},panel(e,t){e.setPanel(t)},routeIndex(e,t){e.setRouteIndex(t)}};class Yn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.state={directionsRenderer:null},this.setDirectionsRendererCallback=()=>{null!==this.state.directionsRenderer&&(this.state.directionsRenderer.setMap(this.context),this.props.onLoad&&this.props.onLoad(this.state.directionsRenderer))}}componentDidMount(){const e=new google.maps.DirectionsRenderer(this.props.options);this.registeredEvents=_t({updaterMap:Kn,eventMap:Qn,prevProps:{},nextProps:this.props,instance:e}),this.setState((function(){return{directionsRenderer:e}}),this.setDirectionsRendererCallback)}componentDidUpdate(e){null!==this.state.directionsRenderer&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Kn,eventMap:Qn,prevProps:e,nextProps:this.props,instance:this.state.directionsRenderer}))}componentWillUnmount(){null!==this.state.directionsRenderer&&(this.props.onUnmount&&this.props.onUnmount(this.state.directionsRenderer),xt(this.registeredEvents),this.state.directionsRenderer&&this.state.directionsRenderer.setMap(null))}render(){return o.createElement(o.Fragment,null)}}Yn.contextType=yt;o.PureComponent;const Xn={onPlacesChanged:"places_changed"},Gn={bounds(e,t){e.setBounds(t)}};class Zn extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.containerElement=o.createRef(),this.state={searchBox:null},this.setSearchBoxCallback=()=>{null!==this.state.searchBox&&this.props.onLoad&&this.props.onLoad(this.state.searchBox)}}componentDidMount(){if(vt(!!google.maps.places,'You need to provide libraries={["places"]} prop to <LoadScript /> component %s',google.maps.places),null!==this.containerElement&&null!==this.containerElement.current){const e=this.containerElement.current.querySelector("input");if(null!==e){const t=new google.maps.places.SearchBox(e,this.props.options);this.registeredEvents=_t({updaterMap:Gn,eventMap:Xn,prevProps:{},nextProps:this.props,instance:t}),this.setState((function(){return{searchBox:t}}),this.setSearchBoxCallback)}}}componentDidUpdate(e){null!==this.state.searchBox&&(xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:Gn,eventMap:Xn,prevProps:e,nextProps:this.props,instance:this.state.searchBox}))}componentWillUnmount(){null!==this.state.searchBox&&(this.props.onUnmount&&this.props.onUnmount(this.state.searchBox),xt(this.registeredEvents))}render(){return o.createElement("div",{ref:this.containerElement},o.Children.only(this.props.children))}}Zn.contextType=yt;const Jn={onPlaceChanged:"place_changed"},er={bounds(e,t){e.setBounds(t)},restrictions(e,t){e.setComponentRestrictions(t)},fields(e,t){e.setFields(t)},options(e,t){e.setOptions(t)},types(e,t){e.setTypes(t)}};class tr extends o.PureComponent{constructor(){super(...arguments),this.registeredEvents=[],this.containerElement=o.createRef(),this.state={autocomplete:null},this.setAutocompleteCallback=()=>{null!==this.state.autocomplete&&this.props.onLoad&&this.props.onLoad(this.state.autocomplete)}}componentDidMount(){vt(!!google.maps.places,'You need to provide libraries={["places"]} prop to <LoadScript /> component %s',google.maps.places);const e=this.containerElement.current.querySelector("input");if(e){const t=new google.maps.places.Autocomplete(e,this.props.options);this.registeredEvents=_t({updaterMap:er,eventMap:Jn,prevProps:{},nextProps:this.props,instance:t}),this.setState((function(){return{autocomplete:t}}),this.setAutocompleteCallback)}}componentDidUpdate(e){xt(this.registeredEvents),this.registeredEvents=_t({updaterMap:er,eventMap:Jn,prevProps:e,nextProps:this.props,instance:this.state.autocomplete})}componentWillUnmount(){null!==this.state.autocomplete&&xt(this.registeredEvents)}render(){return o.createElement("div",{ref:this.containerElement,className:this.props.className||""},o.Children.only(this.props.children))}}function nr(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,o,i=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){s=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw o}}return i}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return rr(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return rr(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function rr(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}tr.contextType=yt;var or=function(){var e=nr(Object(o.useState)({}),2),t=e[0],n=e[1];return i.a.createElement(St,{mapContainerStyle:{height:"60vh",width:"70vh"},zoom:11,center:{lat:40.6892,lng:-74.0445}},[{id:42,location:{lat:40.777384,lng:-73.9803}},{id:43,location:{lat:43.65107,lng:-79.347015}}].map((function(e){return i.a.createElement(Xt,{id:e.id,position:e.location,onClick:function(){return function(e){window.location="/#/homes/".concat(e.id)}(e)}})})),t.location&&i.a.createElement(pn,{position:t.location,clickable:!0,onCloseClick:function(){return n({})}},i.a.createElement("p",null,t.name)))};function ir(e){return(ir="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ar(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function sr(e,t){return(sr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function lr(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=cr(e);if(t){var o=cr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return ur(this,n)}}function ur(e,t){if(t&&("object"===ir(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function cr(e){return(cr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var fr=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&sr(e,t)}(a,e);var t,n,r,o=lr(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).state={noHome:!1},t}return t=a,(n=[{key:"componentDidMount",value:function(){var e=this;this.props.fetchHomes({city:this.props.match.params.city}).then((function(t){0===Object.values(t.homes).length&&e.setState({nohome:!0})}))}},{key:"componentDidUpdate",value:function(e){var t=this;e.match.params.city!==this.props.match.params.city&&this.props.fetchHomes({city:this.props.match.params.city}).then((function(e){0===Object.values(e.homes).length?t.setState({noHome:!0}):t.setState({noHome:!1})}))}},{key:"render",value:function(){var e,t=this;return 0!==this.props.homes.length||this.state.noHome?this.state.noHome?i.a.createElement("div",{className:"no-homes-container"},i.a.createElement("div",{className:"no-homes"},i.a.createElement("p",{className:"no-homes-text"}," No Homes Available Here")," ",i.a.createElement("span",{className:"no-homes-sad-face"})," ")):(e=this.props.match.params.city?this.props.homes.filter((function(e){return e.city===t.props.match.params.city})).map((function(e,t){return i.a.createElement(gt,{home:e,key:e.id})})):this.props.homes.map((function(e,t){return i.a.createElement(gt,{home:e,key:e.id})})),i.a.createElement("div",{className:"homes-div"},i.a.createElement("div",{className:"homes-left"},i.a.createElement("ul",{className:"homes-list"},e)),i.a.createElement("div",{className:"homes-right"},i.a.createElement("div",{className:"google-map"},i.a.createElement(or,{homes:this.props.homes}))))):null}}])&&ar(t.prototype,n),r&&ar(t,r),a}(i.a.Component),pr=se(Ze((function(e){return{homes:Object.values(e.entities.homes)}}),(function(e){return{fetchHomes:function(t){return e(tt(t))}}}))(fr));function dr(e){return(dr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function hr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function mr(e,t){return(mr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function gr(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=br(e);if(t){var o=br(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return vr(this,n)}}function vr(e,t){if(t&&("object"===dr(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return yr(e)}function yr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function br(e){return(br=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var wr=se(function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&mr(e,t)}(a,e);var t,n,r,o=gr(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).state={city:""},t.handleClick=t.handleClick.bind(yr(t)),t}return t=a,(n=[{key:"handleClick",value:function(e){if(e.preventDefault(),""===this.state.city)this.props.history.push("/homes");else{this.state.city.split(" ");var t=this.state.city.split(" "),n=[];t.forEach((function(e){return n.push(e[0].toUpperCase()+e.slice(1).toLowerCase())})),this.state.city=n.join(" "),this.props.history.push("/search/".concat(this.state.city)),this.setState({city:""})}}},{key:"update",value:function(e){var t=this;return function(e){return t.setState({city:e.currentTarget.value})}}},{key:"render",value:function(){return i.a.createElement("form",{className:"search-box",onSubmit:this.handleClick},i.a.createElement("div",{className:"search-div"},i.a.createElement("label",{className:"location"},"Location"),i.a.createElement("input",{type:"text",className:"search",placeholder:"Where are you going?",onChange:this.update(),value:this.state.city}),i.a.createElement("button",{className:"search-button",onClick:this.handleClick},i.a.createElement("i",{className:"fas fa-search"}))))}}])&&hr(t.prototype,n),r&&hr(t,r),a}(i.a.Component)),Er=Ze(null,(function(e){return{fetchHomes:function(t){return e(tt(t))}}}))(wr),xr=function(e){return{type:"OPEN_MODAL",modal:e}},_r=function(e){return{type:"RECEIVE_CURRENT_USER",currentUser:e}},kr=function(e){return{type:"RECEIVE_SESSION_ERRORS",errors:e}},Cr=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/user",data:{user:e}})}(e).then((function(e){return t(_r(e))}),(function(e){return t(kr(e.responseJSON))}))}},Sr=function(e){return function(t){return function(e){return $.ajax({method:"POST",url:"/api/session",data:{user:e}})}(e).then((function(e){return t(_r(e))}),(function(e){return t(kr(e.responseJSON))}))}},Or=function(){return function(e){return $.ajax({method:"DELETE",url:"/api/session"}).then((function(t){return e({type:"LOGOUT_CURRENT_USER"})}))}};n(26);function Pr(e){return(Pr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Tr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Lr(e,t){return(Lr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Nr(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=jr(e);if(t){var o=jr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Mr(this,n)}}function Mr(e,t){if(t&&("object"===Pr(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function jr(e){return(jr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Dr=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Lr(e,t)}(a,e);var t,n,r,o=Nr(a);function a(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),o.call(this,e)}return t=a,(n=[{key:"gotoMain",value:function(){this.props.history.push("/")}},{key:"gotoProfile",value:function(){this.props.history.push("/users/".concat(this.props.currentUser.id))}},{key:"render",value:function(){var e,t=this.props,n=t.currentUser,r=t.logout,o=t.openModal,a=(t.title,i.a.createElement("div",{className:"ddown"},i.a.createElement(he,{to:"/",className:"header-link"},i.a.createElement("div",{className:"cozybnb"},i.a.createElement("p",{className:"name"},i.a.createElement("i",{id:"hellobob",className:"fab fa-airbnb"}),"cozybnb"))),i.a.createElement("div",{className:"pfcontainer"},i.a.createElement("div",{className:"moodal"},i.a.createElement("button",{className:"pf-ask"},"☰"),i.a.createElement("ul",{className:"login-signup-ul"},i.a.createElement("li",{className:"menu-li",onClick:function(){return o("login")}},"Log In"),i.a.createElement("li",{className:"menu-li",onClick:function(){return o("signup")}},"Sign Up"))))));return n&&(e=i.a.createElement("div",{className:"ddown"},i.a.createElement(he,{to:"/",className:"header-link"},i.a.createElement("div",{className:"cozybnb"},i.a.createElement("p",{className:"name"},i.a.createElement("i",{id:"hellobob",className:"fab fa-airbnb"}),"cozybnb"))),i.a.createElement("div",{className:"pfcontainer"},i.a.createElement("button",{className:"pf-ask"},"☰"),i.a.createElement("ul",{className:"login-signup-ul"},i.a.createElement("button",{className:"menu-li",onClick:this.gotoProfile.bind(this)},i.a.createElement("i",{className:"fas fa-address-card"})),i.a.createElement("li",{className:"menu-li",onClick:r},"Logout"))))),i.a.createElement("div",null,n?e:a)}}])&&Tr(t.prototype,n),r&&Tr(t,r),a}(i.a.Component),Ar=se(Ze((function(e){var t=e.session;return{currentUser:e.entities.users[t.id]}}),(function(e){return{logout:function(){return e(Or())},openModal:function(t){return e(xr(t))}}}))(Dr));function Rr(e){return(Rr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Ir(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function zr(e,t){return(zr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Br(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=Fr(e);if(t){var o=Fr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Ur(this,n)}}function Ur(e,t){if(t&&("object"===Rr(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return Hr(e)}function Hr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Fr(e){return(Fr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Wr=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&zr(e,t)}(a,e);var t,n,r,o=Br(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).state={username:"",password:"",first_name:"",last_name:"",birthday:"",email:""},t.handleSubmit=t.handleSubmit.bind(Hr(t)),t}return t=a,(n=[{key:"update",value:function(e){var t=this;return function(n){return t.setState((r={},o=e,i=n.currentTarget.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r));var r,o,i}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=Object.assign({},this.state);this.props.processForm(t).then(this.props.closeModal)}},{key:"renderErrors",value:function(){return i.a.createElement("ul",null,this.props.errors.map((function(e,t){return i.a.createElement("li",{key:"error-".concat(t)},e)})))}},{key:"render",value:function(){var e=this,t="signup"===this.props.formType?i.a.createElement(i.a.Fragment,null,i.a.createElement("label",null,"First Name",i.a.createElement("input",{type:"text",value:this.state.first_name,onChange:this.update("first_name"),required:!0})),i.a.createElement("br",null),i.a.createElement("label",null,"Last Name",i.a.createElement("input",{type:"text",value:this.state.last_name,onChange:this.update("last_name"),required:!0})),i.a.createElement("br",null),i.a.createElement("label",null,"Birthday",i.a.createElement("input",{type:"date",value:this.state.birthday,onChange:this.update("birthday"),placeholder:"Birthday",required:!0})),i.a.createElement("br",null),i.a.createElement("label",null,"Email",i.a.createElement("input",{type:"text",value:this.state.email,onChange:this.update("email"),required:!0}))):i.a.createElement(i.a.Fragment,null),n="login"===this.props.formType?"LOG IN":"SIGN UP";return i.a.createElement("div",null,i.a.createElement("form",{onSubmit:this.handleSubmit},i.a.createElement("br",null),i.a.createElement("h2",null,n),i.a.createElement("div",{onClick:this.props.closeModal,className:"close-x"},"X"),this.renderErrors(),i.a.createElement("div",null,i.a.createElement("br",null),i.a.createElement("label",null,"Username",i.a.createElement("input",{type:"text",value:this.state.username,onChange:this.update("username"),required:!0})),i.a.createElement("br",null),i.a.createElement("label",null,"Password",i.a.createElement("input",{type:"password",value:this.state.password,onChange:this.update("password"),required:!0})),i.a.createElement("br",null),t,i.a.createElement("br",null),i.a.createElement("button",{value:this.props.formType},n),"SIGN UP"!==n?i.a.createElement("button",{className:"session-submit",onClick:function(){return e.props.login({username:"user3",password:"123123",email:"u33@gmail.com",first_name:"user",last_name:"3rthy",birthday:"1995-01-01"}).then(e.props.closeModal)}},"Demo"):i.a.createElement(i.a.Fragment,null))))}}])&&Ir(t.prototype,n),r&&Ir(t,r),a}(i.a.Component),$r=Ze((function(e){return{errors:e.errors.session,formType:"signup"}}),(function(e){return{processForm:function(t){return e(Cr(t))},otherForm:i.a.createElement("button",{onClick:function(){return e(xr("login"))}},"Login"),closeModal:function(){return e({type:"CLOSE_MODAL"})}}}))(Wr),qr=Ze((function(e){return{errors:e.errors.session,formType:"login"}}),(function(e){return{processForm:function(t){return e(Sr(t))},otherForm:i.a.createElement("button",{onClick:function(){return e(xr("signup"))}},"Signup"),closeModal:function(){return e({type:"CLOSE_MODAL"})},login:function(t){return e(Sr(t))}}}))(Wr);function Vr(e){return(Vr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Qr(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Kr(e,t){return(Kr=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Yr(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=Zr(e);if(t){var o=Zr(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Xr(this,n)}}function Xr(e,t){if(t&&("object"===Vr(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return Gr(e)}function Gr(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Zr(e){return(Zr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Jr=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Kr(e,t)}(a,e);var t,n,r,o=Yr(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).state=t.props.review,t.handleSubmit=t.handleSubmit.bind(Gr(t)),t}return t=a,(n=[{key:"componentDidMount",value:function(){}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.review.guest_id?this.props.createReview(this.state).then(this.props.fetchHome(this.state.home_id)).then(this.props.fetchReviews(this.state.home_id)).then(this.clearReview()):this.props.openModal("login")}},{key:"clearReview",value:function(){Array.from(document.getElementsByClassName("review-stars")).forEach((function(e){return e.checked=!1})),document.getElementById("review-textarea").className="review-no-body-error",this.setState(this.props.review)}},{key:"update",value:function(e){var t=this;return function(n){return t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r));var r,o,i}}},{key:"handleRating",value:function(e){return this.setState({rating:e})}},{key:"render",value:function(){var e=this;return i.a.createElement("form",{className:"review-form-container"},i.a.createElement("div",{className:"review-top"},i.a.createElement("h3",null,"Write a Review!")),i.a.createElement("div",{className:"review-mid"},i.a.createElement("div",{className:"reviews-ratings"},i.a.createElement("div",{className:"ratings"},i.a.createElement("input",{className:"review-stars",type:"radio",id:"star1",name:"rating",value:this.state.rating,onClick:function(){return e.handleRating(1)}}),i.a.createElement("label",{htmlFor:"star1"}),i.a.createElement("input",{className:"review-stars",type:"radio",id:"star2",name:"rating",value:this.state.rating,onClick:function(){return e.handleRating(2)}}),i.a.createElement("label",{htmlFor:"star2"}),i.a.createElement("input",{className:"review-stars",type:"radio",id:"star3",name:"rating",value:this.state.rating,onClick:function(){return e.handleRating(3)}}),i.a.createElement("label",{htmlFor:"star3"}),i.a.createElement("input",{className:"review-stars",type:"radio",id:"star4",name:"rating",value:this.state.rating,onClick:function(){return e.handleRating(4)}}),i.a.createElement("label",{htmlFor:"star4"}),i.a.createElement("input",{className:"review-stars",type:"radio",id:"star5",name:"rating",value:this.state.rating,onClick:function(){return e.handleRating(5)}}),i.a.createElement("label",{htmlFor:"star5"})),i.a.createElement("textarea",{id:"review-text",className:"review-no-body-error",onChange:this.update("body"),placeholder:"How did we do?",value:this.state.body}))),i.a.createElement("div",{className:"review-bottom"},i.a.createElement("button",{className:"review-button",type:"submit",onClick:this.handleSubmit},"Submit review")))}}])&&Qr(t.prototype,n),r&&Qr(t,r),a}(i.a.Component),eo=Ze((function(e,t){return{errors:e.errors.review,review:{body:"",guest_id:e.session.id,home_id:t.home.id}}}),(function(e){return{fetchHome:function(t){return e(nt(t))},createReview:function(t){return e(it(t))},fetchReviews:function(t){return e(at(t))},openModal:function(){return e(xr("login"))}}}))(Jr);function to(e){return(to="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function no(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ro(e,t){return(ro=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function oo(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ao(e);if(t){var o=ao(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return io(this,n)}}function io(e,t){if(t&&("object"===to(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function ao(e){return(ao=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var so=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ro(e,t)}(a,e);var t,n,r,o=oo(a);function a(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),o.call(this,e)}return t=a,(n=[{key:"componentDidMount",value:function(){this.props.fetchHome(this.props.match.params.homeId)}},{key:"render",value:function(){var e=[5,4.67,4.3,4.88,3.7,4.8,4.9,3.8,4.6,4.75][Math.floor(10*Math.random())],t=this.props.home;return t?i.a.createElement("div",{className:"home-show-container"},i.a.createElement("div",{className:"home-top"},i.a.createElement("div",{className:"home-show-name"},i.a.createElement("h2",{className:"titlehome"},t.home_name)),i.a.createElement("div",{className:"home-show-rating"},i.a.createElement("div",{className:"star"},i.a.createElement("i",{className:"fas fa-star"}),e),i.a.createElement("div",{className:"home-city"},t.city)),i.a.createElement("div",{className:"home-top-pics"},i.a.createElement("div",{className:"home-side-pic"},i.a.createElement("img",{src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/living.jpeg",className:"home-first-pic"}))),i.a.createElement("div",{className:"home-bottom-pics"},i.a.createElement("div",{className:"home-side-pic"},i.a.createElement("img",{src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/kitchen.jpg",className:"home-show-pic"})),i.a.createElement("div",{className:"home-side-pic"},i.a.createElement("img",{src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/bath.jpg",className:"home-show-pic"})),i.a.createElement("div",{className:"home-side-pic"},i.a.createElement("img",{src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/bed1.jpg",className:"home-show-pic"})),i.a.createElement("div",{className:"home-side-pic"},i.a.createElement("img",{src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/stairs.jpg",className:"home-show-pic"})))),i.a.createElement("div",{className:"home-show-desc"},i.a.createElement("h2",{className:"textinfos"},"Description"),i.a.createElement("p",{className:"home-show-desc-p"},t.description)),i.a.createElement("div",{className:"home-show-info"},i.a.createElement("h2",{className:"textinfos"},"Where you'll sleep"),i.a.createElement("div",{className:"home-show-info-container"},i.a.createElement("div",{className:"home-bedroom"},i.a.createElement("i",{className:"fas fa-bed"}),i.a.createElement("br",null),i.a.createElement("span",null,"Bedroom 1"),i.a.createElement("br",null),i.a.createElement("p",null,"1 king bed")),i.a.createElement("div",{className:"home-common"},i.a.createElement("i",{className:"fas fa-couch"}),i.a.createElement("br",null),i.a.createElement("span",null,"Common spaces"),i.a.createElement("p",null,"1 couch")))),i.a.createElement("div",{className:"home-show-amenities"},i.a.createElement("h2",{className:"textinfos"},"What this place offers"),i.a.createElement("div",{className:"amenities"},i.a.createElement("div",{className:"amenities-1"},i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-wifi"}),"Wifi"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-car"}),"Free parking"),i.a.createElement("div",null,i.a.createElement("i",{class:"fas fa-tv"}),"TV"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-burn"}),"Heating"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-fire-extinguisher"}),"Fire extinguisher")),i.a.createElement("div",{className:"amenities-2"},i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-utensils"}),"Kitchen"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-swimmer"}),"Pool"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-fan"}),"Air conditioning"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-bell"}),"Smoke alarm"),i.a.createElement("div",null,i.a.createElement("i",{className:"fas fa-glass-martini"}),"Bar")))),i.a.createElement("div",{className:"create-review"},i.a.createElement(eo,{home:this.props.home})),i.a.createElement("div",{className:"show-map"},i.a.createElement("h2",{className:"textinfos"},"Location"),i.a.createElement(or,null))):null}}])&&no(t.prototype,n),r&&no(t,r),a}(i.a.Component),lo=Ze((function(e,t){return{home:e.entities.homes[t.match.params.homeId]}}),(function(e){return{createHome:function(t){return e(rt(t))},updateHome:function(t){return e(ot(t))},fetchHome:function(t){return e(nt(t))}}}))(so);function uo(e){return(uo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function co(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function fo(e,t){return(fo=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function po(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=mo(e);if(t){var o=mo(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return ho(this,n)}}function ho(e,t){if(t&&("object"===uo(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function mo(e){return(mo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var go=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&fo(e,t)}(a,e);var t,n,r,o=po(a);function a(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),o.call(this,e)}return t=a,(n=[{key:"componentDidMount",value:function(){this.props.fetchHomes()}},{key:"homesIndex",value:function(){return this.props.homes.map((function(e){return i.a.createElement(gt,{home:e,key:e.id})}))}},{key:"render",value:function(){return i.a.createElement("div",{className:"homes-div"},i.a.createElement("div",{className:"homes-left"},i.a.createElement("ul",{className:"homes-list"},this.homesIndex())),i.a.createElement("div",{className:"homes-right"},i.a.createElement("div",{className:"google-map"},i.a.createElement(or,{homes:this.props.homes,props:this.props}))))}}])&&co(t.prototype,n),r&&co(t,r),a}(i.a.Component),vo=se(Ze((function(e){return{homes:Object.values(e.entities.homes)}}),(function(e){return{fetchHome:function(t){return e(nt(t))},fetchHomes:function(t){return e(tt(t))}}}))(go));var yo=Ze((function(e){return{modal:e.ui.modal}}),(function(e){return{closeModal:function(){return e({type:"CLOSE_MODAL"})}}}))((function(e){var t,n=e.modal,r=e.closeModal;if(!n)return null;switch(n){case"login":t=i.a.createElement(qr,null);break;case"signup":t=i.a.createElement($r,null);break;case"review":t=i.a.createElement(eo,null);default:return null}return i.a.createElement("div",{className:"modal-background",onClick:r},i.a.createElement("div",{className:"modal-child",onClick:function(e){return e.stopPropagation()}},t))}));function bo(e){return(bo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function wo(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Eo(e,t){return(Eo=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function xo(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ko(e);if(t){var o=ko(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return _o(this,n)}}function _o(e,t){if(t&&("object"===bo(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function ko(e){return(ko=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Co=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Eo(e,t)}(a,e);var t,n,r,o=xo(a);function a(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),o.call(this,e)}return t=a,(n=[{key:"render",value:function(){var e=this.props.currentUser;return i.a.createElement("div",{className:"profile-show"},i.a.createElement("h1",{className:"profile-header"}," Personal info"),i.a.createElement("li",null," ",i.a.createElement("div",null," Full name"),i.a.createElement("p",null,e.first_name+" "+e.last_name)),i.a.createElement("li",null," ",i.a.createElement("div",null," Username "),i.a.createElement("p",null,e.username)),i.a.createElement("li",null," ",i.a.createElement("div",null," Email "),i.a.createElement("p",null,e.email)),i.a.createElement("li",null," ",i.a.createElement("div",null," Birthday "),i.a.createElement("p",null,e.birthday)))}}])&&wo(t.prototype,n),r&&wo(t,r),a}(i.a.Component),So=Ze((function(e){var t=e.session,n=e.entities.users,r=e.errors;return{currentUser:n[t.id],errors:r.session}}),null)(Co),Oo=function(e){return{loggedIn:Boolean(e.session.id)}};se(Ze(Oo)((function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.a.createElement(ee,{path:n,exact:o,render:function(e){return r?i.a.createElement(X,{to:"/"}):i.a.createElement(t,e)}})}))),se(Ze(Oo)((function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.a.createElement(ee,{path:n,exact:o,render:function(e){return r?i.a.createElement(t,e):i.a.createElement(X,{to:"/login"})}})})));function Po(e){return(Po="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function To(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Lo(e,t){return(Lo=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function No(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=jo(e);if(t){var o=jo(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Mo(this,n)}}function Mo(e,t){if(t&&("object"===Po(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function jo(e){return(jo=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Do=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Lo(e,t)}(a,e);var t,n,r,o=No(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=o.call(this,e)).handleClick=function(){t.setState({open:!t.state.open})},t.state={open:!1},t}return t=a,(n=[{key:"render",value:function(){return this.props.currentUserId,i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"splash-container"},i.a.createElement("div",{className:"mainbg"},i.a.createElement("img",{className:"splashbg",src:window.bg,alt:"BG"}),i.a.createElement("div",{className:"perfect"},"Not sure where to go? Perfect."),i.a.createElement("div",null,i.a.createElement(he,{className:"flex-button",to:"/homes"},"I'm flexible"))),i.a.createElement("div",null,i.a.createElement("div",{className:"explore-h3-container"},i.a.createElement("h3",{className:"explore-h3"},"Explore Places To Stay")),i.a.createElement("div",{className:"cities"},i.a.createElement("div",{className:"frog-row"},i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/Toronto"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/toronto.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/Toronto",className:"explore-location-text"},"Toronto"),i.a.createElement("p",null,i.a.createElement("span",null,"$250"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/Vancouver"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/vancouver.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/Vancouver",className:"explore-location-text"},"Vancouver"),i.a.createElement("p",null,i.a.createElement("span",null,"$300"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/Chicago"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/chicago.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/Chicago",className:"explore-location-text"},"Chicago"),i.a.createElement("p",null,i.a.createElement("span",null,"$180"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/New York"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/nyc.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/New York",className:"explore-location-text"},"New York"),i.a.createElement("p",null,i.a.createElement("span",null,"$250"),"/night avg."))),i.a.createElement("div",{className:"frog-row"},i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/New Jersey"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/nj.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/New Jersey",className:"explore-location-text"},"New Jersey"),i.a.createElement("p",null,i.a.createElement("span",null,"$130"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/San Francisco"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/sanfran.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/San Francisco",className:"explore-location-text"},"San Francisco"),i.a.createElement("p",null,i.a.createElement("span",null,"$250"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/Dallas"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/dallas.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/Dallas",className:"explore-location-text"},"Dallas"),i.a.createElement("p",null,i.a.createElement("span",null,"$180"),"/night avg.")),i.a.createElement("div",{className:"explore-location"},i.a.createElement("a",{href:"#/search/Houston"},i.a.createElement("img",{className:"location-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/houston.jpg",alt:"Location img"})),i.a.createElement(he,{to:"/search/Houston",className:"explore-location-text"},"Houston"),i.a.createElement("p",null,i.a.createElement("span",null,"$140"),"/night avg."))))),i.a.createElement("div",null,i.a.createElement("div",null,i.a.createElement("div",{className:"try-hosting-container-container"},i.a.createElement("div",{className:"try-hosting-container"},i.a.createElement("div",{className:"try-hosting-img-container"},i.a.createElement("img",{className:"try-hosting-img",src:"https://aa-homes-dev.s3.ca-central-1.amazonaws.com/try_hosting.jpg",alt:"Location img"})),i.a.createElement("div",{className:"try-hosting-text-container"},i.a.createElement("h3",{className:"try-hosting-h3"},"Try Hosting"),i.a.createElement("p",{className:"try-hosting-text"},"Earn extra income and unlock new opportunities by sharing your space"),i.a.createElement("p",{className:"learnmore"},"Learn More"))))))))}}])&&To(t.prototype,n),r&&To(t,r),a}(i.a.Component),Ao=Ze((function(e){return{currentUserId:e.session.id}}),(function(e){return{openModal:function(t){return e(xr(t))}}}))(Do),Ro=function(){return i.a.createElement("footer",{id:"all-page-footer"},i.a.createElement("div",{className:"footer-list-container"},i.a.createElement("ul",null,i.a.createElement("h3",null,"About me"),i.a.createElement("li",null,i.a.createElement("a",{href:"https://github.com/cheemaz1",target:"_blank",className:"github"},i.a.createElement("i",{className:"fab fa-github-square"}," GitHub"))),i.a.createElement("li",null,i.a.createElement("a",{href:"https://www.linkedin.com/in/zayed-cheema-30521920a/",target:"_blank",className:"github"},i.a.createElement("i",{className:"fab fa-linkedin"})," LinkedIn"))),i.a.createElement("ul",null,i.a.createElement("h3",null,"Contact"),i.a.createElement("li",null,i.a.createElement("a",{href:"mailto:zayedcheema@hotmail.com"},"zayedcheema@hotmail.com")),i.a.createElement("li",null,i.a.createElement("p",null,"(647) 833-5465"))),i.a.createElement("ul",null,i.a.createElement("h3",null,"Other Projects"),i.a.createElement("li",null,i.a.createElement("a",{href:"https://github.com/cheemaz1/V1-Foodie",target:"_blank"},"Foodie Web App"))),i.a.createElement("ul",null,i.a.createElement("h3",null,"Technologies/Inspiration"),i.a.createElement("li",null,i.a.createElement("a",{href:"https://www.airbnb.com",target:"_blank"},"Airbnb")),i.a.createElement("li",null,i.a.createElement("a",null,"Ruby")),i.a.createElement("li",null,i.a.createElement("a",null,"Ruby on Rails")),i.a.createElement("li",null,i.a.createElement("a",null,"JavaScript")),i.a.createElement("li",null,i.a.createElement("a",null,"React")),i.a.createElement("li",null,i.a.createElement("a",null,"Redux")),i.a.createElement("li",null,i.a.createElement("a",null,"HTML")),i.a.createElement("li",null,i.a.createElement("a",null,"CSS")),i.a.createElement("li",null,i.a.createElement("a",null,"AWS")))),i.a.createElement("div",{className:"footer-tag-line"},i.a.createElement("h3",{id:"copyright"},"©"," 2021 CozyBnB Inc. All rights reserved")))},Io=function(){return i.a.createElement("div",{className:"errorpg-flex-container"},i.a.createElement("div",{className:"errorpg-container"},i.a.createElement("p",{className:"errorpg-404"},"404"),i.a.createElement("p",{className:"errorpg-text"},"Page Not Found")))},zo="top",Bo="bottom",Uo="right",Ho="left",Fo="auto",Wo=[zo,Bo,Uo,Ho],$o="start",qo="end",Vo="clippingParents",Qo="viewport",Ko="popper",Yo="reference",Xo=Wo.reduce((function(e,t){return e.concat([t+"-"+$o,t+"-"+qo])}),[]),Go=[].concat(Wo,[Fo]).reduce((function(e,t){return e.concat([t,t+"-"+$o,t+"-"+qo])}),[]),Zo="beforeRead",Jo="read",ei="afterRead",ti="beforeMain",ni="main",ri="afterMain",oi="beforeWrite",ii="write",ai="afterWrite",si=[Zo,Jo,ei,ti,ni,ri,oi,ii,ai];function li(e){return e?(e.nodeName||"").toLowerCase():null}function ui(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function ci(e){return e instanceof ui(e).Element||e instanceof Element}function fi(e){return e instanceof ui(e).HTMLElement||e instanceof HTMLElement}function pi(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ui(e).ShadowRoot||e instanceof ShadowRoot)}var di={name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},r=t.attributes[e]||{},o=t.elements[e];fi(o)&&li(o)&&(Object.assign(o.style,n),Object.keys(r).forEach((function(e){var t=r[e];!1===t?o.removeAttribute(e):o.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var r=t.elements[e],o=t.attributes[e]||{},i=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});fi(r)&&li(r)&&(Object.assign(r.style,i),Object.keys(o).forEach((function(e){r.removeAttribute(e)})))}))}},requires:["computeStyles"]};function hi(e){return e.split("-")[0]}function mi(e,t){void 0===t&&(t=!1);var n=e.getBoundingClientRect();return{width:n.width/1,height:n.height/1,top:n.top/1,right:n.right/1,bottom:n.bottom/1,left:n.left/1,x:n.left/1,y:n.top/1}}function gi(e){var t=mi(e),n=e.offsetWidth,r=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:r}}function vi(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&pi(n)){var r=t;do{if(r&&e.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function yi(e){return ui(e).getComputedStyle(e)}function bi(e){return["table","td","th"].indexOf(li(e))>=0}function wi(e){return((ci(e)?e.ownerDocument:e.document)||window.document).documentElement}function Ei(e){return"html"===li(e)?e:e.assignedSlot||e.parentNode||(pi(e)?e.host:null)||wi(e)}function xi(e){return fi(e)&&"fixed"!==yi(e).position?e.offsetParent:null}function _i(e){for(var t=ui(e),n=xi(e);n&&bi(n)&&"static"===yi(n).position;)n=xi(n);return n&&("html"===li(n)||"body"===li(n)&&"static"===yi(n).position)?t:n||function(e){var t=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&fi(e)&&"fixed"===yi(e).position)return null;for(var n=Ei(e);fi(n)&&["html","body"].indexOf(li(n))<0;){var r=yi(n);if("none"!==r.transform||"none"!==r.perspective||"paint"===r.contain||-1!==["transform","perspective"].indexOf(r.willChange)||t&&"filter"===r.willChange||t&&r.filter&&"none"!==r.filter)return n;n=n.parentNode}return null}(e)||t}function ki(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}var Ci=Math.max,Si=Math.min,Oi=Math.round;function Pi(e,t,n){return Ci(e,Si(t,n))}function Ti(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function Li(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}var Ni={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,r=e.name,o=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=hi(n.placement),l=ki(s),u=[Ho,Uo].indexOf(s)>=0?"height":"width";if(i&&a){var c=function(e,t){return Ti("number"!=typeof(e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:Li(e,Wo))}(o.padding,n),f=gi(i),p="y"===l?zo:Ho,d="y"===l?Bo:Uo,h=n.rects.reference[u]+n.rects.reference[l]-a[l]-n.rects.popper[u],m=a[l]-n.rects.reference[l],g=_i(i),v=g?"y"===l?g.clientHeight||0:g.clientWidth||0:0,y=h/2-m/2,b=c[p],w=v-f[u]-c[d],E=v/2-f[u]/2+y,x=Pi(b,E,w),_=l;n.modifiersData[r]=((t={})[_]=x,t.centerOffset=x-E,t)}},effect:function(e){var t=e.state,n=e.options.element,r=void 0===n?"[data-popper-arrow]":n;null!=r&&("string"!=typeof r||(r=t.elements.popper.querySelector(r)))&&vi(t.elements.popper,r)&&(t.elements.arrow=r)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function Mi(e){return e.split("-")[1]}var ji={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Di(e){var t,n=e.popper,r=e.popperRect,o=e.placement,i=e.variation,a=e.offsets,s=e.position,l=e.gpuAcceleration,u=e.adaptive,c=e.roundOffsets,f=!0===c?function(e){var t=e.x,n=e.y,r=window.devicePixelRatio||1;return{x:Oi(Oi(t*r)/r)||0,y:Oi(Oi(n*r)/r)||0}}(a):"function"==typeof c?c(a):a,p=f.x,d=void 0===p?0:p,h=f.y,m=void 0===h?0:h,g=a.hasOwnProperty("x"),v=a.hasOwnProperty("y"),y=Ho,b=zo,w=window;if(u){var E=_i(n),x="clientHeight",_="clientWidth";E===ui(n)&&"static"!==yi(E=wi(n)).position&&"absolute"===s&&(x="scrollHeight",_="scrollWidth"),E=E,o!==zo&&(o!==Ho&&o!==Uo||i!==qo)||(b=Bo,m-=E[x]-r.height,m*=l?1:-1),o!==Ho&&(o!==zo&&o!==Bo||i!==qo)||(y=Uo,d-=E[_]-r.width,d*=l?1:-1)}var k,C=Object.assign({position:s},u&&ji);return l?Object.assign({},C,((k={})[b]=v?"0":"",k[y]=g?"0":"",k.transform=(w.devicePixelRatio||1)<=1?"translate("+d+"px, "+m+"px)":"translate3d("+d+"px, "+m+"px, 0)",k)):Object.assign({},C,((t={})[b]=v?m+"px":"",t[y]=g?d+"px":"",t.transform="",t))}var Ai={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,r=n.gpuAcceleration,o=void 0===r||r,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,l=void 0===s||s,u={placement:hi(t.placement),variation:Mi(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,Di(Object.assign({},u,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:l})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,Di(Object.assign({},u,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},Ri={passive:!0};var Ii={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,n=e.instance,r=e.options,o=r.scroll,i=void 0===o||o,a=r.resize,s=void 0===a||a,l=ui(t.elements.popper),u=[].concat(t.scrollParents.reference,t.scrollParents.popper);return i&&u.forEach((function(e){e.addEventListener("scroll",n.update,Ri)})),s&&l.addEventListener("resize",n.update,Ri),function(){i&&u.forEach((function(e){e.removeEventListener("scroll",n.update,Ri)})),s&&l.removeEventListener("resize",n.update,Ri)}},data:{}},zi={left:"right",right:"left",bottom:"top",top:"bottom"};function Bi(e){return e.replace(/left|right|bottom|top/g,(function(e){return zi[e]}))}var Ui={start:"end",end:"start"};function Hi(e){return e.replace(/start|end/g,(function(e){return Ui[e]}))}function Fi(e){var t=ui(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function Wi(e){return mi(wi(e)).left+Fi(e).scrollLeft}function $i(e){var t=yi(e),n=t.overflow,r=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+o+r)}function qi(e,t){var n;void 0===t&&(t=[]);var r=function e(t){return["html","body","#document"].indexOf(li(t))>=0?t.ownerDocument.body:fi(t)&&$i(t)?t:e(Ei(t))}(e),o=r===(null==(n=e.ownerDocument)?void 0:n.body),i=ui(r),a=o?[i].concat(i.visualViewport||[],$i(r)?r:[]):r,s=t.concat(a);return o?s:s.concat(qi(Ei(a)))}function Vi(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function Qi(e,t){return t===Qo?Vi(function(e){var t=ui(e),n=wi(e),r=t.visualViewport,o=n.clientWidth,i=n.clientHeight,a=0,s=0;return r&&(o=r.width,i=r.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(a=r.offsetLeft,s=r.offsetTop)),{width:o,height:i,x:a+Wi(e),y:s}}(e)):fi(t)?function(e){var t=mi(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(t):Vi(function(e){var t,n=wi(e),r=Fi(e),o=null==(t=e.ownerDocument)?void 0:t.body,i=Ci(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),a=Ci(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),s=-r.scrollLeft+Wi(e),l=-r.scrollTop;return"rtl"===yi(o||n).direction&&(s+=Ci(n.clientWidth,o?o.clientWidth:0)-i),{width:i,height:a,x:s,y:l}}(wi(e)))}function Ki(e,t,n){var r="clippingParents"===t?function(e){var t=qi(Ei(e)),n=["absolute","fixed"].indexOf(yi(e).position)>=0&&fi(e)?_i(e):e;return ci(n)?t.filter((function(e){return ci(e)&&vi(e,n)&&"body"!==li(e)})):[]}(e):[].concat(t),o=[].concat(r,[n]),i=o[0],a=o.reduce((function(t,n){var r=Qi(e,n);return t.top=Ci(r.top,t.top),t.right=Si(r.right,t.right),t.bottom=Si(r.bottom,t.bottom),t.left=Ci(r.left,t.left),t}),Qi(e,i));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}function Yi(e){var t,n=e.reference,r=e.element,o=e.placement,i=o?hi(o):null,a=o?Mi(o):null,s=n.x+n.width/2-r.width/2,l=n.y+n.height/2-r.height/2;switch(i){case zo:t={x:s,y:n.y-r.height};break;case Bo:t={x:s,y:n.y+n.height};break;case Uo:t={x:n.x+n.width,y:l};break;case Ho:t={x:n.x-r.width,y:l};break;default:t={x:n.x,y:n.y}}var u=i?ki(i):null;if(null!=u){var c="y"===u?"height":"width";switch(a){case $o:t[u]=t[u]-(n[c]/2-r[c]/2);break;case qo:t[u]=t[u]+(n[c]/2-r[c]/2)}}return t}function Xi(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=void 0===r?e.placement:r,i=n.boundary,a=void 0===i?Vo:i,s=n.rootBoundary,l=void 0===s?Qo:s,u=n.elementContext,c=void 0===u?Ko:u,f=n.altBoundary,p=void 0!==f&&f,d=n.padding,h=void 0===d?0:d,m=Ti("number"!=typeof h?h:Li(h,Wo)),g=c===Ko?Yo:Ko,v=e.rects.popper,y=e.elements[p?g:c],b=Ki(ci(y)?y:y.contextElement||wi(e.elements.popper),a,l),w=mi(e.elements.reference),E=Yi({reference:w,element:v,strategy:"absolute",placement:o}),x=Vi(Object.assign({},v,E)),_=c===Ko?x:w,k={top:b.top-_.top+m.top,bottom:_.bottom-b.bottom+m.bottom,left:b.left-_.left+m.left,right:_.right-b.right+m.right},C=e.modifiersData.offset;if(c===Ko&&C){var S=C[o];Object.keys(k).forEach((function(e){var t=[Uo,Bo].indexOf(e)>=0?1:-1,n=[zo,Bo].indexOf(e)>=0?"y":"x";k[e]+=S[n]*t}))}return k}var Gi={name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0===a||a,l=n.fallbackPlacements,u=n.padding,c=n.boundary,f=n.rootBoundary,p=n.altBoundary,d=n.flipVariations,h=void 0===d||d,m=n.allowedAutoPlacements,g=t.options.placement,v=hi(g),y=l||(v===g||!h?[Bi(g)]:function(e){if(hi(e)===Fo)return[];var t=Bi(e);return[Hi(e),t,Hi(t)]}(g)),b=[g].concat(y).reduce((function(e,n){return e.concat(hi(n)===Fo?function(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,l=n.allowedAutoPlacements,u=void 0===l?Go:l,c=Mi(r),f=c?s?Xo:Xo.filter((function(e){return Mi(e)===c})):Wo,p=f.filter((function(e){return u.indexOf(e)>=0}));0===p.length&&(p=f);var d=p.reduce((function(t,n){return t[n]=Xi(e,{placement:n,boundary:o,rootBoundary:i,padding:a})[hi(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}(t,{placement:n,boundary:c,rootBoundary:f,padding:u,flipVariations:h,allowedAutoPlacements:m}):n)}),[]),w=t.rects.reference,E=t.rects.popper,x=new Map,_=!0,k=b[0],C=0;C<b.length;C++){var S=b[C],O=hi(S),P=Mi(S)===$o,T=[zo,Bo].indexOf(O)>=0,L=T?"width":"height",N=Xi(t,{placement:S,boundary:c,rootBoundary:f,altBoundary:p,padding:u}),M=T?P?Uo:Ho:P?Bo:zo;w[L]>E[L]&&(M=Bi(M));var j=Bi(M),D=[];if(i&&D.push(N[O]<=0),s&&D.push(N[M]<=0,N[j]<=0),D.every((function(e){return e}))){k=S,_=!1;break}x.set(S,D)}if(_)for(var A=function(e){var t=b.find((function(t){var n=x.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return k=t,"break"},R=h?3:1;R>0;R--){if("break"===A(R))break}t.placement!==k&&(t.modifiersData[r]._skip=!0,t.placement=k,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function Zi(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function Ji(e){return[zo,Uo,Bo,Ho].some((function(t){return e[t]>=0}))}var ea={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,r=t.rects.reference,o=t.rects.popper,i=t.modifiersData.preventOverflow,a=Xi(t,{elementContext:"reference"}),s=Xi(t,{altBoundary:!0}),l=Zi(a,r),u=Zi(s,o,i),c=Ji(l),f=Ji(u);t.modifiersData[n]={referenceClippingOffsets:l,popperEscapeOffsets:u,isReferenceHidden:c,hasPopperEscaped:f},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":c,"data-popper-escaped":f})}};var ta={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.offset,i=void 0===o?[0,0]:o,a=Go.reduce((function(e,n){return e[n]=function(e,t,n){var r=hi(e),o=[Ho,zo].indexOf(r)>=0?-1:1,i="function"==typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*o,[Ho,Uo].indexOf(r)>=0?{x:s,y:a}:{x:a,y:s}}(n,t.rects,i),e}),{}),s=a[t.placement],l=s.x,u=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=l,t.modifiersData.popperOffsets.y+=u),t.modifiersData[r]=a}};var na={name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=Yi({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}};var ra={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0!==a&&a,l=n.boundary,u=n.rootBoundary,c=n.altBoundary,f=n.padding,p=n.tether,d=void 0===p||p,h=n.tetherOffset,m=void 0===h?0:h,g=Xi(t,{boundary:l,rootBoundary:u,padding:f,altBoundary:c}),v=hi(t.placement),y=Mi(t.placement),b=!y,w=ki(v),E="x"===w?"y":"x",x=t.modifiersData.popperOffsets,_=t.rects.reference,k=t.rects.popper,C="function"==typeof m?m(Object.assign({},t.rects,{placement:t.placement})):m,S={x:0,y:0};if(x){if(i||s){var O="y"===w?zo:Ho,P="y"===w?Bo:Uo,T="y"===w?"height":"width",L=x[w],N=x[w]+g[O],M=x[w]-g[P],j=d?-k[T]/2:0,D=y===$o?_[T]:k[T],A=y===$o?-k[T]:-_[T],R=t.elements.arrow,I=d&&R?gi(R):{width:0,height:0},z=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},B=z[O],U=z[P],H=Pi(0,_[T],I[T]),F=b?_[T]/2-j-H-B-C:D-H-B-C,W=b?-_[T]/2+j+H+U+C:A+H+U+C,$=t.elements.arrow&&_i(t.elements.arrow),q=$?"y"===w?$.clientTop||0:$.clientLeft||0:0,V=t.modifiersData.offset?t.modifiersData.offset[t.placement][w]:0,Q=x[w]+F-V-q,K=x[w]+W-V;if(i){var Y=Pi(d?Si(N,Q):N,L,d?Ci(M,K):M);x[w]=Y,S[w]=Y-L}if(s){var X="x"===w?zo:Ho,G="x"===w?Bo:Uo,Z=x[E],J=Z+g[X],ee=Z-g[G],te=Pi(d?Si(J,Q):J,Z,d?Ci(ee,K):ee);x[E]=te,S[E]=te-Z}}t.modifiersData[r]=S}},requiresIfExists:["offset"]};function oa(e,t,n){void 0===n&&(n=!1);var r,o,i=fi(t),a=fi(t)&&function(e){var t=e.getBoundingClientRect(),n=t.width/e.offsetWidth||1,r=t.height/e.offsetHeight||1;return 1!==n||1!==r}(t),s=wi(t),l=mi(e,a),u={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(i||!i&&!n)&&(("body"!==li(t)||$i(s))&&(u=(r=t)!==ui(r)&&fi(r)?{scrollLeft:(o=r).scrollLeft,scrollTop:o.scrollTop}:Fi(r)),fi(t)?((c=mi(t,!0)).x+=t.clientLeft,c.y+=t.clientTop):s&&(c.x=Wi(s))),{x:l.left+u.scrollLeft-c.x,y:l.top+u.scrollTop-c.y,width:l.width,height:l.height}}function ia(e){var t=new Map,n=new Set,r=[];return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||function e(o){n.add(o.name),[].concat(o.requires||[],o.requiresIfExists||[]).forEach((function(r){if(!n.has(r)){var o=t.get(r);o&&e(o)}})),r.push(o)}(e)})),r}var aa={placement:"bottom",modifiers:[],strategy:"absolute"};function sa(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function la(e){void 0===e&&(e={});var t=e,n=t.defaultModifiers,r=void 0===n?[]:n,o=t.defaultOptions,i=void 0===o?aa:o;return function(e,t,n){void 0===n&&(n=i);var o,a,s={placement:"bottom",orderedModifiers:[],options:Object.assign({},aa,i),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},l=[],u=!1,c={state:s,setOptions:function(n){var o="function"==typeof n?n(s.options):n;f(),s.options=Object.assign({},i,s.options,o),s.scrollParents={reference:ci(e)?qi(e):e.contextElement?qi(e.contextElement):[],popper:qi(t)};var a=function(e){var t=ia(e);return si.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}(function(e){var t=e.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{});return Object.keys(t).map((function(e){return t[e]}))}([].concat(r,s.options.modifiers)));return s.orderedModifiers=a.filter((function(e){return e.enabled})),s.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,r=void 0===n?{}:n,o=e.effect;if("function"==typeof o){var i=o({state:s,name:t,instance:c,options:r});l.push(i||function(){})}})),c.update()},forceUpdate:function(){if(!u){var e=s.elements,t=e.reference,n=e.popper;if(sa(t,n)){s.rects={reference:oa(t,_i(n),"fixed"===s.options.strategy),popper:gi(n)},s.reset=!1,s.placement=s.options.placement,s.orderedModifiers.forEach((function(e){return s.modifiersData[e.name]=Object.assign({},e.data)}));for(var r=0;r<s.orderedModifiers.length;r++)if(!0!==s.reset){var o=s.orderedModifiers[r],i=o.fn,a=o.options,l=void 0===a?{}:a,f=o.name;"function"==typeof i&&(s=i({state:s,options:l,name:f,instance:c})||s)}else s.reset=!1,r=-1}}},update:(o=function(){return new Promise((function(e){c.forceUpdate(),e(s)}))},function(){return a||(a=new Promise((function(e){Promise.resolve().then((function(){a=void 0,e(o())}))}))),a}),destroy:function(){f(),u=!0}};if(!sa(e,t))return c;function f(){l.forEach((function(e){return e()})),l=[]}return c.setOptions(n).then((function(e){!u&&n.onFirstUpdate&&n.onFirstUpdate(e)})),c}}var ua=la(),ca=la({defaultModifiers:[Ii,na,Ai,di,ta,Gi,ra,Ni,ea]}),fa=la({defaultModifiers:[Ii,na,Ai,di]});
/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
const pa=e=>{let t=e.getAttribute("data-bs-target");if(!t||"#"===t){let n=e.getAttribute("href");if(!n||!n.includes("#")&&!n.startsWith("."))return null;n.includes("#")&&!n.startsWith("#")&&(n="#"+n.split("#")[1]),t=n&&"#"!==n?n.trim():null}return t},da=e=>{const t=pa(e);return t&&document.querySelector(t)?t:null},ha=e=>{const t=pa(e);return t?document.querySelector(t):null},ma=e=>{e.dispatchEvent(new Event("transitionend"))},ga=e=>!(!e||"object"!=typeof e)&&(void 0!==e.jquery&&(e=e[0]),void 0!==e.nodeType),va=e=>ga(e)?e.jquery?e[0]:e:"string"==typeof e&&e.length>0?document.querySelector(e):null,ya=(e,t,n)=>{Object.keys(n).forEach(r=>{const o=n[r],i=t[r],a=i&&ga(i)?"element":null==(s=i)?""+s:{}.toString.call(s).match(/\s([a-z]+)/i)[1].toLowerCase();var s;if(!new RegExp(o).test(a))throw new TypeError(`${e.toUpperCase()}: Option "${r}" provided type "${a}" but expected type "${o}".`)})},ba=e=>!(!ga(e)||0===e.getClientRects().length)&&"visible"===getComputedStyle(e).getPropertyValue("visibility"),wa=e=>!e||e.nodeType!==Node.ELEMENT_NODE||(!!e.classList.contains("disabled")||(void 0!==e.disabled?e.disabled:e.hasAttribute("disabled")&&"false"!==e.getAttribute("disabled"))),Ea=e=>{if(!document.documentElement.attachShadow)return null;if("function"==typeof e.getRootNode){const t=e.getRootNode();return t instanceof ShadowRoot?t:null}return e instanceof ShadowRoot?e:e.parentNode?Ea(e.parentNode):null},xa=()=>{},_a=e=>{e.offsetHeight},ka=()=>{const{jQuery:e}=window;return e&&!document.body.hasAttribute("data-bs-no-jquery")?e:null},Ca=[],Sa=()=>"rtl"===document.documentElement.dir,Oa=e=>{var t;t=()=>{const t=ka();if(t){const n=e.NAME,r=t.fn[n];t.fn[n]=e.jQueryInterface,t.fn[n].Constructor=e,t.fn[n].noConflict=()=>(t.fn[n]=r,e.jQueryInterface)}},"loading"===document.readyState?(Ca.length||document.addEventListener("DOMContentLoaded",()=>{Ca.forEach(e=>e())}),Ca.push(t)):t()},Pa=e=>{"function"==typeof e&&e()},Ta=(e,t,n=!0)=>{if(!n)return void Pa(e);const r=(e=>{if(!e)return 0;let{transitionDuration:t,transitionDelay:n}=window.getComputedStyle(e);const r=Number.parseFloat(t),o=Number.parseFloat(n);return r||o?(t=t.split(",")[0],n=n.split(",")[0],1e3*(Number.parseFloat(t)+Number.parseFloat(n))):0})(t)+5;let o=!1;const i=({target:n})=>{n===t&&(o=!0,t.removeEventListener("transitionend",i),Pa(e))};t.addEventListener("transitionend",i),setTimeout(()=>{o||ma(t)},r)},La=(e,t,n,r)=>{let o=e.indexOf(t);if(-1===o)return e[!n&&r?e.length-1:0];const i=e.length;return o+=n?1:-1,r&&(o=(o+i)%i),e[Math.max(0,Math.min(o,i-1))]},Na=/[^.]*(?=\..*)\.|.*/,Ma=/\..*/,ja=/::\d+$/,Da={};let Aa=1;const Ra={mouseenter:"mouseover",mouseleave:"mouseout"},Ia=/^(mouseenter|mouseleave)/i,za=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function Ba(e,t){return t&&`${t}::${Aa++}`||e.uidEvent||Aa++}function Ua(e){const t=Ba(e);return e.uidEvent=t,Da[t]=Da[t]||{},Da[t]}function Ha(e,t,n=null){const r=Object.keys(e);for(let o=0,i=r.length;o<i;o++){const i=e[r[o]];if(i.originalHandler===t&&i.delegationSelector===n)return i}return null}function Fa(e,t,n){const r="string"==typeof t,o=r?n:t;let i=qa(e);return za.has(i)||(i=e),[r,o,i]}function Wa(e,t,n,r,o){if("string"!=typeof t||!e)return;if(n||(n=r,r=null),Ia.test(t)){const e=e=>function(t){if(!t.relatedTarget||t.relatedTarget!==t.delegateTarget&&!t.delegateTarget.contains(t.relatedTarget))return e.call(this,t)};r?r=e(r):n=e(n)}const[i,a,s]=Fa(t,n,r),l=Ua(e),u=l[s]||(l[s]={}),c=Ha(u,a,i?n:null);if(c)return void(c.oneOff=c.oneOff&&o);const f=Ba(a,t.replace(Na,"")),p=i?function(e,t,n){return function r(o){const i=e.querySelectorAll(t);for(let{target:a}=o;a&&a!==this;a=a.parentNode)for(let s=i.length;s--;)if(i[s]===a)return o.delegateTarget=a,r.oneOff&&Va.off(e,o.type,t,n),n.apply(a,[o]);return null}}(e,n,r):function(e,t){return function n(r){return r.delegateTarget=e,n.oneOff&&Va.off(e,r.type,t),t.apply(e,[r])}}(e,n);p.delegationSelector=i?n:null,p.originalHandler=a,p.oneOff=o,p.uidEvent=f,u[f]=p,e.addEventListener(s,p,i)}function $a(e,t,n,r,o){const i=Ha(t[n],r,o);i&&(e.removeEventListener(n,i,Boolean(o)),delete t[n][i.uidEvent])}function qa(e){return e=e.replace(Ma,""),Ra[e]||e}const Va={on(e,t,n,r){Wa(e,t,n,r,!1)},one(e,t,n,r){Wa(e,t,n,r,!0)},off(e,t,n,r){if("string"!=typeof t||!e)return;const[o,i,a]=Fa(t,n,r),s=a!==t,l=Ua(e),u=t.startsWith(".");if(void 0!==i){if(!l||!l[a])return;return void $a(e,l,a,i,o?n:null)}u&&Object.keys(l).forEach(n=>{!function(e,t,n,r){const o=t[n]||{};Object.keys(o).forEach(i=>{if(i.includes(r)){const r=o[i];$a(e,t,n,r.originalHandler,r.delegationSelector)}})}(e,l,n,t.slice(1))});const c=l[a]||{};Object.keys(c).forEach(n=>{const r=n.replace(ja,"");if(!s||t.includes(r)){const t=c[n];$a(e,l,a,t.originalHandler,t.delegationSelector)}})},trigger(e,t,n){if("string"!=typeof t||!e)return null;const r=ka(),o=qa(t),i=t!==o,a=za.has(o);let s,l=!0,u=!0,c=!1,f=null;return i&&r&&(s=r.Event(t,n),r(e).trigger(s),l=!s.isPropagationStopped(),u=!s.isImmediatePropagationStopped(),c=s.isDefaultPrevented()),a?(f=document.createEvent("HTMLEvents"),f.initEvent(o,l,!0)):f=new CustomEvent(t,{bubbles:l,cancelable:!0}),void 0!==n&&Object.keys(n).forEach(e=>{Object.defineProperty(f,e,{get:()=>n[e]})}),c&&f.preventDefault(),u&&e.dispatchEvent(f),f.defaultPrevented&&void 0!==s&&s.preventDefault(),f}},Qa=new Map,Ka={set(e,t,n){Qa.has(e)||Qa.set(e,new Map);const r=Qa.get(e);r.has(t)||0===r.size?r.set(t,n):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(r.keys())[0]}.`)},get:(e,t)=>Qa.has(e)&&Qa.get(e).get(t)||null,remove(e,t){if(!Qa.has(e))return;const n=Qa.get(e);n.delete(t),0===n.size&&Qa.delete(e)}};class Ya{constructor(e){(e=va(e))&&(this._element=e,Ka.set(this._element,this.constructor.DATA_KEY,this))}dispose(){Ka.remove(this._element,this.constructor.DATA_KEY),Va.off(this._element,this.constructor.EVENT_KEY),Object.getOwnPropertyNames(this).forEach(e=>{this[e]=null})}_queueCallback(e,t,n=!0){Ta(e,t,n)}static getInstance(e){return Ka.get(va(e),this.DATA_KEY)}static getOrCreateInstance(e,t={}){return this.getInstance(e)||new this(e,"object"==typeof t?t:null)}static get VERSION(){return"5.1.3"}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}static get DATA_KEY(){return"bs."+this.NAME}static get EVENT_KEY(){return"."+this.DATA_KEY}}const Xa=(e,t="hide")=>{const n="click.dismiss"+e.EVENT_KEY,r=e.NAME;Va.on(document,n,`[data-bs-dismiss="${r}"]`,(function(n){if(["A","AREA"].includes(this.tagName)&&n.preventDefault(),wa(this))return;const o=ha(this)||this.closest("."+r);e.getOrCreateInstance(o)[t]()}))};class Ga extends Ya{static get NAME(){return"alert"}close(){if(Va.trigger(this._element,"close.bs.alert").defaultPrevented)return;this._element.classList.remove("show");const e=this._element.classList.contains("fade");this._queueCallback(()=>this._destroyElement(),this._element,e)}_destroyElement(){this._element.remove(),Va.trigger(this._element,"closed.bs.alert"),this.dispose()}static jQueryInterface(e){return this.each((function(){const t=Ga.getOrCreateInstance(this);if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw new TypeError(`No method named "${e}"`);t[e](this)}}))}}Xa(Ga,"close"),Oa(Ga);class Za extends Ya{static get NAME(){return"button"}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}static jQueryInterface(e){return this.each((function(){const t=Za.getOrCreateInstance(this);"toggle"===e&&t[e]()}))}}function Ja(e){return"true"===e||"false"!==e&&(e===Number(e).toString()?Number(e):""===e||"null"===e?null:e)}function es(e){return e.replace(/[A-Z]/g,e=>"-"+e.toLowerCase())}Va.on(document,"click.bs.button.data-api",'[data-bs-toggle="button"]',e=>{e.preventDefault();const t=e.target.closest('[data-bs-toggle="button"]');Za.getOrCreateInstance(t).toggle()}),Oa(Za);const ts={setDataAttribute(e,t,n){e.setAttribute("data-bs-"+es(t),n)},removeDataAttribute(e,t){e.removeAttribute("data-bs-"+es(t))},getDataAttributes(e){if(!e)return{};const t={};return Object.keys(e.dataset).filter(e=>e.startsWith("bs")).forEach(n=>{let r=n.replace(/^bs/,"");r=r.charAt(0).toLowerCase()+r.slice(1,r.length),t[r]=Ja(e.dataset[n])}),t},getDataAttribute:(e,t)=>Ja(e.getAttribute("data-bs-"+es(t))),offset(e){const t=e.getBoundingClientRect();return{top:t.top+window.pageYOffset,left:t.left+window.pageXOffset}},position:e=>({top:e.offsetTop,left:e.offsetLeft})},ns={find:(e,t=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(t,e)),findOne:(e,t=document.documentElement)=>Element.prototype.querySelector.call(t,e),children:(e,t)=>[].concat(...e.children).filter(e=>e.matches(t)),parents(e,t){const n=[];let r=e.parentNode;for(;r&&r.nodeType===Node.ELEMENT_NODE&&3!==r.nodeType;)r.matches(t)&&n.push(r),r=r.parentNode;return n},prev(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return[n];n=n.previousElementSibling}return[]},next(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return[n];n=n.nextElementSibling}return[]},focusableChildren(e){const t=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(e=>e+':not([tabindex^="-"])').join(", ");return this.find(t,e).filter(e=>!wa(e)&&ba(e))}},rs=".bs.carousel",os={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},is={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},as="next",ss="prev",ls="left",us="right",cs={ArrowLeft:us,ArrowRight:ls},fs=`load${rs}.data-api`,ps=`click${rs}.data-api`;class ds extends Ya{constructor(e,t){super(e),this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(t),this._indicatorsElement=ns.findOne(".carousel-indicators",this._element),this._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,this._pointerEvent=Boolean(window.PointerEvent),this._addEventListeners()}static get Default(){return os}static get NAME(){return"carousel"}next(){this._slide(as)}nextWhenVisible(){!document.hidden&&ba(this._element)&&this.next()}prev(){this._slide(ss)}pause(e){e||(this._isPaused=!0),ns.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(ma(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null}cycle(e){e||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._updateInterval(),this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))}to(e){this._activeElement=ns.findOne(".active.carousel-item",this._element);const t=this._getItemIndex(this._activeElement);if(e>this._items.length-1||e<0)return;if(this._isSliding)return void Va.one(this._element,"slid.bs.carousel",()=>this.to(e));if(t===e)return this.pause(),void this.cycle();const n=e>t?as:ss;this._slide(n,this._items[e])}_getConfig(e){return e={...os,...ts.getDataAttributes(this._element),..."object"==typeof e?e:{}},ya("carousel",e,is),e}_handleSwipe(){const e=Math.abs(this.touchDeltaX);if(e<=40)return;const t=e/this.touchDeltaX;this.touchDeltaX=0,t&&this._slide(t>0?us:ls)}_addEventListeners(){this._config.keyboard&&Va.on(this._element,"keydown.bs.carousel",e=>this._keydown(e)),"hover"===this._config.pause&&(Va.on(this._element,"mouseenter.bs.carousel",e=>this.pause(e)),Va.on(this._element,"mouseleave.bs.carousel",e=>this.cycle(e))),this._config.touch&&this._touchSupported&&this._addTouchEventListeners()}_addTouchEventListeners(){const e=e=>this._pointerEvent&&("pen"===e.pointerType||"touch"===e.pointerType),t=t=>{e(t)?this.touchStartX=t.clientX:this._pointerEvent||(this.touchStartX=t.touches[0].clientX)},n=e=>{this.touchDeltaX=e.touches&&e.touches.length>1?0:e.touches[0].clientX-this.touchStartX},r=t=>{e(t)&&(this.touchDeltaX=t.clientX-this.touchStartX),this._handleSwipe(),"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout(e=>this.cycle(e),500+this._config.interval))};ns.find(".carousel-item img",this._element).forEach(e=>{Va.on(e,"dragstart.bs.carousel",e=>e.preventDefault())}),this._pointerEvent?(Va.on(this._element,"pointerdown.bs.carousel",e=>t(e)),Va.on(this._element,"pointerup.bs.carousel",e=>r(e)),this._element.classList.add("pointer-event")):(Va.on(this._element,"touchstart.bs.carousel",e=>t(e)),Va.on(this._element,"touchmove.bs.carousel",e=>n(e)),Va.on(this._element,"touchend.bs.carousel",e=>r(e)))}_keydown(e){if(/input|textarea/i.test(e.target.tagName))return;const t=cs[e.key];t&&(e.preventDefault(),this._slide(t))}_getItemIndex(e){return this._items=e&&e.parentNode?ns.find(".carousel-item",e.parentNode):[],this._items.indexOf(e)}_getItemByOrder(e,t){const n=e===as;return La(this._items,t,n,this._config.wrap)}_triggerSlideEvent(e,t){const n=this._getItemIndex(e),r=this._getItemIndex(ns.findOne(".active.carousel-item",this._element));return Va.trigger(this._element,"slide.bs.carousel",{relatedTarget:e,direction:t,from:r,to:n})}_setActiveIndicatorElement(e){if(this._indicatorsElement){const t=ns.findOne(".active",this._indicatorsElement);t.classList.remove("active"),t.removeAttribute("aria-current");const n=ns.find("[data-bs-target]",this._indicatorsElement);for(let t=0;t<n.length;t++)if(Number.parseInt(n[t].getAttribute("data-bs-slide-to"),10)===this._getItemIndex(e)){n[t].classList.add("active"),n[t].setAttribute("aria-current","true");break}}}_updateInterval(){const e=this._activeElement||ns.findOne(".active.carousel-item",this._element);if(!e)return;const t=Number.parseInt(e.getAttribute("data-bs-interval"),10);t?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=t):this._config.interval=this._config.defaultInterval||this._config.interval}_slide(e,t){const n=this._directionToOrder(e),r=ns.findOne(".active.carousel-item",this._element),o=this._getItemIndex(r),i=t||this._getItemByOrder(n,r),a=this._getItemIndex(i),s=Boolean(this._interval),l=n===as,u=l?"carousel-item-start":"carousel-item-end",c=l?"carousel-item-next":"carousel-item-prev",f=this._orderToDirection(n);if(i&&i.classList.contains("active"))return void(this._isSliding=!1);if(this._isSliding)return;if(this._triggerSlideEvent(i,f).defaultPrevented)return;if(!r||!i)return;this._isSliding=!0,s&&this.pause(),this._setActiveIndicatorElement(i),this._activeElement=i;const p=()=>{Va.trigger(this._element,"slid.bs.carousel",{relatedTarget:i,direction:f,from:o,to:a})};if(this._element.classList.contains("slide")){i.classList.add(c),_a(i),r.classList.add(u),i.classList.add(u);const e=()=>{i.classList.remove(u,c),i.classList.add("active"),r.classList.remove("active",c,u),this._isSliding=!1,setTimeout(p,0)};this._queueCallback(e,r,!0)}else r.classList.remove("active"),i.classList.add("active"),this._isSliding=!1,p();s&&this.cycle()}_directionToOrder(e){return[us,ls].includes(e)?Sa()?e===ls?ss:as:e===ls?as:ss:e}_orderToDirection(e){return[as,ss].includes(e)?Sa()?e===ss?ls:us:e===ss?us:ls:e}static carouselInterface(e,t){const n=ds.getOrCreateInstance(e,t);let{_config:r}=n;"object"==typeof t&&(r={...r,...t});const o="string"==typeof t?t:r.slide;if("number"==typeof t)n.to(t);else if("string"==typeof o){if(void 0===n[o])throw new TypeError(`No method named "${o}"`);n[o]()}else r.interval&&r.ride&&(n.pause(),n.cycle())}static jQueryInterface(e){return this.each((function(){ds.carouselInterface(this,e)}))}static dataApiClickHandler(e){const t=ha(this);if(!t||!t.classList.contains("carousel"))return;const n={...ts.getDataAttributes(t),...ts.getDataAttributes(this)},r=this.getAttribute("data-bs-slide-to");r&&(n.interval=!1),ds.carouselInterface(t,n),r&&ds.getInstance(t).to(r),e.preventDefault()}}Va.on(document,ps,"[data-bs-slide], [data-bs-slide-to]",ds.dataApiClickHandler),Va.on(window,fs,()=>{const e=ns.find('[data-bs-ride="carousel"]');for(let t=0,n=e.length;t<n;t++)ds.carouselInterface(e[t],ds.getInstance(e[t]))}),Oa(ds);const hs={toggle:!0,parent:null},ms={toggle:"boolean",parent:"(null|element)"};class gs extends Ya{constructor(e,t){super(e),this._isTransitioning=!1,this._config=this._getConfig(t),this._triggerArray=[];const n=ns.find('[data-bs-toggle="collapse"]');for(let e=0,t=n.length;e<t;e++){const t=n[e],r=da(t),o=ns.find(r).filter(e=>e===this._element);null!==r&&o.length&&(this._selector=r,this._triggerArray.push(t))}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return hs}static get NAME(){return"collapse"}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let e,t=[];if(this._config.parent){const e=ns.find(":scope .collapse .collapse",this._config.parent);t=ns.find(".collapse.show, .collapse.collapsing",this._config.parent).filter(t=>!e.includes(t))}const n=ns.findOne(this._selector);if(t.length){const r=t.find(e=>n!==e);if(e=r?gs.getInstance(r):null,e&&e._isTransitioning)return}if(Va.trigger(this._element,"show.bs.collapse").defaultPrevented)return;t.forEach(t=>{n!==t&&gs.getOrCreateInstance(t,{toggle:!1}).hide(),e||Ka.set(t,"bs.collapse",null)});const r=this._getDimension();this._element.classList.remove("collapse"),this._element.classList.add("collapsing"),this._element.style[r]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const o="scroll"+(r[0].toUpperCase()+r.slice(1));this._queueCallback(()=>{this._isTransitioning=!1,this._element.classList.remove("collapsing"),this._element.classList.add("collapse","show"),this._element.style[r]="",Va.trigger(this._element,"shown.bs.collapse")},this._element,!0),this._element.style[r]=this._element[o]+"px"}hide(){if(this._isTransitioning||!this._isShown())return;if(Va.trigger(this._element,"hide.bs.collapse").defaultPrevented)return;const e=this._getDimension();this._element.style[e]=this._element.getBoundingClientRect()[e]+"px",_a(this._element),this._element.classList.add("collapsing"),this._element.classList.remove("collapse","show");const t=this._triggerArray.length;for(let e=0;e<t;e++){const t=this._triggerArray[e],n=ha(t);n&&!this._isShown(n)&&this._addAriaAndCollapsedClass([t],!1)}this._isTransitioning=!0;this._element.style[e]="",this._queueCallback(()=>{this._isTransitioning=!1,this._element.classList.remove("collapsing"),this._element.classList.add("collapse"),Va.trigger(this._element,"hidden.bs.collapse")},this._element,!0)}_isShown(e=this._element){return e.classList.contains("show")}_getConfig(e){return(e={...hs,...ts.getDataAttributes(this._element),...e}).toggle=Boolean(e.toggle),e.parent=va(e.parent),ya("collapse",e,ms),e}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const e=ns.find(":scope .collapse .collapse",this._config.parent);ns.find('[data-bs-toggle="collapse"]',this._config.parent).filter(t=>!e.includes(t)).forEach(e=>{const t=ha(e);t&&this._addAriaAndCollapsedClass([e],this._isShown(t))})}_addAriaAndCollapsedClass(e,t){e.length&&e.forEach(e=>{t?e.classList.remove("collapsed"):e.classList.add("collapsed"),e.setAttribute("aria-expanded",t)})}static jQueryInterface(e){return this.each((function(){const t={};"string"==typeof e&&/show|hide/.test(e)&&(t.toggle=!1);const n=gs.getOrCreateInstance(this,t);if("string"==typeof e){if(void 0===n[e])throw new TypeError(`No method named "${e}"`);n[e]()}}))}}Va.on(document,"click.bs.collapse.data-api",'[data-bs-toggle="collapse"]',(function(e){("A"===e.target.tagName||e.delegateTarget&&"A"===e.delegateTarget.tagName)&&e.preventDefault();const t=da(this);ns.find(t).forEach(e=>{gs.getOrCreateInstance(e,{toggle:!1}).toggle()})})),Oa(gs);const vs=new RegExp("ArrowUp|ArrowDown|Escape"),ys=Sa()?"top-end":"top-start",bs=Sa()?"top-start":"top-end",ws=Sa()?"bottom-end":"bottom-start",Es=Sa()?"bottom-start":"bottom-end",xs=Sa()?"left-start":"right-start",_s=Sa()?"right-start":"left-start",ks={offset:[0,2],boundary:"clippingParents",reference:"toggle",display:"dynamic",popperConfig:null,autoClose:!0},Cs={offset:"(array|string|function)",boundary:"(string|element)",reference:"(string|element|object)",display:"string",popperConfig:"(null|object|function)",autoClose:"(boolean|string)"};class Ss extends Ya{constructor(e,t){super(e),this._popper=null,this._config=this._getConfig(t),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar()}static get Default(){return ks}static get DefaultType(){return Cs}static get NAME(){return"dropdown"}toggle(){return this._isShown()?this.hide():this.show()}show(){if(wa(this._element)||this._isShown(this._menu))return;const e={relatedTarget:this._element};if(Va.trigger(this._element,"show.bs.dropdown",e).defaultPrevented)return;const t=Ss.getParentFromElement(this._element);this._inNavbar?ts.setDataAttribute(this._menu,"popper","none"):this._createPopper(t),"ontouchstart"in document.documentElement&&!t.closest(".navbar-nav")&&[].concat(...document.body.children).forEach(e=>Va.on(e,"mouseover",xa)),this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add("show"),this._element.classList.add("show"),Va.trigger(this._element,"shown.bs.dropdown",e)}hide(){if(wa(this._element)||!this._isShown(this._menu))return;const e={relatedTarget:this._element};this._completeHide(e)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(e){Va.trigger(this._element,"hide.bs.dropdown",e).defaultPrevented||("ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach(e=>Va.off(e,"mouseover",xa)),this._popper&&this._popper.destroy(),this._menu.classList.remove("show"),this._element.classList.remove("show"),this._element.setAttribute("aria-expanded","false"),ts.removeDataAttribute(this._menu,"popper"),Va.trigger(this._element,"hidden.bs.dropdown",e))}_getConfig(e){if(e={...this.constructor.Default,...ts.getDataAttributes(this._element),...e},ya("dropdown",e,this.constructor.DefaultType),"object"==typeof e.reference&&!ga(e.reference)&&"function"!=typeof e.reference.getBoundingClientRect)throw new TypeError("dropdown".toUpperCase()+': Option "reference" provided type "object" without a required "getBoundingClientRect" method.');return e}_createPopper(e){if(void 0===r)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");let t=this._element;"parent"===this._config.reference?t=e:ga(this._config.reference)?t=va(this._config.reference):"object"==typeof this._config.reference&&(t=this._config.reference);const n=this._getPopperConfig(),o=n.modifiers.find(e=>"applyStyles"===e.name&&!1===e.enabled);this._popper=ca(t,this._menu,n),o&&ts.setDataAttribute(this._menu,"popper","static")}_isShown(e=this._element){return e.classList.contains("show")}_getMenuElement(){return ns.next(this._element,".dropdown-menu")[0]}_getPlacement(){const e=this._element.parentNode;if(e.classList.contains("dropend"))return xs;if(e.classList.contains("dropstart"))return _s;const t="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return e.classList.contains("dropup")?t?bs:ys:t?Es:ws}_detectNavbar(){return null!==this._element.closest(".navbar")}_getOffset(){const{offset:e}=this._config;return"string"==typeof e?e.split(",").map(e=>Number.parseInt(e,10)):"function"==typeof e?t=>e(t,this._element):e}_getPopperConfig(){const e={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return"static"===this._config.display&&(e.modifiers=[{name:"applyStyles",enabled:!1}]),{...e,..."function"==typeof this._config.popperConfig?this._config.popperConfig(e):this._config.popperConfig}}_selectMenuItem({key:e,target:t}){const n=ns.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter(ba);n.length&&La(n,t,"ArrowDown"===e,!n.includes(t)).focus()}static jQueryInterface(e){return this.each((function(){const t=Ss.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e]()}}))}static clearMenus(e){if(e&&(2===e.button||"keyup"===e.type&&"Tab"!==e.key))return;const t=ns.find('[data-bs-toggle="dropdown"]');for(let n=0,r=t.length;n<r;n++){const r=Ss.getInstance(t[n]);if(!r||!1===r._config.autoClose)continue;if(!r._isShown())continue;const o={relatedTarget:r._element};if(e){const t=e.composedPath(),n=t.includes(r._menu);if(t.includes(r._element)||"inside"===r._config.autoClose&&!n||"outside"===r._config.autoClose&&n)continue;if(r._menu.contains(e.target)&&("keyup"===e.type&&"Tab"===e.key||/input|select|option|textarea|form/i.test(e.target.tagName)))continue;"click"===e.type&&(o.clickEvent=e)}r._completeHide(o)}}static getParentFromElement(e){return ha(e)||e.parentNode}static dataApiKeydownHandler(e){if(/input|textarea/i.test(e.target.tagName)?"Space"===e.key||"Escape"!==e.key&&("ArrowDown"!==e.key&&"ArrowUp"!==e.key||e.target.closest(".dropdown-menu")):!vs.test(e.key))return;const t=this.classList.contains("show");if(!t&&"Escape"===e.key)return;if(e.preventDefault(),e.stopPropagation(),wa(this))return;const n=this.matches('[data-bs-toggle="dropdown"]')?this:ns.prev(this,'[data-bs-toggle="dropdown"]')[0],r=Ss.getOrCreateInstance(n);if("Escape"!==e.key)return"ArrowUp"===e.key||"ArrowDown"===e.key?(t||r.show(),void r._selectMenuItem(e)):void(t&&"Space"!==e.key||Ss.clearMenus());r.hide()}}Va.on(document,"keydown.bs.dropdown.data-api",'[data-bs-toggle="dropdown"]',Ss.dataApiKeydownHandler),Va.on(document,"keydown.bs.dropdown.data-api",".dropdown-menu",Ss.dataApiKeydownHandler),Va.on(document,"click.bs.dropdown.data-api",Ss.clearMenus),Va.on(document,"keyup.bs.dropdown.data-api",Ss.clearMenus),Va.on(document,"click.bs.dropdown.data-api",'[data-bs-toggle="dropdown"]',(function(e){e.preventDefault(),Ss.getOrCreateInstance(this).toggle()})),Oa(Ss);class Os{constructor(){this._element=document.body}getWidth(){const e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}hide(){const e=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,"paddingRight",t=>t+e),this._setElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top","paddingRight",t=>t+e),this._setElementAttributes(".sticky-top","marginRight",t=>t-e)}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(e,t,n){const r=this.getWidth();this._applyManipulationCallback(e,e=>{if(e!==this._element&&window.innerWidth>e.clientWidth+r)return;this._saveInitialAttribute(e,t);const o=window.getComputedStyle(e)[t];e.style[t]=n(Number.parseFloat(o))+"px"})}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,"paddingRight"),this._resetElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top","paddingRight"),this._resetElementAttributes(".sticky-top","marginRight")}_saveInitialAttribute(e,t){const n=e.style[t];n&&ts.setDataAttribute(e,t,n)}_resetElementAttributes(e,t){this._applyManipulationCallback(e,e=>{const n=ts.getDataAttribute(e,t);void 0===n?e.style.removeProperty(t):(ts.removeDataAttribute(e,t),e.style[t]=n)})}_applyManipulationCallback(e,t){ga(e)?t(e):ns.find(e,this._element).forEach(t)}isOverflowing(){return this.getWidth()>0}}const Ps={className:"modal-backdrop",isVisible:!0,isAnimated:!1,rootElement:"body",clickCallback:null},Ts={className:"string",isVisible:"boolean",isAnimated:"boolean",rootElement:"(element|string)",clickCallback:"(function|null)"};class Ls{constructor(e){this._config=this._getConfig(e),this._isAppended=!1,this._element=null}show(e){this._config.isVisible?(this._append(),this._config.isAnimated&&_a(this._getElement()),this._getElement().classList.add("show"),this._emulateAnimation(()=>{Pa(e)})):Pa(e)}hide(e){this._config.isVisible?(this._getElement().classList.remove("show"),this._emulateAnimation(()=>{this.dispose(),Pa(e)})):Pa(e)}_getElement(){if(!this._element){const e=document.createElement("div");e.className=this._config.className,this._config.isAnimated&&e.classList.add("fade"),this._element=e}return this._element}_getConfig(e){return(e={...Ps,..."object"==typeof e?e:{}}).rootElement=va(e.rootElement),ya("backdrop",e,Ts),e}_append(){this._isAppended||(this._config.rootElement.append(this._getElement()),Va.on(this._getElement(),"mousedown.bs.backdrop",()=>{Pa(this._config.clickCallback)}),this._isAppended=!0)}dispose(){this._isAppended&&(Va.off(this._element,"mousedown.bs.backdrop"),this._element.remove(),this._isAppended=!1)}_emulateAnimation(e){Ta(e,this._getElement(),this._config.isAnimated)}}const Ns={trapElement:null,autofocus:!0},Ms={trapElement:"element",autofocus:"boolean"};class js{constructor(e){this._config=this._getConfig(e),this._isActive=!1,this._lastTabNavDirection=null}activate(){const{trapElement:e,autofocus:t}=this._config;this._isActive||(t&&e.focus(),Va.off(document,".bs.focustrap"),Va.on(document,"focusin.bs.focustrap",e=>this._handleFocusin(e)),Va.on(document,"keydown.tab.bs.focustrap",e=>this._handleKeydown(e)),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,Va.off(document,".bs.focustrap"))}_handleFocusin(e){const{target:t}=e,{trapElement:n}=this._config;if(t===document||t===n||n.contains(t))return;const r=ns.focusableChildren(n);0===r.length?n.focus():"backward"===this._lastTabNavDirection?r[r.length-1].focus():r[0].focus()}_handleKeydown(e){"Tab"===e.key&&(this._lastTabNavDirection=e.shiftKey?"backward":"forward")}_getConfig(e){return e={...Ns,..."object"==typeof e?e:{}},ya("focustrap",e,Ms),e}}const Ds={backdrop:!0,keyboard:!0,focus:!0},As={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean"};class Rs extends Ya{constructor(e,t){super(e),this._config=this._getConfig(t),this._dialog=ns.findOne(".modal-dialog",this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollBar=new Os}static get Default(){return Ds}static get NAME(){return"modal"}toggle(e){return this._isShown?this.hide():this.show(e)}show(e){if(this._isShown||this._isTransitioning)return;Va.trigger(this._element,"show.bs.modal",{relatedTarget:e}).defaultPrevented||(this._isShown=!0,this._isAnimated()&&(this._isTransitioning=!0),this._scrollBar.hide(),document.body.classList.add("modal-open"),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),Va.on(this._dialog,"mousedown.dismiss.bs.modal",()=>{Va.one(this._element,"mouseup.dismiss.bs.modal",e=>{e.target===this._element&&(this._ignoreBackdropClick=!0)})}),this._showBackdrop(()=>this._showElement(e)))}hide(){if(!this._isShown||this._isTransitioning)return;if(Va.trigger(this._element,"hide.bs.modal").defaultPrevented)return;this._isShown=!1;const e=this._isAnimated();e&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),this._focustrap.deactivate(),this._element.classList.remove("show"),Va.off(this._element,"click.dismiss.bs.modal"),Va.off(this._dialog,"mousedown.dismiss.bs.modal"),this._queueCallback(()=>this._hideModal(),this._element,e)}dispose(){[window,this._dialog].forEach(e=>Va.off(e,".bs.modal")),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new Ls({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new js({trapElement:this._element})}_getConfig(e){return e={...Ds,...ts.getDataAttributes(this._element),..."object"==typeof e?e:{}},ya("modal",e,As),e}_showElement(e){const t=this._isAnimated(),n=ns.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,n&&(n.scrollTop=0),t&&_a(this._element),this._element.classList.add("show");this._queueCallback(()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,Va.trigger(this._element,"shown.bs.modal",{relatedTarget:e})},this._dialog,t)}_setEscapeEvent(){this._isShown?Va.on(this._element,"keydown.dismiss.bs.modal",e=>{this._config.keyboard&&"Escape"===e.key?(e.preventDefault(),this.hide()):this._config.keyboard||"Escape"!==e.key||this._triggerBackdropTransition()}):Va.off(this._element,"keydown.dismiss.bs.modal")}_setResizeEvent(){this._isShown?Va.on(window,"resize.bs.modal",()=>this._adjustDialog()):Va.off(window,"resize.bs.modal")}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide(()=>{document.body.classList.remove("modal-open"),this._resetAdjustments(),this._scrollBar.reset(),Va.trigger(this._element,"hidden.bs.modal")})}_showBackdrop(e){Va.on(this._element,"click.dismiss.bs.modal",e=>{this._ignoreBackdropClick?this._ignoreBackdropClick=!1:e.target===e.currentTarget&&(!0===this._config.backdrop?this.hide():"static"===this._config.backdrop&&this._triggerBackdropTransition())}),this._backdrop.show(e)}_isAnimated(){return this._element.classList.contains("fade")}_triggerBackdropTransition(){if(Va.trigger(this._element,"hidePrevented.bs.modal").defaultPrevented)return;const{classList:e,scrollHeight:t,style:n}=this._element,r=t>document.documentElement.clientHeight;!r&&"hidden"===n.overflowY||e.contains("modal-static")||(r||(n.overflowY="hidden"),e.add("modal-static"),this._queueCallback(()=>{e.remove("modal-static"),r||this._queueCallback(()=>{n.overflowY=""},this._dialog)},this._dialog),this._element.focus())}_adjustDialog(){const e=this._element.scrollHeight>document.documentElement.clientHeight,t=this._scrollBar.getWidth(),n=t>0;(!n&&e&&!Sa()||n&&!e&&Sa())&&(this._element.style.paddingLeft=t+"px"),(n&&!e&&!Sa()||!n&&e&&Sa())&&(this._element.style.paddingRight=t+"px")}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(e,t){return this.each((function(){const n=Rs.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===n[e])throw new TypeError(`No method named "${e}"`);n[e](t)}}))}}Va.on(document,"click.bs.modal.data-api",'[data-bs-toggle="modal"]',(function(e){const t=ha(this);["A","AREA"].includes(this.tagName)&&e.preventDefault(),Va.one(t,"show.bs.modal",e=>{e.defaultPrevented||Va.one(t,"hidden.bs.modal",()=>{ba(this)&&this.focus()})});const n=ns.findOne(".modal.show");n&&Rs.getInstance(n).hide();Rs.getOrCreateInstance(t).toggle(this)})),Xa(Rs),Oa(Rs);const Is={backdrop:!0,keyboard:!0,scroll:!1},zs={backdrop:"boolean",keyboard:"boolean",scroll:"boolean"};class Bs extends Ya{constructor(e,t){super(e),this._config=this._getConfig(t),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get NAME(){return"offcanvas"}static get Default(){return Is}toggle(e){return this._isShown?this.hide():this.show(e)}show(e){if(this._isShown)return;if(Va.trigger(this._element,"show.bs.offcanvas",{relatedTarget:e}).defaultPrevented)return;this._isShown=!0,this._element.style.visibility="visible",this._backdrop.show(),this._config.scroll||(new Os).hide(),this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add("show");this._queueCallback(()=>{this._config.scroll||this._focustrap.activate(),Va.trigger(this._element,"shown.bs.offcanvas",{relatedTarget:e})},this._element,!0)}hide(){if(!this._isShown)return;if(Va.trigger(this._element,"hide.bs.offcanvas").defaultPrevented)return;this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.remove("show"),this._backdrop.hide();this._queueCallback(()=>{this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._element.style.visibility="hidden",this._config.scroll||(new Os).reset(),Va.trigger(this._element,"hidden.bs.offcanvas")},this._element,!0)}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_getConfig(e){return e={...Is,...ts.getDataAttributes(this._element),..."object"==typeof e?e:{}},ya("offcanvas",e,zs),e}_initializeBackDrop(){return new Ls({className:"offcanvas-backdrop",isVisible:this._config.backdrop,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:()=>this.hide()})}_initializeFocusTrap(){return new js({trapElement:this._element})}_addEventListeners(){Va.on(this._element,"keydown.dismiss.bs.offcanvas",e=>{this._config.keyboard&&"Escape"===e.key&&this.hide()})}static jQueryInterface(e){return this.each((function(){const t=Bs.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw new TypeError(`No method named "${e}"`);t[e](this)}}))}}Va.on(document,"click.bs.offcanvas.data-api",'[data-bs-toggle="offcanvas"]',(function(e){const t=ha(this);if(["A","AREA"].includes(this.tagName)&&e.preventDefault(),wa(this))return;Va.one(t,"hidden.bs.offcanvas",()=>{ba(this)&&this.focus()});const n=ns.findOne(".offcanvas.show");n&&n!==t&&Bs.getInstance(n).hide();Bs.getOrCreateInstance(t).toggle(this)})),Va.on(window,"load.bs.offcanvas.data-api",()=>ns.find(".offcanvas.show").forEach(e=>Bs.getOrCreateInstance(e).show())),Xa(Bs),Oa(Bs);const Us=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),Hs=/^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,Fs=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,Ws=(e,t)=>{const n=e.nodeName.toLowerCase();if(t.includes(n))return!Us.has(n)||Boolean(Hs.test(e.nodeValue)||Fs.test(e.nodeValue));const r=t.filter(e=>e instanceof RegExp);for(let e=0,t=r.length;e<t;e++)if(r[e].test(n))return!0;return!1},$s={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]};function qs(e,t,n){if(!e.length)return e;if(n&&"function"==typeof n)return n(e);const r=(new window.DOMParser).parseFromString(e,"text/html"),o=[].concat(...r.body.querySelectorAll("*"));for(let e=0,n=o.length;e<n;e++){const n=o[e],r=n.nodeName.toLowerCase();if(!Object.keys(t).includes(r)){n.remove();continue}const i=[].concat(...n.attributes),a=[].concat(t["*"]||[],t[r]||[]);i.forEach(e=>{Ws(e,a)||n.removeAttribute(e.nodeName)})}return r.body.innerHTML}const Vs=new Set(["sanitize","allowList","sanitizeFn"]),Qs={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(array|string|function)",container:"(string|element|boolean)",fallbackPlacements:"array",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object|function)"},Ks={AUTO:"auto",TOP:"top",RIGHT:Sa()?"left":"right",BOTTOM:"bottom",LEFT:Sa()?"right":"left"},Ys={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:[0,0],container:!1,fallbackPlacements:["top","right","bottom","left"],boundary:"clippingParents",customClass:"",sanitize:!0,sanitizeFn:null,allowList:$s,popperConfig:null},Xs={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"};class Gs extends Ya{constructor(e,t){if(void 0===r)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");super(e),this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this._config=this._getConfig(t),this.tip=null,this._setListeners()}static get Default(){return Ys}static get NAME(){return"tooltip"}static get Event(){return Xs}static get DefaultType(){return Qs}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(e){if(this._isEnabled)if(e){const t=this._initializeOnDelegatedTarget(e);t._activeTrigger.click=!t._activeTrigger.click,t._isWithActiveTrigger()?t._enter(null,t):t._leave(null,t)}else{if(this.getTipElement().classList.contains("show"))return void this._leave(null,this);this._enter(null,this)}}dispose(){clearTimeout(this._timeout),Va.off(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.tip&&this.tip.remove(),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this.isWithContent()||!this._isEnabled)return;const e=Va.trigger(this._element,this.constructor.Event.SHOW),t=Ea(this._element),n=null===t?this._element.ownerDocument.documentElement.contains(this._element):t.contains(this._element);if(e.defaultPrevented||!n)return;"tooltip"===this.constructor.NAME&&this.tip&&this.getTitle()!==this.tip.querySelector(".tooltip-inner").innerHTML&&(this._disposePopper(),this.tip.remove(),this.tip=null);const r=this.getTipElement(),o=(e=>{do{e+=Math.floor(1e6*Math.random())}while(document.getElementById(e));return e})(this.constructor.NAME);r.setAttribute("id",o),this._element.setAttribute("aria-describedby",o),this._config.animation&&r.classList.add("fade");const i="function"==typeof this._config.placement?this._config.placement.call(this,r,this._element):this._config.placement,a=this._getAttachment(i);this._addAttachmentClass(a);const{container:s}=this._config;Ka.set(r,this.constructor.DATA_KEY,this),this._element.ownerDocument.documentElement.contains(this.tip)||(s.append(r),Va.trigger(this._element,this.constructor.Event.INSERTED)),this._popper?this._popper.update():this._popper=ca(this._element,r,this._getPopperConfig(a)),r.classList.add("show");const l=this._resolvePossibleFunction(this._config.customClass);l&&r.classList.add(...l.split(" ")),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach(e=>{Va.on(e,"mouseover",xa)});const u=this.tip.classList.contains("fade");this._queueCallback(()=>{const e=this._hoverState;this._hoverState=null,Va.trigger(this._element,this.constructor.Event.SHOWN),"out"===e&&this._leave(null,this)},this.tip,u)}hide(){if(!this._popper)return;const e=this.getTipElement();if(Va.trigger(this._element,this.constructor.Event.HIDE).defaultPrevented)return;e.classList.remove("show"),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach(e=>Va.off(e,"mouseover",xa)),this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1;const t=this.tip.classList.contains("fade");this._queueCallback(()=>{this._isWithActiveTrigger()||("show"!==this._hoverState&&e.remove(),this._cleanTipClass(),this._element.removeAttribute("aria-describedby"),Va.trigger(this._element,this.constructor.Event.HIDDEN),this._disposePopper())},this.tip,t),this._hoverState=""}update(){null!==this._popper&&this._popper.update()}isWithContent(){return Boolean(this.getTitle())}getTipElement(){if(this.tip)return this.tip;const e=document.createElement("div");e.innerHTML=this._config.template;const t=e.children[0];return this.setContent(t),t.classList.remove("fade","show"),this.tip=t,this.tip}setContent(e){this._sanitizeAndSetContent(e,this.getTitle(),".tooltip-inner")}_sanitizeAndSetContent(e,t,n){const r=ns.findOne(n,e);t||!r?this.setElementContent(r,t):r.remove()}setElementContent(e,t){if(null!==e)return ga(t)?(t=va(t),void(this._config.html?t.parentNode!==e&&(e.innerHTML="",e.append(t)):e.textContent=t.textContent)):void(this._config.html?(this._config.sanitize&&(t=qs(t,this._config.allowList,this._config.sanitizeFn)),e.innerHTML=t):e.textContent=t)}getTitle(){const e=this._element.getAttribute("data-bs-original-title")||this._config.title;return this._resolvePossibleFunction(e)}updateAttachment(e){return"right"===e?"end":"left"===e?"start":e}_initializeOnDelegatedTarget(e,t){return t||this.constructor.getOrCreateInstance(e.delegateTarget,this._getDelegateConfig())}_getOffset(){const{offset:e}=this._config;return"string"==typeof e?e.split(",").map(e=>Number.parseInt(e,10)):"function"==typeof e?t=>e(t,this._element):e}_resolvePossibleFunction(e){return"function"==typeof e?e.call(this._element):e}_getPopperConfig(e){const t={placement:e,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"onChange",enabled:!0,phase:"afterWrite",fn:e=>this._handlePopperPlacementChange(e)}],onFirstUpdate:e=>{e.options.placement!==e.placement&&this._handlePopperPlacementChange(e)}};return{...t,..."function"==typeof this._config.popperConfig?this._config.popperConfig(t):this._config.popperConfig}}_addAttachmentClass(e){this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(e)}`)}_getAttachment(e){return Ks[e.toUpperCase()]}_setListeners(){this._config.trigger.split(" ").forEach(e=>{if("click"===e)Va.on(this._element,this.constructor.Event.CLICK,this._config.selector,e=>this.toggle(e));else if("manual"!==e){const t="hover"===e?this.constructor.Event.MOUSEENTER:this.constructor.Event.FOCUSIN,n="hover"===e?this.constructor.Event.MOUSELEAVE:this.constructor.Event.FOCUSOUT;Va.on(this._element,t,this._config.selector,e=>this._enter(e)),Va.on(this._element,n,this._config.selector,e=>this._leave(e))}}),this._hideModalHandler=()=>{this._element&&this.hide()},Va.on(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this._config.selector?this._config={...this._config,trigger:"manual",selector:""}:this._fixTitle()}_fixTitle(){const e=this._element.getAttribute("title"),t=typeof this._element.getAttribute("data-bs-original-title");(e||"string"!==t)&&(this._element.setAttribute("data-bs-original-title",e||""),!e||this._element.getAttribute("aria-label")||this._element.textContent||this._element.setAttribute("aria-label",e),this._element.setAttribute("title",""))}_enter(e,t){t=this._initializeOnDelegatedTarget(e,t),e&&(t._activeTrigger["focusin"===e.type?"focus":"hover"]=!0),t.getTipElement().classList.contains("show")||"show"===t._hoverState?t._hoverState="show":(clearTimeout(t._timeout),t._hoverState="show",t._config.delay&&t._config.delay.show?t._timeout=setTimeout(()=>{"show"===t._hoverState&&t.show()},t._config.delay.show):t.show())}_leave(e,t){t=this._initializeOnDelegatedTarget(e,t),e&&(t._activeTrigger["focusout"===e.type?"focus":"hover"]=t._element.contains(e.relatedTarget)),t._isWithActiveTrigger()||(clearTimeout(t._timeout),t._hoverState="out",t._config.delay&&t._config.delay.hide?t._timeout=setTimeout(()=>{"out"===t._hoverState&&t.hide()},t._config.delay.hide):t.hide())}_isWithActiveTrigger(){for(const e in this._activeTrigger)if(this._activeTrigger[e])return!0;return!1}_getConfig(e){const t=ts.getDataAttributes(this._element);return Object.keys(t).forEach(e=>{Vs.has(e)&&delete t[e]}),(e={...this.constructor.Default,...t,..."object"==typeof e&&e?e:{}}).container=!1===e.container?document.body:va(e.container),"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),"number"==typeof e.title&&(e.title=e.title.toString()),"number"==typeof e.content&&(e.content=e.content.toString()),ya("tooltip",e,this.constructor.DefaultType),e.sanitize&&(e.template=qs(e.template,e.allowList,e.sanitizeFn)),e}_getDelegateConfig(){const e={};for(const t in this._config)this.constructor.Default[t]!==this._config[t]&&(e[t]=this._config[t]);return e}_cleanTipClass(){const e=this.getTipElement(),t=new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`,"g"),n=e.getAttribute("class").match(t);null!==n&&n.length>0&&n.map(e=>e.trim()).forEach(t=>e.classList.remove(t))}_getBasicClassPrefix(){return"bs-tooltip"}_handlePopperPlacementChange(e){const{state:t}=e;t&&(this.tip=t.elements.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(t.placement)))}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null)}static jQueryInterface(e){return this.each((function(){const t=Gs.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e]()}}))}}Oa(Gs);const Zs={...Gs.Default,placement:"right",offset:[0,8],trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'},Js={...Gs.DefaultType,content:"(string|element|function)"},el={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"};class tl extends Gs{static get Default(){return Zs}static get NAME(){return"popover"}static get Event(){return el}static get DefaultType(){return Js}isWithContent(){return this.getTitle()||this._getContent()}setContent(e){this._sanitizeAndSetContent(e,this.getTitle(),".popover-header"),this._sanitizeAndSetContent(e,this._getContent(),".popover-body")}_getContent(){return this._resolvePossibleFunction(this._config.content)}_getBasicClassPrefix(){return"bs-popover"}static jQueryInterface(e){return this.each((function(){const t=tl.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e]()}}))}}Oa(tl);const nl={offset:10,method:"auto",target:""},rl={offset:"number",method:"string",target:"(string|element)"},ol=".nav-link, .list-group-item, .dropdown-item";class il extends Ya{constructor(e,t){super(e),this._scrollElement="BODY"===this._element.tagName?window:this._element,this._config=this._getConfig(t),this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,Va.on(this._scrollElement,"scroll.bs.scrollspy",()=>this._process()),this.refresh(),this._process()}static get Default(){return nl}static get NAME(){return"scrollspy"}refresh(){const e=this._scrollElement===this._scrollElement.window?"offset":"position",t="auto"===this._config.method?e:this._config.method,n="position"===t?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight();ns.find(ol,this._config.target).map(e=>{const r=da(e),o=r?ns.findOne(r):null;if(o){const e=o.getBoundingClientRect();if(e.width||e.height)return[ts[t](o).top+n,r]}return null}).filter(e=>e).sort((e,t)=>e[0]-t[0]).forEach(e=>{this._offsets.push(e[0]),this._targets.push(e[1])})}dispose(){Va.off(this._scrollElement,".bs.scrollspy"),super.dispose()}_getConfig(e){return(e={...nl,...ts.getDataAttributes(this._element),..."object"==typeof e&&e?e:{}}).target=va(e.target)||document.documentElement,ya("scrollspy",e,rl),e}_getScrollTop(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop}_getScrollHeight(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}_getOffsetHeight(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height}_process(){const e=this._getScrollTop()+this._config.offset,t=this._getScrollHeight(),n=this._config.offset+t-this._getOffsetHeight();if(this._scrollHeight!==t&&this.refresh(),e>=n){const e=this._targets[this._targets.length-1];this._activeTarget!==e&&this._activate(e)}else{if(this._activeTarget&&e<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(let t=this._offsets.length;t--;){this._activeTarget!==this._targets[t]&&e>=this._offsets[t]&&(void 0===this._offsets[t+1]||e<this._offsets[t+1])&&this._activate(this._targets[t])}}}_activate(e){this._activeTarget=e,this._clear();const t=ol.split(",").map(t=>`${t}[data-bs-target="${e}"],${t}[href="${e}"]`),n=ns.findOne(t.join(","),this._config.target);n.classList.add("active"),n.classList.contains("dropdown-item")?ns.findOne(".dropdown-toggle",n.closest(".dropdown")).classList.add("active"):ns.parents(n,".nav, .list-group").forEach(e=>{ns.prev(e,".nav-link, .list-group-item").forEach(e=>e.classList.add("active")),ns.prev(e,".nav-item").forEach(e=>{ns.children(e,".nav-link").forEach(e=>e.classList.add("active"))})}),Va.trigger(this._scrollElement,"activate.bs.scrollspy",{relatedTarget:e})}_clear(){ns.find(ol,this._config.target).filter(e=>e.classList.contains("active")).forEach(e=>e.classList.remove("active"))}static jQueryInterface(e){return this.each((function(){const t=il.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e]()}}))}}Va.on(window,"load.bs.scrollspy.data-api",()=>{ns.find('[data-bs-spy="scroll"]').forEach(e=>new il(e))}),Oa(il);class al extends Ya{static get NAME(){return"tab"}show(){if(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains("active"))return;let e;const t=ha(this._element),n=this._element.closest(".nav, .list-group");if(n){const t="UL"===n.nodeName||"OL"===n.nodeName?":scope > li > .active":".active";e=ns.find(t,n),e=e[e.length-1]}const r=e?Va.trigger(e,"hide.bs.tab",{relatedTarget:this._element}):null;if(Va.trigger(this._element,"show.bs.tab",{relatedTarget:e}).defaultPrevented||null!==r&&r.defaultPrevented)return;this._activate(this._element,n);const o=()=>{Va.trigger(e,"hidden.bs.tab",{relatedTarget:this._element}),Va.trigger(this._element,"shown.bs.tab",{relatedTarget:e})};t?this._activate(t,t.parentNode,o):o()}_activate(e,t,n){const r=(!t||"UL"!==t.nodeName&&"OL"!==t.nodeName?ns.children(t,".active"):ns.find(":scope > li > .active",t))[0],o=n&&r&&r.classList.contains("fade"),i=()=>this._transitionComplete(e,r,n);r&&o?(r.classList.remove("show"),this._queueCallback(i,e,!0)):i()}_transitionComplete(e,t,n){if(t){t.classList.remove("active");const e=ns.findOne(":scope > .dropdown-menu .active",t.parentNode);e&&e.classList.remove("active"),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!1)}e.classList.add("active"),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!0),_a(e),e.classList.contains("fade")&&e.classList.add("show");let r=e.parentNode;if(r&&"LI"===r.nodeName&&(r=r.parentNode),r&&r.classList.contains("dropdown-menu")){const t=e.closest(".dropdown");t&&ns.find(".dropdown-toggle",t).forEach(e=>e.classList.add("active")),e.setAttribute("aria-expanded",!0)}n&&n()}static jQueryInterface(e){return this.each((function(){const t=al.getOrCreateInstance(this);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e]()}}))}}Va.on(document,"click.bs.tab.data-api",'[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',(function(e){if(["A","AREA"].includes(this.tagName)&&e.preventDefault(),wa(this))return;al.getOrCreateInstance(this).show()})),Oa(al);const sl={animation:"boolean",autohide:"boolean",delay:"number"},ll={animation:!0,autohide:!0,delay:5e3};class ul extends Ya{constructor(e,t){super(e),this._config=this._getConfig(t),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get DefaultType(){return sl}static get Default(){return ll}static get NAME(){return"toast"}show(){if(Va.trigger(this._element,"show.bs.toast").defaultPrevented)return;this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");this._element.classList.remove("hide"),_a(this._element),this._element.classList.add("show"),this._element.classList.add("showing"),this._queueCallback(()=>{this._element.classList.remove("showing"),Va.trigger(this._element,"shown.bs.toast"),this._maybeScheduleHide()},this._element,this._config.animation)}hide(){if(!this._element.classList.contains("show"))return;if(Va.trigger(this._element,"hide.bs.toast").defaultPrevented)return;this._element.classList.add("showing"),this._queueCallback(()=>{this._element.classList.add("hide"),this._element.classList.remove("showing"),this._element.classList.remove("show"),Va.trigger(this._element,"hidden.bs.toast")},this._element,this._config.animation)}dispose(){this._clearTimeout(),this._element.classList.contains("show")&&this._element.classList.remove("show"),super.dispose()}_getConfig(e){return e={...ll,...ts.getDataAttributes(this._element),..."object"==typeof e&&e?e:{}},ya("toast",e,this.constructor.DefaultType),e}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout(()=>{this.hide()},this._config.delay)))}_onInteraction(e,t){switch(e.type){case"mouseover":case"mouseout":this._hasMouseInteraction=t;break;case"focusin":case"focusout":this._hasKeyboardInteraction=t}if(t)return void this._clearTimeout();const n=e.relatedTarget;this._element===n||this._element.contains(n)||this._maybeScheduleHide()}_setListeners(){Va.on(this._element,"mouseover.bs.toast",e=>this._onInteraction(e,!0)),Va.on(this._element,"mouseout.bs.toast",e=>this._onInteraction(e,!1)),Va.on(this._element,"focusin.bs.toast",e=>this._onInteraction(e,!0)),Va.on(this._element,"focusout.bs.toast",e=>this._onInteraction(e,!1))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(e){return this.each((function(){const t=ul.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e](this)}}))}}Xa(ul),Oa(ul);n(28);var cl=function(){return i.a.createElement("div",null,i.a.createElement(yo,null),i.a.createElement("header",null,i.a.createElement("div",{className:"headercomp"},i.a.createElement(Ar,null),i.a.createElement(Er,null))),i.a.createElement(ae,null,i.a.createElement(ee,{exact:!0,path:"/",component:Ao}),i.a.createElement(ee,{exact:!0,path:"/search/:city",component:pr}),i.a.createElement(ee,{exact:!0,path:"/homes",component:vo}),i.a.createElement(ee,{exact:!0,path:"/users/:userId",component:So}),i.a.createElement(ee,{path:"/homes/:homeId",component:lo}),i.a.createElement(ee,{component:Io})),i.a.createElement(Ro,null))},fl=function(e){return i.a.createElement(_e,{store:e.store},i.a.createElement(le,null,i.a.createElement(cl,null)))};function pl(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function dl(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function hl(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?dl(Object(n),!0).forEach((function(t){pl(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):dl(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ml(e){return"Minified Redux error #"+e+"; visit https://redux.js.org/Errors?code="+e+" for the full message or use the non-minified dev environment for full errors. "}var gl="function"==typeof Symbol&&Symbol.observable||"@@observable",vl=function(){return Math.random().toString(36).substring(7).split("").join(".")},yl={INIT:"@@redux/INIT"+vl(),REPLACE:"@@redux/REPLACE"+vl(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+vl()}};function bl(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function wl(e,t,n){var r;if("function"==typeof t&&"function"==typeof n||"function"==typeof n&&"function"==typeof arguments[3])throw new Error(ml(0));if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error(ml(1));return n(wl)(e,t)}if("function"!=typeof e)throw new Error(ml(2));var o=e,i=t,a=[],s=a,l=!1;function u(){s===a&&(s=a.slice())}function c(){if(l)throw new Error(ml(3));return i}function f(e){if("function"!=typeof e)throw new Error(ml(4));if(l)throw new Error(ml(5));var t=!0;return u(),s.push(e),function(){if(t){if(l)throw new Error(ml(6));t=!1,u();var n=s.indexOf(e);s.splice(n,1),a=null}}}function p(e){if(!bl(e))throw new Error(ml(7));if(void 0===e.type)throw new Error(ml(8));if(l)throw new Error(ml(9));try{l=!0,i=o(i,e)}finally{l=!1}for(var t=a=s,n=0;n<t.length;n++){(0,t[n])()}return e}function d(e){if("function"!=typeof e)throw new Error(ml(10));o=e,p({type:yl.REPLACE})}function h(){var e,t=f;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw new Error(ml(11));function n(){e.next&&e.next(c())}return n(),{unsubscribe:t(n)}}})[gl]=function(){return this},e}return p({type:yl.INIT}),(r={dispatch:p,subscribe:f,getState:c,replaceReducer:d})[gl]=h,r}function El(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var o=t[r];0,"function"==typeof e[o]&&(n[o]=e[o])}var i,a=Object.keys(n);try{!function(e){Object.keys(e).forEach((function(t){var n=e[t];if(void 0===n(void 0,{type:yl.INIT}))throw new Error(ml(12));if(void 0===n(void 0,{type:yl.PROBE_UNKNOWN_ACTION()}))throw new Error(ml(13))}))}(n)}catch(e){i=e}return function(e,t){if(void 0===e&&(e={}),i)throw i;for(var r=!1,o={},s=0;s<a.length;s++){var l=a[s],u=n[l],c=e[l],f=u(c,t);if(void 0===f){t&&t.type;throw new Error(ml(14))}o[l]=f,r=r||f!==c}return(r=r||a.length!==Object.keys(e).length)?o:e}}function xl(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce((function(e,t){return function(){return e(t.apply(void 0,arguments))}}))}function _l(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){var n=e.apply(void 0,arguments),r=function(){throw new Error(ml(15))},o={getState:n.getState,dispatch:function(){return r.apply(void 0,arguments)}},i=t.map((function(e){return e(o)}));return r=xl.apply(void 0,i)(n.dispatch),hl(hl({},n),{},{dispatch:r})}}}function kl(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}var Cl=kl();Cl.withExtraArgument=kl;var Sl=Cl,Ol=n(13),Pl=n.n(Ol);var Tl=El({modal:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"OPEN_MODAL":return t.modal;case"CLOSE_MODAL":return null;default:return e}}});function Ll(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Nl(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Ml=El({homes:lt,reviews:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_HOME":return Object.assign({},e,t.reviews);case"RECEIVE_REVIEW":return Object.assign({},e,Nl({},t.review.id,t.review));case"RECEIVE_REVIEWS":return t.reviews;default:return e}},users:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return Object.assign({},e,Ll({},t.currentUser.id,t.currentUser));default:return e}}}),jl=Object.freeze({id:null}),Dl=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:jl,t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_CURRENT_USER":return{id:t.currentUser.id};case"LOGOUT_CURRENT_USER":return jl;default:return e}},Al=El({session:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(Object.freeze(e),t.type){case"RECEIVE_SESSION_ERRORS":return t.errors;case"RECEIVE_CURRENT_USER":return[];default:return e}}}),Rl=El({entities:Ml,session:Dl,ui:Tl,errors:Al}),Il=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return wl(Rl,e,_l(Sl,Pl.a))};document.addEventListener("DOMContentLoaded",(function(){var e,t,n,r;if(window.currentUser){var o={session:{id:window.currentUser.id},entities:{users:(t={},n=window.currentUser.id,r=window.currentUser,n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t)}};e=Il(o),delete window.currentUser}else e=Il();window.store=e;var a=document.getElementById("root");s.a.render(i.a.createElement(fl,{store:e}),a)}))}]);
//# sourceMappingURL=bundle.js.map;
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ActionCable = {});
})(this, function(exports) {
  "use strict";
  var adapters = {
    logger: self.console,
    WebSocket: self.WebSocket
  };
  var logger = {
    log: function log() {
      if (this.enabled) {
        var _adapters$logger;
        for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
          messages[_key] = arguments[_key];
        }
        messages.push(Date.now());
        (_adapters$logger = adapters.logger).log.apply(_adapters$logger, [ "[ActionCable]" ].concat(messages));
      }
    }
  };
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var now = function now() {
    return new Date().getTime();
  };
  var secondsSince = function secondsSince(time) {
    return (now() - time) / 1e3;
  };
  var clamp = function clamp(number, min, max) {
    return Math.max(min, Math.min(max, number));
  };
  var ConnectionMonitor = function() {
    function ConnectionMonitor(connection) {
      classCallCheck(this, ConnectionMonitor);
      this.visibilityDidChange = this.visibilityDidChange.bind(this);
      this.connection = connection;
      this.reconnectAttempts = 0;
    }
    ConnectionMonitor.prototype.start = function start() {
      if (!this.isRunning()) {
        this.startedAt = now();
        delete this.stoppedAt;
        this.startPolling();
        addEventListener("visibilitychange", this.visibilityDidChange);
        logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
      }
    };
    ConnectionMonitor.prototype.stop = function stop() {
      if (this.isRunning()) {
        this.stoppedAt = now();
        this.stopPolling();
        removeEventListener("visibilitychange", this.visibilityDidChange);
        logger.log("ConnectionMonitor stopped");
      }
    };
    ConnectionMonitor.prototype.isRunning = function isRunning() {
      return this.startedAt && !this.stoppedAt;
    };
    ConnectionMonitor.prototype.recordPing = function recordPing() {
      this.pingedAt = now();
    };
    ConnectionMonitor.prototype.recordConnect = function recordConnect() {
      this.reconnectAttempts = 0;
      this.recordPing();
      delete this.disconnectedAt;
      logger.log("ConnectionMonitor recorded connect");
    };
    ConnectionMonitor.prototype.recordDisconnect = function recordDisconnect() {
      this.disconnectedAt = now();
      logger.log("ConnectionMonitor recorded disconnect");
    };
    ConnectionMonitor.prototype.startPolling = function startPolling() {
      this.stopPolling();
      this.poll();
    };
    ConnectionMonitor.prototype.stopPolling = function stopPolling() {
      clearTimeout(this.pollTimeout);
    };
    ConnectionMonitor.prototype.poll = function poll() {
      var _this = this;
      this.pollTimeout = setTimeout(function() {
        _this.reconnectIfStale();
        _this.poll();
      }, this.getPollInterval());
    };
    ConnectionMonitor.prototype.getPollInterval = function getPollInterval() {
      var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
      var interval = multiplier * Math.log(this.reconnectAttempts + 1);
      return Math.round(clamp(interval, min, max) * 1e3);
    };
    ConnectionMonitor.prototype.reconnectIfStale = function reconnectIfStale() {
      if (this.connectionIsStale()) {
        logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
        this.reconnectAttempts++;
        if (this.disconnectedRecently()) {
          logger.log("ConnectionMonitor skipping reopening recent disconnect");
        } else {
          logger.log("ConnectionMonitor reopening");
          this.connection.reopen();
        }
      }
    };
    ConnectionMonitor.prototype.connectionIsStale = function connectionIsStale() {
      return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
    };
    ConnectionMonitor.prototype.disconnectedRecently = function disconnectedRecently() {
      return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
    };
    ConnectionMonitor.prototype.visibilityDidChange = function visibilityDidChange() {
      var _this2 = this;
      if (document.visibilityState === "visible") {
        setTimeout(function() {
          if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
            logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
            _this2.connection.reopen();
          }
        }, 200);
      }
    };
    return ConnectionMonitor;
  }();
  ConnectionMonitor.pollInterval = {
    min: 3,
    max: 30,
    multiplier: 5
  };
  ConnectionMonitor.staleThreshold = 6;
  var INTERNAL = {
    message_types: {
      welcome: "welcome",
      disconnect: "disconnect",
      ping: "ping",
      confirmation: "confirm_subscription",
      rejection: "reject_subscription"
    },
    disconnect_reasons: {
      unauthorized: "unauthorized",
      invalid_request: "invalid_request",
      server_restart: "server_restart"
    },
    default_mount_path: "/cable",
    protocols: [ "actioncable-v1-json", "actioncable-unsupported" ]
  };
  var message_types = INTERNAL.message_types, protocols = INTERNAL.protocols;
  var supportedProtocols = protocols.slice(0, protocols.length - 1);
  var indexOf = [].indexOf;
  var Connection = function() {
    function Connection(consumer) {
      classCallCheck(this, Connection);
      this.open = this.open.bind(this);
      this.consumer = consumer;
      this.subscriptions = this.consumer.subscriptions;
      this.monitor = new ConnectionMonitor(this);
      this.disconnected = true;
    }
    Connection.prototype.send = function send(data) {
      if (this.isOpen()) {
        this.webSocket.send(JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    };
    Connection.prototype.open = function open() {
      if (this.isActive()) {
        logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
        return false;
      } else {
        logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols);
        if (this.webSocket) {
          this.uninstallEventHandlers();
        }
        this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
        this.installEventHandlers();
        this.monitor.start();
        return true;
      }
    };
    Connection.prototype.close = function close() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        allowReconnect: true
      }, allowReconnect = _ref.allowReconnect;
      if (!allowReconnect) {
        this.monitor.stop();
      }
      if (this.isActive()) {
        return this.webSocket.close();
      }
    };
    Connection.prototype.reopen = function reopen() {
      logger.log("Reopening WebSocket, current state is " + this.getState());
      if (this.isActive()) {
        try {
          return this.close();
        } catch (error) {
          logger.log("Failed to reopen WebSocket", error);
        } finally {
          logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
          setTimeout(this.open, this.constructor.reopenDelay);
        }
      } else {
        return this.open();
      }
    };
    Connection.prototype.getProtocol = function getProtocol() {
      if (this.webSocket) {
        return this.webSocket.protocol;
      }
    };
    Connection.prototype.isOpen = function isOpen() {
      return this.isState("open");
    };
    Connection.prototype.isActive = function isActive() {
      return this.isState("open", "connecting");
    };
    Connection.prototype.isProtocolSupported = function isProtocolSupported() {
      return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
    };
    Connection.prototype.isState = function isState() {
      for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
        states[_key] = arguments[_key];
      }
      return indexOf.call(states, this.getState()) >= 0;
    };
    Connection.prototype.getState = function getState() {
      if (this.webSocket) {
        for (var state in adapters.WebSocket) {
          if (adapters.WebSocket[state] === this.webSocket.readyState) {
            return state.toLowerCase();
          }
        }
      }
      return null;
    };
    Connection.prototype.installEventHandlers = function installEventHandlers() {
      for (var eventName in this.events) {
        var handler = this.events[eventName].bind(this);
        this.webSocket["on" + eventName] = handler;
      }
    };
    Connection.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
      for (var eventName in this.events) {
        this.webSocket["on" + eventName] = function() {};
      }
    };
    return Connection;
  }();
  Connection.reopenDelay = 500;
  Connection.prototype.events = {
    message: function message(event) {
      if (!this.isProtocolSupported()) {
        return;
      }
      var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
      switch (type) {
       case message_types.welcome:
        this.monitor.recordConnect();
        return this.subscriptions.reload();

       case message_types.disconnect:
        logger.log("Disconnecting. Reason: " + reason);
        return this.close({
          allowReconnect: reconnect
        });

       case message_types.ping:
        return this.monitor.recordPing();

       case message_types.confirmation:
        return this.subscriptions.notify(identifier, "connected");

       case message_types.rejection:
        return this.subscriptions.reject(identifier);

       default:
        return this.subscriptions.notify(identifier, "received", message);
      }
    },
    open: function open() {
      logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
      this.disconnected = false;
      if (!this.isProtocolSupported()) {
        logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
        return this.close({
          allowReconnect: false
        });
      }
    },
    close: function close(event) {
      logger.log("WebSocket onclose event");
      if (this.disconnected) {
        return;
      }
      this.disconnected = true;
      this.monitor.recordDisconnect();
      return this.subscriptions.notifyAll("disconnected", {
        willAttemptReconnect: this.monitor.isRunning()
      });
    },
    error: function error() {
      logger.log("WebSocket onerror event");
    }
  };
  var extend = function extend(object, properties) {
    if (properties != null) {
      for (var key in properties) {
        var value = properties[key];
        object[key] = value;
      }
    }
    return object;
  };
  var Subscription = function() {
    function Subscription(consumer) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mixin = arguments[2];
      classCallCheck(this, Subscription);
      this.consumer = consumer;
      this.identifier = JSON.stringify(params);
      extend(this, mixin);
    }
    Subscription.prototype.perform = function perform(action) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      data.action = action;
      return this.send(data);
    };
    Subscription.prototype.send = function send(data) {
      return this.consumer.send({
        command: "message",
        identifier: this.identifier,
        data: JSON.stringify(data)
      });
    };
    Subscription.prototype.unsubscribe = function unsubscribe() {
      return this.consumer.subscriptions.remove(this);
    };
    return Subscription;
  }();
  var Subscriptions = function() {
    function Subscriptions(consumer) {
      classCallCheck(this, Subscriptions);
      this.consumer = consumer;
      this.subscriptions = [];
    }
    Subscriptions.prototype.create = function create(channelName, mixin) {
      var channel = channelName;
      var params = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
        channel: channel
      };
      var subscription = new Subscription(this.consumer, params, mixin);
      return this.add(subscription);
    };
    Subscriptions.prototype.add = function add(subscription) {
      this.subscriptions.push(subscription);
      this.consumer.ensureActiveConnection();
      this.notify(subscription, "initialized");
      this.sendCommand(subscription, "subscribe");
      return subscription;
    };
    Subscriptions.prototype.remove = function remove(subscription) {
      this.forget(subscription);
      if (!this.findAll(subscription.identifier).length) {
        this.sendCommand(subscription, "unsubscribe");
      }
      return subscription;
    };
    Subscriptions.prototype.reject = function reject(identifier) {
      var _this = this;
      return this.findAll(identifier).map(function(subscription) {
        _this.forget(subscription);
        _this.notify(subscription, "rejected");
        return subscription;
      });
    };
    Subscriptions.prototype.forget = function forget(subscription) {
      this.subscriptions = this.subscriptions.filter(function(s) {
        return s !== subscription;
      });
      return subscription;
    };
    Subscriptions.prototype.findAll = function findAll(identifier) {
      return this.subscriptions.filter(function(s) {
        return s.identifier === identifier;
      });
    };
    Subscriptions.prototype.reload = function reload() {
      var _this2 = this;
      return this.subscriptions.map(function(subscription) {
        return _this2.sendCommand(subscription, "subscribe");
      });
    };
    Subscriptions.prototype.notifyAll = function notifyAll(callbackName) {
      var _this3 = this;
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return this.subscriptions.map(function(subscription) {
        return _this3.notify.apply(_this3, [ subscription, callbackName ].concat(args));
      });
    };
    Subscriptions.prototype.notify = function notify(subscription, callbackName) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }
      var subscriptions = void 0;
      if (typeof subscription === "string") {
        subscriptions = this.findAll(subscription);
      } else {
        subscriptions = [ subscription ];
      }
      return subscriptions.map(function(subscription) {
        return typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : undefined;
      });
    };
    Subscriptions.prototype.sendCommand = function sendCommand(subscription, command) {
      var identifier = subscription.identifier;
      return this.consumer.send({
        command: command,
        identifier: identifier
      });
    };
    return Subscriptions;
  }();
  var Consumer = function() {
    function Consumer(url) {
      classCallCheck(this, Consumer);
      this._url = url;
      this.subscriptions = new Subscriptions(this);
      this.connection = new Connection(this);
    }
    Consumer.prototype.send = function send(data) {
      return this.connection.send(data);
    };
    Consumer.prototype.connect = function connect() {
      return this.connection.open();
    };
    Consumer.prototype.disconnect = function disconnect() {
      return this.connection.close({
        allowReconnect: false
      });
    };
    Consumer.prototype.ensureActiveConnection = function ensureActiveConnection() {
      if (!this.connection.isActive()) {
        return this.connection.open();
      }
    };
    createClass(Consumer, [ {
      key: "url",
      get: function get$$1() {
        return createWebSocketURL(this._url);
      }
    } ]);
    return Consumer;
  }();
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      var a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  function createConsumer() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getConfig("url") || INTERNAL.default_mount_path;
    return new Consumer(url);
  }
  function getConfig(name) {
    var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
    if (element) {
      return element.getAttribute("content");
    }
  }
  exports.Connection = Connection;
  exports.ConnectionMonitor = ConnectionMonitor;
  exports.Consumer = Consumer;
  exports.INTERNAL = INTERNAL;
  exports.Subscription = Subscription;
  exports.Subscriptions = Subscriptions;
  exports.adapters = adapters;
  exports.createWebSocketURL = createWebSocketURL;
  exports.logger = logger;
  exports.createConsumer = createConsumer;
  exports.getConfig = getConfig;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//


;
