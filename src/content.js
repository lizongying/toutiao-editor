class Editor {

    constructor() {
        Editor.editor = null
        this.observerEditor()
    }

    init() {
        const editor = Editor.editor
        let textarea = document.querySelector('#textarea')
        if (!textarea) {
            textarea = document.createElement('textarea')
            textarea.id = 'textarea'
            textarea.placeholder = '请输入Markdown'
            textarea.style.minHeight = '100px'
            textarea.style.width = '100%'
            textarea.style.border = 'none'
            textarea.style.resize = 'none'
            textarea.style.outline = 'none'
            textarea.style.fontFamily = 'PingFang SC, Arial, Hiragino Sans GB, WenQuanYi Micro Hei, Helvetica Neue, sans-serif'
            textarea.style.color = '#222'
            textarea.style.fontSize = '18px'
            textarea.style.caretColor = 'auto'
            textarea.style.borderBottom = '1px solid rgb(232, 232, 232)'
            document.querySelector('.publish-editor-title-wrapper').appendChild(textarea)
        }
        textarea.addEventListener('input', () => {
            if (editor) {
                while (editor.childElementCount > 0) {
                    editor.removeChild(editor.firstChild)
                }
                let tag = null
                textarea.value.split('\n').forEach((v) => {
                    if (v.trim()) {
                        let r = v.match(/(^#{1,6})\s(.*)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                            } else {
                                this.addTitle(r)
                            }

                            return
                        }

                        r = v.match(/(^[-_*]{3,})\s*$/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                            } else {
                                this.addLine()
                            }

                            return
                        }

                        r = v.match(/(^!*)\[([^\]]+)]\(([^)]+)\)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                            } else {
                                if (r[1] === '!') {
                                    this.addImg(r)
                                } else {
                                    this.addLink(r)
                                }
                            }

                            return
                        }

                        r = v.match(/^>\s(.*)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                                return
                            }

                            if (tag !== null && tag.tagName === 'BLOCKQUOTE') {
                                this.addQ(r[1], tag)
                            } else {
                                tag = this.addQuote()
                                this.addQ(r[1], tag)
                            }

                            return
                        }

                        r = v.match(/^[-+*]\s(.*)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                                return
                            }

                            if (tag !== null && tag.tagName === 'UL') {
                                this.addLi(r[1], tag)
                            } else {
                                tag = this.addUl()
                                this.addLi(r[1], tag)
                            }
                            return
                        }

                        r = v.match(/^\d+\.\s(.*)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                this.addCode(v, tag)
                                return
                            }

                            if (tag !== null && tag.tagName === 'OL') {
                                this.addLi(r[1], tag)
                            } else {
                                tag = this.addOl()
                                this.addLi(r[1], tag)
                            }
                            return
                        }

                        r = v.match(/(^`+)/)
                        if (r) {
                            if (tag !== null && tag.tagName === 'PRE') {
                                tag = null
                            } else {
                                tag = this.addPre()
                            }
                            return
                        }

                        if (tag !== null && tag.tagName === 'PRE') {
                            this.addCode(v, tag)
                        } else {
                            this.addP(v)
                        }
                    }
                })
            }
        })
        Editor.textarea = textarea
    }

    observerEditor() {
        const editor = document.querySelector('.ProseMirror')
        if (editor) {
            Editor.editor = editor
            this.init()
        }
        let timeoutId
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const editor = document.querySelector('.ProseMirror')
                    if (editor && editor !== Editor.editor) {
                        Editor.editor = editor
                        clearTimeout(timeoutId)
                        this.init()
                    }
                    return
                }
            }
        })

        observer.observe(document, {
            childList: true,
            subtree: true
        })
    }

    addTitle(r) {
        const el = document.createElement(`h${r[1].length}`)
        el.innerText = r[2]
        Editor.editor.appendChild(el)
    }

    addUl() {
        const el = document.createElement(`ul`)
        Editor.editor.appendChild(el)
        return el
    }

    addOl() {
        const el = document.createElement(`ol`)
        Editor.editor.appendChild(el)
        return el
    }

    addLi(r, parent) {
        const el = document.createElement(`li`)
        el.innerText = r
        parent.appendChild(el)
    }

    addPre() {
        const el = document.createElement(`pre`)
        Editor.editor.appendChild(el)
        return el
    }

    addCode(r, parent) {
        parent.innerText += `${r}\n`
    }

    addP(r) {
        const el = document.createElement('p')

        let r1 = ''
        let index = 0
        let matches = [...r.matchAll(/(\s*[_*~]{1,2})([^_*~]+)([_*~]{1,2})(\s*)/g)]
        matches.forEach(match => {
            if (match[3].length === 1) {
                const el1 = document.createElement(match[3] === '~' ? 'u' : 'em')
                el1.innerText = match[2]
                r1 += r.slice(index, match.index + match[1].length - match[3].length) + el1.outerHTML + r.slice(match.index + match[0].length - match[4].length, match.index + match[0].length)
                index += match.index + match[0].length
            }
            if (match[3].length === 2) {
                const el1 = document.createElement(match[3] === '~~' ? 's' : 'strong')
                el1.innerText = match[2]
                r1 += r.slice(index, match.index + match[1].length - match[3].length) + el1.outerHTML + r.slice(match.index + match[0].length - match[4].length, match.index + match[0].length)
                index += match.index + match[0].length
            }
        })

        r1 += r.slice(index)

        el.innerHTML = r1
        Editor.editor.appendChild(el)
    }

    addLine() {
        const el = document.createElement(`hr`)
        Editor.editor.appendChild(el)
    }

    addQuote() {
        const el = document.createElement(`blockquote`)
        Editor.editor.appendChild(el)
        return el
    }

    addQ(r, parent) {
        const el = document.createElement(`p`)
        el.innerText = r
        parent.appendChild(el)
    }

    addLink(r) {
        const el = document.createElement(`a`)
        el.innerText = r[2]
        el.href = r[3]
        Editor.editor.appendChild(el)
    }

    addImg(r) {
        const el = document.createElement(`img`)
        el.alt = r[2]
        el.src = r[3]
        Editor.editor.appendChild(el)
    }
}

new Editor()
