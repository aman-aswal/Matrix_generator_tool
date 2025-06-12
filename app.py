from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-matrix', methods=['POST'])
def generate_matrix():
    data = request.json
    rows = int(data['rows'])
    cols = int(data['cols'])

    matrix = np.random.randint(0, 100, size=(rows, cols)).tolist()
    return jsonify({'matrix': matrix})

@app.route('/perform-operation', methods=['POST'])
def perform_operation():
    data = request.json
    matrix = np.array(data['matrix'])
    operation = data['operation']

    try:
        if operation == 'transpose':
            result = matrix.T.tolist()
        elif operation == 'add':
            second_matrix = np.array(data['second_matrix'])
            result = (matrix + second_matrix).tolist()
        elif operation == 'subtract':
            second_matrix = np.array(data['second_matrix'])
            result = (matrix - second_matrix).tolist()
        elif operation == 'multiply':
            second_matrix = np.array(data['second_matrix'])
            result = np.dot(matrix, second_matrix).tolist()
        else:
            result = {'error': 'Invalid operation'}

        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
