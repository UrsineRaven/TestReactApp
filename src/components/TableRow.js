import React from 'react';
import '../styles/Table.css';

/**
 * Returns one row of a table for an event.
 * @param {Object} props - Properties for the TableRow
 * @param {boolean} props.noDate - set true to not render the Date column
 * @param {boolean} props.noBtn - set true to not render the delete button column
 * @param {string} props.formatting - JSON serialization of Object containing the properties for the row (e.g. className, style, etc)
 * @param {string} props.date - date of the event
 * @param {string} props.time - time of the event
 * @param {string} props.event - name of the event
 * @param {string} [props.timeSince] - time since the event occurred
 * @param {(evt:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void} props.onDelete - function to run when the delete button is clicked
 */
function TableRow(props) {
  return (
    <tr {...(props.formatting && JSON.parse(props.formatting))}>
      {!props.noDate && <td className="small-col">{props.date}</td>}
      <td className="small-col">{props.time}</td>
      <td className="big-col">{props.event}</td>
      {!props.noBtn && (
        <td className="btn-col">
          {props.time !== '' && ( // if there's no time, it's probably the placeholder row, so don't render the button
            <button className="text-danger symbol" onClick={props.onDelete}>
              <span>&times;</span>
            </button>
          )}
        </td>
      )}
      {props.timeSince && <td className="small-col">{props.timeSince}</td>}
    </tr>
  );
}

export default TableRow;
