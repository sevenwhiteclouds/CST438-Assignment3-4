import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// complete the code.
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

// TODO 1: update duedate field to a picker and not a textfield
const AssignmentAdd = (props)  => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [newAssignment, setNewAssignment] = useState({
        id: 0,
        secId: 0,
        secNo: 0,
        courseId: '',
        title: '', 
        dueDate: '',
    });

    function openFlagTrue() {
        setOpen(true);
    }

    // TODO 2: after todo 1 is done, check for correct range date
    function save() {
        if (newAssignment.title === null) {
            setMessage('Title cannot be empty');
        } else if (newAssignment.title.trim().length === 0) {
            setMessage('Title cannot be empty');
        } else if (newAssignment.title.trim().length > 45) {
            setMessage('Title cannot be more than 45 characters');
        } else {
            props.save(newAssignment);
            close();
        }
    }

    function close() {
        setMessage('');
        setNewAssignment({
            id: 0,
            secId: 0,
            secNo: 0,
            courseId: '',
            title: '', 
            dueDate: '',
        });

        setOpen(false);
    }

    function changes(event) {
        setNewAssignment({...newAssignment, [event.target.name]:event.target.value});
    }

    return (
        <>
          <Button onClick={openFlagTrue}>Add Assignment</Button>

          <Dialog open={open}>
            <DialogTitle>Add Assignment</DialogTitle>

            <DialogContent style={{paddingTop: 20}}>
                <h4>{message}</h4>
                <TextField style={{padding:10}} fullWidth label="Title" name="title"  onChange={changes}/>
                <TextField style={{padding:10}} fullWidth label="Due Date" name="dueDate" onChange={changes}/>
            </DialogContent>

            <DialogActions>
                <Button color='primary' onClick={save}>Save</Button>
                <Button color='secondary' onClick={close}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
    )
}

export default AssignmentAdd;
