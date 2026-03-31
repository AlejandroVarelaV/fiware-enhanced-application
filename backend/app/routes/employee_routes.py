"""Employee API routes."""

from flask import Blueprint, current_app, jsonify, request


employee_bp = Blueprint('employees', __name__, url_prefix='/api/employees')


@employee_bp.route('', methods=['POST'])
def create_employee():
    payload = request.get_json(silent=True)
    employee = current_app.employee_service.create(payload)
    return jsonify(employee), 201


@employee_bp.route('', methods=['GET'])
def list_employees():
    employees = current_app.employee_service.list()
    return jsonify(employees), 200


@employee_bp.route('/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    employee = current_app.employee_service.get(employee_id)
    return jsonify(employee), 200


@employee_bp.route('/<employee_id>', methods=['PATCH'])
def update_employee(employee_id):
    payload = request.get_json(silent=True)
    employee = current_app.employee_service.update(employee_id, payload)
    return jsonify(employee), 200


@employee_bp.route('/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    current_app.employee_service.delete(employee_id)
    return '', 204
