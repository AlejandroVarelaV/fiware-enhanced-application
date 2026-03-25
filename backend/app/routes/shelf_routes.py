"""Shelf API routes."""

from flask import Blueprint, current_app, jsonify, request


shelf_bp = Blueprint('shelves', __name__, url_prefix='/api/shelves')


@shelf_bp.route('', methods=['POST'])
def create_shelf():
    payload = request.get_json(silent=True)
    shelf = current_app.shelf_service.create(payload)
    return jsonify(shelf), 201


@shelf_bp.route('', methods=['GET'])
def list_shelves():
    shelves = current_app.shelf_service.list()
    return jsonify(shelves), 200


@shelf_bp.route('/<shelf_id>', methods=['GET'])
def get_shelf(shelf_id):
    shelf = current_app.shelf_service.get(shelf_id)
    return jsonify(shelf), 200


@shelf_bp.route('/<shelf_id>', methods=['PATCH'])
def update_shelf(shelf_id):
    payload = request.get_json(silent=True)
    shelf = current_app.shelf_service.update(shelf_id, payload)
    return jsonify(shelf), 200


@shelf_bp.route('/<shelf_id>', methods=['DELETE'])
def delete_shelf(shelf_id):
    current_app.shelf_service.delete(shelf_id)
    return '', 204
