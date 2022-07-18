import { useRef } from "react"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login() {
    const userRef = useRef('');

    return (
        <div>
            <TextField
                        autoFocus
                        margin="dense"
                        id="outlined-name"
                        label="Username"
                        inputRef={userRef}
                        type="text"
                        variant="outlined"
                    />
            <Button>Login</Button>
        </div>
    )
}