import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TeamForm from '../TeamForm/TeamForm'

export default function AlertDialog(props) {

  return (
    <div>
      <Dialog
        open={props.dialog}
        onClose={props.handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <TeamForm handleDialogClose={props.handleDialogClose}/>
        </DialogContent>

      </Dialog>
    </div>
  );
}
