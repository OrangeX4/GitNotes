let content = 'test\n![](./image/2021-04-12-11-02-45.png)\n test';

const preUrl = 'https://git.nju.edu.cn/api/v4/projects/2047/repository/files/'
const aftUrl = '/raw?ref=master'
const expression = /!\[([\u4e00-\u9fa5a-z0-9-_/. ]*)\]\((\.\/)?([\u4e00-\u9fa5a-z0-9-_/. ]*)\)/g

let start = 0
let newContent = ''
let array
while ((array = expression.exec(content)) !== null) {
    console.log(array)
    newContent += content.slice(start, expression.lastIndex - array[0].length)
    console.log(newContent)
    newContent += `![${array[1]}](${preUrl}${encodeURI('root/' + array[3])}${aftUrl})`
    console.log(newContent)
    start = expression.lastIndex
}
newContent += content.slice(start, content.length)
content = newContent
console.log(content)