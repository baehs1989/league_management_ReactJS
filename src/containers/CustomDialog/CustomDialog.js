import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export default function CustomDialog(props) {
    const {open} = props

    const handleClose = () => {
        props.onClose()
    }

    return (
        <div>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.context}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.buttons.button1.func} color="primary">
                    {props.buttons.button1.text}
                </Button>
                <Button onClick={props.buttons.button2.func} color="primary" autoFocus>
                    {props.buttons.button2.text}
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}
