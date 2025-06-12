document.getElementById('matrix-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
  
    fetch('/generate-matrix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rows, cols })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        displayMatrix(data.matrix, 'matrix-output', 'Generated Matrix:');
        displayOperationForm(data.matrix);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  
  function displayMatrix(matrix, outputElementId, title) {
    const matrixOutput = document.getElementById(outputElementId);
    let table = `<h2>${title}</h2><table>`;
  
    matrix.forEach(row => {
      table += '<tr>';
      row.forEach(cell => {
        table += `<td>${cell}</td>`;
      });
      table += '</tr>';
    });
  
    table += '</table>';
    matrixOutput.innerHTML = table;
  }
  
  function displayOperationForm(matrix) {
    const operationFormContainer = document.getElementById('operation-form-container');
    operationFormContainer.innerHTML = `
      <h2>Perform Operation:</h2>
      <form id="operation-form">
        <label for="operation">Operation:</label>
        <select id="operation" name="operation">
          <option value="transpose">Transpose</option>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
        </select>
        <label for="second-rows">Second Matrix Rows (for add, subtract, multiply):</label>
        <input type="number" id="second-rows" name="second_rows">
        <label for="second-cols">Second Matrix Columns (for add, subtract, multiply):</label>
        <input type="number" id="second-cols" name="second_cols">
        <button type="button" id="generate-second-matrix">Generate Second Matrix</button>
        <div id="second-matrix-output"></div>
        <button type="submit">Perform Operation</button>
      </form>
      <div id="operation-output"></div>
    `;
  
    document.getElementById('generate-second-matrix').addEventListener('click', function() {
      const secondRows = document.getElementById('second-rows').value;
      const secondCols = document.getElementById('second-cols').value;
  
      fetch('/generate-matrix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows: secondRows, cols: secondCols })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          displayMatrix(data.matrix, 'second-matrix-output', 'Second Matrix:');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  
    document.getElementById('operation-form').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const operation = document.getElementById('operation').value;
      let secondMatrix = [];
  
      if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
        const secondMatrixPre = document.querySelector('#second-matrix-output table');
        secondMatrix = Array.from(secondMatrixPre.rows).map(row => 
          Array.from(row.cells).map(cell => parseInt(cell.textContent))
        );
      }
  
      fetch('/perform-operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matrix, operation, second_matrix: secondMatrix })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          displayMatrix(data.result, 'operation-output', 'Operation Result:');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }
  
  function displayMatrix(matrix, outputElementId, title) {
    const matrixOutput = document.getElementById(outputElementId);
    let table = `<h2>${title}</h2><table>`;
  
    matrix.forEach(row => {
      table += '<tr>';
      row.forEach(cell => {
        table += `<td>${cell}</td>`;
      });
      table += '</tr>';
    });
  
    table += '</table>';
    matrixOutput.innerHTML = table;
  }
  