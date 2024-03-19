import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

// TODO 1: update duedate field to a picker and not a textfield
const AssignmentUpdate = (props)  => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [assignment, updateAssignment] = useState({
        id: props.assignment.id,
        secId: props.assignment.secId,
        secNo: props.assignment.secNo,
        courseId:props.assignment.courseId,
        title: '', 
        dueDate: '',
    });

    function openFlagTrue() {
        setOpen(true);
    }

    // TODO 2: after todo 1 is done, check for correct range date
    function save() {
        if (assignment.title === null) {
            setMessage('Title cannot be empty');
        } else if (assignment.title.trim().length === 0) {
            setMessage('Title cannot be empty');
        } else if (assignment.title.trim().length > 45) {
            setMessage('Title cannot be more than 45 characters');
        } else {
            props.save(assignment);
            close();
        }
    }

    function close() {
        updateAssignment({...assignment, title: '', dueDate: ''});
        setMessage('');
        setOpen(false);
    }
    
    function changes(event) {
        updateAssignment({...assignment, [event.target.name]:event.target.value});
    }

    return (
        <>
          <Button onClick={openFlagTrue}>Edit</Button>

          <Dialog open={open}>
            <DialogTitle>Edit Assignment</DialogTitle>

            <DialogContent style={{paddingTop: 20}}>
                <h4>{message}</h4>
                <TextField style={{padding:10}} fullWidth label="Title" name="title" value={assignment.title} onChange={changes}/> 
                <TextField style={{padding:10}} fullWidth label="Due Date" name="dueDate" value={assignment.dueDate} onChange={changes}/> 
            </DialogContent>

            <DialogActions>
                <Button color='primary' onClick={save}>Save</Button>
                <Button color='secondary' onClick={close}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
    )
}

export default AssignmentUpdate;
