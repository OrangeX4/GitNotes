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
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window
}

function getPath(folder: Folder): string {
    if (folder.parent) {
        return getPath(folder.parent) + folder.name + '/'
    } else {
        return ''
    }
}

function getFolderData(folder: Folder, callback: (folders: Folder[], files: File[]) => void) {
    const folders = [] as Folder[]
    const files = [] as File[]
    const request = new XMLHttpRequest()
    const url = 'https://git.nju.edu.cn/api/v4/projects/2047/repository/tree?per_page=1000&ref=master&path=' + encodeURI(getPath(folder))
    request.open('GET', url)
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            const tree = JSON.parse(request.responseText)
            tree.forEach((item: any) => {
                if (item.type === 'tree') {
                    folders.push({
                        name: item.name,
                        parent: folder,
                        folders: getFolderData,
                        files: []
                    })
                } else if (item.type === 'blob') {
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
        const preUrl = 'https://git.nju.edu.cn/api/v4/projects/2047/repository/files/'
        const aftUrl = '/raw?ref=master'
        const expression = /!\[([\u4e00-\u9fa5a-z0-9-_/. ]*)\]\((\.\/)?([\u4e00-\u9fa5a-z0-9-_/. ]*)\)/g

        let start = 0
        let newContent = ''
        let array
        while ((array = expression.exec(content)) !== null) {
            newContent += content.slice(start, expression.lastIndex - array[0].length)
            newContent += `![${array[1]}](${preUrl}${encodeURI(getPath(file.parent) + array[3]).replace(/\//g, '%2F')}${aftUrl})`
            start = expression.lastIndex
        }
        newContent += content.slice(start, content.length)
        content = newContent
    }
    return content
}

export default function App(props: Props) {
    const { window } = props
    const classes = useStyles()
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = React.useState(false)

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    function handleFileClick(file: File) {
        const request = new XMLHttpRequest()
        const url = 'https://git.nju.edu.cn/api/v4/projects/2047/repository/files/' + encodeURI(getPath(file.parent) + file.name).replace(/\//g, '%2F') + '/raw?ref=master'
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

    const container = window !== undefined ? () => window().document.body : undefined

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
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
                        container={container}
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