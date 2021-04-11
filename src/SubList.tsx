import React from 'react'
import FolderIcon from '@material-ui/icons/Folder'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import MdIcon from '@material-ui/icons/Description';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Skeleton from '@material-ui/lab/Skeleton'
import { useTheme } from '@material-ui/core/styles'

import { Folder } from './template'

interface Props {
    indent?: number
    folder: Folder
    fresh: () => void
}

function flatten2d(arr: JSX.Element[][]) {
    let result = [] as JSX.Element[]
    for (var i = 0; i < arr.length; i++) {
        result = result.concat(arr[i])
    }
    return result
}

function isMarkdown(name: string) {
    if(name.length >= 3 && name.slice(name.length - 3, name.length) === '.md') {
        return true
    } else {
        return false
    }
}

export default function SubList(props: Props) {
    const theme = useTheme()
    const indent = props.indent ? props.indent : 2
    const f = props.folder

    const [opens, setOpens] = React.useState(
        Array(typeof (f.folders) === 'function' ? 0 : f.folders.length).fill(false) as boolean[]
    )

    function handleClick(index: number) {
        setOpens(opens.map((value, i) => index === i ? !value : value))
    }

    if (typeof (f.folders) === 'function') {
        f.folders(f, (folders, files) => {
            f.folders = folders
            f.files = files
            props.fresh()
        })
        return (
            <List component="div" disablePadding>
                <ListItem button style={{ paddingLeft: theme.spacing(indent) }}>
                    <Skeleton variant="text" width={300} height={30} />
                </ListItem>
            </List>
        )
    } else {
        return (
            <List component="div" disablePadding>
                {
                    flatten2d(f.folders.map((folder, index) => [
                        <ListItem button
                            onClick={() => handleClick(index)}
                            key={index}
                            style={{ paddingLeft: theme.spacing(indent) }}>
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                            <ListItemText primary={folder.name} />
                            {opens[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>,
                        <Collapse key={f.folders.length + index} in={opens[index]} timeout="auto" unmountOnExit>
                            <SubList indent={indent + 4} folder={folder} fresh={props.fresh} />
                        </Collapse>
                    ]))
                }
                {
                    f.files.map((file, index) => (
                        <ListItem button key={2 * f.folders.length + index} style={{ paddingLeft: theme.spacing(indent) }}>
                            <ListItemIcon>
                                { isMarkdown(file.name) ? <MdIcon /> : <FileIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))
                }
            </List>
        )
    }
}