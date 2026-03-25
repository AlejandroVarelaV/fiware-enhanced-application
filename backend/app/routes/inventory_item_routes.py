"""InventoryItem API routes."""

from flask import Blueprint, current_app, jsonify, request


inventory_item_bp = Blueprint('inventory_items', __name__, url_prefix='/api/inventory-items')


@inventory_item_bp.route('', methods=['POST'])
def create_inventory_item():
    payload = request.get_json(silent=True)
    inventory_item = current_app.inventory_item_service.create(payload)
    return jsonify(inventory_item), 201


@inventory_item_bp.route('', methods=['GET'])
def list_inventory_items():
    inventory_items = current_app.inventory_item_service.list()
    return jsonify(inventory_items), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['GET'])
def get_inventory_item(inventory_item_id):
    inventory_item = current_app.inventory_item_service.get(inventory_item_id)
    return jsonify(inventory_item), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['PATCH'])
def update_inventory_item(inventory_item_id):
    payload = request.get_json(silent=True)
    inventory_item = current_app.inventory_item_service.update(inventory_item_id, payload)
    return jsonify(inventory_item), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['DELETE'])
def delete_inventory_item(inventory_item_id):
    current_app.inventory_item_service.delete(inventory_item_id)
    return '', 204
