export function copyToClipboard(text) {
    if (text === "") return;
    var ipt = document.createElement('input'); // maybe you need to change `input` to `textarea`
    ipt.setAttribute(
        'style',
        'position:absolute;z-index:-1;width:1px;height:1px;top:-1px;opacity:0;-webkit-user-select: text;'
    )
    document.body.appendChild(ipt)
    ipt.value = text
    // ipt.select()
    if (/iphone|ipad|ios/.test(navigator.userAgent.toLowerCase())) {
        var oldContentEditable = ipt.contentEditable
        var oldReadOnly = ipt.readOnly
        var range = document.createRange()

        ipt.contentEditable = true
        ipt.readOnly = false
        range.selectNodeContents(ipt)

        var s = window.getSelection()
        s.removeAllRanges()
        s.addRange(range)

        ipt.setSelectionRange(0, 999999) // A big number, to cover anything that could be inside the element.

        ipt.contentEditable = oldContentEditable
        ipt.readOnly = oldReadOnly
    } else {
        ipt.select()
    }
    window.document.execCommand('Copy')
    ipt.blur()
    document.body.removeChild(ipt)
    ipt = null
}