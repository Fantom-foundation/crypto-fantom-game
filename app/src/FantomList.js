import React from "react";

export default ({ fantoms, uriBase }) => (
  <table>
    <thead>
      <th>Id</th>
      <th>Generation</th>
      <th>Gene A</th>
      <th>Gene B</th>
      <th>Pic</th>
    </thead>
    <tbody>
      {fantoms.map(fantom => (
        <tr key={fantom.id}>
          <td>{fantom.id}</td>
          <td>{fantom.generation}</td>
          <td>{fantom.geneA}</td>
          <td>{fantom.geneB}</td>
          <td>
            <img
              style={{width: "50px", height: "50px"}}
              src={`${uriBase}/images/${fantom.id}.png`}
              alt={`${fantom.id}`}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
