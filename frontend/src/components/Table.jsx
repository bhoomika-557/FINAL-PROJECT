import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export default function TableComponent({ rows, columns }) {
  const navigate = useNavigate()
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              columns.map((col, index) => (
                <TableCell key={col+index}>{ col.label }</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,i) => (
            <TableRow
              key={row.name+i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {
                columns.map((col, index) => (
                  col.isClickable ?  <TableCell  key={col.key+index} align="left" onClick={() => navigate('/books/'+row[col.key])}>
                    <Link align="left" className='cursor-pointer' >{row[col.key]}</Link>
                </TableCell>: 
                <TableCell  key={col.key+index} align="left">{row[col.key]}</TableCell>
              ))
            }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}