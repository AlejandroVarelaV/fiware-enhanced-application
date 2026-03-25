"""Store API routes."""

from flask import Blueprint, current_app, jsonify, request


store_bp = Blueprint('stores', __name__, url_prefix='/api/stores')


@store_bp.route('', methods=['POST'])
def create_store():
    payload = request.get_json(silent=True)
    store = current_app.store_service.create(payload)
    return jsonify(store), 201


@store_bp.route('', methods=['GET'])
def list_stores():
    stores = current_app.store_service.list()
    return jsonify(stores), 200


@store_bp.route('/<store_id>', methods=['GET'])
def get_store(store_id):
    store = current_app.store_service.get(store_id)
    return jsonify(store), 200


@store_bp.route('/<store_id>', methods=['PATCH'])
def update_store(store_id):
    payload = request.get_json(silent=True)
    store = current_app.store_service.update(store_id, payload)
    return jsonify(store), 200


@store_bp.route('/<store_id>', methods=['DELETE'])
def delete_store(store_id):
    current_app.store_service.delete(store_id)
    return '', 204
