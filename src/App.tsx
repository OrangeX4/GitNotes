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

import SubList from './SubList'

import { Folder } from './template'

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

const folder = {
    name: 'root',
    parent: null,
    folders: [],
    files: []
} as Folder

folder.folders = [
    {
        name: 'Folders 1',
        parent: folder,
        folders: [],
        files: []
    } as Folder,
    {
        name: 'Folders 2',
        parent: folder,
        folders: (f, callback) => {
            setTimeout(() => {
                callback([], [
                    {
                        name: 'File 1',
                        parent: f
                    },
                    {
                        name: 'File 2',
                        parent: f
                    },
                ])
            }, 1000)
        },
        files: []
    } as Folder,
]

folder.files = [
    {
        name: 'File.md',
        parent: folder
    },
    {
        name: 'File 2',
        parent: folder
    },
]

folder.folders[0].folders = [
    {
        name: 'Folders 1',
        parent: folder.folders[0],
        folders: [],
        files: []
    } as Folder,
    {
        name: 'Folders 2',
        parent: folder.folders[0],
        folders: [],
        files: []
    } as Folder,
]

export default function ResponsiveDrawer(props: Props) {
    const { window } = props
    const classes = useStyles()
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

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
            <SubList folder={folder} fresh={fresh} />
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
                        标题
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
                <Typography paragraph>
                    Hello everyone. I am Fang Shengjun.
                    Today I would like to talk with you a popular book.
                    Before the start, you can scan the QR code, and you will get the handout of my presentation.
                    I’m worried that I can’t express myself well, but I believe that you can know what I am saying with the handout.
                    Are you ready?
                    Let us start the presentation.
                </Typography>
            </main>
        </div>
    )
}