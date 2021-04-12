import React from 'react'
import { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'

import './App.css'

import SubList from './SubList'

import { Folder, File } from './template'

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
)

interface Props {
}

function isMarkdown(name: string) {
    if (name.length >= 3 && name.slice(name.length - 3, name.length) === '.md') {
        return true
    } else {
        return false
    }
}

function getPath(folder: Folder): string {
    if (folder.parent) {
        return getPath(folder.parent) + folder.name + '/'
    } else {
        return ''
    }
}

function getFolderData(folder: Folder, callback: (folders: Folder[], files: File[]) => void) {
    const query = getQuery()
    const folders = [] as Folder[]
    const files = [] as File[]
    const request = new XMLHttpRequest()
    let url = ''
    if (query.git === 'gitlab') {
        url = `https://${query.gitlab}/api/v4/projects/${query.id}/repository/tree?per_page=1000&ref=master&path=${encodeURI(getPath(folder))}`
    } else {
        url = `https://api.github.com/repos/${query.github}/contents/${encodeURI(getPath(folder))}${query.token ? `?access_token=${query.token}` : ''}`
    }
    request.open('GET', url)
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            const tree = JSON.parse(request.responseText)
            tree.forEach((item: any) => {
                if (query.git === 'gitlab' ? item.type === 'tree' : item.type === 'dir') {
                    folders.push({
                        name: item.name,
                        parent: folder,
                        folders: getFolderData,
                        files: []
                    })
                } else if (query.git === 'gitlab' ? item.type === 'blob' : item.type === 'file') {
                    files.push({
                        name: item.name,
                        parent: folder
                    })
                }
            })
            callback(folders, files)
        }
    }
    request.send(null)
}

const folder = {
    name: 'root',
    parent: null,
    folders: getFolderData,
    files: []
} as Folder

const hljs = require('highlight.js')
const md = require('markdown-it')({
    html: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>'
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    }
})
const mk = require('@iktakahiro/markdown-it-katex')
md.use(mk, {
    throwOnError: false,
    errorColor: "#cc0000",
})


function contentProcess(content: string, file: File | null): string {
    if (file) {
        const query = getQuery()
        let preUrl = ''
        let aftUrl = ''
        if (query.git === 'gitlab') {
            preUrl = `https://${query.gitlab}/api/v4/projects/${query.id}/repository/files/`
            aftUrl = '/raw?ref=master'
        } else {
            preUrl = `https://raw.githubusercontent.com/${query.github}/master/`
            aftUrl = ''
        }

        // Markdown Image
        const mdExpression = /!\[([\u4e00-\u9fa5a-z0-9-_/. ]*)\]\((\.\/)?([\u4e00-\u9fa5a-z0-9-_/. ]*)\)/g
        let start = 0
        let newContent = ''
        let array
        while ((array = mdExpression.exec(content)) !== null) {
            newContent += content.slice(start, mdExpression.lastIndex - array[0].length)
            newContent += `![${array[1]}](${preUrl}${query.git === 'gitlab' ?
                encodeURI(getPath(file.parent) + array[3]).replace(/\//g, '%2F') :
                encodeURI(getPath(file.parent) + array[3])
                }${aftUrl})`
            start = mdExpression.lastIndex
        }
        newContent += content.slice(start, content.length)
        content = newContent
        
        // Html Image
        const imgExpression = /<img +src="([\u4e00-\u9fa5a-z0-9-_/. ]*)"([^>]*)>/g
        start = 0
        newContent = ''
        while ((array = imgExpression.exec(content)) !== null) {
            newContent += content.slice(start, imgExpression.lastIndex - array[0].length)
            newContent += `<img src="${preUrl}${query.git === 'gitlab' ?
                encodeURI(getPath(file.parent) + array[1]).replace(/\//g, '%2F') :
                encodeURI(getPath(file.parent) + array[1])
                }${aftUrl}"${array[2]}>`
            start = imgExpression.lastIndex
        }
        newContent += content.slice(start, content.length)
        content = newContent
    }
    return content.replace(/\$ +/g, '$').replace(/ +\$/g, '$')
}

interface Query {
    [key: string]: string
}

function getQuery(): Query {
    const result = {} as Query
    if (window.location.search.length > 1) {
        const query = window.location.search.substring(1)
        const vars = query.split("&")
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=")
            result[pair[0]] = pair[1]
        }
    }
    if (result.git !== 'github' && result.git !== 'gitlab') {
        result.git = 'github'
    }
    if (result.git === 'gitlab') {
        if (!result.gitlab) {
            result.gitlab = 'git.nju.edu.cn'
            result.id = '2047'
        }
    } else {
        if (!result.github) {
            result.github = 'OrangeX4/NJUAI-Notes'
        }
    }
    return result
}


export default function App(props: Props) {
    const classes = useStyles()
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = React.useState(false)

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    function handleFileClick(file: File) {
        const query = getQuery()
        let preUrl = ''
        let aftUrl = ''
        if (query.git === 'gitlab') {
            preUrl = `https://${query.gitlab}/api/v4/projects/${query.id}/repository/files/`
            aftUrl = '/raw?ref=master'
        } else {
            preUrl = `https://raw.githubusercontent.com/${query.github}/master/`
            aftUrl = ''
        }
        const url = `${preUrl}${query.git === 'gitlab' ?
            encodeURI(getPath(file.parent) + file.name).replace(/\//g, '%2F') :
            encodeURI(getPath(file.parent) + file.name)
            }${aftUrl}`
        if (!isMarkdown(file.name)) {
            console.log(window.location.search)
            window.open(url, '_blank')
            return
        }
        const request = new XMLHttpRequest()
        request.open('GET', url)
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                setCurrentFile(file)
                setTitle(file.name)
                setContent(request.responseText)
            }
        }
        request.send(null)
    }

    // Load README.md
    function handleLoad(files: File[]) {
        files.forEach((file) => {
            if (file.name === 'README.md') {
                handleFileClick(file)
            }
        })
    }

    const [currentFile, setCurrentFile] = useState(null as File | null)
    const [title, setTitle] = useState('标题')
    const [content, setContent] = useState('# 请选择一个 Markdown 文件打开')

    const [freshCount, setFreshCount] = useState(0)
    const fresh = () => setFreshCount(freshCount + 1)

    const drawer = (
        <div>
            <div className={classes.toolbar} style={{ color: '#303030', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                <MenuIcon style={{ marginRight: 30 }} />
                <Typography variant="h6" noWrap>
                    目录
                </Typography>
            </div>
            <Divider />
            <SubList folder={folder} fresh={fresh} onClick={handleFileClick} onLoad={handleLoad} />
        </div>
    )

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} color='default'>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div dangerouslySetInnerHTML={{ __html: md.render(contentProcess(content, currentFile)) }} />
            </main>
        </div>
    )
}