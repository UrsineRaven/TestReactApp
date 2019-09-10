import React from 'react';
import { useState } from 'react';
import './Home.css';
import Table from 'react-bootstrap/Table';

const testData = [
  { time: '12:34', event: '#1', id: '123' },
  { time: '16:30', event: 'test', id: '235' },
  { time: '17:24', event: 'meal', id: '332' }
];

function Row(props) {
  return (
    <tr>
      <td>{props.time}</td>
      <td>{props.event}</td>
      <td className="btn-col">
        <button className="text-danger symbol" onClick={props.onDelete}>
          <span>&times;</span>
        </button>
      </td>
    </tr>
  );
}

function Home() {
  const [rows, setRows] = useState(testData);

  function handleDelete(id) {
    let resultRows = rows.slice();
    for (var i = 0; i < resultRows.length; i++) {
      if (resultRows[i].id === id) {
        resultRows.splice(i, 1);
      }
    }
    setRows(resultRows);
  }

  const tableRows = rows.map(row => {
    return (
      <Row
        time={row.time}
        event={row.event}
        onDelete={() => handleDelete(row.id)}
        key={row.id}
      />
    );
  });

  return (
    <div>
      <h2>Home</h2>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th className="col-auto">Time</th>
            <th className="col">Event</th>
            <th className="symbol col-1">&times;</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </div>
  );
}

export default Home;
