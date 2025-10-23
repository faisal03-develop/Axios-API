import React from 'react'
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

const Search = ({ searchTerm, onSearchChange }) => {
  return (
    <>
      <div id="search">
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <FormControl variant="standard" sx={{ minWidth: 300 }}>
            <InputLabel htmlFor="input-with-icon-adornment">
              Search Posts
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </div>
    </>
  )
}

export default Search