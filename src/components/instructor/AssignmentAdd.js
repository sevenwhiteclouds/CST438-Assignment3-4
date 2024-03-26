import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// complete the code.
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    const [newAssignment, setNewAssignment] = useState(null);

    useEffect(() => {
        // don't do anything if it's first time
        if (newAssignment !== null) {
            props.save(newAssignment);
            close();
        }
    }, [newAssignment]);


    function save() {
        if (newTitle === null || newDate === null) {
            setMessage('Title or date cannot be empty');
        } else if (newTitle.trim().length === 0 || newDate.trim().length === 0) {
            setMessage('Title or date cannot be empty');
        } else if (newTitle.trim().length > 45) {
            setMessage('Title cannot be more than 45 characters');
        } else if (newDate.trim().length !== 'YYYY-MM-DD'.length) {
            setMessage('Incomplete date');
        } else {
            setNewAssignment({
                ...props.assignment,
                title: newTitle.trim(),
                dueDate: newDate.trim(),
            });
        }
    }

    function close() {
        setMessage('');
        setNewTitle('');
        setNewDate('');
        setOpen(false);
    }

    return (
        <>
          <Button onClick={() => setOpen(true)}>Add Assignment</Button>

          <Dialog open={open}>
            <DialogTitle>Add Assignment</DialogTitle>

            <DialogContent style={{paddingTop: 20}}>
                <h4>{message}</h4>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            onChange={e => setNewTitle(e.target.value)}
                        />

                        <DatePicker
                            label="Due Date"
                            onChange={e => setNewDate(dayjs(e.toString()).format('YYYY-MM-DD'))}
                        />
                    </DemoContainer>
                </LocalizationProvider>
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