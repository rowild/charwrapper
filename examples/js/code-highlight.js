(function () {
  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function token(type, value) {
    return '<span class="code-token-' + type + '">' + value + '</span>';
  }

  function highlight(code) {
    let html = escapeHtml(code);

    const placeholders = [];
    const stash = (type, value) => {
      const key = '\uE000' + String.fromCharCode(0xE100 + placeholders.length) + '\uE001';
      placeholders.push({ key, value: token(type, value) });
      return key;
    };

    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, match => stash('comment', match));
    html = html.replace(/(\/\/[^\n]*)/g, match => stash('comment', match));
    html = html.replace(/(`[^`]*`|'[^'\n]*'|"[^"\n]*")/g, match => stash('string', match));
    html = html.replace(/(\/\[[^\n]+?\]\/[gimsuy]*)/g, match => stash('regex', match));

    html = html.replace(/(&lt;\/?)([A-Za-z][\w-]*)/g, function (_, open, name) {
      return open + stash('tag', name);
    });

    html = html.replace(/(\s)([A-Za-z_:][\w:.-]*)(=)/g, function (_, space, name, equals) {
      return space + stash('attr', name) + equals;
    });

    html = html.replace(/\b(const|let|var|function|return|if|else|new|true|false|null|undefined)\b/g, function (match) {
      return stash('keyword', match);
    });

    html = html.replace(/\b([A-Za-z_$][\w$]*)(?=\()/g, function (match) {
      return stash('function', match);
    });

    html = html.replace(/(\b\d+(?:\.\d+)?\b)/g, function (match) {
      return stash('number', match);
    });

    html = html.replace(/([\w$]+)(?=\s*:)/g, function (match) {
      return stash('property', match);
    });

    placeholders.forEach(item => {
      html = html.split(item.key).join(item.value);
    });

    return html;
  }

  window.renderExampleCode = function renderExampleCode(elementOrId, code) {
    const element = typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

    if (!element) return;

    element.innerHTML = highlight(code);
  };
})();
