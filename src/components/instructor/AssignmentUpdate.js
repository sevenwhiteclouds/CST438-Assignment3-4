import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');

    const [assignment, setAssignment] = useState(null);

    useEffect(() => {
        // don't do anything if it's first time
        if (assignment !== null) {
            props.save(assignment);
            onClose();
        }
    }, [assignment]);

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
            // TODO: change backend response for when out of date range
            setAssignment({
                ...props.assignment,
                title: newTitle.trim(),
                dueDate: newDate.trim(),
            });
        }
    }

    function onClose() {
        setMessage('');
        setNewTitle('');
        setNewDate('');
        setOpen(false);
    }

    function onOpen() {
        setNewTitle(props.assignment.title);
        setNewDate(props.assignment.dueDate);
        setOpen(true);
    }

    return (
        <>
          <Button onClick={onOpen}>Edit</Button>

          <Dialog open={open}>
            <DialogTitle>Edit Assignment</DialogTitle>

            <DialogContent style={{paddingTop: 20}}>
                <h4>{message}</h4>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <TextField 
                            fullWidth
                            label="Title"
                            name="title"
                            defaultValue={props.assignment.title}
                            onChange={e => setNewTitle(e.target.value)}
                        />

                        <DatePicker
                            label="Due Date"
                            defaultValue={(dayjs(props.assignment.dueDate))}
                            onChange={e => setNewDate(dayjs(e.toString()).format('YYYY-MM-DD'))}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions>
                <Button color='primary' onClick={save}>Save</Button>
                <Button color='secondary' onClick={onClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
    )
}

export default AssignmentUpdate;
